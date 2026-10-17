import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loadCenterRelease, loadReleaseManifest, resetReleaseManifestForTests } from "../lib/release-manifest-source";

const liveSnapshot = readFileSync(join(__dirname, "fixtures", "catalog-live-snapshot.json"), "utf-8");
const centerSnapshot = readFileSync(join(__dirname, "fixtures", "center-update-snapshot.json"), "utf-8");

function jsonResponse(body: string, status = 200) {
  return new Response(body, { status, headers: { "content-type": "application/json" } });
}

describe("loadReleaseManifest", () => {
  beforeEach(() => {
    resetReleaseManifestForTests();
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the validated manifest and requests it with a 300 second revalidation", async () => {
    const fetchImpl = vi.fn(async (_input: string, _init?: RequestInit) => jsonResponse(liveSnapshot));
    const manifest = await loadReleaseManifest(fetchImpl);
    expect(manifest?.products).toHaveLength(7);
    const init = fetchImpl.mock.calls[0]?.[1] as unknown as { next: { revalidate: number; tags: string[] } };
    expect(init.next).toEqual({ revalidate: 300, tags: ["release-manifest"] });
  });

  it("returns null when nothing valid has ever been loaded", async () => {
    const manifest = await loadReleaseManifest(async () => jsonResponse("<html>", 503));
    expect(manifest).toBeNull();
  });

  it("keeps the last good manifest when a later refresh fails", async () => {
    await loadReleaseManifest(async () => jsonResponse(liveSnapshot));
    const manifest = await loadReleaseManifest(async () => {
      throw new Error("network down");
    });
    expect(manifest?.products).toHaveLength(7);
  });

  it("keeps the last good manifest when a later refresh is invalid", async () => {
    await loadReleaseManifest(async () => jsonResponse(liveSnapshot));
    const broken = JSON.parse(liveSnapshot);
    broken.schema_version = 2;
    const manifest = await loadReleaseManifest(async () => jsonResponse(JSON.stringify(broken)));
    expect(manifest?.products).toHaveLength(7);
  });

  it("logs the reason when a refresh is rejected", async () => {
    const warn = vi.spyOn(console, "warn");
    await loadReleaseManifest(async () => jsonResponse("{}", 500));
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("HTTP 500"));
  });
});

describe("loadCenterRelease", () => {
  beforeEach(() => {
    resetReleaseManifestForTests();
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the validated Center release", async () => {
    const release = await loadCenterRelease(async () => jsonResponse(centerSnapshot));
    expect(release).toMatchObject({ version: "1.0.11", channel: "stable" });
  });

  it("returns null when no valid Center release was ever loaded", async () => {
    expect(await loadCenterRelease(async () => jsonResponse("{}", 404))).toBeNull();
  });

  it("keeps the last good Center release when a refresh fails", async () => {
    await loadCenterRelease(async () => jsonResponse(centerSnapshot));
    const release = await loadCenterRelease(async () => {
      throw new Error("network down");
    });
    expect(release?.version).toBe("1.0.11");
  });

  it("does not mix up the Center release and the plugin manifest caches", async () => {
    await loadReleaseManifest(async () => jsonResponse(liveSnapshot));
    expect(await loadCenterRelease(async () => jsonResponse("{}", 500))).toBeNull();
  });
});
