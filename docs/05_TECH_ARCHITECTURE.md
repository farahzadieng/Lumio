# 05 — Implementation architecture

## Target
React + TypeScript + Vite + Tailwind + shadcn/ui; Motion; selective GSAP; DayPicker Persian/Gregorian; Dexie IndexedDB; Vite PWA/Workbox or equivalent; Vitest and Playwright. Deploy static assets to Cloudflare Workers Static Assets or another static host. No server/API required for MVP. Everything needed for basic app usage must work offline after first install. Do not fetch JS/WASM/fonts/images from CDNs at runtime.

## Suggested modules
```
src/app/{router,providers,locales,theme}/
src/features/habits/{model,repository,logic,components}/
src/features/world/{scene,layers,events,character,anchors}/
src/features/calendar/{jalali,gregorian,components}/
src/features/backup/{export,import,validation}/
src/features/insights/{selectors,charts}/
src/components/paper/{Button,Input,Textarea,DatePicker,Dialog,Sheet,Navigation,Progress,Toast}/
src/styles/{tokens,typography,motion,global}.css
public/assets/{world,props,icons,character}/
```

## Data model (guidance)
```
Habit {id: UUID, title, note?, icon?, color?, createdAtISO, startDayKey, status:'active'|'graduated'|'archived', graduatedDayKey?, archivedAtISO?}
Completion {id, habitId, dayKey:'YYYY-MM-DD', timeZone, createdAtISO}
Milestone {id, habitId, type:'graduation', dayKey, createdAtISO}
Settings {locale:'fa'|'en', sceneMode:'auto'|'dawn'|'day'|'dusk'|'night', reducedMotionOverride?, sceneSeed, backupReminderAt?}
```
Unique compound index on `Completion(habitId,dayKey)`. Transactions for completion+graduation; re-evaluate streak from records, not an untrusted local counter. Export backup schema version, app version, timestamp, habits, completions, milestones, settings; validate on import with safe preview and replace/merge policy. Reject invalid/corrupt backup and preserve existing data. No remote upload.

## Calendar
Display Persian calendar in fa and Gregorian in en. Use a verified DayPicker Persian implementation, checking correct Jalali leap year/month lengths and Saturday-first layout; never approximate Esfand with 29 fixed days. Store local Gregorian ISO date keys internally. Use locale-aware formatting and a reliable Jalali conversion library/DayPicker adapter. Do not mix Unix UTC timestamps with local day boundaries. Handle DST/timezone transitions and travel tests. English LTR and Persian RTL switch dynamically; direction-sensitive icons, flips and typography must adapt.

## Scene lifecycle
Keep Today scene state stable across tab navigation (scene seed, selected daily event, time mode), pause ambient animation when not visible. Do not reroll cameos on every render. Consider dynamic import of scene and animation modules for performance. Avoid entire React tree rerenders every animation frame. Preload only visible world assets and lazy-load night variants/optional character moods.

## Offline and deployment
Manifest: app name Lumio, theme/background colors, standalone, icons 192/512, iOS touch icon, correct start_url/scope. Test maskable safe-zone separately (approved icon must not be pre-rounded). Cache app shell, local art, animation assets, fonts and runtime. Version caches safely; never clear IndexedDB on app update. Show offline status if relevant, but no login needed. Browser storage may be evicted: backup/export is first-class, explain privacy and data loss risk. Avoid claiming background notifications or sync.

## Error and resilience
Recover from IndexedDB failures with clear error states; avoid silent data loss. Protect destructive actions. Import JSON with strict schema, size limits, duplicate checks, and sanitized text rendering (no HTML injection). Do not execute code from backup data. Escape user-generated habit names. Apply CSP appropriate for static hosting.

## QA
Unit test pure date/streak functions and backup validation. Integration test create/check/undo/graduate/archive. E2E test four tabs, RTL/LTR, calendar, keyboard, mobile safe areas, offline reload, PWA install, reduced motion, interrupted page transitions. Performance test on real iPhone Safari and midrange Android. Provide build/test scripts and report actual results.
