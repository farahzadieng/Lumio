# Lumio interactive prototype v0.3

This is a dependency-free, browser-based design and interaction prototype, **not** the production React/PWA application.

## Run
Unzip and serve the directory locally: `python3 -m http.server 8000`, then visit `http://localhost:8000/`.

## Included
- Four navigable tabs, paper-like page-flip animation, ambient scene movement, responsive paper UI, add-habit unfolding sheet.
- Three daily habits maximum, one completion per day, 21-day consecutive streak, missed-day reset (current in-progress history clears), graduation and slot freeing.
- LocalStorage persistence, basic statistics, illustrative **Gregorian** month calendar, JSON backup/import.
- Original layered SVG assets and approved icon.

## Not yet implemented
- Actual paper Sobo guest animations (the emoji is only a placeholder), sophisticated GSAP timeline, real Jalali calendar date picker, English UI, React/shadcn, IndexedDB/Dexie, service worker/offline installability, production-ready backup schema validation, full streak timezone policies, polished accessibility and E2E tests.
- The user's uploaded display font is deliberately not redistributed in this prototype. It can be incorporated into the user's private build after verifying licensing and exact font weights.

## Caveats
- LocalStorage data is device/browser-local. Clearing browser data removes it unless exported.
- Do not use this prototype for production habit tracking without date/timezone, migration and backup hardening.
