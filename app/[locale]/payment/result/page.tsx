import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/page-intro";
import { StatusState } from "@/components/status-state";
import { isLocale, localized } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: localized("Kết quả thanh toán", "Payment result", locale),
    robots: { index: false, follow: false },
  };
}

const messages = {
  success: {
    vi: "Đã nhận kết quả thanh toán. Trạng thái đơn sẽ được cập nhật sau khi VNPay xác nhận.",
    en: "Payment result received. The order status will update after VNPay confirms it.",
  },
  failed: {
    vi: "Thanh toán chưa thành công. Bạn có thể thử lại từ trang mua sản phẩm.",
    en: "The payment was not completed. You can try again from the product checkout page.",
  },
  invalid: {
    vi: "Không xác minh được kết quả thanh toán. Nếu đã bị trừ tiền, hãy liên hệ VGD để được hỗ trợ.",
    en: "The payment result could not be verified. If your account was charged, contact VGD for support.",
  },
} as const;

export default async function PaymentResultPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { status } = await searchParams;
  const kind = status === "success" || status === "failed" ? status : "invalid";
  const vi = locale === "vi";

  return (
    <>
      <PageIntro
        eyebrow={vi ? "THANH TOÁN" : "PAYMENT"}
        title={vi ? "Kết quả thanh toán" : "Payment result"}
        description={vi ? "Trang này chỉ hiển thị kết quả trả về từ VNPay." : "This page shows the result returned by VNPay."}
      />
      <section className="section-block page-width">
        <StatusState
          kind={kind === "success" ? "empty" : "error"}
          title={kind === "success" ? (vi ? "Đã ghi nhận" : "Received") : (vi ? "Chưa hoàn tất" : "Not completed")}
          description={messages[kind][locale]}
        >
          <Link className="text-link" href={"/" + locale + "/plugins"}>
            {vi ? "Quay lại danh mục" : "Back to catalog"}<span aria-hidden="true">↗</span>
          </Link>
        </StatusState>
      </section>
    </>
  );
}
