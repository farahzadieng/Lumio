# 06 — Library selection and integration policy

## Primary, use by default
- **shadcn/ui** (`https://ui.shadcn.com/`): own editable source components, accessible UI primitives. Theme with Paper tokens. Use for inputs, dialogs, sheets, select, tabs, form controls.
- **Motion for React** (`https://motion.dev/`): primary React UI motion, `AnimatePresence`, layout and microinteractions.
- **GSAP** (`https://gsap.com/`): scoped timelines for Paper Flip, world sequences and coordinated celebrations. Import only where used, kill timelines on unmount.
- **React DayPicker** (`https://daypicker.dev/`): calendar base; use documented Persian calendar support, verify exact installed version and API; style with paper tokens.
- **Dexie** (`https://dexie.org/`): IndexedDB storage and migrations.
- **Tailwind CSS** (`https://tailwindcss.com/`): utility styles and design tokens.

## Selective inspiration/components (not blanket dependencies)
- **Animate UI** `https://animate-ui.com/`: use selected shadcn-compatible animated controls only.
- **React Bits** `https://reactbits.dev/`: limited small visual effects, only when consistent with paper style.
- **Magic UI** `https://magicui.design/`: inspect ideas; do not ship neon/glass effects unchanged.
- **Cult UI** `https://www.cult-ui.com/`: selected cards and transitions after review.
- **Motion Primitives** `https://motion-primitives.com/`: selected content transitions.
- **Animata** `https://animata.design/`: selected accessible animations.
- **AutoAnimate** `https://auto-animate.formkit.com/`: only if Motion layout not already handling same list.

## Policy
Do NOT install all optional libraries. Start with the smallest set. For every third-party snippet/component: verify active maintenance, source, license, dependency graph, accessibility, bundle size, SSR/hydration behavior if relevant, mobile Safari, RTL and offline. Record version and attribution. No CDN scripts, remote font APIs or hosted animation runtime. Do not use a heavy 3D/WebGL engine just for paper-cut effects. No dependency may animate the same DOM property as another animation engine simultaneously. Use package-lock/pnpm lock and run dependency audit.

## Visual adaptation
Every imported component must be reskinned into the Paper design system: matte paper background, tactile shadow, organic radii, soft easing, consistent focus ring, accessible labels. Reject components whose design cannot be made coherent. Do not let a library dictate Lumio's art direction.
