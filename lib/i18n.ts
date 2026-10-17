export const locales = ["vi", "en"] as const;

export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function localized(vi: string, en: string, locale: Locale): string {
  return locale === "vi" ? vi : en;
}

export const ui = {
  vi: {
    nav: {
      home: "Trang chủ",
      plugins: "Tiện ích",
      center: "VGD Center",
      docs: "Tài liệu",
      changelog: "Cập nhật",
      roadmap: "Lộ trình",
      about: "Về VGD",
      contact: "Liên hệ",
      menu: "Mở điều hướng",
      closeMenu: "Đóng điều hướng",
      language: "Ngôn ngữ",
    },
    footer: {
      note: "Website giúp bạn tìm hiểu sản phẩm. VGD Center quản lý plugin bên trong SketchUp.",
      copyright: "Nội dung và thông tin phát hành sẽ được cập nhật sau khi xác nhận.",
    },
    preview: "Bản xem trước — danh mục và nội dung đang chờ đối chiếu, duyệt trước khi công khai.",
    noRelease: "Chưa có bản phát hành",
    compatibility: "Tương thích SketchUp đang được xác nhận",
    details: "Xem thông tin",
    centerCta: "Tìm hiểu VGD Center",
    learnMore: "Tìm hiểu thêm",
    backToPlugins: "Quay lại danh mục",
    searchLabel: "Tìm plugin theo tên",
    searchPlaceholder: "Ví dụ: VGD Dim",
    noSearchResults: "Không tìm thấy plugin phù hợp. Thử từ khóa khác nhé.",
    releaseEmptyTitle: "Chưa có bản phát hành",
    releaseEmptyBody: "Changelog sẽ hiển thị các release đã được publish trong manifest dùng chung với VGD Center.",
    readOnly: "Nội dung tĩnh · chỉ đọc",
    pending: "Đang được hoàn thiện",
  },
  en: {
    nav: {
      home: "Home",
      plugins: "Plugins",
      center: "VGD Center",
      docs: "Docs",
      changelog: "Changelog",
      roadmap: "Roadmap",
      about: "About",
      contact: "Contact",
      menu: "Open navigation",
      closeMenu: "Close navigation",
      language: "Language",
    },
    footer: {
      note: "The website helps you explore products. VGD Center manages plugins inside SketchUp.",
      copyright: "Content and release information will be updated after they are confirmed.",
    },
    preview: "Preview — catalog and copy are awaiting verification and review before publication.",
    noRelease: "No release available yet",
    compatibility: "SketchUp compatibility is being confirmed",
    details: "View details",
    centerCta: "Explore VGD Center",
    learnMore: "Learn more",
    backToPlugins: "Back to catalog",
    searchLabel: "Search plugins by name",
    searchPlaceholder: "For example: VGD Dim",
    noSearchResults: "No matching plugins. Try another search.",
    releaseEmptyTitle: "No release available yet",
    releaseEmptyBody: "The changelog will show releases published in the manifest shared with VGD Center.",
    readOnly: "Static content · read only",
    pending: "In progress",
  },
} satisfies Record<Locale, object>;

export function getUi(locale: Locale) {
  return ui[locale];
}
