// Price in VND per product slug. A product without an entry is free and has no checkout.
const prices: Partial<Record<string, number>> = {
  cabinet: 99000,
  library: 99000,
  scenes: 99000,
};

export function priceFor(slug: string): number | undefined {
  return prices[slug];
}
