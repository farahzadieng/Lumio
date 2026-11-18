# AGENTS.md — binding instructions for Codex

You are implementing **Lumio**, an offline-first Persian/English PWA. **READ `CODEX_START_PROMPT.md` FIRST**, then `START_HERE.md`, `CODEX_MASTER_PROMPT.md`, `docs/14_ART_REBUILD_DIRECTIVE.md`, `docs/15_SCENE_LAYER_SPEC.md`, and all remaining docs.

## STOP: Mandatory art approval gate
The previous environment SVG artwork was **explicitly rejected by the client** as Paint-like, flat, with no credible depth, shadow, gradient, or visual richness. It has been quarantined under `references/REJECTED_V2_ART_DO_NOT_USE/`. **Never ship, display, import, copy, recolor, or trivially tweak those rejected files.** All world and prop imagery MUST be created anew with a unified premium, tactile, dimensional paper-cut art direction. Approved icons and character assets are exempt and should be retained.

1. Audit assets and produce a missing-asset manifest.
2. Generate a complete premium **day scene** with distinct editable foreground/midground/background assets, and a **night scene** with consistent geometry. Deliver an art contact sheet and screenshots at 390×844 and 430×932.
3. **Obtain user approval of the art direction before building the remaining 60-layer system or app UI.** If the available environment cannot create production-quality visual artwork, explicitly stop and request access to an image/design-generation workflow or approved asset files. Never substitute crude SVG primitives and claim completion.
4. After approval, build all scene layers and animation rigs, then React UI and PWA. Reuse existing icon and character assets without silently replacing them.
5. Verify actual animated transparency and motion for character GIF/WebP; do not assume every file has a distinct facial performance.
6. Respect 3 daily habits, independent 21-day streaks, Persian RTL/Jalali, English LTR/Gregorian, offline-first IndexedDB, backup, installation onboarding, Dots font verification, reduced motion, and 4 tabs.
7. Run screenshot comparison and functional tests, report actual evidence. Do not claim visual fidelity without screenshots.

## Non-negotiable visual QA
Reject any art that resembles flat geometric vector placeholders, MS Paint, clipart, untextured blocks, generic SaaS dashboards, mismatched lighting, disconnected ground planes, or cartoon assets pasted without occlusion/shadows. Keep coherent contact shadows, rim-light, paper-edge highlights, layer separation, gradients inside material, subtle fiber texture, atmospheric depth and composition.
