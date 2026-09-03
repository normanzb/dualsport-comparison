"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { BrandSwatch } from "@/components/BrandSwatch";
import { Crown } from "@/components/Crown";
import { type Bike, bikes } from "@/data/bikes";
import { photosFor } from "@/data/photos";
import { overallRank } from "@/data/superlatives";

type Col = {
  label: string;
  /** null sorts last whichever way the column is pointing */
  value: (b: Bike) => number | string | null;
  cell?: (b: Bike) => string;
};

const COLS: Col[] = [
  { label: "Bike", value: (b) => `${b.model} ${b.year ?? ""}`.trim() },
  { label: "Service interval", value: (b) => b.n.serviceMi, cell: (b) => b.spec.serviceInterval },
  { label: "Dry / no-fuel", value: (b) => b.n.dryKg, cell: (b) => b.spec.dryWeight },
  { label: "Wet / kerb", value: (b) => b.n.wetKg, cell: (b) => b.spec.wetWeight },
  { label: "Tank", value: (b) => b.n.tankL, cell: (b) => b.spec.tank },
  { label: "Gears", value: (b) => Number(b.spec.gears), cell: (b) => b.spec.gears },
  { label: "Seat height", value: (b) => b.n.seatMm, cell: (b) => b.spec.seatHeight },
  { label: "Clearance", value: (b) => b.n.clearanceMm, cell: (b) => b.spec.clearance },
  { label: "Engine", value: (b) => b.n.cc, cell: (b) => b.spec.engine },
  { label: "Power", value: (b) => b.n.hp, cell: (b) => b.spec.power },
  { label: "Torque", value: (b) => b.n.nm, cell: (b) => b.spec.torque },
  { label: "Typical UK price", value: (b) => b.n.priceFrom, cell: (b) => b.spec.price },
];

type Sort = { col: number; dir: "asc" | "desc" };

function HeaderRow({
  sort,
  onSort,
  widths,
}: {
  sort: Sort;
  onSort: (i: number) => void;
  widths?: number[];
}) {
  return (
    <tr className="border-b border-hair">
      {COLS.map((c, i) => {
        const active = sort.col === i;
        return (
          <th
            key={c.label}
            scope="col"
            aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}
            style={widths ? { width: widths[i], minWidth: widths[i] } : undefined}
            className={`bg-ground py-3 pr-4 text-[10px] font-medium tracking-[0.18em] uppercase ${
              i === 0 ? "pl-3" : "text-right"
            } ${active ? "text-ink" : "text-ink-dim"}`}
          >
            <button
              type="button"
              onClick={() => onSort(i)}
              className={`inline-flex w-full items-center gap-1.5 uppercase transition-colors hover:text-ink ${
                i === 0 ? "justify-start" : "justify-end"
              }`}
            >
              {c.label}
              <span aria-hidden className={active ? "" : "opacity-30"}>
                {active && sort.dir === "desc" ? "\u2193" : "\u2191"}
              </span>
            </button>
          </th>
        );
      })}
    </tr>
  );
}

/** Rows below the header when it lets go, so it never covers the last of the table. */
const TAIL_ROWS = 2;

export function SpecTable({
  selected,
  onSelect,
}: {
  selected: Bike | null;
  onSelect: (b: Bike) => void;
}) {
  const [sort, setSort] = useState<Sort>({ col: 0, dir: "asc" });
  const tableRef = useRef<HTMLTableElement>(null);
  const headRef = useRef<HTMLTableSectionElement>(null);

  const rows = useMemo(() => {
    const { col, dir } = sort;
    const read = COLS[col].value;
    const sign = dir === "asc" ? 1 : -1;
    return [...bikes].sort((a, b) => {
      const x = read(a);
      const y = read(b);
      if (x === null || Number.isNaN(x)) return y === null ? 0 : 1;
      if (y === null || Number.isNaN(y)) return -1;
      if (typeof x === "string" || typeof y === "string") {
        // numeric collation so "300 Rally" lands before "390 Enduro R", not after "3900"
        return sign * String(x).localeCompare(String(y), "en", { numeric: true });
      }
      return sign * (x - y);
    });
  }, [sort]);

  const wrapRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const [widths, setWidths] = useState<number[]>([]);

  const measure = () => {
    const head = headRef.current;
    if (!head) return;
    setWidths([...head.querySelectorAll("th")].map((th) => th.getBoundingClientRect().width));
  };
  useEffect(measure, [sort]);

  /**
   * A floating copy of the header rather than `position: sticky`.
   *
   * The table scrolls horizontally on narrow screens, and `overflow-x: auto`
   * forces `overflow-y` to `auto` too, which makes that wrapper the scrollport:
   * a sticky header then has nowhere to travel and never leaves the flow. So the
   * clone is fixed to the viewport and tracks the wrapper's horizontal scroll.
   *
   * It also stops short of the end of the table. Left alone it would hang over
   * the final rows with nothing beneath it, so once fewer than TAIL_ROWS remain
   * it rides back up with the table.
   */
  useEffect(() => {
    const table = tableRef.current;
    const head = headRef.current;
    const wrap = wrapRef.current;
    const float = floatRef.current;
    if (!table || !head || !wrap || !float) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const t = table.getBoundingClientRect();
      const headH = head.getBoundingClientRect().height;
      const rowH = table.querySelector("tbody tr")?.getBoundingClientRect().height ?? 44;
      const limit = t.bottom - headH - TAIL_ROWS * rowH;
      const on = t.top < 0 && limit > -headH;
      float.style.visibility = on ? "visible" : "hidden";
      if (!on) return;
      const w = wrap.getBoundingClientRect();
      float.style.top = `${Math.min(0, Math.round(limit))}px`;
      float.style.left = `${Math.round(w.left)}px`;
      float.style.width = `${Math.round(w.width)}px`;
      float.scrollLeft = wrap.scrollLeft;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    wrap.addEventListener("scroll", schedule, { passive: true });
    const ro = new ResizeObserver(() => {
      measure();
      schedule();
    });
    ro.observe(table);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      wrap.removeEventListener("scroll", schedule);
      ro.disconnect();
    };
  }, []);

  const onSort = (i: number) =>
    setSort((s) =>
      s.col === i ? { col: i, dir: s.dir === "asc" ? "desc" : "asc" } : { col: i, dir: "asc" },
    );

  return (
    <div className="relative">
      <div
        ref={floatRef}
        aria-hidden
        className="pointer-events-auto fixed z-30 overflow-x-hidden bg-ground"
        style={{ visibility: "hidden" }}
      >
        <table className="w-full min-w-[1380px] border-collapse text-left">
          <thead>
            <HeaderRow sort={sort} onSort={onSort} widths={widths} />
          </thead>
        </table>
      </div>
      <div ref={wrapRef} className="-mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
        <table ref={tableRef} className="w-full min-w-[1380px] border-collapse text-left">
          <caption className="sr-only">
            {bikes.length} dual sport motorcycles compared, sorted by {COLS[sort.col].label}. Select
            a row to see that bike in detail.
          </caption>
          <thead ref={headRef}>
            <HeaderRow sort={sort} onSort={onSort} />
          </thead>
          <tbody>
            {rows.map((b) => {
              const on = selected?.slug === b.slug;
              const hasPhoto = Boolean(photosFor(b.slug));
              const tier = overallRank(b);
              return (
                <tr
                  key={b.slug}
                  onClick={() => onSelect(b)}
                  aria-selected={on}
                  className="group cursor-pointer border-b border-hair/60 transition-colors hover:bg-panel-2"
                  style={{
                    ["--livery" as string]: b.ink,
                    background: on
                      ? "color-mix(in srgb, var(--livery) 11%, transparent)"
                      : undefined,
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
                        {tier && <Crown tier={tier} />}
                      </span>
                      {hasPhoto && <BrandSwatch make={b.make} fallback={b.ink} />}
                    </button>
                  </th>
                  {COLS.slice(1).map((c) => (
                    <Cell key={c.label}>{c.cell?.(b)}</Cell>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
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
