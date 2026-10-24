import { createHmac } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import type { NewOrder, Order, OrderStore } from "../lib/orders";
import { handleIpn, startCheckout, type PaymentDeps } from "../lib/payment";
import type { VnpayConfig } from "../lib/vnpay";

vi.mock("@/lib/pricing", () => ({
  priceFor: (slug: string) => (slug === "dim" ? 500000 : undefined),
}));

const config: VnpayConfig = {
  tmnCode: "TESTTMN",
  hashSecret: "test-hash-secret",
  payUrl: "https://sandbox.example.test/pay",
};
const now = new Date("2026-10-25T00:00:00Z");
const origin = "https://vgdtools.example.test";

function memoryStore(): OrderStore & { orders: Map<string, Order> } {
  const orders = new Map<string, Order>();
  return {
    orders,
    async create(order: NewOrder) {
      orders.set(order.txnRef, { ...order, status: "pending" });
    },
    async get(txnRef: string) {
      const order = orders.get(txnRef);
      return order ? { ...order } : null;
    },
    async settle(txnRef, status, details) {
      const order = orders.get(txnRef);
      if (!order || order.status !== "pending") return false;
      Object.assign(order, { status, transactionNo: details.transactionNo, settledAt: details.settledAt });
      return true;
    },
  };
}

function deps(overrides: Partial<PaymentDeps> = {}): PaymentDeps & { store: ReturnType<typeof memoryStore> } {
  return { config, store: memoryStore(), now: () => now, ...overrides } as PaymentDeps & { store: ReturnType<typeof memoryStore> };
}

const checkout = { slug: "dim", email: "buyer@example.test", locale: "vi" as const, ipAddress: "127.0.0.1", origin };

// Builds a signed request the way VNPay does, independently of lib/vnpay.ts.
function vnpaySigned(params: Record<string, string>, secret = config.hashSecret): Record<string, string> {
  const canonical = Object.keys(params)
    .sort()
    .map((key) => `${key}=${encodeURIComponent(params[key]).replace(/%20/g, "+")}`)
    .join("&");
  return { ...params, vnp_SecureHash: createHmac("sha512", secret).update(canonical).digest("hex") };
}

async function createdOrder(store: ReturnType<typeof memoryStore>): Promise<Order> {
  const [order] = [...store.orders.values()];
  return order;
}

function ipnFor(order: Order, overrides: Record<string, string> = {}): Record<string, string> {
  return vnpaySigned({
    vnp_TxnRef: order.txnRef,
    vnp_Amount: String(order.amountVnd * 100),
    vnp_ResponseCode: "00",
    vnp_TransactionStatus: "00",
    vnp_TransactionNo: "14000001",
    ...overrides,
  });
}

describe("startCheckout", () => {
  it("stays closed without a VNPay config", async () => {
    expect(await startCheckout(checkout, deps({ config: null }))).toEqual({ ok: false, reason: "closed" });
  });

  it("stays closed without an order store", async () => {
    expect(await startCheckout(checkout, deps({ store: null }))).toEqual({ ok: false, reason: "closed" });
  });

  it("stays closed for a product without a price", async () => {
    expect(await startCheckout({ ...checkout, slug: "cabinet" }, deps())).toEqual({ ok: false, reason: "closed" });
  });

  it("rejects an invalid email before creating an order", async () => {
    const d = deps();
    expect(await startCheckout({ ...checkout, email: "not-an-email" }, d)).toEqual({ ok: false, reason: "invalid" });
    expect(d.store.orders.size).toBe(0);
  });

  it("creates a pending order and returns a VNPay URL for its amount", async () => {
    const d = deps();
    const result = await startCheckout(checkout, d);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const order = await createdOrder(d.store);
    expect(order).toMatchObject({ productSlug: "dim", amountVnd: 500000, status: "pending", email: "buyer@example.test", locale: "vi" });
    const query = Object.fromEntries(new URL(result.url).searchParams);
    expect(query.vnp_TxnRef).toBe(order.txnRef);
    expect(query.vnp_Amount).toBe("50000000");
    expect(query.vnp_ReturnUrl).toBe(`${origin}/api/vnpay/return/vi`);
  });
});

describe("handleIpn", () => {
  it("answers 99 when payments are not configured", async () => {
    expect(await handleIpn({}, deps({ config: null }))).toEqual({ RspCode: "99", Message: "Unknown error" });
  });

  it("answers 97 when the signature does not match", async () => {
    const d = deps();
    await startCheckout(checkout, d);
    const order = await createdOrder(d.store);
    const query = ipnFor(order);
    query.vnp_Amount = "1";
    expect((await handleIpn(query, d)).RspCode).toBe("97");
  });

  it("answers 01 for an unknown order", async () => {
    const d = deps();
    const query = vnpaySigned({ vnp_TxnRef: "MISSING", vnp_Amount: "50000000", vnp_ResponseCode: "00", vnp_TransactionStatus: "00" });
    expect((await handleIpn(query, d)).RspCode).toBe("01");
  });

  it("answers 04 when the paid amount differs from the order", async () => {
    const d = deps();
    await startCheckout(checkout, d);
    const order = await createdOrder(d.store);
    const response = await handleIpn(ipnFor(order, { vnp_Amount: "100" }), d);
    expect(response.RspCode).toBe("04");
    expect((await createdOrder(d.store)).status).toBe("pending");
  });

  it("marks the order paid once and answers 02 to a repeated notification", async () => {
    const d = deps();
    await startCheckout(checkout, d);
    const order = await createdOrder(d.store);

    expect(await handleIpn(ipnFor(order), d)).toEqual({ RspCode: "00", Message: "Confirm Success" });
    expect(await createdOrder(d.store)).toMatchObject({ status: "paid", transactionNo: "14000001", settledAt: now.toISOString() });
    expect((await handleIpn(ipnFor(order), d)).RspCode).toBe("02");
  });

  it("marks the order failed when the customer did not pay", async () => {
    const d = deps();
    await startCheckout(checkout, d);
    const order = await createdOrder(d.store);

    const response = await handleIpn(ipnFor(order, { vnp_ResponseCode: "24", vnp_TransactionStatus: "02" }), d);
    expect(response.RspCode).toBe("00");
    expect((await createdOrder(d.store)).status).toBe("failed");
  });
});
