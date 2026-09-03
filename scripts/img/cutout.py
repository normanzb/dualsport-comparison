#!/usr/bin/env python
"""
Turn a manufacturer studio shot into a bike image this site can use.

Cuts the background out, then places the bike on the shared canvas so every bike
sits at the same scale with its tyres on the same line.

    ./scripts/img/cutout.py photo.jpg ktm-890-adventure-r/left
    ./scripts/img/cutout.py studio.png honda-crf300l/right --transparent
    ./scripts/img/cutout.py --audit

Run scripts/img/setup.sh first.
"""

import argparse
import glob
import os
import sys

from PIL import Image

REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT_DIR = os.path.join(REPO, "public", "bikes")

# The shared canvas. Bikes fit inside MAX_W x MAX_H and sit BOTTOM_GAP above the
# bottom edge, so switching bikes or views does not make the wheels jump.
CANVAS_W, CANVAS_H = 1600, 960
MAX_W, MAX_H = 1410, 885
BOTTOM_GAP = 38

# Alpha above this is the bike. Deliberately well clear of a soft drop shadow,
# which would otherwise widen the bounding box and shift the bike off centre.
BODY_ALPHA = 128
# Crop this far outside the body so anti-aliased edges are not clipped.
PAD = 8

# birefnet-general, not isnet-general-use: isnet cannot commit on white bodywork
# against a white backdrop and returns a soft mask, which leaves white tanks and
# bash plates semi-transparent. birefnet returns 254 where isnet returned 223.
DEFAULT_MODEL = "birefnet-general"


def cut(img, model):
    """Remove the background. Pinned to CPU: nothing leaves this machine."""
    from rembg import new_session, remove

    return remove(img.convert("RGB"), session=new_session(model, providers=["CPUExecutionProvider"]))


def grey_point(img):
    """Mean of the bike's neutral mid-tones: its bodywork grey, near enough."""
    import numpy as np

    a = np.asarray(img.getchannel("A"))
    px = np.asarray(img.convert("RGB"), dtype=float)[a > 200]
    lum = px.mean(axis=1)
    neutral = px[(lum > 90) & (lum < 170) & (px.max(axis=1) - px.min(axis=1) < 25)]
    if len(neutral) < 200:
        raise SystemExit("not enough neutral mid-tone to colour match against")
    return neutral.mean(axis=0)


def match_colour(img, ref_path):
    """Correct a colour cast by matching this shot's grey point to another's.

    Per-channel gain with no offset, so black stays black. An offset term fits
    the highlights better but lifts the shadows, which turned a blue frame
    violet. Only the cast is corrected: if a part is genuinely a different shade
    between two shoots, it stays different, because repainting the subject would
    misrepresent the bike.
    """
    import numpy as np

    ref = Image.open(ref_path).convert("RGBA")
    gain = grey_point(ref) / grey_point(img)
    rgb = np.asarray(img.convert("RGB"), dtype=float) * gain
    corrected = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8))
    return Image.merge("RGBA", (*corrected.split(), img.getchannel("A"))), gain


def place(img):
    """Scale to the shared canvas and sit the bike on the baseline."""
    alpha = img.getchannel("A")
    body = alpha.point(lambda p: 255 if p > BODY_ALPHA else 0).getbbox()
    if body is None:
        raise SystemExit("no bike found: the image is fully transparent")
    bx0, by0, bx1, by1 = body

    cx0, cy0 = max(0, bx0 - PAD), max(0, by0 - PAD)
    cx1, cy1 = min(img.width, bx1 + PAD), min(img.height, by1 + PAD)
    img = img.crop((cx0, cy0, cx1, cy1))

    bw, bh = bx1 - bx0, by1 - by0
    scale = min(MAX_W / bw, MAX_H / bh)
    img = img.resize((round(img.width * scale), round(img.height * scale)), Image.LANCZOS)

    # where the body sits inside the padded crop, after scaling
    ox, oy = (bx0 - cx0) * scale, (by0 - cy0) * scale
    canvas = Image.new("RGBA", (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    canvas.paste(
        img,
        (round((CANVAS_W - bw * scale) / 2 - ox), round(CANVAS_H - BOTTOM_GAP - bh * scale - oy)),
        img,
    )
    return canvas, round(bw * scale), round(bh * scale), round(scale, 3)


def save(canvas, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    # alpha_quality=100: lossy alpha nudges the bounding box on every re-encode,
    # which makes the baseline drift if an image is ever processed twice.
    canvas.save(path, "WEBP", quality=90, alpha_quality=100, method=6)


def preview(path, target):
    """Magenta-backed copy. Anything the model wrongly cut shows up bright pink.

    Written outside public/ so a check image can never ship with the site.
    """
    img = Image.open(path).convert("RGBA")
    bg = Image.new("RGB", img.size, (255, 0, 180))
    bg.paste(img, (0, 0), img)
    out = os.path.join(REPO, ".img-preview", target.replace("/", "_") + ".png")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    bg.save(out)
    return out


def audit():
    """Check every shipped image for alignment and for a soft, half-cut mask."""
    rows = []
    for path in sorted(glob.glob(os.path.join(OUT_DIR, "*", "*.webp"))):
        img = Image.open(path).convert("RGBA")
        alpha = img.getchannel("A")
        x0, y0, x1, y1 = alpha.point(lambda p: 255 if p > BODY_ALPHA else 0).getbbox()
        data = list(alpha.crop((x0, y0, x1, y1)).getdata())
        rows.append(
            {
                "name": os.path.relpath(path, OUT_DIR),
                "bottom": img.height - y1,
                "offset": ((x0 + x1) / 2) - img.width / 2,
                "soft": 100 * sum(1 for p in data if 20 < p < 235) / len(data),
            }
        )
    rows.sort(key=lambda r: -r["soft"])
    print(f"{'image':46s} {'bottom':>7s} {'h-off':>7s} {'soft':>7s}")
    for r in rows:
        print(f"{r['name']:46s} {r['bottom']:7d} {r['offset']:+7.1f} {r['soft']:6.1f}%")
    print(
        f"\n{len(rows)} images | bottom {min(r['bottom'] for r in rows)}"
        f"-{max(r['bottom'] for r in rows)} (target {BOTTOM_GAP})"
        f" | max offset {max(abs(r['offset']) for r in rows):.1f}px"
    )
    print("soft above ~6% usually means the mask half-cut some bodywork: check the preview.")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("source", nargs="?", help="studio photo to process")
    ap.add_argument("target", nargs="?", help="slug/side, e.g. ktm-890-adventure-r/left")
    ap.add_argument("--transparent", action="store_true", help="source already has alpha; skip the model")
    ap.add_argument("--model", default=DEFAULT_MODEL, help=f"rembg model (default {DEFAULT_MODEL})")
    ap.add_argument("--preview", action="store_true", help="also write a magenta-backed .preview.png")
    ap.add_argument(
        "--match",
        metavar="SLUG/SIDE",
        help="correct a colour cast by matching this shot's grey point to an existing image",
    )
    ap.add_argument("--audit", action="store_true", help="report alignment and mask quality, change nothing")
    args = ap.parse_args()

    if args.audit:
        return audit()
    if not args.source or not args.target:
        ap.error("give a source and a slug/side, or use --audit")

    img = Image.open(args.source)
    img = img.convert("RGBA") if args.transparent else cut(img, args.model).convert("RGBA")

    if args.match:
        img, gain = match_colour(img, os.path.join(OUT_DIR, args.match + ".webp"))
        print(f"colour matched to {args.match}: gain {tuple(round(g, 3) for g in gain)}")

    canvas, w, h, scale = place(img)
    dest = os.path.join(OUT_DIR, args.target + ".webp")
    save(canvas, dest)
    print(f"{os.path.relpath(dest, REPO)}  bike {w}x{h}  scale {scale}x")
    if scale > 1.25:
        print(f"  warning: upscaled {scale}x. Under ~1400px wide the result looks soft.")
    if args.preview:
        print("  preview:", os.path.relpath(preview(dest, args.target), REPO))
    print("\nRemember to register the view in src/data/photos.ts.")


if __name__ == "__main__":
    sys.exit(main())
