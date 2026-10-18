import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomeShowcase } from "@/components/home-showcase";
import { createMetadata } from "@/lib/seo";
import { isLocale } from "@/lib/i18n";
import { previewCatalog, publishedCatalog } from "@/lib/catalog";
import { withReleases } from "@/lib/catalog-releases";
import { publicationReady } from "@/lib/site";

interface HomeProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomeProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return createMetadata(
    locale,
    locale === "vi" ? "Công cụ VGD cho SketchUp" : "VGD tools for SketchUp",
    locale === "vi"
      ? "Tìm hiểu sản phẩm, docs và cập nhật của hệ công cụ VGD."
      : "Explore products, docs, and updates from the VGD toolkit.",
  );
}

export default async function HomePage({ params }: HomeProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const products = await withReleases(publicationReady ? publishedCatalog : previewCatalog);

  return (
    <>
      <h1 className="sr-only">{locale === "vi" ? "Bộ công cụ VGD cho SketchUp" : "The VGD toolkit for SketchUp"}</h1>
      <HomeShowcase products={products} locale={locale} />
    </>
  );
}
