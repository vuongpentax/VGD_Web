# 03 — Sitemap and User Flows

## 1. Sitemap Phase 1

Product visibility, lifecycle và trạng thái xuất bản là ba khái niệm riêng: `visibility: public|hidden`; `lifecycle: in_development|released|archived`; editorial `publication_status: draft|published`. Sitemap chỉ có product public với nội dung/locale đã publish và review. Trang có thể giới thiệu sản phẩm đang phát triển nhưng không có version/download CTA. “Published route” không đồng nghĩa release đã phát hành.

~~~
/                         Redirect tới /vi
/{locale}                 Homepage (vi | en)
/{locale}/plugins         Catalog
/{locale}/plugins/{slug}  Trang plugin
/{locale}/center          VGD Center: tải, cài, cập nhật, gỡ
/{locale}/docs            Trang docs
/{locale}/docs/{...slug}  Bài hướng dẫn
/{locale}/changelog       Release feed tổng
/{locale}/roadmap         Roadmap tĩnh
/{locale}/about           Về VGD
/{locale}/contact         Liên hệ
~~~

Locale là `vi` và `en`. `/` chuyển hướng tới `/vi`, đây là mặc định tiếng Việt đã chốt; bản tiếng Anh dùng `/en`. Mỗi trang có URL canonical riêng, sitemap bỏ route redirect `/`, và các trang có bản dịch đặt hreflang tương ứng. Không tạo đồng thời hai URL `/` và `/vi` cùng phục vụ homepage.

## 2. Điều hướng chính

- Plugins
- VGD Center
- Docs
- Changelog
- Roadmap
- About
- Language switch: VI / EN
- CTA nổi bật: Tải VGD Center

Mobile dùng menu đóng/mở với cùng thứ tự ưu tiên. CTA tải Center luôn phân biệt với CTA xem chi tiết plugin.

## 3. Homepage flow

1. Hero giải thích một câu VGD giúp ai và giải quyết việc gì.
2. CTA phụ đưa tới catalog; CTA chính đưa tới VGD Center.
3. Người dùng khám phá nhóm công cụ và các plugin tiêu biểu.
4. Khối VGD Center giải thích website tìm hiểu, Center cài/quản lý.
5. Latest releases/changelog hiển thị phiên bản từ manifest; trước release đầu tiên, thay bằng trạng thái “Chưa có bản phát hành công khai”.
6. Roadmap snapshot, link tới roadmap đầy đủ.
7. Docs, about/contact và GitHub ở footer.

Trang chủ không phải danh sách dài mọi tính năng; mỗi card cần đưa người dùng tới product page.

## 4. Plugin discovery flow

1. Vào catalog.
2. Tìm theo tên hoặc lọc theo nhóm workflow, trạng thái phát triển và compatibility khi các trường này đã được xác nhận trong dữ liệu.
3. Mở plugin detail, đọc công dụng, requirements, media, changelog và docs.
4. Chọn “Cài bằng VGD Center”; website giải thích chuyển sang Center.
5. Nếu Center chưa cài, vào `/vi/center` hoặc `/en/center` để tải RBZ Center từ link release chính thức và làm theo hướng dẫn SketchUp.
6. Trong Center, tìm plugin, chọn kênh nếu có và cài. Nếu plugin chưa có release đã publish, website không hiển thị version/download giả và Center không thể cài plugin đó.

Catalog không hứa “one-click install from browser”.

## 5. Center install/update flow

### Cài lần đầu

1. Trang Center mô tả vai trò Center và tính năng.
2. CTA tải phiên bản Center mới nhất từ release chính thức; URL và version chờ user bổ sung/repo audit. Preview không dùng link giả; production launch yêu cầu URL hoạt động.
3. User cài file RBZ qua Extension Manager của SketchUp.
4. User mở Center trong SketchUp; Center đọc manifest chung.
5. User chọn plugin và cài; Center kiểm tra checksum.

### Cập nhật

1. Center kiểm tra manifest.
2. So sánh version local và version trong manifest theo channel.
3. Hiển thị update, version notes và compatibility.
4. Tải RBZ qua URL chính thức, kiểm SHA-256 rồi cập nhật.
5. Website đồng thời hiển thị cùng latest metadata; nếu cache chưa tới chu kỳ revalidation thì có thể chậm tối đa khoảng 5 phút theo cấu hình đề xuất.

### Gỡ

Website giải thích vị trí thao tác trong Center; không phát lệnh gỡ từ web.

## 6. Changelog và roadmap

- Changelog: lọc plugin/channel/thời gian; đọc release history đầy đủ từ manifest canonical, liên kết notes và GitHub Release khi có.
- Product page chỉ hiển thị release phù hợp kênh đang xem, không lấy “latest” mơ hồ khi có cả stable và beta.
- Roadmap: status Proposed, Researching, Planned, In Development, Beta, Released, Rejected như brief; Phase 1 chỉ đọc.
- Roadmap không cam kết ngày release cụ thể nếu VGD chưa xác nhận.

## 7. Future journeys — chỉ ghi nhận để không khóa thiết kế sai

Purchase, account, license, trial, device activation, protected download và customer portal không có màn hình hoặc backend Phase 1. Sau này có thể nối theo luồng: xem giá → đăng nhập → thanh toán → ownership → Center xác thực license, nhưng cần đặc tả riêng.

## 8. Diagram

~~~mermaid
flowchart TD
  H["Homepage / catalog"] --> P["Plugin detail"]
  P --> C["VGD Center page"]
  C --> I["Install Center in SketchUp"]
  I --> M["Find and install plugin"]
~~~

Website dừng ở bước điều hướng và hướng dẫn. Thao tác cài, cập nhật và gỡ chạy trong VGD Center bên trong SketchUp.
