"use client";

import { useEffect } from "react";

/**
 * A static host cannot answer with a 301, so the hop is a meta refresh for a
 * reader without JavaScript and location.replace for everyone else. Replace,
 * not assign: a year-less URL is a signpost, not a page to come back to.
 */
export function Redirecting({ to, name }: { to: string; name: string }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-[1500px] flex-col items-start justify-center gap-4 px-5 md:px-8">
      <p className="text-[10px] tracking-[0.28em] text-ink-faint uppercase">No year given</p>
      <p className="font-display text-4xl leading-none">Taking you to the {name}</p>
      <a href={to} className="text-[11px] tracking-[0.2em] text-ink-dim uppercase hover:text-ink">
        Continue &rarr;
      </a>
    </main>
  );
}
