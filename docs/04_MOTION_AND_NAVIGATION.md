# 04 — Motion language and transitions

## Motion philosophy
Motion should resemble paper: bend, unfold, curl, slide, rise, stamp, flutter. The world is lively; other pages prioritize readability. No gratuitous glitch, neon, cursor trails, full-screen confetti every tap, or parallax that obscures controls.

## Signature navigation
**Paper Flip** between primary tabs. Stage A current page eases back ~8–16px with subtle perspective; Stage B corner curls/layer rotates or masked paper fold reveals next page; Stage C destination content enters in short stagger. Duration target 450–650ms. Direction must be correct for RTL/LTR and navigation order. Shadows/edges follow the turning paper. **Never render the whole page as a screenshot**; retain accessible DOM and route state. Respect browser back/forward, interrupted transitions, rapid tapping, keyboard focus, scroll restoration.

**Paper Unfold** for create/edit habit, backup dialogs, form sheets: 300–450ms scale/clip/rotate small fold; focus only after opening and return on close.

**Paper Slide** for calendar month, filters, accordions, local panels: 180–280ms subtle translation and shadow.

## Microinteraction durations
- Press: 120–180ms.
- Habit stamp/check: 250–500ms, reversible and not double-counted.
- Entry card: 200–320ms, stagger 35–60ms maximum.
- World celebratory bloom: 600–1200ms, nonblocking.
- 21-day graduation: special short paper celebration, once per graduation ID.
- Ambient loops: 4–35s with varying phases.

## Library ownership rules
Motion for React: component entrances, layout changes, press, dialog content and simple route transitions. GSAP: ONLY complex multi-object timelines for world and signature Paper Flip when needed. CSS keyframes: always-on low-cost ambient motion. Animate UI: selected accessible shadcn-compatible components; avoid duplicate motion systems controlling same property. React Bits/Magic UI/Cult UI/Animata: only after a specific reusable component passes aesthetic, performance and licensing review. AutoAnimate is optional and redundant where Motion layout already solves the problem.

## Accessibility/performance
`prefers-reduced-motion: reduce` disables loops and 3D flips, uses 100–150ms fade or instant swap. Pause when document hidden, avoid layout thrashing, no unbounded DOM particles. Use GPU-friendly transforms/opacity and `will-change` only transiently. Avoid animation loops on charts while user is reading. Test Safari iOS low-power mode and 60Hz devices. For no-JS/reduced JS failure, show useful static content if possible.
