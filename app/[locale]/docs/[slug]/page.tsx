import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/page-intro";
import { createMetadata } from "@/lib/seo";
import { getGuide, guideSlugs } from "@/lib/docs";
import { isLocale, locales } from "@/lib/i18n";

interface PageProps { params: Promise<{ locale: string; slug: string }> }

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((locale) => guideSlugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const guide = getGuide(slug);
  return guide ? createMetadata(locale, guide.title[locale], guide.description[locale], "/docs/" + slug) : {};
}

export default async function GuidePage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const guide = getGuide(slug);
  if (!guide) notFound();
  const vi = locale === "vi";
  return <>
    <div className="product-detail-top page-width"><Link className="back-link" href={"/" + locale + "/docs"}>← {vi ? "Tất cả tài liệu" : "All documentation"}</Link></div>
    <PageIntro eyebrow={vi ? "HƯỚNG DẪN · PREVIEW" : "GUIDE · PREVIEW"} title={guide.title[locale]} description={guide.description[locale]} />
    <article className="guide-content page-width">
      {guide.sections.map((section, index) => <section className="content-section" key={section.id}>
        <p className="eyebrow">{String(index + 1).padStart(2, "0")}</p>
        <h2>{section.heading[locale]}</h2>
        {section.blocks[locale].map((block, blockIndex) => block.type === "paragraph"
          ? <p key={section.id + "-paragraph-" + blockIndex}>{block.text}</p>
          : <ul className="guide-list" key={section.id + "-list-" + blockIndex}>
              {block.items.map((item, itemIndex) => <li key={section.id + "-item-" + itemIndex}>{item}</li>)}
            </ul>)}
      </section>)}
      <div className="guide-callout">
        <strong>{vi ? "Trạng thái release" : "Release status"}</strong>
        <span>{vi ? "Chưa có bản phát hành. Link tải và bước cài đặt cụ thể chưa được công bố." : "No release is available yet. A download link and specific installation steps have not been published."}</span>
        <Link className="text-link" href={"/" + locale + "/center"}>{vi ? "Xem trạng thái VGD Center" : "View VGD Center status"}<span aria-hidden="true">↗</span></Link>
      </div>
    </article>
  </>;
}
