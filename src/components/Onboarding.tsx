import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { createHabit, updateSettings } from "../model/db";
import type { Habit, Locale } from "../model/habits";

const choices = ["🌱", "📚", "🚶", "💧", "🧘", "✍️", "🎨", "🌸"];
const words = {
  fa: {
    welcome: "یک دنیای کوچک، با سه قدم تو",
    intro: "سه عادت روزانه انتخاب کن. هر کدام مسیر ۲۱ روزهٔ خودش را دارد.",
    first: "اولین قدمت چیست؟",
    second: "قدم دوم را انتخاب کن",
    third: "و یک قدم کوچک دیگر",
    hint: "نام کوتاه و روشن انتخاب کن؛ مثل «کتاب خواندن».",
    habit: "نام عادت روزانه",
    symbol: "نشان عادت",
    next: "ثبت و ادامه",
    start: "بیایید شروع کنیم",
    done: "دنیای تو آماده است",
    doneHint: "هر روز می‌توانی قدم‌هایت را در همین دنیا ثبت کنی.",
    enter: "ورود به لومیو",
    data: "عادت‌ها و سابقه فقط در این دستگاه و مرورگر ذخیره می‌شوند. حساب یا همگام‌سازی ابری نداریم. پاک‌کردن داده‌ها، حذف برنامه یا تعویض دستگاه ممکن است آن‌ها را از بین ببرد؛ از تنظیمات خروجی پشتیبان بگیر.",
    install: "افزودن به صفحهٔ اصلی اختیاری است. در Safari از اشتراک‌گذاری ← افزودن به صفحهٔ اصلی استفاده کن.",
    installAction: "افزودن به صفحهٔ اصلی",
    count: "عادت",
  },
  en: {
    welcome: "A little world, shaped by your steps",
    intro: "Choose three daily habits. Each has its own 21-day journey.",
    first: "What is your first step?",
    second: "Choose your second step",
    third: "And one more small step",
    hint: "Give it a short, clear name, like “Read a book”.",
    habit: "Daily habit name",
    symbol: "Habit symbol",
    next: "Save and continue",
    start: "Let's begin",
    done: "Your world is ready",
    doneHint: "Return each day to mark your steps in this world.",
    enter: "Enter Lumio",
    data: "Habits and history stay in this browser on this device. There is no account or cloud sync. Clearing data, uninstalling, or changing devices may erase them; export a backup from Settings.",
    install: "Adding Lumio to your Home Screen is optional. In Safari, use Share → Add to Home Screen.",
    installAction: "Add to Home Screen",
    count: "habits",
  },
};

export default function Onboarding({
  locale,
  habits,
  reduced,
  onFinish,
  canInstall,
  onInstall,
}: {
  locale: Locale;
  habits: Habit[];
  reduced: boolean;
  onFinish: () => Promise<void>;
  canInstall: boolean;
  onInstall: () => Promise<void>;
}) {
  const [step, setStep] = useState(() => {
    const saved = Number(localStorage.getItem("lumio-onboarding-step"));
    return Number.isInteger(saved) && saved >= 0 && saved <= 4 ? saved : 0;
  });
  const [title, setTitle] = useState("");
  const [emoji, setEmoji] = useState("🌱");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [wiping, setWiping] = useState(false);
  const timers = useRef<number[]>([]);
  const text = words[locale];

  useEffect(() => {
    if (habits.length > 0 && !busy && !wiping)
      setStep((current) => Math.max(current, Math.min(4, habits.length + 1)));
  }, [habits.length, busy, wiping]);
  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), []);

  function advance(next: number) {
    if (busy || wiping) return;
    const go = () => {
      setStep(next);
      localStorage.setItem("lumio-onboarding-step", String(next));
      setTitle("");
      setEmoji("🌱");
    };
    if (reduced) {
      go();
      return;
    }
    setWiping(true);
    timers.current.push(window.setTimeout(go, 430));
    timers.current.push(window.setTimeout(() => setWiping(false), 1050));
  }

  async function saveHabit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || busy || wiping) return;
    setBusy(true);
    setError("");
    try {
      await createHabit(title, "", emoji);
      setBusy(false);
      advance(step + 1);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
      setBusy(false);
    }
  }

  return (
    <div className="onboarding-screen" dir={locale === "fa" ? "rtl" : "ltr"} lang={locale}>
      <div className="onboarding-world" aria-hidden="true">
        <img src="/art/day-background.webp" alt="" />
        <img src="/art/day-sky.webp" alt="" />
        <img src="/art/day-midground.webp" alt="" />
        <img src="/art/day-foreground.webp" alt="" />
      </div>
      <header className="onboarding-header">
        <img src="/icons/lumio-120.png" alt="" />
        <strong>{locale === "fa" ? "لومیو" : "Lumio"}</strong>
        <span>{step === 0 ? "✦" : step === 4 ? "✓" : `${step} / 3`}</span>
      </header>
      <main className="onboarding-main">
        <AnimatePresence mode="wait">
          <motion.section
            key={step}
            className="onboarding-card"
            aria-live="polite"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 25, rotate: -1 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -18, rotate: 1 }}
            transition={{ duration: reduced ? 0.08 : 0.38, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="onboarding-kicker">
              {step === 0 ? "LUMIO" : step === 4 ? "✦" : `${step} / 3`}
            </span>
            <motion.h1
              key={`${locale}-${step}`}
              className="onboarding-written"
              initial={reduced ? false : { clipPath: locale === "fa" ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0 0 0)" }}
              transition={{ duration: reduced ? 0 : 0.8, ease: "easeOut", delay: 0.15 }}
            >
              {step === 0 ? text.welcome : step === 1 ? text.first : step === 2 ? text.second : step === 3 ? text.third : text.done}
            </motion.h1>
            {step === 0 && (
              <div className="onboarding-step-content">
                <p>{text.intro}</p>
                <div className="onboarding-language" role="group" aria-label={locale === "fa" ? "زبان" : "Language"}>
                  <button className={locale === "fa" ? "selected" : ""} onClick={() => void updateSettings({ locale: "fa" })}>فارسی</button>
                  <button className={locale === "en" ? "selected" : ""} onClick={() => void updateSettings({ locale: "en" })}>English</button>
                </div>
                <p className="onboarding-disclosure">{text.data}</p>
                <button className="paper-button onboarding-primary" onClick={() => advance(1)}>{text.start}</button>
              </div>
            )}
            {step >= 1 && step <= 3 && (
              <form className="onboarding-step-content" onSubmit={(event) => void saveHabit(event)}>
                <p>{text.hint}</p>
                <label className="field">{text.habit}
                  <input autoFocus value={title} maxLength={80} onChange={(event) => setTitle(event.target.value)} required />
                </label>
                <fieldset className="onboarding-symbols">
                  <legend>{text.symbol}</legend>
                  <div>{choices.map((item) => (
                    <button type="button" key={item} aria-label={item} aria-pressed={emoji === item} className={emoji === item ? "selected" : ""} onClick={() => setEmoji(item)}>{item}</button>
                  ))}</div>
                </fieldset>
                {error && <p className="onboarding-error" role="alert">{error}</p>}
                <button className="paper-button onboarding-primary" disabled={busy || wiping || !title.trim()}>{text.next}</button>
              </form>
            )}
            {step === 4 && (
              <div className="onboarding-step-content">
                <p>{text.doneHint}</p>
                <div className="onboarding-summary">
                  <strong>{habits.length} {text.count}</strong>
                  {[...habits].sort((a, b) => a.createdAtISO.localeCompare(b.createdAtISO)).map((habit) => <span key={habit.id}>{habit.emoji || "🌱"} {habit.title}</span>)}
                </div>
                <p className="onboarding-disclosure">{text.data}</p>
                <p className="onboarding-install">{text.install}</p>
                {canInstall && <button className="paper-button secondary onboarding-primary" onClick={() => void onInstall()}>{text.installAction}</button>}
                <button className="paper-button onboarding-primary" disabled={busy} onClick={() => {
                  setBusy(true);
                  void onFinish().catch((cause) => {
                    setError(cause instanceof Error ? cause.message : String(cause));
                    setBusy(false);
                  });
                }}>{text.enter}</button>
                {error && <p className="onboarding-error" role="alert">{error}</p>}
              </div>
            )}
          </motion.section>
        </AnimatePresence>
      </main>
      <div className="onboarding-progress" aria-hidden="true">{[0, 1, 2, 3, 4].map((index) => <span key={index} className={index <= step ? "active" : ""} />)}</div>
      {wiping && !reduced && (
        <motion.div className="onboarding-cloud-wipe" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 1.05, times: [0, 0.3, 0.7, 1] }}>
          {[0, 1, 2].map((index) => <motion.img key={index} className={`wipe-cloud wipe-cloud-${index}`} src="/art/living/drift-cloud.webp" alt="" initial={{ x: locale === "fa" ? "75vw" : "-95vw" }} animate={{ x: locale === "fa" ? "-95vw" : "75vw" }} transition={{ duration: 1.05, delay: index * 0.035, ease: "easeInOut" }} />)}
        </motion.div>
      )}
    </div>
  );
}
