/**
 * Consumer-side validation for the shared release metadata published by
 * VGD_Plugins at shared/vgd-center/catalog.json. This file does not define a
 * schema of its own; it only refuses data that the website must not render.
 */

export type ReleaseChannel = "stable" | "beta" | "alpha";

export interface ManifestDownload {
  filename: string;
  url: string;
  size: number;
  sha256: string;
}

/** One published release from the shared `releases` history. No notes are stored here. */
export interface ManifestRelease {
  version: string;
  releaseChannel: ReleaseChannel;
  /** Calendar date as published, YYYY-MM-DD. */
  publishedAt: string;
  /** GitHub release page on VGD_Plugins. */
  url: string;
}

export interface ManifestProduct {
  id: string;
  name: string;
  /** Vietnamese description published in the shared catalog, when present. */
  description?: string;
  lifecycle: "in_development" | "released";
  version?: string;
  releaseChannel?: ReleaseChannel;
  download?: ManifestDownload;
  releases: ManifestRelease[];
}

export interface ReleaseManifest {
  schemaVersion: 1;
  channel: "latest";
  products: ManifestProduct[];
}

/** Current VGD Center release, read from shared/vgd-center/center-update.json. */
export interface CenterRelease {
  version: string;
  channel: ReleaseChannel;
  download: ManifestDownload;
  releases: ManifestRelease[];
}

export type CenterParseResult =
  | { ok: true; release: CenterRelease }
  | { ok: false; error: string };

export type ManifestParseResult =
  | { ok: true; manifest: ReleaseManifest }
  | { ok: false; error: string };

const ID_PATTERN = /^[a-z0-9_]+$/;
const VERSION_PATTERN = /^(\d+)\.(\d+)\.(\d+)(?:-(alpha|beta)(?:\.(\d+))?)?$/;
const SHA256_PATTERN = /^[0-9a-f]{64}$/i;
const RBZ_PATTERN = /^[A-Za-z0-9_.-]+\.rbz$/i;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
// Same hosts the VGD Center accepts for package downloads.
const ALLOWED_URL_PREFIXES = [
  "https://raw.githubusercontent.com/vuongpentax/VGD_Plugins/",
  "https://github.com/vuongpentax/VGD_Plugins/releases/download/",
];
const RELEASE_PAGE_PREFIX = "https://github.com/vuongpentax/VGD_Plugins/releases/tag/";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function channelForVersion(version: string): ReleaseChannel | null {
  const match = VERSION_PATTERN.exec(version);
  if (!match) return null;
  return match[4] === "alpha" ? "alpha" : match[4] === "beta" ? "beta" : "stable";
}

/** Optional history list. A missing list means no history; a malformed one rejects the manifest. */
function parseReleases(id: string, value: unknown): ManifestRelease[] {
  if (value === undefined) return [];
  if (!Array.isArray(value)) throw new Error(`lịch sử phát hành không hợp lệ: ${id}`);

  return value.map((item) => {
    if (!isRecord(item)) throw new Error(`mục lịch sử không hợp lệ: ${id}`);
    const { version, release_channel: releaseChannel, published_at: publishedAt, url } = item;

    if (typeof version !== "string") throw new Error(`thiếu phiên bản trong lịch sử: ${id}`);
    const expectedChannel = channelForVersion(version);
    if (!expectedChannel) throw new Error(`phiên bản trong lịch sử không hợp lệ: ${id}`);
    if (releaseChannel !== expectedChannel) throw new Error(`kênh trong lịch sử không khớp phiên bản: ${id}`);
    if (typeof publishedAt !== "string" || !DATE_PATTERN.test(publishedAt) || Number.isNaN(Date.parse(publishedAt))) {
      throw new Error(`ngày phát hành không hợp lệ: ${id}`);
    }
    if (typeof url !== "string" || !url.startsWith(RELEASE_PAGE_PREFIX)) {
      throw new Error(`liên kết release không hợp lệ: ${id}`);
    }
    return { version, releaseChannel: expectedChannel, publishedAt, url };
  });
}

function parseDownload(id: string, value: unknown, version: string): ManifestDownload {
  if (!isRecord(value)) throw new Error(`thiếu gói tải: ${id}`);
  const { filename, url, size, sha256 } = value;

  if (typeof filename !== "string" || !RBZ_PATTERN.test(filename) || !filename.includes(version)) {
    throw new Error(`tên gói không hợp lệ: ${id}`);
  }
  if (typeof url !== "string" || !ALLOWED_URL_PREFIXES.some((prefix) => url.startsWith(prefix)) || !url.endsWith("/" + filename)) {
    throw new Error(`nguồn tải không được phép: ${id}`);
  }
  if (typeof size !== "number" || !Number.isInteger(size) || size <= 0) {
    throw new Error(`dung lượng không hợp lệ: ${id}`);
  }
  if (typeof sha256 !== "string" || !SHA256_PATTERN.test(sha256)) {
    throw new Error(`SHA-256 không hợp lệ: ${id}`);
  }
  return { filename, url, size, sha256: sha256.toLowerCase() };
}

function parseProduct(value: unknown, seenIds: Set<string>): ManifestProduct {
  if (!isRecord(value)) throw new Error("mục plugin không hợp lệ");
  const { id, name, lifecycle, version, release_channel: releaseChannel, description } = value;

  if (typeof id !== "string" || !ID_PATTERN.test(id)) throw new Error("ID plugin không hợp lệ");
  if (seenIds.has(id)) throw new Error(`trùng plugin: ${id}`);
  seenIds.add(id);
  if (typeof name !== "string" || name.trim() === "") throw new Error(`thiếu tên: ${id}`);

  // Products without a release only exist as planning records.
  if (lifecycle === "in_development") {
    return { id, name, lifecycle, releases: [] };
  }

  if (typeof version !== "string") throw new Error(`thiếu phiên bản: ${id}`);
  const expectedChannel = channelForVersion(version);
  if (!expectedChannel) throw new Error(`phiên bản không hợp lệ: ${id}`);
  if (releaseChannel !== expectedChannel) throw new Error(`kênh phát hành không khớp phiên bản: ${id}`);

  return {
    id,
    name,
    ...(typeof description === "string" && description.trim() !== "" ? { description: description.trim() } : {}),
    lifecycle: "released",
    version,
    releaseChannel: expectedChannel,
    download: parseDownload(id, value.download, version),
    releases: parseReleases(id, value.releases),
  };
}

/**
 * Accepts the current catalog format. Any invalid product rejects the whole
 * manifest, so callers keep their last known good data instead of partially
 * rendering a broken release list.
 */
export function parseReleaseManifest(input: unknown): ManifestParseResult {
  try {
    if (!isRecord(input)) throw new Error("manifest không phải object");
    if (input.schema_version !== 1) throw new Error("schema_version không được hỗ trợ");
    if (input.channel !== "latest") throw new Error("manifest không ở kênh latest");
    if (!Array.isArray(input.products)) throw new Error("thiếu danh sách plugin");

    const seenIds = new Set<string>();
    const products = input.products.map((product) => parseProduct(product, seenIds));
    return { ok: true, manifest: { schemaVersion: 1, channel: "latest", products } };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

/** Validates center-update.json, the file VGD Center itself reads to find its newest release. */
export function parseCenterUpdate(input: unknown): CenterParseResult {
  try {
    if (!isRecord(input)) throw new Error("center-update không phải object");
    if (input.schema_version !== 1) throw new Error("schema_version không được hỗ trợ");
    if (typeof input.version !== "string") throw new Error("thiếu phiên bản Center");
    const channel = channelForVersion(input.version);
    if (!channel) throw new Error("phiên bản Center không hợp lệ");

    const download = parseDownload("center", input.download, input.version);
    const releases = parseReleases("center", input.releases);
    return { ok: true, release: { version: input.version, channel, download, releases } };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}
