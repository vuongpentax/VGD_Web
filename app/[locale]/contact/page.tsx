import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/page-intro";
import { createMetadata } from "@/lib/seo";
import { isLocale } from "@/lib/i18n";

interface PageProps { params: Promise<{ locale: string }> }
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return createMetadata(locale, locale === "vi" ? "Liên hệ" : "Contact",
    locale === "vi" ? "Thông tin liên hệ chính thức của VGD sẽ được cập nhật tại đây." : "Official VGD contact information will be published here.", "/contact");
}
export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const vi = locale === "vi";
  return <>
    <PageIntro eyebrow={vi ? "LIÊN HỆ VGD" : "CONTACT VGD"}
      title={vi ? "Kết nối với VGD" : "Get in touch with VGD"}
      description={vi
        ? "Kênh liên hệ sẽ được công bố sau khi xác nhận thông tin chính thức."
        : "Contact channels will be listed once the official information is confirmed."} />
    <section className="section-block page-width">
      <div className="contact-panel">
        <span className="contact-icon" aria-hidden="true">↗</span>
        <div><p className="eyebrow">{vi ? "THÔNG TIN CHÍNH THỨC" : "OFFICIAL INFORMATION"}</p>
          <h2>{vi ? "Chưa có kênh liên hệ được xác nhận" : "No verified contact channel yet"}</h2>
          <p>{vi ? "Email, biểu mẫu hoặc mạng xã hội sẽ chỉ được thêm khi chủ dự án cung cấp và xác nhận." : "Email, a form, or social channels will be added only after they are provided and verified by the project owner."}</p>
          <Link className="text-link" href="https://github.com/vuongpentax/VGD_Plugins" target="_blank" rel="noreferrer noopener">{vi ? "Xem repo production trên GitHub" : "View the production repository on GitHub"}<span aria-hidden="true">↗</span></Link>
        </div>
        <span className="empty-state-tag">{vi ? "Đang chờ xác nhận" : "Awaiting confirmation"}</span>
      </div>
    </section>
  </>;
}
