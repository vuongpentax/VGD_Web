import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConceptArtwork } from "@/components/concept-artwork";
import { ProductCard } from "@/components/product-card";
import { ProductSelector } from "@/components/product-selector";
import { ReleaseEmptyState } from "@/components/release-empty-state";
import { createMetadata } from "@/lib/seo";
import { isLocale } from "@/lib/i18n";
import { previewCatalog, publishedCatalog } from "@/lib/catalog";
import { withReleases } from "@/lib/catalog-releases";
import { publicationReady } from "@/lib/site";

interface HomeProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomeProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return createMetadata(
    locale,
    locale === "vi" ? "Công cụ VGD cho SketchUp" : "VGD tools for SketchUp",
    locale === "vi"
      ? "Tìm hiểu sản phẩm, docs và cập nhật của hệ công cụ VGD."
      : "Explore products, docs, and updates from the VGD toolkit.",
  );
}

export default async function HomePage({ params }: HomeProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const vi = locale === "vi";
  const products = await withReleases(publicationReady ? publishedCatalog : previewCatalog);

  return (
    <>
      <ProductSelector locale={locale} />
      <section className="showcase-section page-width" aria-labelledby="home-title">
        <p className="showcase-kicker">VGD / SKETCHUP TOOLKIT</p>
        <p className="showcase-subtitle">
          {vi
            ? "Khám phá sản phẩm trên website. Cài đặt và quản lý trong SketchUp bằng VGD Center."
            : "Explore products on the website. Install and manage them inside SketchUp with VGD Center."}
        </p>
        <div className="showcase-columns">
          <div className="showcase-product">
            <ConceptArtwork locale={locale} subject="VGD" />
            <h1 id="home-title">{vi ? "Bộ công cụ VGD" : "The VGD toolkit"}<span>{vi ? "cho SketchUp" : "for SketchUp"}</span></h1>
            <p className="showcase-description">
              {vi
                ? "Tìm hiểu các plugin trong danh mục preview và xem tài liệu đã có. Nội dung từng sản phẩm sẽ được xác nhận trước khi công khai."
                : "Explore the preview plugin catalog and available guides. Product details will be verified before publication."}
            </p>
            <Link className="showcase-text-link" href={"/" + locale + "/docs"}>
              {vi ? "Xem tài liệu" : "Read the guides"} <span aria-hidden="true">›</span>
            </Link>
            <Link className="button button-primary showcase-button" href={"/" + locale + "/plugins"}>
              {vi ? "Khám phá sản phẩm VGD" : "Explore VGD products"} <span aria-hidden="true">↗</span>
            </Link>
            <p className="showcase-note"><span className="status-dot" aria-hidden="true" />{vi ? "Chưa có bản phát hành" : "No release available yet"}</p>
          </div>
          <div className="showcase-center">
            <div className="showcase-steps" aria-label={vi ? "Hành trình sử dụng VGD" : "Using VGD"}>
              <div><strong>01</strong><span>{vi ? "Tìm hiểu" : "Explore"}</span></div>
              <div><strong>02</strong><span>{vi ? "Cài trong Center" : "Install in Center"}</span></div>
              <div><strong>03</strong><span>{vi ? "Quản lý" : "Manage"}</span></div>
            </div>
            <h2>VGD Center</h2>
            <p className="showcase-description">
              {vi
                ? "Center là extension quản lý việc cài đặt, cập nhật và gỡ plugin bên trong SketchUp."
                : "Center is the extension for installing, updating, and removing plugins inside SketchUp."}
            </p>
            <Link className="showcase-text-link" href={"/" + locale + "/docs"}>
              {vi ? "Xem hướng dẫn" : "Read the guide"} <span aria-hidden="true">›</span>
            </Link>
            <Link className="button button-primary showcase-button" href={"/" + locale + "/center"}>
              {vi ? "Tìm hiểu VGD Center" : "Learn about VGD Center"} <span aria-hidden="true">↗</span>
            </Link>
            <p className="showcase-note"><span className="status-dot" aria-hidden="true" />{vi ? "Chưa có bản phát hành" : "No release available yet"}</p>
          </div>
        </div>
      </section>

      <section className="section-block page-width" aria-labelledby="catalog-preview-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{vi ? "DANH MỤC PREVIEW" : "PREVIEW CATALOG"}</p>
            <h2 id="catalog-preview-title">{vi ? "Khám phá công cụ VGD" : "Explore VGD tools"}</h2>
          </div>
          <Link className="arrow-link section-link" href={"/" + locale + "/plugins"}>
            {vi ? "Xem toàn bộ danh mục" : "View all products"}<span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="product-grid">
          {products.map((product) => <ProductCard key={product.id} product={product} locale={locale} />)}
        </div>
      </section>

      <section className="section-block page-width">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{vi ? "PHÁT HÀNH" : "RELEASES"}</p>
            <h2>{vi ? "Bản phát hành và cập nhật" : "Releases and updates"}</h2>
          </div>
          <Link className="arrow-link section-link" href={"/" + locale + "/changelog"}>
            {vi ? "Mở changelog" : "Open changelog"}<span aria-hidden="true">↗</span>
          </Link>
        </div>
        <ReleaseEmptyState locale={locale} />
      </section>

      <section className="bottom-links page-width">
        <Link className="bottom-link-card" href={"/" + locale + "/docs"}>
          <span className="eyebrow">{vi ? "HƯỚNG DẪN" : "GUIDES"}</span>
          <strong>{vi ? "Bắt đầu với VGD" : "Get started with VGD"}</strong>
          <span>{vi ? "Đọc docs và hướng dẫn" : "Read docs and guides"} <i aria-hidden="true">↗</i></span>
        </Link>
        <Link className="bottom-link-card" href={"/" + locale + "/roadmap"}>
          <span className="eyebrow">{vi ? "ĐANG XÂY DỰNG" : "IN PROGRESS"}</span>
          <strong>{vi ? "Lộ trình sản phẩm" : "Product roadmap"}</strong>
          <span>{vi ? "Xem định hướng đã công khai" : "See the public direction"} <i aria-hidden="true">↗</i></span>
        </Link>
      </section>
    </>
  );
}