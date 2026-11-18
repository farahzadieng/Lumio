# 07 — Acceptance criteria and implementation phases

## P0 — Functional correctness
- Exactly four tabs, correct RTL/LTR, no dead controls.
- Create 0–3 daily habits, 4th blocked; check-in exactly once/day; streak calculation on local days; miss resets only affected streak; graduation on day 21; history persists; slot released.
- Date handling correct across midnight, month/year boundaries, Jalali leap years, DST and travel; no fake date-grid offsets.
- JSON export/import roundtrip, invalid JSON rejected without data loss.
- Offline after first successful installation, no external runtime requests.

## P1 — Visual fidelity
- Today is visibly multi-layered paper world, responsive, with ambient motion and local time-of-day variants including night; world not tied to streak.
- Journey journal, Insights paper charts, Profile stationery settings match design tokens.
- Paper Flip between main tabs, Unfold for forms, Slide for minor panels. RTL direction, focus management, reduced-motion fallbacks.
- Approved icon used without pre-rounded corners; typography uses supplied display face where available.
- paper guest cameo appears at safe anchors if final approved animated assets exist; no false placeholder presented as finished asset.

## P2 — Polish
- At least 4 micro-events and deterministic daily selection; accessible object interactions.
- Smooth animation under mobile CPU budget; no infinite rerenders or severe battery drain.
- Clear onboarding, empty/error states, backup reminder, legible charts, responsive tablet layout.

## Mandatory tests
1. Three habits each at day 20; complete one -> graduation and slot frees; others unaffected.
2. Habit completed day 1 then misses day 2 -> streak zero day 3; old completion history preserved.
3. Same-day double-click and refresh -> one completion only.
4. Undo current-day check-in -> recompute streak safely.
5. Timezones, daylight saving, midnight, 29/30 Esfand, Persian leap years.
6. RTL/LTR switching mid-session, flip direction, keyboard and screen reader.
7. Offline install/reload, all scene assets locally cached, backup export/import.
8. Rapid tab tapping and interrupted Paper Flip does not leave hidden overlay or block UI.
9. `prefers-reduced-motion` disables ambient loops and 3D page flip.
10. No missing asset 404s; every bundled file actually exists.

## Implementation milestones
**M1** architecture, tokens, app shell, local storage, locale and tests.
**M2** habits engine, four functional tabs, calendar and backup.
**M3** living scene, dawn/day/dusk/night, paper components and motion.
**M4** cameo integration (only with approved assets), accessibility, offline PWA and performance.

Each milestone requires a runnable build, tests, screenshots at 320/390/430 widths, and a concise truthful checklist of done vs pending. Do not declare completion from mockups alone.


## Startup / typography acceptance extension

All tests in `docs/13_FONT_DOTS_AND_STARTUP_EXPERIENCE.md` are mandatory for release, including verified Dots availability, fast progressive boot, install guidance, and local-only disclosure.
