# 07 — Codex Handoff

## Objective

Build the public VGD product website in a separate VGD_Web repo only after this planning pack and pending release inputs are reviewed. VGD Center remains the in-SketchUp installer/update manager. Do not modify plugin runtime code as part of website bootstrap.

**Current task status:** planning Stage A→G only. No website production code is authorized or included in this handoff package. Treat the build sequence below as a future implementation brief after the owner starts that phase.

## Fixed constraints

- Production plugin repo: https://github.com/vuongpentax/VGD_Plugins
- Legacy repo is backup/reference only.
- Website repo: vuongpentax/VGD_Web.
- Stack: Next.js + TypeScript + Tailwind CSS + Vercel.
- Locale: Vietnamese default, English available.
- All current production catalog products public; provisional display label Free.
- Light UI, xsu.vn content hierarchy as reference; palette waits for official logo.
- Common release metadata source for website and Center.
- No account, payment, checkout or license implementation in Phase 1.
- Website never installs/uninstalls plugins; it routes to VGD Center.
- Locale routing: `/` redirects to `/vi`; English pages use `/en`.
- Audit 15/10/2026: VGD_Plugins default main, PR #1 merged at e138359685452a5cece58bc093b4b9ec07dfbb18, only remote branch main remains.
- Ten source/manager folders exist but are not the approved website roster.
- No GitHub Releases, tags, tracked RBZ, release workflow or shared manifest existed; do not infer releases from source labels.
- VGD_Web exists, default main, empty tree.

## Before implementation starts

1. Use the 15/10/2026 GitHub audit snapshot as baseline; recheck only for changes before live integration.
2. Classify ten source/manager directories into user-facing catalog plugins, VGD Center and tooling. Owner decision: all production catalog plugins are public and temporarily Free.
3. Confirm public roster, compatibility, channels and reviewed VI/EN copy; do not infer from source labels.
4. Receive logo/palette, product media and exact Center download URL/release repository.
5. Approve/create canonical manifest/schema paths and design release history, channel pointers, tags and release workflow.

If an item remains pending, implement the shell in Preview with clearly marked placeholders; do not publish fake versions or dead production CTAs.

## Build sequence

### Milestone 1 — Bootstrap and tokens

- Create clean Next.js App Router project with strict TypeScript and Tailwind.
- Add layout, locale routing, brand placeholder and typography/spacing tokens.
- Add shared header/footer, accessible mobile navigation and language switch.
- Add README and AGENTS.md with project rules.

### Milestone 2 — Content and component system

- Add product card, release badge, compatibility row, changelog entry, media gallery and status states.
- Build locale content types and Markdown/MDX loader.
- Add fixture manifest and runtime validation; fixture data must be visibly marked non-production.

### Milestone 3 — Phase 1 routes

- Homepage, catalog, product detail, Center, Docs, Changelog, Roadmap, About, Contact.
- Ensure all product detail pages are generated from public product registry + editorial copy.
- Implement vi/en copy and metadata.

### Milestone 4 — Live release integration

- Read canonical VGD_Plugins manifest server-side.
- Map channels/compatibility/assets/version/changelog without duplicate constants.
- Revalidate on agreed schedule; add last-known-good behavior.
- Confirm VGD Center and website consume the same URL and schema.

### Milestone 5 — QA and Preview

- Run lint, type, unit tests, route build, schema fixtures and accessibility/responsive smoke checks.
- Verify desktop, tablet and mobile.
- Test bad/missing/stale manifest, no-release and unavailable-media states.
- Deploy a Vercel Preview for review; production publish waits for explicit project owner approval at that stage.

## Required acceptance criteria

- Every production product is represented once in the registry.
- Public routes enter sitemap only when editorial copy is approved; in-development products have no version/download CTA.
- Changelog reads full release history from the shared manifest.
- No version or download checksum is manually duplicated in website content.
- Website and Center resolve identical release metadata for same product/channel.
- Primary action leads to VGD Center, not direct plugin RBZ install.
- No pricing checkout, auth or license API/code exists.
- VI is default and EN is reachable for every launch route.
- Color/brand placeholders are replaced only with provided/approved assets.
- No dead links, fake versions, incompatible release claims, console errors or mobile overflow.
- Preview is reviewable and contains a clear README on how to update content/releases.

## First implementation-session prompt (use only after the owner starts the coding phase)

“Read `VGD_WEB_MASTER_SPEC.md` and all eight numbered planning documents in `VGD_WEB_PLANNING`. Audit the accessible `vuongpentax/VGD_Plugins` production repo without changing it. Report its product roster, default branch, workflows and any manifest; the owner says this new repo has not released yet, so confirm current state rather than creating sample releases. Compare findings against `05_RELEASE_MANIFEST_SPEC.md`. This first task is audit-only: do not write website or plugin production code.”
