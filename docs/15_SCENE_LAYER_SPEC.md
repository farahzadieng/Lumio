# 15 — scene layer map and animation budget

## Registration and responsiveness
Reference design coordinate system: **390×620** scenic region, anchored to top of Today above the habit area. Use a single aspect-preserving scene transform; never independently stretch hills/clouds. Provide overscan/bleed 8–12% on wide assets, mobile breakpoints 320/375/390/430px, safe areas and dynamic viewport. Every asset manifest entry requires `id`, `src`, `z`, `bbox`, `anchor`, `scale`, `motionPreset`, `timeModes`, `occlusion`, `fallback`, `bytes`, `license`.

## Layer slots (art target ~60 distinct assets; not 60 animated layers)
- Z00–05 **SKY**: paper sky background (dawn/day/dusk/night), haze, subtle vignette, distant light texture. Full-bleed upper region.
- Z06–13 **CELESTIAL**: sun disc/rays, moon, stars, far cloud 1–4. Upper 0–45%.
- Z14–22 **FAR WORLD**: distant mountain silhouettes, mist, far tree line, far cloud shadow. Horizon ~35–60%.
- Z23–34 **MID WORLD**: middle hills, tiny cottage roof/walls/windows, tree crowns/trunks, bridge and stream source. Middle 40–82%.
- Z35–47 **NEAR WORLD**: near hills, river surface, banks, flowers, leaves, mushrooms, shrubs, foreground trees. Lower 62–100%.
- Z48–54 **LIFE**: bird(s), butterfly(s), floating petals, raindrops, fireflies, occasional rainbow; conditional, not all simultaneous.
- Z55–59 **OCCLUDERS & FX**: near leaf overlay, paper confetti, shadows, character behind-plant masks, subtle atmospheric foreground.

## Placement / motion recipes
| Group | Placement | Motion | Typical duration | Amplitude |
|---|---|---|---|---|
| Far clouds | top 8–35% | translateX, asynchronous | 20–38 s | 8–22 px |
| Sun/moon | top 8–27% | almost static; glow opacity | 15–28 s | <=4% opacity |
| Far mountains | middle 35–58% | static | — | 0 |
| Mid hills | middle 45–85% | subtle parallax only | 12–25 s | 1–3 px |
| Leaves/flowers | lower 65–100% | rotate at stem anchor | 4–9 s | 1–3° |
| Butterfly/bird | sky/mid, precomputed safe paths | occasional curved travel | 7–18 s | path dependent |
| River | lower 68–100% | 2–3 masked flowing highlights | 5–12 s | 2–6 px |
| House windows | middle | opacity glow, night only | 3–8 s | subtle |
| Character cameo | approved anchors (cloud/flower/tree/roof) | expressive loop | 1–4 s | per clip |

**Budget targets (to benchmark, not guaranteed limits):** Today first meaningful interactive paint under 2.5 s on midrange phone after cached start; ambient scene no more than 8–12 active transforms on normal tier, 4–6 on low-power tier; 24–30fps for low-priority ambient loops acceptable if smooth; user interaction and scrolling target 60fps; long tasks under 50ms; avoid giant SVG filters. Lazy-load noncritical layers and animated cameo. Preload only scene base and current time mode. Suspend when document hidden; reduce motion fully. Measure real transferred bytes and memory, not only ZIP size. Prefer modern WebP/AVIF for raster, keep PNG fallbacks where needed. GIF for export, Animated WebP for runtime if verified.

## Four scenes
Dawn peach warm, Day azure/mint/gold, Dusk coral/lavender-free amber, Night muted teal-blue with glowing windows and warm moon. Keep geometry identical, lighting and optional props different; no sudden jumps at clock boundaries. Use CSS crossfade for lighting modes and day-key seeded microevents.
