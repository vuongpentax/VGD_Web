import type { Locale } from "@/lib/i18n";
import { getUi } from "@/lib/i18n";

export function PreviewNotice({ locale }: { locale: Locale }) {
  const copy = getUi(locale);
  return (
    <div className="preview-notice" role="status">
      <span className="notice-dot" aria-hidden="true" />
      <span>{copy.preview}</span>
    </div>
  );
}
