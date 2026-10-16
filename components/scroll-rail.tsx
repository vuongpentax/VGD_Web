"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * A horizontally scrolling rail that marks itself when its content overflows,
 * so the stylesheet can fade the trailing edge. Without the hint a clipped
 * product name looks like a typo rather than a cue to scroll.
 */
export function ScrollRail({
  className,
  label,
  children,
}: {
  className: string;
  label: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const rail = ref.current;
    if (!rail) return;

    const update = () => {
      rail.dataset.overflowing = String(rail.scrollWidth - rail.clientWidth > 1);
    };
    update();

    const observer = new ResizeObserver(update);
    observer.observe(rail);
    for (const child of rail.children) observer.observe(child);
    return () => observer.disconnect();
  }, []);

  return (
    <nav ref={ref} className={className} aria-label={label}>
      {children}
    </nav>
  );
}
