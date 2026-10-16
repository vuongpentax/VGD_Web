import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getUi } from "@/lib/i18n";

export function SiteFooter({ locale }: { locale: Locale }) {
  const copy = getUi(locale);
  return (
    <footer className="site-footer">
      <div className="footer-main page-width">
        <div className="footer-brand">
          <Link className="wordmark footer-wordmark" href={`/${locale}`}>
            <img className="wordmark-logo" src="/brand/vgd-logo.svg" alt="" aria-hidden="true" width={29} height={29} />
            <span>VGD</span>
          </Link>
          <p>{copy.footer.note}</p>
        </div>
        <div className="footer-links">
          <div>
            <p className="footer-label">{locale === "vi" ? "Khám phá" : "Explore"}</p>
            <Link href={`/${locale}/plugins`}>{copy.nav.plugins}</Link>
            <Link href={`/${locale}/center`}>{copy.nav.center}</Link>
            <Link href={`/${locale}/docs`}>{copy.nav.docs}</Link>
          </div>
          <div>
            <p className="footer-label">{locale === "vi" ? "Thông tin" : "About"}</p>
            <Link href={`/${locale}/changelog`}>{copy.nav.changelog}</Link>
            <Link href={`/${locale}/roadmap`}>{copy.nav.roadmap}</Link>
            <Link href={"/" + locale + "/about"}>{copy.nav.about}</Link>
            <Link href={`/${locale}/contact`}>{copy.nav.contact}</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom page-width">
        <span>© {new Date().getFullYear()} VGD</span>
        <span>{copy.footer.copyright}</span>
        <a href="https://github.com/vuongpentax/VGD_Plugins" target="_blank" rel="noreferrer noopener">
          GitHub <span aria-hidden="true">↗</span>
        </a>
      </div>
    </footer>
  );
}
