# 17 — Living Today visual implementation and QA

**Checkpoint:** 2026-11-19. This records an implemented visual improvement, not final completion of the 60-object art system.

## What changed

- The world is now composed inside Today instead of repeating behind every tab. Journey, Insights and Profile use distinct quiet paper surfaces.
- Today's scene height was reduced so the three active habit cards remain visible in the initial 390×844 viewport. The third card ends at y≈653; bottom navigation begins at y=769.
- Added five new transparent paper assets: cloud, leaf sprig, coral flower, songbird and butterfly. Cloud and sprig each have two independent instances. The flower, cloud and river highlight respond to their own touch targets; successful habit storage also triggers a flower response. Bird or butterfly appears episodically based on the local day key.
- The existing four raster planes are now static scene structure. The former multiple clipped copies of a whole sky image and whole-plane sways were removed from runtime composition.
- Ambient movement pauses when Today unmounts or the document is hidden. Reduced-motion mode removes ambient animation and hides passing fauna.

## Evidence

- `npm run build`: passed. Initial JS 529.21 KB minified / 168.35 KB gzip; calendar remains a lazy chunk. PWA precache 59 entries, 3,072.46 KiB. Vite still reports a bundle-size advisory over 500 KB.
- `npm test`: 11/11 passed.
- `LUMIO_URL=http://127.0.0.1:5175/ node test-living.mjs`: passed in local Chrome. No page errors or HTTP ≥400 responses; no horizontal overflow at 390 or 320 px. Touching flower and river produced nonidentity transforms. A completed habit gained the Undo control. Reduced-motion computed cloud animation was `none`.
- `LUMIO_URL=http://127.0.0.1:5175/ node test-motion.mjs`: cloud transform changed during observation; one active page after rapid tab changes; reduced-motion cloud animation `none`. Desktop requestAnimationFrame median and P95 were ~16.7ms in this sample. This is not a physical-device benchmark.
- Visual inspection: `test-artifacts/living-v2-day-390x844.png`, `living-v2-night-390x844.png`, `living-v2-night-430x932.png`, `living-v2-night-320x690.png`, and screenshots for the other three tabs. Asset contact sheet: `art-checkpoint/living-v2-contact-sheet.png`.
- English LTR at 390×844: `test-artifacts/living-v2-english-390x844.png`; `dir=ltr`, `lang=en`, no horizontal overflow.

## Remaining limitations

- The underlying four raster planes remain grouped images. The full 60 independently editable object sources, precise night registration, corrected source masks, and richer occlusion/event rigs are still outstanding.
- New assets are visual overlays with CSS scene anchors; exact object registration across every screen ratio needs designer review on physical phones.
- Episodic fauna and ambient motion were verified through browser styles and screenshots, not physical iOS/Android playback or battery profiling. No claim of final release visual fidelity is made.
- The Bon typography and other pre-existing product decisions were preserved during this visual pass; true Estedad Mad/Dots verification remains a separate requirement.
