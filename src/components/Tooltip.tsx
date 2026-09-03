"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useMediaQuery } from "@/lib/use-media-query";

const DIALOG_BELOW = "(max-width: 767px)";

/**
 * Hover copy on a pointer, a dialog on a phone. A phone has no hover, and a
 * bubble tied to a tap is a thing you dismiss by accident, so below the
 * breakpoint the same content opens in the top layer instead.
 *
 * Both surfaces are portalled: the table's scrollport would clip a bubble, and
 * the chart's trigger is an SVG group that cannot hold a dialog.
 */
export function Tooltip({
  title,
  content,
  disabled = false,
  as = "span",
  className,
  children,
}: {
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
  /** "g" for a trigger that lives inside an SVG. */
  as?: "span" | "g";
  className?: string;
  children: React.ReactNode;
}) {
  const id = useId();
  const trigger = useRef<Element | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [at, setAt] = useState<{
    x: number;
    y: number;
    above: boolean;
    via: "hover" | "focus";
  } | null>(null);
  const [modal, setModal] = useState(false);
  const asDialog = useMediaQuery(DIALOG_BELOW);

  const setTrigger = useCallback((node: Element | null) => {
    trigger.current = node;
  }, []);
  const hide = useCallback(() => setAt(null), []);
  const place = useCallback((via: "hover" | "focus") => {
    const box = trigger.current?.getBoundingClientRect();
    if (!box) return;
    const above = box.top > 180;
    setAt({ x: box.left + box.width / 2, y: above ? box.top - 10 : box.bottom + 10, above, via });
  }, []);

  /**
   * Scrolling means opposite things to the two ways in.
   *
   * A hover belongs to where the pointer is. Scroll the page and the trigger
   * slides out from under it, and the browser will not reliably send a leave
   * event for that, so the bubble has to close itself.
   *
   * A focus belongs to the element. Focusing a trigger that was off screen
   * scrolls it into view, which would dismiss it before it was ever seen, and
   * the reader has not gone anywhere, so it follows the trigger instead.
   */
  const via = at?.via ?? null;
  useEffect(() => {
    if (!via) return;
    let frame = 0;
    const follow = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        place("focus");
      });
    };
    const onScroll = via === "hover" ? hide : follow;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && hide();
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", hide, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", hide);
      window.removeEventListener("keydown", onKey);
    };
  }, [via, place, hide]);

  const shut = useCallback(() => {
    dialog.current?.close();
    setModal(false);
  }, []);

  // Every way out is wired by hand rather than left to the close event, which
  // does not reach React reliably: miss it and the dialog stays mounted, shut,
  // and the next trigger has no state left to change.
  useEffect(() => {
    const el = dialog.current;
    if (!modal || !el) return;
    el.showModal();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && shut();
    el.addEventListener("close", shut);
    el.addEventListener("keydown", onKey);
    return () => {
      el.removeEventListener("close", shut);
      el.removeEventListener("keydown", onKey);
    };
  }, [modal, shut]);

  if (disabled) return <>{children}</>;

  const handles = {
    ref: setTrigger,
    className,
    tabIndex: 0,
    role: "button",
    // click is left alone on a pointer, so a trigger inside a clickable row
    // still passes the click through to the row
    onClick: asDialog
      ? (e: React.MouseEvent) => {
          e.stopPropagation();
          setModal(true);
        }
      : undefined,
    onPointerEnter: asDialog ? undefined : () => place("hover"),
    onPointerLeave: asDialog ? undefined : hide,
    onFocus: asDialog ? undefined : () => place("focus"),
    onBlur: asDialog ? undefined : hide,
    "aria-haspopup": asDialog ? ("dialog" as const) : undefined,
    "aria-describedby": at ? id : undefined,
  };

  return (
    <>
      {as === "g" ? <g {...handles}>{children}</g> : <span {...handles}>{children}</span>}

      {at &&
        createPortal(
          <div
            id={id}
            role="tooltip"
            className="pointer-events-none fixed z-50 max-w-[min(20rem,calc(100vw-2rem))] border border-hair bg-panel px-3 py-2 text-[11px] leading-relaxed font-normal tracking-normal text-ink-dim normal-case"
            style={{
              left: at.x,
              top: at.y,
              transform: `translate(-50%, ${at.above ? "-100%" : "0"})`,
            }}
          >
            <span className="mb-1 block text-[9px] tracking-[0.18em] text-ink-faint uppercase">
              {title}
            </span>
            {content}
          </div>,
          document.body,
        )}

      {modal &&
        createPortal(
          <dialog
            ref={dialog}
            className="sheet"
            // a click landing on the dialog itself came from the backdrop
            onClick={(e) => e.target === dialog.current && shut()}
          >
            <h3 className="mb-2 text-[9px] tracking-[0.18em] text-ink-faint uppercase">{title}</h3>
            <div className="text-[12px] leading-relaxed text-ink-dim">{content}</div>
            <button
              type="button"
              onClick={shut}
              className="mt-4 text-[10px] tracking-[0.2em] text-ink-faint uppercase hover:text-ink"
            >
              Close &times;
            </button>
          </dialog>,
          document.body,
        )}
    </>
  );
}
