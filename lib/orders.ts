import type { Locale } from "@/lib/i18n";

export type OrderStatus = "pending" | "paid" | "failed";

export interface Order {
  txnRef: string;
  productSlug: string;
  amountVnd: number;
  email: string;
  locale: Locale;
  status: OrderStatus;
  createdAt: string;
  settledAt?: string;
  transactionNo?: string;
}

export type NewOrder = Pick<Order, "txnRef" | "productSlug" | "amountVnd" | "email" | "locale" | "createdAt">;

export interface OrderStore {
  create(order: NewOrder): Promise<void>;
  get(txnRef: string): Promise<Order | null>;
  // Moves a pending order to paid or failed. Returns false when the order was already settled.
  settle(
    txnRef: string,
    status: Exclude<OrderStatus, "pending">,
    details: { transactionNo: string; settledAt: string },
  ): Promise<boolean>;
}

// No database is connected yet. Without a store, checkout stays closed and the IPN answers with an error code.
export function getOrderStore(): OrderStore | null {
  return null;
}
