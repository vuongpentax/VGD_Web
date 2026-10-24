import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { GET as ipnGet } from "../app/api/vnpay/ipn/route";
import { POST as createPost } from "../app/api/vnpay/create/route";
import { GET as returnGet } from "../app/api/vnpay/return/[locale]/route";

const VNPAY_KEYS = ["VNPAY_TMN_CODE", "VNPAY_HASH_SECRET", "VNPAY_PAY_URL"] as const;
const origin = "https://vgdtools.example.test";
let saved: Record<string, string | undefined> = {};

beforeEach(() => {
  saved = Object.fromEntries(VNPAY_KEYS.map((key) => [key, process.env[key]]));
  for (const key of VNPAY_KEYS) delete process.env[key];
});

afterEach(() => {
  for (const key of VNPAY_KEYS) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key];
  }
});

function signed(params: Record<string, string>, secret: string): Record<string, string> {
  const canonical = Object.keys(params)
    .sort()
    .map((key) => `${key}=${encodeURIComponent(params[key]).replace(/%20/g, "+")}`)
    .join("&");
  return { ...params, vnp_SecureHash: createHmac("sha512", secret).update(canonical).digest("hex") };
}

function withQuery(path: string, query: Record<string, string>): Request {
  return new Request(`${origin}${path}?${new URLSearchParams(query)}`);
}

function locale(value: string) {
  return { params: Promise.resolve({ locale: value }) };
}

describe("POST /api/vnpay/create", () => {
  it("sends the buyer back to checkout as closed while VNPay is not configured", async () => {
    const response = await createPost(new Request(`${origin}/api/vnpay/create`, {
      method: "POST",
      body: new URLSearchParams({ slug: "dim", locale: "vi", email: "buyer@example.test" }),
    }));
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(`${origin}/vi/checkout/dim?error=closed`);
  });

  it("rejects an unknown locale", async () => {
    const response = await createPost(new Request(`${origin}/api/vnpay/create`, {
      method: "POST",
      body: new URLSearchParams({ slug: "dim", locale: "fr", email: "buyer@example.test" }),
    }));
    expect(response.status).toBe(400);
  });
});

describe("GET /api/vnpay/ipn", () => {
  it("answers 99 while VNPay is not configured", async () => {
    const response = await ipnGet(withQuery("/api/vnpay/ipn", { vnp_TxnRef: "X", vnp_SecureHash: "abc" }));
    expect(await response.json()).toEqual({ RspCode: "99", Message: "Unknown error" });
  });
});

describe("GET /api/vnpay/return/[locale]", () => {
  it("reports invalid when the signature cannot be checked", async () => {
    const response = await returnGet(withQuery("/api/vnpay/return/vi", { vnp_ResponseCode: "00" }), locale("vi"));
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(`${origin}/vi/payment/result?status=invalid`);
  });

  it("reports success for a valid signature with response code 00", async () => {
    process.env.VNPAY_TMN_CODE = "TESTTMN";
    process.env.VNPAY_HASH_SECRET = "test-hash-secret";
    const query = signed({ vnp_TxnRef: "VGD1", vnp_ResponseCode: "00", vnp_Amount: "50000000" }, "test-hash-secret");
    const response = await returnGet(withQuery("/api/vnpay/return/en", query), locale("en"));
    expect(response.headers.get("location")).toBe(`${origin}/en/payment/result?status=success`);
  });

  it("reports failed for a valid signature with a failed payment code", async () => {
    process.env.VNPAY_TMN_CODE = "TESTTMN";
    process.env.VNPAY_HASH_SECRET = "test-hash-secret";
    const query = signed({ vnp_TxnRef: "VGD1", vnp_ResponseCode: "24" }, "test-hash-secret");
    const response = await returnGet(withQuery("/api/vnpay/return/vi", query), locale("vi"));
    expect(response.headers.get("location")).toBe(`${origin}/vi/payment/result?status=failed`);
  });
});
