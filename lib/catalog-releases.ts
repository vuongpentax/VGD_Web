import type { PreviewProduct } from "@/lib/catalog";
import type { ReleaseBadgeData } from "@/components/release-badge";
import { loadCenterRelease, loadReleaseManifest } from "@/lib/release-manifest-source";

export type CatalogEntry = PreviewProduct & {
  release?: ReleaseBadgeData;
  /** Description published in the shared catalog (Vietnamese). */
  description?: string;
};

// VGD Center is not listed in catalog.json; its release comes from center-update.json.
const CENTER_ID = "center";

/**
 * Adds the current release (channel and version) and the published description
 * from the shared release data to each product. Products with no released entry
 * keep no release, so their pages show the "no release yet" state and never a
 * version or download.
 */
export async function withReleases(products: PreviewProduct[]): Promise<CatalogEntry[]> {
  const [manifest, center] = await Promise.all([loadReleaseManifest(), loadCenterRelease()]);
  const byId = new Map((manifest?.products ?? []).map((product) => [product.id, product]));

  return products.map((product) => {
    if (product.manifestId === CENTER_ID) {
      return center ? { ...product, release: { channel: center.channel, version: center.version } } : product;
    }
    const entry = product.manifestId ? byId.get(product.manifestId) : undefined;
    if (!entry || entry.lifecycle !== "released" || !entry.version || !entry.releaseChannel) return product;
    return {
      ...product,
      release: { channel: entry.releaseChannel, version: entry.version },
      ...(entry.description ? { description: entry.description } : {}),
    };
  });
}
