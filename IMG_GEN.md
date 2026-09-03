# Bike images

Every bike on the site is a manufacturer studio photo with the background removed,
placed on one shared canvas so the whole set reads as a single shoot. This is how
to add another one.

Two scripts do the work:

|                         |                                                 |
| ----------------------- | ----------------------------------------------- |
| `scripts/img/setup.sh`  | installs the Python environment. Run once.      |
| `scripts/img/cutout.py` | cuts one photo out and places it on the canvas. |

## Setup

```bash
./scripts/img/setup.sh
```

Creates `.venv-img/` in the repo (gitignored) and installs `rembg`, `onnxruntime`
and `pillow`. Re-running it is safe.

The background-removal models download on first use into `~/.u2net/`. The default,
`birefnet-general`, is about 1 GB. That download is the only time anything touches
the network: the model then runs locally on your CPU, and the script pins
`CPUExecutionProvider` so nothing is sent anywhere.

If `pip` fails with an SSL error behind a corporate root certificate, export
`PIP_CERT=/path/to/your/keychain-export.pem` and run it again.

## Adding a bike image

Find the manufacturer's own studio side profile. **Source width matters more than
anything else you can do later**: the bike itself needs to be about 1400 px wide,
because it gets scaled to 1410. Anything under roughly 1100 px upscales visibly
and looks soft next to the rest of the set. The script warns when it has to
upscale by more than 1.25x.

```bash
# a normal studio photo, on a white or plain backdrop
.venv-img/bin/python scripts/img/cutout.py photo.jpg ktm-890-adventure-r/left

# a source that already has an alpha channel: skip the model entirely
.venv-img/bin/python scripts/img/cutout.py studio.png honda-crf300l/right --transparent

# write a magenta-backed check image alongside it
.venv-img/bin/python scripts/img/cutout.py photo.jpg ktm-790-adventure/right --preview
```

Output goes to `public/bikes/<slug>/<side>.webp`. Sides are `left`, `right` or
`front`.

### Two views from different shoots

When a bike's two sides come from different photo sessions, one usually carries a
colour cast and the pair looks like two different motorcycles. `--match` corrects
the new image against one already in the set:

```bash
.venv-img/bin/python scripts/img/cutout.py photo.jpg <slug>/right --match <slug>/left
```

It measures each image's grey point, the mean of its neutral mid-tones, and
applies a per-channel gain. No offset term: an offset fits the highlights better
but lifts the shadows, which on the HP2 turned a blue frame violet.

It corrects a cast and nothing else. If a part is genuinely a different shade
between two shoots, it stays different, because repainting the subject would
misrepresent the bike.

**Off by default, and worth checking before you keep it.** On the HP2 it
neutralised the bodywork but the pair still did not match, because the frame blue
differs between the two shoots for reasons white balance cannot touch. Correcting
half the difference can look worse than leaving the shot as the photographer
graded it. Compare both and keep whichever actually reads better.

**Always check a cutout with `--preview`.** It writes a copy on magenta into
`.img-preview/` (gitignored). Magenta should show through only where the bike is
genuinely see-through: between spokes, through a drilled brake disc, gaps in the
frame. Magenta over bodywork means the model half-cut the bike.

Then register the view in `src/data/photos.ts`, with a `source` URL and the
`credit` for the rights holder. The footer claims every photograph is a
manufacturer image credited on its bike, so a photo with no traceable source
should not go in.

## Which side is which

A bike photographed with its **front pointing left** is showing you its **left**
side. Check against a known bike rather than reasoning about it: the Husqvarna 701
puts both the chain and the silencer on the left, so `701/left.webp` shows both.

## Checking the whole set

```bash
.venv-img/bin/python scripts/img/cutout.py --audit
```

Reports, for every shipped image, the gap under the tyres, how far off centre the
bike sits, and what fraction of the mask is neither solid nor clear.

- **bottom** should be 38 for all of them. That is the shared baseline; it is why
  the wheels do not jump when you switch bikes or views.
- **h-off** should be within about 1.5 px of zero.
- **soft** is normally 1-4%: anti-aliased outer edges and the gaps between spokes.
  Much above 6% usually means the mask half-cut some bodywork.

## Why it is built this way

**`birefnet-general`, not `isnet-general-use`.** isnet cannot commit on white
bodywork against a white backdrop and returns a soft mask, which leaves white
tanks, bash plates and mudguards semi-transparent. On the Tenere 700 World Raid,
isnet gave the white shroud alpha 223 where birefnet gives 254. The site's dark
panel shows that as the bike being partly eaten. birefnet is slower and the model
is five times the size; it is worth both.

**The bounding box is measured on alpha above 128, not above zero.** Several
manufacturer PNGs ship a soft drop shadow under the wheels. Measured from any
non-zero alpha, that shadow joins the bike's bounding box, which pushes the bike
off centre and lifts it off the baseline. The worst case was 237 px off centre.

**Images save with `alpha_quality=100`.** Lossy alpha moves faint edge pixels
across the 128 threshold, so the measured bounding box drifts every time an image
is re-encoded, and the baseline drifts with it.

**Bikes sit on a baseline, not centred.** Centring puts a tall bike lower than a
short one, so the wheels move as you switch between them.
