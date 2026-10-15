import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogSearch } from "@/components/catalog-search";
import { PageIntro } from "@/components/page-intro";
import { createMetadata } from "@/lib/seo";
import { isLocale, locales, getUi } from "@/lib/i18n";
import { previewCatalog } from "@/lib/catalog";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return createMetadata(locale,
    locale === "vi" ? "Plugin VGD" : "VGD plugins",
    locale === "vi" ? "Danh mục seed đang chờ xác nhận từ registry production." : "The planning-seed catalog is awaiting confirmation from the production registry.",
    "/plugins",
  );
}

export default async function PluginsPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getUi(locale);

  return (
    <>
      <PageIntro
        eyebrow={locale === "vi" ? "DANH MỤC" : "CATALOG"}
        title={locale === "vi" ? "Công cụ cho workflow của bạn." : "Tools for your workflow."}
        description={locale === "vi"
          ? "Các sản phẩm dưới đây là seed từ planning. Mô tả, roster và trạng thái phát hành sẽ được xác nhận trước khi website công khai."
          : "The products below are planning seeds. Descriptions, roster, and release status will be verified before the website is published."}
      >
        <div className="intro-meta-row">
          <span className="status-pill status-pill-muted"><span className="status-dot" aria-hidden="true" />{copy.noRelease}</span>
          <span>{locale === "vi" ? "Không có version hoặc tương thích giả" : "No invented versions or compatibility claims"}</span>
        </div>
      </PageIntro>
      <CatalogSearch products={previewCatalog} locale={locale} />
    </>
  );
}
