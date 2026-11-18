# 01 — Product specification & rules

## Vision
Lumio is a mobile-first, bilingual, offline-first daily habit PWA experienced as a **Living Paper Storybook**. The Today scene is an intrinsically beautiful, living, discoverable paper world. Its visual health must **never** be a punishment or progress meter. Delight is separate from achievement.

## Main navigation
Exactly four primary tabs: **Today** (living scene and daily check-ins), **Journey** (calendar, history, milestones), **Insights** (statistics), **Profile** (settings, language, backup and privacy). Other views (habit creation/edit, confirmation, onboarding) are modal/stack routes, not fifth tabs.

## Core habits — confirmed
- At most **three concurrently active focus habits**.
- All habits are **daily**, not selected weekdays.
- Each needs **21 consecutive successful local calendar days** to graduate.
- Each habit has its own streak and misses do not affect other habits.
- One check-in per habit per day; double taps do not double-count.
- A missed required day resets the current streak to **0** at the first evaluation after that day closes. Preserve past completion records and past best streak; do not erase history.
- On the 21st successful consecutive day, the habit graduates, remains in history, and releases a focus slot.
- At 3/3 slots, disable creating another focus habit with helpful explanation.
- The world is **not** rebuilt, ruined or withered by streak changes. Completion may trigger a transient positive scene reaction.
- No shop, currency, quests or global world-level score in MVP.

## Operational rules (implementation defaults; product owner can revise)
- Use the user's **local calendar day**, not UTC midnight. Store stable `YYYY-MM-DD` local-day keys and an IANA timezone snapshot for each event.
- Day begins at local 00:00; a missed day is assessed when a later day begins/opens. No grace window by default.
- Habit created today may be checked today. A habit without a check-in on its creation day becomes a missed day on the next day, unless product owner changes this rule.
- Undo today's completion is allowed with explicit confirmation; recalculate streak and graduation transactionally. For completed/graduated habits, do not silently undo historical milestones.
- User revision, 2026-11-19: a missed check-in may be added for yesterday only, from Journey. Earlier days and future dates are read-only. The habit must already have existed on that day. Recalculate streak and graduation transactionally, including when today was completed before yesterday.
- A user can archive an active habit; archiving does not count as graduation. Confirm before destructive actions.
- A habit's streak is derived from ordered daily completion records rather than increment-only counters. Idempotent completion writes use unique `(habitId, dayKey)`.
- On timezone travel, do not award multiple days automatically. Use the stored local-day key for an event and evaluate today using current timezone; document boundary behavior and test it.
- For streak = 21, graduation occurs in same transaction as the final check-in. Keep lifetime completion and graduation record.
- Quantified/timer habits are NOT in MVP; a habit is a single daily yes/no commitment. Optional title, note, icon/color.

## UX content
- Friendly and supportive, never shame user for a missed day. Persian copy should be natural and respectful. English copy should be equally polished.
- Onboarding: welcome; 3 habits/21-day explanation; choose language; create first habit; explain offline/local data and backup.
- Empty states: 0 habits, 1–2 habits, all completed today, no history, no analytics, full 3 slots, backup import error.
- Accessibility: semantic inputs, focus order, keyboard support, 44x44px minimum tap targets, screen-reader labels, reduced motion, adequate contrast.

## Scope boundaries
No account/login, cloud sync, social feed, push notifications, ads, subscriptions, backend, remote AI generation or gamified punishment in MVP. No requirement for live weather API. Day/night is based on local clock, not device geolocation.
