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

Estedad body fonts are hosted locally under the SIL OFL 1.1 (`public/fonts/OFL.txt`). The requested Mad/Dots display variant has not been supplied or verified, so the app does not simulate it.
