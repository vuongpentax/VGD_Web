import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/page-intro";
import { createMetadata } from "@/lib/seo";
import { isLocale } from "@/lib/i18n";

interface PageProps { params: Promise<{ locale: string }> }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return createMetadata(locale, locale === "vi" ? "Lộ trình" : "Roadmap",
    locale === "vi" ? "Thông tin roadmap VGD đã được duyệt công khai." : "VGD roadmap information approved for public release.", "/roadmap");
}
export default async function RoadmapPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const vi = locale === "vi";
  return <>
    <PageIntro eyebrow={vi ? "ĐỊNH HƯỚNG CÔNG KHAI" : "PUBLIC DIRECTION"}
      title={vi ? "Lộ trình VGD" : "VGD roadmap"}
      description={vi
        ? "Roadmap chỉ hiển thị mục tiêu đã được duyệt để công khai."
        : "The roadmap will show goals that have been approved for public sharing."} />
    <section className="section-block page-width">
      <div className="roadmap-empty">
        <span className="roadmap-mark" aria-hidden="true">—</span>
        <div><p className="eyebrow">{vi ? "CHƯA CÓ MỤC ĐƯỢC DUYỆT" : "NO APPROVED ITEMS YET"}</p>
          <h2>{vi ? "Lộ trình đang được hoàn thiện" : "The roadmap is being prepared"}</h2>
          <p>{vi
            ? "Các hạng mục, mốc thời gian và trạng thái sẽ được thêm sau khi có nội dung được duyệt. Trang này không suy đoán kế hoạch từ source code."
            : "Items, timelines, and statuses will be added after the content is approved. This page does not infer plans from source code."}</p>
        </div>
        <span className="empty-state-tag">{vi ? "Chỉ đọc" : "Read only"}</span>
      </div>
    </section>
  </>;
}
