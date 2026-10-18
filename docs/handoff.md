# Handoff: VGD website

Ghi chú bàn giao để tiếp tục làm việc ở phiên mới. Cập nhật lần cuối: 2026-10-19.

## Trạng thái hiện tại

- **Website công khai:** https://vgdtools.vercel.app. Vercel tự build khi có commit mới trên `main`.
- **Repo:** VGD_Web, nhánh `main`. Commit mới nhất ghi ở đầu `git log`.
- **Chưa commit (cố ý):** `.claude/` (cấu hình chạy server trên máy), `next-env.d.ts` (Next tự sinh).
- **Chưa bật công khai:** `publicationReady = false` trong `lib/site.ts`. Trang còn `noindex`, robots chặn, sitemap rỗng, có banner "Bản xem trước". Không bật nếu chủ dự án chưa duyệt.

## Kiến trúc

- **Next.js 16 App Router**, TypeScript. CSS viết tay trong `app/globals.css`.
- **Ngôn ngữ:** `vi` là mặc định. `en` còn tồn tại nhưng nút VI/EN đang ẩn (`showLanguageSwitch = false` trong `components/site-header.tsx`).
- **Trang chủ:** `app/[locale]/page.tsx` dùng `components/home-showcase.tsx`. Có thanh chọn plugin (4 mục mỗi lần, có mũi tên). Chọn một mục sẽ đổi URL thành `#cen`, `#bim`, `#cab`, `#cdr`, `#dim`, `#imp`, `#lib`, `#pkg`, `#ref`, `#scn`. Panel bên dưới hiện logo, tên, mô tả, phiên bản từ manifest và nút cài bằng VGD Center. Chân trang chỉ ẩn ở trang chủ (`components/hide-on-home.tsx`).
- **Danh sách sản phẩm:** `lib/catalog.ts`. Có 9 plugin, cộng VGD Center (`href: "/center"`). Mỗi mục có `manifestId`, `shortName` (tên 3 chữ) và `icon`.
- **Manifest thật:** đọc phía server từ `shared/vgd-center/catalog.json` và `center-update.json` trên `main` của VGD_Plugins.
  - `lib/release-manifest.ts`: kiểm tra dữ liệu.
  - `lib/release-manifest-source.ts`: tải lại mỗi 300 giây, giữ bản hợp lệ gần nhất khi lỗi.
  - `lib/catalog-releases.ts`: gắn phiên bản và mô tả vào từng sản phẩm.
  - Không tự bịa phiên bản.
- **Icon:** `public/brand/vgd-logo.svg` (logo VGD Center), `public/products/*.svg` (7 plugin). BIM Lite và Package chưa có icon riêng nên hiện tên viết tắt. `app/icon.svg` là favicon.
- **Kiểm thử:** vitest, 27 test trong `tests/`, dùng snapshot thật của catalog và center-update. Chạy bằng `npm test`. Build bằng `npm run build`.
- **Tài liệu thiết kế:** `docs/design-system-vgd.md`, có bảng trạng thái cho thanh plugin. `.agents/skills/design-system/SKILL.md` là bản XSU, không sửa.

## Quyết định đã chốt

- Logo chính là icon VGD Center. Bảng màu chính thức **chưa có**, màu hiện tại là tạm.
- Danh sách sản phẩm là mọi thư mục plugin, trừ VGD Center. Center là manager, vẫn có trang riêng và được đưa vào thanh chọn như một mục.
- GitHub `VGD_Plugins` là kênh cập nhật chính. Web và Center cùng đọc một catalog.
- Sản phẩm chưa có release (Cabinet Draw, Package) có `lifecycle: "in_development"` trong catalog. Center bỏ qua các mục này. Thay đổi này nằm ở commit `f62524c` trong VGD_Plugins, **chưa push**. Chỉ push sau khi Center 1.0.12 đã phát hành, vì Center 1.0.11 đang cài sẽ hiện cảnh báo.
- Không tài khoản, không thanh toán, không cài plugin từ web (theo AGENTS.md). Nút thanh toán và tải bộ cài của mẫu XSU đã bỏ.
- Chỉ làm tiếng Việt trước. Tiếng Anh để sau.

## Việc đang dở

1. **Lịch sử phát hành cho trang Cập nhật (chưa làm).** Người dùng đã đồng ý mở rộng catalog. Đã lấy danh sách 10 release từ GitHub, nhưng chưa sửa gì.
   - Kế hoạch: thêm trường `releases` (chỉ bổ sung, không đổi trường cũ) vào `shared/vgd-center/catalog.json`.
   - Làm trên git worktree riêng từ `origin/main`. Không dùng checkout `D:\Code\VGD_Plugins` vì đang ở nhánh `dim/autostyle-ux` có thay đổi của người khác.
   - Sau đó cập nhật parser và trang changelog.
   - Kiểm tra Center vẫn đọc được catalog, bằng harness `validate_catalog_check.rb` trong thư mục scratchpad, dùng Ruby 2.7 tại `C:\Ruby27-x64`.
2. **Nội dung tiếng Anh, mô tả, ảnh demo, bảng màu, kênh liên hệ, chính sách riêng tư:** chờ người dùng cung cấp.
3. **Cabinet Draw và Package:** người dùng đang làm, chưa xong.
4. **ESLint:** chưa cài. Người dùng đã hỏi ESLint là gì nhưng chưa đồng ý cài.
5. **Cỡ chữ chân trang:** một số chữ 8–9px. Chưa quyết định có tăng lên 11px không.
6. **Trang VGD Center:** commit `c245244` (không phải do phiên này tạo) thêm nút tải đã xác minh. Cần kiểm tra giao diện trang này.

## Đã kiểm tra trên bản production

- 48 trang trả về 200, không có liên kết nội bộ hỏng.
- `noindex`, robots chặn, sitemap rỗng, có banner preview, `/` chuyển sang `/vi`.
- Không tràn ngang ở 320px, 375px, 768px và khung máy tính. Console không có lỗi.
- Bàn phím: Tab đúng thứ tự, Enter chọn được plugin, viền focus cam 3px.
- Tương phản: trang chủ đạt. Trang Tiện ích đã sửa chân trang và icon tìm kiếm, đã đẩy lên.

## Quy tắc làm việc

- Người dùng không đọc code. Giải thích bằng tiếng Việt ngắn gọn, đơn giản.
- Không push nếu chưa có đồng ý rõ ràng. Mỗi lần push đều hỏi lại.
- Không bật `publicationReady` nếu chưa được duyệt.
- Không sửa checkout VGD_Plugins đang dùng cho nhánh khác. Dùng worktree riêng.
- Quy trình đổi giao diện: làm trên local, kiểm tra, báo người dùng, đợi đồng ý rồi mới push.
- Commit trailer: `Co-Authored-By: Claude <model> <noreply@anthropic.com>`.
- Không dùng `--force`.

## Lưu ý kỹ thuật

- Git trên máy: repo thuộc tài khoản Windows khác, nên dùng `git -c safe.directory=D:/Code/VGD_Web` hoặc `D:/Code/VGD_Plugins`.
- PowerShell chặn script `npm.ps1` trên máy người dùng. Người dùng đã chọn không tự chạy lệnh nữa.
- Vercel: MCP không đọc được log build và không tạo được link xem tạm (lỗi 403 phạm vi team). Dùng `gh` và `curl` để kiểm tra.
- Link xem trên máy: `localhost:3000` chỉ mở được khi máy chủ đang chạy (`preview_start` với tên `vgd-web`).
