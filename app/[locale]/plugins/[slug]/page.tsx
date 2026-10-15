import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompatibilityRow } from "@/components/compatibility-row";
import { ConceptArtwork } from "@/components/concept-artwork";
import { MediaGallery } from "@/components/media-gallery";
import { ProductSelector } from "@/components/product-selector";
import { ReleaseBadge } from "@/components/release-badge";
import { createMetadata } from "@/lib/seo";
import { getProduct, previewCatalog } from "@/lib/catalog";
import { isLocale, locales, getUi } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => previewCatalog.map((product) => ({ locale, slug: product.slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const product = getProduct(slug);
  if (!product) return {};
  return createMetadata(locale, product.name,
    locale === "vi" ? "Trang preview sản phẩm VGD; nội dung đang chờ xác nhận." : "VGD product preview; editorial details are awaiting confirmation.",
    "/plugins/" + slug,
  );
}

export default async function ProductPage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const product = getProduct(slug);
  if (!product) notFound();
  const copy = getUi(locale);
  const vi = locale === "vi";

  return (
    <>
      <ProductSelector locale={locale} activeSlug={slug} />
      <section className="product-detail-hero page-width">
        <div className="product-detail-art">
          <ConceptArtwork locale={locale} subject={product.name} />
        </div>
        <div className="product-detail-copy">
          <Link className="back-link" href={"/" + locale + "/plugins"}>← {copy.backToPlugins}</Link>
          <p className="eyebrow">{vi ? "SẢN PHẨM VGD · PREVIEW" : "VGD PRODUCT · PREVIEW"}</p>
          <h1>{product.name}</h1>
          <p className="intro-copy">{product.summary[locale]}</p>
          <div className="product-quick-facts">
            <div><span>{vi ? "Bản phát hành" : "Release"}</span><ReleaseBadge locale={locale} /></div>
            <CompatibilityRow locale={locale} status={{ kind: "pending" }} />
          </div>
          <Link className="button button-primary product-detail-button" href={"/" + locale + "/center"}>
            {vi ? "Tìm hiểu cách dùng VGD Center" : "Learn about VGD Center"}<span aria-hidden="true">↗</span>
          </Link>
          <p className="product-detail-note">
            {vi ? "Việc cài đặt và quản lý plugin sẽ thực hiện trong VGD Center." : "Installation and plugin management will take place in VGD Center."}
          </p>
        </div>
      </section>

      <div className="detail-layout page-width">
        <div className="detail-main">
          <section className="content-section">
            <p className="eyebrow">{vi ? "TỔNG QUAN" : "OVERVIEW"}</p>
            <h2>{vi ? "Thông tin sản phẩm" : "Product information"}</h2>
            <p>{vi
              ? "Nội dung tính năng và workflow sẽ được bổ sung sau khi đối chiếu source production và được duyệt. Trang này chưa mô tả tính năng chưa xác minh."
              : "Feature and workflow copy will be added after checking the production source and receiving review. This page does not describe unverified functionality."}</p>
          </section>
          <section className="content-section content-section-border">
            <p className="eyebrow">{vi ? "HÌNH ẢNH" : "MEDIA"}</p>
            <h2>{vi ? "Hình ảnh sản phẩm" : "Product imagery"}</h2>
            <MediaGallery locale={locale} items={[]} />
          </section>
          <section className="content-section content-section-border">
            <p className="eyebrow">{vi ? "TÀI LIỆU" : "DOCUMENTATION"}</p>
            <h2>{vi ? "Hướng dẫn sẽ được cập nhật" : "Guides will be added"}</h2>
            <p>{vi
              ? "Khi tài liệu được duyệt, bạn sẽ tìm thấy hướng dẫn cài đặt và sử dụng tại đây."
              : "Approved installation and usage guides will be published here."}</p>
            <Link className="text-link" href={"/" + locale + "/docs"}>{vi ? "Mở trung tâm tài liệu" : "Open the docs center"}<span aria-hidden="true">↗</span></Link>
          </section>
        </div>
        <aside className="detail-aside" aria-label={vi ? "Trạng thái sản phẩm" : "Product status"}>
          <p className="eyebrow">{vi ? "TRẠNG THÁI" : "STATUS"}</p>
          <dl className="status-list">
            <div><dt>{vi ? "Bản phát hành" : "Release"}</dt><dd><ReleaseBadge locale={locale} /></dd></div>
            <div><dt>{vi ? "Tương thích" : "Compatibility"}</dt><dd>{copy.compatibility}</dd></div>
            <div><dt>{vi ? "Kênh" : "Channel"}</dt><dd>{vi ? "Đang xác nhận" : "To be confirmed"}</dd></div>
          </dl>
          <p className="aside-note">{vi
            ? "Không hiển thị version, link tải hoặc yêu cầu hệ thống cho tới khi có release metadata đã xác minh."
            : "Version, download links, and system requirements stay hidden until verified release metadata is available."}</p>
        </aside>
      </div>
    </>
  );
}