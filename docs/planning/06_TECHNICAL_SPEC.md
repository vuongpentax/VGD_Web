# 06 — Technical Specification

## 1. Recommended architecture

- Next.js App Router
- TypeScript strict mode
- Tailwind CSS for tokens/layout utilities
- MDX or typed Markdown content in VGD_Web
- Public release manifest in VGD_Plugins
- Vercel Preview and Production deployments
- No database, authentication, billing or license service in Phase 1

Ưu tiên framework capabilities đang được Next.js/Vercel hỗ trợ tại thời điểm Codex bootstrap; không khóa version package trong tài liệu kế hoạch này.

## 2. Suggested repository structure

~~~
VGD_Web/
  app/
    [locale]/
      page.tsx
      plugins/page.tsx
      plugins/[slug]/page.tsx
      center/page.tsx
      docs/page.tsx
      docs/[...slug]/page.tsx
      changelog/page.tsx
      roadmap/page.tsx
      about/page.tsx
      contact/page.tsx
    sitemap.ts
    robots.ts
  components/
    site-header.tsx
    site-footer.tsx
    product-card.tsx
    release-badge.tsx
    compatibility-row.tsx
    changelog-entry.tsx
    language-switcher.tsx
    media-gallery.tsx
  content/
    plugins/
    docs/vi/
    docs/en/
    roadmap/
  lib/
    content/
    i18n/
    releases/
    seo/
  public/
    brand/
    plugins/
  tests/
  README.md
  AGENTS.md
~~~

Route behavior is fixed in 03_SITEMAP_AND_FLOWS.md. JSON Schema authority lives in VGD_Plugins beside the manifest; do not create an independently edited copy under VGD_Web/schemas. Generate or synchronize consumer types from that schema.

## 3. Rendering and content

- Static render routes and content pages where possible.
- Generate plugin detail paths from the public product registry; no manually maintained duplicate product list.
- Route `/` to `/vi`; use the shared `/{locale}` layout for `vi` and `en`, matching `03_SITEMAP_AND_FLOWS.md`.
- Public products may have no release yet. Render their approved editorial page and lifecycle state from the registry; do not synthesize a version or download URL.
- Markdown/MDX stores editorial content. Release values always come from manifest.
- Use generateMetadata for localized page title, description, canonical/hreflang and OG.
- Server component loads validated manifest once per request/cache window; share one typed accessor across cards, pages and sitemap.
- Search/filter can be client-side for the small Phase 1 catalog; no search backend.
- No database or admin dashboard.

## 4. Manifest fetching and cache

Recommended initial behavior:

1. Fetch public JSON from the canonical manifest URL on the server.
2. Use Next fetch revalidation at 300 seconds with a stable cache tag.
3. Validate shape and constraints at the boundary.
4. Use last-known-good manifest/cache if fetch fails where platform permits; never synthesize current versions.
5. Record timestamp of last successful refresh.
6. Add a manual refresh/revalidation endpoint only if implementation needs immediate release visibility. Protect it with a secret stored only in Vercel and GitHub Actions; it is a cache control secret, not an account/license system. If not needed, omit for simplicity.

Manifest path and URL stay configurable until repo review. Prefer public raw JSON hosted from a stable production branch/path; do not use a GitHub API token in the client.

## 5. GitHub and Vercel integration

### GitHub

- VGD_Web links to the VGD_Plugins repo and release pages.
- Plugin installation CTA always leads to VGD Center; do not surface raw plugin RBZ URLs as a second installation path on the website.
- Release workflow (to be created) tests/builds RBZ, creates release, records size/hash, validates and updates full release history/current-channel pointers.
- Avoid website polling every page view or enumerating releases from browser.
- Keep release asset links HTTPS and pinned to exact version; avoid mutable latest/download URLs for checksum verification.

Repo snapshot 15/10/2026: VGD_Plugins default main, PR #1 merged, remote branch list only main at e138359685452a5cece58bc093b4b9ec07dfbb18. No GitHub Releases/tags/tracked RBZ/workflows/shared manifest. VGD_Dim has an updater-specific manifest. VGD_Web exists with default main and empty tree.

### Vercel

- Connect VGD_Web repo to Vercel after first reviewable local build.
- Pull request/feature branch → Preview deployment.
- Production branch → production deployment.
- No domain required for previews; custom domain waits until domain is chosen.
- Set only non-sensitive public configuration as public env; any cache hook secret remains server-side.
- Add production monitoring/analytics only after privacy and user-facing requirements are decided.

## 6. SEO and performance

- Localized title and description per route.
- Canonical URL and reciprocal hreflang for vi/en.
- Require reviewed VI and EN copy for each public launch route; a development-only fallback must not be treated as production translation.
- Sitemap includes public products only when locale editorial content has publication_status=published and is reviewed; in_development alone does not exclude an approved public page.
- Robots rules exclude preview and draft content as appropriate.
- Open Graph/Twitter social images; VGD identity assets replace placeholders later.
- Use optimized responsive images, meaningful dimensions, lazy load below fold.
- Avoid autoplaying video, heavy carousel dependence and unneeded client JavaScript.
- Preserve server-rendered HTML for discoverability.
- Check Lighthouse/performance budgets after production build; set numeric budgets at implementation once real assets are known.

## 7. Security and privacy

- No GitHub token, webhook secret, contact credentials or private asset URL in browser code.
- Manifest is read-only and public; validate URLs before rendering.
- Render release markdown safely; sanitize any HTML if using a markdown renderer.
- External links use safe rel behavior.
- Contact form may be static mailto/link at launch to avoid collecting data. If a form is added, define retention, spam protection and privacy copy first.
- No tracking pixels/analytics without decision and notice.
- No login/payment/license routes or placeholder endpoints.

## 8. Testing and CI gates

### Pull request checks

- Install/build deterministic lockfile.
- Lint and type-check.
- Unit tests for manifest parser, channel selection, compatibility display and content lookup.
- Fixture tests: valid manifest, absent release, malformed URL/checksum, unknown schema, missing locale.
- Build all routes in both locales.
- Link check for internal routes and required external URLs.
- Responsive/accessibility smoke test for navigation, cards and key CTAs.
- Preview QA before merge.

### Release checks in VGD_Plugins

- Plugin-specific test suite and package validator.
- RBZ structure allowlist/contents check.
- Verify package/version/tag/filename consistency.
- SHA-256 and release asset size checks.
- Manifest schema + cross-field validation.
- Confirm same manifest is reachable from website and Center.

## 9. Failure modes

| Failure | Required response |
|---|---|
| Manifest timeout/5xx | Serve cached valid data; show freshness note if stale |
| Invalid schema | Refuse new data, preserve last good data, log and alert |
| Release has no RBZ | Workflow must not publish installable manifest entry |
| Digest mismatch | Center stops installation; web displays release page but not “verified” status |
| Vercel build outage | Existing production deployment remains available |
| Missing localized content | Fallback to Vietnamese during preview; block launch QA until reviewed |
| Public product has no release yet | Show development state and product information; omit version/download controls |
| Missing Center URL | Preview explains TODO; production launch fails acceptance |
| Product retired | Mark hidden/archived intentionally; do not silently delete release history |

## 10. Open implementation decisions

- Confirm VGD_Web production branch (currently main) and branch protection/PR requirements.
- Approve proposed canonical manifest/schema paths and decide how Actions writes the manifest.
- Confirm whether VGD Center should follow stable by default and how users opt into beta/alpha.
- Confirm public catalog roster from ten source/manager folders and SketchUp compatibility/channel per product.
- Confirm repository ownership/location for Center and product release assets.
- Confirm whether contact uses external links or a form.
- Receive logo, palette, product media and Center download URL.
