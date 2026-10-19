import type { Locale } from "@/lib/i18n";
import { ReleaseEmptyState } from "@/components/release-empty-state";
import { ReleaseBadge, type ReleaseChannel } from "@/components/release-badge";

export interface ChangelogEntryView {
  productName: string;
  version: string;
  channel: ReleaseChannel;
  publishedAt: string;
  /** GitHub release page on VGD_Plugins. */
  url: string;
  groups: Array<{ title: Record<Locale, string>; items: Record<Locale, string[]> }>;
}

/** Render only entries derived from validated releases in the shared manifest. */
export function ChangelogEntry({ locale, entry }: { locale: Locale; entry: ChangelogEntryView }) {
  const timestamp = Date.parse(entry.publishedAt);
  const dateLabel = Number.isNaN(timestamp)
    ? (locale === "vi" ? "Ngày đang được xác nhận" : "Date is being confirmed")
    : new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", { dateStyle: "long", timeZone: "UTC" }).format(timestamp);

  return <article className="changelog-entry">
    <header className="changelog-entry-header">
      <div><p className="eyebrow">{locale === "vi" ? "CẬP NHẬT SẢN PHẨM" : "PRODUCT UPDATE"}</p><h2>{entry.productName}</h2></div>
      <ReleaseBadge locale={locale} release={{ channel: entry.channel, version: entry.version }} />
    </header>
    <time className="changelog-entry-date" dateTime={Number.isNaN(timestamp) ? undefined : new Date(timestamp).toISOString()}>{dateLabel}</time>
    <div className="changelog-entry-groups">
      {entry.groups.length === 0 && <p className="changelog-entry-notes-missing">{locale === "vi"
        ? "Ghi chú phát hành chưa được công bố."
        : "Release notes have not been published yet."}</p>}
      {entry.groups.map((group, index) => <section className="changelog-entry-group" key={group.title[locale] + "-" + index}>
        <h3>{group.title[locale]}</h3>
        <ul>{group.items[locale].map((item, itemIndex) => <li key={item + "-" + itemIndex}>{item}</li>)}</ul>
      </section>)}
    </div>
    <a className="changelog-entry-link" href={entry.url} target="_blank" rel="noopener noreferrer">
      {locale === "vi" ? "Xem trên GitHub" : "View on GitHub"}
    </a>
  </article>;
}

export function ChangelogFeed({ locale, entries }: { locale: Locale; entries: ChangelogEntryView[] }) {
  if (entries.length === 0) return <ReleaseEmptyState locale={locale} />;
  return <div className="changelog-feed">
    {entries.map((entry) => <ChangelogEntry key={entry.productName + "-" + entry.version} locale={locale} entry={entry} />)}
  </div>;
}
