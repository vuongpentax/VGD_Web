# VGD interface design system — XSU skill implementation

## Context and goals

This document applies the exact style foundations in `.agents/skills/design-system/SKILL.md` to VGD's Phase 1 website. It covers the public discovery interface; it does not introduce the authenticated dashboard, account, payment, or license flows described in the source skill's XSU context. VGD remains the product identity, and VGD Center remains the SketchUp installation manager. The nine planning files in `docs/planning/` continue to govern content and release behavior.

## Design tokens and foundations

The values below are copied as tokens from the supplied skill. Components must reference tokens rather than embedding palette values.

| Family | Token | Value |
| --- | --- | --- |
| Font | `font.family.primary` | Manrope |
| Font | `font.family.stack` | Manrope, sans-serif |
| Font | `font.size.base` | 22px |
| Font | `font.weight.base` | 400 |
| Font | `font.lineHeight.base` | 30.8px |
| Type | `font.size.xs / sm / md / lg / xl` | 13 / 15 / 22 / 34 / 36px |
| Type | `font.size.2xs / title.sm / title.md` | 11 / 26 / 32px (observed on xsu.vn, not in source skill) |
| Surface | `color.surface.base` | #000000 |
| Text | `color.text.secondary / tertiary` | #111111 / #666666 |
| Border | `color.border.muted` | #cccccc |
| Surface | `color.surface.muted / raised / strong` | #ffffff / #1d1d1d / #aaaaaa |
| Space | `space.1 / 2 / 3 / 4 / 5 / 6` | 6 / 8 / 10 / 15 / 16 / 20px |
| Space | `space.7 / 8` | 44.25 / 45px |
| Radius | `radius.xs / sm / md` | 8 / 24 / 360px |
| Radius | `radius.2xs / 12 / 16` | 4 / 12 / 16px (observed on xsu.vn, not in source skill) |

Manrope is bundled locally through `@fontsource-variable/manrope`, including Vietnamese glyphs. The desktop canvas must use the strong gray surface, the site shell must use the white muted surface, and primary actions must use the raised dark surface. The VGD wordmark and product copy must remain VGD's own.

## Component-level rules

### Header and mobile menu

Anatomy: wordmark, route links, VI/EN switch, and one mobile menu toggle. The desktop header should remain compact within the shell. The mobile menu must stack links at 900px and below. Labels must wrap or reflow when translated.

States: default links must be visible; hover must change emphasis; focus-visible must show a 3px outline; active must use `aria-current="page"`; disabled links must not be rendered; loading and error must not be shown for static navigation. The menu button must expose open/closed through `aria-expanded`. Pointer and touch must toggle it; Enter and Space must toggle it; Escape must close it and restore focus.

### Product selector and catalog filter

Anatomy: one pill rail containing All/Tất cả and product names. It must use `radius.md`, `font.size.md`, and the muted border. At narrow widths it must scroll within itself while the page remains fixed. Focused offscreen links must become visible. Long names must remain readable rather than being cut to ellipses.

States: default must be tertiary; hover must become secondary; focus-visible must show the outline; active must be black and use `aria-current` for links or `aria-pressed` for filter buttons. Disabled and loading states must prevent activation and announce their state if introduced. Error must provide text rather than color alone. An empty catalog must show a descriptive empty state.

### Product cards and preview media

Anatomy: labeled media placeholder, name, short summary, release status, and detail action. Cards must use the muted border and `radius.xs`. Media must be described as preview until VGD provides approved imagery. Desktop cards should use two columns; mobile cards must use one. Long translated names and summaries must wrap.

States: default must show the preview status; hover must emphasize the border; focus-visible must outline each link; active must remain legible; disabled and loading actions must not be presented as available downloads; error must present a visible explanation. No release must display “Chưa có bản phát hành” or “No release available yet”.

### Buttons, forms, and status

Primary actions must be dark pill buttons using `color.surface.raised` and `radius.md`; they must lead to product information or VGD Center guidance. Secondary actions must use a white surface and muted border. Search fields and buttons must have at least 44px touch height. Hover, focus-visible, and active states must be perceptible. Disabled controls must prevent action; loading controls must announce busy state; errors must use visible text and `aria-invalid` when tied to a field. Status must use a text label as well as a dot.

## Accessibility requirements and testable acceptance criteria

- All keyboard controls must show a visible outline of at least 3px.
- The menu must open with Enter and Space, close with Escape, and return focus to its toggle.
- At 320, 360, 375, 390, 430, 768, and 1440px widths, the document must have no unintended horizontal scroll.
- At 200% zoom, labels, cards, and actions must remain readable and operable.
- Touch actions must be at least 44px high.
- Text and controls must meet WCAG 2.2 AA contrast; a status must never rely on color only.
- Reduced-motion settings must remove nonessential motion.
- VI and EN pages must preserve equivalent meaning and destinations.

## Content and tone standards

Copy must be concise, confident, and factual. Use “Tìm hiểu VGD Center” / “Learn about VGD Center” for the installation route. Use “Chưa có bản phát hành” / “No release available yet” when release metadata is absent. Compatibility must say it is awaiting verification; it must never name unsupported SketchUp versions. Planning-seed products and placeholder media must be labeled preview.

## Anti-patterns and prohibited implementations

Do not copy XSU's logo, product names, imagery, source code, account controls, pricing, or checkout. Do not invent VGD releases, versions, compatibility, download URLs, or plugin screenshots. Do not hide focus indicators, use low-contrast copy, or add one-off colors and type sizes outside the token scale. Do not route installation around VGD Center.

## Migration notes

Replace the provisional VGD wordmark and media when approved VGD assets arrive. Review all product copy against production sources. Read published version and compatibility only from the shared release metadata owned by `VGD_Plugins`. Reassess the exact XSU-derived monochrome palette after VGD approves its brand palette.

## QA checklist

- [ ] Inspect VI and EN home, catalog, product detail, and Center on desktop and mobile.
- [ ] Check menu, product rail, filter, search, focus, touch, long copy, and empty states.
- [ ] Check page overflow at each acceptance width and 200% zoom.
- [ ] Run `npm run build`.
- [ ] Confirm noindex, robots, sitemap, and release data retain their preview state.
