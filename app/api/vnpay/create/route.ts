import { NextResponse } from "next/server";
import { isLocale } from "@/lib/i18n";
import { getOrderStore } from "@/lib/orders";
import { startCheckout } from "@/lib/payment";
import { loadVnpayConfig } from "@/lib/vnpay";

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || "127.0.0.1";
}

export async function POST(request: Request) {
  const form = await request.formData();
  const slug = String(form.get("slug") ?? "");
  const locale = String(form.get("locale") ?? "");
  if (!isLocale(locale)) return NextResponse.json({ error: "invalid_locale" }, { status: 400 });

  const result = await startCheckout(
    {
      slug,
      email: String(form.get("email") ?? ""),
      locale,
      ipAddress: clientIp(request),
      origin: new URL(request.url).origin,
    },
    { config: loadVnpayConfig(), store: getOrderStore() },
  );

  if (!result.ok) {
    const checkoutPath = `/${locale}/checkout/${encodeURIComponent(slug)}?error=${result.reason}`;
    return NextResponse.redirect(new URL(checkoutPath, request.url), 303);
  }
  return NextResponse.redirect(result.url, 303);
}
