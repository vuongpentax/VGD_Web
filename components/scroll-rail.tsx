"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";

/**
 * Pill rail that shows four items at a time. The arrows sit inside the pill and
 * move the track by one item. Children should be a list whose items each take
 * 25% of the track width (see `.rail-list` and `.rail-item` in globals.css).
 */
export function ScrollRail({ locale, children }: { locale: Locale; children: ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const [canPrevious, setCanPrevious] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const labels = locale === "vi"
    ? { previous: "Xem sản phẩm trước", next: "Xem sản phẩm tiếp" }
    : { previous: "Show previous products", next: "Show more products" };

  const updateArrows = useCallback(() => {
    const element = track.current;
    if (!element) return;
    setCanPrevious(element.scrollLeft > 1);
    setCanNext(element.scrollLeft < element.scrollWidth - element.clientWidth - 1);
  }, []);

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [children, updateArrows]);

  function scrollByItem(direction: -1 | 1) {
    const element = track.current;
    if (!element) return;
    element.scrollBy({ left: direction * element.clientWidth / 4, behavior: "smooth" });
  }

  return (
    <div className="scroll-rail">
      <button className="scroll-rail-arrow" type="button" aria-label={labels.previous} disabled={!canPrevious} onClick={() => scrollByItem(-1)}>
        <span aria-hidden="true">‹</span>
      </button>
      <div className="scroll-rail-track" ref={track} onScroll={updateArrows}>
        {children}
      </div>
      <button className="scroll-rail-arrow" type="button" aria-label={labels.next} disabled={!canNext} onClick={() => scrollByItem(1)}>
        <span aria-hidden="true">›</span>
      </button>
    </div>
  );
}
