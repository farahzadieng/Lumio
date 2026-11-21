# 18 — Full-screen Today and onboarding checkpoint

**Date:** 2026-11-22 (Asia/Tehran). This checkpoint implements the user's nine requested interaction and layout changes using the approved Lumio art. It does not declare the full 60-object art system finished.

## Changes

1. Today now places the existing paper world across the full viewport behind the bottom navigation and task drawer. The backdrop measured 390×844, 430×932 and 320×690 in browser screenshots.
2. The Today drawer starts as a visible bottom peek. After 1.6 seconds it rises over 0.85 seconds; the grip can collapse/reopen it, and swiping upward on the scene opens it sooner. Compact screens scroll inside the drawer.
3. Two independently timed paper clouds move back and forth over 19 and 26 seconds. The masked distant mountain band moves vertically by roughly 5 px over 33 seconds. Existing raster base remains beneath it to prevent gaps.
4. Leaves, flower, river glint and night window have restrained ambient loops. A day-key seeded bird or butterfly passes episodically during day modes.
5. Successful check-in triggers a local paper-petal seal burst, card change, short global celebration and scene flower response. The database write completes before success feedback.
6. A confirmed reset in Profile clears habits, completions, milestones and settings transactionally, removes Lumio local preferences, then reloads the first-run flow. Installed app assets remain cached so the offline shell is retained.
7. Today no longer offers `+ New habit`; Insights contains the action, disabled at 3 active habits and enabled when a slot opens.
8. First launch uses a five-stage illustrated experience: welcome/language/local-data notice, three guided habit steps, and a finish/install note. Full Persian/English text appears with a writing reveal; layered paper clouds cross the screen between stages. The three habit steps collect the three initial daily tasks; later replacement habits are added from Insights when a slot opens.
9. Reduced-motion mode removes ambient loops and the cloud wipe, using short/no transitions instead.

## Browser evidence

- `npm run build`: passed. Initial JavaScript 539.62 KB minified / 172.33 KB gzip; Vite's >500 KB advisory remains. PWA precache 59 entries, 3,089.76 KiB.
- `npm test`: 12/12 passed, including a reset transaction test.
- `LUMIO_URL=http://127.0.0.1:5177/ node test-v3-experience.mjs`: passed in local Chrome. The scene filled each viewport; no horizontal overflow or HTTP ≥400/page errors occurred. The drawer transform changed from 214 px (peek) to 0 (raised) and back. Cloud and mountain computed transforms both changed over observation; both animation names became `none` with reduced motion.
- The same flow created three onboarding habits, checked one, confirmed that Today had zero New Habit buttons, verified Insights' New Habit action was blocked at 3/3 and enabled after archiving, created a replacement habit, then reset the app. Post-reset counts for habits/completions/milestones were all zero and onboarding reappeared.
- English first-run screens were checked at 320×690: LTR direction and no horizontal overflow.

## Screenshots

- Full-screen Today: `test-artifacts/v3-today-peek-390.png`, `v3-today-day-390.png`, `v3-today-night-390.png`, `v3-today-day-430.png`, `v3-today-day-320.png`.
- New onboarding: `test-artifacts/v3-onboarding-welcome-390.png`, `v3-onboarding-cloud-transition-390.png`, `v3-onboarding-habit-390.png`, `v3-onboard-english-320.png`, `v3-onboard-habit-english-320.png`.
- Check-in and controls: `test-artifacts/v3-checkin-burst-390.png`, `v3-insights-390.png`, `v3-settings-390.png`.
- Machine-readable result: `test-artifacts/v3-results.json`.

## Remaining QA

- Physical iOS Safari and Android device motion, battery, memory, safe-area and install-flow checks are still required.
- The approved scene remains based on four grouped raster planes per time mode. The independent 60-object source system and exact night/day mask registration remain unfinished.
- The first-load bundle still exceeds Vite's advisory threshold; code splitting of noncritical app sections is future performance work.
