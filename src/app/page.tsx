import { Explorer } from "@/components/Explorer";
import { bikes, extremes } from "@/data/bikes";

export default function Home() {
  return (
    <>
      <main className="mx-auto max-w-[1500px] px-5 pt-12 pb-16 md:px-8 md:pt-16">
        <header className="mb-10 lg:mb-12">
          <div className="flex items-center gap-4 text-[10px] tracking-[0.28em] text-ink-dim uppercase">
            <span className="h-px w-10 bg-[var(--livery)]" />
            {extremes.lightestWet} kg to {extremes.heaviestWet} kg &middot;{" "}
            {extremes.smallestTank}&ndash;{extremes.biggestTank} L &middot;{" "}
            {extremes.lowestSeat}&ndash;{extremes.tallestSeat} mm
          </div>

          <h1 className="mt-5 max-w-5xl font-display text-[11vw] leading-[0.84] tracking-tight sm:text-[4.6rem] lg:text-[5.6rem]">
            Dualsport motorcycle
            <br />
            side by side{" "}
            <span className="text-ink-dim">(UK market)</span>
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-relaxed text-ink-dim">
            {bikes.length} bikes on one sheet. Pick any row and it opens underneath, with
            photographs and its abilities measured against the rest of the field.
          </p>
        </header>

        <Explorer />
      </main>

      <footer className="border-t border-hair">
        <div className="mx-auto max-w-[1500px] px-5 py-10 md:px-8">
          <p className="max-w-2xl text-[11px] leading-relaxed text-ink-faint">
            Specification figures reproduce the source comparison table verbatim, approximations and
            price ranges included. Photographs are manufacturer studio images, reproduced for
            identification and credited on each bike. Brand marks are the property of their
            respective owners. Logo files: Wikimedia Commons, public domain except Suzuki (CC BY-SA
            4.0). CCM, CFMoto, Kove, Moto Morini, Rieju and Voge have no freely licensed mark, so they
            appear as wordmarks.
          </p>
        </div>
      </footer>
    </>
  );
}
