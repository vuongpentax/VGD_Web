import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/page-intro";
import { createMetadata } from "@/lib/seo";
import { isLocale } from "@/lib/i18n";

interface PageProps { params: Promise<{ locale: string }> }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return createMetadata(locale, locale === "vi" ? "Về VGD" : "About VGD",
    locale === "vi" ? "Thông tin về hệ công cụ VGD cho SketchUp." : "About the VGD toolkit for SketchUp.", "/about");
}
export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const vi = locale === "vi";
  return <>
    <PageIntro eyebrow={vi ? "VỀ HỆ CÔNG CỤ" : "ABOUT THE TOOLKIT"}
      title={vi ? "VGD cho SketchUp" : "VGD for SketchUp"}
      description={vi
        ? "VGD Web là nơi khám phá sản phẩm, đọc tài liệu và theo dõi thông tin phát hành của hệ plugin VGD."
        : "VGD Web is where you explore products, read documentation, and follow release information for the VGD plugin toolkit."} />
    <section className="section-block page-width about-grid">
      <article className="about-panel about-panel-dark">
        <span className="eyebrow">01 / WEBSITE</span>
        <h2>{vi ? "Tìm hiểu và chọn công cụ" : "Explore and choose tools"}</h2>
        <p>{vi ? "Website giới thiệu catalog, docs, changelog và roadmap. Website không cài plugin trực tiếp." : "The website presents the catalog, docs, changelog, and roadmap. It does not install plugins directly."}</p>
      </article>
      <article className="about-panel">
        <span className="eyebrow">02 / VGD CENTER</span>
        <h2>{vi ? "Quản lý ngay trong SketchUp" : "Manage inside SketchUp"}</h2>
        <p>{vi ? "VGD Center tiếp tục là extension quản lý cài đặt, cập nhật và gỡ plugin." : "VGD Center remains the extension for installing, updating, and removing plugins."}</p>
      </article>
    </section>
  </>;
}
