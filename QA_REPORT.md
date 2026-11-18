# Lumio checkpoint QA — 2026-11-18

## Implemented and observed

- Four primary tabs, Persian RTL and English LTR, with browser hash navigation.
- IndexedDB habit records, unique daily check-ins, independent streak derivation, 21-day graduation, archive, undo confirmation and three active-slot cap.
- Persian Jalali calendar via `@daypicker/persian` and English Gregorian calendar; local Gregorian `YYYY-MM-DD` storage keys.
- Validated JSON export/import with confirmation before replacement.
- First-run local-only data notice, optional Home Screen guidance, offline status, settings and reduced-motion path.
- New day/night world using four raster depth planes each; dawn/dusk graded variants. All 16 runtime WebPs carry an sRGB ICC profile. Day scene files total 366 KB, night 278 KB; dawn 289 KB, dusk 266 KB.
- Approved Lumio icons retained. Eight existing animated WebPs were inspected: 360×360 alpha; 8 frames per state except dance (12). All frames change RGB pixels, but animation is mostly small whole-body movement. Character cameo is deferred because the art does not yet share the approved scene's dimensional finish.

## Tests run

- `npm run build`: passed; initial JS about 515 KB minified / 163 KB gzip, lazy calendar chunk 144 KB / 40 KB gzip; total precache about 2.99 MB. Initial bundle remains above Vite's 500 KB advisory.
- `npm run test`: 8/8 passed, including 21-day graduation of one habit while another remains active, concurrent same-day check-in idempotency, undo, active-slot cap and backup validation.
- Chrome installed locally: 320×690, 375×812, 390×844, 430×932, 844×390 landscape checked. No horizontal overflow in sampled viewports; four nav buttons present; reduced motion yields near-zero CSS animation duration.
- Browser flow: 3/3 active slots disables creation; undo restores the check-in control; JSON download named `lumio-backup-2026-11-18.json`; changing to English sets `dir=ltr`; no external requests or page errors observed.
- Production preview: after Service Worker takes control, offline reload retained the saved habit and loaded the lazy Jalali calendar; no 404s in the tested flow. The first online load itself was not yet controlled by the Service Worker, as expected.
- Actual app screenshots: `test-artifacts/day-390x844.png`, `night-390x844.png`, `day-430x932.png`, `night-430x932.png`, plus dawn/dusk, 320px, four tabs and landscape captures. Night heading contrast was corrected after reviewing screenshots.

## Remaining release work

1. The full 60 independently editable object/layer assets and exact day/night masks are not produced. Four runtime planes per mode show the approved style, but sky cutout source edges and day/night registration need designer-grade cleanup. The editable `.ora` checkpoint files are in `art-checkpoint/`.
2. Bespoke object interaction events, character performance integration and source-level animation rigs are incomplete. The app has gentle plane motion and a completion stamp; it does not claim a 60-part living scene.
3. True Estedad Mad/Dots display file is absent. Standard locally hosted Estedad body weights are used, with OFL notice.
4. Real iOS Safari and Android device profiling, install-flow verification, color-contrast measurement and screen-reader testing are still required.
5. `npm audit` reports 13 advisories (2 moderate, 11 high, 0 critical) in current tooling/transitive dependencies. No safe automatic fix was available during this checkpoint.

## Visual and motion revision — 2026-11-19

The user requested full-screen scenery, a cohesive colorful paper UI, stronger reversible ambient motion, habit emojis, calendar stamps, distinct Insights, and yesterday-only catch-up.

- The living scene now fills the viewport behind all four tabs. Paper colors follow dawn/day/dusk/night, with a crossfade when lighting changes.
- Four cloud regions move independently with alternating 5.4–7.8-second loops. Tree and foreground planes use alternating 5.2- and 3.8-second sways. A masked mountain region moves over 23 seconds. These motions use the current grouped raster planes. Individual leaves remain grouped within those images.
- Every check-in triggers a spring checkmark, emoji reaction and twelve paper petals. Tab transitions use a faster directional perspective turn. Dialogs unfold faster. Reduced motion disables ambient loops and celebration particles.
- Home archive controls moved to Profile. The x/21 counter was removed from home cards. Twelve emoji choices persist with the habit and survive backup export/import. Existing habits without an emoji receive a display fallback.
- Journey stamps each completed task's emoji on its calendar day. A Yesterday shortcut exposes a missing check-in only for yesterday and only after habit creation. Filling yesterday after today recomputes graduation transactionally.
- Insights now uses paper medallions, a seven-day bar chart and individual habit seals. Four primary tabs remain.
- Build passed. All 11 unit/IndexedDB tests passed. Browser tests confirmed three calendar stamps, zero home archive buttons, emoji persistence, yesterday catch-up, no horizontal overflow at 320px, one active page after rapid tab changes, and no page errors or missing requests in the sampled flow.
- Chrome desktop requestAnimationFrame sampling over 90 intervals measured median and 95th percentile around 16.7ms. This is a desktop observation. Physical mobile frame pacing remains unmeasured.
- Production offline reload retained habit data and loaded the calendar after Service Worker control.
- Updated evidence is in `test-artifacts/redesign-*.png`, `redesign-results.json`, and the scripts `test-redesign.mjs`, `test-yesterday.mjs`, `test-motion.mjs`.


## Immersive home and Bon typography — 2026-11-19

- Home header and introductory text were removed. The date floats in a corner. At 390×844 the first habit card starts at y=891, below the initial viewport. Measured card positions also remain below the initial viewport at 320×690 and 844×390. No horizontal overflow was observed.
- Habit panel reveal uses scrolling with spring entry. Each tab retains its scroll position. A test scrolled home to 274px, visited two other tabs, and returned to the same 274px offset.
- Scene touch targets give cloud/foliage feedback using current grouped planes. Forms open as bottom sheets, and dragging the handle 150px dismissed the create form. The active navigation surface moves between tabs with a shared spring transition.
- The Install guide entry was removed from Profile. First-launch install onboarding remains available.
- Supplied `bVF.woff2` has Bon weight 700 and `bVF.woff` has weight 900. Both have no fvar axes. Bon replaces Estedad throughout runtime, including forms and calendars. Former font files were moved to `references/previous-fonts/`.
- The supplied Persian-one glyph has a Latin-like flag. A two-codepoint compatibility face uses the existing vertical-one outline from Bon 700 for U+06F1 and U+0661. Source text remains Persian. Chrome confirmed the actual check-in counter uses `Bon Persian One` for one glyph and `bon SemiBold` for the remaining glyphs. The fix source is `scripts/fix_bon_digit.py`.
- Build and 11 unit/IndexedDB tests passed. Browser checks found zero headers or home h1s, zero Profile install-guide buttons, expected scene reaction transforms, no page errors, and successful offline habit/calendar reload.
- Screenshots and measurements are in `test-artifacts/immersive-*.png` and `immersive-results.json`. Browser automation is in `test-immersive.mjs` and `test-sheet.mjs`.
