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
  /** Matching product id in the shared release manifest (VGD_Plugins catalog.json). */
  manifestId?: string;
  /** Locale-free page path when the product has its own page instead of /plugins/[slug]. */
  href?: string;
}

const seedSummary = {
  vi: "Sản phẩm trong seed catalog. Nội dung giới thiệu đang chờ đối chiếu và duyệt.",
  en: "A planning-seed product. Its description is awaiting verification and review.",
};

export const previewCatalog: PreviewProduct[] = [
  {
    id: "seed-vgd-center",
    slug: "center",
    name: "VGD Center",
    summary: {
      vi: "Plugin để cài đặt, cập nhật và quản lý các plugin VGD khác ngay trong SketchUp.",
      en: "A plugin for installing, updating, and managing other VGD plugins inside SketchUp.",
    },
    publicationStatus: "draft",
    icon: "/brand/vgd-logo.svg",
    manifestId: "center",
    href: "/center",
  },
  { id: "seed-vgd-bim-lite", slug: "bim-lite", name: "VGD BIM Lite", summary: seedSummary, publicationStatus: "draft", manifestId: "bim_lite" },
  { id: "seed-vgd-cabinet", slug: "cabinet", name: "VGD Cabinet", summary: seedSummary, publicationStatus: "draft", icon: "/products/cabinet.svg", manifestId: "cabinet" },
  { id: "seed-vgd-cabinet-draw", slug: "cabinet-draw", name: "VGD Cabinet Draw", summary: seedSummary, publicationStatus: "draft", icon: "/products/cabinet-draw.svg", manifestId: "cabinet_draw" },
  { id: "seed-vgd-dim", slug: "dim", name: "VGD Dim", summary: seedSummary, publicationStatus: "draft", icon: "/products/dim.svg", manifestId: "dim" },
  { id: "seed-vgd-image-importer", slug: "image-importer", name: "VGD Image Importer", summary: seedSummary, publicationStatus: "draft", icon: "/products/image-importer.svg", manifestId: "image_importer" },
  { id: "seed-vgd-library", slug: "library", name: "VGD Library", summary: seedSummary, publicationStatus: "draft", icon: "/products/library.svg", manifestId: "library" },
  { id: "seed-vgd-package", slug: "package", name: "VGD Package", summary: seedSummary, publicationStatus: "draft", manifestId: "package" },
  { id: "seed-vgd-reference", slug: "reference", name: "VGD Reference", summary: seedSummary, publicationStatus: "draft", icon: "/products/reference.svg", manifestId: "reference" },
  { id: "seed-vgd-scenes", slug: "scenes", name: "VGD Scenes", summary: seedSummary, publicationStatus: "draft", icon: "/products/scenes.svg", manifestId: "scenes" },
];

export const publishedCatalog = previewCatalog.filter((product) => product.publicationStatus === "published");
export function getProduct(slug: string) {
  return previewCatalog.find((product) => product.slug === slug);
}

const SHORT_NAMES: Record<string, string> = {
  center: "CEN",
  "bim-lite": "BIM",
  cabinet: "CAB",
  "cabinet-draw": "CDR",
  dim: "DIM",
  "image-importer": "IMP",
  library: "LIB",
  package: "PKG",
  reference: "REF",
  scenes: "SCN",
};

/** Locale-free page path for a product, e.g. "/plugins/dim" or "/center". */
export function productPath(product: PreviewProduct) {
  return product.href ?? "/plugins/" + product.slug;
}

/** Three-letter uppercase label for filter rails and logo fallbacks. */
export function productShortName(product: PreviewProduct) {
  return SHORT_NAMES[product.slug] ?? product.name.replace(/^VGD[ _]/, "").slice(0, 3).toUpperCase();
}
