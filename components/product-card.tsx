import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getUi } from "@/lib/i18n";
import { productTabLabel, type PreviewProduct } from "@/lib/catalog";
import { ReleaseBadge } from "@/components/release-badge";

export function ProductCard({ product, locale }: { product: PreviewProduct; locale: Locale }) {
  const copy = getUi(locale);
  const monogram = productTabLabel(product).replace(/[^A-Z\p{L}]/gu, "").slice(0, 2).toUpperCase();

  return (
    <article className="product-card">
      <Link className="product-card-media" href={"/" + locale + "/plugins/" + product.slug} aria-label={copy.details + ": " + product.name}>
        <span className="product-card-media-label">VGD / PREVIEW</span>
        <span className="product-card-tiles" aria-hidden="true">
          {Array.from({ length: 8 }, (_, index) => (
            <span className={"product-card-tile" + (index === 0 ? " is-marked" : "")} key={index}>
              {index === 0 ? (product.icon ? <img src={product.icon} alt="" width={40} height={40} /> : monogram) : ""}
            </span>
          ))}
        </span>
        <span className="product-card-media-note">{locale === "vi" ? "Chờ ảnh giới thiệu từ VGD" : "Product imagery pending from VGD"}</span>
      </Link>
      <div className="product-card-body">
        <div className="product-card-top">
          <span className="pending-copy">{copy.pending}</span>
          <ReleaseBadge locale={locale} />
        </div>
        <div className="product-card-copy">
          <h3>{product.name}</h3>
          <p>{product.summary[locale]}</p>
        </div>
        <div className="product-card-bottom">
          <Link className="arrow-link" href={"/" + locale + "/plugins/" + product.slug}>
            {copy.details}<span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </article>
  );
}