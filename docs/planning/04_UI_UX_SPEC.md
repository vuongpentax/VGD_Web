# 04 — UI/UX Specification

## 1. Nguyên tắc thiết kế

- Dùng xsu.vn làm tham khảo cấu trúc nội dung và cách trình bày bộ sản phẩm, không clone giao diện.
- Từ tham khảo XSU, ưu tiên product card/detail có công dụng, minh họa thao tác, hướng dẫn, release/version, compatibility và liên kết thay đổi; VGD chuyển tác vụ cài đặt về Center.
- Website mang cảm giác công cụ chuyên nghiệp cho thiết kế/kiến trúc/nội thất: rõ, gọn, có bằng chứng trực quan.
- Ưu tiên giải thích “plugin giúp làm gì” trước thông số kỹ thuật.
- Hướng dẫn tải/cài không tranh vai trò với VGD Center.
- Tách lifecycle sản phẩm, release channel Alpha/Beta/Stable và nhãn “Free” tạm thời.
- Giao diện sáng ở Phase 1. Chưa khóa màu chủ đạo hoặc font display cho tới khi nhận logo/brand palette.
- Thiết kế mobile ngay từ đầu; không chỉ co nhỏ layout desktop.

## 2. Visual foundation tạm thời

| Token | Quy tắc Phase 1 |
|---|---|
| Brand primary | TODO: lấy từ logo sau này |
| Accent | TODO: xác nhận cùng palette |
| Neutral | Dùng nền trắng/ghi sáng, chữ than đậm, border trung tính |
| Status colors | Stable xanh; Beta hổ phách; Alpha tím/đỏ tiết chế; phân biệt bằng text/icon chứ không chỉ màu |
| Font | Tạm dùng font sans-serif hỗ trợ tiếng Việt tốt, ưu tiên readability; chốt sau khi nhận brand asset |
| Radius/shadow | Nhẹ, nhất quán; tránh card nổi quá nhiều gây cảm giác marketplace rối |
| Dark mode | Không triển khai trong Phase 1 |

Không xuất logo giả. Dùng wordmark chữ VGD tạm trong Preview nếu chưa có asset; ghi rõ thay bằng logo chính thức.

## 3. Layout và breakpoint

- Max content width khoảng 1200–1280 px, căn giữa.
- Desktop: grid 12 cột; catalog 3 cột khi card còn đủ chỗ đọc.
- Tablet: 2 cột.
- Mobile: 1 cột, CTA và filters dễ chạm, không ép bảng rộng.
- Giữ nhịp spacing theo thang 4/8 px; trang docs dùng cột đọc khoảng 680–760 px và navigation phụ.
- Header vừa sticky vừa gọn; không che content khi scroll.

## 4. Component system

### Header

Logo VGD, nav chính, language switcher, CTA Tải VGD Center. Mobile có menu drawer/accordion, focus trap khi mở và Escape để đóng.

### Product card

- Product icon/thumbnail.
- Tên và một câu outcome.
- Category.
- Hiển thị lifecycle, release channel và nhãn Free Phase 1 riêng.
- Version và SketchUp compatibility nếu manifest có.
- Link “Tìm hiểu”.
- Không có nút mua/license.

### Release badges

- Stable: bản phát hành chính.
- Beta: preview dùng thử có nhãn rõ.
- Alpha: thử nghiệm sớm; cảnh báo rủi ro nếu phù hợp.
- Free Phase 1: badge thương mại độc lập, không phụ thuộc channel.

### Buttons

- Primary: Tải VGD Center hoặc Cài bằng VGD Center.
- Secondary: Xem plugin, Xem docs.
- Tertiary: Changelog/GitHub/learn more.
- CTA thiếu URL trong Preview phải disabled hoặc có chú thích “chờ link tải”; không dùng link # giả.

### Media

- Ảnh giao diện thật, crop giữ UI quan trọng, caption mô tả tác vụ.
- Video có poster và nút play; không autoplay có âm thanh.
- Lazy-load media dưới fold.
- Alt text mô tả sản phẩm/hành động; không dùng filename làm alt.
- Dùng gallery/lightbox có keyboard controls khi cần.

## 5. Homepage layout

1. Hero: headline ngắn, supporting copy, CTA catalog + Center.
2. Product family: nhóm các plugin theo workflow, không dùng icon-only cards.
3. Featured plugins: 3–6 sản phẩm nổi bật; đủ link tới catalog toàn bộ.
4. VGD Center: hình minh họa UI thật khi có, tóm tắt install/update/uninstall.
5. Latest releases: dữ liệu manifest, version/channel/date. Trước release đầu tiên, dùng empty state có nội dung thay vì fixture giả.
6. Workflow proof: 2–3 minh họa before/after hoặc luồng dùng plugin khi media sẵn sàng.
7. Recent changelog.
8. Roadmap snapshot.
9. Footer: docs, contact, GitHub, language, legal/basic privacy page nếu có tracking/contact form.

Nếu chưa có ảnh, dùng khung minh họa neutral trong Preview và list asset cần thay; không tạo screenshot UI giả như thể là plugin đang chạy.

## 6. Product detail page

Phần đầu trang luôn cho người dùng câu trả lời nhanh:

- Plugin là gì và dành cho ai?
- Phiên bản/kênh mới nhất?
- Hỗ trợ SketchUp nào?
- Cài bằng cách nào?

Sau hero:

1. Key benefits.
2. Feature groups theo workflow.
3. Screenshots/video.
4. Typical workflow/how it works.
5. Compatibility and requirements.
6. Changelog.
7. Docs/tutorials.
8. FAQ và support.

Desktop có table of contents hoặc sticky sidebar; mobile dùng anchor list ngắn. Nếu plugin chưa có published release, trang có thể hiện “đang phát triển” và không có nút tải.

## 7. Center page

- Vai trò của Center, cách nó liên hệ với website.
- Chức năng: catalog, cài, cập nhật, gỡ, kiểm tra version.
- Hướng dẫn cài RBZ lần đầu trong SketchUp.
- Stable/Beta/Alpha giải thích bằng ngôn ngữ dễ hiểu.
- Link download mới nhất, version/channel, size và release notes từ manifest.
- Troubleshooting/FAQ.
- CTA chính Tải VGD Center; URL chờ user bổ sung.

## 8. Changelog/docs/roadmap

- Changelog dùng cards/timeline gọn; mỗi entry có product, version, channel, ngày, Added/Changed/Fixed/Known issues.
- Docs dùng sidebar nhóm, breadcrumb, heading anchor, previous/next, language switch; search chỉ thêm nếu số bài lớn.
- Roadmap dùng group theo status, nhãn trung tính và ngày chỉ khi đã cam kết; trên mobile cards xếp dọc.

## 9. State matrix

| State | Hành vi |
|---|---|
| Manifest OK | Hiển thị latest version và compatibility; áp dụng dữ liệu mới nhất từ cache |
| Manifest tạm lỗi | Dùng cache cuối cùng nếu có, hiển thị marker cập nhật dữ liệu gần nhất; không ẩn toàn bộ catalog |
| Sản phẩm public, chưa có release | Có thể hiện trang đã duyệt; ghi “Đang phát triển”; ẩn version/download |
| Nội dung còn draft | Không đưa vào sitemap/index; chỉ preview có kiểm soát |
| Asset thiếu | Hiện link GitHub Release hoặc báo “chưa có gói tải”; không sinh URL |
| Compatibility thiếu | Hiện “đang xác nhận”; không suy ra từ plugin khác |
| Docs trống | Ẩn CTA docs hoặc liên kết tới Center guide; không mở trang rỗng |
| Video không tải | Poster + link mở video ở tab mới |
| Language copy thiếu | Preview có thể fallback sang tiếng Việt kèm cảnh báo TODO; production launch bị chặn đến khi cả VI/EN được viết và review cho toàn bộ trang public |
| Search/filter zero results | Giải thích không có kết quả và nút xóa filters |

## 10. Accessibility, responsive và content

- Semantic headings, landmarks, visible focus, keyboard navigation.
- Contrast đạt WCAG AA cho text; badge dùng cả text/icon.
- Touch target khoảng 44×44 px trở lên.
- Tôn trọng reduced motion; không phụ thuộc animation.
- Bilingual copy không để nội dung Anh bị cắt trong nút/card.
- Các thuật ngữ Center, plugin, version, release channel dùng nhất quán.
- SEO title/description, Open Graph, canonical, sitemap, robots và hreflang cho mọi trang có bản dịch.

## 11. Asset checklist

- Logo ngang, logo icon, favicon, social preview.
- Product icon cho mọi plugin public.
- Tối thiểu 3 ảnh UI/workflow cho sản phẩm chính; product pages có thể thêm dần.
- Screenshot VGD Center, video demo, ảnh hero/cover.
- Bản dịch Anh đã review.
- URL tải Center và contact channels.

## 12. UI acceptance

- Người mới hiểu trong vài giây VGD là gì và Center dùng để làm gì.
- Product cards phân biệt được lifecycle, Alpha/Beta/Stable và nhãn Free.
- Từ homepage tới install guide trong tối đa ba bước.
- Mỗi version trên mọi trang lấy chung dữ liệu.
- Không có broken media, dead CTA, horizontal scroll trên mobile hoặc text-only badges.
