# Actual asset audit and remaining asset manifest

Inventory date: 2026-11-18 (Asia/Tehran). The filesystem, not historical docs, is the source of truth.

| Group | Actual | Remaining |
| --- | --- | --- |
| Approved icons | 19 files in `assets/icons/`; approved reference image | Preserved and used for PWA branding. Maskable safe zone still needs independent verification. |
| Character concept | 1 GIF in `assets/character/` | Preserved; concept only. |
| Paper guest loops | 8 GIF + 8 animated WebP in `assets/paper-guest/` | 360×360, alpha, loop, 8 frames each except dance (12). Distinct static facial expressions visible; motion is mostly small whole-body changes. Premium dimensional revision and cameo occlusion integration pending. Static SVG expression sources absent from live tree. |
| Living world | `assets/living-world/scene-manifest.json` plus 16 new runtime WebPs in `public/art/` | All 60 historical manifest paths still point to missing SVGs; `verify_assets.py` fails at `sky-dawn.svg`. Four raster planes per mode are functional, but 60 independent object assets and exact registered source masks remain missing. |
| Props/events | Placeholder README files in `assets/world/` and `assets/props/` | Premium independent fauna, particles, interactive objects, occluders and bespoke event rigs pending. |
| Fonts | Four local Estedad body weights plus OFL notice in `public/fonts/` | Supplied Estedad-Mad file and verified Dots variant are absent. No Dots effect is simulated. |
| App/PWA | React/TS/Vite source, manifest and generated Service Worker | Functional checkpoint exists. Full art system, real iOS/Android profiling and release QA pending. |

The quarantined environment and prop SVGs were not copied, recolored, displayed or imported into runtime art.
