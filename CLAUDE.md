@AGENTS.md

# Mistakes made in this repo, and the rules that prevent them

Every item below is a real error that shipped or nearly shipped here. Read before touching the matching area.

## Data claims

**Every `note` in `bikes.ts` makes superlative claims that go stale the moment a bike is added.** Growing the set 14 to 22 silently falsified nine notes: Kove "nearly four times the tank of anything else" (a 21 L Rieju arrived), CCM "second-largest tank" (became fifth), Rieju "second-longest range" (became first), CFMoto "the heaviest" (a 196 kg BMW arrived). Two were wrong the day they were written: DR-Z4S "the only five-speed" when the CCM was also five-speed, and WR125R "lightest wet weight" when the EXC-F was 24 kg lighter.

> After any change to `bikes`, recompute the rankings and check every note against them. Never write a superlative from memory, and never assume an untouched note is still true.

**Counts hardcoded in copy went stale three times.** The page title said "14 bikes" long after there were 20; the intro, the table caption and the footer's wordmark list all drifted.

> Derive counts and lists from the data: `bikes.length`, and the complement of `MARK_MAKES` for the wordmark list. Both are already wired that way.

## Scoring (`abilities.ts`)

**Hardcoded normalization bounds let a value exceed 1.** `CC_HI = 693` meant the 1170 cc BMW scored 10.2 out of 10. The polygon clamps, so it looked fine and only the printed number gave it away.

> Derive every min and max from `bikes`. Never hardcode a bound.

**Min-max on a low-cardinality field made one step worth the whole axis.** Gears only take 5 or 6, so normalizing them to the field made a single gear worth more than a 112 cc displacement gap, ranking a 300 above a 400 for highway comfort.

> Do not min-max a field with two or three distinct values. Assign explicit scores (`GEAR_COMFORT`).

**A linear scale across an order of magnitude crushed the mid-field.** 124 to 1170 cc linearly puts most of the field near zero, and it re-broke the ordering above.

> Log-scale any quantity spanning roughly 10x.

**A hardcoded slug in a lookup would have silently mis-scored a new bike.** `serviceMiles` read `slug === "ktm-450-excf" ? 15 : 30`.

> Read values from the data or parse the spec string. Never branch on a slug.

## Deployment

**`next/image` ignores `basePath` once `images.unoptimized` is set**, which static export requires. Every bike photo 404s while the rest of the page looks perfect.

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

- **American English**, per the org standard: normalized, color, liter, judgment, center, license. Leave verbatim source data alone: the `Wet / kerb` column header comes from the source table.
- **No em dashes.** Use a comma, colon, parentheses, or rewrite.
- **Do not overclaim.** Copy said "both sides of the machine" when most bikes have one view.

## Brand colors

`ink` was set to green for AJP because no other bike had green. That is not a reason.

> Take `ink` from the bike's actual livery or mark, and check contrast against `--color-ground`.

## Process

A photo hunt died on a tool error and the work moved on without saying so, leaving the impression it was done.

> Say what is unfinished, and why, rather than letting a silent gap read as completion.
