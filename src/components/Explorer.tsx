"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DetailPanel } from "@/components/DetailPanel";
import { SpecTable } from "@/components/SpecTable";
import type { Bike } from "@/data/bikes";

export function Explorer() {
  const [selected, setSelected] = useState<Bike | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

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

  const select = useCallback((b: Bike) => {
    setSelected(b);
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
    tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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
