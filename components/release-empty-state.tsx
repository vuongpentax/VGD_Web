import type { Locale } from "@/lib/i18n";
import { getUi } from "@/lib/i18n";

export function ReleaseEmptyState({ locale }: { locale: Locale }) {
  const copy = getUi(locale);
  return (
    <section className="release-empty" aria-labelledby="release-empty-title">
      <div className="release-empty-symbol" aria-hidden="true">↗</div>
      <div>
        <p className="eyebrow">{locale === "vi" ? "RELEASE FEED" : "RELEASE FEED"}</p>
        <h2 id="release-empty-title">{copy.releaseEmptyTitle}</h2>
        <p>{copy.releaseEmptyBody}</p>
      </div>
      <span className="empty-state-tag">{locale === "vi" ? "Chưa có dữ liệu" : "No data yet"}</span>
    </section>
  );
}
