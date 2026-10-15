import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/page-intro";
import { ChangelogFeed } from "@/components/changelog-entry";
import { createMetadata } from "@/lib/seo";
import { isLocale } from "@/lib/i18n";

interface PageProps { params: Promise<{ locale: string }> }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return createMetadata(locale, locale === "vi" ? "Cập nhật" : "Changelog",
    locale === "vi" ? "Lịch sử các bản phát hành VGD đã được công bố." : "History of published VGD releases.", "/changelog");
}
export default async function ChangelogPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const vi = locale === "vi";
  return <>
    <PageIntro eyebrow={vi ? "RELEASE HISTORY" : "RELEASE HISTORY"}
      title={vi ? "Cập nhật sản phẩm" : "Product updates"}
      description={vi
        ? "Chỉ release đã công bố từ nguồn metadata dùng chung mới xuất hiện tại đây."
        : "Only published releases from the shared metadata source will appear here."} />
    <section className="section-block page-width"><ChangelogFeed locale={locale} entries={[]} />
      <p className="editorial-note">{vi
        ? "Không có version hoặc ghi chú release nào được dựng từ tên file hay source code."
        : "No versions or release notes are inferred from filenames or source code."}</p>
    </section>
  </>;
}
