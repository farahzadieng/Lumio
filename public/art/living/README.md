# Lumio living object assets

These are new assets created for the approved paper-cut world. None derives from `references/REJECTED_V2_ART_DO_NOT_USE/`.

| Asset | Size | Bytes | Alpha | Runtime role |
| --- | ---: | ---: | --- | --- |
| `drift-cloud.webp` | 1774×887 | 87,190 | RGBA | Two independently timed cloud instances; cloud touch response. |
| `leaf-sprig.webp` | 1312×1199 | 94,926 | RGBA | Two foreground pivoting sprigs. |
| `coral-flower.webp` | 1199×1312 | 93,642 | RGBA | Independently swaying flower and touch/check-in response. |
| `songbird.webp` | 1536×1024 | 77,086 | RGBA | Seeded episodic day event. |
| `butterfly.webp` | 1536×1024 | 56,126 | RGBA | Alternate seeded episodic day event. |

**Source and method:** Generated on 2026-11-19 with the built-in `image_gen` tool, using `art-checkpoint/day-master.png` only as a style reference. Each asset was generated in a separate call with a transparent-background prompt. The prompt set requested one isolated object, premium layered fibrous cardstock, upper-left light, subtle gradients, paper edge highlights and contact shadows; it excluded scenes, text, flat clipart and plastic 3D. PNG results were transcoded lossily to WebP at quality 82 without geometric editing. The original PNG outputs remain in the Codex generated-image directory; these WebPs are the project runtime copies.

**Registration:** These are self-contained overlay objects anchored with CSS in the `home-world` scene. They do not replace the four existing raster planes or imply that the full 60 independently editable object sources exist. Day/night alignment of the underlying planes and source mask cleanup remain release work.

**Rights:** Generated art; final distribution and source-rights review remains pending. Existing approved icons and character files were not modified.

**Visual QA:** `art-checkpoint/living-v2-contact-sheet.png` and `test-artifacts/living-v2-*.png`.
