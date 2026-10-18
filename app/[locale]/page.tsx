import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductSelector } from "@/components/product-selector";
import { createMetadata } from "@/lib/seo";
import { isLocale } from "@/lib/i18n";

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
  const vi = locale === "vi";

  return (
    <>
      <ProductSelector locale={locale} />
      <section className="catalog-intro home-intro page-width" aria-labelledby="home-title">
        <h1 id="home-title">{vi ? "Bộ công cụ VGD cho SketchUp" : "The VGD toolkit for SketchUp"}</h1>
        <p>
          {vi
            ? "Cài đặt, cập nhật và quản lý các plugin VGD ngay trong SketchUp bằng VGD Center."
            : "Install, update, and manage VGD plugins inside SketchUp with VGD Center."}
        </p>
        <Link className="button button-primary showcase-button" href={"/" + locale + "/center"}>
          {vi ? "Tìm hiểu VGD Center" : "Learn about VGD Center"} <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </>
  );
}
