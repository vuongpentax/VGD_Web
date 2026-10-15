# 00 — Executive Summary

**Dự án:** Website chính thức VGD  
**Ngày lập:** 14/10/2026; cập nhật audit GitHub 15/10/2026  
**Mục tiêu:** thiết kế và khóa đặc tả toàn bộ website trước khi giao Codex viết code.

## Quyết định đã chốt

| Hạng mục | Quyết định |
|---|---|
| Thương hiệu | VGD |
| Repo plugin production | vuongpentax/VGD_Plugins |
| Repo website | vuongpentax/VGD_Web, độc lập với repo plugin |
| Legacy | Chỉ backup/reference; không dùng làm production source |
| Vai trò website | Trang chủ sản phẩm, catalog, tài liệu, changelog, roadmap |
| Vai trò Center | Extension Manager duy nhất bên trong SketchUp: cài, cập nhật, gỡ, quản lý |
| Launch | Công khai toàn bộ plugin thuộc danh mục production; tạm ghi nhãn Free |
| Ngôn ngữ | Tiếng Việt và tiếng Anh; tiếng Việt mặc định |
| Tham khảo | xsu.vn về cấu trúc giới thiệu bộ công cụ; chưa khóa màu |
| Giao diện | Sáng ở Phase 1; palette sẽ bổ sung cùng logo/brand assets |
| Roadmap | Công khai, dạng đọc tĩnh; chưa có vote hoặc submit |
| Docs | Nội dung Markdown trong website |
| Stack | Next.js, TypeScript, Tailwind CSS, Vercel |
| Commerce | Không làm account, payment hay license trong Phase 1 |
| Release data | Website và Center phải đọc cùng một nguồn version/release metadata |

## Định hướng sản phẩm

Người dùng vào website để hiểu VGD làm gì, tìm đúng plugin, xem tính năng và mức tương thích, đọc hướng dẫn, kiểm tra changelog, rồi chuyển sang VGD Center để cài và cập nhật trong SketchUp. Website không cài plugin trực tiếp và không thay Center.

Trải nghiệm nên gần với xsu.vn ở cách giới thiệu một họ công cụ SketchUp theo sản phẩm và workflow. Mỗi sản phẩm cần cho thấy tên, lợi ích, hình minh họa, tương thích, phiên bản, tài liệu và cập nhật. Website không bê nguyên luồng tài khoản, kích hoạt, thanh toán hay cấp phép của website tham khảo.

### Roster nền để lập kế hoạch

Seed catalog do chủ dự án nêu có 6 module: VGD BIM Lite, VGD Cabinet — Dựng hình, VGD Dim, VGD Image Importer, VGD Scenes và VGD_Library. Audit GitHub ngày 15/10/2026: repo vuongpentax/VGD_Plugins truy cập được, default branch main, HEAD e138359685452a5cece58bc093b4b9ec07dfbb18; PR #1 đã merge và remote branch list chỉ còn main. Repo có 10 thư mục plugins: VGD_BIM, VGD_Cabinet, VGD_Cabinet_Draw, VGD_Center, VGD_Dim, VGD_Image_Importer, VGD_Library, VGD_Package, VGD_Reference, VGD_Scenes. Đây là inventory source, chưa phải roster catalog. Snapshot chưa có GitHub Releases, tags, RBZ tracked files, .github/workflows/ hay shared manifest. plugins/VGD_Dim/VGD_UPDATE_MANIFEST.json là file updater riêng. Repo vuongpentax/VGD_Web đã tồn tại, default branch main nhưng Git tree rỗng. Không xem version labels/release-note files là release công khai. Không đưa T+, Sink hoặc Beam từ danh sách cũ vào catalog nếu chưa được xác nhận.

`/` sẽ chuyển hướng tới `/vi`; mọi trang nội dung có route tương ứng dưới `/vi/...` và `/en/...`. Hai locale cần nội dung được review đầy đủ khi launch; không để một trang tiếng Anh lặng lẽ hiển thị bản tiếng Việt.

## Kiến trúc được đề xuất

- GitHub Releases trong VGD_Plugins giữ các gói RBZ và ghi chú release.
- Manifest JSON và JSON Schema canonical trong VGD_Plugins là nguồn chung cho Center và website. Đề xuất metadata/release-manifest.json và metadata/release-manifest.schema.json; hiện chưa tồn tại. Manifest giữ release history đầy đủ và con trỏ release hiện hành theo channel.
- VGD_Web giữ nội dung marketing, bản dịch, hình ảnh, FAQ, bài hướng dẫn và roadmap.
- Website đọc manifest ở server side, kiểm tra cấu trúc rồi cache/revalidate định kỳ. Không nhúng token GitHub vào trình duyệt.
- VGD Center đọc đúng URL manifest đó và xác minh SHA-256 của gói tải về trước khi cài/cập nhật.

## Giới hạn và điều kiện

- Tạm gắn Free cho toàn bộ sản phẩm ra mắt; đây là nhãn ở giai đoạn Phase 1, không hàm ý miễn phí vĩnh viễn.
- Chủ dự án đã chọn công khai toàn bộ production plugins và tạm hiển thị Free. Sáu module là seed catalog; cần phân loại 10 thư mục trong repo thành plugin dành cho người dùng, VGD Center và tooling trước khi tạo product records. Legacy chỉ dùng làm backup/reference.
- Không bịa version, compatibility, asset URL hoặc hướng dẫn tải nếu release chưa có.
- Logo và media, URL tải Center, đường dẫn manifest và release convention đang chờ bổ sung.
- Audit GitHub ngày 15/10/2026: repo vuongpentax/VGD_Plugins truy cập được, default branch main, HEAD e138359685452a5cece58bc093b4b9ec07dfbb18; PR #1 đã merge và remote branch list chỉ còn main. Repo có 10 thư mục plugins: VGD_BIM, VGD_Cabinet, VGD_Cabinet_Draw, VGD_Center, VGD_Dim, VGD_Image_Importer, VGD_Library, VGD_Package, VGD_Reference, VGD_Scenes. Đây là inventory source, chưa phải roster catalog. Snapshot chưa có GitHub Releases, tags, RBZ tracked files, .github/workflows/ hay shared manifest. plugins/VGD_Dim/VGD_UPDATE_MANIFEST.json là file updater riêng. Repo vuongpentax/VGD_Web đã tồn tại, default branch main nhưng Git tree rỗng. Không xem version labels/release-note files là release công khai.
- Các đầu vào còn chờ: logo/palette, ảnh/video, URL tải VGD Center, vị trí manifest, quy ước tag/channel và metadata release/compatibility thực tế.

## Thứ tự triển khai sau khi duyệt spec

1. Bổ sung asset thương hiệu và URL tải Center.
2. Phân loại 10 thư mục nguồn thành catalog plugin, VGD Center và tooling; chốt manifest path, release tags và workflow.
3. Khóa schema và release workflow để Center/website dùng chung.
4. Giao Codex bootstrap repo VGD_Web và component system.
5. Làm catalog, plugin detail, docs, Center, changelog và roadmap.
6. Kiểm tra desktop/mobile, accessibility, SEO, dữ liệu release lỗi/stale và Vercel Preview.

## Tiêu chí đạt Phase 1

Website có homepage, catalog, trang riêng cho từng plugin, trang Center, docs, changelog, roadmap, about/contact; hỗ trợ Việt/Anh và mobile; version tự lấy từ một manifest chung; chạy được trên Vercel; không chứa commerce/account/license code.

**Trạng thái gói này:** hoàn tất planning Stage A→G; chưa tạo hoặc sửa production code website. Những đầu vào được đánh dấu chờ vẫn là launch/code gates, không được thay bằng dữ liệu giả.
