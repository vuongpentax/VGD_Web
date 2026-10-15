import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/page-intro";
import { createMetadata } from "@/lib/seo";
import { guides } from "@/lib/docs";
import { isLocale } from "@/lib/i18n";

interface PageProps { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return createMetadata(locale, locale === "vi" ? "Tài liệu" : "Docs",
    locale === "vi" ? "Hướng dẫn sử dụng website và hệ công cụ VGD." : "Guides to the VGD website and toolkit.", "/docs");
}

export default async function DocsPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const vi = locale === "vi";
  return <>
    <PageIntro eyebrow={vi ? "TRUNG TÂM TÀI LIỆU" : "DOCUMENTATION"}
      title={vi ? "Tài liệu VGD" : "VGD documentation"}
      description={vi ? "Hướng dẫn về website, VGD Center và trạng thái phát hành." : "Guides to the website, VGD Center, and release status."} />
    <section className="section-block page-width">
      <div className="docs-grid">
        {guides.map((guide, index) => <Link className="doc-card" key={guide.slug} href={`/${locale}/docs/${guide.slug}`}>
          <span className="doc-index">0{index + 1}</span>
          <div><h2>{guide.title[locale]}</h2><p>{guide.description[locale]}</p></div>
          <span className="doc-arrow" aria-hidden="true">↗</span>
        </Link>)}
      </div>
      <p className="editorial-note">{vi
        ? "Tài liệu hiện ở trạng thái preview. Hướng dẫn cài đặt cụ thể sẽ được bổ sung cùng release đã xác minh."
        : "Documentation is currently in preview. Specific installation steps will be added with a verified release."}</p>
    </section>
  </>;
}
