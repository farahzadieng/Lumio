import { chromium } from "playwright";
import { writeFile } from "node:fs/promises";

const browser = await chromium.launch({
  headless: true,
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on("pageerror", (error) => errors.push(String(error)));
page.on("response", (response) => {
  if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
});
await page.goto((process.env.LUMIO_URL || "http://127.0.0.1:5173/"));
await page.getByRole("button", { name: "ادامه" }).click();
await page.getByRole("textbox", { name: "نام عادت" }).waitFor({ state: "visible" });

for (const [index, [name, emoji]] of [
  ["مطالعه", "📚"],
  ["آب خوردن", "💧"],
  ["پیاده‌روی", "🚶"],
].entries()) {
  const input = page.getByRole("textbox", { name: "نام عادت" });
  if (index > 0) {
    await page.getByRole("button", { name: "عادت تازه", exact: true }).click();
  }
  await input.fill(name);
  await page.getByRole("button", { name: emoji, exact: true }).click();
  await page.getByRole("button", { name: "ذخیره", exact: true }).click();
}

async function mode(value) {
  await page.getByRole("button", { name: "تنظیمات", exact: true }).click();
  await page.getByRole("button", { name: value, exact: true }).click();
  await page.getByRole("button", { name: "امروز", exact: true }).click();
  await page.waitForTimeout(550);
}

await mode("روز");
await page.screenshot({ path: "test-artifacts/living-v2-day-390x844.png" });
const geometry = await page.evaluate(() => {
  const box = (selector) => document.querySelector(selector)?.getBoundingClientRect().toJSON();
  return {
    world: box(".home-world"),
    habits: box(".today-panel"),
    nav: box(".bottom-nav"),
    thirdHabit: box(".habit-card:nth-child(3)"),
    viewportHeight: innerHeight,
    overflowX: document.documentElement.scrollWidth > innerWidth,
  };
});
await page.getByRole("button", { name: "نوازش گل" }).click();
await page.waitForTimeout(120);
const flowerReaction = await page.locator(".living-flower img").evaluate(
  (element) => getComputedStyle(element).transform,
);
await page.getByRole("button", { name: "موج روی رودخانه" }).click();
await page.waitForTimeout(120);
const riverReaction = await page.locator(".living-river-glint span").evaluate(
  (element) => getComputedStyle(element).transform,
);
await page.getByRole("button", { name: "انجام شد: مطالعه" }).click();
await page.waitForTimeout(650);
const checked = await page.getByRole("button", { name: "بازگردانی: مطالعه" }).count();

await page.getByRole("button", { name: "مسیر من", exact: true }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: "test-artifacts/living-v2-journey-390x844.png" });
await page.getByRole("button", { name: "نگاه من", exact: true }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: "test-artifacts/living-v2-insights-390x844.png" });
await page.getByRole("button", { name: "تنظیمات", exact: true }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: "test-artifacts/living-v2-profile-390x844.png" });

await page.getByRole("button", { name: "شب", exact: true }).click();
await page.getByRole("button", { name: "امروز", exact: true }).click();
await page.waitForTimeout(550);
await page.screenshot({ path: "test-artifacts/living-v2-night-390x844.png" });
await page.setViewportSize({ width: 430, height: 932 });
await page.waitForTimeout(350);
await page.screenshot({ path: "test-artifacts/living-v2-night-430x932.png" });
await page.setViewportSize({ width: 320, height: 690 });
await page.waitForTimeout(350);
await page.screenshot({ path: "test-artifacts/living-v2-night-320x690.png" });
const narrowOverflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
await page.emulateMedia({ reducedMotion: "reduce" });
const reducedCloudAnimation = await page.locator(".cloud-near").evaluate(
  (element) => getComputedStyle(element).animationName,
);

const result = { geometry, flowerReaction, riverReaction, checked, narrowOverflow, reducedCloudAnimation, errors };
await writeFile("test-artifacts/living-v2-results.json", JSON.stringify(result, null, 2));
console.log(result);
await browser.close();
if (
  errors.length ||
  geometry.overflowX ||
  narrowOverflow ||
  geometry.thirdHabit.bottom >= geometry.nav.top ||
  flowerReaction === "none" ||
  flowerReaction === "matrix(1, 0, 0, 1, 0, 0)" ||
  riverReaction === "none" ||
  riverReaction === "matrix(1, 0, 0, 1, 0, 0)" ||
  !checked ||
  reducedCloudAnimation !== "none"
) {
  process.exitCode = 1;
}
