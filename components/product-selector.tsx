import Link from "next/link";
import { ScrollRail } from "@/components/scroll-rail";
import type { Locale } from "@/lib/i18n";
import { previewCatalog, publishedCatalog, productTabLabel } from "@/lib/catalog";
import { publicationReady } from "@/lib/site";

export function ProductSelector({
  locale,
  activeSlug,
}: {
  locale: Locale;
  activeSlug?: string;
}) {
  const products = publicationReady ? publishedCatalog : previewCatalog;
  return (
    <ScrollRail className="product-switcher page-width" label={locale === "vi" ? "Chọn sản phẩm VGD" : "Choose a VGD product"}>
      <Link
        className={`product-switcher-link${!activeSlug ? " is-active" : ""}`}
        href={`/${locale}/plugins`}
        aria-current={!activeSlug ? "page" : undefined}
      >
        {locale === "vi" ? "Tất cả" : "All"}
      </Link>
      {products.map((product) => (
        <Link
          className={`product-switcher-link${activeSlug === product.slug ? " is-active" : ""}`}
          href={`/${locale}/plugins/${product.slug}`}
          aria-current={activeSlug === product.slug ? "page" : undefined}
          key={product.id}
        >
          {productTabLabel(product)}
        </Link>
      ))}
    </ScrollRail>
  );
}