# Repository guidance

- This repository is `VGD_Web`. Keep all implementation changes here; `VGD_Plugins` is a separate production source repository.
- The website is for discovery and information. VGD Center remains the only in-SketchUp install, update, and uninstall manager.
- Do not implement account, payment, licensing, or browser-side plugin installation in Phase 1.
- Never invent product versions, compatibility claims, channels, release dates, RBZ URLs, checksums, or download links. If a product lacks a verified release, show “Chưa có bản phát hành” in Vietnamese (and an accurate English equivalent).
- Treat `lib/catalog.ts` entries as preview-only planning seed, not as the final production catalog. Keep the preview warning and noindex behavior until reviewed data is connected.
- The canonical release manifest and JSON Schema are owned by `VGD_Plugins`. Do not create a competing manifest/schema in this repository.
- Keep Vietnamese as the default locale and maintain equivalent reviewed English routes under `/en`.
- Do not set publication readiness until public copy, the production roster, the shared manifest, release status, and required assets have been verified.
