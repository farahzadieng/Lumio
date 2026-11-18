# 02 — Visual design system

## Art direction
**Living Paper Storybook**: tactile stacked paper cutouts, organic curves, fine fibers/grain, restrained contact shadows, gentle depth, matte surfaces, handcrafted irregularity. Avoid glassmorphism, neon, dark-heavy dashboards, metallic gradients, purple-heavy schemes, stock people, cartoon 3D plastic, generic admin dashboards. Premium editorial care and readable utility UI. The world is delightful, forms are clear.

## Tokens (proposed baseline, adjust against real art)
```
--paper: #FFF9EE; --paper-raised: #FFFCF5; --paper-deep: #F5EBD9;
--ink: #33483D; --ink-muted: #687669; --leaf: #5BA67A;
--mint: #A9D9B6; --sky: #9BDCE7; --sun: #FFD166;
--peach: #F6B7A0; --coral: #F28D85; --sand: #D6C3A3;
--line: #E8DCC8; --focus: #236B56; --error: #AD453D;
--radius-card: 20px; --radius-control: 14px;
--shadow-paper: 0 3px 0 #E4D9C5, 0 10px 22px rgba(65,69,50,.10);
```
All contrast values must be measured; adjust tokens to meet WCAG AA for text, including text on peach/mint backgrounds. Do not use decorative paper grain behind long text at high contrast.

## Typography
Persian display: user-supplied **Estedad-Mad.woff2** (static fat/display face; do not falsely declare variable weights). Example `@font-face {font-family:'Estedad Mad';src:url('/fonts/Estedad-Mad.woff2') format('woff2');font-style:normal;font-weight:900;font-display:swap;}` — verify embedded metadata in implementation. For body, use a licensed, locally hosted legible Persian font with true regular/medium/semibold weights; document choice and license. English body: locally hosted compatible sans. No remote font dependency. Use Persian digits when locale=fa except technical/export identifiers; use tabular figures for stats.

## Layout & responsive
Mobile-first 320, 375, 390, 430 px widths; tablet >=768 and desktop up to 1440. Content max-width around 480–560px for phone-like main view; larger layouts may place world and daily panel side-by-side without stretching artwork. Safe areas: `env(safe-area-inset-top/bottom)`; keyboard resize, portrait/landscape. Today scene logical composition 390×520 with *single coordinate system*; avoid mismatched aspect ratios for layers. Preserve focal zone, crop peripheral decorations on narrow devices. Keep actions visible without blocking the world.

## Visual hierarchy
- Today: immersive hero scene ~45–60% of initial mobile viewport depending on height, three tactile habit cards below/overlap with readable contrast, persistent bottom tab bar.
- Journey: scrapbook calendar with month paper tabs, journal entries and milestone seals; quieter than Today.
- Insights: layered paper charts with exact accessible data labels and concise metric summaries; no fake or fabricated statistics.
- Profile: stationery notebook with structured forms, settings, backup import/export; calmest page.

## Component contracts
- `PaperButton`: tactile press 1–2px, animated contact shadow, disabled/loading/focus states, 44px min target.
- `PaperInput`/`PaperTextarea`: native real HTML input with accessible label, paper note wrapper, focus underline/outline, helpful/error note; no decorative pseudo-input.
- `PaperDatePicker`: semantic trigger, dialog calendar with RTL week start Saturday and correct Jalali month lengths/leap years; English Gregorian calendar and LTR. Navigation arrows mirror appropriately. Store ISO local keys.
- `PaperSelect`/`PaperCheckbox`/`PaperSwitch`: accessible primitives, visual paper controls; not just click-able SVGs.
- `PaperDialog`/`PaperSheet`: keyboard trap, escape close, focus restoration, scroll lock, paper unfold animation.
- `PaperHabitCard`: habit name, today's check-in, current streak, day x/21, active/completed state, undo confirmation, accessible feedback.
- `PaperProgress`: SVG/canvas optional, numeric textual equivalent mandatory.
- `PaperNavigation`: four tabs, active paper tab rises subtly, no layout jump, correct back/forward behavior.
- `PaperToast`: short accessible announcement, no obstruction of check-in controls.

## Graphic production
SVG is preferred for cutout layers; transparent PNG/WebP for textured complex art; WebP animated for short cameos. Use reusable symbols and asset variants. Grain is subtle and should not force enormous composited layers. Keep UI icons consistent with a single stroke family, with paper accents rather than mixed illustration styles.
