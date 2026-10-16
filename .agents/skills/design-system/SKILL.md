---
name: design-system-xsu
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards. Use when creating or updating UI rules, component specifications, or design-system documentation.
---

<!-- TYPEUI_SH_MANAGED_START -->

# XSU

## Mission
Deliver implementation-ready design-system guidance for XSU that can be applied consistently across dashboard web app interfaces.

## Brand
- Product/brand: XSU
- URL: https://xsu.vn/#rsu
- Audience: authenticated users and operators
- Product surface: dashboard web app

## Style Foundations
- Visual style: structured, accessible, implementation-first
- Main font style: `font.family.primary=Manrope`, `font.family.stack=Manrope, sans-serif`, `font.size.base=22px`, `font.weight.base=400`, `font.lineHeight.base=30.8px`
- Typography scale: `font.size.xs=13px`, `font.size.sm=15px`, `font.size.md=22px`, `font.size.lg=34px`, `font.size.xl=36px`
- Color palette: `color.surface.base=#000000`, `color.text.secondary=#111111`, `color.text.tertiary=#666666`, `color.border.muted=#cccccc`, `color.surface.muted=#ffffff`, `color.surface.raised=#1d1d1d`, `color.surface.strong=#aaaaaa`
- Spacing scale: `space.1=6px`, `space.2=8px`, `space.3=10px`, `space.4=15px`, `space.5=16px`, `space.6=20px`, `space.7=44.25px`, `space.8=45px`
- Radius/shadow/motion tokens: `radius.xs=8px`, `radius.sm=24px`, `radius.md=360px`

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone
concise, confident, implementation-focused

## Rules: Do
- Use semantic tokens, not raw hex values in component guidance.
- Every component must define required states: default, hover, focus-visible, active, disabled, loading, error.
- Responsive behavior and edge-case handling should be specified for every component family.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and tokens.
3. Define component anatomy, variants, and interactions.
4. Add accessibility acceptance criteria.
5. Add anti-patterns and migration notes.
6. End with QA checklist.

## Required Output Structure
- Context and goals
- Design tokens and foundations
- Component-level rules (anatomy, variants, states, responsive behavior)
- Accessibility requirements and testable acceptance criteria
- Content and tone standards with examples
- Anti-patterns and prohibited implementations
- QA checklist

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.

## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Prefer system consistency over local visual exceptions.

<!-- TYPEUI_SH_MANAGED_END -->
