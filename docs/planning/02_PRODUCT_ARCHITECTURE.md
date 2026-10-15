# 02 — Product Architecture

## 1. Hệ sinh thái và vai trò

| Hệ thống | Sở hữu dữ liệu/chức năng | Không làm |
|---|---|---|
| VGD_Plugins | Source, test/build, Git tag, GitHub Release, RBZ, SHA-256, release manifest | Không chứa source website |
| VGD_Web | Homepage, marketing copy, localized content, media, docs, roadmap, changelog presentation | Không cài/gỡ plugin; không sở hữu version độc lập |
| VGD Center | Catalog trong SketchUp, cài, update, uninstall, kiểm tra phiên bản và checksum | Không làm marketing CMS/website |
| Vercel | Build/deploy VGD_Web, preview cho PR, production hosting | Không làm nguồn dữ liệu sản phẩm |
| Legacy repo | Backup/reference/migration evidence | Không publish production metadata |

~~~mermaid
flowchart LR
  PL["VGD_Plugins: source/build/release"]
  M["Shared release manifest"]
  C["VGD Center: install/update/uninstall"]
  W["VGD_Web: catalog/docs/changelog"]
  V["Vercel: hosting"]
  PL --> M
  M --> C
  M --> W
  W --> V
~~~

Sơ đồ quan hệ hệ thống được nhúng ngay trong tài liệu này.

## 2. Nhóm người dùng

### Người dùng chính

- Người thiết kế SketchUp muốn tìm công cụ phù hợp workflow nội thất/kiến trúc.
- Người dựng hoặc triển khai sản xuất muốn kiểm tra công dụng, yêu cầu phiên bản SketchUp và hướng dẫn.
- Người mới biết VGD, cần hiểu VGD Center là gì và cách cài lần đầu.
- Người đang dùng plugin VGD, cần xem changelog và biết bản mới nào tương thích.

### Người quản trị nội dung (không phải hệ thống đăng nhập)

- Người maintain VGD_Web cập nhật bài docs, nội dung Việt/Anh, ảnh/video và roadmap qua Git pull request.
- Người maintain VGD_Plugins xuất release và manifest qua workflow repo plugin.

Không có user account, customer account, payment account hoặc license role trong Phase 1.

### Inventory repo và roster website

Audit GitHub ngày 15/10/2026: repo vuongpentax/VGD_Plugins truy cập được, default branch main, HEAD e138359685452a5cece58bc093b4b9ec07dfbb18; PR #1 đã merge và remote branch list chỉ còn main. Repo có 10 thư mục plugins: VGD_BIM, VGD_Cabinet, VGD_Cabinet_Draw, VGD_Center, VGD_Dim, VGD_Image_Importer, VGD_Library, VGD_Package, VGD_Reference, VGD_Scenes. Đây là inventory source, chưa phải roster catalog. Snapshot chưa có GitHub Releases, tags, RBZ tracked files, .github/workflows/ hay shared manifest. plugins/VGD_Dim/VGD_UPDATE_MANIFEST.json là file updater riêng. Repo vuongpentax/VGD_Web đã tồn tại, default branch main nhưng Git tree rỗng. Không xem version labels/release-note files là release công khai.

Seed catalog gồm VGD BIM Lite, VGD Cabinet — Dựng hình, VGD Dim, VGD Image Importer, VGD Scenes và VGD_Library. Chủ dự án duyệt vai trò các mục source bổ sung trước khi đưa vào catalog; các sản phẩm đã duyệt sẽ công khai Phase 1. Không tự thêm T+, Sink hoặc Beam.
## 3. Source of truth và data ownership

| Field | Nguồn chính | Website dùng | Center dùng |
|---|---|---|---|
| Product ID, display name, public status | Manifest trong VGD_Plugins | Có | Có |
| Current version theo channel | Con trỏ channel trong manifest tới release đã publish | Có | Có |
| Lịch sử release | Release records đầy đủ trong manifest | Dựng changelog | Dùng khi cần |
| VGD Center release/version | Entry riêng của Center trong cùng manifest | Có trên trang Center | Có thể dùng nếu Center hỗ trợ đọc metadata tự cập nhật chính nó |
| Release date, tag, changelog, asset URL | GitHub Release → manifest | Có | Có |
| Filename, byte size, SHA-256 | GitHub Release asset / release workflow → manifest | Hiển thị/chú thích | Bắt buộc xác minh gói |
| Compatibility | Manifest do plugin owner xác nhận | Hiển thị rõ | Dùng để lọc/cảnh báo |
| Product summary/feature copy | VGD_Web content | Có | Không cần |
| Bản dịch Anh/Việt | VGD_Web content | Có | Không cần |
| Screenshots/video/diagrams | VGD_Web public assets | Có | Không cần |
| Docs | Markdown content trong VGD_Web | Có | Có thể mở liên kết |
| Roadmap | Markdown content trong VGD_Web | Có | Không |

Version, channel, compatibility, direct download URL và checksum không được nhập tay ở website. Nếu người maintain thấy thông tin sai, phải sửa nguồn canonical hoặc quy trình release rồi để website/Center đọc lại.

## 4. Cấu trúc nội dung web đề xuất

- content/plugins/<slug>.mdx: copy song ngữ, features, screenshots, workflow, FAQ, links.
- content/docs/<locale>/<slug>.mdx: hướng dẫn sử dụng và cài đặt.
- content/roadmap/<locale>.mdx hoặc file dữ liệu có schema: cards, status, target window nếu có.
- public/brand/: logo/favicon khi user gửi.
- public/plugins/<id>/: screenshot/video poster/icon do VGD sở hữu.
- lib/releases/: tải/validate/cache manifest và map vào UI types.

Marketing content không được chứa trường version hoặc “latest version”; component lấy những dữ liệu đó từ manifest.

## 5. Phase boundary

### Phase 1 — Public product home

- Public catalog/detail pages, docs, changelog, roadmap, about/contact.
- Hai ngôn ngữ; Việt mặc định.
- Tất cả product entries thuộc danh mục production hiển thị; tạm label Free.
- VGD Center CTA và hướng dẫn.
- Static content, public read-only manifest, Vercel deployment.

### Ngoài Phase 1

- Đăng nhập, profile, customer portal.
- Checkout/payment/order history.
- License purchase/activation/revoke/trial.
- Protected downloads, signed URLs, API secrets in plugin.
- User-submitted roadmap/voting.
- Admin CMS/dashboard và behavioral analytics vượt mức tối thiểu.

Các phase sau chỉ được bổ sung bằng thiết kế mới và review riêng; Phase 1 không dựng khung backend ẩn cho commerce.

## 6. Content/release publishing model

1. Plugin release workflow test source, build RBZ, kiểm tra package và tạo checksum.
2. Workflow tạo GitHub Release với tag/channel và asset; chưa publish nếu asset/test chưa sẵn.
3. Workflow build/validate manifest từ registry + release facts.
4. Manifest được cập nhật ở một URL public ổn định thuộc VGD_Plugins.
5. VGD_Web cache/revalidate, cập nhật product cards/detail/changelog.
6. VGD Center đọc cùng URL, lọc channel theo cài đặt và xác minh SHA-256 trước khi cài.

Đề xuất canonical metadata/release-manifest.json và metadata/release-manifest.schema.json trong VGD_Plugins; hai file và release workflow chưa tồn tại ở snapshot audit. Registry cần có một entry VGD Center để trang Center lấy version/link tải từ cùng nguồn; binary của Center có thể được phát hành ở repo khác, vị trí lưu release cần xác nhận khi audit. Việc Center tự cập nhật bản thân là quyết định riêng, không tự suy ra từ việc Center quản lý plugin.

## 7. Sơ đồ và luồng publish

Sơ đồ hệ sinh thái nằm ở mục 1. Trình tự publish release và cập nhật manifest được quy định trong `05_RELEASE_MANIFEST_SPEC.md`.


`visibility`, `lifecycle` và editorial `publication_status` là ba khái niệm riêng. Một sản phẩm có thể public và đang phát triển; chỉ nội dung đã duyệt mới vào sitemap. Chỉ release có asset/checksum hợp lệ mới installable. Schema canonical không được sao chép độc lập sang VGD_Web.
