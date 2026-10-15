import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { previewCatalog, productTabLabel } from "@/lib/catalog";

export function ProductSelector({
  locale,
  activeSlug,
}: {
  locale: Locale;
  activeSlug?: string;
}) {
  return (
    <nav className="product-switcher page-width" aria-label={locale === "vi" ? "Chọn sản phẩm VGD" : "Choose a VGD product"}>
      <Link
        className={`product-switcher-link${!activeSlug ? " is-active" : ""}`}
        href={`/${locale}/plugins`}
        aria-current={!activeSlug ? "page" : undefined}
      >
        {locale === "vi" ? "Tất cả" : "All"}
      </Link>
      {previewCatalog.map((product) => (
        <Link
          className={`product-switcher-link${activeSlug === product.slug ? " is-active" : ""}`}
          href={`/${locale}/plugins/${product.slug}`}
          aria-current={activeSlug === product.slug ? "page" : undefined}
          key={product.id}
        >
          {productTabLabel(product)}
        </Link>
      ))}
    </nav>
  );
}