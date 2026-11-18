# Actual asset audit and missing-asset manifest

Inventory date: 2026-11-18 (Asia/Tehran). Source of truth is the filesystem, not historical docs.

| Asset group | Actual files | Status / missing work |
| --- | ---: | --- |
| Approved Lumio icons | 19 files in `assets/icons/`, plus `references/approved-icon-original.png` | Preserve. Icon source was used only as a style reference. |
| Existing character concept | 1 GIF in `assets/character/` | Preserve. Concept, not a full performance library. |
| Paper guest motion | 8 GIF + 8 animated WebP in `assets/paper-guest/` | Preserve. All 16 files are 360×360, transparent, looping, with 8 frames except dance (12). Frame pixels change, but expression-specific facial animation has **not** been verified; docs describe whole-body bob/rotation prototypes. Static SVG expression sources are absent from the live asset tree. |
| Living world | `scene-manifest.json` only | All **60** referenced runtime layers are missing. `verify_assets.py` fails at `sky-dawn.svg`. New day/night masters and depth-plane tests are in `art-checkpoint/`, not approved runtime assets. |
| World/props | README placeholders only | All new premium props, interactive objects, masks, fauna, particles, dawn/dusk variants and exact 60-layer registrations missing. |
| Fonts | None in project | Supplied Estedad-Mad file and verified Dots variant/license are not present. Dots axis cannot be assumed. A locally licensed body face is also needed. |
| App/PWA | No React source/package/manifest/service worker | Entire implementation is gated on art approval and production layer repair. |

The quarantined environment and prop SVGs are rejected. Their filenames are not candidates for copying, recoloring or runtime import.
