# Handoff: VGD website

Ghi chú bàn giao để tiếp tục làm việc ở phiên mới. Cập nhật lần cuối: 2026-10-25 (thêm thanh toán VNPay).

## Trạng thái hiện tại

- **Website công khai:** https://vgdtools.vercel.app. Vercel tự build khi có commit mới trên `main`.
- **Repo:** VGD_Web, nhánh `main`. Commit mới nhất ghi ở đầu `git log`.
- **Chưa commit (cố ý):** `.claude/` (cấu hình chạy server trên máy), `next-env.d.ts` (Next tự sinh).
- **Chưa bật công khai:** `publicationReady = false` trong `lib/site.ts`. Trang còn `noindex`, robots chặn, sitemap rỗng, có banner "Bản xem trước". Không bật nếu chủ dự án chưa duyệt.

## Kiến trúc

- **Next.js 16 App Router**, TypeScript. CSS viết tay trong `app/globals.css`.
- **Ngôn ngữ:** `vi` là mặc định. `en` còn tồn tại nhưng nút VI/EN đang ẩn (`showLanguageSwitch = false` trong `components/site-header.tsx`).
- **Trang chủ:** `app/[locale]/page.tsx` dùng `components/home-showcase.tsx`. Có thanh chọn plugin (4 mục mỗi lần, có mũi tên). Chọn một mục sẽ đổi URL thành `#cen`, `#bim`, `#cab`, `#cdr`, `#dim`, `#imp`, `#lib`, `#pkg`, `#ref`, `#scn`. Panel bên dưới hiện logo, tên, mô tả, phiên bản từ manifest và nút cài bằng VGD Center. Chân trang đã bỏ khỏi tất cả các trang (theo yêu cầu người dùng). Component cũ `site-footer.tsx` và `hide-on-home.tsx` đã xóa, còn CSS `.site-footer` trong `app/globals.css` và `app/design-system.css`.
- **Danh sách sản phẩm:** `lib/catalog.ts`. Có 9 plugin, cộng VGD Center (`href: "/center"`). Mỗi mục có `manifestId`, `shortName` (tên 3 chữ) và `icon`.
- **Manifest thật:** đọc phía server từ `shared/vgd-center/catalog.json` và `center-update.json` trên `main` của VGD_Plugins.
  - `lib/release-manifest.ts`: kiểm tra dữ liệu.
  - `lib/release-manifest-source.ts`: tải lại mỗi 300 giây, giữ bản hợp lệ gần nhất khi lỗi.
  - `lib/catalog-releases.ts`: gắn phiên bản và mô tả vào từng sản phẩm.
  - Không tự bịa phiên bản.
- **Icon:** `public/brand/vgd-logo.svg` (logo VGD Center), `public/products/*.svg` (7 plugin). BIM Lite và Package chưa có icon riêng nên hiện tên viết tắt. `app/icon.svg` là favicon.
- **Thanh toán VNPay (mới, chưa test trên sandbox):**
  - `lib/vnpay.ts`: đọc cấu hình, tạo URL thanh toán, kiểm tra chữ ký HMAC-SHA512.
  - `lib/payment.ts`: tạo đơn `pending`, xử lý IPN (kiểm tra chữ ký, số tiền, trạng thái đơn).
  - `lib/orders.ts`: giao diện kho đơn. Chưa có cơ sở dữ liệu nào được nối; `getOrderStore()` trả `null`.
  - `lib/pricing.ts`: giá theo slug, đang **trống**. Sản phẩm không có giá sẽ không mở thanh toán.
  - Route: `app/api/vnpay/create` (POST, chuyển sang VNPay), `app/api/vnpay/return/[locale]` (VNPay chuyển khách về, chỉ hiện kết quả), `app/api/vnpay/ipn` (VNPay gọi server-to-server, nơi duy nhất được đổi trạng thái đơn).
  - Trang: `/{locale}/checkout/{slug}` (form email, hiện "Chưa mở bán" khi đóng) và `/{locale}/payment/result`.
  - Biến môi trường (xem `.env.example`): `VNPAY_TMN_CODE`, `VNPAY_HASH_SECRET`, `VNPAY_PAY_URL`. Không có `VNPAY_PAY_URL` thì dùng sandbox. Không đưa secret vào repo.
  - Thanh toán **đóng** khi thiếu một trong các điều kiện: cấu hình VNPay, giá sản phẩm, kho đơn.
- **Kiểm thử:** vitest, 66 test trong 6 file (`tests/vnpay*.test.ts`, `tests/payment.test.ts` và các test cũ), dùng snapshot thật của catalog và center-update. Chạy bằng `npm test`. Build bằng `npm run build`.
- **Tài liệu thiết kế:** `docs/design-system-vgd.md`, có bảng trạng thái cho thanh plugin. `.agents/skills/design-system/SKILL.md` là bản XSU, không sửa.

## Quyết định đã chốt

- Logo chính là icon VGD Center. Bảng màu chính thức **chưa có**, màu hiện tại là tạm.
- Danh sách sản phẩm là mọi thư mục plugin, trừ VGD Center. Center là manager, vẫn có trang riêng và được đưa vào thanh chọn như một mục.
- GitHub `VGD_Plugins` là kênh cập nhật chính. Web và Center cùng đọc một catalog.
- Sản phẩm chưa có release (Cabinet Draw, Package) có `lifecycle: "in_development"` trong catalog. Center bỏ qua các mục này. Thay đổi này nằm ở commit `f62524c` trong VGD_Plugins, đã có trên `origin/main`. Center vẫn bỏ qua mục `in_development`.
- **Thanh toán VNPay được chủ dự án duyệt** (2026-10-25): bán key plugin qua website, thanh toán qua VNPay. Đây là thay đổi so với Phase 1 trước đó. `AGENTS.md` và `README.md` đã cập nhật theo.
- **Vẫn không làm trên web:** tài khoản người dùng, cài plugin từ web. Plugin vẫn cài qua VGD Center. Nút tải bộ cài của mẫu XSU đã bỏ.
- Key plugin: web chỉ bán và cấp key. Quản lý key ở trang quản trị trong VGD_Web (chưa làm). Kiểm tra key khi mở plugin (chưa làm).
- Chỉ làm tiếng Việt trước. Tiếng Anh để sau.

## Việc đang dở

0. **Thanh toán VNPay (code xong ở local, chưa commit, chưa test trên sandbox):**
   - Đã kiểm: 66 test đạt, `tsc` đạt, `npm run build` đạt (các route `/api/vnpay/*` là dynamic).
   - Chưa kiểm: chạy server thật rồi gọi route (bị từ chối quyền khi thử), và toàn bộ luồng thanh toán với sandbox VNPay. Phần mã phản hồi IPN và thuật toán chữ ký cần đối chiếu với tài liệu VNPay và sandbox.
   - Còn thiếu trước khi mở bán: (a) chọn cơ sở dữ liệu cho đơn và key; (b) giá từng sản phẩm trong `lib/pricing.ts`; (c) thông tin tài khoản VNPay đã được duyệt (TMN code, hash secret, URL production); (d) chính sách riêng tư, vì thu email của khách; (e) gửi key cho khách (email hay hiện trên trang kết quả); (f) trang quản trị và kiểm tra key khi mở plugin.
   - IPN cần URL công khai (HTTPS). Thử trên preview deployment, không thử trên `localhost`.
   - Không commit cho đến khi chủ dự án đồng ý.
1. **Lịch sử phát hành cho trang Cập nhật (làm xong local, chưa push).**
   - VGD_Plugins: worktree `D:\Code\VGD_Plugins_releases`, nhánh `feat/catalog-release-history`, commit `bb12d6f`, đã merge vào `origin/main` (fast-forward). Nhánh `feat/catalog-release-history` vẫn còn trên origin. Thêm trường `releases` (chỉ bổ sung) vào `shared/vgd-center/catalog.json` và `center-update.json`.
   - Center vẫn đọc được cả hai file (kiểm bằng Ruby 2.7 tại `C:\Ruby27-x64`, gọi `validate_catalog` và `validate_center_release`).
   - VGD_Web (chưa commit): `lib/release-manifest.ts` đọc `releases`, `lib/changelog.ts` mới, trang `app/[locale]/changelog/page.tsx` và `components/changelog-entry.tsx` hiển thị lịch sử. Test 37/37 đạt, `tsc` và `npm run build` đạt.
   - Trang Cập nhật đã hiện đủ 10 release khi chạy local, vì `main` đã có `releases`. Phần VGD_Web còn lại chưa commit, chờ người dùng duyệt.
   - Commit `f62524c` (`lifecycle: "in_development"`) đã có trên `origin/main`. Ghi chú cũ nói là chưa push là sai.
2. **Nội dung tiếng Anh, mô tả, ảnh demo, bảng màu, kênh liên hệ, chính sách riêng tư:** chờ người dùng cung cấp.
3. **Cabinet Draw và Package:** người dùng đang làm, chưa xong.
4. **ESLint:** chưa cài. Người dùng đã hỏi ESLint là gì nhưng chưa đồng ý cài.
5. **Cỡ chữ chân trang:** đã bỏ chân trang khỏi mọi trang nên mục này không còn cần làm.
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
