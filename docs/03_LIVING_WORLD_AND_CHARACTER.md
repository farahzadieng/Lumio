# 03 — Living World & paper guest cameo

## World is complete from day one
The scene is a **living destination**, not an illustration unlocked piece-by-piece. No permanent world growth/degradation tied to habit streaks. Background has ambient activity independent of habit state. Habit completions cause short reactions only.

## Scene layers (back to front)
1. `sky` with color/lighting according to time.
2. sun/moon and far clouds.
3. distant paper mountain/horizon.
4. mid hills, cottage, trees and foreground decorations.
5. interactive objects: flowers, leaves, butterflies, window, stream.
6. optional paper guest cameo at a validated scene anchor.
7. foreground leaves occluding character when appropriate.
8. temporary effects: paper confetti, petals, stamps, glow.

## Time-of-day modes (local device time, no geolocation)
| Mode | Default hours | Palette/behavior |
| --- | --- | --- |
| Dawn | 05:00–08:59 | pale peach sky, warm edge light, slow morning birds |
| Day | 09:00–16:59 | turquoise/sky, yellow sun, lively butterflies, bright foliage |
| Dusk | 17:00–19:59 | peach/coral gradient *made from paper layers*, house lights slowly on |
| Night | 20:00–04:59 | muted blue/teal layered paper sky, moon/stars, warm cottage windows, slower ambient motion |

These are configurable **defaults**; user should have manual 'follow clock / day / night' scene override in Profile for accessibility and preference. No full black screen; preserve contrast. Avoid pretending to track sunrise or sunset without location.

## Ambient loops
Cloud drift 18–35s, leaf sway 4–9s (1–3deg), flower bob 5–10s (1–3deg), front hill parallax <=4px, butterflies 12–25s episodic, sun warmth subtle. Use varied offsets/phases and no synchronized loops. `transform` and `opacity` preferred. Limit simultaneous moving objects, pause out-of-view/offscreen, throttle in background, provide reduced-motion mode and battery-conscious quality tiers.

## Discoverable micro-events
Occasional paper bird lands, butterfly passes, flower unfolds, window glows, small rain, paper rainbow, cloud shadows. Select event using a deterministic seeded local-day key and configurable scene seed; maintain consistent daily event on reload. Limit events and never obstruct task completion. Touch objects should provide feedback without requiring daily tasks or collecting data.

## paper guest cameo — not central mascot
The paper guest is a *small optional inhabitant* with paper-cut style. Approved role: occasionally appears at scene anchor, not permanently in the center; may sit on cloud, peek behind tree, dance by flower, sit by cottage, rest on hill. Preserve coherent scale, occlusion and perspective. Character feelings are **not** direct judgments about missed habits. Positive check-ins may trigger a celebratory response.

### Animation states to commission/create
`idle`, `smile`, `happy`, `sad`, `angry`, `dance`, `sleepy`, `curious`, `peek`, `celebrate`. Each is a 1–3s seamless short loop, with small believable movement, transparent background, consistent silhouette and anchor. At least `idle`, `smile`, `happy`, `sad`, `angry`, `dance` requested; others optional extensions. For every state: 1x and 2x, poster frame, dimensions around 256×256 and 512×512, clear loop metadata and transparent alpha.

### Existing assets and honesty
- `references/legacy-character/original-sobo-reference.riv` is original supplied Rive binary **reference**, not required runtime. Its internal animation state mapping has NOT been verified.
- `assets/character/paper-guest-happy-concept.gif` is a generated **6-frame happy expression proof-of-concept**, not a complete mood library; verify its appearance against final character art before use. It has transparency and is animated; it is not a sprite source for all emotions.
- Other requested moods and positions do **not** exist yet. Codex must produce original compatible art or request approved assets; never invent filenames or claim missing states are delivered.
- Character commercial rights, CC BY attribution if applicable, and resemblance/branding rights must be checked before distribution. No assumption that a marketplace license grants brand/trademark rights.

## Scene anchors
Use normalized coordinates in scene viewBox and explicit `zIndex`/occlusion: `cloudTop`, `flowerLeft`, `treePeek`, `cottageRoof`, `hillRight`, `streamEdge`. Anchor definitions should include `x`, `y`, `scale`, `zIndex`, `allowedMoods`, `safeArea`, and `occlusionMask`. On 320px width, no cameo overlaps action buttons. Seed cameo selection by date; not every visit needs one. If reduced motion is on, show static poster or hide cameo motion.

## Animation technical plan
For production, prefer Animated WebP (alpha), or sprite sheet with CSS/WAAPI, depending on benchmark. Keep GIF as reference/fallback. Avoid repeated heavyweight full-screen GIFs. Do not install or use Rive in the final app. The old `.riv` is archived for historical reference only. The final character must be an independently illustrated paper-cut guest using transparent animated assets.
