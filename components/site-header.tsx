"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { getUi } from "@/lib/i18n";

const navItems = [
  ["plugins", "plugins"],
  ["center", "center"],
  ["docs", "docs"],
  ["changelog", "changelog"],
  ["contact", "contact"],
] as const;

export function SiteHeader({ locale }: { locale: Locale }) {
  const copy = getUi(locale);
  const pathname = usePathname() || `/${locale}`;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const links = Array.from(menuRef.current?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? []);
    links[0]?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = [toggleRef.current, ...links].filter(
        (element): element is HTMLButtonElement | HTMLAnchorElement => element !== null,
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  function switchLocale(target: Locale) {
    const segments = pathname.split("/");
    if (segments[1] === "vi" || segments[1] === "en") segments[1] = target;
    else return `/${target}`;
    return segments.join("/") || `/${target}`;
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <a className="skip-link" href="#main-content">
        {locale === "vi" ? "Bỏ qua điều hướng" : "Skip to content"}
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Link className="wordmark" href={`/${locale}`} aria-label="VGD home">
            <span className="wordmark-symbol" aria-hidden="true">V</span>
            <span>VGD</span>
            <span className="wordmark-caption">TOOLS FOR SKETCHUP</span>
          </Link>

          <button
            ref={toggleRef}
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            aria-label={menuOpen ? copy.nav.closeMenu : copy.nav.menu}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="menu-toggle-lines" aria-hidden="true"><i /><i /></span>
          </button>

          <nav
            ref={menuRef}
            id="primary-navigation"
            className={`site-nav${menuOpen ? " is-open" : ""}`}
            aria-label={locale === "vi" ? "Điều hướng chính" : "Primary navigation"}
          >
            {navItems.map(([key, href]) => (
              <Link
                key={key}
                href={`/${locale}/${href}`}
                aria-current={pathname === `/${locale}/${href}` || pathname.startsWith(`/${locale}/${href}/`) ? "page" : undefined}
                onClick={closeMenu}
              >
                {copy.nav[key]}
              </Link>
            ))}
            <div className="language-switch" role="group" aria-label={copy.nav.language}>
              <Link href={switchLocale("vi")} aria-current={locale === "vi" ? "page" : undefined} onClick={closeMenu}>VI</Link>
              <span aria-hidden="true">/</span>
              <Link href={switchLocale("en")} aria-current={locale === "en" ? "page" : undefined} onClick={closeMenu}>EN</Link>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
