# 01 — Research

**Ngày khảo sát:** 14/10/2026  
**Phạm vi:** website plugin SketchUp, cách trình bày sản phẩm, tài liệu và cập nhật; khả năng triển khai bằng Next.js/Vercel; metadata GitHub Releases.

## 1. Kết quả chính

1. Dùng xsu.vn làm tham khảo về cách giới thiệu một bộ công cụ theo nhóm sản phẩm: sản phẩm có biểu tượng/ảnh, mô tả ngắn, nút hướng dẫn, phiên bản hiện tại, ngày cập nhật và dải tương thích SketchUp.
2. Trang plugin cần giải thích giá trị thực tế và workflow bằng hình/video; không nên chỉ là danh sách nút tải. Profile Builder làm rõ sản phẩm qua use case, nhóm tính năng và tài liệu/video.
3. Catalog nên lọc/tìm kiếm nhanh. Extension Warehouse và SketchUcation cho thấy người dùng plugin cần nhìn thấy category, phiên bản, ngày cập nhật và mô tả ngay trên listing.
4. Website VGD đưa người dùng sang VGD Center khi muốn cài/cập nhật. Không tạo một cơ chế cài plugin thứ hai trên web.
5. Release metadata cần manifest chung vì GitHub Release có thông tin tag, nội dung release và asset nhưng không mô tả đầy đủ các trường riêng của VGD như kênh stable/beta/alpha, compatibility đã kiểm thử, slug sản phẩm và chính sách hiển thị.
6. Phase 1 có thể dùng Next.js App Router, render trang nội dung tĩnh và cache manifest công khai với thời hạn ngắn. Không cần database hay tài khoản.

## 2. Benchmark website

| Website | Quan sát | Áp dụng cho VGD |
|---|---|---|
| [XSU](https://xsu.vn/) | Trang chủ gom nhiều bộ công cụ; từng khối có hình minh họa tính năng, mô tả ngắn, hướng dẫn, CTA tải/cài, dải Windows/SketchUp được hỗ trợ, phiên bản/ngày cập nhật và liên kết thay đổi. Trang cũng có phần danh sách yêu cầu/cập nhật. Quan sát trang chủ ngày 14/10/2026. | Tham khảo cách trình bày họ sản phẩm và cung cấp đủ dữ liệu để người dùng tự đánh giá. VGD dùng Center làm installer; không sao chép pixel, palette hay luồng tài khoản/thanh toán/license. |
| [SketchUp Extension Warehouse](https://extensions.sketchup.com/) | Marketplace tập trung vào tìm kiếm và duyệt extension; listing có mô tả, người phát triển, tương thích, giá/miễn phí và thông tin đánh giá tùy sản phẩm. | Mượn cách làm rõ category, compatibility và trạng thái sản phẩm; VGD vẫn là brand site. |
| [SketchUcation PluginStore](https://sketchucation.com/pluginstore) | Catalog dày nhưng có filters, mô tả, version, ngày cập nhật và download data; liên kết cộng đồng, tutorials và extension manager. | Cần search/filter và changelog có cấu trúc. Tránh yêu cầu đăng ký tài khoản ở Phase 1. |
| [Profile Builder](https://profilebuilder4sketchup.com/) | Homepage kể lợi ích theo người dùng và workflow; làm nổi bật Profiles/Assemblies, tutorials, feature release và tương thích. | Mỗi VGD product page cần use case + tính năng theo nhóm + media + docs. Bỏ pricing/trial/license CTA. |
| [Curic Extensions](https://www.curic.io/) | Trang thương hiệu tối giản, ít thông tin sản phẩm trên homepage và chuyển sang kênh mua/xã hội. | VGD nên giữ homepage gọn nhưng cung cấp product pages/docs đầy đủ hơn. |
| [Skalp](https://www.skalp4sketchup.com/) | Website chuyên một sản phẩm; kết quả tra cứu cho thấy trang tải có nhắc cập nhật từ bên trong SketchUp/Skalp và release notes riêng. Trang chủ không truy xuất được ổn định trong lần khảo sát. | Tách product detail và release notes; không phụ thuộc homepage làm nguồn version duy nhất. |

### Đọc xsu.vn theo nhu cầu VGD

Phần hữu ích nhất là cấu trúc sản phẩm: tên bộ công cụ, icon minh họa tính năng, một câu mô tả, link hướng dẫn, nút hành động, version/ngày cập nhật và compatibility range. Những mục đó giúp người dùng tự đánh giá plugin trước khi cài. XSU còn dành nội dung đáng kể cho changelog theo từng version; VGD nên giữ changelog có cấu trúc, nhưng gom release feed ở một trang riêng và cho lọc theo plugin.

XSU cũng có tài khoản, mua hàng, kích hoạt và luồng license. Các nội dung này nằm ngoài phạm vi được chốt cho VGD Phase 1. Color palette và style chi tiết chưa được chốt theo yêu cầu; nghiên cứu hiện chỉ dùng XSU làm tham chiếu IA/content.

### Khác biệt định vị

- XSU giới thiệu bộ tiện ích thiên về thiết kế và sản xuất nội thất ngay trên SketchUp; VGD có hệ plugin SketchUp và sẽ mở rộng thành hệ công cụ hỗ trợ workflow.
- VGD có VGD Center làm quản lý cài/update riêng, do đó website chỉ làm discovery, education và điều hướng.
- VGD cần phân biệt trạng thái phát triển Alpha/Beta/Stable với nhãn Free tạm thời. Chúng mô tả hai điều khác nhau.
- Danh sách toàn bộ plugin sẽ được nạp từ product registry trong manifest. Trước launch cần xác nhận registry khớp với danh mục repo mới.

### Danh mục nền đã biết và giới hạn xác minh

Seed catalog gồm VGD BIM Lite, VGD Cabinet — Dựng hình, VGD Dim, VGD Image Importer, VGD Scenes và VGD_Library. Audit GitHub ngày 15/10/2026: repo vuongpentax/VGD_Plugins truy cập được, default branch main, HEAD e138359685452a5cece58bc093b4b9ec07dfbb18; PR #1 đã merge và remote branch list chỉ còn main. Repo có 10 thư mục plugins: VGD_BIM, VGD_Cabinet, VGD_Cabinet_Draw, VGD_Center, VGD_Dim, VGD_Image_Importer, VGD_Library, VGD_Package, VGD_Reference, VGD_Scenes. Đây là inventory source, chưa phải roster catalog. Snapshot chưa có GitHub Releases, tags, RBZ tracked files, .github/workflows/ hay shared manifest. plugins/VGD_Dim/VGD_UPDATE_MANIFEST.json là file updater riêng. Repo vuongpentax/VGD_Web đã tồn tại, default branch main nhưng Git tree rỗng. Không xem version labels/release-note files là release công khai. Chủ dự án đã chọn công khai toàn bộ production plugins; cần phân loại 10 thư mục nguồn thành sản phẩm cài được, manager và tooling. Không tự thêm T+, Sink hoặc Beam từ danh sách cũ.

## 3. Kết luận về data & release

GitHub REST Release API trả các trường release như tag, tên, ghi chú, trạng thái prerelease và assets; asset có URL tải, tên, content type, kích thước và digest khi GitHub cung cấp. GitHub hiện nêu rõ SHA-256 digest được tính cho assets tải lên. Dữ liệu gốc này hữu ích cho workflow, nhưng không đủ để là product catalog VGD hoàn chỉnh.

Đề xuất: manifest JSON và JSON Schema canonical trong VGD_Plugins; product record giữ release history đầy đủ và current-release pointers theo channel. Workflow build RBZ, tính checksum, upload asset, xác nhận release đã publish, rồi validate và cập nhật manifest. VGD Web và Center chỉ đọc manifest; không tự đoán latest version từ tên file hoặc nhập version độc lập.

## 4. Next.js và Vercel

- Dùng App Router và TypeScript cho route theo locale, catalog, product pages và docs.
- Render homepage, catalog, product pages và Markdown content tĩnh khi build; mọi version/compatibility có nguồn từ manifest.
- Đọc manifest ở server side bằng fetch có cache/revalidation; đề xuất chu kỳ revalidate 5 phút cho Phase 1. Lần publish mới có thể mất tối đa khoảng một chu kỳ để hiện lên.
- Dùng Vercel Git integration: branch/PR tạo Preview, nhánh production tạo deployment production. Chưa cần cấu hình domain riêng để bắt đầu preview.
- Metadata API, sitemap, robots và OG images phục vụ SEO. Chuẩn bị hreflang/canonical cho Việt-Anh.
- Không gọi GitHub API từ trình duyệt, không đặt secret trong client bundle và không cần database cho Phase 1.

Đây là khuyến nghị kiến trúc theo yêu cầu hiện tại, không phải giới hạn bắt buộc của Next.js/Vercel. Nếu repo manifest hoặc yêu cầu freshness thay đổi sau khi kiểm tra VGD_Plugins, cần điều chỉnh cache/release trigger.

## 5. Rủi ro và câu hỏi cần chốt trước code

| Vấn đề | Trạng thái | Cách xử lý |
|---|---|---|
| Repo production đã được audit | GitHub repo nay truy cập được; PR #1 merged, remote chỉ còn main | Kiểm tra quyền/repo khi bắt đầu implementation; không suy ra rằng repo không tồn tại. |
| Chưa có release mới | User xác nhận repo mới chưa release | Xây schema/example và validator trước; dùng fixture minh họa, không hiển thị version giả trên website. |
| Manifest path chưa chọn | Chưa có shared manifest | Đề xuất metadata/release-manifest.json và schema cùng thư mục; chưa tồn tại. |
| Logo, palette và ảnh/video | Chờ user bổ sung | UI spec dùng design tokens trung tính; content placeholders không giả làm hình thật. |
| Link tải VGD Center | Chờ user bổ sung | CTA có trạng thái setup-required trong preview; production launch gate yêu cầu URL đúng. |
| Danh sách sản phẩm | User muốn public mọi production plugin | Phân loại 10 thư mục nguồn thành plugin cho người dùng, manager và tooling; không lôi dự án Legacy/archive vào catalog. |

## 6. Nguồn tham khảo

- XSU: https://xsu.vn/
- XSU guide: https://xsu.vn/huong-dan/
- XSU updates: https://xsu.vn/cap-nhat/
- SketchUp Extension Warehouse: https://extensions.sketchup.com/
- SketchUp developer info: https://help.sketchup.com/en/extension-warehouse/developing-extensions
- SketchUcation PluginStore: https://sketchucation.com/pluginstore
- Profile Builder: https://profilebuilder4sketchup.com/
- Profile Builder learning: https://profilebuilder4sketchup.com/learn/
- Curic: https://www.curic.io/
- Skalp: https://www.skalp4sketchup.com/
- GitHub REST Release API: https://docs.github.com/en/rest/releases
- GitHub release asset SHA-256 digests: https://github.blog/changelog/2025-06-03-releases-now-expose-digests-for-release-assets/
- Next.js fetch caching: https://nextjs.org/docs/app/api-reference/functions/fetch
- Next.js metadata: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- Next.js production checklist: https://nextjs.org/docs/app/guides/production-checklist
- Next.js ISR: https://nextjs.org/docs/app/guides/incremental-static-regeneration
- Vercel GitHub deployments: https://vercel.com/docs/git/vercel-for-github
- JSON Schema 2020-12: https://json-schema.org/draft/2020-12/json-schema-core

## 7. Cách diễn giải bằng chứng

Các quan sát về website benchmark là những đặc điểm thấy trên trang/trang listing tại ngày khảo sát. Các đề xuất VGD là suy luận thiết kế từ mục tiêu trong brief và các quan sát đó; chúng không khẳng định hiệu quả chuyển đổi của đối thủ nếu không có dữ liệu đo lường công khai.

Ngày khảo sát nguồn web: 14/10/2026. Website tham khảo có thể thay đổi; nội dung sản phẩm, màu sắc và số liệu hiển thị trong benchmark không được chép thành dữ liệu của VGD.


## 7. Trạng thái repository sau audit 15/10/2026

Audit GitHub ngày 15/10/2026: repo vuongpentax/VGD_Plugins truy cập được, default branch main, HEAD e138359685452a5cece58bc093b4b9ec07dfbb18; PR #1 đã merge và remote branch list chỉ còn main. Repo có 10 thư mục plugins: VGD_BIM, VGD_Cabinet, VGD_Cabinet_Draw, VGD_Center, VGD_Dim, VGD_Image_Importer, VGD_Library, VGD_Package, VGD_Reference, VGD_Scenes. Đây là inventory source, chưa phải roster catalog. Snapshot chưa có GitHub Releases, tags, RBZ tracked files, .github/workflows/ hay shared manifest. plugins/VGD_Dim/VGD_UPDATE_MANIFEST.json là file updater riêng. Repo vuongpentax/VGD_Web đã tồn tại, default branch main nhưng Git tree rỗng. Không xem version labels/release-note files là release công khai.
