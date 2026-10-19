import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { PreviewNotice } from "@/components/preview-notice";
import { isLocale, locales } from "@/lib/i18n";
import { publicationReady, siteUrl } from "@/lib/site";
import "@fontsource-variable/manrope";
import "@/app/globals.css";
import "@/app/design-system.css";

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const isVietnamese = locale === "vi";
  return {
    metadataBase: siteUrl ? new URL(siteUrl) : undefined,
    title: {
      default: isVietnamese ? "VGD — Công cụ cho SketchUp" : "VGD — Tools for SketchUp",
      template: "%s · VGD",
    },
    description: isVietnamese
      ? "Khám phá hệ công cụ VGD cho SketchUp. Tìm hiểu trên website, quản lý plugin bằng VGD Center."
      : "Explore the VGD toolkit for SketchUp. Discover products here and manage plugins with VGD Center.",
    robots: { index: publicationReady, follow: publicationReady },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale}>
      <body>
        <div className="site-shell">
          <SiteHeader locale={locale} />
          {!publicationReady && <PreviewNotice locale={locale} />}
          <main id="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
