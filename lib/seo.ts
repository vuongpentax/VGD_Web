import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { pageAlternates, publicationReady } from "@/lib/site";

export function createMetadata(
  locale: Locale,
  title: string,
  description: string,
  path = "",
): Metadata {
  return {
    title,
    description,
    alternates: pageAlternates(locale, path),
    robots: {
      index: publicationReady,
      follow: publicationReady,
    },
    openGraph: {
      title,
      description,
      locale: locale === "vi" ? "vi_VN" : "en_US",
      type: "website",
    },
  };
}
