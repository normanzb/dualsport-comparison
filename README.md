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

The site lands at `https://bikes.norm.im/`, or `https://<user>.github.io/<repo>/` if `public/CNAME` is removed.

### Custom domain vs project page

These serve from different roots, and the build has to match:

| Hosting                         | Served from | Base path |
| ------------------------------- | ----------- | --------- |
| `bikes.norm.im` (custom domain) | the root    | none      |
| `<user>.github.io/<repo>`       | `/<repo>`   | `/<repo>` |

`public/CNAME` is the switch. The workflow checks for it: present means a custom domain and an empty base path, absent means a project page and a base path derived from the repo name. Deleting the CNAME to fall back to a github.io URL therefore needs no other change.

Getting this wrong fails in a way that looks like a broken deploy rather than a config error: the HTML loads and every asset 404s, so you get unstyled markup with no interactivity. The CNAME also has to be in the artifact, not only in Settings, or an Actions deploy can drop the custom domain.

### Why the base path needs care at all

Next rewrites most URLs for you, but not all, and the gaps are silent:

- **`next/image` skips `basePath` entirely once `images.unoptimised` is set**, which static export requires. Photo sources therefore go through `asset()` from `src/lib/base-path.ts`. Without it every bike photo 404s while the rest of the page looks fine.
- **URLs built inside a style attribute are never rewritten.** The logo masks go through `asset()` for the same reason.

So any new hand-written asset URL needs `asset()`. To check a base-path build before pushing, build with one and serve it from a matching subdirectory:

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
  ink: "#RRGGBB",                  // brand color, must pass contrast on the graphite ground
  inkAlt: "#RRGGBB",
  note: "One or two sentences on what the numbers mean.",
}
```

Then add the bike to the two lookup tables in `src/data/abilities.ts`, both keyed by `slug`:

- `MPG_US`: real-world economy in miles per US gallon. Prefer owner-reported data (Fuelly) over a manufacturer claim. Leave a comment naming the source and sample size.
- `WIND`: wind protection on a 0-5 scale.

Miss either and the bike silently falls back to a default, so add both.

Engine size goes in `spec.engine` and `n.cc` (the number feeds the highway index). Power and torque go in `spec.power` / `spec.torque` (display strings) and `n.hp` / `n.nm` (numbers, which drive the performance axis). Use **claimed crank figures**, not dyno numbers, and keep the whole table on the same basis or the axis compares apples to oranges.

`ink` is the one value worth checking by eye: it colours the chart, the selected row, and the panel, and it has to stay legible against `--colour-ground`.

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

Captions come off the bike, not the side. The default is chain on the left and silencer on the right, but neither holds everywhere: the LC4 690/701 runs its silencer down the left alongside the chain, and the shaft-drive BMW has no chain side at all. Set `driveSide` and `exhaustSide` per bike, using `"none"` where it is not one-sided, and the caption composes itself.

Check the photo rather than trusting the convention or the filename. Press galleries sometimes ship a mirrored image instead of a genuine second side, which puts the exhaust on the wrong side of the bike. If two views look like flips of each other, compare one against the mirror of the other: a flip collapses the difference, two real photographs do not.

### Preparing the image

Use the scripts. **[IMG_GEN.md](IMG_GEN.md)** has the full method, the canvas spec, and why each part of it is the way it is.

```bash
./scripts/img/setup.sh                                                    # once
.venv-img/bin/python scripts/img/cutout.py photo.jpg <slug>/<side> --preview
.venv-img/bin/python scripts/img/cutout.py --audit                        # check the set
```

Finding a source is the part no script can do. Two cover almost everything here:

- **Manufacturer sites.** KTM, Husqvarna and Suzuki publish PNGs that are already alpha-transparent, so pass `--transparent` and skip the model. View source on the model page and look for `left-side-studio` / `right-side` in the image URLs. Honda's are under a `colour-picker` path in their DAM, one per colourway. Yamaha's live on `cdn2.yamaha-motor.eu` as white-backed JPEGs, named `Studio-00N-03`, where sets 002 and 004 are the two side profiles.
- **motorcyclespecs.co.za** has a gallery on every model page, usually including a press side profile on white. Paths are `Gallery_A-L_16/` on older pages and lowercase `gallery-a-l-23/` on newer ones, so match case-insensitively.

Source width is what decides whether the result looks sharp. The bike needs to be about 1400 px wide in the original; much under 1100 px and the upscale shows. If a manufacturer only serves a small rendition, it is usually better to leave the bike without a photo than to ship a soft one.

---

## Language

Prose is **British English**: normalised, colour, litre, judgement, centre, licence. The page is UK-market and the source table already reads `Wet / kerb`.

Code identifiers and platform names stay American, because they are not prose: `color`, `backgroundColor`, `scrollIntoView({ block: "center" })`, Tailwind's `items-center` and `transition-colors`, and CSS custom properties such as `--color-ink`. Converting those breaks the build silently, since a misspelled Tailwind class raises no error and simply stops applying.

## Superlatives

`src/data/superlatives.ts` derives every "lightest", "biggest tank", "longest range" claim from the data at module load, keyed by slug, and the detail panel renders them as chips. Ties are detected rather than assumed, so two bikes sharing the longest service interval both read `joint-longest service`.

Three tiers, and the panel fills the first and outlines the other two so there is still something to read first:

| Tier         | Example                        | Scope                                            |
| ------------ | ------------------------------ | ------------------------------------------------ |
| Overall      | `best overall 6.53/10`         | top three chart areas, listed first, and crowned |
| Outright     | `most power 105 hp`            | best of all bikes                                |
| Runner-up    | `2nd-heaviest ~196 kg`         | second best of all bikes                         |
| Within model | `lightest of any 690 Enduro R` | best of that model's years                       |

Ranking is competition-style: two bikes tied for first are both first, and the value below them is third, so it gets no chip. Nobody is promoted by a tie above them.

The within-model tier exists because the three 690s and three 701s are on the list purely to be told apart, and they are mid-field on everything, so no whole-list claim distinguishes them. It is capped at the best two metrics per bike, in the order weight, seat, tank, service; skips any figure every year of that model shares; and skips anything the bike already claims outright.

Two metrics are deliberately absent from that tier. Range, because within one model it only restates the tank. And price, because the newest year is always the dearest and the oldest always the cheapest, so the claim tells you nothing the year has not already.

Derived axes are ranked too, not just table figures: `easiest off road`, `hardest off road` and `best overall` come off the ability chart. Those rank on the figure rounded to the one decimal the page prints, so two bikes both shown as `5.0/10` read as joint rather than being split by a difference nothing displays.

To add a claim, add a `Metric` there, with an `of` key naming the underlying figure so a max and its min count as one claim. Do not write superlatives, ordinals or margins into a bike's prose: hand-written ones went stale every time the set grew.

## Prose fields

Three of them, and the split matters, because only the first is a verdict:

| Field      | Holds                                                                           | Renders as                      |
| ---------- | ------------------------------------------------------------------------------- | ------------------------------- |
| `note`     | what the table's numbers add up to for this bike                                | body paragraph                  |
| `story`    | mechanical or historical background specific to this bike                       | Background block                |
| `platform` | background shared by every bike on the same platform, as an array of paragraphs | Background block, after `story` |

`platform` exists because six LC4s repeating the same paragraph about the underseat tank would drift apart within two edits. Define the text once as a `const` at the top of `bikes.ts` and reference it from each entry: `LC4_690` covers the three 690 Enduro Rs and three 701 Enduros, `KTM_390` the two 390s.

Nothing in any of the three may make a comparative claim. Say what the bike is, not where it ranks. Only assert history and mechanical detail you can source; leaving a fact out costs nothing, and an invented one is indistinguishable from a real one to every reader.

## Comments

`src/components/Comments.tsx` embeds the [Ethereum Comments Protocol](https://ethcomments.xyz) iframe widget. Three things about it are load-bearing:

- **`targetUri` is hardcoded to `https://bikes.norm.im/`**, not read from `window.location`. The URI _is_ the thread's identity, so pointing it at localhost or a `/dualsport-comparison` project-page path would silently open a second, empty thread.
- **The height comes from a `postMessage` listener we own**, not from ECP's `embedScript.js`. Their script is served off their docs domain; the contract it implements is two lines, so there is no reason to load a third-party script on every page view. `MIN_HEIGHT` is only the guess used before the first message arrives, and is deliberately not a floor: clamping to it left 150px of dead space under an empty thread.
- **The theme's light and dark palettes hold the same dark values.** The iframe follows the visitor's own `prefers-color-scheme`, not the parent page's, so a visitor on a light OS would otherwise get a white widget dropped into a black page. The headline is themed to `0rem` because the widget prints its own "Comments" title, which duplicated the section heading, and the theme is the only hook the embed exposes for it.

To change the theme, regenerate the blob with the configurator at [docs.ethcomments.xyz](https://docs.ethcomments.xyz/integration-options/embed-comments) and paste the new `config` value in. The comment above `THEME` records the palette that produced the current one.

If this site ever grows a `Content-Security-Policy`, it needs `frame-src https://embed.ethcomments.xyz`. GitHub Pages sends no CSP header today, which is why the embed works without one.

## Where the numbers come from

The `spec` block reproduces the source comparison table verbatim, approximations and price ranges included, so the researched figures (economy, wind protection) live in `abilities.ts` instead.

Where a figure has been overridden from another source, leave a comment on the bike naming that source and what it replaced. There are currently no overrides: a 950 mm seat height for the 2018 Husqvarna 701 was tried from motorcyclespecs.co.za and reverted, because it disagreed with Husqvarna's own 910 mm, made the 2018 the tallest of the three 701s, and contradicted the same-chassis KTM 690 at 910 mm.

## Ground clearance

Ducati publishes none for the Desmo450 EDS, so its 310 mm is an estimate and carries a tilde like the other unpublished values here. Everything else in that column is a published figure.

It feeds the offroad axis rather than getting one of its own, which is what stops the chart double-counting: clearance and wet weight correlate at r = -0.75, so as separate spokes they would swell the same lobe of the polygon for what is largely one trait.

## Ability chart

Five axes: service, range, performance, offroad, highway. Two rules:

- **Further out is better**, so weight and seat height are inverted.
- **Every axis scores against a fixed benchmark**, never against the rest of the field.

That is deliberate. Min-max scaling gives the best bike on an axis full marks however good it actually is: it would have shown the Kove's range as perfect when it is only the best of a short-legged group, and it handed the service axis to whoever printed the longest interval. `RANGE_FULL_MARKS` is 500 miles and nothing here comes close.

### Service, and the soft knee

Service was the last min-max axis, and it was the most gameable thing on the page. A manufacturer can raise a published interval without changing the motorcycle, and under min-max that bought full marks: the axis was worth **+1.15** of overall score to the 790 Adventure and **+1.06** to the 890 Adventure R, on a podium that spans about half a point.

It now scores on a soft knee:

```
mi <= 6000:  0.85 * (mi / 6000)
mi >  6000:  0.85 + 0.15 * (mi - 6000) / (SERVICE_HI - 6000)
```

6,000 miles is roughly 10,000 km, which is about a year for most riders. KTM's own schedule reads "15,000 km or annually, whichever comes first", so past a year the interval stops changing how often the bike is actually booked in. The slope above the knee is about a third of the slope below it, so a longer interval still earns something, just far less: 6,000 miles scores 8.5, 8,000 scores 9.4, and the 9,320-mile bikes still reach 10.

The ceiling is derived from the data rather than hardcoded, so a bike with a longer interval than anything here cannot push the axis past 1.

**Range is tank size times real-world economy**, not tank size. The two are not interchangeable: the CRF300L carries a litre less than the DR-Z4S and still goes 29 miles further.

**Offroad ease** is how readily a bike goes off the tarmac, not how capable it is once there. That distinction matters: a big adventure bike scores low because it is awkward to take off road, not because it cannot go.

Four figures: wet weight and ground clearance at weight 1 each, centre of gravity at 0.5, seat height at 0.3. Lighter, more clearance, weight carried lower and a lower seat all score higher.

Centre of gravity is `LOW_COG` in `abilities.ts`, a hidden 1-to-4 index that appears nowhere in the table. 1 is the norm, the LC4 690/701 sit at 2 for their underseat tank, and the boxer HP2 is 3.

It divides by a **fixed ceiling of 4**, not by the observed maximum. Two reasons: the 1 most bikes carry then reads as a baseline rather than a zero, and the top value stays meaningful. Dividing by the maximum would peg whichever bike scores highest at 1.0 regardless of its value, so lowering the HP2 from 4 to 3 would have moved the HP2 not at all and simply lifted every other bike.

Seat height is deliberately the smallest weight. Clearance already carries the suspension-travel part of a tall seat, so seat height's remaining job is just reaching the ground.

**Performance** is power and torque **per kilogram**, weighted equally, against fixed benchmarks of 0.6 hp/kg and 0.6 Nm/kg that nothing here reaches.

Output on its own says how fast a bike is in a straight line, which is not what makes a dual sport good. What a rider feels is how much of it there is to move: 63 hp in the 126 kg Ducati is a livelier machine than 72 hp in a 208 kg Tenere, and scoring raw output said the opposite. Weight is kerb, not dry, because that is the bike you actually push.

Fixed benchmarks matter here for two reasons. A heavier bike cannot buy the axis back with more engine, and the best bike on it is not handed full marks just for leading the field. The Ducati is the clearest case: 63.5 hp reads as modest until you divide by 126 kg, at which point only the HP2 beats it.

**Highway** is `(4 x engine size + 3 x wind protection + 1 x top-gear comfort) / 8`.

Displacement is scored on a **log** scale, not linearly. The field spans 124 cc to 1170 cc, nearly ten to one, so a linear scale crushes the small and mid-size bikes into the bottom of the axis where most of them actually live, and it matches how the motor feels: 125 to 400 is transformative, 700 to 1170 much less so. Its bounds are derived from the data, because hardcoding them is how a 1170 boxer once scored 10.2 out of 10.

Engine sits above wind protection at 4 to 3. At equal weight a screen exactly cancelled a 400 cc deficit, which let the 292 cc Voge tie the 693 cc KTM. Weather protection helps, but it cannot make up for an engine that is simply too small.

Top-gear comfort is not min-max normalised either: gearboxes here are only ever five or six speeds, so scaling them to the field would make one gear worth the whole axis, more than a 112 cc gap. A five-speed scores 0.75, worth roughly the 10-15% more revs it turns at speed.

Wind protection is the one subjective number on the page: a 0-5 judgement read off the bodywork, where a bare number plate is 0 and a rally tower with a screen is 5.

### Overall standing

The page explains this to the reader in the `OverallExplainer` section, which derives its wording and its formula from `AXES.length` so it cannot drift if an axis is added.

`overall()` is the area of the polygon the chart draws, as a fraction of the full pentagon, square-rooted so a bike scoring x on every axis reads exactly x rather than x squared. The top two get a `best overall` chip, and the leader also gets a `Crown` beside its name in the table row and the panel heading.

The top three get a crown: gold, silver, bronze. They ask `overallRank()`, and the `OverallExplainer` section builds its podium from `overallPodium`; both read the same derived table the chips come from, so a crown, a chip and the podium can never disagree. Nothing hardcodes a winning slug.

The overall standing ranks and prints at **two** decimals where every axis uses one. The axes are read off the chart, so two bikes shown as 5.0 should rank as joint; the overall standing is a podium, and at one decimal the 790 Adventure and the HP2 both rounded to 6.4 and tied for silver on a real gap of 0.055, leaving gold, silver, silver and no bronze. Rank and display move together, so a silver and a bronze can never show the same number.

Every other metric stops at second place. The overall standing is the one that goes to three, via `depth: 3` on its `Metric`. Competition ranking still applies, so if two bikes tie for second there is no bronze at all.

Each crown has a gradient sweep and a pulsing glow. Both are CSS animations in `globals.css`, not an inline SVG, so the existing `prefers-reduced-motion` block switches the pair off and leaves a static crown with a soft glow. The tier classes supply `--crown-metal` and `--crown-glow`; the animations are shared. The mask sits on an inner span and the filter on the outer one: masking is applied after filtering, so a glow on the masked element would be clipped to the crown's own silhouette and never seen.

Two caveats worth keeping in mind before quoting it:

- **Radar area depends on the order of the axes.** The same five scores arranged differently enclose a different shape. Across all twelve distinct orders the leader does not change, but its figure moves by roughly half a point, so this summarises the chart as drawn rather than stating a fact about the bike.
- **It rewards all-rounders over specialists by construction.** Squaring is what does it: a bike strong on two axes and weak on three encloses less than a bike that is middling on all five. The easiest bike here to take off road does not come close to the top of it.

Offroad, performance and highway are indices out of ten, not measurements. Hours-based service intervals (KTM 450 EXC-F, Ducati) do not convert to mileage, so the chart places them at a 30 mph working average purely to put them on the same axis. The table always shows the published hours.

## Logos

`public/logos/<brand>.svg`, from Wikimedia Commons, rendered as CSS masks rather than images so eight different marks resolve to one flat tone against the dark ground. A logo file must therefore contain only the mark: several shipped with a full-bleed background rectangle that had to be stripped, or the mask renders as a solid block.

Each file's `viewBox` is cropped to its wordmark, measured by rasterising it in headless Chrome and taking the alpha bounding box. That crop does two jobs: it removes the padding that made marks render at wildly different sizes, and because content outside a `viewBox` is clipped, it is also what drops Ducati's roundel and Honda's wing so every brand reads as a wordmark.

`BrandLogo` then sizes by **cap height**, not by bounding box, with the aspect ratio baked in per brand. Sizing to a shared box is what makes logos look inconsistent; sizing to a shared cap height is what makes them look like a set. Widths differ honestly (KTM is three letters, Honda is five), so callers give the logo a fixed slot to sit in. `optical` nudges marks whose bounding box overshoots their cap height, such as Husqvarna carrying a shield and a registered symbol.

To add a brand: drop the SVG in, crop its `viewBox` to the mark, then add a `MARKS` entry with `aspect` set to `viewBox width / height`. Kove and CCM have no freely licensed mark, so they fall back to a wordmark in the display face at the same cap height.
