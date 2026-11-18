# 10 — 60-layer world assembly guide (source of truth)

## Geometry and placement
Every scene SVG has `viewBox="0 0 390 520"` and transparent background (except four sky fills). Place all 60 layers in a single aspect-ratio 390/520 composition, using absolute `inset:0; width:100%;height:100%`, **not individually stretched**. Maintain scene aspect ratio with `object-fit:contain` or consistent cropped viewport; never use independent CSS scaling on hills vs clouds. Z-order and category are defined in `assets/living-world/scene-manifest.json`.

## Zones
- `sky` z0–14: backdrop (one of dawn/day/dusk/night), sun OR moon, six night stars; anchored in top 0–200 px.
- `upper` z15–20: six independent cloud pieces; drift 4–8px, 18–33s; top 60–250px. Suitable for occasional paper guest on top of clouds (character z between cloud and foreground).
- `horizon` z22–23: two distant mountain sheets, y~300–360; parallax <=1px.
- `middle` z24–39: three rolling hill sheets; cottage roof/base/door/window; four tree silhouettes. House around x214–300, y285–377. Tree sway around trunk foot.
- `foreground` z40–47, 58–59: four flowers, four leaves, front grass lip and tufts; near bottom 440–520. They may occlude character.
- `sky-activity` z48–50: three bird silhouettes, occasional movement.
- `activity` z51–52,55: butterflies and petals, episodic rather than continuous.
- `lower` z53–54: stream and stepping stones, y398–520.
- `weather` z56–57: optional rain/rainbow, not both permanent.

## Lighting
Local clock defaults: dawn 05–08:59, day 09–16:59, dusk 17–19:59, night 20–04:59. These are clock-based design windows, not astronomical sunrise/sunset. Use only one `sky-*` SVG; hide sun at night, hide moon and stars by day; dim foreground colors with CSS color/opacity overlay in dusk/night (avoid globally dimming text/UI). Warm cottage window brightens at night. Crossfade sky 800–1200ms; avoid hard swap. Provide manual scene override.

## Responsive layout
At 320px, keep house, hills and top focal cloud; crop optional peripheral leaves. At 390px use authored positions. At 430px scale uniformly. At tablet/desktop constrain scene to readable card/hero; do not make SVG stretch horizontally. Reserve a bottom safe region for navigation and three habit cards; cards are HTML overlay or below, never baked into artwork.

## Anchor placements for paper guest
Use local scene coordinate anchors, not random absolute viewport pixels. Example positions: cloud-left (x80,y88,z21, scale .50), cloud-right (x274,y132,z21, scale .45), flower-left (x85,y418,z45, scale .38), behind-tree (x120,y335,z34, scale .50), cottage-roof (x248,y263,z33, scale .35), stream-bank (x170,y410,z55, scale .35). Anchor-specific occlusion is mandatory. Never cover habit CTA or calendar controls. Pick one cameo at most, with seeded local-day selection and probability/none option.

## Art quality requirements
Current 60 SVG layers are editable starter drawings; improve their silhouette detail, paper edge texture, consistent contact shadows, small die-cut imperfections, multi-tonal layering, and nuanced night lighting. Keep coordinates and layer IDs stable. Aesthetic target: tactile premium paper diorama, **not** glossy 3D, holographic neon, or generic gradient background. 'Holographic' here means convincing parallax depth / layered diorama, not rainbow foil.
