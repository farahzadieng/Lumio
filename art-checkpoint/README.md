# Lumio art direction checkpoint — awaiting approval and layer repair

This folder is a **visual proposal**, not runtime art. No file here is imported by an app. The rejected v2 environment in `references/REJECTED_V2_ART_DO_NOT_USE/` was not used as an input.

## Delivered

- `day-master.png`, `night-master.png`: new 995×1581 RGB paper-diorama compositions, authored with the built-in image-generation tool. The night image is a relight of the day master with closely matching geometry.
- `layers/`: background, midground and foreground generation tests for each mode. Midground and foreground have actual alpha channels and reconstructed hidden regions; background is opaque. The sky-object layers have alpha but **fail edge QA** because of colored fringing and contaminated shadows. These files are explicitly named `FAILED-QA`.
- `day-layer-test-FAILED-QA.jpg`, `night-layer-test-FAILED-QA.jpg`: diagnostic composites of those layers. They are not replacements for the masters.
- `art-contact-sheet.jpg`: masters, isolated depth-plane tests and diagnostic composites.
- `screenshots/`: master-art mock screenshots at 320×690, 375×812, 390×844 and 430×932. The lower cream area is deliberately reserved for future habit UI; no UI has been built.

## QA result and production blocker

The two flattened masters look directionally suitable for approval. The current cutout planes do **not** reconstruct the masters at production quality: sky-object alpha has vivid red/yellow/gray fringing, and independently generated planes shift small details and edges. The night planes also need exact pixel registration against day. I am stopping at the required approval gate. A production layer source needs a designer or image editor with precise object masks, manual edge decontamination, inpainting under occlusions, and layered PSD/PSB or equivalent export; alternatively supply approved pre-separated source layers. Image generation here made convincing masters but did not deliver clean, exact, separately editable production layers by itself.

The 60 scene slots in `assets/living-world/scene-manifest.json` remain unfilled. The app and animation system have not been started.

## Art prompt set

Built-in imagegen was used throughout. The master prompt specified a portrait 390:620 premium fibrous cardstock diorama in the approved icon's palette, with upper-left key light, turquoise sky, far mountains, mint/jade hills, cream cottage with coral roof, winding stream, trees, flowers and foreground occluders; it prohibited UI, characters, flat clipart, thick outlines and plastic 3D. The night edit preserved the layout while substituting moon, stars, deep teal lighting and warm cottage windows. Separate extraction prompts requested a complete reconstructed far background, true-alpha midground hills/cottage/trees, true-alpha foreground river/flowers/leaves, and true-alpha celestial/cloud objects; night planes were relit from the day planes. The sky-object extraction failed clean-alpha QA.

Generated images have no embedded ICC profile; a controlled sRGB conversion and 2×/3× production export remain pending. Source rights for the generated art must be reviewed before release. Existing icon and character files were neither altered nor replaced.
