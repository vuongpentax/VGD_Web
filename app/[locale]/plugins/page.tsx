import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogSearch } from "@/components/catalog-search";
import { createMetadata } from "@/lib/seo";
import { isLocale, locales } from "@/lib/i18n";
import { previewCatalog } from "@/lib/catalog";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return createMetadata(locale,
    locale === "vi" ? "Plugin VGD" : "VGD plugins",
    locale === "vi" ? "Danh mục seed đang chờ xác nhận từ registry production." : "The planning-seed catalog is awaiting confirmation from the production registry.",
    "/plugins",
  );
}

export default async function PluginsPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <CatalogSearch products={previewCatalog} locale={locale} />;
}