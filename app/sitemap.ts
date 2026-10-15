import type { MetadataRoute } from "next";
import { siteUrl, publicationReady } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!publicationReady || !siteUrl) return [];
  const paths = ["", "/plugins", "/center", "/docs", "/changelog", "/roadmap", "/about", "/contact"];
  return paths.flatMap((path) => (["vi", "en"] as const).map((locale) => ({
    url: `${siteUrl}/${locale}${path}`,
    alternates: { languages: { vi: `${siteUrl}/vi${path}`, en: `${siteUrl}/en${path}` } },
  })));
}
