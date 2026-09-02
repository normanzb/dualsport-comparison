"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AbilityChart } from "@/components/AbilityChart";
import { BikeGlyph } from "@/components/BikeGlyph";
import { BrandLogo } from "@/components/BrandLogo";
import { Crown } from "@/components/Crown";
import type { Bike } from "@/data/bikes";
import { type Side, photosFor } from "@/data/photos";
import { overallRank, superlativesFor } from "@/data/superlatives";
import { asset } from "@/lib/base-path";

/**
 * Captions come off the bike, not the side. The chain is on the left and the
 * silencer on the right for most of these, but the LC4 690/701 puts both on the
 * left, and a shaft-drive boxer claims neither.
 */
function sideLabel(bike: Bike, side: Side) {
  const name = side === "left" ? "Left" : "Right";
  const on = [
    (bike.driveSide ?? "left") === side && "drive",
    (bike.exhaustSide ?? "right") === side && "exhaust",
  ].filter(Boolean);
  return on.length ? `${name} / ${on.join(" & ")}` : name;
}

function Empty() {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 border border-dashed border-hair px-6 py-14 text-center lg:min-h-[340px]">
      <span className="font-display text-7xl leading-none text-ink-faint lg:text-8xl" aria-hidden>
        ?
      </span>
      <p className="max-w-xs text-[12px] leading-relaxed text-ink-dim">
        Pick a bike from the table above to see it in full, with its abilities plotted against the
        rest of the field.
      </p>
    </div>
  );
}

function Stack({ bike }: { bike: Bike }) {
  const set = photosFor(bike.slug);
  const views = set?.views ?? [];
  const [side, setSide] = useState<Side>(views[0]?.side ?? "right");
  const missing = views.length === 0;

  // Where to put a cutout is a maintainer's problem, so it goes to the console
  // rather than into the page.
  useEffect(() => {
    if (missing) {
      console.info(
        `[dualsport] no photo for ${bike.slug}. Drop a cutout into public/bikes/${bike.slug}/ and add it to src/data/photos.ts.`,
      );
    }
  }, [missing, bike.slug]);

  if (missing) {
    return (
      <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 border border-dashed border-hair px-6 text-center lg:min-h-[340px]">
        <BikeGlyph side="right" className="h-9 w-16 text-ink-faint" />
        <p className="max-w-[16rem] text-[11px] leading-relaxed text-ink-faint">
          No studio photograph sourced for this one yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* stacked: every view occupies the same box, the switch cross-fades between them */}
      <div className="relative aspect-[1600/960] max-h-[400px] w-full">
        {views.map((v) => (
          <Image
            key={v.side}
            src={asset(v.src)}
            alt={`${bike.make} ${bike.model}${bike.year ? ` ${bike.year}` : ""}, ${v.side} side`}
            fill
            priority={v.side === views[0].side}
            sizes="(max-width: 1024px) 92vw, 52vw"
            className={`object-contain transition-opacity duration-500 ${
              v.side === side ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {views.map((v) => {
          const on = v.side === side;
          return (
            <button
              key={v.side}
              type="button"
              onClick={() => setSide(v.side)}
              aria-pressed={on}
              title={`${v.side === "left" ? "Left" : "Right"} side`}
              className="group flex items-center gap-2 border px-3 py-2 transition-colors"
              style={{
                borderColor: on ? "var(--livery)" : "var(--color-hair)",
                background: on
                  ? "color-mix(in srgb, var(--livery) 14%, transparent)"
                  : "transparent",
              }}
            >
              <BikeGlyph
                side={v.side}
                className="h-5 w-9"
                // icon points the way the view does
              />
              <span
                className="text-[10px] tracking-[0.18em] uppercase"
                style={{ color: on ? "var(--livery)" : "var(--color-ink-dim)" }}
              >
                {sideLabel(bike, v.side)}
              </span>
            </button>
          );
        })}
        {views.length === 1 && (
          <span className="text-[10px] tracking-[0.14em] text-ink-faint uppercase">
            One side published
          </span>
        )}
      </div>

      {set && (
        <p className="mt-2 text-[10px] leading-relaxed text-ink-faint">
          {set.note ? `${set.note} ` : ""}Image ©{" "}
          <a
            href={set.source}
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-ink-dim"
          >
            {set.credit}
          </a>
          , used for identification.
        </p>
      )}
    </div>
  );
}

export function DetailPanel({ bike, onClear }: { bike: Bike | null; onClear: () => void }) {
  if (!bike) return <Empty />;

  const superlatives = superlativesFor(bike);
  const overallTier = overallRank(bike);

  return (
    <article
      className="relative border border-hair"
      style={{ ["--livery" as string]: bike.ink, ["--livery-alt" as string]: bike.inkAlt }}
    >
      <div aria-hidden className="livery-wash pointer-events-none absolute inset-0" />

      <header className="relative flex flex-wrap items-center justify-between gap-4 border-b border-hair px-5 py-4 md:px-7">
        <div className="flex items-center gap-4">
          <span className="flex w-[164px] shrink-0 items-center">
            <BrandLogo make={bike.make} height={19} tone="livery" />
          </span>
          <span aria-hidden className="h-8 w-px bg-hair" />
          <h2 className="flex items-center gap-2.5 font-display text-3xl leading-none md:text-4xl">
            {bike.model}
            {bike.year && <span className="text-ink-dim">&rsquo;{bike.year.slice(2)}</span>}
            {overallTier && <Crown tier={overallTier} size={17} />}
          </h2>
          <span
            className="border px-2 py-0.5 text-[9px] tracking-[0.18em] uppercase"
            style={{ borderColor: "var(--livery)", color: "var(--livery)" }}
          >
            {bike.condition === "new" ? "New" : "Used"}
          </span>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-[10px] tracking-[0.2em] text-ink-faint uppercase transition-colors hover:text-ink"
        >
          Clear &times;
        </button>
      </header>

      <div className="relative grid gap-8 px-5 py-6 md:px-7 lg:grid-cols-[1.35fr_1fr] lg:gap-10">
        <Stack key={bike.slug} bike={bike} />
        <div className="min-w-0">
          {superlatives.length > 0 && (
            <ul className="mb-3 flex flex-wrap gap-1.5">
              {superlatives.map((s) => {
                // outright wins are filled, runners-up and within-model wins are
                // outlined, so six chips still have a first thing to read
                const top = s.scope === "list" && s.rank === 1;
                return (
                  <li
                    key={s.label}
                    className="px-2 py-1 text-[10px] tracking-[0.14em] uppercase"
                    style={{
                      background: top
                        ? "color-mix(in srgb, var(--livery) 16%, transparent)"
                        : "transparent",
                      boxShadow: top
                        ? undefined
                        : "inset 0 0 0 1px color-mix(in srgb, var(--livery) 30%, transparent)",
                      color: "var(--livery)",
                    }}
                  >
                    {s.label} <span className="text-ink-dim">{s.value}</span>
                  </li>
                );
              })}
            </ul>
          )}
          <p className="mb-3 text-[12px] leading-relaxed text-ink-dim">{bike.note}</p>
          {(bike.story || bike.platform) && (
            <div className="mb-4 border-l border-hair pl-3">
              <h4 className="mb-1.5 text-[9px] tracking-[0.18em] text-ink-dim uppercase">
                Background
              </h4>
              {[bike.story, ...(bike.platform ?? [])].filter(Boolean).map((para) => (
                <p key={para} className="mb-1.5 text-[11px] leading-relaxed text-ink-dim">
                  {para}
                </p>
              ))}
            </div>
          )}
          <AbilityChart bike={bike} />
        </div>
      </div>
    </article>
  );
}
