export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
// Keep preview builds out of search indexes until the shared manifest and
// reviewed public catalog are connected to this site.
export const publicationReady = false;

export function pageAlternates(locale: "vi" | "en", path: string) {
  if (!siteUrl) return undefined;
  return {
    canonical: `/${locale}${path}`,
    languages: {
      vi: `/vi${path}`,
      en: `/en${path}`,
    },
  };
}
