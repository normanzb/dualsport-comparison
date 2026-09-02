import { Explorer } from "@/components/Explorer";
import { OverallExplainer } from "@/components/OverallExplainer";
import { MARK_MAKES } from "@/components/BrandLogo";
import { bikes, extremes } from "@/data/bikes";

export default function Home() {
  // derived so the footer cannot drift as brands are added
  const wordmarkOnly = [...new Set(bikes.map((b) => b.make))]
    .filter((m) => !MARK_MAKES.includes(m))
    .sort();

  return (
    <>
      <main className="mx-auto max-w-[1500px] px-5 pt-12 pb-16 md:px-8 md:pt-16">
        <header className="mb-10 lg:mb-12">
          <div className="flex items-center gap-4 text-[10px] tracking-[0.28em] text-ink-dim uppercase">
            <span className="h-px w-10 bg-[var(--livery)]" />
            {extremes.lightestWet} kg to {extremes.heaviestWet} kg &middot; {extremes.smallestTank}
            &ndash;{extremes.biggestTank} L &middot; {extremes.lowestSeat}&ndash;
            {extremes.tallestSeat} mm
          </div>

          <h1 className="mt-5 max-w-5xl font-display text-[11vw] leading-[0.84] tracking-tight sm:text-[4.6rem] lg:text-[5.6rem]">
            Dualsport motorcycle
            <br />
            side by side <span className="text-ink-dim">(UK market)</span>
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-relaxed text-ink-dim">
            {bikes.length} bikes on one sheet. Pick any row and it opens underneath, with
            photographs and its abilities measured against the rest of the field.
          </p>
        </header>

        <Explorer />

        <OverallExplainer />
      </main>

      <footer className="border-t border-hair">
        <div className="mx-auto max-w-[1500px] px-5 py-10 md:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <p className="max-w-2xl text-[11px] leading-relaxed text-ink-faint">
              Specification figures reproduce the source comparison table verbatim, approximations
              and price ranges included. Photographs are manufacturer studio images, reproduced for
              identification and credited on each bike. Brand marks are the property of their
              respective owners. Logo files: Wikimedia Commons, public domain except Suzuki (CC
              BY-SA 4.0). {wordmarkOnly.slice(0, -1).join(", ")} and {wordmarkOnly.at(-1)} have no
              freely licensed mark, so they appear as wordmarks.
            </p>

            <a
              href="https://instagram.com/oxnormanxo"
              target="_blank"
              rel="noreferrer noopener"
              className="flex shrink-0 items-center gap-2.5 text-[11px] tracking-[0.2em] text-ink-dim uppercase transition-colors hover:text-ink"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                aria-hidden
              >
                <rect x={3} y={3} width={18} height={18} rx={5} />
                <circle cx={12} cy={12} r={4} />
                <circle cx={17.2} cy={6.8} r={1.1} fill="currentColor" stroke="none" />
              </svg>
              @oxnormanxo
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
