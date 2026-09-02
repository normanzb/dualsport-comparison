"use client";

import { BrandLogo } from "@/components/BrandLogo";
import { BrandSwatch } from "@/components/BrandSwatch";
import { Crown } from "@/components/Crown";
import { type Bike, bikes } from "@/data/bikes";
import { photosFor } from "@/data/photos";
import { overallRank } from "@/data/superlatives";

const COLS = [
  "Bike",
  "Service interval",
  "Dry / no-fuel",
  "Wet / kerb",
  "Tank",
  "Gears",
  "Seat height",
  "Clearance",
  "Engine",
  "Power",
  "Torque",
  "Typical UK price",
] as const;

export function SpecTable({
  selected,
  onSelect,
}: {
  selected: Bike | null;
  onSelect: (b: Bike) => void;
}) {
  return (
    <div className="-mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
      <table className="w-full min-w-[1380px] border-collapse text-left">
        <caption className="sr-only">
          {bikes.length} dual sport motorcycles compared. Select a row to see that bike in detail.
        </caption>
        <thead>
          <tr className="border-b border-hair">
            {COLS.map((c, i) => (
              <th
                key={c}
                scope="col"
                className={`py-3 pr-4 text-[10px] font-medium tracking-[0.18em] text-ink-dim uppercase ${
                  i === 0 ? "pl-3" : "text-right"
                }`}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {bikes.map((b) => {
            const on = selected?.slug === b.slug;
            const hasPhoto = Boolean(photosFor(b.slug));
            return (
              <tr
                key={b.slug}
                onClick={() => onSelect(b)}
                aria-selected={on}
                className="group cursor-pointer border-b border-hair/60 transition-colors hover:bg-panel-2"
                style={{
                  ["--livery" as string]: b.ink,
                  background: on ? "color-mix(in srgb, var(--livery) 11%, transparent)" : undefined,
                }}
              >
                <th scope="row" className="py-2.5 pr-4 pl-3 font-normal">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(b);
                    }}
                    className="flex w-full items-center gap-3 text-left"
                  >
                    <span
                      aria-hidden
                      className="block h-8 w-[3px] shrink-0 transition-colors"
                      style={{ background: on ? "var(--livery)" : "transparent" }}
                    />
                    <span className="flex w-[116px] shrink-0 items-center">
                      <BrandLogo make={b.make} height={13} tone={on ? "livery" : "ink"} />
                    </span>
                    <span className="flex items-center gap-1.5 text-[13px] whitespace-nowrap">
                      {b.model}
                      {b.year && <span className="text-ink-faint"> ({b.year})</span>}
                      {(() => {
                        const tier = overallRank(b);
                        return tier && <Crown tier={tier} />;
                      })()}
                    </span>
                    {hasPhoto && <BrandSwatch make={b.make} fallback={b.ink} />}
                  </button>
                </th>
                <Cell>{b.spec.serviceInterval}</Cell>
                <Cell>{b.spec.dryWeight}</Cell>
                <Cell>{b.spec.wetWeight}</Cell>
                <Cell>{b.spec.tank}</Cell>
                <Cell>{b.spec.gears}</Cell>
                <Cell>{b.spec.seatHeight}</Cell>
                <Cell>{b.spec.clearance}</Cell>
                <Cell>{b.spec.engine}</Cell>
                <Cell>{b.spec.power}</Cell>
                <Cell>{b.spec.torque}</Cell>
                <Cell>{b.spec.price}</Cell>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Cell({ children }: { children: React.ReactNode }) {
  return (
    <td className="py-2.5 pr-4 text-right text-[13px] whitespace-nowrap tabular-nums text-ink">
      {children}
    </td>
  );
}
