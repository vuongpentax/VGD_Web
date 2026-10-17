import {
  parseCenterUpdate,
  parseReleaseManifest,
  type CenterRelease,
  type ReleaseManifest,
} from "@/lib/release-manifest";

const RAW_BASE = "https://raw.githubusercontent.com/vuongpentax/VGD_Plugins/main/shared/vgd-center/";

/** Canonical manifest: VGD_Plugins main, read by VGD Center as well. */
export const RELEASE_MANIFEST_URL = RAW_BASE + "catalog.json";
/** VGD Center's own newest release; Center reads the same file to update itself. */
export const CENTER_UPDATE_URL = RAW_BASE + "center-update.json";
export const RELEASE_REVALIDATE_SECONDS = 300;
export const RELEASE_CACHE_TAG = "release-manifest";

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;
type Parsed<T> = { ok: true; value: T } | { ok: false; error: string };

// Last data that passed validation in this server instance. Used when a
// refresh fails so the site keeps the previous release data instead of blanking it.
let lastGoodManifest: ReleaseManifest | null = null;
let lastGoodCenter: CenterRelease | null = null;

async function fetchValidated<T>(
  url: string,
  parse: (json: unknown) => Parsed<T>,
  fetchImpl: FetchLike,
): Promise<T | null> {
  const init = {
    next: { revalidate: RELEASE_REVALIDATE_SECONDS, tags: [RELEASE_CACHE_TAG] },
  } as RequestInit;

  try {
    const response = await fetchImpl(url, init);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const parsed = parse(await response.json());
    if (!parsed.ok) throw new Error(parsed.error);
    return parsed.value;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    console.warn(`[release-manifest] giữ dữ liệu hợp lệ gần nhất: ${reason}`);
    return null;
  }
}

/**
 * Returns the current validated manifest, or the last good one if the refresh
 * fails. Returns null only when no valid manifest has ever been loaded, in
 * which case pages show "no release" and never a version or download.
 */
export async function loadReleaseManifest(fetchImpl: FetchLike = fetch): Promise<ReleaseManifest | null> {
  const fresh = await fetchValidated(
    RELEASE_MANIFEST_URL,
    (json) => {
      const result = parseReleaseManifest(json);
      return result.ok ? { ok: true, value: result.manifest } : result;
    },
    fetchImpl,
  );
  if (fresh) lastGoodManifest = fresh;
  return lastGoodManifest;
}

/** Same rules as loadReleaseManifest, for the VGD Center release. */
export async function loadCenterRelease(fetchImpl: FetchLike = fetch): Promise<CenterRelease | null> {
  const fresh = await fetchValidated(
    CENTER_UPDATE_URL,
    (json) => {
      const result = parseCenterUpdate(json);
      return result.ok ? { ok: true, value: result.release } : result;
    },
    fetchImpl,
  );
  if (fresh) lastGoodCenter = fresh;
  return lastGoodCenter;
}

/** Test helper: forget the cached data between cases. */
export function resetReleaseManifestForTests() {
  lastGoodManifest = null;
  lastGoodCenter = null;
}
