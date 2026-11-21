import Dexie, { type Table } from "dexie";
import {
  defaultSettings,
  dayKey,
  shiftDay,
  currentStreak,
  shouldGraduate,
  type Completion,
  type Habit,
  type Milestone,
  type Settings,
} from "./habits";
export class LumioDB extends Dexie {
  habits!: Table<Habit, string>;
  completions!: Table<Completion, string>;
  milestones!: Table<Milestone, string>;
  settings!: Table<Settings, string>;
  constructor() {
    super("lumio");
    this.version(1).stores({
      habits: "id,status,startDayKey",
      completions: "id,&[habitId+dayKey],habitId,dayKey",
      milestones: "id,habitId,dayKey",
      settings: "id",
    });
  }
}
export const db = new LumioDB();
export async function initDB() {
  await db.open();
  if (!(await db.settings.get("main"))) await db.settings.put(defaultSettings);
}
export async function updateSettings(patch: Partial<Settings>) {
  await db.settings.update("main", patch);
}
export async function resetAllData() {
  await db.transaction(
    "rw",
    db.habits,
    db.completions,
    db.milestones,
    db.settings,
    async () => {
      await db.habits.clear();
      await db.completions.clear();
      await db.milestones.clear();
      await db.settings.clear();
      await db.settings.put(defaultSettings);
    },
  );
}
export async function createHabit(title: string, note = "", emoji = "🌱") {
  const clean = title.trim();
  if (!clean || clean.length > 80)
    throw new Error("Title must be 1–80 characters");
  return db.transaction("rw", db.habits, async () => {
    if ((await db.habits.where("status").equals("active").count()) >= 3)
      throw new Error("All three focus slots are full");
    const now = new Date();
    const habit: Habit = {
      id: crypto.randomUUID(),
      title: clean,
      emoji: emoji.slice(0, 16),
      note: note.trim().slice(0, 300),
      createdAtISO: now.toISOString(),
      startDayKey: dayKey(now),
      status: "active",
    };
    await db.habits.add(habit);
    return habit;
  });
}
export async function checkIn(habitId: string, today = dayKey()) {
  return db.transaction(
    "rw",
    db.habits,
    db.completions,
    db.milestones,
    async () => {
      const habit = await db.habits.get(habitId);
      if (!habit || habit.status !== "active")
        throw new Error("Habit is not active");
      if (today < habit.startDayKey)
        throw new Error("Cannot check in before habit creation");
      const currentDay = dayKey();
      if (today !== currentDay && today !== shiftDay(currentDay, -1))
        throw new Error("Only today or yesterday can be checked in");
      const existing = await db.completions
        .where("[habitId+dayKey]")
        .equals([habitId, today])
        .first();
      if (existing) return { completion: existing, graduated: false };
      const now = new Date();
      const completion: Completion = {
        id: crypto.randomUUID(),
        habitId,
        dayKey: today,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown",
        createdAtISO: now.toISOString(),
      };
      await db.completions.add(completion);
      const days = (
        await db.completions.where("habitId").equals(habitId).toArray()
      ).map((c) => c.dayKey);
      const graduationDay = days.includes(currentDay) ? currentDay : today;
      const graduated = shouldGraduate(habit, days, graduationDay);
      if (graduated) {
        await db.habits.update(habitId, {
          status: "graduated",
          graduatedDayKey: graduationDay,
        });
        await db.milestones.add({
          id: crypto.randomUUID(),
          habitId,
          type: "graduation",
          dayKey: graduationDay,
          createdAtISO: now.toISOString(),
        });
      }
      return { completion, graduated };
    },
  );
}
export async function undoToday(habitId: string) {
  const today = dayKey();
  return db.transaction(
    "rw",
    db.habits,
    db.completions,
    db.milestones,
    async () => {
      const habit = await db.habits.get(habitId);
      if (!habit) throw new Error("Habit not found");
      if (habit.status === "graduated")
        throw new Error("Graduation needs separate review");
      const row = await db.completions
        .where("[habitId+dayKey]")
        .equals([habitId, today])
        .first();
      if (row) await db.completions.delete(row.id);
      return currentStreak(
        habit,
        (await db.completions.where("habitId").equals(habitId).toArray()).map(
          (c) => c.dayKey,
        ),
        today,
      );
    },
  );
}
export async function archiveHabit(id: string) {
  await db.habits.update(id, {
    status: "archived",
    archivedAtISO: new Date().toISOString(),
  });
}
