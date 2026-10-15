import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/page-intro";
import { createMetadata } from "@/lib/seo";
import { isLocale, type Locale } from "@/lib/i18n";

interface PageProps { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return createMetadata(locale, "VGD Center", locale === "vi"
    ? "Tìm hiểu vai trò của VGD Center trong việc quản lý plugin bên trong SketchUp."
    : "Learn how VGD Center manages plugins inside SketchUp.", "/center");
}

export default async function CenterPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const vi = locale === "vi";
  const steps: Array<{ number: string; title: string; body: string }> = vi ? [
    { number: "01", title: "Khám phá", body: "Đọc thông tin sản phẩm và hướng dẫn trên website VGD." },
    { number: "02", title: "Quản lý trong SketchUp", body: "VGD Center là extension dành cho cài đặt, cập nhật và gỡ plugin VGD." },
    { number: "03", title: "Tiếp tục workflow", body: "Sau khi có release chính thức, Center sẽ dùng metadata phát hành chung để quản lý plugin." },
  ] : [
    { number: "01", title: "Discover", body: "Read product information and guides on the VGD website." },
    { number: "02", title: "Manage inside SketchUp", body: "VGD Center is the extension for installing, updating, and removing VGD plugins." },
    { number: "03", title: "Continue your workflow", body: "Once official releases are available, Center will use the shared release metadata to manage plugins." },
  ];

  return <>
    <PageIntro
      eyebrow={vi ? "EXTENSION QUẢN LÝ · SKETCHUP" : "PLUGIN MANAGER · SKETCHUP"}
      title="VGD Center"
      description={vi
        ? "Website giúp bạn tìm hiểu. VGD Center quản lý cài đặt, cập nhật và gỡ plugin bên trong SketchUp."
        : "The website helps you explore. VGD Center manages plugin installation, updates, and removal inside SketchUp."}
    >
      <div className="detail-actions">
        <span className="status-pill status-pill-muted"><span className="status-dot" aria-hidden="true" />{vi ? "Chưa có bản phát hành" : "No release available yet"}</span>
        <span className="button button-disabled" aria-disabled="true">{vi ? "Chưa có link tải chính thức" : "Official download not available"}</span>
      </div>
    </PageIntro>

    <section className="section-block page-width">
      <div className="section-heading">
        <div><p className="eyebrow">{vi ? "VAI TRÒ CỦA CENTER" : "WHAT CENTER DOES"}</p>
          <h2>{vi ? "Quản lý plugin trong SketchUp" : "Manage plugins inside SketchUp"}</h2></div>
      </div>
      <div className="center-steps center-steps-large">
        {steps.map((step) => <article className="center-step" key={step.number}>
          <span className="step-number">{step.number}</span>
          <div><strong>{step.title}</strong><span>{step.body}</span></div>
          <span className="step-arrow" aria-hidden="true">↗</span>
        </article>)}
      </div>
    </section>

    <section className="section-block page-width">
      <div className="release-empty" aria-labelledby="center-release-title">
        <div className="release-empty-symbol" aria-hidden="true">!</div>
        <div><p className="eyebrow">VGD CENTER</p>
          <h2 id="center-release-title">{vi ? "Chưa có bản phát hành" : "No release available yet"}</h2>
          <p>{vi
            ? "Link tải chính thức sẽ chỉ xuất hiện sau khi release Center được xác minh và công bố. Không dùng gói RBZ hoặc URL chưa được xác nhận."
            : "The official download link will appear after a VGD Center release is verified and published. Do not use an unverified RBZ package or URL."}</p>
        </div>
        <span className="empty-state-tag">{vi ? "Đang xác nhận" : "Pending verification"}</span>
      </div>
      <div className="inline-link-row">
        <Link className="text-link" href={`/${locale}/docs/cai-vgd-center`}>{vi ? "Đọc hướng dẫn tổng quan" : "Read the overview guide"}<span aria-hidden="true">↗</span></Link>
        <Link className="text-link" href={`/${locale}/plugins`}>{vi ? "Duyệt danh mục plugin" : "Browse the plugin catalog"}<span aria-hidden="true">↗</span></Link>
      </div>
    </section>
  </>;
}
