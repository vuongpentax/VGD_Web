"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ReleaseBadge } from "@/components/release-badge";
import { productPath, productShortName } from "@/lib/catalog";
import type { CatalogEntry } from "@/lib/catalog-releases";
import type { Locale } from "@/lib/i18n";

const VISIBLE = 4;

function hashFor(product: CatalogEntry) {
  return productShortName(product).toLowerCase();
}

/**
 * Home page: a pill rail with every plugin (four visible at a time). Picking
 * one, or using the arrows, swaps the panel below and sets the URL hash
 * (#cen, #bim, #cab, ...) so each plugin has a shareable address.
 */
export function HomeShowcase({ products, locale }: { products: CatalogEntry[]; locale: Locale }) {
  const vi = locale === "vi";
  const [index, setIndex] = useState(0);
  const [start, setStart] = useState(0);

  const select = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(products.length - 1, next));
    setIndex(clamped);
    // Slide the window only when the chosen item would fall outside it.
    setStart((current) => {
      if (clamped < current) return clamped;
      if (clamped > current + VISIBLE - 1) return clamped - (VISIBLE - 1);
      return current;
    });
  }, [products.length]);

  // Follow the URL hash, including back/forward navigation and shared links.
  useEffect(() => {
    function fromHash() {
      const key = window.location.hash.replace("#", "").toLowerCase();
      const found = products.findIndex((product) => hashFor(product) === key);
      select(found >= 0 ? found : 0);
    }
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [products, select]);

  function go(next: number) {
    const target = products[Math.max(0, Math.min(products.length - 1, next))];
    if (target) window.location.hash = hashFor(target);
  }

  const product = products[index];
  if (!product) return null;

  const isCenter = product.href === "/center";
  const description = vi ? product.description ?? product.summary.vi : product.summary.en;
  const labels = vi
    ? { previous: "Plugin trước", next: "Plugin tiếp", rail: "Chọn plugin VGD" }
    : { previous: "Previous plugin", next: "Next plugin", rail: "Choose a VGD plugin" };

  return (
    <>
      <div className="scroll-rail">
        <button className="scroll-rail-arrow" type="button" aria-label={labels.previous} disabled={index === 0} onClick={() => go(index - 1)}>
          <span aria-hidden="true">‹</span>
        </button>
        <div className="scroll-rail-track">
          <nav
            className="rail-list"
            aria-label={labels.rail}
            style={{ transform: `translateX(calc(-100% * ${start} / ${VISIBLE}))`, transition: "transform .25s ease" }}
          >
            {products.map((item, itemIndex) => (
              <a
                key={item.id}
                className={"rail-item" + (itemIndex === index ? " is-active" : "")}
                href={"#" + hashFor(item)}
                aria-current={itemIndex === index ? "true" : undefined}
              >
                {productShortName(item)}
              </a>
            ))}
          </nav>
        </div>
        <button className="scroll-rail-arrow" type="button" aria-label={labels.next} disabled={index === products.length - 1} onClick={() => go(index + 1)}>
          <span aria-hidden="true">›</span>
        </button>
      </div>

      <p className="home-tagline">
        {vi
          ? "Cài đặt, cập nhật và quản lý các plugin VGD ngay trong SketchUp bằng VGD Center."
          : "Install, update, and manage VGD plugins inside SketchUp with VGD Center."}
      </p>

      <section className="home-panel" aria-live="polite" aria-labelledby="home-product-name">
        <span className="product-card-tile product-card-logo" aria-hidden="true">
          {product.icon ? <img src={product.icon} alt="" width={64} height={64} /> : productShortName(product)}
        </span>
        <h2 id="home-product-name">{product.name}</h2>
        <p className="home-description">{description}</p>
        <Link className="button button-primary showcase-button" href={"/" + locale + "/center"}>
          {isCenter
            ? (vi ? "Tìm hiểu VGD Center" : "Learn about VGD Center")
            : (vi ? "Cài bằng VGD Center" : "Install with VGD Center")}
          {" "}<span aria-hidden="true">↗</span>
        </Link>
        <ReleaseBadge locale={locale} release={product.release} />
        {!isCenter && (
          <Link className="showcase-text-link" href={"/" + locale + productPath(product)}>
            {vi ? "Xem chi tiết" : "View details"} <span aria-hidden="true">›</span>
          </Link>
        )}
      </section>
    </>
  );
}
