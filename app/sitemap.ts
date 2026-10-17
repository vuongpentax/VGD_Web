import type { MetadataRoute } from "next";
import { productPath, publishedCatalog } from "@/lib/catalog";
import { publishedGuideSlugs } from "@/lib/docs";
import { siteUrl, publicationReady } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!publicationReady || !siteUrl) return [];

  const staticPaths = ["", "/plugins", "/center", "/docs", "/changelog", "/roadmap", "/about", "/contact"];
  const productPaths = publishedCatalog.filter((product) => !product.href).map((product) => productPath(product));
  const guidePaths = publishedGuideSlugs.map((slug) => "/docs/" + slug);
  const paths = [...staticPaths, ...productPaths, ...guidePaths];

  return paths.flatMap((path) => (["vi", "en"] as const).map((locale) => ({
    url: siteUrl + "/" + locale + path,
    alternates: {
      languages: {
        vi: siteUrl + "/vi" + path,
        en: siteUrl + "/en" + path,
      },
    },
  })));
}
