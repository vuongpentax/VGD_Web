"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { ScrollRail } from "@/components/scroll-rail";
import { productTabLabel, type PreviewProduct } from "@/lib/catalog";
import type { Locale } from "@/lib/i18n";
import { getUi } from "@/lib/i18n";

export function CatalogSearch({ products, locale }: { products: PreviewProduct[]; locale: Locale }) {
  const copy = getUi(locale);
  const [query, setQuery] = useState("");
  const [activeProduct, setActiveProduct] = useState<string | null>(null);
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase(locale);
    return products.filter((product) => {
      const matchesProduct = activeProduct === null || product.slug === activeProduct;
      const matchesQuery = !normalized || product.name.toLocaleLowerCase(locale).includes(normalized);
      return matchesProduct && matchesQuery;
    });
  }, [activeProduct, locale, products, query]);

  return (
    <div className="catalog-wrap page-width">
      <ScrollRail className="catalog-filters" label={locale === "vi" ? "Lọc theo sản phẩm" : "Filter by product"}>
        <button className={"product-pill" + (activeProduct === null ? " product-pill-active" : "")} type="button" aria-pressed={activeProduct === null} onClick={() => setActiveProduct(null)}>
          {locale === "vi" ? "Tất cả" : "All"}
        </button>
        {products.map((product) => (
          <button
            className={"product-pill" + (activeProduct === product.slug ? " product-pill-active" : "")}
            type="button"
            key={product.id}
            aria-pressed={activeProduct === product.slug}
            onClick={() => setActiveProduct(product.slug)}
          >
            {productTabLabel(product)}
          </button>
        ))}
      </ScrollRail>
      <header className="catalog-intro">
        <p className="eyebrow">{locale === "vi" ? "DANH MỤC VGD · PREVIEW" : "VGD CATALOG · PREVIEW"}</p>
        <h1>{locale === "vi" ? "Công cụ cho workflow của bạn" : "Tools for your workflow"}</h1>
        <p>{locale === "vi"
          ? "Danh mục hiện là seed từ planning. Tên, mô tả và trạng thái phát hành sẽ được đối chiếu trước khi công khai."
          : "This catalog currently uses planning seeds. Names, descriptions, and release status will be verified before publication."}</p>
        <span className="status-pill status-pill-muted"><span className="status-dot" aria-hidden="true" />{copy.noRelease}</span>
      </header>
      <div className="catalog-tools">
        <label className="search-field">
          <span className="search-icon" aria-hidden="true">⌕</span>
          <span className="sr-only">{copy.searchLabel}</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.searchPlaceholder}
            aria-label={copy.searchLabel}
          />
        </label>
        <p className="catalog-count" aria-live="polite">
          {filtered.length} {locale === "vi" ? "sản phẩm trong seed" : "products in planning seed"}
        </p>
      </div>
      {filtered.length > 0 ? (
        <div className="product-grid">
          {filtered.map((product) => <ProductCard key={product.id} product={product} locale={locale} />)}
        </div>
      ) : (
        <div className="empty-state empty-state-compact" role="status">
          <p>{copy.noSearchResults}</p>
          <button className="button button-secondary" type="button" onClick={() => { setQuery(""); setActiveProduct(null); }}>
            {locale === "vi" ? "Xóa bộ lọc" : "Clear filters"}
          </button>
        </div>
      )}
    </div>
  );
}