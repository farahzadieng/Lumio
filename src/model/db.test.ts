import "fake-indexeddb/auto";
import { beforeEach, afterAll, describe, it, expect } from "vitest";
import { db, initDB, createHabit, checkIn, undoToday, resetAllData, updateSettings } from "./db";
import { dayKey, shiftDay, currentStreak } from "./habits";
import { makeBackup, validateBackup, importBackup } from "./backup";
const now = new Date();
beforeEach(async () => {
  await initDB();
  await Promise.all([
    db.habits.clear(),
    db.completions.clear(),
    db.milestones.clear(),
  ]);
});
afterAll(async () => {
  await db.delete();
});
describe("IndexedDB habit transactions", () => {
  it("limits active focus habits to three", async () => {
    await createHabit("One");
    await createHabit("Two");
    await createHabit("Three");
    await expect(createHabit("Four")).rejects.toThrow("three");
    expect(await db.habits.count()).toBe(3);
  });
  it("is idempotent for same-day checks and recalculates undo", async () => {
    const h = await createHabit("Read");
    await Promise.all([checkIn(h.id), checkIn(h.id)]);
    expect(await db.completions.count()).toBe(1);
    await undoToday(h.id);
    expect(await db.completions.count()).toBe(0);
    expect(currentStreak(h, [], dayKey())).toBe(0);
  });
  it("graduates just one habit on day 21, retaining others and history", async () => {
    const h = await createHabit("Read"),
      other = await createHabit("Walk");
    const today = dayKey();
    await db.habits.update(h.id, { startDayKey: shiftDay(today, -20) });
    for (let i = 20; i >= 1; i--) {
      const key = shiftDay(today, -i);
      await db.completions.add({
        id: crypto.randomUUID(),
        habitId: h.id,
        dayKey: key,
        timeZone: "Asia/Tehran",
        createdAtISO: now.toISOString(),
      });
    }
    await checkIn(other.id);
    const result = await checkIn(h.id);
    expect(result.graduated).toBe(true);
    expect((await db.habits.get(h.id))?.status).toBe("graduated");
    expect((await db.habits.get(other.id))?.status).toBe("active");
    expect(await db.completions.where("habitId").equals(h.id).count()).toBe(21);
    expect(await db.milestones.count()).toBe(1);
    await createHabit("New slot");
  });
  it("validates backups before replacing records", async () => {
    await createHabit("Read");
    const good = await makeBackup();
    expect(() =>
      validateBackup({
        ...good,
        completions: [{ id: "bad", habitId: "missing", dayKey: dayKey() }],
      }),
    ).toThrow();
    expect(await db.habits.count()).toBe(1);
    await importBackup(validateBackup(good));
    expect(await db.habits.count()).toBe(1);
  });

  it("persists emoji and accepts yesterday exactly once", async () => {
    const habit = await createHabit("Read", "", "📚");
    const yesterday = shiftDay(dayKey(), -1);
    await db.habits.update(habit.id, { startDayKey: yesterday });
    await Promise.all([
      checkIn(habit.id, yesterday),
      checkIn(habit.id, yesterday),
    ]);
    expect((await db.habits.get(habit.id))?.emoji).toBe("📚");
    expect(await db.completions.count()).toBe(1);
    await expect(checkIn(habit.id, shiftDay(dayKey(), -2))).rejects.toThrow();
    await expect(checkIn(habit.id, shiftDay(dayKey(), 1))).rejects.toThrow();
  });
  it("repairs the streak when yesterday is checked after today", async () => {
    const habit = await createHabit("Read");
    const today = dayKey();
    await db.habits.update(habit.id, { startDayKey: shiftDay(today, -20) });
    for (let offset = 20; offset >= 2; offset--)
      await db.completions.add({
        id: crypto.randomUUID(),
        habitId: habit.id,
        dayKey: shiftDay(today, -offset),
        timeZone: "Asia/Tehran",
        createdAtISO: now.toISOString(),
      });
    expect((await checkIn(habit.id)).graduated).toBe(false);
    expect((await checkIn(habit.id, shiftDay(today, -1))).graduated).toBe(true);
    expect((await db.habits.get(habit.id))?.graduatedDayKey).toBe(today);
    expect(await db.milestones.count()).toBe(1);
  });
  it("roundtrips emoji and supports older backups without emoji", async () => {
    await createHabit("Read", "", "📚");
    const backup = await makeBackup();
    expect(validateBackup(backup).habits[0].emoji).toBe("📚");
    delete backup.habits[0].emoji;
    expect(validateBackup(backup).habits[0].emoji).toBeUndefined();
  });
  it("resets habits, history, milestones, and onboarding settings together", async () => {
    const habit = await createHabit("Read");
    await checkIn(habit.id);
    await updateSettings({ onboarded: true, locale: "en" });
    await resetAllData();
    expect(await db.habits.count()).toBe(0);
    expect(await db.completions.count()).toBe(0);
    expect(await db.milestones.count()).toBe(0);
    expect(await db.settings.count()).toBe(1);
    expect(await db.settings.get("main")).toMatchObject({
      onboarded: false,
      locale: "fa",
    });
  });
});
