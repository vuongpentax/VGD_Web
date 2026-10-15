import type { Locale } from "@/lib/i18n";

/**
 * Planning seed only. This is not the canonical product registry and contains
 * no release, version, download, or compatibility fields. Replace it with
 * approved public records from VGD_Plugins when the shared manifest exists.
 */
export interface PreviewProduct {
  id: string;
  slug: string;
  name: string;
  summary: Record<Locale, string>;
  editorialStatus: "draft";
}

export const previewCatalog: PreviewProduct[] = [
  {
    id: "seed-vgd-bim-lite",
    slug: "bim-lite",
    name: "VGD BIM Lite",
    summary: {
      vi: "Sản phẩm trong seed catalog. Nội dung giới thiệu đang chờ đối chiếu và duyệt.",
      en: "A planning-seed product. Its description is awaiting verification and review.",
    },
    editorialStatus: "draft",
  },
  {
    id: "seed-vgd-cabinet",
    slug: "cabinet",
    name: "VGD Cabinet — Dựng hình",
    summary: {
      vi: "Sản phẩm trong seed catalog. Nội dung giới thiệu đang chờ đối chiếu và duyệt.",
      en: "A planning-seed product. Its description is awaiting verification and review.",
    },
    editorialStatus: "draft",
  },
  {
    id: "seed-vgd-dim",
    slug: "dim",
    name: "VGD Dim",
    summary: {
      vi: "Sản phẩm trong seed catalog. Nội dung giới thiệu đang chờ đối chiếu và duyệt.",
      en: "A planning-seed product. Its description is awaiting verification and review.",
    },
    editorialStatus: "draft",
  },
  {
    id: "seed-vgd-image-importer",
    slug: "image-importer",
    name: "VGD Image Importer",
    summary: {
      vi: "Sản phẩm trong seed catalog. Nội dung giới thiệu đang chờ đối chiếu và duyệt.",
      en: "A planning-seed product. Its description is awaiting verification and review.",
    },
    editorialStatus: "draft",
  },
  {
    id: "seed-vgd-scenes",
    slug: "scenes",
    name: "VGD Scenes",
    summary: {
      vi: "Sản phẩm trong seed catalog. Nội dung giới thiệu đang chờ đối chiếu và duyệt.",
      en: "A planning-seed product. Its description is awaiting verification and review.",
    },
    editorialStatus: "draft",
  },
  {
    id: "seed-vgd-library",
    slug: "library",
    name: "VGD_Library",
    summary: {
      vi: "Sản phẩm trong seed catalog. Nội dung giới thiệu đang chờ đối chiếu và duyệt.",
      en: "A planning-seed product. Its description is awaiting verification and review.",
    },
    editorialStatus: "draft",
  },
];

export function getProduct(slug: string) {
  return previewCatalog.find((product) => product.slug === slug);
}
