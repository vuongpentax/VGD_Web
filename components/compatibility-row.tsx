import type { Locale } from "@/lib/i18n";

export type CompatibilityStatus =
  | { kind: "verified"; versions: [string, ...string[]] }
  | { kind: "pending" }
  | { kind: "unavailable" };

export function CompatibilityRow({ locale, status }: { locale: Locale; status: CompatibilityStatus }) {
  const label = locale === "vi" ? "Tương thích SketchUp" : "SketchUp compatibility";
  const value = status.kind === "verified"
    ? status.versions.join(", ")
    : status.kind === "pending"
      ? (locale === "vi" ? "Đang xác nhận" : "To be confirmed")
      : (locale === "vi" ? "Chưa có thông tin" : "Information unavailable");

  return <div className={"compatibility-row compatibility-row-" + status.kind}>
    <span>{label}</span><strong>{value}</strong>
  </div>;
}
