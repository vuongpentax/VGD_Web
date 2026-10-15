import type { MetadataRoute } from "next";
import { siteUrl, publicationReady } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return publicationReady && siteUrl
    ? { rules: { userAgent: "*", allow: "/" }, sitemap: `${siteUrl}/sitemap.xml` }
    : { rules: { userAgent: "*", disallow: "/" } };
}
