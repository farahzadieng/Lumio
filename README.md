# Lumio

Offline-first Persian/English paper-world habit PWA. The day/night art direction was approved on 2026-11-18. This checkout is a functional checkpoint; the remaining art-production work is documented in `art-checkpoint/README.md` and `QA_REPORT.md`.

```bash
npm install
npm run dev
npm run build
npm run test
npm run preview
```

Habit data is stored in browser IndexedDB. Export a JSON backup from Profile before clearing browser data or moving devices. No account or server is used.

The runtime scene uses only new art in `public/art/`. Nothing from `references/REJECTED_V2_ART_DO_NOT_USE/` is imported. Approved icons are copied from `assets/icons/`. Existing character animations remain in `assets/paper-guest/` and are not shown pending visual integration.

Typography uses the user-supplied Bon font files hosted in `public/fonts/`. Inspection found static weights 700 in WOFF2 and 900 in WOFF. A small Unicode-restricted face maps Persian one to the existing vertical-one outline in Bon, preserving Persian text values. `scripts/fix_bon_digit.py` reproduces this compatibility face with fontTools and Brotli. Runtime and build use the committed font files directly.
