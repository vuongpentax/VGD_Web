import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/page-intro";
import { createMetadata } from "@/lib/seo";
import { getGuide, guideSlugs, guides, publishedGuideSlugs, publishedGuides } from "@/lib/docs";
import { publicationReady } from "@/lib/site";
import { isLocale, locales } from "@/lib/i18n";

interface PageProps { params: Promise<{ locale: string; slug: string[] }> }

export const dynamicParams = false;

export function generateStaticParams() {
  const routeSlugs = publicationReady ? publishedGuideSlugs : guideSlugs;
  return locales.flatMap((locale) => routeSlugs.map((slug) => ({ locale, slug: slug.split("/") })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const slugPath = slug.map(encodeURIComponent).join("/");
  const guide = getGuide(slug.join("/"));
  return guide ? createMetadata(locale, guide.title[locale], guide.description[locale], "/docs/" + slugPath) : {};
}

export default async function GuidePage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || slug.length === 0) notFound();
  const slugPath = slug.join("/");
  const guide = getGuide(slugPath);
  if (!guide) notFound();

  const vi = locale === "vi";
  const visibleGuides = publicationReady ? publishedGuides : guides;
  const currentIndex = visibleGuides.findIndex((item) => item.slug === guide.slug);
  const previousGuide = currentIndex > 0 ? guides[currentIndex - 1] : undefined;
  const nextGuide = currentIndex >= 0 && currentIndex < visibleGuides.length - 1 ? visibleGuides[currentIndex + 1] : undefined;
  const localizedPath = (targetSlug: string) =>
    "/" + locale + "/docs/" + targetSlug.split("/").map(encodeURIComponent).join("/");

  return <>
    <nav className="guide-breadcrumbs page-width" aria-label={vi ? "Đường dẫn tài liệu" : "Documentation breadcrumb"}>
      <ol>
        <li><Link href={"/" + locale}>{vi ? "Trang chủ" : "Home"}</Link></li>
        <li><Link href={"/" + locale + "/docs"}>{vi ? "Tài liệu" : "Docs"}</Link></li>
        <li><span aria-current="page">{guide.title[locale]}</span></li>
      </ol>
    </nav>
    <PageIntro eyebrow={vi ? "HƯỚNG DẪN · PREVIEW" : "GUIDE · PREVIEW"} title={guide.title[locale]} description={guide.description[locale]} />
    <div className="guide-layout page-width">
      <article className="guide-content">
        {guide.sections.map((section, index) => <section className="content-section" id={section.id} key={section.id}>
          <p className="eyebrow">{String(index + 1).padStart(2, "0")}</p>
          <h2>{section.heading[locale]}</h2>
          {section.blocks[locale].map((block, blockIndex) => block.type === "paragraph"
            ? <p key={section.id + "-paragraph-" + blockIndex}>{block.text}</p>
            : <ul className="guide-list" key={section.id + "-list-" + blockIndex}>
                {block.items.map((item, itemIndex) => <li key={section.id + "-item-" + itemIndex}>{item}</li>)}
              </ul>)}
        </section>)}
        <nav className="guide-pagination" aria-label={vi ? "Điều hướng tài liệu" : "Guide navigation"}>
          {previousGuide
            ? <Link href={localizedPath(previousGuide.slug)} rel="prev"><span>{vi ? "Tài liệu trước" : "Previous guide"}</span><strong>{previousGuide.title[locale]}</strong></Link>
            : <span className="guide-pagination-empty" />}
          {nextGuide
            ? <Link href={localizedPath(nextGuide.slug)} rel="next"><span>{vi ? "Tài liệu tiếp theo" : "Next guide"}</span><strong>{nextGuide.title[locale]}</strong></Link>
            : <span className="guide-pagination-empty" />}
        </nav>
      </article>
      <aside className="guide-aside">
        <nav className="guide-sidebar" aria-label={vi ? "Danh sách tài liệu" : "Documentation index"}>
          <h2>{vi ? "Trong tài liệu" : "Documentation"}</h2>
          <ol>
            {visibleGuides.map((item) => <li key={item.slug}>
              <Link href={localizedPath(item.slug)} aria-current={item.slug === guide.slug ? "page" : undefined}>
                {item.title[locale]}
              </Link>
            </li>)}
          </ol>
        </nav>
        <div className="guide-callout">
          <strong>{vi ? "Trạng thái release" : "Release status"}</strong>
          <span>{vi ? "Chưa có bản phát hành. Link tải và bước cài đặt cụ thể chưa được công bố." : "No release is available yet. A download link and specific installation steps have not been published."}</span>
          <Link className="text-link" href={"/" + locale + "/center"}>{vi ? "Xem trạng thái VGD Center" : "View VGD Center status"}<span aria-hidden="true">↗</span></Link>
        </div>
      </aside>
    </div>
  </>;
}
