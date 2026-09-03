"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { bikeUrl } from "@/lib/bike-url";

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // the clipboard API needs a secure context, so keep the old selection trick
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.cssText = "position:fixed;top:0;opacity:0";
    document.body.appendChild(field);
    field.select();
    const ok = document.execCommand("copy");
    field.remove();
    return ok;
  }
}

function Glyph({ done }: { done: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" className="shrink-0" aria-hidden>
      {done ? (
        <path
          d="m4 12.5 5.5 5.5L20 7"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M10 14a4 4 0 0 0 5.66 0l3-3A4 4 0 0 0 13 5.34l-1.5 1.5M14 10a4 4 0 0 0-5.66 0l-3 3A4 4 0 0 0 11 18.66l1.5-1.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export function ShareButton({ slug, title }: { slug: string; title: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number | null>(null);
  const url = bikeUrl(slug);

  useEffect(() => () => window.clearTimeout(timer.current ?? undefined), []);

  const onClick = useCallback(async () => {
    // a phone has no address bar to paste into, so hand it the share sheet
    if (navigator.share && matchMedia("(pointer: coarse)").matches) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
      }
    }
    setState((await copy(url)) ? "copied" : "failed");
    window.clearTimeout(timer.current ?? undefined);
    timer.current = window.setTimeout(() => setState("idle"), 2200);
  }, [url, title]);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Copy the link to this bike, ${url}`}
      // full width so it takes the line under the title: the address is here to
      // be read off a screenshot, so it never truncates and never uppercases
      className="order-last flex w-full items-center gap-2 text-left text-[10px] leading-none text-ink-faint transition-colors hover:text-ink"
    >
      <Glyph done={state === "copied"} />
      <span className="break-words">{url.replace(/^https?:\/\//, "")}</span>
      {state !== "idle" && (
        <span
          aria-live="polite"
          className="shrink-0 tracking-[0.18em] uppercase"
          style={{ color: "var(--livery)" }}
        >
          {state === "copied" ? "Copied" : "Copy failed"}
        </span>
      )}
    </button>
  );
}
