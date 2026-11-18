# 12 — Paper guest character: exact production brief

**No old Sobo Rive dependency.** The guest is an original paper-cut blob silhouette in the Lumio visual language. It is an occasional secondary resident, not the primary product character.

## Included
- `assets/paper-guest/idle.svg`, `smile.svg`, `sad.svg`, `angry.svg`, `happy.svg`, `dance.svg`, `sleepy.svg`, `curious.svg`: eight actual **editable static SVG expression assets**, all 180×180 viewBox with transparent background and consistent silhouette. These are editable SVG source assets.
- `assets/paper-guest/legacy-happy-concept.gif`: earlier 6-frame happy GIF concept; validate palette, transparency and looping before shipping. It is not proof of the eight requested GIFs.

## Included simple loop exports and further polish specifications
idle: 4–6 frame gentle breathing 1.5–2.5s; smile: 5–8 frames 1–1.5s; sad: 6–8 frames drooping 1.5–2.2s; angry: 5–8 frames stomp/brow 0.8–1.3s; happy: 6–10 frames bounce 1–1.5s; dance: 10–16 frames 1.5–2.5s; sleepy: 6–10 frames slow blink 2–3s; curious: 6–10 frames peek 1.3–2s. **Eight real GIF and eight Animated WebP loop files are now included.** The current loops use gentle whole-body rotation/bobbing of the expression SVG; bespoke eye/hand/dance frame-by-frame animation is a future polish task. All loops seamless with alpha, no baked environment, consistent 180×180 safe box, no cropped limbs. Animated WebP preferred for deployment; GIF only for portability, static SVG/PNG poster fallback.

## Motion integration
Place at predefined scene anchors with x/y/z/scale, occlusion, and seeded daily appearance. Character emotions should not punish missed habits. Positive check-ins may trigger smile/happy for a short time. Avoid permanent animated GIF when scene is hidden; do not start 8 animations simultaneously.

## Export QA
Check actual alpha and disposal mode, loop count, dimensions, alpha halo on dark night background, compressed size, reduced motion fallback, iOS Safari playback. For SVG-only motion use Motion/CSS with facial layer transform, no false GIF claim.
