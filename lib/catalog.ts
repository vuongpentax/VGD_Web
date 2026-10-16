import type { Locale } from "@/lib/i18n";

/**
 * Planning seed only. This is not the canonical product registry and contains
 * no release, version, download, or compatibility fields. Replace it with
 * approved public records from VGD_Plugins when the shared manifest exists.
 *
 * Roster: every plugin folder under VGD_Plugins/plugins except VGD_Center,
 * which is the manager (kind: manager) and has its own Center page.
 */
export interface PreviewProduct {
  id: string;
  slug: string;
  name: string;
  summary: Record<Locale, string>;
  publicationStatus: "draft" | "published";
  /** Product icon copied from VGD_Plugins. Omitted when the plugin has no dedicated icon. */
  icon?: string;
}

const seedSummary = {
  vi: "Sản phẩm trong seed catalog. Nội dung giới thiệu đang chờ đối chiếu và duyệt.",
  en: "A planning-seed product. Its description is awaiting verification and review.",
};

export const previewCatalog: PreviewProduct[] = [
  { id: "seed-vgd-bim-lite", slug: "bim-lite", name: "VGD BIM Lite", summary: seedSummary, publicationStatus: "draft" },
  { id: "seed-vgd-cabinet", slug: "cabinet", name: "VGD Cabinet", summary: seedSummary, publicationStatus: "draft", icon: "/products/cabinet.svg" },
  { id: "seed-vgd-cabinet-draw", slug: "cabinet-draw", name: "VGD Cabinet Draw", summary: seedSummary, publicationStatus: "draft", icon: "/products/cabinet-draw.svg" },
  { id: "seed-vgd-dim", slug: "dim", name: "VGD Dim", summary: seedSummary, publicationStatus: "draft", icon: "/products/dim.svg" },
  { id: "seed-vgd-image-importer", slug: "image-importer", name: "VGD Image Importer", summary: seedSummary, publicationStatus: "draft", icon: "/products/image-importer.svg" },
  { id: "seed-vgd-library", slug: "library", name: "VGD Library", summary: seedSummary, publicationStatus: "draft", icon: "/products/library.svg" },
  { id: "seed-vgd-package", slug: "package", name: "VGD Package", summary: seedSummary, publicationStatus: "draft" },
  { id: "seed-vgd-reference", slug: "reference", name: "VGD Reference", summary: seedSummary, publicationStatus: "draft", icon: "/products/reference.svg" },
  { id: "seed-vgd-scenes", slug: "scenes", name: "VGD Scenes", summary: seedSummary, publicationStatus: "draft", icon: "/products/scenes.svg" },
];

export const publishedCatalog = previewCatalog.filter((product) => product.publicationStatus === "published");
export function getProduct(slug: string) {
  return previewCatalog.find((product) => product.slug === slug);
}

export function productTabLabel(product: PreviewProduct) {
  return product.name.replace(/^VGD[ _]/, "").replace(/ — .+$/, "");
}
