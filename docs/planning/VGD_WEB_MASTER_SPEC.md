# VGD_WEB_MASTER_SPEC

**Version:** Planning 1.2
**Ngày lập:** 14/10/2026; cập nhật audit 15/10/2026  
**Trạng thái:** Product/design decisions recorded; repo-specific release details and brand assets pending.

## 1. Product definition

VGD Web là trang chủ công khai cho hệ plugin VGD: giúp người dùng tìm hiểu sản phẩm, chọn plugin, đọc docs/changelog/roadmap và điều hướng tới VGD Center để cài hoặc quản lý plugin trong SketchUp.

**VGD Web không thay VGD Center.** Center là Extension Manager duy nhất cho cài đặt, cập nhật, gỡ và quản lý plugin bên trong SketchUp.

## 2. System boundaries

~~~mermaid
flowchart LR
  P["VGD_Plugins: source + build + releases"]
  M["Shared release manifest"]
  C["VGD Center: install/update/uninstall"]
  W["VGD_Web: catalog/docs/changelog"]
  V["Vercel: hosting"]
  P --> M
  M --> C
  M --> W
  W --> V
~~~

VGD_Plugins là source of truth cho release facts. VGD_Web là nguồn cho web copy, docs, media và roadmap. VGD Center và Web cùng đọc release metadata. Vercel chỉ host website, không làm data authority.

## 3. Locked decisions

- Brand hiển thị là VGD.
- Repo website riêng VGD_Web.
- Repo plugin production vuongpentax/VGD_Plugins; Legacy chỉ là archive/reference.
- Audit GitHub ngày 15/10/2026: repo vuongpentax/VGD_Plugins truy cập được, default branch main, HEAD e138359685452a5cece58bc093b4b9ec07dfbb18; PR #1 đã merge và remote branch list chỉ còn main. Repo có 10 thư mục plugins: VGD_BIM, VGD_Cabinet, VGD_Cabinet_Draw, VGD_Center, VGD_Dim, VGD_Image_Importer, VGD_Library, VGD_Package, VGD_Reference, VGD_Scenes. Đây là inventory source, chưa phải roster catalog. Snapshot chưa có GitHub Releases, tags, RBZ tracked files, .github/workflows/ hay shared manifest. plugins/VGD_Dim/VGD_UPDATE_MANIFEST.json là file updater riêng. Repo vuongpentax/VGD_Web đã tồn tại, default branch main nhưng Git tree rỗng. Không xem version labels/release-note files là release công khai.
- Toàn bộ plugin production hiện hành public khi launch, tạm hiển thị Free.
- Roster seed đã biết: VGD BIM Lite, VGD Cabinet — Dựng hình, VGD Dim, VGD Image Importer, VGD Scenes, VGD_Library; cần đối chiếu repo production mới, không tự thêm T+/Sink/Beam từ danh sách cũ.
- Ngôn ngữ Việt và Anh; tiếng Việt mặc định.
- Giao diện sáng Phase 1; xsu.vn làm tham khảo cấu trúc/content, palette để sau.
- Roadmap tĩnh, công khai.
- Docs viết bằng Markdown/MDX trong website.
- Next.js, TypeScript, Tailwind CSS, Vercel.
- Không account/payment/license trong Phase 1.
- Không cài plugin trực tiếp từ website.
- Website và Center dùng một nguồn release/version metadata.
- URL tiếng Việt mặc định: `/` redirect tới `/vi`; nội dung tiếng Anh dùng `/en`.

## 4. Scope

### Phase 1 pages

Homepage, plugins index, product detail, VGD Center, docs, changelog, roadmap, about và contact.

### Later phases

Account, ownership, payment, license, trials, device activation, protected downloads, customer portal và admin dashboard. Không tạo những phần này trong Phase 1.

## 5. Product IA

- Homepage: value proposition, product families, featured plugins, Center, latest releases, changelog, roadmap.
- Catalog: mọi sản phẩm public với search/category/status/channel/compatibility filters khi data có.
- Product page: purpose, requirements, release status, compatibility, features, media, workflow, docs, changelog và FAQ.
- Center page: first install, download, channel explanation, update/uninstall help và troubleshooting.
- Docs: search chỉ thêm nếu content lớn; navigation/breadcrumbs bắt buộc.
- Changelog: filter theo product/channel; hiển thị full release history từ canonical manifest, liên kết GitHub Release khi có.
- Roadmap: static, read-only theo status.

## 6. UX và visual direction

Dùng thiết kế technical/architectural, gọn và chuyên nghiệp. Tham khảo cách xsu.vn nhóm sản phẩm, viết mô tả ngắn, dùng demo, nêu compatibility/version và cập nhật. Tạo layout riêng cho VGD. Dùng neutral light tokens cho đến khi có logo và palette. Tách badge Alpha/Beta/Stable khỏi nhãn Free tạm thời.

Mọi layout responsive và keyboard accessible. Từ homepage tới install guide tối đa ba bước điều hướng. CTA chính trên web chuyển người dùng qua VGD Center.

## 7. Release architecture

Một manifest JSON và JSON Schema canonical trong VGD_Plugins; đề xuất metadata/release-manifest.json và metadata/release-manifest.schema.json (chưa tồn tại). GitHub Release giữ RBZ và release notes. CI tính/kiểm SHA-256, validate release và cập nhật manifest. VGD Web đọc public manifest server-side với cache/revalidation; Center đọc cùng URL và xác minh checksum trước khi cài. Manifest có entry `kind: manager` cho VGD Center để trang Center đọc version/download metadata từ cùng nguồn; điều này không khẳng định Center tự cập nhật bản thân.

Schema đề xuất trong 05_RELEASE_MANIFEST_SPEC.md định nghĩa stable product IDs, public visibility, lifecycle, full release history và current channel pointers. Changelog đọc toàn bộ release history từ manifest; không phụ thuộc API GitHub lúc render. Web copy/translation nằm trong VGD_Web. Tag naming, channel mapping và manifest path còn pending.

## 8. Technical baseline

- App Router, strict TypeScript, Tailwind, static content routes.
- Server-side manifest fetch/validation; đề xuất revalidation 300 giây.
- Markdown/MDX cho docs và editorial copy.
- Localized metadata, canonical URLs, hreflang, sitemap, robots, Open Graph.
- Vercel Preview cho PR và Production từ nhánh sẽ chốt.
- Không database, GitHub token trong browser, auth, checkout hay license API.

## 9. Launch gates and TODO

### Giả định dùng để hoàn tất planning

- Chủ dự án chọn công khai toàn bộ production plugins và tạm hiển thị Free. Sáu module là seed catalog; repo có 10 source/manager folders, cần phân loại thư mục nào là plugin người dùng và thư mục nào là manager/tooling. Folder presence không tự tạo catalog entry.
- Mọi sản phẩm production được xác nhận thuộc catalog sẽ public trong Phase 1 và tạm hiển thị Free. Không đưa giá vào release manifest.
- Sản phẩm có thể được giới thiệu công khai trước release đầu tiên; khi chưa có release, hiển thị trạng thái phát triển, không có version/download.
- VI và EN đều là locale launch; VI mặc định. Các trang public cần bản dịch đã review trước production.
- Không có contact form, analytics hoặc thu thập dữ liệu người dùng nếu chưa có yêu cầu/chính sách riêng; trang contact dùng liên kết chính thức sau khi được cung cấp.
- Preview có thể dùng fixture rõ ràng là dữ liệu thử; production không được xuất bản fixture hoặc link CTA giả.
- Cache/revalidate khoảng 300 giây là mục tiêu đề xuất để giới hạn độ trễ release, không phải SLA đã được người dùng chốt.

| Item | Owner/status |
|---|---|
| Official logo/palette | User sẽ gửi sau |
| Screenshots/videos | User sẽ bổ sung sau |
| VGD Center exact download URL | User sẽ bổ sung sau |
| Canonical manifest path | Đã chốt: `shared/vgd-center/catalog.json` trên `main` của VGD_Plugins (Center đọc trực tiếp). Chưa mở rộng sang schema 05 (thiếu `releases[]` lịch sử, `lifecycle`, `channels`); làm sau khi xác nhận Center parser chấp nhận trường bổ sung |
| Release convention | Repo mới chưa release; user bổ sung sau |
| Plugin roster | Đã chốt public toàn bộ production plugins; phân loại 10 folder thành plugin/manager/tooling |
| Compatibility per plugin | Verify từ plugin owner/source |
| Domain | Dùng Vercel Preview trước; domain thêm sau |
| GitHub audit | Đã xác minh 15/10/2026; PR #1 merged, remote branch chỉ còn main, VGD_Web tree rỗng |
| Contact details/privacy notice | Chưa cung cấp; chốt trước khi thêm form, analytics hoặc thu thập dữ liệu |

Production launch không có placeholder download URL hay fabricated release data. Preview có thể dùng fixture ghi rõ không phải production.

## 10. Definition of Done

- Homepage, catalog, từng product page, Center, docs, changelog, roadmap, about/contact.
- VI/EN và mobile được review.
- Current version/release facts từ một nguồn chung với Center.
- RBZ URL và SHA-256 được validate.
- Không broken CTA/media, fake data, console error hay horizontal overflow.
- Không code payment/account/license.
- Vercel Preview được review; production publish chỉ sau khi user review riêng.

## 11. Companion documents

- 00_EXECUTIVE_SUMMARY.md
- 01_RESEARCH.md
- 02_PRODUCT_ARCHITECTURE.md
- 03_SITEMAP_AND_FLOWS.md
- 04_UI_UX_SPEC.md
- 05_RELEASE_MANIFEST_SPEC.md
- 06_TECHNICAL_SPEC.md
- 07_CODEX_HANDOFF.md
- Sơ đồ hệ sinh thái và hành trình được nhúng trong `02_PRODUCT_ARCHITECTURE.md` và `03_SITEMAP_AND_FLOWS.md`.

## 12. Stage A→G coverage

| Stage | Nội dung hoàn tất | Tài liệu chính |
|---|---|---|
| A | Research, benchmark và nguồn | `01_RESEARCH.md` |
| B | Product boundary, hệ sinh thái và data ownership | `02_PRODUCT_ARCHITECTURE.md` |
| C | Sitemap và user journeys | `03_SITEMAP_AND_FLOWS.md` |
| D | UI/UX, component states và responsive/accessibility | `04_UI_UX_SPEC.md` |
| E | Shared release manifest/schema/validation | `05_RELEASE_MANIFEST_SPEC.md` |
| F | Next.js/Vercel, rendering, SEO, privacy và QA | `06_TECHNICAL_SPEC.md` |
| G | Codex build sequence và acceptance criteria | `07_CODEX_HANDOFF.md` |

`00_EXECUTIVE_SUMMARY.md` tóm tắt quyết định và `VGD_WEB_MASTER_SPEC.md` là bản hợp nhất điều phối các stage. Bộ bàn giao bắt buộc gồm đúng chín file Markdown được liệt kê ở trên; sơ đồ nằm trong tài liệu và nguồn được liên kết trực tiếp tại `01_RESEARCH.md`.
