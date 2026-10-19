import type { ChangelogEntryView } from "@/components/changelog-entry";
import type { CenterRelease, ManifestRelease, ReleaseManifest } from "@/lib/release-manifest";
import { loadCenterRelease, loadReleaseManifest } from "@/lib/release-manifest-source";

const CENTER_NAME = "VGD Center";

function toEntry(productName: string, release: ManifestRelease): ChangelogEntryView {
  return {
    productName,
    version: release.version,
    channel: release.releaseChannel,
    publishedAt: release.publishedAt,
    url: release.url,
    groups: [],
  };
}

/**
 * Flattens the published release history of every product, plus VGD Center,
 * into one list. Newest first; ties keep product order. Only validated
 * manifest data is used, so nothing is inferred from file names.
 */
export function buildChangelogEntries(
  manifest: ReleaseManifest | null,
  center: CenterRelease | null,
): ChangelogEntryView[] {
  const entries: ChangelogEntryView[] = [];
  for (const product of manifest?.products ?? []) {
    for (const release of product.releases) entries.push(toEntry(product.name, release));
  }
  for (const release of center?.releases ?? []) entries.push(toEntry(CENTER_NAME, release));

  return entries
    .map((entry, index) => ({ entry, index }))
    .sort((a, b) => {
      const byDate = b.entry.publishedAt.localeCompare(a.entry.publishedAt);
      return byDate !== 0 ? byDate : a.index - b.index;
    })
    .map(({ entry }) => entry);
}

export async function loadChangelogEntries(): Promise<ChangelogEntryView[]> {
  const [manifest, center] = await Promise.all([loadReleaseManifest(), loadCenterRelease()]);
  return buildChangelogEntries(manifest, center);
}
