# 11 — Motion production recipes and budgets

## Core tools
- CSS transform/opacity for ambient loops, GPU-friendly, no React re-render per frame.
- Motion for React for route/content entrance, layout and form interaction; Animate UI selectively for accessible shadcn primitives.
- GSAP timelines for coordinated paper flip, paper celebrations and cinematic scene events. Register/cleanup with component lifecycle.
- React DayPicker Persian for correct Jalali dates; date logic is NOT a CSS animation.
- SVG paths, masks, gradients, shadows for paper depth. Avoid WebGL/Three.js for MVP.

## Loop recipes (targets, tune by profiling)
Clouds translateX 4–8px over 18–35s alternate; leaf pivot ±1–3deg over 4–9s; flowers ±1–2deg over 5–10s; hills translateY 1–3px over 17–27s; butterflies episodic 12–25s; star opacity .65–1 over 5–11s; window warm light opacity .75–1 over 8–15s. Use random phase offsets; avoid synchronous oscillation.

## Transition timings
Paper Flip main tabs 450–650ms, transform-origin direction aware and interrupted navigation safe. Paper Unfold forms 300–450ms; Paper Slide inner navigation 180–280ms; button press 120–180ms; milestone confetti 600–1200ms. Respect prefers-reduced-motion: replace 3D flip with <=150ms fade or none. Route should remain usable during transition.

## Performance budget (targets, not measured facts)
- Target 60 fps on modern devices, graceful 30 fps on low-power devices.
- **60 drawable layers does NOT mean 60 constantly animated layers.** Target <=10–14 concurrently animating transform layers on capable phones, <=4–7 on low-power; others static or episodic.
- Initial visible compressed scene payload target <=750KB SVG+WebP combined; total optional scene/cameo animations <=2MB cached, with lazy loading and device testing. These are project targets, NOT guarantees.
- A single cameo Animated WebP target <=150–250KB; total optional mood pack <=1.5MB, lazy loaded. If too large, use CSS/SVG animation instead.
- Memory/performance must be profiled on Safari iOS and Android; no hardcoded unverified GPU or battery savings claims.
- Pause when document hidden, tab not Today, reduced motion requested, or battery saver inferred only from supported APIs. Avoid animating filter, box-shadow or layout every frame; animate transform/opacity.

## Interactions
Check-in: press (120ms), paper stamp (220ms), short scene flower flutter or bird (450–800ms), optional guest smile; no lasting world growth or negative damage. Day 21: short paper petal burst + seal (800–1200ms). No random event should obscure touch targets.

## Production validation
Collect actual gzipped/brotli sizes, frame times, memory pressure, Core Web Vitals and PWA offline reports. Reduce active layers and event frequency before sacrificing readability.
