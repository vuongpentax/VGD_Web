import type { Locale } from "@/lib/i18n";

export function ConceptArtwork({
  locale,
  subject,
  variant = "product",
}: {
  locale: Locale;
  subject: string;
  variant?: "product" | "center";
}) {
  const isVietnamese = locale === "vi";
  const marks = ["V", "G", "D"];

  return (
    <figure
      className={"concept-art concept-art-" + variant}
      role="img"
      aria-label={isVietnamese
        ? "Minh họa khái niệm cho " + subject + ", không phải ảnh giao diện sản phẩm."
        : "Concept illustration for " + subject + ", not a product screenshot."}
    >
      <div className="concept-art-tiles" aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => (
          <span className={"concept-art-tile" + (index < marks.length ? " is-marked" : "")} key={index}>
            {marks[index] || ""}
          </span>
        ))}
      </div>
      <figcaption className="concept-art-caption">
        <span>{isVietnamese ? "Minh họa preview" : "Preview illustration"}</span>
        <span>{isVietnamese ? "Chờ ảnh đã duyệt từ VGD" : "Awaiting approved imagery from VGD"}</span>
      </figcaption>
    </figure>
  );
}