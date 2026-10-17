import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getUi } from "@/lib/i18n";
import { productPath, productShortName } from "@/lib/catalog";
import type { CatalogEntry } from "@/lib/catalog-releases";
import { ReleaseBadge } from "@/components/release-badge";

export function ProductCard({ product, locale }: { product: CatalogEntry; locale: Locale }) {
  const copy = getUi(locale);
  const shortName = productShortName(product);

  return (
    <article className="product-card">
      <Link className="product-card-media" href={"/" + locale + productPath(product)} aria-label={copy.details + ": " + product.name}>
        <span className="product-card-media-label">VGD / PREVIEW</span>
        <span className="product-card-tiles" aria-hidden="true">
          <span className="product-card-tile product-card-logo">
            {product.icon ? <img src={product.icon} alt="" width={64} height={64} /> : shortName}
          </span>
        </span>
        <span className="product-card-media-note">{locale === "vi" ? "Chờ ảnh giới thiệu từ VGD" : "Product imagery pending from VGD"}</span>
      </Link>
      <div className="product-card-body">
        <div className="product-card-top">
          <span className="pending-copy">{copy.pending}</span>
          <ReleaseBadge locale={locale} release={product.release} />
        </div>
        <div className="product-card-copy">
          <h3>{product.name}</h3>
          <p>{product.summary[locale]}</p>
        </div>
        <div className="product-card-bottom">
          <Link className="arrow-link" href={"/" + locale + productPath(product)}>
            {copy.details}<span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </article>
  );
}