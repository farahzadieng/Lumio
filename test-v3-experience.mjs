import { chromium } from "playwright";
import { writeFile } from "node:fs/promises";

const base = process.env.LUMIO_URL || "http://127.0.0.1:5173/";
const browser = await chromium.launch({
  headless: true,
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.setDefaultTimeout(9000);
const errors = [];
page.on("pageerror", (error) => errors.push(String(error)));
page.on("response", (response) => {
  if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
});

await page.goto(base);
await page.getByRole("heading", { name: "یک دنیای کوچک، با سه قدم تو" }).waitFor();
await page.waitForTimeout(1000);
await page.screenshot({ path: "test-artifacts/v3-onboarding-welcome-390.png" });
await page.getByRole("button", { name: "بیایید شروع کنیم" }).click();
await page.locator(".onboarding-cloud-wipe").waitFor();
await page.waitForTimeout(250);
await page.screenshot({ path: "test-artifacts/v3-onboarding-cloud-transition-390.png" });
await page.getByRole("heading", { name: "اولین قدمت چیست؟" }).waitFor();
await page.waitForTimeout(800);
await page.screenshot({ path: "test-artifacts/v3-onboarding-habit-390.png" });

for (const [index, name, symbol] of [
  [1, "مطالعه", "📚"],
  [2, "آب خوردن", "💧"],
  [3, "پیاده‌روی", "🚶"],
]) {
  await page.getByRole("textbox", { name: "نام عادت روزانه" }).fill(name);
  await page.getByRole("button", { name: symbol, exact: true }).click();
  await page.getByRole("button", { name: "ثبت و ادامه" }).click();
  await page.getByText(`${index + 1} / 3`, { exact: true }).first().waitFor({ state: index === 3 ? "hidden" : "visible" }).catch(() => {});
  await page.waitForTimeout(1120);
}
await page.getByRole("heading", { name: "دنیای تو آماده است" }).waitFor();
const summary = await page.locator(".onboarding-summary span").allInnerTexts();
await page.getByRole("button", { name: "ورود به لومیو" }).click();
await page.locator(".today-panel").waitFor();
const peekTransform = await page.locator(".today-panel").evaluate((element) => getComputedStyle(element).transform);
await page.screenshot({ path: "test-artifacts/v3-today-peek-390.png" });
await page.waitForTimeout(2500);
const openTransform = await page.locator(".today-panel").evaluate((element) => getComputedStyle(element).transform);
await page.screenshot({ path: "test-artifacts/v3-today-night-390.png" });
const geometry = await page.evaluate(() => {
  const box = (selector) => document.querySelector(selector)?.getBoundingClientRect().toJSON();
  return {
    scene: box(".home-world"),
    panel: box(".today-panel"),
    nav: box(".bottom-nav"),
    viewportHeight: innerHeight,
    overflow: document.documentElement.scrollWidth > innerWidth,
  };
});
const todayNewHabit = await page.getByRole("button", { name: "عادت تازه", exact: true }).count();
await page.getByRole("button", { name: "جمع کردن عادت‌های امروز" }).click();
await page.waitForTimeout(950);
const collapsedTransform = await page.locator(".today-panel").evaluate((element) => getComputedStyle(element).transform);
await page.getByRole("button", { name: "باز کردن عادت‌های امروز" }).click();
await page.waitForTimeout(950);
await page.getByRole("button", { name: "انجام شد: مطالعه" }).click();
await page.waitForTimeout(170);
await page.screenshot({ path: "test-artifacts/v3-checkin-burst-390.png" });
await page.waitForTimeout(800);
const checked = await page.getByRole("button", { name: "بازگردانی: مطالعه" }).count();

await page.getByRole("button", { name: "تنظیمات", exact: true }).click();
await page.getByRole("button", { name: "روز", exact: true }).click();
await page.getByRole("button", { name: "امروز", exact: true }).click();
await page.waitForTimeout(550);
await page.screenshot({ path: "test-artifacts/v3-today-day-390.png" });
const phoneSizes = [];
for (const [width, height] of [[430, 932], [320, 690]]) {
  await page.setViewportSize({ width, height });
  await page.waitForTimeout(350);
  await page.screenshot({ path: `test-artifacts/v3-today-day-${width}.png` });
  phoneSizes.push(await page.evaluate(() => ({
    width: innerWidth,
    sceneHeight: document.querySelector(".home-world")?.getBoundingClientRect().height,
    overflow: document.documentElement.scrollWidth > innerWidth,
  })));
}
await page.setViewportSize({ width: 390, height: 844 });
const cloudMotion = await page.locator(".cloud-near").evaluate((element) => ({
  name: getComputedStyle(element).animationName,
  direction: getComputedStyle(element).animationDirection,
}));
const mountainMotion = await page.locator(".world-mountains").evaluate((element) => ({
  name: getComputedStyle(element).animationName,
  duration: getComputedStyle(element).animationDuration,
}));
const cloudBefore = await page.locator(".cloud-near").evaluate((element) => getComputedStyle(element).transform);
const mountainBefore = await page.locator(".world-mountains").evaluate((element) => getComputedStyle(element).transform);
await page.waitForTimeout(1150);
const cloudAfter = await page.locator(".cloud-near").evaluate((element) => getComputedStyle(element).transform);
const mountainAfter = await page.locator(".world-mountains").evaluate((element) => getComputedStyle(element).transform);
const ambientMoved = { cloud: cloudBefore !== cloudAfter, mountain: mountainBefore !== mountainAfter };
await page.emulateMedia({ reducedMotion: "reduce" });
await page.waitForTimeout(150);
const reducedAmbient = {
  cloud: await page.locator(".cloud-near").evaluate((element) => getComputedStyle(element).animationName),
  mountain: await page.locator(".world-mountains").evaluate((element) => getComputedStyle(element).animationName),
};
await page.emulateMedia({ reducedMotion: "no-preference" });
await page.getByRole("button", { name: "نگاه من", exact: true }).click();
await page.waitForTimeout(450);
await page.screenshot({ path: "test-artifacts/v3-insights-390.png" });
const insightsNewHabit = await page.getByRole("button", { name: "عادت تازه", exact: true }).count();
const fullSlotsDisabled = await page.getByRole("button", { name: "عادت تازه", exact: true }).isDisabled();
await page.getByRole("button", { name: "تنظیمات", exact: true }).click();
await page.waitForTimeout(450);
await page.screenshot({ path: "test-artifacts/v3-settings-390.png" });
await page.getByRole("button", { name: "بایگانی: مطالعه" }).click();
await page.getByRole("button", { name: "تأیید", exact: true }).click();
await page.getByRole("button", { name: "نگاه من", exact: true }).click();
const freedSlotEnabled = await page.getByRole("button", { name: "عادت تازه", exact: true }).isEnabled();
await page.getByRole("button", { name: "عادت تازه", exact: true }).click();
await page.getByRole("textbox", { name: "نام عادت" }).fill("نقاشی");
await page.getByRole("button", { name: "ذخیره", exact: true }).click();
await page.getByText("نقاشی", { exact: true }).waitFor({ state: "visible" });
const newHabitCreated = await page.getByText("نقاشی", { exact: true }).count();
await page.getByRole("button", { name: "تنظیمات", exact: true }).click();
await page.getByRole("button", { name: "شروع دوباره و حذف همهٔ داده‌ها" }).click();
await page.getByRole("button", { name: "حذف همه و شروع دوباره" }).click();
await page.getByRole("heading", { name: "یک دنیای کوچک، با سه قدم تو" }).waitFor();
const resetCount = await page.evaluate(async () => {
  const request = indexedDB.open("lumio");
  const database = await new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  const transaction = database.transaction(["habits", "completions", "milestones"], "readonly");
  const counts = await Promise.all(["habits", "completions", "milestones"].map((store) => new Promise((resolve, reject) => {
    const count = transaction.objectStore(store).count();
    count.onsuccess = () => resolve(count.result);
    count.onerror = () => reject(count.error);
  })));
  database.close();
  return counts;
});

const reducedPage = await browser.newPage({ viewport: { width: 320, height: 690 }, reducedMotion: "reduce" });
await reducedPage.goto(base);
await reducedPage.getByRole("heading", { name: "یک دنیای کوچک، با سه قدم تو" }).waitFor();
await reducedPage.getByRole("button", { name: "بیایید شروع کنیم" }).click();
const reducedCloudWipe = await reducedPage.locator(".onboarding-cloud-wipe").count();
await reducedPage.screenshot({ path: "test-artifacts/v3-onboarding-reduced-320.png" });
await reducedPage.close();

const result = { summary, peekTransform, openTransform, collapsedTransform, geometry, phoneSizes, todayNewHabit, checked, cloudMotion, mountainMotion, ambientMoved, reducedAmbient, insightsNewHabit, fullSlotsDisabled, freedSlotEnabled, newHabitCreated, resetCount, reducedCloudWipe, errors };
await writeFile("test-artifacts/v3-results.json", JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
await browser.close();
if (errors.length || geometry.overflow || geometry.scene.height < geometry.viewportHeight - 1 || phoneSizes.some((size) => size.overflow || size.sceneHeight < size.width) || !ambientMoved.cloud || !ambientMoved.mountain || reducedAmbient.cloud !== "none" || reducedAmbient.mountain !== "none" || todayNewHabit !== 0 || insightsNewHabit !== 1 || !fullSlotsDisabled || !freedSlotEnabled || !newHabitCreated || checked !== 1 || resetCount.some((count) => count !== 0) || reducedCloudWipe !== 0) process.exitCode = 1;
