export type HabitStatus = "active" | "graduated" | "archived";
export type Habit = {
  id: string;
  title: string;
  note: string;
  emoji?: string;
  createdAtISO: string;
  startDayKey: string;
  status: HabitStatus;
  graduatedDayKey?: string;
  archivedAtISO?: string;
};
export type Completion = {
  id: string;
  habitId: string;
  dayKey: string;
  timeZone: string;
  createdAtISO: string;
};
export type Milestone = {
  id: string;
  habitId: string;
  type: "graduation";
  dayKey: string;
  createdAtISO: string;
};
export type Locale = "fa" | "en";
export type SceneMode = "auto" | "dawn" | "day" | "dusk" | "night";
export type Settings = {
  id: "main";
  locale: Locale;
  sceneMode: SceneMode;
  onboarded: boolean;
  installDismissed: boolean;
  backupReminder: boolean;
};
export const defaultSettings: Settings = {
  id: "main",
  locale: "fa",
  sceneMode: "auto",
  onboarded: false,
  installDismissed: false,
  backupReminder: true,
};
export function dayKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function shiftDay(key: string, offset: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + offset));
  return date.toISOString().slice(0, 10);
}
export function currentStreak(
  habit: Habit,
  completedDays: string[],
  today: string,
): number {
  const days = new Set(completedDays);
  let cursor = today;
  if (!days.has(cursor)) cursor = shiftDay(cursor, -1);
  if (!days.has(cursor)) return 0;
  let n = 0;
  while (cursor >= habit.startDayKey && days.has(cursor)) {
    n++;
    cursor = shiftDay(cursor, -1);
  }
  return n;
}
export function completedOn(
  habitId: string,
  day: string,
  items: Completion[],
): boolean {
  return items.some((c) => c.habitId === habitId && c.dayKey === day);
}
export function lifetimeCount(habitId: string, items: Completion[]): number {
  return items.filter((c) => c.habitId === habitId).length;
}
export function bestStreak(habit: Habit, days: string[]): number {
  const ordered = [
    ...new Set(days.filter((d) => d >= habit.startDayKey)),
  ].sort();
  let best = 0,
    run = 0,
    prev = "";
  for (const day of ordered) {
    run = prev && shiftDay(prev, 1) === day ? run + 1 : 1;
    best = Math.max(best, run);
    prev = day;
  }
  return best;
}
export function shouldGraduate(
  habit: Habit,
  days: string[],
  today: string,
): boolean {
  return (
    habit.status === "active" &&
    days.includes(today) &&
    currentStreak(habit, days, today) >= 21
  );
}
