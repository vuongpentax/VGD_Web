import type { Locale } from "@/lib/i18n";

export type ReleaseChannel = "stable" | "beta" | "alpha";

/** Only pass release details read from validated shared release metadata. */
export interface ReleaseBadgeData { channel: ReleaseChannel; version: string }

export function ReleaseBadge({ locale, release }: { locale: Locale; release?: ReleaseBadgeData }) {
  if (!release) return (
    <span className="release-badge release-badge-unreleased" data-release-state="unreleased">
      {locale === "vi" ? "Chưa có bản phát hành" : "No release available yet"}
    </span>
  );

  const channelLabel = {
    stable: locale === "vi" ? "Ổn định" : "Stable",
    beta: "Beta",
    alpha: "Alpha",
  }[release.channel];

  return <span className="release-badge" data-channel={release.channel}>
    <span>{channelLabel}</span><span className="release-badge-version">{release.version}</span>
  </span>;
}
