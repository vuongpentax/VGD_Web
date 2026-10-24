import { describe, expect, it } from "vitest";
import { buildPaymentUrl, hasValidSignature, loadVnpayConfig, type VnpayConfig } from "../lib/vnpay";

const config: VnpayConfig = {
  tmnCode: "TESTTMN",
  hashSecret: "test-hash-secret",
  payUrl: "https://sandbox.example.test/pay",
};
const createdAt = new Date("2026-10-25T00:00:00Z");

function paymentUrl(overrides: { orderInfo?: string; amountVnd?: number } = {}): string {
  return buildPaymentUrl(config, {
    txnRef: "VGD1",
    amountVnd: overrides.amountVnd ?? 500000,
    orderInfo: overrides.orderInfo ?? "Thanh toan VGD Dim",
    locale: "vn",
    ipAddress: "127.0.0.1",
    returnUrl: "https://example.test/api/vnpay/return/vi",
    createdAt,
    expiresAt: new Date(createdAt.getTime() + 15 * 60 * 1000),
  });
}

// Reads the URL the way VNPay receives it, so the test covers decoding as well as signing.
function queryOf(url: string): Record<string, string> {
  return Object.fromEntries(new URL(url).searchParams);
}

describe("buildPaymentUrl", () => {
  it("produces parameters that verify against the same secret", () => {
    expect(hasValidSignature(queryOf(paymentUrl()), config.hashSecret)).toBe(true);
  });

  it("sends the amount in VND multiplied by 100 and the GMT+7 create date", () => {
    const query = queryOf(paymentUrl());
    expect(query.vnp_Amount).toBe("50000000");
    expect(query.vnp_CurrCode).toBe("VND");
    expect(query.vnp_CreateDate).toBe("20261025070000");
    expect(query.vnp_ExpireDate).toBe("20261025071500");
  });

  it("writes spaces in the order description as plus signs", () => {
    expect(new URL(paymentUrl()).search).toContain("vnp_OrderInfo=Thanh+toan+VGD+Dim");
  });

  it("points at the configured pay URL", () => {
    expect(paymentUrl().startsWith("https://sandbox.example.test/pay?")).toBe(true);
  });
});

describe("hasValidSignature", () => {
  it("rejects a changed amount", () => {
    const query = queryOf(paymentUrl());
    query.vnp_Amount = "1";
    expect(hasValidSignature(query, config.hashSecret)).toBe(false);
  });

  it("rejects a changed transaction reference", () => {
    const query = queryOf(paymentUrl());
    query.vnp_TxnRef = "VGD2";
    expect(hasValidSignature(query, config.hashSecret)).toBe(false);
  });

  it("rejects a request without a signature", () => {
    const query = queryOf(paymentUrl());
    delete query.vnp_SecureHash;
    expect(hasValidSignature(query, config.hashSecret)).toBe(false);
  });

  it("rejects a signature made with another secret", () => {
    expect(hasValidSignature(queryOf(paymentUrl()), "another-secret")).toBe(false);
  });

  it("ignores vnp_SecureHashType, which is not part of the signed data", () => {
    const query = queryOf(paymentUrl());
    query.vnp_SecureHashType = "HmacSHA512";
    expect(hasValidSignature(query, config.hashSecret)).toBe(true);
  });

  it("accepts an upper-case hash", () => {
    const query = queryOf(paymentUrl());
    query.vnp_SecureHash = query.vnp_SecureHash.toUpperCase();
    expect(hasValidSignature(query, config.hashSecret)).toBe(true);
  });
});

describe("loadVnpayConfig", () => {
  it("returns null until both the terminal code and the secret are set", () => {
    expect(loadVnpayConfig({})).toBeNull();
    expect(loadVnpayConfig({ VNPAY_TMN_CODE: "X" })).toBeNull();
    expect(loadVnpayConfig({ VNPAY_HASH_SECRET: "Y" })).toBeNull();
  });

  it("uses the sandbox endpoint unless a pay URL is set", () => {
    const sandbox = loadVnpayConfig({ VNPAY_TMN_CODE: "X", VNPAY_HASH_SECRET: "Y" });
    expect(sandbox?.payUrl).toBe("https://sandbox.vnpayment.vn/paymentv2/vpcpay.html");
    const custom = loadVnpayConfig({ VNPAY_TMN_CODE: "X", VNPAY_HASH_SECRET: "Y", VNPAY_PAY_URL: "https://pay.example.test/vpcpay.html" });
    expect(custom?.payUrl).toBe("https://pay.example.test/vpcpay.html");
  });
});
