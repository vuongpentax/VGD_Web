import type { Locale } from "@/lib/i18n";
import { getUi } from "@/lib/i18n";
import { StatusState } from "@/components/status-state";

export function ReleaseEmptyState({ locale }: { locale: Locale }) {
  const copy = getUi(locale);
  return <StatusState
    kind="empty"
    className="release-empty"
    eyebrow="RELEASE FEED"
    title={copy.releaseEmptyTitle}
    description={copy.releaseEmptyBody}
    icon="↗"
  >
    <span className="empty-state-tag">{locale === "vi" ? "Chưa có dữ liệu" : "No data yet"}</span>
  </StatusState>;
}
