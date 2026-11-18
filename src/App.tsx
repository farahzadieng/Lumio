import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";
import { useLiveQuery } from "dexie-react-hooks";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  BookOpen,
  ChartNoAxesCombined,
  Check,
  ChevronLeft,
  Download,
  House,
  Leaf,
  Menu,
  Plus,
  Settings2,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  db,
  initDB,
  updateSettings,
  createHabit,
  checkIn,
  undoToday,
  archiveHabit,
} from "./model/db";
import {
  dayKey,
  currentStreak,
  completedOn,
  shiftDay,
  bestStreak,
  defaultSettings,
  type Habit,
  type Completion,
  type Locale,
  type SceneMode,
} from "./model/habits";
import {
  downloadBackup,
  importBackup,
  makeBackup,
  validateBackup,
  type Backup,
} from "./model/backup";

const JourneyCalendar = lazy(() => import("./components/JourneyCalendar"));
type Tab = "today" | "journey" | "insights" | "profile";
const tabs: Tab[] = ["today", "journey", "insights", "profile"];
const copy = {
  fa: {
    app: "لومیو",
    today: "امروز",
    journey: "مسیر من",
    insights: "نگاه من",
    profile: "تنظیمات",
    welcome: "هر روز، یک قدم کوچک",
    welcomeSub: "سه عادت روزانه انتخاب کن. هر عادت مسیر ۲۱ روزهٔ خودش را دارد.",
    create: "عادت تازه",
    newHabit: "یک عادت تازه",
    title: "نام عادت",
    note: "یادداشت (اختیاری)",
    save: "ذخیره",
    cancel: "انصراف",
    done: "انجام شد",
    undo: "بازگردانی",
    confirmUndo: "انجام امروز را برگردانم؟",
    streak: "روز پی‌درپی",
    day: "روز",
    of: "از",
    full: "هر سه جای عادت پر شده است. وقتی عادتی کامل یا بایگانی شود، جا باز می‌شود.",
    empty: "از یک کار کوچک شروع کنیم.",
    allDone: "آفرین! کارهای امروزت انجام شدند.",
    start: "شروع",
    history: "تاریخچه",
    noHistory: "هنوز سابقه‌ای نیست.",
    best: "بهترین روند",
    total: "کل انجام‌ها",
    active: "عادت‌های فعال",
    graduated: "کامل‌شده",
    archive: "بایگانی",
    archiveConfirm: "این عادت بایگانی شود؟ سابقه‌اش می‌ماند.",
    language: "زبان",
    scene: "زمان صحنه",
    auto: "همراه ساعت",
    dawnMode: "سپیده",
    dayMode: "روز",
    duskMode: "غروب",
    nightMode: "شب",
    data: "داده‌های من",
    export: "خروجی پشتیبان",
    import: "وارد کردن پشتیبان",
    importPreview: "این فایل جایگزین همهٔ داده‌های این مرورگر می‌شود.",
    confirm: "تأیید",
    privacy:
      "عادت‌ها و سابقه فقط در این دستگاه و همین مرورگر ذخیره می‌شوند. حساب، همگام‌سازی ابری یا سرور نداریم. پاک‌کردن دادهٔ مرورگر، حذف برنامه یا تغییر دستگاه ممکن است آن‌ها را از بین ببرد؛ مرتب پشتیبان بگیر.",
    install: "افزودن به صفحهٔ اصلی",
    installSub: "اختیاری است؛ دسترسی سریع‌تری به لومیو می‌دهد.",
    ios: "در Safari، «اشتراک‌گذاری» و سپس «افزودن به صفحهٔ اصلی» را بزنید.",
    later: "بعداً",
    continue: "ادامه",
    error: "مشکلی پیش آمد",
    retry: "تلاش دوباره",
    offline: "آفلاین",
    date: "روز انتخابی",
    noDate: "در این روز انجام‌شده‌ای نیست.",
    motion: "حرکت کمتر",
    backupReminder: "یادآوری پشتیبان",
    loading: "باز کردن دفتر محلی…",
    slot: "جای خالی",
    graduation: "مسیر ۲۱ روزه کامل شد!",
    installAgain: "راهنمای نصب",
  },
  en: {
    app: "Lumio",
    today: "Today",
    journey: "Journey",
    insights: "Insights",
    profile: "Profile",
    welcome: "A small step, every day",
    welcomeSub:
      "Choose up to three daily habits. Each has its own 21-day journey.",
    create: "New habit",
    newHabit: "Create a habit",
    title: "Habit name",
    note: "Note (optional)",
    save: "Save",
    cancel: "Cancel",
    done: "Done today",
    undo: "Undo",
    confirmUndo: "Undo today’s check-in?",
    streak: "day streak",
    day: "day",
    of: "of",
    full: "All three focus slots are full. Graduating or archiving a habit opens one.",
    empty: "Start with one small thing.",
    allDone: "Lovely work. Today is complete.",
    start: "Get started",
    history: "History",
    noHistory: "No history yet.",
    best: "Best streak",
    total: "Total check-ins",
    active: "Active habits",
    graduated: "Graduated",
    archive: "Archive",
    archiveConfirm: "Archive this habit? Its history stays.",
    language: "Language",
    scene: "Scene time",
    auto: "Follow clock",
    dawnMode: "Dawn",
    dayMode: "Day",
    duskMode: "Dusk",
    nightMode: "Night",
    data: "Your data",
    export: "Export backup",
    import: "Import backup",
    importPreview: "This file will replace all data in this browser.",
    confirm: "Confirm",
    privacy:
      "Habits and history live only on this device, in this browser. There is no account, cloud sync, or server. Clearing browser data, uninstalling, or changing devices may erase them. Export a backup regularly.",
    install: "Add to Home Screen",
    installSub: "Optional, for quick app-like access.",
    ios: "In Safari, tap Share, then Add to Home Screen.",
    later: "Later",
    continue: "Continue",
    error: "Something went wrong",
    retry: "Retry",
    offline: "Offline",
    date: "Selected day",
    noDate: "No check-ins on this day.",
    motion: "Reduce motion",
    backupReminder: "Backup reminder",
    loading: "Opening your local journal…",
    slot: "Open slot",
    graduation: "Your 21-day journey is complete!",
    installAgain: "Install guide",
  },
};
const localeDate = (date: Date, locale: Locale) =>
  new Intl.DateTimeFormat(locale === "fa" ? "fa-IR-u-ca-persian" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
const num = (v: number, locale: Locale) =>
  new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US").format(v);
function Scene({
  mode,
  reduced,
  locale,
}: {
  mode: "dawn" | "day" | "dusk" | "night";
  reduced: boolean;
  locale: Locale;
}) {
  const [visible, setVisible] = useState(!document.hidden);
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  return (
    <div
      className={`world-backdrop scene-${mode} ${reduced || !visible ? "scene-still" : ""}`}
      aria-hidden="true"
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={mode}
          className="world-lighting"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.1 : 0.65 }}
        >
          <img
            className="world-plane world-base"
            src={`/art/${mode}-background.webp`}
            alt=""
          />
          <img
            className="world-plane world-mountains"
            src={`/art/${mode}-background.webp`}
            alt=""
          />
          {[0, 1, 2, 3].map((i) => (
            <img
              key={i}
              className={`world-plane cloud-piece cloud-${i}`}
              src={`/art/${mode}-sky.webp`}
              alt=""
            />
          ))}
          <img
            className="world-plane world-trees"
            src={`/art/${mode}-midground.webp`}
            alt=""
          />
          <img
            className="world-plane world-leaves"
            src={`/art/${mode}-foreground.webp`}
            alt=""
          />
        </motion.div>
      </AnimatePresence>
      <span className="world-description">
        {locale === "fa" ? "دنیای کاغذی لومیو" : "Lumio paper world"}
      </span>
    </div>
  );
}
function Celebration({ emoji }: { emoji: string }) {
  return (
    <div className="celebration" aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => (
        <motion.span
          key={i}
          className="paper-petal"
          initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 1 }}
          animate={{
            x: Math.cos((i * Math.PI) / 6) * 125,
            y: Math.sin((i * Math.PI) / 6) * 95 - 35,
            scale: [0, 1, 0.7],
            rotate: i % 2 ? 160 : -160,
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 0.95, ease: "easeOut", delay: i * 0.012 }}
          style={{
            background: ["#ffd166", "#f6b7a0", "#a9d9b6", "#9bdce7"][i % 4],
          }}
        />
      ))}
      <motion.span
        className="celebration-emoji"
        initial={{ scale: 0, rotate: -15 }}
        animate={{
          scale: [0, 1.35, 1, 0],
          rotate: [-15, 8, 0, 0],
          y: [20, -12, -12, -50],
        }}
        transition={{ duration: 1.15 }}
      >
        {emoji}
      </motion.span>
    </div>
  );
}
function HabitCard({
  habit,
  completions,
  locale,
  onDone,
  onUndo,
}: {
  habit: Habit;
  completions: Completion[];
  locale: Locale;
  onDone: () => void;
  onUndo: () => void;
}) {
  const t = copy[locale];
  const checked = completedOn(habit.id, dayKey(), completions);
  const streak = currentStreak(
    habit,
    completions.filter((c) => c.habitId === habit.id).map((c) => c.dayKey),
    dayKey(),
  );
  return (
    <motion.article
      layout
      className={`habit-card ${checked ? "habit-complete" : ""}`}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <motion.div
        className="habit-mark"
        animate={
          checked ? { rotate: [0, -12, 12, 0], scale: [1, 1.18, 1] } : {}
        }
        transition={{ duration: 0.5 }}
      >
        {habit.emoji || "🌱"}
      </motion.div>
      <div className="habit-info">
        <h3>{habit.title}</h3>
        {habit.note && <p>{habit.note}</p>}
        <div className="habit-meta">
          <span>
            {num(streak, locale)} {t.streak}
          </span>
        </div>
      </div>
      <motion.button
        whileTap={{ scale: 0.8, rotate: -12 }}
        animate={checked ? { scale: [1, 1.2, 1] } : { scale: 1 }}
        className={`check-button ${checked ? "checked" : ""}`}
        onClick={checked ? onUndo : onDone}
        aria-label={
          checked ? `${t.undo}: ${habit.title}` : `${t.done}: ${habit.title}`
        }
      >
        <Check size={23} />
      </motion.button>
    </motion.article>
  );
}
function Sheet({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Close className="dialog-x" aria-label="Close / بستن">
            <X size={20} />
          </Dialog.Close>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
export default function App() {
  const [ready, setReady] = useState(false),
    [bootError, setBootError] = useState("");
  const [tab, setTab] = useState<Tab>(() =>
    tabs.includes(location.hash.slice(1) as Tab)
      ? (location.hash.slice(1) as Tab)
      : "today",
  );
  const [creating, setCreating] = useState(false),
    [title, setTitle] = useState(""),
    [note, setNote] = useState(""),
    [emoji, setEmoji] = useState("🌱"),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [confirm, setConfirm] = useState<{
      message: string;
      run: () => Promise<unknown>;
    } | null>(null);
  const [installGuide, setInstallGuide] = useState(false),
    [installPrompt, setInstallPrompt] = useState<any>(null),
    [online, setOnline] = useState(navigator.onLine),
    [selected, setSelected] = useState<Date>(new Date()),
    [clock, setClock] = useState(new Date()),
    [celebrate, setCelebrate] = useState(""),
    [pendingBackup, setPendingBackup] = useState<Backup | null>(null);
  const [pageDirection, setPageDirection] = useState(1);
  const [reduceOverride, setReduceOverride] = useState(
    localStorage.getItem("lumio-reduce-motion") === "1",
  );
  const [lastBackupAt, setLastBackupAt] = useState(
    localStorage.getItem("lumio-last-backup"),
  );
  const systemReduce = useReducedMotion();
  const reduced = Boolean(systemReduce || reduceOverride);
  useEffect(() => {
    initDB()
      .then(() => setReady(true))
      .catch((e) => setBootError(String(e)));
  }, []);
  useEffect(() => {
    const hash = () => {
      const next = location.hash.slice(1) as Tab;
      if (tabs.includes(next)) setTab(next);
    };
    const status = () => setOnline(navigator.onLine);
    const clockTimer = setInterval(() => setClock(new Date()), 60000);
    window.addEventListener("hashchange", hash);
    window.addEventListener("online", status);
    window.addEventListener("offline", status);
    const install = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", install);
    return () => {
      clearInterval(clockTimer);
      window.removeEventListener("hashchange", hash);
      window.removeEventListener("online", status);
      window.removeEventListener("offline", status);
      window.removeEventListener("beforeinstallprompt", install);
    };
  }, []);
  const settings = useLiveQuery(
      () => db.settings.get("main"),
      [ready],
      defaultSettings,
    ),
    habits = useLiveQuery(() => db.habits.toArray(), [ready], []) || [],
    completions =
      useLiveQuery(() => db.completions.toArray(), [ready], []) || [],
    milestones = useLiveQuery(() => db.milestones.toArray(), [ready], []) || [];
  const locale = settings?.locale || "fa",
    t = copy[locale];
  const active = habits.filter((h) => h.status === "active");
  const mode: "dawn" | "day" | "dusk" | "night" =
    settings?.sceneMode === "auto"
      ? clock.getHours() >= 20 || clock.getHours() < 5
        ? "night"
        : clock.getHours() < 9
          ? "dawn"
          : clock.getHours() < 17
            ? "day"
            : "dusk"
      : ((settings?.sceneMode || "day") as "dawn" | "day" | "dusk" | "night");
  useEffect(() => {
    document.documentElement.dataset.scene = mode;
    document.documentElement.dataset.motion = reduced ? "reduce" : "full";
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "fa" ? "rtl" : "ltr";
  }, [mode, reduced, locale]);
  const selectedKey = dayKey(selected);
  const firstHabitAt = habits.length
    ? Math.min(...habits.map((h) => Date.parse(h.createdAtISO)))
    : Date.now();
  const backupDue = Boolean(
    settings?.backupReminder &&
    habits.length &&
    Date.now() -
      Date.parse(lastBackupAt || new Date(firstHabitAt).toISOString()) >
      7 * 86400000,
  );
  const completedDates = useMemo(
    () =>
      completions.map((c) => {
        const [y, m, d] = c.dayKey.split("-").map(Number);
        return new Date(y, m - 1, d);
      }),
    [completions],
  );
  function go(next: Tab) {
    if (next === tab) return;
    setPageDirection(tabs.indexOf(next) > tabs.indexOf(tab) ? 1 : -1);
    location.hash = next;
    setTab(next);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  async function run(action: () => Promise<unknown>) {
    setError("");
    setBusy(true);
    try {
      await action();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }
  async function add() {
    await run(async () => {
      await createHabit(title, note, emoji);
      setTitle("");
      setNote("");
      setCreating(false);
    });
  }
  function done(h: Habit, forDay = dayKey()) {
    void run(async () => {
      await checkIn(h.id, forDay);
      setCelebrate(h.emoji || "🌱");
      setTimeout(() => setCelebrate(""), 1250);
    });
  }
  function undo(h: Habit) {
    setConfirm({ message: t.confirmUndo, run: () => undoToday(h.id) });
  }
  function archive(h: Habit) {
    setConfirm({ message: t.archiveConfirm, run: () => archiveHabit(h.id) });
  }
  async function readBackup(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 5_000_000) {
      setError("Backup file is too large");
      return;
    }
    try {
      setPendingBackup(validateBackup(JSON.parse(await file.text())));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }
  async function exportNow() {
    await run(async () => {
      downloadBackup(await makeBackup());
      const stamp = new Date().toISOString();
      localStorage.setItem("lumio-last-backup", stamp);
      setLastBackupAt(stamp);
    });
  }
  async function install() {
    if (installPrompt) {
      await installPrompt.prompt();
      setInstallPrompt(null);
    } else setInstallGuide(true);
  }
  if (!ready)
    return (
      <div className="boot">
        <img src="/icons/lumio-120.png" width="84" height="84" alt="" />
        <strong>لومیو</strong>
        <p>{bootError || t.loading}</p>
        {bootError && (
          <button onClick={() => location.reload()}>{t.retry}</button>
        )}
      </div>
    );
  return (
    <div
      className={`app-shell theme-${mode} ${reduced ? "reduced-motion" : ""} tab-${tab}`}
      dir={locale === "fa" ? "rtl" : "ltr"}
      lang={locale}
    >
      <Scene mode={mode} reduced={reduced} locale={locale} />
      {celebrate && !reduced && (
        <Celebration key={celebrate} emoji={celebrate} />
      )}
      <a className="skip-link" href="#main">
        {locale === "fa" ? "رفتن به محتوا" : "Skip to content"}
      </a>
      <header className="topbar">
        <div className="brand">
          <img src="/icons/lumio-120.png" alt="" />
          <span>{t.app}</span>
        </div>
        <span className="date-pill">{localeDate(clock, locale)}</span>
        {!online && <span className="offline-pill">{t.offline}</span>}
      </header>
      <main id="main">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            className="page"
            initial={
              reduced
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    rotateY: pageDirection * (locale === "fa" ? 12 : -12),
                    x: pageDirection * (locale === "fa" ? -35 : 35),
                    y: 12,
                    scale: 0.97,
                  }
            }
            animate={{ opacity: 1, rotateY: 0, x: 0, y: 0, scale: 1 }}
            exit={
              reduced
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    rotateY: pageDirection * (locale === "fa" ? -12 : 12),
                    x: pageDirection * (locale === "fa" ? 30 : -30),
                    scale: 0.98,
                    transition: { duration: 0.13 },
                  }
            }
            transition={{
              duration: reduced ? 0.1 : 0.32,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {tab === "today" && (
              <>
                <div className="hero">
                  <div className="hero-caption">
                    <span className="eyebrow">LUMIO · {t.today}</span>
                    <h1>{t.welcome}</h1>
                    <p>{t.welcomeSub}</p>
                  </div>
                </div>
                <section className="today-panel">
                  <div className="section-heading">
                    <div>
                      <span className="eyebrow">
                        {num(active.length, locale)} / {num(3, locale)}
                      </span>
                      <h2>{t.today}</h2>
                    </div>
                    <button
                      className="paper-button small"
                      onClick={() => setCreating(true)}
                      disabled={active.length >= 3}
                    >
                      <Plus size={17} />
                      {t.create}
                    </button>
                  </div>
                  {active.length === 0 ? (
                    <div className="empty-card">
                      <Leaf size={27} />
                      <p>{t.empty}</p>
                      <button
                        className="paper-button"
                        onClick={() => setCreating(true)}
                      >
                        {t.start}
                        <ChevronLeft size={17} />
                      </button>
                    </div>
                  ) : (
                    <div className="habit-list">
                      {active.map((h) => (
                        <HabitCard
                          key={h.id}
                          habit={h}
                          completions={completions}
                          locale={locale}
                          onDone={() => done(h)}
                          onUndo={() => undo(h)}
                        />
                      ))}
                    </div>
                  )}
                  {active.length >= 3 && <p className="helper">{t.full}</p>}
                  {active.length > 0 &&
                    active.every((h) =>
                      completedOn(h.id, dayKey(), completions),
                    ) && <p className="success-note">{t.allDone}</p>}
                </section>
              </>
            )}
            {tab === "journey" && (
              <section className="content-page">
                <div className="page-heading">
                  <span className="eyebrow">LUMIO / JOURNAL</span>
                  <h1>{t.journey}</h1>
                  <p>
                    {locale === "fa"
                      ? "هر روز، یک یادگاری کوچک"
                      : "A little keepsake for every day"}
                  </p>
                </div>
                <div className="paper-panel calendar-panel">
                  <div className="calendar-top">
                    <BookOpen size={21} />
                    <strong>
                      {t.date}: {localeDate(selected, locale)}
                    </strong>
                  </div>
                  <div className="calendar-shortcuts">
                    <button onClick={() => setSelected(new Date())}>
                      {t.today}
                    </button>
                    <button
                      onClick={() =>
                        setSelected(
                          new Date(shiftDay(dayKey(), -1) + "T12:00:00"),
                        )
                      }
                    >
                      {locale === "fa" ? "دیروز" : "Yesterday"}
                    </button>
                  </div>
                  <Suspense fallback={<p className="muted">{t.loading}</p>}>
                    <JourneyCalendar
                      locale={locale}
                      selected={selected}
                      onSelect={setSelected}
                      completedDates={completedDates}
                      completions={completions}
                      habits={habits}
                    />
                  </Suspense>
                </div>
                <div className="paper-panel">
                  <h2>{localeDate(selected, locale)}</h2>
                  {selectedKey === shiftDay(dayKey(), -1) &&
                    active
                      .filter(
                        (h) =>
                          h.startDayKey <= selectedKey &&
                          !completedOn(h.id, selectedKey, completions),
                      )
                      .map((h) => (
                        <div className="catchup-row" key={h.id}>
                          <span>
                            {h.emoji || "🌱"} {h.title}
                          </span>
                          <button
                            className="paper-button small"
                            disabled={busy}
                            onClick={() => done(h, selectedKey)}
                          >
                            {locale === "fa"
                              ? "ثبت دیروز"
                              : "Check in yesterday"}
                          </button>
                        </div>
                      ))}
                  {completions.filter((c) => c.dayKey === selectedKey)
                    .length ? (
                    completions
                      .filter((c) => c.dayKey === selectedKey)
                      .map((c) => (
                        <div className="history-row" key={c.id}>
                          <Check size={17} />
                          {habits.find((h) => h.id === c.habitId)?.title || "—"}
                        </div>
                      ))
                  ) : (
                    <p className="muted">{t.noDate}</p>
                  )}
                </div>
                {milestones.length > 0 && (
                  <div className="paper-panel">
                    <h2>{t.graduated}</h2>
                    {milestones.map((m) => (
                      <p key={m.id}>
                        {habits.find((h) => h.id === m.habitId)?.title} ·{" "}
                        {m.dayKey}
                      </p>
                    ))}
                  </div>
                )}
              </section>
            )}
            {tab === "insights" && (
              <section className="content-page insights-page">
                <div className="page-heading">
                  <h1>{t.insights}</h1>
                  <p>
                    {locale === "fa"
                      ? "رد قدم‌های کوچک تو"
                      : "The shape of your small steps"}
                  </p>
                </div>
                <div className="achievement-shelf">
                  {[
                    { label: t.total, value: completions.length, icon: "✦" },
                    { label: t.active, value: active.length, icon: "❧" },
                    { label: t.graduated, value: milestones.length, icon: "✿" },
                  ].map((stat, i) => (
                    <div className={`paper-medal medal-${i}`} key={stat.label}>
                      <span aria-hidden="true">{stat.icon}</span>
                      <strong>{num(stat.value, locale)}</strong>
                      <small>{stat.label}</small>
                    </div>
                  ))}
                </div>
                <div className="paper-panel weekly-panel">
                  <h2>
                    {locale === "fa" ? "ریتم این هفته" : "Your week in rhythm"}
                  </h2>
                  <div className="weekly-bars">
                    {Array.from({ length: 7 }, (_, i) => {
                      const key = shiftDay(dayKey(), i - 6);
                      const count = completions.filter(
                        (c) => c.dayKey === key,
                      ).length;
                      return (
                        <div className="weekly-day" key={key}>
                          <span>{num(count, locale)}</span>
                          <div className="bar-track">
                            <motion.div
                              initial={{ scaleY: 0 }}
                              animate={{ scaleY: 1 }}
                              transition={{ duration: 0.6, delay: i * 0.055 }}
                              style={{
                                height: `${Math.min(100, (count / 3) * 100)}%`,
                              }}
                            />
                          </div>
                          <small>
                            {new Intl.DateTimeFormat(
                              locale === "fa" ? "fa-IR" : "en-US",
                              { weekday: "narrow" },
                            ).format(new Date(key + "T12:00:00"))}
                          </small>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="habit-stamps">
                  {habits.length ? (
                    habits.map((h) => {
                      const days = completions
                        .filter((c) => c.habitId === h.id)
                        .map((c) => c.dayKey);
                      const best = bestStreak(h, days);
                      return (
                        <article
                          className="paper-panel habit-passport"
                          key={h.id}
                        >
                          <div
                            className="passport-seal"
                            style={{
                              background: `conic-gradient(#5ba67a ${Math.min(100, (best / 21) * 100)}%,#e4d7bd 0)`,
                            }}
                          >
                            <span>{h.emoji || "🌱"}</span>
                          </div>
                          <div>
                            <h3>{h.title}</h3>
                            <p>
                              {t.best} · {num(best, locale)} {t.day}
                            </p>
                            <small>
                              {num(days.length, locale)} {t.total}
                            </small>
                          </div>
                        </article>
                      );
                    })
                  ) : (
                    <div className="paper-panel empty-card">
                      <Leaf />
                      <p>{t.noHistory}</p>
                    </div>
                  )}
                </div>
              </section>
            )}
            {tab === "profile" && (
              <section className="content-page">
                <div className="page-heading">
                  <span className="eyebrow">LUMIO / YOU</span>
                  <h1>{t.profile}</h1>
                </div>
                <div className="paper-panel settings-panel">
                  <h2>
                    <Settings2 size={20} />
                    {t.language}
                  </h2>
                  <div className="segmented">
                    <button
                      className={locale === "fa" ? "selected" : ""}
                      onClick={() => updateSettings({ locale: "fa" })}
                    >
                      فارسی
                    </button>
                    <button
                      className={locale === "en" ? "selected" : ""}
                      onClick={() => updateSettings({ locale: "en" })}
                    >
                      English
                    </button>
                  </div>
                  <h2>{t.scene}</h2>
                  <div className="segmented">
                    {(
                      ["auto", "dawn", "day", "dusk", "night"] as SceneMode[]
                    ).map((m) => (
                      <button
                        key={m}
                        className={settings?.sceneMode === m ? "selected" : ""}
                        onClick={() => updateSettings({ sceneMode: m })}
                      >
                        {m === "auto"
                          ? t.auto
                          : m === "dawn"
                            ? t.dawnMode
                            : m === "day"
                              ? t.dayMode
                              : m === "dusk"
                                ? t.duskMode
                                : t.nightMode}
                      </button>
                    ))}
                  </div>
                  <label className="switch-row">
                    <span>{t.motion}</span>
                    <input
                      type="checkbox"
                      checked={reduceOverride}
                      onChange={(e) => {
                        setReduceOverride(e.target.checked);
                        localStorage.setItem(
                          "lumio-reduce-motion",
                          e.target.checked ? "1" : "0",
                        );
                      }}
                    />
                  </label>
                  <label className="switch-row">
                    <span>{t.backupReminder}</span>
                    <input
                      type="checkbox"
                      checked={settings?.backupReminder || false}
                      onChange={(e) =>
                        updateSettings({ backupReminder: e.target.checked })
                      }
                    />
                  </label>
                </div>
                <div className="paper-panel">
                  <h2>{t.data}</h2>
                  <p className="muted">{t.privacy}</p>
                  {backupDue && (
                    <p className="success-note">
                      {locale === "fa"
                        ? "وقت یک پشتیبان تازه است."
                        : "Time for a fresh backup."}
                    </p>
                  )}
                  <div className="button-row">
                    <button
                      className="paper-button"
                      onClick={() => void exportNow()}
                    >
                      <Download size={17} />
                      {t.export}
                    </button>
                    <label className="paper-button secondary">
                      <Upload size={17} />
                      {t.import}
                      <input
                        className="file-input"
                        type="file"
                        accept="application/json,.json"
                        onChange={readBackup}
                      />
                    </label>
                  </div>
                </div>
                {active.length > 0 && (
                  <div className="paper-panel">
                    <h2>{t.active}</h2>
                    {active.map((h) => (
                      <div className="manage-habit" key={h.id}>
                        <span>
                          {h.emoji || "🌱"} {h.title}
                        </span>
                        <button
                          className="icon-button"
                          onClick={() => archive(h)}
                          aria-label={`${t.archive}: ${h.title}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  className="text-button"
                  onClick={() => setInstallGuide(true)}
                >
                  {t.installAgain}
                </button>
              </section>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      <nav className="bottom-nav" aria-label="Primary">
        {tabs.map((id, i) => {
          const Icon = [House, BookOpen, ChartNoAxesCombined, Menu][i];
          return (
            <button
              key={id}
              className={tab === id ? "active" : ""}
              aria-current={tab === id ? "page" : undefined}
              onClick={() => go(id)}
            >
              <Icon size={22} strokeWidth={tab === id ? 2.4 : 1.8} />
              <span>{t[id]}</span>
            </button>
          );
        })}
      </nav>
      <Sheet open={creating} onOpenChange={setCreating} title={t.newHabit}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void add();
          }}
        >
          <label className="field">
            {t.title}
            <input
              autoFocus
              value={title}
              maxLength={80}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <fieldset className="emoji-field">
            <legend>{locale === "fa" ? "نشان عادت" : "Habit emoji"}</legend>
            <div className="emoji-picker">
              {[
                "🌱",
                "📚",
                "🚶",
                "💧",
                "🧘",
                "🌸",
                "✍️",
                "🎨",
                "🏃",
                "💤",
                "🍎",
                "🎵",
              ].map((item) => (
                <button
                  type="button"
                  key={item}
                  aria-label={item}
                  aria-pressed={emoji === item}
                  className={emoji === item ? "selected" : ""}
                  onClick={() => setEmoji(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="field">
            {t.note}
            <textarea
              value={note}
              maxLength={300}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </label>
          <div className="dialog-actions">
            <button
              type="button"
              className="paper-button secondary"
              onClick={() => setCreating(false)}
            >
              {t.cancel}
            </button>
            <button className="paper-button" disabled={busy || !title.trim()}>
              {t.save}
            </button>
          </div>
        </form>
      </Sheet>
      <Sheet
        open={!!confirm}
        onOpenChange={(o) => !o && setConfirm(null)}
        title={t.confirm}
      >
        <p>{confirm?.message}</p>
        <div className="dialog-actions">
          <button
            className="paper-button secondary"
            onClick={() => setConfirm(null)}
          >
            {t.cancel}
          </button>
          <button
            className="paper-button"
            onClick={() => {
              const task = confirm?.run;
              setConfirm(null);
              if (task) void run(task);
            }}
          >
            {t.confirm}
          </button>
        </div>
      </Sheet>
      <Sheet
        open={!!pendingBackup}
        onOpenChange={(o) => !o && setPendingBackup(null)}
        title={t.import}
      >
        <p>{t.importPreview}</p>
        <p className="muted">
          {pendingBackup?.habits.length} habits ·{" "}
          {pendingBackup?.completions.length} check-ins
        </p>
        <div className="dialog-actions">
          <button
            className="paper-button secondary"
            onClick={() => setPendingBackup(null)}
          >
            {t.cancel}
          </button>
          <button
            className="paper-button"
            onClick={() => {
              const b = pendingBackup;
              setPendingBackup(null);
              if (b) void run(() => importBackup(b));
            }}
          >
            {t.confirm}
          </button>
        </div>
      </Sheet>
      <Sheet
        open={installGuide}
        onOpenChange={setInstallGuide}
        title={t.install}
      >
        <div className="install-card">
          <img src="/icons/lumio-120.png" alt="" />
          <p>{t.installSub}</p>
          <p>{t.ios}</p>
          <button
            className="paper-button"
            onClick={() => {
              setInstallGuide(false);
              void install();
            }}
            disabled={!installPrompt}
          >
            {t.install}
          </button>
        </div>
      </Sheet>
      <Sheet
        open={!settings?.onboarded}
        onOpenChange={() => {}}
        title={t.welcome}
      >
        <div className="onboard">
          <img src="/icons/lumio-120.png" alt="" />
          <p>{t.welcomeSub}</p>
          <div className="segmented">
            <button
              className={locale === "fa" ? "selected" : ""}
              onClick={() => updateSettings({ locale: "fa" })}
            >
              فارسی
            </button>
            <button
              className={locale === "en" ? "selected" : ""}
              onClick={() => updateSettings({ locale: "en" })}
            >
              English
            </button>
          </div>
          <p className="muted">{t.privacy}</p>
          <h3>{t.install}</h3>
          <p>{t.installSub}</p>
          <p className="muted">{t.ios}</p>
          <button
            className="paper-button secondary"
            onClick={() => void exportNow()}
          >
            {t.export}
          </button>
          {installPrompt && (
            <button
              className="paper-button secondary"
              onClick={() => void install()}
            >
              {t.install}
            </button>
          )}
          <button
            className="paper-button"
            onClick={async () => {
              await updateSettings({ onboarded: true, installDismissed: true });
              setCreating(true);
            }}
          >
            {t.continue}
          </button>
        </div>
      </Sheet>
      {error && (
        <div role="alert" className="toast" onClick={() => setError("")}>
          {error}
          <X size={15} />
        </div>
      )}
    </div>
  );
}
