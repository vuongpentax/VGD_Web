"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotFound() {
  const locale = usePathname()?.split("/")[1] === "en" ? "en" : "vi";
  return <section className="not-found page-width">
    <p className="eyebrow">404 · VGD</p>
    <h1>{locale === "vi" ? "Không tìm thấy trang" : "Page not found"}</h1>
    <p>{locale === "vi" ? "Đường dẫn có thể đã thay đổi hoặc chưa được xuất bản." : "This page may have moved or has not been published."}</p>
    <Link className="button button-primary" href={`/${locale}`}>{locale === "vi" ? "Về trang chủ" : "Go home"}<span aria-hidden="true">↗</span></Link>
  </section>;
}
