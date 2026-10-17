import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { previewCatalog, productPath, productShortName, publishedCatalog } from "@/lib/catalog";
import { publicationReady } from "@/lib/site";
import { ScrollRail } from "@/components/scroll-rail";

export function ProductSelector({
  locale,
  activeSlug,
}: {
  locale: Locale;
  activeSlug?: string;
}) {
  const products = publicationReady ? publishedCatalog : previewCatalog;
  return (
    <ScrollRail locale={locale}>
      <nav className="rail-list" aria-label={locale === "vi" ? "Chọn sản phẩm VGD" : "Choose a VGD product"}>
        {products.map((product) => (
          <Link
            className={`rail-item${activeSlug === product.slug ? " is-active" : ""}`}
            href={`/${locale}${productPath(product)}`}
            aria-current={activeSlug === product.slug ? "page" : undefined}
            key={product.id}
          >
            {productShortName(product)}
          </Link>
        ))}
      </nav>
    </ScrollRail>
  );
}
