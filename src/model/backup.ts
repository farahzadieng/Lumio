import { db } from "./db";
import {
  type Habit,
  type Completion,
  type Milestone,
  type Settings,
} from "./habits";
export type Backup = {
  schemaVersion: 1;
  exportedAtISO: string;
  appVersion: string;
  habits: Habit[];
  completions: Completion[];
  milestones: Milestone[];
  settings: Settings;
};
export async function makeBackup(): Promise<Backup> {
  return {
    schemaVersion: 1,
    exportedAtISO: new Date().toISOString(),
    appVersion: "0.1.0",
    habits: await db.habits.toArray(),
    completions: await db.completions.toArray(),
    milestones: await db.milestones.toArray(),
    settings: (await db.settings.get("main"))!,
  };
}
function isDayKey(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;
  const [y, m, d] = value.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toISOString().slice(0, 10) === value;
}
function isISO(value: unknown): value is string {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}
export function validateBackup(raw: unknown): Backup {
  if (!raw || typeof raw !== "object") throw new Error("Invalid backup");
  const b = raw as Record<string, unknown>;
  if (
    b.schemaVersion !== 1 ||
    !Array.isArray(b.habits) ||
    !Array.isArray(b.completions) ||
    !Array.isArray(b.milestones) ||
    !b.settings ||
    typeof b.settings !== "object" ||
    !isISO(b.exportedAtISO)
  )
    throw new Error("Unsupported or incomplete backup");
  const ids = new Set<string>();
  const habits = new Map<string, Habit>();
  let active = 0;
  for (const h of b.habits) {
    if (
      !h ||
      typeof h !== "object" ||
      typeof h.id !== "string" ||
      !h.id ||
      typeof h.title !== "string" ||
      !h.title.trim() ||
      h.title.length > 80 ||
      (h.emoji !== undefined &&
        (typeof h.emoji !== "string" || h.emoji.length > 16)) ||
      typeof h.note !== "string" ||
      h.note.length > 300 ||
      !["active", "graduated", "archived"].includes(h.status) ||
      !isDayKey(h.startDayKey) ||
      !isISO(h.createdAtISO) ||
      ids.has(h.id)
    )
      throw new Error("Invalid habit");
    ids.add(h.id);
    habits.set(h.id, h);
    if (h.status === "active") active++;
  }
  if (active > 3) throw new Error("Too many active habits");
  const pairs = new Set<string>();
  const completionIds = new Set<string>();
  for (const c of b.completions) {
    if (
      !c ||
      typeof c !== "object" ||
      typeof c.id !== "string" ||
      !c.id ||
      completionIds.has(c.id) ||
      !habits.has(c.habitId) ||
      !isDayKey(c.dayKey) ||
      c.dayKey < habits.get(c.habitId)!.startDayKey ||
      typeof c.timeZone !== "string" ||
      !isISO(c.createdAtISO)
    )
      throw new Error("Invalid completion");
    const pair = `${c.habitId}:${c.dayKey}`;
    if (pairs.has(pair)) throw new Error("Duplicate completion");
    pairs.add(pair);
    completionIds.add(c.id);
  }
  const milestoneIds = new Set<string>();
  for (const m of b.milestones) {
    if (
      !m ||
      typeof m !== "object" ||
      typeof m.id !== "string" ||
      !m.id ||
      milestoneIds.has(m.id) ||
      !ids.has(m.habitId) ||
      m.type !== "graduation" ||
      !isDayKey(m.dayKey) ||
      !isISO(m.createdAtISO)
    )
      throw new Error("Invalid milestone");
    milestoneIds.add(m.id);
  }
  const s = b.settings as Record<string, unknown>;
  if (
    s.id !== "main" ||
    !["fa", "en"].includes(String(s.locale)) ||
    !["auto", "dawn", "day", "dusk", "night"].includes(String(s.sceneMode)) ||
    typeof s.onboarded !== "boolean" ||
    typeof s.installDismissed !== "boolean" ||
    typeof s.backupReminder !== "boolean"
  )
    throw new Error("Invalid settings");
  return b as Backup;
}
export async function importBackup(b: Backup) {
  await db.transaction(
    "rw",
    db.habits,
    db.completions,
    db.milestones,
    db.settings,
    async () => {
      await Promise.all([
        db.habits.clear(),
        db.completions.clear(),
        db.milestones.clear(),
        db.settings.clear(),
      ]);
      await db.habits.bulkAdd(b.habits);
      await db.completions.bulkAdd(b.completions);
      await db.milestones.bulkAdd(b.milestones);
      await db.settings.add(b.settings);
    },
  );
}
export function downloadBackup(b: Backup) {
  const blob = new Blob([JSON.stringify(b, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `lumio-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
