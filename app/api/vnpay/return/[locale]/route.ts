import { NextResponse } from "next/server";
import { isLocale } from "@/lib/i18n";
import { hasValidSignature, loadVnpayConfig } from "@/lib/vnpay";

// VNPay sends the customer back here after payment. This route only shows the result.
// The order is settled by the IPN call, never by this redirect.
export async function GET(request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return new NextResponse(null, { status: 404 });

  const config = loadVnpayConfig();
  const query = Object.fromEntries(new URL(request.url).searchParams);
  let status = "invalid";
  if (config && hasValidSignature(query, config.hashSecret)) {
    status = query.vnp_ResponseCode === "00" ? "success" : "failed";
  }
  return NextResponse.redirect(new URL(`/${locale}/payment/result?status=${status}`, request.url), 303);
}
