import type { Locale } from "@/lib/i18n";

export interface Guide {
  slug: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  sections: Array<{
    heading: Record<Locale, string>;
    paragraphs: Record<Locale, string[]>;
  }>;
}

export const guides: Guide[] = [
  {
    slug: "website-va-center",
    title: {
      vi: "Website VGD và VGD Center",
      en: "The VGD website and VGD Center",
    },
    description: {
      vi: "Hiểu vai trò của website và extension quản lý trong SketchUp.",
      en: "Understand the roles of the website and the in-SketchUp manager.",
    },
    sections: [
      {
        heading: { vi: "Tìm hiểu trên website", en: "Explore on the website" },
        paragraphs: {
          vi: [
            "Website giúp bạn xem danh mục, đọc hướng dẫn, changelog và lộ trình của VGD.",
            "Website không cài hoặc gỡ plugin trực tiếp trong trình duyệt.",
          ],
          en: [
            "The website helps you browse the catalog, guides, changelog, and roadmap.",
            "The website does not install or uninstall plugins from the browser.",
          ],
        },
      },
      {
        heading: { vi: "Quản lý trong SketchUp", en: "Manage inside SketchUp" },
        paragraphs: {
          vi: [
            "VGD Center là extension dùng để xem catalog, cài, cập nhật và gỡ plugin VGD trong SketchUp.",
            "Website và Center sẽ đọc cùng một nguồn release metadata khi manifest chính thức được thiết lập.",
          ],
          en: [
            "VGD Center is the extension for browsing the catalog and installing, updating, or removing VGD plugins in SketchUp.",
            "The website and Center will use the same release metadata source once the canonical manifest is available.",
          ],
        },
      },
    ],
  },
  {
    slug: "cai-vgd-center",
    title: { vi: "Cài VGD Center", en: "Install VGD Center" },
    description: {
      vi: "Hướng dẫn tổng quan; link tải chính thức sẽ được thêm sau khi xác nhận release.",
      en: "A general guide; the official download link will be added after the release is confirmed.",
    },
    sections: [
      {
        heading: { vi: "Trạng thái tải xuống", en: "Download status" },
        paragraphs: {
          vi: [
            "Chưa có link tải VGD Center chính thức được cấu hình trên website. Không tải RBZ từ nguồn không xác nhận.",
            "Khi có release chính thức, trang VGD Center sẽ hiển thị đúng gói và hướng dẫn cài bằng Extension Manager của SketchUp.",
          ],
          en: [
            "An official VGD Center download link has not been configured on the website. Do not use an unverified RBZ source.",
            "When an official release is available, the VGD Center page will show the package and Extension Manager installation steps.",
          ],
        },
      },
    ],
  },
];

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
