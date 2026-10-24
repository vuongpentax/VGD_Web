import { createHmac, timingSafeEqual } from "node:crypto";

export interface VnpayConfig {
  tmnCode: string;
  hashSecret: string;
  payUrl: string;
}

// The sandbox is the default, so a missing VNPAY_PAY_URL never sends real payments.
const SANDBOX_PAY_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

export function loadVnpayConfig(env: Partial<Record<string, string>> = process.env): VnpayConfig | null {
  const tmnCode = env.VNPAY_TMN_CODE?.trim();
  const hashSecret = env.VNPAY_HASH_SECRET?.trim();
  if (!tmnCode || !hashSecret) return null;
  return { tmnCode, hashSecret, payUrl: env.VNPAY_PAY_URL?.trim() || SANDBOX_PAY_URL };
}

// VNPay signs the parameters sorted by name, with values percent-encoded and spaces written as "+".
function canonicalQuery(params: Record<string, string>): string {
  return Object.keys(params)
    .sort()
    .map((key) => `${key}=${encodeURIComponent(params[key]).replace(/%20/g, "+")}`)
    .join("&");
}

function sign(params: Record<string, string>, hashSecret: string): string {
  return createHmac("sha512", hashSecret).update(canonicalQuery(params), "utf-8").digest("hex");
}

// VNPay expects GMT+7 timestamps written as yyyyMMddHHmmss.
function vnpayDate(date: Date): string {
  const shifted = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  return shifted.toISOString().slice(0, 19).replace(/[-T:]/g, "");
}

export interface PaymentRequest {
  txnRef: string;
  amountVnd: number;
  orderInfo: string;
  locale: "vn" | "en";
  ipAddress: string;
  returnUrl: string;
  createdAt: Date;
  expiresAt: Date;
}

export function buildPaymentUrl(config: VnpayConfig, request: PaymentRequest): string {
  const params: Record<string, string> = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: config.tmnCode,
    vnp_Amount: String(request.amountVnd * 100),
    vnp_CurrCode: "VND",
    vnp_TxnRef: request.txnRef,
    vnp_OrderInfo: request.orderInfo,
    vnp_OrderType: "other",
    vnp_Locale: request.locale,
    vnp_ReturnUrl: request.returnUrl,
    vnp_IpAddr: request.ipAddress,
    vnp_CreateDate: vnpayDate(request.createdAt),
    vnp_ExpireDate: vnpayDate(request.expiresAt),
  };
  const secureHash = sign(params, config.hashSecret);
  return `${config.payUrl}?${canonicalQuery({ ...params, vnp_SecureHash: secureHash })}`;
}

// Checks vnp_SecureHash on a request sent by VNPay (the IPN call or the return redirect).
export function hasValidSignature(query: Record<string, string>, hashSecret: string): boolean {
  const received = query.vnp_SecureHash;
  if (!received) return false;

  const signed: Record<string, string> = {};
  for (const [key, value] of Object.entries(query)) {
    if (key !== "vnp_SecureHash" && key !== "vnp_SecureHashType") signed[key] = value;
  }
  const expected = Buffer.from(sign(signed, hashSecret), "utf-8");
  const actual = Buffer.from(received.toLowerCase(), "utf-8");
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
