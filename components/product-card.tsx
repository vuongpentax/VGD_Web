import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getUi } from "@/lib/i18n";
import type { PreviewProduct } from "@/lib/catalog";

export function ProductCard({ product, locale }: { product: PreviewProduct; locale: Locale }) {
  const copy = getUi(locale);
  const monogram = product.name.replace(/[^A-Z\p{L}]/gu, "").slice(0, 2).toUpperCase();
  return (
    <article className="product-card">
      <div className="product-card-top">
        <span className="product-mark" aria-hidden="true">{monogram}</span>
        <span className="status-pill status-pill-muted">
          <span className="status-dot" aria-hidden="true" />
          {copy.noRelease}
        </span>
      </div>
      <div className="product-card-copy">
        <h3>{product.name}</h3>
        <p>{product.summary[locale]}</p>
      </div>
      <div className="product-card-bottom">
        <span className="pending-copy">{copy.pending}</span>
        <Link className="arrow-link" href={`/${locale}/plugins/${product.slug}`}>
          {copy.details}<span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}
