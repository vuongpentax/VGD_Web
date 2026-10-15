# VGD Phase 1 interface rules

## Context and goals

The VGD website must help people discover preview products and understand how VGD Center manages installation inside SketchUp. Its composition may take cues from XSU's compact header, product selector, and balanced showcase, while all brand assets, wording, colors, and behavior remain VGD's. The nine files in `docs/planning/` remain the product source of truth. This document specifies the current preview interface and does not change release metadata ownership.

## Design tokens and foundations

| Token | Value | Use |
| --- | --- | --- |
| `color.ink` | `#18211f` | Primary text |
| `color.inkSoft` | `#44514e` | Supporting text |
| `color.brand` | `#277056` | VGD accent |
| `color.brandDark` | `#174d3b` | Primary actions |
| `color.canvas` | `#dce5de` | Desktop backdrop |
| `color.surface` | `#ffffff` | Site shell and cards |
| `color.surfaceSoft` | `#f6f9f6` | Preview media |
| `color.border` | `#dce3df` | Dividers |
| `color.focus` | `#b85324` | Keyboard focus ring |
| `type.caption` | 11 px | Short labels and annotations |
| `type.meta` | 12 px | Short secondary facts |
| `type.bodySmall` | 13 px | Card and sidebar copy |
| `type.body` | 14 px | Descriptions |
| `type.action` | 14 px | Buttons and action links |
| `radius.card` | 16 px | Content cards |
| `radius.pill` | 999 px | Selectors and primary actions |
| `space.base` | 4 px | Spacing increments |

The current Arial-based stack is provisional until VGD provides approved typography. The desktop site shell is at most 1000 px wide, with a 900 px content column. At 900 px and below, navigation becomes a menu. At 740 px and below, the showcase and product detail become one column. At 640 px and below, cards become one column and the site shell fills the viewport. These limits follow the current XSU-inspired preview; the planning specification's wider 1200–1280 px target should be revisited when real screenshots and product copy arrive.

## Component-level rules

### Header and mobile menu

The header must contain the VGD wordmark, product, Center, docs, updates, contact, and VI/EN navigation. The menu toggle must be at least 44 × 44 px. On mobile, the menu must open on click, touch, Enter, or Space; Escape must close it and return focus to the toggle. Focus must stay within the open menu and toggle. The current route must be marked with `aria-current="page"`. Long translated labels must wrap without clipping.

States: default is closed on mobile; hover and focus-visible distinguish links; active marks the current route; disabled and loading do not apply to navigation; missing destinations are prohibited.

### Product selector

The pill row must show “All/Tất cả” and each preview product with the active item visibly distinguished and exposed via `aria-current`. The row may scroll horizontally on narrow screens without widening the document. Each item must keep a 44 px minimum height. Keyboard users must be able to Tab through all links, including offscreen items, and the focused item must become visible. Product names must never truncate silently.

States: default, hover, focus-visible, and active are required. Disabled, loading, and error states are not used because links exist only for known preview routes. An empty catalog must replace the selector with a clear empty state.

### Product card and preview media

Each card must contain a labeled preview media placeholder, product name, a one-sentence summary, release status, and a “View details/Xem thông tin” link. The entire media area and the explicit action lead to the same detail page. Media placeholders must state that approved VGD imagery is pending; they must not impersonate SketchUp screenshots. Cards must reflow to one column on mobile. Long product names, summaries, and status labels must wrap.

States: default, hover, focus-visible, and active apply to links. A card must show “Chưa có bản phát hành/No release available yet” until verified shared release metadata exists. Disabled, loading, and error states must not be represented with invented downloads or version values.

### Buttons, links, search, and status

Primary actions must lead to information about VGD Center or a known route. No browser-side plugin download or installation action is permitted in Phase 1. Primary buttons and search controls must have at least a 44 px touch target. Buttons and links must show hover, focus-visible, and pressed states. Disabled actions must use native `disabled` or `aria-disabled` as appropriate; loading actions must announce progress and prevent repeated activation; errors must have visible text associated with the control. Search zero results must explain the empty result and offer a way to clear filters. Status must use text alongside color.

## Accessibility requirements and acceptance criteria

- Every keyboard-operated control must display a visible focus ring with at least 3 px thickness.
- Keyboard users must open and close the mobile menu, return focus after Escape, and reach every selector item.
- At widths 320, 360, 375, 390, 430, 768, and 1440 px, the document must not scroll horizontally because of content.
- Text and controls must remain legible at 200% zoom without clipped labels or overlapping actions.
- Interactive targets must be at least 44 px tall on touch layouts.
- Text and status colors must meet WCAG 2.2 AA contrast; status cannot rely on color alone.
- Reduced-motion preferences must remove nonessential transitions.
- VI and EN routes must have equivalent meaning and route availability.

## Content and tone standards

Use concise, factual labels. Prefer “Tìm hiểu VGD Center” / “Learn about VGD Center” for the installation path. Use “Chưa có bản phát hành” / “No release available yet” when release metadata is absent. State “Tương thích SketchUp đang được xác nhận” rather than naming unverified versions. Mark planning-seed products and illustrations as preview.

## Anti-patterns and prohibited implementations

- Do not create fake version numbers, release dates, compatibility ranges, download URLs, or SketchUp screenshots.
- Do not copy XSU logo, text, images, code, pricing, account, checkout, or licensing flows.
- Do not use low-contrast microcopy, hidden focus indicators, clipped product names, or one-off spacing to rescue one page.
- Do not route installation around VGD Center.
- Do not treat this preview document as approval of the production roster, release manifest, or brand palette.

## Migration notes

Replace preview media and the provisional wordmark when VGD supplies approved assets. Replace planning-seed catalog copy only after product review. Production version and compatibility must come from the shared release metadata owned by `VGD_Plugins`. Reassess the shell width and typography after real content is available.

## QA checklist

- [ ] Review desktop and mobile screenshots of home, catalog, detail, and Center in VI and EN.
- [ ] Check menu, selectors, search, focus, touch targets, and long text.
- [ ] Check no horizontal document overflow at the listed widths.
- [ ] Run `npm run build`.
- [ ] Confirm noindex, robots, sitemap, and release data remain in their intended preview state.
