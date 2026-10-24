import { NextResponse } from "next/server";
import { getOrderStore } from "@/lib/orders";
import { handleIpn } from "@/lib/payment";
import { loadVnpayConfig } from "@/lib/vnpay";

// Server-to-server notification from VNPay. The response body must be JSON with RspCode.
export async function GET(request: Request) {
  const query = Object.fromEntries(new URL(request.url).searchParams);
  try {
    const response = await handleIpn(query, { config: loadVnpayConfig(), store: getOrderStore() });
    return NextResponse.json(response);
  } catch (error) {
    console.error("VNPay IPN failed", error);
    return NextResponse.json({ RspCode: "99", Message: "Unknown error" });
  }
}
