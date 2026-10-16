"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { Locale } from "@/lib/i18n";

function localeFromPath(pathname: string | null): Locale {
  return pathname?.split("/")[1] === "en" ? "en" : "vi";
}

function NotFoundBody({ locale }: { locale: Locale }) {
  const vi = locale === "vi";
  return (
    <section className="not-found page-width">
      <p className="eyebrow">404 · VGD</p>
      <h1>{vi ? "Không tìm thấy trang" : "Page not found"}</h1>
      <p>{vi ? "Đường dẫn có thể đã thay đổi hoặc chưa được xuất bản." : "This page may have moved or has not been published."}</p>
      <Link className="button button-primary" href={`/${locale}`}>
        {vi ? "Về trang chủ" : "Go home"}<span aria-hidden="true">↗</span>
      </Link>
    </section>
  );
}

/** 404 rendered inside the [locale] layout, which supplies header and footer. */
export function LocaleNotFoundView() {
  return <NotFoundBody locale={localeFromPath(usePathname())} />;
}

/**
 * 404 for URLs that match no route at all. global-not-found bypasses the
 * [locale] layout, so this view renders its own header and footer and keeps
 * <html lang> in sync with the locale in the URL.
 */
export function GlobalNotFoundView() {
  const locale = localeFromPath(usePathname());

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <div className="site-shell">
      <SiteHeader locale={locale} languageLinksToHome />
      <main id="main-content">
        <NotFoundBody locale={locale} />
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
