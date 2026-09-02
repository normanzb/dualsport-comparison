"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DetailPanel } from "@/components/DetailPanel";
import { SpecTable } from "@/components/SpecTable";
import type { Bike } from "@/data/bikes";

export function Explorer() {
  const [selected, setSelected] = useState<Bike | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const outerRef = useRef<HTMLDivElement>(null);
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
      const r = el.getBoundingClientRect();
      if (r.top < 0 || r.bottom > window.innerHeight) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  }, []);

  return (
    <>
      <SpecTable selected={selected} onSelect={select} />

      <div
        ref={outerRef}
        className="panel-shell mt-12 scroll-mt-6 overflow-hidden"
        style={height === null ? undefined : { height }}
      >
        <div ref={innerRef}>
          <DetailPanel bike={selected} onClear={() => setSelected(null)} />
        </div>
      </div>
    </>
  );
}
