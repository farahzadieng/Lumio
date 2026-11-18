# Lumio approved art direction and layer checkpoint

The client approved the new day/night paper-cut style on 2026-11-18. The rejected v2 environment in `references/REJECTED_V2_ART_DO_NOT_USE/` was never used as an input.

## Delivered art

- `day-master.png`, `night-master.png`: new 995×1581 RGB visual masters. Night is a relight with closely matching geometry.
- `layers/`: separate background, sky-object, midground and foreground source tests for day/night. The midground and foreground have true alpha. Sky-object source files are named `FAILED-QA` because they contain colored edge contamination.
- `day-layers-checkpoint.ora`, `night-layers-checkpoint.ora`: editable four-layer OpenRaster documents. The sky-object layer still requires manual edge repair.
- `art-contact-sheet.jpg`: visual audit of masters, layers and composites.
- `screenshots/`: art-only mobile previews at 320, 375, 390 and 430 px widths.
- `public/art/`: 16 optimized, sRGB-tagged runtime WebPs: four depth planes for dawn, day, dusk and night. Dawn/dusk are color-graded from the approved day geometry. The runtime sky assets had conservative alpha cleanup and were visually inspected at mobile sizes.

## Production limit

These four depth planes make a working dimensional scene, but do not fulfill the specified 60 independently editable object assets. Independently generated plane details and day/night edges do not align pixel-perfectly. The fine-grained production source still needs precise object masking, edge decontamination, inpainting beneath occlusions, and registered layered export. An illustrator or design workflow capable of those operations, or approved pre-separated source files, is required to finish the 60-asset system. The runtime app is a checkpoint prototype, not final art production.

## Generation method and rights

Built-in imagegen created the masters and extracted planes. The master prompt specified a portrait 390:620 fibrous cardstock diorama in the approved icon palette, with upper-left key light, turquoise sky, far mountains, jade hills, cream cottage with coral roof, winding stream, trees, flowers and foreground occluders; it prohibited UI, characters, flat clipart, thick outlines and plastic 3D. The night edit kept the layout while changing moon, stars, teal lighting and glowing windows. Each plane extraction requested reconstructed hidden areas and transparent alpha where appropriate. Generated masters have no embedded ICC profile; runtime WebPs are tagged sRGB. A true 3× source export and source-rights review remain pending.

Approved icons and character originals were neither altered nor replaced. Character loops were inspected and kept out of the runtime scene because their flat finish does not yet match the approved dimensional world.
