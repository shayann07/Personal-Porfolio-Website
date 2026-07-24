import { createFileRoute } from "@tanstack/react-router";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowUpRight,
  Code2,
  Cpu,
  Layers,
  Mail,
  MapPin,
  Pause,
  Play,
  Rocket,
  Sparkles,
  Monitor,
  Moon,
  Sun,
  X,
  Zap,
} from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { personalLinks } from "@/config/personalLinks";
import { CV_URL } from "@/config/links";

/* ==========================================================
   Small premium widgets
   ========================================================== */
function LiveClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const t = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Karachi",
  });
  return (
    <span className="font-mono tabular-nums text-[11px] tracking-[0.2em] text-white/70">
      {t} <span className="text-white/30">PKT</span>
    </span>
  );
}

function Waveform({ bars = 24 }: { bars?: number }) {
  return (
    <div className="flex h-8 items-end gap-[3px]" aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className="bar w-[3px] rounded-full bg-linear-to-t from-fuchsia-400 via-violet-400 to-cyan-300"
          style={{
            height: `${20 + ((i * 37) % 80)}%`,
            animationDelay: `${(i * 90) % 1400}ms`,
            animationDuration: `${900 + ((i * 137) % 900)}ms`,
          }}
        />
      ))}
    </div>
  );
}

function Sparkline({ color = "oklch(0.72 0.24 300)" }: { color?: string }) {
  const points = "0,20 12,14 24,17 36,10 48,13 60,6 72,9 84,3 96,7";
  return (
    <svg viewBox="0 0 96 24" className="h-6 w-24" aria-hidden="true">
      <defs>
        <linearGradient id="sl" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.4" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`${points} 96,24 0,24`} fill="url(#sl)" />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Muhammad Shayan — Senior Android & Flutter Engineer" },
      {
        name: "description",
        content:
          "Portfolio of Muhammad Shayan: offline-first mobile architecture, on-device ML, and production-grade Android & Flutter apps shipped at scale.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Muhammad Shayan — Senior Mobile Engineer" },
      {
        property: "og:description",
        content:
          "Offline-first mobile architecture, on-device ML, and production-grade Android & Flutter apps.",
      },
      { property: "og:image", content: "/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Muhammad Shayan — Senior Mobile Engineer" },
      { name: "twitter:image", content: "/og-image.png" },
      { name: "theme-color", content: "#0a0a12" },
    ],
    links: [{ rel: "canonical", href: "https://shayxo.dev" }],
  }),
  component: Index,
});

/* ==========================================================
   Motion preferences (system + user override, persisted)
   ========================================================== */
type MotionPref = "auto" | "on" | "off";
const MotionPrefCtx = createContext<{
  reduced: boolean;
  pref: MotionPref;
  setPref: (p: MotionPref) => void;
}>({ reduced: false, pref: "auto", setPref: () => {} });

function useMotionPref() {
  return useContext(MotionPrefCtx);
}

function MotionPrefProvider({ children }: { children: ReactNode }) {
  const systemReduced = useReducedMotion() ?? false;
  const [pref, setPrefState] = useState<MotionPref>("auto");

  useEffect(() => {
    try {
      const v = localStorage.getItem("motion-pref") as MotionPref | null;
      if (v === "on" || v === "off" || v === "auto") setPrefState(v);
    } catch { /* ignore */ }
  }, []);

  const setPref = useCallback((p: MotionPref) => {
    setPrefState(p);
    try { localStorage.setItem("motion-pref", p); } catch { /* ignore */ }
  }, []);

  const reduced = pref === "off" ? true : pref === "on" ? false : systemReduced;

  const value = useMemo(() => ({ reduced, pref, setPref }), [reduced, pref, setPref]);

  return (
    <MotionPrefCtx.Provider value={value}>
      <MotionConfig reducedMotion={reduced ? "always" : "never"}>{children}</MotionConfig>
    </MotionPrefCtx.Provider>
  );
}

/* ==========================================================
   Theme (system / light / dark) — applies .light or .dark on <html>
   ========================================================== */
type ThemePref = "system" | "light" | "dark";
const ThemeCtx = createContext<{
  pref: ThemePref;
  resolved: "light" | "dark";
  setPref: (p: ThemePref) => void;
}>({ pref: "system", resolved: "dark", setPref: () => {} });

function useTheme() {
  return useContext(ThemeCtx);
}

function ThemeProvider({ children }: { children: ReactNode }) {
  const [pref, setPrefState] = useState<ThemePref>("dark");
  const [systemDark, setSystemDark] = useState(true);

  useEffect(() => {
    try {
      const v = localStorage.getItem("theme-pref") as ThemePref | null;
      if (v === "system" || v === "light" || v === "dark") setPrefState(v);
    } catch { /* ignore */ }
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => setSystemDark(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const resolved: "light" | "dark" =
    pref === "system" ? (systemDark ? "dark" : "light") : pref;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolved);
  }, [resolved]);

  const setPref = useCallback((p: ThemePref) => {
    setPrefState(p);
    try { localStorage.setItem("theme-pref", p); } catch { /* ignore */ }
  }, []);

  const value = useMemo(() => ({ pref, resolved, setPref }), [pref, resolved, setPref]);
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

function ThemeToggle() {
  const { pref, setPref } = useTheme();
  const next: ThemePref = pref === "system" ? "light" : pref === "light" ? "dark" : "system";
  const Icon = pref === "system" ? Monitor : pref === "light" ? Sun : Moon;
  return (
    <button
      type="button"
      onClick={() => setPref(next)}
      aria-label={`Theme: ${pref}. Switch to ${next}.`}
      title={`Theme: ${pref} — click for ${next}`}
      className="fixed bottom-4 right-36 z-40 inline-flex items-center gap-2 rounded-full glass px-3 py-2 text-[11px] font-medium text-white/80 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400"
    >
      <Icon className="h-3 w-3" />
      <span className="capitalize">{pref}</span>
    </button>
  );
}

/* ==========================================================
   Perf HUD — dev-only FPS + frame-time sampler
   ========================================================== */
function PerfHUD() {
  const [stats, setStats] = useState({ fps: 0, ms: 0, p99: 0 });
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const samples: number[] = [];
    let acc = 0;
    let frames = 0;

    const tick = (t: number) => {
      const dt = t - last;
      last = t;
      samples.push(dt);
      if (samples.length > 120) samples.shift();
      acc += dt;
      frames++;
      if (acc >= 500) {
        const fps = Math.round((frames / acc) * 1000);
        const ms = +(acc / frames).toFixed(2);
        const sorted = [...samples].sort((a, b) => a - b);
        const p99 = +(sorted[Math.floor(sorted.length * 0.99)] ?? ms).toFixed(2);
        setStats({ fps, ms, p99 });
        acc = 0;
        frames = 0;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const good = stats.fps >= 55;
  const okay = stats.fps >= 40;
  const color = good ? "text-emerald-300" : okay ? "text-amber-300" : "text-rose-300";
  return (
    <div
      aria-hidden="true"
      className="fixed bottom-4 left-4 z-40 flex items-center gap-3 rounded-full glass px-3 py-2 font-mono text-[10px] leading-none tracking-wider text-white/70"
    >
      <span className={`font-semibold ${color}`}>{stats.fps} fps</span>
      <span className="h-2 w-px bg-white/20" />
      <span>{stats.ms.toFixed(1)}ms</span>
      <span className="text-white/40">p99 {stats.p99.toFixed(1)}</span>
    </div>
  );
}

/* ==========================================================
   Backdrop — aurora blobs with scroll parallax + intensifying blur
   ========================================================== */
function AuroraBackdrop() {
  const { reduced } = useMotionPref();
  const { scrollY } = useScroll();
  // Parallax offsets, damped with spring for buttery motion
  const y1 = useSpring(useTransform(scrollY, [0, 1500], [0, -220]), {
    stiffness: 60,
    damping: 20,
    mass: 0.6,
  });
  const y2 = useSpring(useTransform(scrollY, [0, 1500], [0, -120]), {
    stiffness: 60,
    damping: 20,
    mass: 0.6,
  });
  const y3 = useSpring(useTransform(scrollY, [0, 1500], [0, 180]), {
    stiffness: 60,
    damping: 20,
    mass: 0.6,
  });
  const opacity = useTransform(scrollY, [0, 900], [1, 0.55]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <motion.div
        className="aurora-blob"
        style={{
          top: "-20%",
          left: "-10%",
          width: "60vw",
          height: "60vw",
          background:
            "radial-gradient(circle, oklch(0.72 0.24 300 / 0.9), transparent 60%)",
          animation: reduced ? "none" : "aurora-drift 24s ease-in-out infinite",
          y: reduced ? 0 : y1,
          opacity,
          willChange: "transform, opacity",
        }}
      />
      <motion.div
        className="aurora-blob"
        style={{
          top: "10%",
          right: "-20%",
          width: "55vw",
          height: "55vw",
          background:
            "radial-gradient(circle, oklch(0.78 0.18 210 / 0.85), transparent 60%)",
          animation: reduced ? "none" : "aurora-drift-2 28s ease-in-out infinite",
          y: reduced ? 0 : y2,
          opacity,
          willChange: "transform, opacity",
        }}
      />
      <motion.div
        className="aurora-blob"
        style={{
          bottom: "-25%",
          left: "20%",
          width: "50vw",
          height: "50vw",
          background:
            "radial-gradient(circle, oklch(0.72 0.24 25 / 0.7), transparent 60%)",
          animation: reduced ? "none" : "aurora-drift 32s ease-in-out infinite reverse",
          y: reduced ? 0 : y3,
          opacity,
          willChange: "transform, opacity",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(1 0 0 / 1) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 1) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />
    </div>
  );
}

/* ==========================================================
   Cursor spotlight — GPU translate3d only, no per-frame gradient string
   ========================================================== */
function CursorSpot() {
  const { reduced } = useMotionPref();
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 90, damping: 22, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 90, damping: 22, mass: 0.4 });

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let nx = -400;
    let ny = -400;
    const move = (e: MouseEvent) => {
      nx = e.clientX;
      ny = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          x.set(nx);
          y.set(ny);
          raf = 0;
        });
      }
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced, x, y]);

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-30 hidden h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full md:block"
      style={{
        x: sx,
        y: sy,
        background:
          "radial-gradient(closest-side, oklch(0.72 0.24 300 / 0.18), transparent 70%)",
        willChange: "transform",
      }}
    />
  );
}

/* ==========================================================
   Tile — glass card with viewport reveal, spotlight, keyboard support
   ========================================================== */
function Tile({
  children,
  className = "",
  variant = "glass",
  index = 0,
  id,
  as = "div",
  onActivate,
  ariaLabel,
  tilt = true,
  sheen = true,
  frost = true,
}: {
  children: ReactNode;
  className?: string;
  variant?: "glass" | "strong" | "solid";
  index?: number;
  id?: string;
  as?: "div" | "button" | "article";
  onActivate?: () => void;
  ariaLabel?: string;
  tilt?: boolean;
  sheen?: boolean;
  frost?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionPref();

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const mx = e.clientX - r.left;
    const my = e.clientY - r.top;
    el.style.setProperty("--mx", `${mx}px`);
    el.style.setProperty("--my", `${my}px`);
    if (tilt) {
      const rx = ((my / r.height) - 0.5) * -6;
      const ry = ((mx / r.width) - 0.5) * 6;
      el.style.setProperty("--rx", `${rx}deg`);
      el.style.setProperty("--ry", `${ry}deg`);
    }
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
  };

  const base =
    variant === "solid"
      ? "bg-linear-to-br from-white/[0.08] to-white/[0.02] border border-white/10"
      : variant === "strong"
        ? "glass-strong"
        : "glass";

  const interactive = Boolean(onActivate);
  const role = interactive ? "button" : as === "article" ? "article" : undefined;

  return (
    <motion.div
      ref={ref}
      id={id}
      role={role}
      aria-label={ariaLabel}
      tabIndex={interactive ? 0 : undefined}
      onMouseMove={reduced ? undefined : onMove}
      onMouseLeave={reduced ? undefined : onLeave}
      onClick={onActivate}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onActivate?.();
              }
            }
          : undefined
      }
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: reduced ? 0 : 0.6,
        delay: reduced ? 0 : Math.min(index, 6) * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`spot tile-hover ${sheen ? "sheen" : ""} ${frost ? "frost" : ""} relative flex flex-col overflow-hidden rounded-3xl p-6 ${base} ${
        interactive
          ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          : ""
      } ${className}`}
      style={{
        willChange: "transform, opacity",
        transformStyle: "preserve-3d",
        transform:
          "perspective(1200px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
      }}
    >
      <div className="relative z-[2] flex h-full w-full flex-col">{children}</div>
    </motion.div>
  );
}

/* ==========================================================
   Animated counter — respects reduced motion
   ========================================================== */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const { reduced } = useMotionPref();
  const [v, setV] = useState(reduced ? to : 0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduced) {
      setV(to);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        const start = performance.now();
        const dur = 1400;
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          setV(Math.round(to * eased * 10) / 10);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.disconnect();
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, reduced]);

  return (
    <span ref={ref}>
      {Number.isInteger(to) ? Math.round(v) : v.toFixed(1)}
      {suffix}
    </span>
  );
}

/* ==========================================================
   Data
   ========================================================== */
type Project = {
  id: string;
  tag: string;
  title: string;
  body: string;
  metric: string;
  metricLabel: string;
  accent: string;
  icon: ComponentType<{ className?: string }>;
  summary: string;
  role: string;
  year: string;
  tech: string[];
  gallery: { title: string; caption: string; gradient: string }[];
  links: { label: string; href: string }[];
};

const projects: Project[] = [
  {
    id: "nexus-pay",
    tag: "Fintech · Flutter",
    title: "Nexus Pay",
    body: "Cross-platform banking with offline-first sync. 100k+ downloads, 99.9% crash-free.",
    metric: "99.9%",
    metricLabel: "Crash-free",
    accent: "from-fuchsia-400/40 to-violet-500/40",
    icon: Rocket,
    summary:
      "A challenger banking app built for emerging markets. Offline-first ledger, biometric-signed transactions, and a tokenized card system that keeps the wallet usable even on flaky 2G.",
    role: "Lead Flutter Engineer",
    year: "2024",
    tech: ["Flutter", "Dart", "BLoC", "Drift (SQLite)", "gRPC", "Firebase App Check", "Sentry"],
    gallery: [
      { title: "Home", caption: "Balance + spend timeline", gradient: "from-fuchsia-500/60 via-violet-500/50 to-cyan-400/50" },
      { title: "Transfer", caption: "Signed offline queue", gradient: "from-violet-500/60 via-fuchsia-500/40 to-rose-400/40" },
      { title: "Card", caption: "Tokenized virtual card", gradient: "from-cyan-400/60 via-violet-500/40 to-fuchsia-500/40" },
    ],
    links: [
      { label: "Case study", href: "#" },
      { label: "Play Store", href: "#" },
    ],
  },
  {
    id: "pulse-track",
    tag: "Health · Android",
    title: "PulseTrack",
    body: "On-device ML for heart-rate variability with TensorFlow Lite and Compose.",
    metric: "42%",
    metricLabel: "Faster inference",
    accent: "from-cyan-400/40 to-blue-500/40",
    icon: Cpu,
    summary:
      "A cardio health companion. HRV, sleep and stress inferred on-device with a quantized TFLite model. No cloud round-trip, no PII leaving the phone.",
    role: "Android Tech Lead",
    year: "2023",
    tech: ["Kotlin", "Jetpack Compose", "Coroutines", "TensorFlow Lite", "Health Connect", "Room"],
    gallery: [
      { title: "Dashboard", caption: "Live HRV + trend", gradient: "from-cyan-400/60 via-blue-500/50 to-violet-500/40" },
      { title: "Insights", caption: "Weekly ML report", gradient: "from-blue-500/60 via-cyan-400/40 to-emerald-400/40" },
      { title: "Session", caption: "Guided breathing", gradient: "from-emerald-400/50 via-cyan-400/50 to-blue-500/40" },
    ],
    links: [
      { label: "Case study", href: "#" },
      { label: "Tech write-up", href: "#" },
    ],
  },
  {
    id: "cargo-os",
    tag: "Logistics · Flutter",
    title: "Cargo OS",
    body: "Fleet ops console. Offline-first BLoC architecture syncing 10k+ events per shift.",
    metric: "10k+",
    metricLabel: "Events / shift",
    accent: "from-rose-400/40 to-orange-500/40",
    icon: Layers,
    summary:
      "Warehouse + last-mile operating system used by dispatchers and drivers. Event-sourced sync, deterministic conflict resolution, and a tablet-first design.",
    role: "Mobile Architect",
    year: "2023",
    tech: ["Flutter", "Dart", "BLoC", "Isar", "Mapbox", "WebSockets"],
    gallery: [
      { title: "Dispatch", caption: "Route planning grid", gradient: "from-rose-400/60 via-orange-500/50 to-amber-400/40" },
      { title: "Driver", caption: "Turn-by-turn ops", gradient: "from-orange-500/60 via-rose-400/40 to-fuchsia-500/40" },
      { title: "Audit", caption: "Event replay", gradient: "from-amber-400/60 via-orange-500/40 to-rose-400/40" },
    ],
    links: [{ label: "Case study", href: "#" }],
  },
  {
    id: "swift-cart",
    tag: "Commerce · Android",
    title: "SwiftCart",
    body: "Native shopping with edge-cached product graphs. Cut cold-start by 58%.",
    metric: "58%",
    metricLabel: "Faster cold-start",
    accent: "from-emerald-400/40 to-teal-500/40",
    icon: Zap,
    summary:
      "Native storefront rebuilt around Baseline Profiles, prefetch heuristics and an edge-cached product graph. Startup went from sluggish to instant on mid-tier devices.",
    role: "Senior Android Engineer",
    year: "2022",
    tech: ["Kotlin", "Jetpack Compose", "Baseline Profiles", "Apollo GraphQL", "Coil", "Hilt"],
    gallery: [
      { title: "Home", caption: "Personalized rail", gradient: "from-emerald-400/60 via-teal-500/50 to-cyan-400/40" },
      { title: "PDP", caption: "Instant hero swap", gradient: "from-teal-500/60 via-emerald-400/40 to-blue-500/40" },
      { title: "Checkout", caption: "One-tap wallet", gradient: "from-cyan-400/60 via-teal-500/40 to-emerald-400/40" },
    ],
    links: [{ label: "Case study", href: "#" }],
  },
];

const stack = [
  "Flutter", "Kotlin", "Jetpack Compose", "Dart", "TensorFlow Lite", "Firebase",
  "Clean Architecture", "Offline-First", "Coroutines", "BLoC", "CI / CD", "Android SDK",
];

const timeline = [
  { range: "2023 — Now", role: "Senior Flutter Engineer", body: "Consumer fintech · 1M+ users.", active: true },
  { range: "2021 — 2023", role: "Android Developer", body: "Native retail & logistics at scale." },
  { range: "2020", role: "Mobile Engineer", body: "Kotlin · MVVM · Clean Architecture." },
];

/* ==========================================================
   Project modal — focus trap, ESC, backdrop, AnimatePresence
   ========================================================== */
function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const { reduced } = useMotionPref();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!project) return;
    lastFocused.current = document.activeElement as HTMLElement | null;
    // Scroll-lock via position:fixed — preserves scroll offset across open/close
    // and avoids the layout jump that overflow:hidden causes on iOS.
    const scrollY = window.scrollY;
    const body = document.body;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    // focus close on next tick
    const t = setTimeout(() => closeRef.current?.focus(), 40);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      window.scrollTo(0, scrollY);
      clearTimeout(t);
      // Restore focus after paint so scroll restoration lands first
      requestAnimationFrame(() => lastFocused.current?.focus?.());
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto p-2 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.2, ease: "easeOut" }}
          aria-hidden={false}
        >
          <motion.button
            aria-label="Close project details"
            className="absolute inset-0 bg-black/75"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ willChange: "opacity" }}
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`modal-${project.id}-title`}
            className="glass-strong relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl"
            initial={{ y: reduced ? 0 : 24, opacity: 0, scale: reduced ? 1 : 0.985 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: reduced ? 0 : 12, opacity: 0, scale: reduced ? 1 : 0.985 }}
            transition={{ duration: reduced ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ willChange: "transform, opacity", transform: "translateZ(0)" }}
          >
            <div className={`relative h-40 w-full bg-linear-to-br ${project.accent}`}>
              <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/70">
                    {project.tag} · {project.year}
                  </p>
                  <h2
                    id={`modal-${project.id}-title`}
                    className="font-display text-3xl font-semibold text-white md:text-4xl"
                  >
                    {project.title}
                  </h2>
                </div>
                <button
                  ref={closeRef}
                  onClick={onClose}
                  aria-label="Close"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white transition hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-6 p-6 md:p-8">
              <p className="text-sm leading-relaxed text-white/75 md:text-base">
                {project.summary}
              </p>

              <div className="grid grid-cols-3 gap-3">
                {project.gallery.map((g) => (
                  <figure
                    key={g.title}
                    className="group overflow-hidden rounded-xl border border-white/10"
                  >
                    <div
                      className={`aspect-[3/4] w-full bg-linear-to-br ${g.gradient} transition-transform duration-700 group-hover:scale-105`}
                    />
                    <figcaption className="bg-white/[0.03] p-2 text-[10px] text-white/60">
                      <div className="font-mono uppercase tracking-widest text-white/80">
                        {g.title}
                      </div>
                      <div>{g.caption}</div>
                    </figcaption>
                  </figure>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-white/40">Role</p>
                  <p className="mt-1 text-sm text-white/85">{project.role}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-white/40">
                    Tech stack
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-white/80"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 border-t border-white/10 pt-5">
                {project.links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400"
                  >
                    {l.label}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ==========================================================
   Motion preferences toggle (fixed corner)
   ========================================================== */
function MotionToggle() {
  const { reduced, setPref } = useMotionPref();
  return (
    <button
      type="button"
      onClick={() => setPref(reduced ? "on" : "off")}
      aria-pressed={reduced}
      aria-label={
        reduced ? "Enable animations" : "Reduce animations for accessibility"
      }
      className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full glass px-3 py-2 text-[11px] font-medium text-white/80 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400"
    >
      {reduced ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
      {reduced ? "Motion off" : "Motion on"}
    </button>
  );
}

/* ==========================================================
   Sticky nav — glass blur intensifies as you scroll
   ========================================================== */
function Nav() {
  const { scrollY } = useScroll();
  const blur = useTransform(scrollY, [0, 400], [12, 32]);
  const saturate = useTransform(scrollY, [0, 400], [140, 200]);
  const bgAlpha = useTransform(scrollY, [0, 400], [0.04, 0.1]);
  const filter = useTransform(
    [blur, saturate] as const,
    ([b, s]) => `blur(${b}px) saturate(${s}%)`,
  );
  const background = useTransform(
    bgAlpha,
    (a) => `linear-gradient(135deg, oklch(1 0 0 / ${a + 0.02}) 0%, oklch(1 0 0 / ${a}) 100%)`,
  );

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-4 z-40 mx-auto mt-4 flex w-[min(1100px,94%)] items-center justify-between rounded-full border border-white/10 px-5 py-3 shadow-[0_20px_60px_-30px_oklch(0_0_0/0.6)]"
      style={{
        backdropFilter: filter,
        background,
        willChange: "backdrop-filter, background",
      }}
      role="banner"
    >
      <a
        href="#top"
        className="flex items-center gap-2 font-display text-sm font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 rounded-full"
        aria-label="Muhammad Shayan — home"
      >
        <span className="relative inline-flex h-2.5 w-2.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-fuchsia-400/60" />
          <span className="relative h-2.5 w-2.5 rounded-full bg-linear-to-br from-fuchsia-400 to-cyan-400" />
        </span>
        shayan<span className="text-white/40">.dev</span>
      </a>
      <nav aria-label="Primary" className="hidden items-center gap-7 text-xs font-medium tracking-wide text-white/70 md:flex">
        <a href="#work" className="transition hover:text-white focus-visible:outline-none focus-visible:text-white">Work</a>
        <a href="#stack" className="transition hover:text-white focus-visible:outline-none focus-visible:text-white">Stack</a>
        <a href="#timeline" className="transition hover:text-white focus-visible:outline-none focus-visible:text-white">Journey</a>
        <a href="#contact" className="transition hover:text-white focus-visible:outline-none focus-visible:text-white">Contact</a>
        <span className="mx-1 h-3 w-px bg-white/15" aria-hidden="true" />
        <LiveClock />
      </nav>
      <a
        href={CV_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-fuchsia-500 to-cyan-400 px-4 py-1.5 text-xs font-semibold text-black transition hover:shadow-[0_0_30px_-4px_oklch(0.72_0.24_300/0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        Résumé
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    </motion.header>
  );
}

/* ==========================================================
   Page
   ========================================================== */
function Index() {
  return (
    <ThemeProvider>
      <MotionPrefProvider>
        <IndexInner />
      </MotionPrefProvider>
    </ThemeProvider>
  );
}

function IndexInner() {
  const [active, setActive] = useState<Project | null>(null);
  const { reduced } = useMotionPref();

  return (
    <div id="top" className="relative min-h-screen overflow-x-hidden bg-paper text-deep-ink">
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:text-black"
      >
        Skip to content
      </a>

      <AuroraBackdrop />
      <CursorSpot />
      <Nav />

      <main id="main" className="relative">
        {/* ============================================================
            HERO BAND
           ============================================================ */}
        <section
          aria-label="Introduction"
          className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 md:px-20"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-[560px] w-[560px] rounded-full bg-[oklch(0.75_0.16_300/0.28)] blur-[130px]" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-[560px] w-[560px] rounded-full bg-[oklch(0.85_0.18_155/0.22)] blur-[130px]" aria-hidden="true" />

          <motion.div
            initial={{ opacity: 0, y: reduced ? 0 : 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mx-auto w-full max-w-6xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/[0.06] px-3 py-1.5 font-display text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-300 backdrop-blur">
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/70" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Senior Mobile Engineer · Available Q3 2026
            </span>

            <h1 className="mt-8 font-display text-6xl font-extrabold leading-[0.92] tracking-tighter text-white md:text-8xl lg:text-9xl">
              Muhammad
              <br />
              <span className="bg-linear-to-r from-[oklch(0.85_0.18_155)] via-[oklch(0.80_0.15_200)] to-[oklch(0.75_0.16_300)] bg-clip-text text-transparent">
                Shayan<span className="text-white/95">.</span>
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg font-light leading-relaxed text-white/60 md:text-2xl">
              Architecting scalable mobile systems and immersive digital experiences at the
              intersection of high-performance native code and fluid UI.
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-4">
              <a
                href="#work"
                className="group inline-flex items-center gap-2 rounded-full bg-[oklch(0.85_0.18_155)] px-8 py-4 font-display text-sm font-bold text-[oklch(0.17_0.045_275)] transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                View Projects
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-8 py-4 font-display text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Get in Touch
              </a>
            </div>
          </motion.div>

          {/* scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
            className="pointer-events-none absolute inset-x-0 bottom-8 z-10 mx-auto flex w-fit flex-col items-center gap-2 text-white/40"
            aria-hidden="true"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.32em]">Scroll</span>
            <span className="h-10 w-px bg-linear-to-b from-white/40 to-transparent" />
          </motion.div>
        </section>

        {/* ============================================================
            SELECTED WORK BAND
           ============================================================ */}
        <section id="work" aria-label="Selected work" className="relative px-6 py-32 md:px-20 md:py-40">
          <div className="mx-auto max-w-6xl">
            <div className="mb-20 flex items-end justify-between">
              <h2 className="font-display text-4xl font-bold text-white md:text-5xl">Selected Work</h2>
              <div className="font-mono text-sm text-white/40">
                01 <span className="text-white/25">/</span> {String(projects.length).padStart(2, "0")}
              </div>
            </div>

            <div className="space-y-32 md:space-y-40">
              {projects.map((p, i) => {
                const flip = i % 2 === 1;
                return (
                  <motion.article
                    key={p.id}
                    initial={{ opacity: 0, y: reduced ? 0 : 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-120px" }}
                    transition={{ duration: reduced ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative"
                  >
                    <div className={`absolute -inset-8 bg-linear-to-r ${p.accent} opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100`} aria-hidden="true" />
                    <div className={`relative flex flex-col items-center gap-10 md:flex-row md:gap-16 ${flip ? "md:flex-row-reverse" : ""}`}>
                      <button
                        type="button"
                        onClick={() => setActive(p)}
                        aria-label={`Open case study for ${p.title}`}
                        className="relative block w-full overflow-hidden rounded-3xl border border-white/10 bg-[oklch(0.24_0.06_265/0.5)] shadow-[0_40px_120px_-40px_oklch(0_0_0/0.7)] backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 md:w-3/5"
                      >
                        <div className={`relative aspect-video w-full bg-linear-to-br ${p.gallery[0].gradient}`}>
                          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="font-display text-6xl font-extrabold tracking-tighter text-white/15">
                              {p.title}
                            </span>
                          </div>
                          <div className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition group-hover:bg-white/20">
                            <ArrowUpRight className="h-4 w-4" />
                          </div>
                        </div>
                      </button>

                      <div className="w-full md:w-2/5">
                        <span className="font-mono text-xs uppercase tracking-[0.28em] text-[oklch(0.75_0.16_300)]">
                          {p.tag}
                        </span>
                        <h3 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
                          {p.title}
                        </h3>
                        <p className="mt-6 leading-relaxed text-white/60 md:text-lg">
                          {p.summary}
                        </p>
                        <div className="mt-6 flex flex-wrap gap-2">
                          {p.tech.slice(0, 4).map((t) => (
                            <span key={t} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-white/60">
                              {t}
                            </span>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => setActive(p)}
                          className="group/link mt-8 inline-flex items-center gap-2 font-display text-sm font-bold text-[oklch(0.85_0.18_155)] transition-all hover:gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 rounded"
                        >
                          Explore Case Study
                          <span aria-hidden="true">→</span>
                        </button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================================================
            STORY BAND — pull quote
           ============================================================ */}
        <section
          aria-label="The story"
          className="relative border-y border-white/5 bg-[oklch(0.24_0.06_265/0.3)] px-6 py-40 backdrop-blur-3xl md:px-20"
        >
          <motion.div
            initial={{ opacity: 0, y: reduced ? 0 : 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: reduced ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-4xl text-center"
          >
            <h2 className="font-display text-xl font-semibold text-[oklch(0.75_0.16_300)]">The Story</h2>
            <p className="mt-8 font-display text-3xl font-light leading-tight text-white/95 md:text-5xl">
              I build software that balances{" "}
              <span className="font-serif italic text-white">brutal efficiency</span>{" "}
              with{" "}
              <span className="text-[oklch(0.85_0.18_155)]">human-centric design</span>.
              Six years of breaking things to learn how to build them better.
            </p>
          </motion.div>
        </section>

        {/* ============================================================
            SKILLS + COMMAND CENTER BAND
           ============================================================ */}
        <section id="stack" aria-label="Technical arsenal" className="relative px-6 py-32 md:px-20 md:py-40">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 md:grid-cols-2 md:gap-24">
            <motion.div
              initial={{ opacity: 0, x: reduced ? 0 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: reduced ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="font-display text-4xl font-bold text-white md:text-5xl">
                Technical Arsenal
              </h2>
              <p className="mt-4 max-w-md text-white/50">
                The daily instruments — from native mobile runtimes to distributed backends and CI orchestration.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                {stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-white/10 bg-[oklch(0.24_0.06_265/0.6)] px-5 py-2.5 font-display text-sm text-white/85 backdrop-blur transition hover:border-[oklch(0.85_0.18_155/0.4)] hover:text-white"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: reduced ? 0 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: reduced ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="glass-strong rounded-3xl p-10 md:p-12"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-[oklch(0.85_0.18_155)]">
                  Command Center
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
                  Live · v2026
                </span>
              </div>
              <div className="mt-10 grid grid-cols-2 gap-y-10">
                {[
                  { to: 2.4, suffix: "k+", label: "GitHub commits", color: "oklch(0.85 0.18 155)" },
                  { to: 99.9, suffix: "%", label: "System uptime", color: "oklch(0.75 0.16 300)" },
                  { to: 24, suffix: "", label: "Shipped apps", color: "oklch(0.80 0.15 200)" },
                  { to: 6, suffix: "y", label: "Experience", color: "oklch(0.85 0.18 155)" },
                ].map((m) => (
                  <div key={m.label}>
                    <div className="font-display text-4xl font-extrabold leading-none text-white md:text-5xl">
                      <Counter to={m.to} suffix={m.suffix} />
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="text-[10px] uppercase tracking-[0.24em] text-white/40">
                        {m.label}
                      </span>
                      <Sparkline color={m.color} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================================
            LAB BAND
           ============================================================ */}
        <section
          id="timeline"
          aria-label="The lab"
          className="relative bg-[oklch(0.24_0.06_265/0.15)] px-6 py-32 md:px-20 md:py-40"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 flex items-end justify-between">
              <h2 className="font-display text-4xl font-bold text-white md:text-5xl">The Lab</h2>
              <p className="hidden max-w-xs text-right text-sm text-white/40 md:block">
                Small experiments, side quests, and open-source tools shipped between contracts.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                {
                  title: "AetherDB",
                  body: "In-memory key-value store optimized for ephemeral edge caching.",
                  dot: "oklch(0.85 0.18 155)",
                },
                {
                  title: "Glitch Engine",
                  body: "Real-time image manipulation using WebGL and custom shaders.",
                  dot: "oklch(0.75 0.16 300)",
                },
                {
                  title: "Flux CLI",
                  body: "Minimalist deployment orchestrator for serverless edge functions.",
                  dot: "oklch(0.80 0.15 200)",
                },
              ].map((lab, i) => (
                <motion.div
                  key={lab.title}
                  initial={{ opacity: 0, y: reduced ? 0 : 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: reduced ? 0 : 0.7,
                    delay: reduced ? 0 : i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group rounded-3xl border border-white/5 bg-[oklch(0.24_0.06_265/0.5)] p-8 backdrop-blur-xl transition hover:border-[oklch(0.85_0.18_155/0.3)]"
                >
                  <div
                    className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                    style={{ background: `color-mix(in oklch, ${lab.dot} 15%, transparent)` }}
                  >
                    <span className="h-2 w-2 rounded-full" style={{ background: lab.dot }} />
                  </div>
                  <h4 className="font-display text-lg font-bold text-white">{lab.title}</h4>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{lab.body}</p>
                </motion.div>
              ))}
            </div>

            {/* Journey timeline underneath */}
            <div className="mt-24">
              <h3 className="mb-10 font-display text-xl font-bold uppercase tracking-[0.24em] text-white/40">
                Journey
              </h3>
              <ol className="relative space-y-8 pl-6">
                <div className="absolute left-[7px] top-1 bottom-1 w-px bg-linear-to-b from-[oklch(0.85_0.18_155/0.6)] via-[oklch(0.80_0.15_200/0.4)] to-[oklch(0.75_0.16_300/0.3)]" aria-hidden="true" />
                {timeline.map((t) => (
                  <li key={t.range} className="relative">
                    <span
                      className={`absolute -left-[22px] top-1.5 h-3 w-3 rounded-full ${
                        t.active
                          ? "bg-linear-to-br from-[oklch(0.85_0.18_155)] to-[oklch(0.75_0.16_300)] animate-pulse-ring"
                          : "bg-white/25"
                      }`}
                      aria-hidden="true"
                    />
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">{t.range}</p>
                    <h4 className="mt-1 font-display text-xl font-bold text-white">{t.role}</h4>
                    <p className="mt-1 text-sm text-white/55">{t.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ============================================================
            CONTACT BAND
           ============================================================ */}
        <section id="contact" aria-label="Contact" className="relative overflow-hidden px-6 py-48 text-center md:px-20">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0.85_0.18_155/0.12)] blur-[130px]" aria-hidden="true" />
          <motion.div
            initial={{ opacity: 0, y: reduced ? 0 : 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: reduced ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 mx-auto max-w-4xl"
          >
            <h2 className="font-display text-5xl font-extrabold tracking-tighter text-white md:text-8xl">
              Let&apos;s{" "}
              <span className="text-[oklch(0.85_0.18_155)]">Build</span>{" "}
              Together.
            </h2>
            <p className="mx-auto mt-10 max-w-2xl text-lg text-white/60 md:text-xl">
              Available for select architecture consulting, greenfield builds, and high-impact
              full-time roles.
            </p>
            <a
              href={personalLinks.email.link}
              className="mt-14 inline-block border-b-4 border-[oklch(0.75_0.16_300)] pb-4 font-display text-3xl font-bold text-white transition-colors hover:text-[oklch(0.75_0.16_300)] md:text-5xl"
              aria-label={`Email ${personalLinks.email.label}`}
            >
              {personalLinks.email.label}
            </a>
          </motion.div>
        </section>
      </main>

      {/* ============================================================
          FOOTER
         ============================================================ */}
      <footer className="relative border-t border-white/5 px-6 py-12 md:px-20" role="contentinfo">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-sm text-white/50 md:flex-row">
          <div className="font-mono">© 2026 Muhammad Shayan. All rights reserved.</div>
          <div className="flex gap-8 font-mono">
            <a href={personalLinks.github.link} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">Github</a>
            <a href={personalLinks.linkedin.link} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">LinkedIn</a>
            <a href={personalLinks.email.link} className="transition hover:text-white">Email</a>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inset-0 animate-ping rounded-full bg-[oklch(0.85_0.18_155/0.7)]" />
              <span className="relative h-2 w-2 rounded-full bg-[oklch(0.85_0.18_155)]" />
            </span>
            <span>Ready for new challenges</span>
          </div>
        </div>
      </footer>

      <MotionToggle />
      <ThemeToggle />
      {import.meta.env.DEV ? <PerfHUD /> : null}
      <ProjectModal project={active} onClose={() => setActive(null)} />
    </div>
  );
}
