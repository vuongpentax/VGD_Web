import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseCenterUpdate, parseReleaseManifest } from "../lib/release-manifest";

// Snapshot of shared/vgd-center/catalog.json from VGD_Plugins origin/main.
// Test data only; production reads the live file server-side.
const liveSnapshot = JSON.parse(
  readFileSync(join(__dirname, "fixtures", "catalog-live-snapshot.json"), "utf-8"),
) as Record<string, unknown>;

function cloneSnapshot(): Record<string, any> {
  return JSON.parse(JSON.stringify(liveSnapshot));
}

describe("parseReleaseManifest", () => {
  it("accepts the live catalog snapshot", () => {
    const result = parseReleaseManifest(liveSnapshot);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.manifest.products.map((product) => product.id)).toEqual([
      "dim", "cabinet", "library", "image_importer", "scenes", "bim_lite", "reference", "cabinet_draw", "package",
    ]);
    const dim = result.manifest.products.find((product) => product.id === "dim");
    expect(dim).toMatchObject({ version: "3.3.0-beta.8", releaseChannel: "beta", lifecycle: "released" });
    expect(dim?.download?.sha256).toMatch(/^[0-9a-f]{64}$/);
    expect(typeof dim?.description).toBe("string");
  });

  it("accepts an in_development product without a download", () => {
    const result = parseReleaseManifest(liveSnapshot);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.manifest.products.find((product) => product.id === "package")).toEqual({
      id: "package", name: "VGD Package", lifecycle: "in_development", releases: [],
    });
  });

  it("rejects an unknown schema version", () => {
    const data = cloneSnapshot();
    data.schema_version = 2;
    expect(parseReleaseManifest(data)).toMatchObject({ ok: false });
  });

  it("rejects a channel other than latest", () => {
    const data = cloneSnapshot();
    data.channel = "beta";
    expect(parseReleaseManifest(data)).toMatchObject({ ok: false });
  });

  it("rejects a malformed checksum", () => {
    const data = cloneSnapshot();
    data.products[0].download.sha256 = "not-a-checksum";
    const result = parseReleaseManifest(data);
    expect(result).toMatchObject({ ok: false, error: "SHA-256 không hợp lệ: dim" });
  });

  it("rejects a download URL outside the allowed VGD_Plugins hosts", () => {
    const data = cloneSnapshot();
    data.products[0].download.url = "https://example.com/VGD_Dim_v3.3.0-beta.8.rbz";
    expect(parseReleaseManifest(data)).toMatchObject({ ok: false, error: "nguồn tải không được phép: dim" });
  });

  it("rejects a plain http download URL", () => {
    const data = cloneSnapshot();
    data.products[0].download.url = data.products[0].download.url.replace("https://", "http://");
    expect(parseReleaseManifest(data)).toMatchObject({ ok: false });
  });

  it("rejects a channel that does not match the version", () => {
    const data = cloneSnapshot();
    data.products[0].release_channel = "stable";
    expect(parseReleaseManifest(data)).toMatchObject({ ok: false, error: "kênh phát hành không khớp phiên bản: dim" });
  });

  it("rejects a released product with no download", () => {
    const data = cloneSnapshot();
    delete data.products[0].download;
    expect(parseReleaseManifest(data)).toMatchObject({ ok: false, error: "thiếu gói tải: dim" });
  });

  it("rejects duplicate product IDs", () => {
    const data = cloneSnapshot();
    data.products.push(cloneSnapshot().products[0]);
    expect(parseReleaseManifest(data)).toMatchObject({ ok: false, error: "trùng plugin: dim" });
  });

  it("rejects a non-object payload", () => {
    expect(parseReleaseManifest("<html>")).toMatchObject({ ok: false });
    expect(parseReleaseManifest(null)).toMatchObject({ ok: false });
  });
});

// Snapshot of shared/vgd-center/center-update.json from VGD_Plugins origin/main.
const centerSnapshot = JSON.parse(
  readFileSync(join(__dirname, "fixtures", "center-update-snapshot.json"), "utf-8"),
) as Record<string, any>;

function cloneCenter(): Record<string, any> {
  return JSON.parse(JSON.stringify(centerSnapshot));
}

describe("parseCenterUpdate", () => {
  it("accepts the live center-update snapshot", () => {
    const result = parseCenterUpdate(centerSnapshot);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.release).toMatchObject({ version: "1.0.11", channel: "stable" });
    expect(result.release.download.filename).toBe("VGD_Center_v1.0.11.rbz");
  });

  it("derives the channel from a prerelease version", () => {
    const data = cloneCenter();
    data.version = "1.0.12-beta.1";
    data.download.filename = "VGD_Center_v1.0.12-beta.1.rbz";
    data.download.url = data.download.url.replace("VGD_Center_v1.0.11.rbz", "VGD_Center_v1.0.12-beta.1.rbz");
    const result = parseCenterUpdate(data);
    expect(result.ok && result.release.channel).toBe("beta");
  });

  it("rejects an unknown schema version", () => {
    const data = cloneCenter();
    data.schema_version = 2;
    expect(parseCenterUpdate(data)).toMatchObject({ ok: false });
  });

  it("rejects a malformed checksum", () => {
    const data = cloneCenter();
    data.download.sha256 = "abc";
    expect(parseCenterUpdate(data)).toMatchObject({ ok: false, error: "SHA-256 không hợp lệ: center" });
  });

  it("rejects a package whose filename does not match the version", () => {
    const data = cloneCenter();
    data.version = "1.0.12";
    expect(parseCenterUpdate(data)).toMatchObject({ ok: false, error: "tên gói không hợp lệ: center" });
  });

  it("rejects a download URL outside the allowed hosts", () => {
    const data = cloneCenter();
    data.download.url = "https://example.com/VGD_Center_v1.0.11.rbz";
    expect(parseCenterUpdate(data)).toMatchObject({ ok: false, error: "nguồn tải không được phép: center" });
  });

  it("rejects a non-object payload", () => {
    expect(parseCenterUpdate(null)).toMatchObject({ ok: false });
  });
});

describe("release history", () => {
  it("reads the release history of the live catalog snapshot", () => {
    const result = parseReleaseManifest(liveSnapshot);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const imageImporter = result.manifest.products.find((product) => product.id === "image_importer");
    expect(imageImporter?.releases.map((release) => release.version)).toEqual(["1.1.0", "1.1.0-beta.5"]);
    expect(imageImporter?.releases[0]).toMatchObject({ releaseChannel: "stable", publishedAt: "2026-10-17" });
  });

  it("treats a missing releases list as an empty history", () => {
    const snapshot = cloneSnapshot();
    for (const product of snapshot.products) delete product.releases;
    const result = parseReleaseManifest(snapshot);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.manifest.products.every((product) => product.releases.length === 0)).toBe(true);
  });

  it("rejects a release outside the VGD_Plugins release pages", () => {
    const snapshot = cloneSnapshot();
    snapshot.products[0].releases[0].url = "https://example.com/vgd-dim";
    expect(parseReleaseManifest(snapshot).ok).toBe(false);
  });

  it("rejects a release whose channel does not match its version", () => {
    const snapshot = cloneSnapshot();
    snapshot.products[0].releases[0].release_channel = "stable";
    expect(parseReleaseManifest(snapshot).ok).toBe(false);
  });

  it("rejects a release with an invalid date", () => {
    const snapshot = cloneSnapshot();
    snapshot.products[0].releases[0].published_at = "16/10/2026";
    expect(parseReleaseManifest(snapshot).ok).toBe(false);
  });

  it("rejects a releases value that is not a list", () => {
    const snapshot = cloneSnapshot();
    snapshot.products[0].releases = {};
    expect(parseReleaseManifest(snapshot).ok).toBe(false);
  });

  it("reads the VGD Center release history", () => {
    const result = parseCenterUpdate(centerSnapshot);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.release.releases.map((release) => release.version)).toEqual(["1.0.11", "1.0.10"]);
  });
});
