# Dualsport motorcycle side by side (UK market)

One page comparing 14 dual sport and enduro motorcycles. Next.js App Router, no runtime data fetching.

```bash
pnpm i
pnpm dev     # http://localhost:3000
pnpm build
```

## Shape of the page

Title, then the table, then a single detail panel underneath. The panel starts empty (a question mark) and grows into the selected bike; clearing collapses it again. Selection lives in `Explorer.tsx`, which also owns the height animation; everything below it is presentational.

## Deploying to GitHub Pages

`.github/workflows/pages.yaml` builds on every push to `main` and publishes to Pages. It lints first, so a lint failure blocks the deploy.

**One manual step before the first run:** in the repo, Settings > Pages > Build and deployment > Source, choose **GitHub Actions**. Without it the workflow builds and then fails at the deploy step.

The site lands at `https://<user>.github.io/<repo>/`.

### Why the base path matters

Pages serves a project repo from a subdirectory, so the build needs `basePath`. The workflow derives it from the repo name (`NEXT_PUBLIC_BASE_PATH=/${GITHUB_REPOSITORY#*/}`) and local dev leaves it empty, so `pnpm dev` still runs at `/`.

Next rewrites most URLs for you, but not all, and the gaps are silent:

- **`next/image` skips `basePath` entirely once `images.unoptimized` is set**, which static export requires. Photo sources therefore go through `asset()` from `src/lib/base-path.ts`. Without it every bike photo 404s while the rest of the page looks fine.
- **URLs built inside a style attribute are never rewritten.** The logo masks go through `asset()` for the same reason.

So any new hand-written asset URL needs `asset()`. To check a change before pushing, build with a base path and serve it from a matching subdirectory:

```bash
NEXT_PUBLIC_BASE_PATH=/dualsport-comparison pnpm build
mkdir -p /tmp/pages/dualsport-comparison && cp -R out/. /tmp/pages/dualsport-comparison/
cd /tmp/pages && python3 -m http.server 8099
```

Then open `http://localhost:8099/dualsport-comparison/` and select a bike. The photos only render after a selection, so a bare `pnpm build` and a look at `index.html` will not catch a broken image path.

---

## Adding a bike

One append to `bikes` in `src/data/bikes.ts` is most of the job. The table, the detail panel, and the `extremes` min/max ranges all derive from that array.

```ts
{
  slug: "brand-model-year",        // directory name for photos; keep it stable
  make: "Brand",                   // must match a key in BrandLogo's MARKS, or it falls back to a wordmark
  model: "Model",
  year: "2026",                    // omit for bikes with a single generation
  spec: { /* strings, exactly as published */ },
  n:    { /* the same figures as numbers, for sorting and scaling */ },
  condition: "new" | "used",
  geo:  { wheelbaseMm, travelMm, tank, front },
  livery: { plastic, plasticAlt, accent, frame, rim, seat },
  ink: "#RRGGBB",                  // brand colour, must pass contrast on the graphite ground
  inkAlt: "#RRGGBB",
  note: "One or two sentences on what the numbers mean.",
}
```

Then add the bike to the two lookup tables in `src/data/abilities.ts`, both keyed by `slug`:

- `MPG_US` — real-world economy in miles per US gallon. Prefer owner-reported data (Fuelly) over a manufacturer claim. Leave a comment naming the source and sample size.
- `WIND` — wind protection on a 0-5 scale.

Miss either and the bike silently falls back to a default, so add both.

Engine size goes in `spec.engine` and `n.cc` (the number feeds the highway index). Power and torque go in `spec.power` / `spec.torque` (display strings) and `n.hp` / `n.nm` (numbers, which drive the performance axis). Use **claimed crank figures**, not dyno numbers, and keep the whole table on the same basis or the axis compares apples to oranges.

`ink` is the one value worth checking by eye: it colours the chart, the selected row, and the panel, and it has to stay legible against `--color-ground`.

---

## Adding photos

Files go at `public/bikes/<slug>/<side>.webp`, where `<side>` is `left` or `right`, then get registered in `src/data/photos.ts`:

```ts
"brand-model-year": {
  views: [
    { side: "left",  src: "/bikes/brand-model-year/left.webp" },
    { side: "right", src: "/bikes/brand-model-year/right.webp" },
  ],
  credit: "Rights holder",
  source: "https://…",
  note: "Only if the photo is not exactly the model year of the row.",
}
```

A bike may have one view or two. The switcher renders whatever is listed, and a bike with no entry shows a placeholder naming the directory to drop into.

The captions come off the bike, not the side. The drive (chain) side is always the left here, but the exhaust is not always the right: the LC4 690/701 routes its silencer down the left, alongside the chain, so its right-hand view shows no exhaust at all. Set `exhaustSide: "left"` on those bikes in `bikes.ts` and the captions become `Left / drive & exhaust` and plain `Right`. Check the photo before trusting the convention. **Left is the drive (chain) side, right is the exhaust side** — check the photo rather than trusting the filename. Press galleries sometimes ship a mirrored image rather than a genuine second side; if two views look like flips of each other, compare one against the mirror of the other and see whether the difference collapses.

### Preparing the image

The set only looks like one shoot because every file meets the same spec:

1. **Find a studio side profile.** Two sources cover almost everything here:
   - **Manufacturer sites** (KTM, Husqvarna, Suzuki) publish PNGs that are already alpha-transparent, so no background removal is needed. View source on the model page and look for `left-side-studio` / `right-side` in the image URLs.
   - **motorcyclespecs.co.za** has a gallery on every model page, usually including a press side profile on white. The image paths are `Gallery_A-L_16/` on older pages and lowercase `gallery-a-l-23/` on newer ones, so match case-insensitively. These are JPEGs, so they need cutting out (below).
2. **Cut it out** with `rembg` if it is not already transparent. `u2net` handles a plain white studio background; for a bike composited onto scenery, `isnet-general-use` is markedly better. Check the result rather than trusting it: a bad mask keeps a slab of background and is obvious at a glance.
3. **Strip floating artwork.** Manufacturer images often carry a warranty badge or award logo in a corner. Keep only the largest connected alpha component; that drops the badge and keeps the bike.
4. **Crop to the alpha bounding box**, so framing does not depend on the source's padding.
5. **Fit onto a 1600x960 transparent canvas**, bike centred, scaled to about 94% of the width and no more than 92% of the height.
6. **Save as WebP** with alpha, quality ~88. Expect roughly 200 KB.

If a file is a different aspect ratio it still renders (the container is fixed at 1600/960 and the image is `object-contain`), but it will sit at a visibly different scale to the rest.

---

## Where the numbers come from

The `spec` block reproduces the source comparison table verbatim, approximations and price ranges included, so the researched figures (economy, wind protection) live in `abilities.ts` instead.

Where a figure has been overridden from another source, leave a comment on the bike naming that source and what it replaced. There are currently no overrides: a 950 mm seat height for the 2018 Husqvarna 701 was tried from motorcyclespecs.co.za and reverted, because it disagreed with Husqvarna's own 910 mm, made the 2018 the tallest of the three 701s, and contradicted the same-chassis KTM 690 at 910 mm.

## Ability chart

Five axes: service, range, performance, offroad, highway. Two rules:

- **Further out is better**, so weight and seat height are inverted.
- **Range, performance, offroad and highway are absolute**; only service is scaled against the rest of the field.

That split is deliberate. Range has a real-world absolute, so scaling it to the field would have shown the Kove as perfect when it is only the best of a short-legged group. `RANGE_FULL_MARKS` is 500 miles and nothing here comes close.

**Range is tank size times real-world economy**, not tank size. The two are not interchangeable: the CRF300L carries a litre less than the DR-Z4S and still goes 29 miles further.

**Offroad** is half wet weight and half seat height, both inverted. Worth knowing what this hides: a low seat usually means less suspension travel, which cuts the other way on rough ground, so the axis rewards accessibility rather than outright capability.

**Performance** is power and torque weighted equally, normalised across the field.

**Highway** is `(1 x top-gear comfort + 3 x engine size + 3 x wind protection) / 7`, each component normalised to 0-1 first so displacement does not swamp the rest. Wind protection is the one subjective number on the page: a 0-5 judgement read off the bodywork, where a bare number plate is 0 and a rally tower with a screen is 5.

Offroad, performance and highway are indices out of ten, not measurements. Hours-based service intervals (KTM 450 EXC-F, Ducati) do not convert to mileage, so the chart places them at a 30 mph working average purely to put them on the same axis. The table always shows the published hours.

## Logos

`public/logos/<brand>.svg`, from Wikimedia Commons, rendered as CSS masks rather than images so eight different marks resolve to one flat tone against the dark ground. A logo file must therefore contain only the mark: several shipped with a full-bleed background rectangle that had to be stripped, or the mask renders as a solid block.

Each file's `viewBox` is cropped to its wordmark, measured by rasterising it in headless Chrome and taking the alpha bounding box. That crop does two jobs: it removes the padding that made marks render at wildly different sizes, and because content outside a `viewBox` is clipped, it is also what drops Ducati's roundel and Honda's wing so every brand reads as a wordmark.

`BrandLogo` then sizes by **cap height**, not by bounding box, with the aspect ratio baked in per brand. Sizing to a shared box is what makes logos look inconsistent; sizing to a shared cap height is what makes them look like a set. Widths differ honestly (KTM is three letters, Honda is five), so callers give the logo a fixed slot to sit in. `optical` nudges marks whose bounding box overshoots their cap height, such as Husqvarna carrying a shield and a registered symbol.

To add a brand: drop the SVG in, crop its `viewBox` to the mark, then add a `MARKS` entry with `aspect` set to `viewBox width / height`. Kove and CCM have no freely licensed mark, so they fall back to a wordmark in the display face at the same cap height.
