"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import type { PreviewProduct } from "@/lib/catalog";
import type { Locale } from "@/lib/i18n";
import { getUi } from "@/lib/i18n";

export function CatalogSearch({ products, locale }: { products: PreviewProduct[]; locale: Locale }) {
  const copy = getUi(locale);
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase(locale);
    if (!normalized) return products;
    return products.filter((product) => product.name.toLocaleLowerCase(locale).includes(normalized));
  }, [locale, products, query]);

  return (
    <div className="catalog-wrap page-width">
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
        <p className="catalog-count">
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
        </div>
      )}
    </div>
  );
}
