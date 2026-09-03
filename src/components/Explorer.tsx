"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DetailPanel } from "@/components/DetailPanel";
import { SpecTable } from "@/components/SpecTable";
import { type Bike, bikes } from "@/data/bikes";
import { slugFromPath, writeBikeToUrl } from "@/lib/bike-url";

export function Explorer({ initialSlug }: { initialSlug?: string }) {
  // The route carries the slug, so the server renders the bike too: no flash of
  // the empty state, and nothing to reconcile on hydration.
  const [selected, setSelected] = useState<Bike | null>(
    () => bikes.find((b) => b.slug === initialSlug) ?? null,
  );
  const [height, setHeight] = useState<number | null>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const cameFrom = useRef<number | null>(null);

  // Drive the wrapper height off the panel's real height so the empty state can
  // grow into a selected bike instead of snapping. ResizeObserver fires on
  // observe and again when the photo finishes decoding.
  useEffect(() => {
    const el = innerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => {
      setHeight(entry.target.getBoundingClientRect().height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // A shared link lands on its bike. No smooth scroll: the reader asked for this
  // machine, not the journey down to it.
  useEffect(() => {
    if (initialSlug) outerRef.current?.scrollIntoView({ block: "start" });
  }, [initialSlug]);

  // back and forward walk the bikes the reader has opened
  useEffect(() => {
    const onPop = () => {
      const slug = slugFromPath();
      setSelected(slug ? (bikes.find((b) => b.slug === slug) ?? null) : null);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const select = useCallback((b: Bike) => {
    // where the reader was standing in the table, so Clear can put them back.
    // Read before the scroll below moves them.
    cameFrom.current = window.scrollY;
    setSelected(b);
    writeBikeToUrl(b.slug, true);
    requestAnimationFrame(() => {
      const el = outerRef.current;
      if (!el) return;
      const { top } = el.getBoundingClientRect();
      // "start", never "center". The panel is far taller than a phone screen, so
      // centring it parked the viewport on the middle of the ability chart with
      // the bike's name and photograph scrolled off the top. Its top edge is also
      // the only stable anchor: the height animation moves the bottom for half a
      // second after the tap, which made a centred target a moving one.
      const placed = top >= 0 && top < window.innerHeight * 0.5;
      if (!placed) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const clear = useCallback(() => {
    setSelected(null);
    writeBikeToUrl(null, true);
    // The panel sits below the table, so the geometry above it is the same as it
    // was on the way in and the old offset still lands where they left off.
    // Nothing to go back to on a shared link: start them at the table.
    const back = cameFrom.current;
    cameFrom.current = null;
    if (back === null) tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo({ top: back, behavior: "smooth" });
  }, []);

  return (
    <>
      <div ref={tableRef} className="scroll-mt-6">
        <SpecTable selected={selected} onSelect={select} />
      </div>

      <div
        ref={outerRef}
        className="panel-shell mt-12 scroll-mt-6 overflow-hidden"
        style={height === null ? undefined : { height }}
      >
        <div ref={innerRef}>
          <DetailPanel bike={selected} onClear={clear} />
        </div>
      </div>
    </>
  );
}
