@AGENTS.md

# Mistakes made in this repo, and the rules that prevent them

Every item below is a real error that shipped or nearly shipped here. Read before touching the matching area.

## Data claims

**Every `note` in `bikes.ts` makes superlative claims that go stale the moment a bike is added.** Growing the set 14 to 22 silently falsified nine notes: Kove "nearly four times the tank of anything else" (a 21 L Rieju arrived), CCM "second-largest tank" (became fifth), Rieju "second-longest range" (became first), CFMoto "the heaviest" (a 196 kg BMW arrived). Two were wrong the day they were written: DR-Z4S "the only five-speed" when the CCM was also five-speed, and WR125R "lightest wet weight" when the EXC-F was 24 kg lighter.

> Superlatives are now derived: `src/data/superlatives.ts` builds a slug-to-claims table from the data at module load, detects ties, and the panel renders them as chips. Add a metric there rather than writing "the lightest" into prose.
>
> The `note` fields no longer carry comparative wording at all. Every ordinal, margin and "only one here" claim was stripped out; a note now says only what the data cannot: why the bike exists, what it is like to own, what is still unconfirmed. Whole-list rank 1 and rank 2, within-model wins, and joint holders are all derived. If you catch yourself typing "third-lightest", "half again the next biggest" or "less than half the price of the 2026" into a note, add a metric instead or leave the claim out. Never write a superlative from memory.

**Counts hardcoded in copy went stale three times.** The page title said "14 bikes" long after there were 20; the intro, the table caption and the footer's wordmark list all drifted.

> Derive counts and lists from the data: `bikes.length`, and the complement of `MARK_MAKES` for the wordmark list. Both are already wired that way.

## Scoring (`abilities.ts`)

**Hardcoded normalisation bounds let a value exceed 1.** `CC_HI = 693` meant the 1170 cc BMW scored 10.2 out of 10. The polygon clamps, so it looked fine and only the printed number gave it away.

> Derive every min and max from `bikes`. Never hardcode a bound.

**Min-max on a low-cardinality field made one step worth the whole axis.** Gears only take 5 or 6, so normalising them to the field made a single gear worth more than a 112 cc displacement gap, ranking a 300 above a 400 for highway comfort.

> Do not min-max a field with two or three distinct values. Assign explicit scores (`GEAR_COMFORT`).

**A linear scale across an order of magnitude crushed the mid-field.** 124 to 1170 cc linearly puts most of the field near zero, and it re-broke the ordering above.

> Log-scale any quantity spanning roughly 10x.

**A hardcoded slug in a lookup would have silently mis-scored a new bike.** `serviceMiles` read `slug === "ktm-450-excf" ? 15 : 30`.

> Read values from the data or parse the spec string. Never branch on a slug.

### Normalise subjective indices against a fixed ceiling, not the observed maximum

`LOW_COG` divides by a hardcoded `COG_MAX = 4`. When I first wrote it, it divided by `Math.max(...values)`. Norman then asked to drop the HP2 from 4 to 3, and that edit alone would have changed the HP2's score by exactly nothing: it was still the highest value, so it still normalised to 1.0. The only effect would have been to lift every other bike. For a hand-assigned index where the top value carries meaning ("3 out of a possible 4"), divide by the conceptual ceiling. Derive bounds from the data only for measured quantities where the range is whatever the field happens to contain.

## Deployment

**`next/image` ignores `basePath` once `images.unoptimised` is set**, which static export requires. Every bike photo 404s while the rest of the page looks perfect.

> Hand-written asset URLs go through `asset()` in `src/lib/base-path.ts`. That includes `next/image` `src` and any URL built inside a style attribute.

**A custom domain serves from the root, a project page from `/<repo>`.** Building with the wrong one 404s every asset, which reads as a broken app rather than a config error.

> `public/CNAME` is the switch; the workflow branches on it. Verify a base-path build by serving it from a matching subdirectory and selecting a bike, because photos only render after a selection.

## Assets

**Logo SVGs are used as CSS masks, so the file must contain only the mark.** Two shipped with a full-bleed background rect and rendered as solid blocks. Two had no `viewBox` and could not scale. Padding inside the viewBox made marks render at wildly different optical sizes.

> Crop each `viewBox` to the mark, then size by **cap height**, not bounding box. Sizing to a shared box is what makes logos look inconsistent.

**A press gallery's "other side" can be a mirrored duplicate**, which puts the exhaust on the wrong side of the bike.

> Compare one against the mirror of the other. A flip collapses the rms difference; genuinely different photographs do not.

**Left is not always the drive side and right is not always the exhaust.** The LC4 690/701 runs its silencer down the left, and a shaft-drive boxer has no chain side at all.

> Captions derive from `driveSide` / `exhaustSide` per bike, with `"none"` when it is not one-sided. Check the photo before trusting the convention.

## Copy

- **British English** in all prose: normalised, colour, litre, judgement, centre, licence. This is a UK-market page, and the source table already reads `Wet / kerb`.
- **Code identifiers and platform names stay American.** `color`, `backgroundColor`, `scrollIntoView({ block: "center" })`, Tailwind's `items-center` / `text-center` / `transition-colors`, and CSS custom properties like `--color-ink`. A blind find-and-replace over the tree broke exactly these: Tailwind classes became `items-centre` and `transition-colours`, which **fail silently** with no type error and no lint error, and only a computed-style check caught them. Convert comments, JSX text and docs; never class names, property names or API string literals.
- **No em dashes.** Use a comma, colon, parentheses, or rewrite.
- **Do not overclaim.** Copy said "both sides of the machine" when most bikes have one view.

## Brand colours

`ink` was set to green for AJP because no other bike had green. That is not a reason.

> Take `ink` from the bike's actual livery or mark, and check contrast against `--colour-ground`.

## Process

A photo hunt died on a tool error and the work moved on without saying so, leaving the impression it was done.

> Say what is unfinished, and why, rather than letting a silent gap read as completion.
