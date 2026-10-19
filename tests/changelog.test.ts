import { describe, expect, it } from "vitest";
import { buildChangelogEntries } from "../lib/changelog";
import type { CenterRelease, ReleaseManifest } from "../lib/release-manifest";

const release = (version: string, channel: "stable" | "beta" | "alpha", publishedAt: string) => ({
  version,
  releaseChannel: channel,
  publishedAt,
  url: `https://github.com/vuongpentax/VGD_Plugins/releases/tag/${version}`,
});

const manifest: ReleaseManifest = {
  schemaVersion: 1,
  channel: "latest",
  products: [
    {
      id: "dim", name: "VGD Dim", lifecycle: "released",
      releases: [release("3.3.0-beta.8", "beta", "2026-10-16"), release("3.2.0", "stable", "2026-09-01")],
    },
    {
      id: "image_importer", name: "VGD Image Importer", lifecycle: "released",
      releases: [release("1.1.0", "stable", "2026-10-17")],
    },
    { id: "cabinet_draw", name: "VGD Cabinet Draw", lifecycle: "in_development", releases: [] },
  ],
} as ReleaseManifest;

const center: CenterRelease = {
  version: "1.0.11",
  channel: "stable",
  download: { filename: "VGD_Center_v1.0.11.rbz", url: "https://github.com/vuongpentax/VGD_Plugins/releases/download/x/VGD_Center_v1.0.11.rbz", size: 1, sha256: "a".repeat(64) },
  releases: [release("1.0.11", "stable", "2026-10-16"), release("1.0.10", "stable", "2026-10-16")],
};

describe("buildChangelogEntries", () => {
  it("lists every release newest first, with VGD Center included", () => {
    const entries = buildChangelogEntries(manifest, center);
    expect(entries.map((entry) => `${entry.productName} ${entry.version}`)).toEqual([
      "VGD Image Importer 1.1.0",
      "VGD Dim 3.3.0-beta.8",
      "VGD Center 1.0.11",
      "VGD Center 1.0.10",
      "VGD Dim 3.2.0",
    ]);
  });

  it("keeps the published date, channel and link, with no invented notes", () => {
    const [first] = buildChangelogEntries(manifest, center);
    expect(first).toMatchObject({
      productName: "VGD Image Importer",
      channel: "stable",
      publishedAt: "2026-10-17",
      url: "https://github.com/vuongpentax/VGD_Plugins/releases/tag/1.1.0",
      groups: [],
    });
  });

  it("returns an empty list when no validated data is available", () => {
    expect(buildChangelogEntries(null, null)).toEqual([]);
  });
});
