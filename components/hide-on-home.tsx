"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

/** Renders its children everywhere except the home page (/vi and /en). */
export function HideOnHome({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "";
  const isHome = /^\/(vi|en)\/?$/.test(pathname);
  return isHome ? null : <>{children}</>;
}
