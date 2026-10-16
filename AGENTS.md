# Repository guidance

- This repository is `VGD_Web`. Keep all implementation changes here; `VGD_Plugins` is a separate production source repository.
- The website is for discovery and information. VGD Center remains the only in-SketchUp install, update, and uninstall manager.
- Do not implement account, payment, licensing, or browser-side plugin installation in Phase 1.
- Never invent product versions, compatibility claims, channels, release dates, RBZ URLs, checksums, or download links. If a product lacks a verified release, show “Chưa có bản phát hành” in Vietnamese (and an accurate English equivalent).
- Treat `lib/catalog.ts` entries as preview-only planning seed, not as the final production catalog. Keep the preview warning and noindex behavior until reviewed data is connected.
- The canonical release manifest and JSON Schema are owned by `VGD_Plugins`. Do not create a competing manifest/schema in this repository.
- Keep Vietnamese as the default locale and maintain equivalent reviewed English routes under `/en`.
- Do not set publication readiness until public copy, the production roster, the shared manifest, release status, and required assets have been verified.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
