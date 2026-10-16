# VGD Web

Website riêng cho hệ công cụ VGD: catalog, product pages, docs, changelog và roadmap. Website giúp người dùng tìm hiểu; VGD Center tiếp tục là extension quản lý cài đặt, cập nhật và gỡ plugin trong SketchUp.

## Local development

Requirements: Node.js 20.9 or newer.

```sh
npm install
npm run dev
```

The default route `/` redirects to Vietnamese at `/vi`. English pages are under `/en`.

## Content editing

- Guides live under `content/docs/vi` and `content/docs/en`. Keep the same relative Markdown path in both locales; nested folders become nested `/docs/...` routes.
- Each guide needs `title` and `description` front matter. Optional `publication_status` accepts `draft` or `published`; it defaults to `draft`.
- Keep the publication status and section IDs aligned between Vietnamese and English. Mark content `published` only after both translations are reviewed.
- Preview routes remain available for review, but draft guides and products are excluded from sitemap entries.

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

## Checks

```sh
npm run lint        # ESLint (Next.js core-web-vitals + TypeScript rules)
npm run typecheck   # tsc --noEmit
npm run test:e2e    # Playwright checks against a production build
npm run check       # all of the above
```

On a new machine, install the test browser once with `npx playwright install chromium`.

`tests/smoke.spec.ts` covers routing, the localized 404, release-safety rules (no invented versions, no download links), navigation, the catalog filters, the mobile menu and responsive overflow. `tests/contrast.spec.ts` measures every visible run of text against the background painted behind it and fails below WCAG AA, which is what catches text made invisible by a colour-token change.
