import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/page-intro";
import { getProduct } from "@/lib/catalog";
import { isLocale, localized } from "@/lib/i18n";
import { getOrderStore } from "@/lib/orders";
import { priceFor } from "@/lib/pricing";
import { loadVnpayConfig } from "@/lib/vnpay";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ error?: string }>;
}

// Reads the environment and store on every request, so checkout opens as soon as they are configured.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: localized("Mua " + product.name, "Buy " + product.name, locale),
    robots: { index: false, follow: false },
  };
}

export default async function CheckoutPage({ params, searchParams }: PageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const product = getProduct(slug);
  if (!product) notFound();

  const { error } = await searchParams;
  const vi = locale === "vi";
  const amountVnd = priceFor(slug);
  const isOpen = amountVnd !== undefined && loadVnpayConfig() !== null && getOrderStore() !== null;
  const backLink = (
    <Link className="text-link" href={"/" + locale + "/plugins/" + slug}>
      {vi ? "Quay lại sản phẩm" : "Back to product"}<span aria-hidden="true">↗</span>
    </Link>
  );

  if (!isOpen) {
    return (
      <>
        <PageIntro
          eyebrow={vi ? "THANH TOÁN" : "CHECKOUT"}
          title={product.name}
          description={vi ? "Sản phẩm này chưa mở bán." : "This product is not on sale yet."}
        />
        <section className="section-block page-width">{backLink}</section>
      </>
    );
  }

  const errorText = error === "invalid"
    ? (vi ? "Email chưa đúng định dạng." : "The email address is not valid.")
    : error === "closed"
      ? (vi ? "Sản phẩm này chưa mở bán." : "This product is not on sale yet.")
      : null;

  return (
    <>
      <PageIntro
        eyebrow={vi ? "THANH TOÁN" : "CHECKOUT"}
        title={product.name}
        description={vi
          ? "Nhập email để nhận thông tin kích hoạt. Bạn sẽ được chuyển sang VNPay để thanh toán."
          : "Enter an email to receive activation details. You will be redirected to VNPay to pay."}
      />
      <section className="section-block page-width">
        <form className="checkout-form" method="post" action="/api/vnpay/create">
          <input type="hidden" name="slug" value={slug} />
          <input type="hidden" name="locale" value={locale} />
          <p className="checkout-price">
            <span>{vi ? "Giá" : "Price"}</span>
            <strong>{amountVnd.toLocaleString(vi ? "vi-VN" : "en-US")} ₫</strong>
          </p>
          <label className="checkout-field">
            <span>Email</span>
            <input type="email" name="email" required maxLength={254} autoComplete="email" />
          </label>
          {errorText ? <p className="checkout-error" role="alert">{errorText}</p> : null}
          <button className="button button-primary" type="submit">
            {vi ? "Thanh toán qua VNPay" : "Pay with VNPay"}
          </button>
        </form>
        {backLink}
      </section>
    </>
  );
}
