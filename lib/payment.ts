import { randomBytes } from "node:crypto";
import { getProduct } from "@/lib/catalog";
import type { Locale } from "@/lib/i18n";
import type { OrderStore } from "@/lib/orders";
import { priceFor } from "@/lib/pricing";
import { buildPaymentUrl, hasValidSignature, type VnpayConfig } from "@/lib/vnpay";

export interface PaymentDeps {
  config: VnpayConfig | null;
  store: OrderStore | null;
  now?: () => Date;
}

const PAYMENT_WINDOW_MS = 15 * 60 * 1000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface CheckoutInput {
  slug: string;
  email: string;
  locale: Locale;
  ipAddress: string;
  origin: string;
}

export type CheckoutResult = { ok: true; url: string } | { ok: false; reason: "closed" | "invalid" };

export async function startCheckout(input: CheckoutInput, deps: PaymentDeps): Promise<CheckoutResult> {
  const { config, store } = deps;
  const product = getProduct(input.slug);
  const amountVnd = priceFor(input.slug);
  if (!config || !store || !product || amountVnd === undefined) return { ok: false, reason: "closed" };

  const email = input.email.trim();
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) return { ok: false, reason: "invalid" };

  const createdAt = (deps.now ?? (() => new Date()))();
  const txnRef = `VGD${Date.now()}${randomBytes(4).toString("hex")}`;
  await store.create({
    txnRef,
    productSlug: product.slug,
    amountVnd,
    email,
    locale: input.locale,
    createdAt: createdAt.toISOString(),
  });

  const url = buildPaymentUrl(config, {
    txnRef,
    amountVnd,
    // VNPay accepts only plain ASCII letters, digits and spaces in the order description.
    orderInfo: `Thanh toan ${product.name}`.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9 ]/g, "").slice(0, 255),
    locale: input.locale === "vi" ? "vn" : "en",
    ipAddress: input.ipAddress,
    returnUrl: `${input.origin}/api/vnpay/return/${input.locale}`,
    createdAt,
    expiresAt: new Date(createdAt.getTime() + PAYMENT_WINDOW_MS),
  });
  return { ok: true, url };
}

export interface IpnResponse {
  RspCode: string;
  Message: string;
}

// Response codes follow the VNPay IPN specification. Confirm them against the sandbox before go-live.
export async function handleIpn(query: Record<string, string>, deps: PaymentDeps): Promise<IpnResponse> {
  const { config, store } = deps;
  if (!config || !store) return { RspCode: "99", Message: "Unknown error" };
  if (!hasValidSignature(query, config.hashSecret)) return { RspCode: "97", Message: "Invalid signature" };

  const order = await store.get(query.vnp_TxnRef ?? "");
  if (!order) return { RspCode: "01", Message: "Order not found" };
  if (query.vnp_Amount !== String(order.amountVnd * 100)) return { RspCode: "04", Message: "Invalid amount" };
  if (order.status !== "pending") return { RspCode: "02", Message: "Order already confirmed" };

  const paid = query.vnp_ResponseCode === "00" && query.vnp_TransactionStatus === "00";
  const settledAt = (deps.now ?? (() => new Date()))().toISOString();
  const settled = await store.settle(order.txnRef, paid ? "paid" : "failed", {
    transactionNo: query.vnp_TransactionNo ?? "",
    settledAt,
  });
  if (!settled) return { RspCode: "02", Message: "Order already confirmed" };
  return { RspCode: "00", Message: "Confirm Success" };
}
