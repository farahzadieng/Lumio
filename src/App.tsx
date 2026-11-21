import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { useLiveQuery } from "dexie-react-hooks";
import Onboarding from "./components/Onboarding";
import * as Dialog from "@radix-ui/react-dialog";
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useDragControls,
  useMotionValue,
  animate,
  useReducedMotion,
} from "motion/react";
import {
  BookOpen,
  ChartNoAxesCombined,
  Check,
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
  resetAllData,
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
    toInsights: "افزودن عادت از نگاه من",
    reset: "شروع دوباره و حذف همهٔ داده‌ها",
    resetWarning: "همهٔ عادت‌ها، ثبت‌ها، تاریخچه و تنظیمات این مرورگر پاک می‌شوند و راه‌اندازی اولیه دوباره آغاز می‌شود. اگر داده‌ها را لازم داری، اول خروجی پشتیبان بگیر.",
    resetConfirm: "حذف همه و شروع دوباره",
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
    toInsights: "Add a habit from Insights",
    reset: "Reset app and erase all data",
    resetWarning: "All habits, check-ins, history and settings in this browser will be erased, then onboarding will start again. Export a backup first if you need this data.",
    resetConfirm: "Erase all and start over",
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
type SceneReaction = { kind: "cloud" | "flower" | "river"; id: number };

function Scene({
  mode,
  reduced,
  locale,
  reaction,
}: {
  mode: "dawn" | "day" | "dusk" | "night";
  reduced: boolean;
  locale: Locale;
  reaction: SceneReaction | null;
}) {
  const cloudControls = useAnimationControls();
  const flowerControls = useAnimationControls();
  const riverControls = useAnimationControls();
  useEffect(() => {
    if (!reaction || reduced) return;
    const controls =
      reaction.kind === "cloud"
        ? cloudControls
        : reaction.kind === "flower"
          ? flowerControls
          : riverControls;
    void controls.start(
      reaction.kind === "cloud"
        ? {
            x: [0, 10, -3, 0],
            y: [0, -6, 1, 0],
            transition: { duration: 1.15, ease: "easeInOut" },
          }
        : reaction.kind === "flower"
          ? {
              rotate: [0, -7, 5, 0],
              transition: { duration: 0.8, ease: "easeInOut" },
            }
          : {
              x: [0, 7, -2, 0],
              opacity: [0.65, 1, 0.72, 0.65],
              transition: { duration: 0.85, ease: "easeInOut" },
            },
    );
    return () => controls.stop();
  }, [reaction, reduced, cloudControls, flowerControls, riverControls]);
  const dailyEvent = [...dayKey()].reduce((seed, char) => seed + char.charCodeAt(0), 0) % 2;
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
          <img className="world-plane world-sky" src={`/art/${mode}-sky.webp`} alt="" />
          <span className="living-sun-haze" />
          <img className="world-plane world-trees" src={`/art/${mode}-midground.webp`} alt="" />
          <div className="living-cloud cloud-near">
            <motion.img animate={cloudControls} src="/art/living/drift-cloud.webp" alt="" />
          </div>
          <div className="living-cloud cloud-far" aria-hidden="true">
            <img src="/art/living/drift-cloud.webp" alt="" />
          </div>
          <span className="living-window-glow" />
          <img className="world-plane world-leaves" src={`/art/${mode}-foreground.webp`} alt="" />
          <div className="living-sprig sprig-left">
            <img src="/art/living/leaf-sprig.webp" alt="" />
          </div>
          <div className="living-sprig sprig-right" aria-hidden="true">
            <img src="/art/living/leaf-sprig.webp" alt="" />
          </div>
          <div className="living-flower">
            <motion.img animate={flowerControls} src="/art/living/coral-flower.webp" alt="" />
          </div>
          <div className="living-river-glint">
            <motion.span animate={riverControls} />
          </div>
          {mode !== "night" && dailyEvent === 0 &&
            <img className="living-bird" src="/art/living/songbird.webp" alt="" />}
          {mode !== "night" && dailyEvent === 1 &&
            <img className="living-butterfly" src="/art/living/butterfly.webp" alt="" />}
        </motion.div>
      </AnimatePresence>
      <span className="world-description">
        {locale === "fa" ? "دنیای کاغذی لومیو" : "Lumio paper world"}
      </span>
    </div>
  );
}
function HomeWorld({
  locale,
  reduced,
  mode,
  reaction,
  onReact,
  onReveal,
}: {
  locale: Locale;
  reduced: boolean;
  mode: "dawn" | "day" | "dusk" | "night";
  reaction: SceneReaction | null;
  onReact: (kind: SceneReaction["kind"]) => void;
  onReveal: () => void;
}) {
  const touchStart = useRef<number | null>(null);
  const [touch, setTouch] = useState<{
    x: number;
    y: number;
    id: number;
  } | null>(null);
  const targets = [
    {
      kind: "cloud" as const,
      label: locale === "fa" ? "نوازش ابرها" : "Flutter the clouds",
    },
    {
      kind: "flower" as const,
      label: locale === "fa" ? "نوازش گل" : "Sway the flower",
    },
    {
      kind: "river" as const,
      label: locale === "fa" ? "موج روی رودخانه" : "Ripple the stream",
    },
  ];
  return (
    <div
      className="hero home-world"
      onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientY ?? null; }}
      onTouchEnd={(event) => {
        if (touchStart.current !== null && touchStart.current - (event.changedTouches[0]?.clientY ?? touchStart.current) > 45) onReveal();
        touchStart.current = null;
      }}
      onWheel={(event) => { if (event.deltaY > 25) onReveal(); }}
    >
      <Scene mode={mode} reduced={reduced} locale={locale} reaction={reaction} />
      <div className="scene-masthead" aria-hidden="true">
        <img src="/icons/lumio-120.png" alt="" />
        <span>{locale === "fa" ? "لومیو" : "Lumio"}</span>
      </div>
      {targets.map((target) => (
        <motion.button
          key={target.kind}
          className={`scene-hotspot hotspot-${target.kind}`}
          aria-label={target.label}
          whileTap={{ scale: 0.9 }}
          onClick={(event) => {
            const bounds =
              event.currentTarget.parentElement!.getBoundingClientRect();
            const targetBounds = event.currentTarget.getBoundingClientRect();
            setTouch({
              x: targetBounds.left - bounds.left + targetBounds.width / 2,
              y: targetBounds.top - bounds.top + targetBounds.height / 2,
              id: Date.now(),
            });
            onReact(target.kind);
          }}
        />
      ))}
      {touch && (
        <div
          className="scene-touch"
          key={touch.id}
          style={{ left: touch.x, top: touch.y }}
          aria-hidden="true"
        >
          {[0, 1, 2].map((index) => (
            <motion.span
              key={index}
              initial={{ scale: 0.25, opacity: 0.8 }}
              animate={{ scale: reduced ? 1 : 2.3 + index * 0.5, opacity: 0 }}
              transition={{
                duration: reduced ? 0.1 : 1,
                delay: reduced ? 0 : index * 0.12,
              }}
            />
          ))}
        </div>
      )}
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
  busy,
  reduced,
}: {
  habit: Habit;
  completions: Completion[];
  locale: Locale;
  onDone: () => Promise<boolean>;
  onUndo: () => void;
  busy: boolean;
  reduced: boolean;
}) {
  const [burst, setBurst] = useState(0);
  useEffect(() => {
    if (!burst) return;
    const timer = window.setTimeout(() => setBurst(0), 1050);
    return () => window.clearTimeout(timer);
  }, [burst]);
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
        disabled={busy}
        onClick={checked ? onUndo : async () => {
          if (await onDone() && !reduced) setBurst(Date.now());
        }}
        aria-label={
          checked ? `${t.undo}: ${habit.title}` : `${t.done}: ${habit.title}`
        }
      >
        <Check size={23} />
      </motion.button>
      {burst > 0 && (
        <span className="habit-burst" key={burst} aria-hidden="true">
          {Array.from({ length: 8 }, (_, index) => (
            <motion.span
              key={index}
              className="habit-burst-petal"
              style={{ background: ["#f8c270", "#e59a7d", "#b8dc9d", "#f8e7a9"][index % 4] }}
              initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
              animate={{
                x: Math.cos((index * Math.PI) / 4) * 48,
                y: Math.sin((index * Math.PI) / 4) * 42,
                scale: [0, 1.25, 0.55],
                opacity: [1, 1, 0],
                rotate: index % 2 ? 135 : -135,
              }}
              transition={{ duration: 0.82, ease: "easeOut", delay: index * 0.025 }}
            />
          ))}
          <motion.span className="habit-burst-seal" initial={{ scale: 0, rotate: -18 }} animate={{ scale: [0, 1.35, 1], rotate: [-18, 8, 0] }} transition={{ type: "spring", stiffness: 310, damping: 16 }}>
            ✓
          </motion.span>
        </span>
      )}
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
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}) {
  const dragControls = useDragControls();
  const offset = useMotionValue(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (open) offset.set(0);
  }, [open, offset]);
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content asChild>
          <motion.div
            className="dialog-content"
            style={{ y: offset }}
            drag="y"
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.55 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 90 || info.velocity.y > 700)
                onOpenChange(false);
              else
                void animate(
                  offset,
                  0,
                  reduced
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 420, damping: 34 },
                );
            }}
          >
            <button
              className="sheet-drag-grip"
              aria-label="Close panel / بستن پنل"
              onPointerDown={(event) => dragControls.start(event)}
              onClick={() => onOpenChange(false)}
            >
              <span />
            </button>
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Close className="dialog-x" aria-label="Close / بستن">
              <X size={20} />
            </Dialog.Close>
            {children}
          </motion.div>
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
  const [sceneReaction, setSceneReaction] = useState<SceneReaction | null>(
    null,
  );
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [panelRaised, setPanelRaised] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const hasShownToday = useRef(false);
  const scrollPositions = useRef<Partial<Record<Tab, number>>>({});
  useEffect(() => {
    const timer = setTimeout(
      () =>
        window.scrollTo({
          top: scrollPositions.current[tab] || 0,
          behavior: "instant",
        }),
      160,
    );
    return () => clearTimeout(timer);
  }, [tab]);
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
  useEffect(() => {
    if (!settings?.onboarded || tab !== "today") return;
    if (reduced || hasShownToday.current) {
      setPanelRaised(true);
      return;
    }
    const timer = window.setTimeout(() => {
      hasShownToday.current = true;
      setPanelRaised(true);
    }, 1600);
    return () => window.clearTimeout(timer);
  }, [settings?.onboarded, tab, reduced]);
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
    scrollPositions.current[tab] = window.scrollY;
    setPageDirection(tabs.indexOf(next) > tabs.indexOf(tab) ? 1 : -1);
    location.hash = next;
    setTab(next);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  async function run<T>(action: () => Promise<T>): Promise<T | undefined> {
    setError("");
    setBusy(true);
    try {
      return await action();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      return undefined;
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
  async function done(h: Habit, forDay = dayKey()): Promise<boolean> {
    const result = await run(() => checkIn(h.id, forDay));
    if (result) {
      setCelebrate(h.emoji || "🌱");
      setSceneReaction({ kind: "flower", id: Date.now() });
      setTimeout(() => setCelebrate(""), 1250);
      return true;
    }
    return false;
  }
  async function resetApp() {
    await resetAllData();
    localStorage.removeItem("lumio-reduce-motion");
    localStorage.removeItem("lumio-last-backup");
    localStorage.removeItem("lumio-onboarding-step");
    history.replaceState(null, "", location.pathname + location.search);
    window.location.reload();
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
  if (!settings?.onboarded)
    return (
      <Onboarding
        locale={locale}
        habits={active}
        reduced={reduced}
        canInstall={Boolean(installPrompt)}
        onInstall={install}
        onFinish={async () => {
          await updateSettings({ onboarded: true, installDismissed: true });
          localStorage.removeItem("lumio-onboarding-step");
          history.replaceState(null, "", `${location.pathname}${location.search}#today`);
          setTab("today");
          setPanelCollapsed(false);
          setPanelRaised(false);
          hasShownToday.current = false;
        }}
      />
    );
  return (
    <div
      className={`app-shell theme-${mode} ${reduced ? "reduced-motion" : ""} tab-${tab}`}
      dir={locale === "fa" ? "rtl" : "ltr"}
      lang={locale}
    >
      {celebrate && !reduced && (
        <Celebration key={celebrate} emoji={celebrate} />
      )}
      <a className="skip-link" href="#main">
        {locale === "fa" ? "رفتن به محتوا" : "Skip to content"}
      </a>
      {tab === "today" && (
        <time className="floating-date" dateTime={dayKey(clock)}>
          {localeDate(clock, locale)}
        </time>
      )}
      {!online && (
        <span className="offline-indicator" role="status">
          {t.offline}
        </span>
      )}
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
                    rotateY: 0,
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
                    rotateY: 0,
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
                <HomeWorld
                  locale={locale}
                  reduced={reduced}
                  mode={mode}
                  reaction={sceneReaction}
                  onReact={(kind) => setSceneReaction({ kind, id: Date.now() })}
                  onReveal={() => {
                    hasShownToday.current = true;
                    setPanelRaised(true);
                    setPanelCollapsed(false);
                  }}
                />
                <motion.section
                  id="today-habits"
                  className={`today-panel ${panelCollapsed ? "is-collapsed" : ""}`}
                  initial={false}
                  animate={{ y: !panelRaised || panelCollapsed ? "calc(100% - 112px)" : 0 }}
                  transition={reduced ? { duration: 0 } : {
                    duration: 0.85,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <button
                    className="panel-grip"
                    aria-label={
                      !panelRaised || panelCollapsed
                        ? locale === "fa" ? "باز کردن عادت‌های امروز" : "Open today's habits"
                        : locale === "fa" ? "جمع کردن عادت‌های امروز" : "Collapse today's habits"
                    }
                    aria-expanded={panelRaised && !panelCollapsed}
                    onClick={() => {
                      hasShownToday.current = true;
                      if (!panelRaised) {
                        setPanelRaised(true);
                        setPanelCollapsed(false);
                      } else setPanelCollapsed((value) => !value);
                    }}
                  >
                    <span />
                  </button>
                  <div className="section-heading">
                    <div>
                      <span className="eyebrow">{num(active.length, locale)} / {num(3, locale)}</span>
                      <h2>{t.today}</h2>
                    </div>
                  </div>
                  <div className="today-panel-content" inert={!panelRaised || panelCollapsed}>
                  {active.length === 0 ? (
                    <div className="empty-card">
                      <Leaf size={27} />
                      <p>{t.empty}</p>
                      <button
                        className="paper-button"
                        onClick={() => go("insights")}
                      >
                        {t.toInsights}
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
                          busy={busy}
                          reduced={reduced}
                        />
                      ))}
                    </div>
                  )}
                  </div>
                </motion.section>
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
                <div className="paper-panel insight-habit-action">
                  <div>
                    <strong>{t.active} · {num(active.length, locale)} / {num(3, locale)}</strong>
                    <p>{active.length >= 3 ? t.full : locale === "fa" ? "برای یک قدم روزانهٔ تازه جا داری." : "There is room for another daily step."}</p>
                  </div>
                  <button className="paper-button" disabled={active.length >= 3} onClick={() => setCreating(true)}>
                    <Plus size={18} /> {t.create}
                  </button>
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
                  <button className="reset-link" onClick={() => setResetConfirm(true)}>
                    <Trash2 size={17} /> {t.reset}
                  </button>
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
              </section>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      <nav className="bottom-nav" aria-label="Primary">
        {tabs.map((id, i) => {
          const Icon = [House, BookOpen, ChartNoAxesCombined, Menu][i];
          return (
            <motion.button
              key={id}
              whileTap={reduced ? {} : { scale: 0.9 }}
              className={tab === id ? "active" : ""}
              aria-current={tab === id ? "page" : undefined}
              onClick={() => go(id)}
            >
              {tab === id && (
                <motion.span
                  className="nav-selection"
                  layoutId="selected-tab"
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 420, damping: 34 }
                  }
                />
              )}
              <Icon size={22} strokeWidth={tab === id ? 2.4 : 1.8} />
              <span>{t[id]}</span>
            </motion.button>
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
        open={resetConfirm}
        onOpenChange={setResetConfirm}
        title={t.reset}
      >
        <p>{t.resetWarning}</p>
        <div className="dialog-actions">
          <button className="paper-button secondary" onClick={() => setResetConfirm(false)}>{t.cancel}</button>
          <button className="paper-button danger" disabled={busy} onClick={() => {
            setResetConfirm(false);
            void run(resetApp);
          }}>{t.resetConfirm}</button>
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
      {error && (
        <div role="alert" className="toast" onClick={() => setError("")}>
          {error}
          <X size={15} />
        </div>
      )}
    </div>
  );
}
