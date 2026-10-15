# VGD Web

Website riêng cho hệ công cụ VGD: catalog, product pages, docs, changelog và roadmap. Website giúp người dùng tìm hiểu; VGD Center tiếp tục là extension quản lý cài đặt, cập nhật và gỡ plugin trong SketchUp.

## Local development

Requirements: Node.js 20.9 or newer.

```sh
npm install
npm run dev
```

The default route `/` redirects to Vietnamese at `/vi`. English pages are under `/en`.

## Preview data and release safety

- `lib/catalog.ts` contains six planning-seed entries for layout preview only. They are not the final production roster or canonical registry.
- Do not add a version, compatibility claim, release channel, asset URL, or download link unless it is present in verified release metadata.
- A product without a verified release must display **“Chưa có bản phát hành”** in Vietnamese.
- The canonical JSON manifest and schema belong in `VGD_Plugins`; this repository must consume that shared source when it is established, not define a competing source of truth.
- Product copy, translations, release records, Center package URL, manifest URL, brand assets, and final production roster still need owner review.
- The preview is noindex by default. Publication remains hard-disabled in code until the shared manifest and reviewed public catalog are connected. `NEXT_PUBLIC_SITE_URL` must be the approved public origin before sitemap metadata is enabled.
- No account, payment, license, or direct browser installation flow is part of Phase 1.

## Environment

Copy `.env.example` to `.env.local` for local configuration. Leave publication settings disabled while the site contains preview-only content.

## Build

```sh
npm run build
```
