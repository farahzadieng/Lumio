# 13 — FINAL ADDENDUM: Dotted typography, startup, install and local-first disclosure

**Status: binding design/engineering requirement.** Read together with docs/02, docs/05, docs/07. This addendum overrides conflicting font and loading recommendations elsewhere.

## A. Estedad-Mad / Dots

- User preference: the whimsical **Dots** variant of the Estedad-Mad family, if it exists in the actual font release, for decorative headings and short high-impact labels. Do NOT assume `font-variation-settings: "DOTS" 1` works; OpenType axes must be verified in the exact installed font.
- The uploaded `Estedad-Mad.woff2` was inspected with fontTools: family name **Estedad Mad Fat**, style **Regular**, and **no `fvar` variable axes**. This exact supplied file is not a variable font and does not expose a verified Dots axis. Never describe it as a variable Dots font or synthesize an unsupported axis.
- **Implementation gate:** identify the actual Dots font variant/file from the official font source or ask the user to supply it; inspect `name`, `fvar`, GSUB stylistic sets, and license. If Dots is a named static variant, use a separate `@font-face` family; if an actual variable axis exists, use its verified axis tag and supported range. Do not fake the effect with CSS letter-spacing or random dots.
- Use Dots only for short display text, section headings, empty-state hero labels, and celebration numbers *after legibility testing*. Use a conventional legible Persian body face for forms, dates, errors, buttons, accessibility labels, and small UI text. English uses a compatible legible family. Provide fallback fonts and correct RTL numeral shaping.
- Keep font binaries in the user's local project only. This handoff intentionally does **not** redistribute the uploaded font file. Copy it from the original user-supplied file when building the app, and request the true Dots variant if needed.
- Test: Persian diacritics, Arabic/Persian glyph variants, digits, punctuation, long labels, 320px viewport, font-loading fallback, and iOS Safari.

## B. Startup / boot experience

- Create an illustrated **Paper World loading screen** using the approved Lumio icon and a lightweight self-hosted SVG scene. It must render **immediately**, without requiring the full world, GSAP, or character animation to load. Show app name, calm paper-cut motion (small cloud drift or paper leaf bob), accessible progress/status message, and a non-animated fallback for reduced motion.
- **Do not fake percentage progress.** Show measured phases (e.g., 'Preparing your world', 'Opening local journal', 'Loading scenery') or a non-numeric indicator; numeric percentages only when actually measured.
- Start app after minimum critical resources and IndexedDB initialization are ready. Load distant scenery, ambient extras, and character clips **progressively/lazily** after Today is interactive. Never wait for all 60 scene layers or every GIF before allowing user interaction.
- Provide timeout and recovery UI if storage/service worker or a critical asset fails: Retry, Continue with simplified world when safe, and a readable diagnostic. Avoid infinite splash screens. On subsequent launches use a brief splash only if needed; no artificial delay.
- Service worker must cache the offline shell and critical assets; pre-cache responsibly, use versioned assets and update handling, never claim 'fully offline' until the installation/offline flow is verified.

## C. Home Screen / PWA install guidance

- On **first meaningful launch**, offer a friendly, dismissible illustrated onboarding card: 'Add Lumio to your Home Screen for quick access and an app-like experience.' Explain it is **optional**. Do not block the app or show the install card on every launch.
- Android/Chromium: when supported, store `beforeinstallprompt` and show a user-initiated install action. Do not assume event exists.
- iOS Safari: show manual instructions **Share → Add to Home Screen**; browsers/OS versions may differ. There is no guaranteed programmatic iOS install prompt. If already running standalone, suppress install guidance.
- Track dismissal/acknowledgment locally; allow re-opening 'Install Lumio' from Profile. Use the approved icon and a correct web app manifest; verify iOS standalone safe areas and status-bar contrast.

## D. Explicit local-only data promise

- On the same onboarding card or the next short slide, explain clearly in Persian and English: 'Your habits and history are stored on this device, in this browser/app. No account, cloud sync, or server is used. You can export and import a backup file.'
- Important warning: uninstalling, clearing browser/site data, changing browsers/devices, or private browsing may remove or isolate data. **Export a backup regularly.** Do not claim data survives uninstall, is encrypted, or is automatically synced unless implemented and tested.
- Distinguish the initial download/install (may require internet) from subsequent verified offline use. No remote analytics, remote fonts, external animation CDN, or data uploads by default.
- Provide an explicit 'Export backup' call to action in onboarding/Profile and a local reminder setting; JSON import must validate schema/version, preview consequences, and confirm before overwrite.
- Accessibility: keyboard/focus management, screen-reader labels, visible skip/continue, localization, reduced motion, adequate contrast, and no flashing loading loop.

## E. Acceptance tests (must pass)

1. Inspect actual font: `fvar` absent for supplied Estedad Mad Fat; app must not advertise a nonexistent Dots variable axis. True Dots variant used only when verified/supplied.
2. First cold launch: lightweight loader appears before full world; app becomes interactive before optional art loads; offline repeat launch succeeds after installation.
3. Simulated slow network: honest phase statuses, no fake 0–100 progress, recovery from failed optional artwork.
4. iOS Safari: manual Add to Home Screen instructions; standalone launch hides prompt; dismissal persists.
5. Chromium: install button only when `beforeinstallprompt` is actually available.
6. Clear local-only notice, data-loss warning, working export/import, no outbound user-data requests.
7. RTL Persian and LTR English layouts, reduced motion and 320px screens work.
