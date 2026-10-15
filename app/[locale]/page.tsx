import Link from "next/link";
import type { Metadata } from "next";
import { ProductCard } from "@/components/product-card";
import { ReleaseEmptyState } from "@/components/release-empty-state";
import { createMetadata } from "@/lib/seo";
import { isLocale, locales } from "@/lib/i18n";
import { previewCatalog } from "@/lib/catalog";
import { notFound } from "next/navigation";

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

  return (
    <>
      <section className="hero-section page-width">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> VGD / SKETCHUP TOOLKIT</p>
          <h1>{vi ? <>Bộ công cụ VGD<br /><em>cho SketchUp.</em></> : <>VGD tools<br /><em>for SketchUp.</em></>}</h1>
          <p className="hero-lede">
            {vi
              ? "Khám phá công cụ hỗ trợ workflow thiết kế và dựng hình. Tìm hiểu trên website, cài và quản lý bằng VGD Center."
              : "Explore tools for design and modeling workflows. Discover products here, then install and manage them with VGD Center."}
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href={`/${locale}/plugins`}>
              {vi ? "Khám phá catalog" : "Explore the catalog"}<span aria-hidden="true">↗</span>
            </Link>
            <Link className="button button-secondary" href={`/${locale}/center`}>
              {vi ? "VGD Center là gì?" : "What is VGD Center?"}<span aria-hidden="true">→</span>
            </Link>
          </div>
          <p className="hero-footnote">
            <span className="status-dot" aria-hidden="true" />
            {vi ? "Chưa có bản phát hành công khai trong manifest." : "No public releases are available in the manifest yet."}
          </p>
        </div>

        <div className="hero-visual" role="img" aria-label={vi ? "Sơ đồ khái niệm về website và VGD Center" : "Concept diagram of the website and VGD Center"}>
          <div className="visual-grid" aria-hidden="true" />
          <div className="visual-topline"><span>VGD / PRODUCT SYSTEM</span><span>01 — 03</span></div>
          <div className="orbit orbit-one" aria-hidden="true" />
          <div className="orbit orbit-two" aria-hidden="true" />
          <div className="visual-node node-web">
            <span className="node-index">01</span><span className="node-title">Website</span>
            <span className="node-copy">{vi ? "Tìm hiểu · Docs" : "Discover · Docs"}</span>
          </div>
          <div className="visual-node node-center">
            <span className="node-index">02</span><span className="node-title">VGD Center</span>
            <span className="node-copy">{vi ? "Cài · Cập nhật · Gỡ" : "Install · Update · Remove"}</span>
          </div>
          <div className="visual-node node-sketchup">
            <span className="node-index">03</span><span className="node-title">SketchUp</span>
            <span className="node-copy">{vi ? "Quản lý trong ứng dụng" : "Manage in app"}</span>
          </div>
          <div className="visual-caption">{vi ? "SƠ ĐỒ KHÁI NIỆM · KHÔNG PHẢI ẢNH GIAO DIỆN" : "CONCEPT DIAGRAM · NOT A PRODUCT SCREENSHOT"}</div>
        </div>
      </section>

      <section className="section-block page-width" aria-labelledby="catalog-preview-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{vi ? "CÔNG CỤ VGD" : "VGD TOOLKIT"}</p>
            <h2 id="catalog-preview-title">{vi ? "Một hệ công cụ. Nhiều workflow." : "One toolkit. Many workflows."}</h2>
          </div>
          <Link className="arrow-link section-link" href={`/${locale}/plugins`}>
            {vi ? "Xem toàn bộ danh mục" : "View all products"}<span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="product-grid">
          {previewCatalog.map((product) => <ProductCard key={product.id} product={product} locale={locale} />)}
        </div>
      </section>

      <section className="center-feature page-width">
        <div className="center-feature-intro">
          <p className="eyebrow">{vi ? "TRONG SKETCHUP" : "INSIDE SKETCHUP"}</p>
          <h2>{vi ? <>Cài đặt và quản lý<br /><em>ở đúng một nơi.</em></> : <>Install and manage<br /><em>in one place.</em></>}</h2>
          <p>{vi
            ? "VGD Center là extension quản lý plugin. Website giúp bạn khám phá; Center thực hiện cài đặt, cập nhật và gỡ trong SketchUp."
            : "VGD Center is the plugin manager extension. The website helps you discover; Center handles installation, updates, and removal in SketchUp."}</p>
          <Link className="text-link" href={`/${locale}/center`}>{vi ? "Tìm hiểu về Center" : "Learn about Center"}<span aria-hidden="true">↗</span></Link>
        </div>
        <div className="center-steps" aria-label={vi ? "Quy trình sử dụng" : "How it works"}>
          {[
            { n: "01", vi: "Tìm hiểu", en: "Discover", detailVi: "Website VGD", detailEn: "VGD website" },
            { n: "02", vi: "Cài đặt", en: "Install", detailVi: "VGD Center", detailEn: "VGD Center" },
            { n: "03", vi: "Làm việc", en: "Create", detailVi: "SketchUp", detailEn: "SketchUp" },
          ].map((step) => (
            <div className="center-step" key={step.n}>
              <span className="step-number">{step.n}</span>
              <div><strong>{vi ? step.vi : step.en}</strong><span>{vi ? step.detailVi : step.detailEn}</span></div>
              <span className="step-arrow" aria-hidden="true">↗</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section-block page-width">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{vi ? "MỚI NHẤT" : "LATEST"}</p>
            <h2>{vi ? "Release và cập nhật" : "Releases and updates"}</h2>
          </div>
          <Link className="arrow-link section-link" href={`/${locale}/changelog`}>
            {vi ? "Mở changelog" : "Open changelog"}<span aria-hidden="true">↗</span>
          </Link>
        </div>
        <ReleaseEmptyState locale={locale} />
      </section>

      <section className="bottom-links page-width">
        <Link className="bottom-link-card" href={`/${locale}/docs`}>
          <span className="eyebrow">{vi ? "HƯỚNG DẪN" : "GUIDES"}</span>
          <strong>{vi ? "Bắt đầu với VGD" : "Get started with VGD"}</strong>
          <span>{vi ? "Đọc docs và hướng dẫn" : "Read docs and guides"} <i aria-hidden="true">↗</i></span>
        </Link>
        <Link className="bottom-link-card" href={`/${locale}/roadmap`}>
          <span className="eyebrow">{vi ? "ĐANG XÂY DỰNG" : "IN PROGRESS"}</span>
          <strong>{vi ? "Lộ trình sản phẩm" : "Product roadmap"}</strong>
          <span>{vi ? "Xem định hướng đã công khai" : "See the public direction"} <i aria-hidden="true">↗</i></span>
        </Link>
      </section>
    </>
  );
}
