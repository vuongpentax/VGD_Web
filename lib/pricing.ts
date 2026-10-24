// Price in VND per product slug. Empty until the owner confirms prices.
// A product without a price stays closed at checkout.
const prices: Partial<Record<string, number>> = {};

export function priceFor(slug: string): number | undefined {
  return prices[slug];
}
