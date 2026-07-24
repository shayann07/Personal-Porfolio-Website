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
          className="bar w-[3px] rounded-full bg-linear-to-t from-rose-400 via-rose-400 to-amber-300"
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
          ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
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
    accent: "from-rose-400/40 to-rose-500/40",
    icon: Rocket,
    summary:
      "A challenger banking app built for emerging markets. Offline-first ledger, biometric-signed transactions, and a tokenized card system that keeps the wallet usable even on flaky 2G.",
    role: "Lead Flutter Engineer",
    year: "2024",
    tech: ["Flutter", "Dart", "BLoC", "Drift (SQLite)", "gRPC", "Firebase App Check", "Sentry"],
    gallery: [
      { title: "Home", caption: "Balance + spend timeline", gradient: "from-rose-500/60 via-rose-500/50 to-amber-400/50" },
      { title: "Transfer", caption: "Signed offline queue", gradient: "from-rose-500/60 via-rose-500/40 to-rose-400/40" },
      { title: "Card", caption: "Tokenized virtual card", gradient: "from-amber-400/60 via-rose-500/40 to-rose-500/40" },
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
    accent: "from-amber-400/40 to-amber-500/40",
    icon: Cpu,
    summary:
      "A cardio health companion. HRV, sleep and stress inferred on-device with a quantized TFLite model. No cloud round-trip, no PII leaving the phone.",
    role: "Android Tech Lead",
    year: "2023",
    tech: ["Kotlin", "Jetpack Compose", "Coroutines", "TensorFlow Lite", "Health Connect", "Room"],
    gallery: [
      { title: "Dashboard", caption: "Live HRV + trend", gradient: "from-amber-400/60 via-amber-500/50 to-rose-500/40" },
      { title: "Insights", caption: "Weekly ML report", gradient: "from-amber-500/60 via-amber-400/40 to-amber-400/40" },
      { title: "Session", caption: "Guided breathing", gradient: "from-amber-400/50 via-amber-400/50 to-amber-500/40" },
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
      { title: "Driver", caption: "Turn-by-turn ops", gradient: "from-orange-500/60 via-rose-400/40 to-rose-500/40" },
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
    accent: "from-amber-400/40 to-amber-500/40",
    icon: Zap,
    summary:
      "Native storefront rebuilt around Baseline Profiles, prefetch heuristics and an edge-cached product graph. Startup went from sluggish to instant on mid-tier devices.",
    role: "Senior Android Engineer",
    year: "2022",
    tech: ["Kotlin", "Jetpack Compose", "Baseline Profiles", "Apollo GraphQL", "Coil", "Hilt"],
    gallery: [
      { title: "Home", caption: "Personalized rail", gradient: "from-amber-400/60 via-amber-500/50 to-amber-400/40" },
      { title: "PDP", caption: "Instant hero swap", gradient: "from-amber-500/60 via-amber-400/40 to-amber-500/40" },
      { title: "Checkout", caption: "One-tap wallet", gradient: "from-amber-400/60 via-amber-500/40 to-amber-400/40" },
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
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
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
      document.body.style.overflow = prevOverflow;
      clearTimeout(t);
      lastFocused.current?.focus?.();
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
          transition={{ duration: reduced ? 0 : 0.25 }}
          aria-hidden={false}
        >
          <motion.button
            aria-label="Close project details"
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`modal-${project.id}-title`}
            className="glass-strong relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl"
            initial={{ y: reduced ? 0 : 40, opacity: 0, scale: reduced ? 1 : 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: reduced ? 0 : 20, opacity: 0, scale: reduced ? 1 : 0.98 }}
            transition={{ duration: reduced ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
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
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
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
      className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full glass px-3 py-2 text-[11px] font-medium text-white/80 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
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
        className="flex items-center gap-2 font-display text-sm font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 rounded-full"
        aria-label="Muhammad Shayan — home"
      >
        <span className="relative inline-flex h-2.5 w-2.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-rose-400/60" />
          <span className="relative h-2.5 w-2.5 rounded-full bg-linear-to-br from-rose-400 to-amber-400" />
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
        className="group inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-rose-500 to-amber-400 px-4 py-1.5 text-xs font-semibold text-black transition hover:shadow-[0_0_30px_-4px_oklch(0.72_0.24_300/0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
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
    <MotionPrefProvider>
      <IndexInner />
    </MotionPrefProvider>
  );
}

function IndexInner() {
  const [active, setActive] = useState<Project | null>(null);

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

      <main id="main" className="relative mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        {/* ============ HERO BENTO ============ */}
        <section aria-label="Introduction" className="grid grid-cols-6 gap-3 md:grid-cols-12 md:gap-4">
          <Tile
            variant="strong"
            className="col-span-6 md:col-span-8 md:row-span-2 min-h-[360px] justify-between"
            index={0}
          >
            <div className="flex items-center gap-2 text-xs font-medium tracking-[0.24em] text-white/50">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              MOBILE ENGINEER · SINCE 2020
            </div>
            <div>
              <h1 className="font-display text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl">
                <span className="block text-white/95">Building</span>
                <span className="aurora-text block italic font-serif">weightless</span>
                <span className="block text-white/95">mobile software.</span>
              </h1>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-white/60">
                Offline-first architecture, on-device ML, and micro-interactions that feel
                inevitable. Android + Flutter, shipped to millions.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-black transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
              >
                Start a project
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <a
                href="#work"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-xs font-semibold text-white/80 transition hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
              >
                See work
              </a>
            </div>
          </Tile>

          <Tile
            className="col-span-3 md:col-span-4 md:row-span-2 items-center justify-center text-center min-h-[360px] aurora-border"
            index={1}
          >
            <div className="relative flex h-48 w-48 items-center justify-center">
              {/* Orbital rings */}
              <div className="absolute inset-0 rounded-full border border-white/15 orbit-slow" aria-hidden="true">
                <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-rose-400 shadow-[0_0_16px_4px_oklch(0.72_0.24_300/0.7)]" />
              </div>
              <div className="absolute inset-3 rounded-full border border-white/10 orbit-fast" aria-hidden="true">
                <span className="absolute -right-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-amber-300 shadow-[0_0_12px_3px_oklch(0.78_0.18_210/0.7)]" />
              </div>
              <div className="absolute inset-6 rounded-full border border-dashed border-white/10 orbit-slow" aria-hidden="true" />
              {/* Aurora halo */}
              <div className="absolute inset-4 rounded-full bg-linear-to-br from-rose-500 via-rose-500 to-amber-400 blur-3xl opacity-70 animate-pulse" aria-hidden="true" />
              {/* Core */}
              <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-linear-to-br from-rose-400 via-rose-500 to-amber-400 font-display text-4xl font-semibold text-black shadow-[inset_0_2px_0_oklch(1_0_0/0.6),0_20px_60px_-10px_oklch(0.72_0.24_300/0.55)]">
                MS
              </div>
            </div>
            <p className="mt-6 font-serif text-2xl italic text-white/95">Muhammad Shayan</p>
            <p className="mt-1 text-[10px] tracking-[0.28em] text-white/40">ISLAMABAD · REMOTE</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-emerald-300 backdrop-blur">
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/70" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Available Q3 · 2026
            </div>
          </Tile>

          {[
            { icon: Code2, label: "SHIPPED", to: 1, suffix: "M+", sub: "Users reached", strong: false, color: "oklch(0.78 0.18 210)" },
            { icon: Zap, label: "STABILITY", to: 99.9, suffix: "%", sub: "Crash-free sessions", strong: true, color: "oklch(0.72 0.24 300)" },
            { icon: Layers, label: "RELEASED", to: 24, suffix: "", sub: "Production apps", strong: false, color: "oklch(0.72 0.24 25)" },
            { icon: Sparkles, label: "EXPERIENCE", to: 6, suffix: "y", sub: "Building mobile", strong: false, color: "oklch(0.78 0.18 210)" },
          ].map((m, i) => {
            const Icon = m.icon;
            return (
              <Tile
                key={m.label}
                variant={m.strong ? "strong" : "glass"}
                className={`col-span-3 md:col-span-3 justify-between min-h-[160px] ${m.strong ? "aurora-border" : ""}`}
                index={i + 2}
              >
                <div className="flex items-center justify-between text-white/40">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span className="text-[10px] tracking-[0.24em]">{m.label}</span>
                </div>
                <div>
                  <div className={`font-display text-5xl font-semibold leading-none ${m.strong ? "aurora-text" : "text-white"}`}>
                    <Counter to={m.to} suffix={m.suffix} />
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-white/50">{m.sub}</span>
                    <Sparkline color={m.color} />
                  </div>
                </div>
              </Tile>
            );
          })}
        </section>

        {/* ============ WORK BENTO ============ */}
        <section id="work" aria-label="Selected work" className="mt-6 grid grid-cols-6 gap-3 md:grid-cols-12 md:gap-4">
          {projects.map((p, i) => {
            const Icon = p.icon;
            const span =
              i === 0
                ? "md:col-span-7 md:row-span-2 min-h-[420px]"
                : i === 1
                  ? "md:col-span-5 min-h-[260px]"
                  : "md:col-span-5 min-h-[240px]";
            return (
              <Tile
                key={p.title}
                variant={i === 0 ? "strong" : "glass"}
                className={`group col-span-6 justify-between ${span}`}
                index={i}
                as="article"
                onActivate={() => setActive(p)}
                ariaLabel={`Open case study for ${p.title}`}
              >
                <div
                  className={`absolute -top-24 -right-24 h-56 w-56 rounded-full bg-linear-to-br ${p.accent} blur-3xl opacity-70 transition-opacity duration-700 group-hover:opacity-100`}
                  aria-hidden="true"
                />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] tracking-[0.2em] text-white/60">
                      <Icon className="h-3 w-3" aria-hidden="true" />
                      {p.tag}
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-white/40 transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white" />
                  </div>
                  <h3
                    className={`mt-6 font-display font-semibold tracking-tight text-white ${
                      i === 0 ? "text-5xl md:text-6xl" : "text-3xl"
                    }`}
                  >
                    {p.title}
                  </h3>
                  <p className={`mt-3 max-w-md text-sm leading-relaxed text-white/60 ${i === 0 ? "md:text-base" : ""}`}>
                    {p.body}
                  </p>
                </div>
                <div className="relative mt-8 flex items-end justify-between border-t border-white/10 pt-5">
                  <div>
                    <div className={`font-display font-semibold ${i === 0 ? "text-5xl aurora-text" : "text-3xl text-white"}`}>
                      {p.metric}
                    </div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.24em] text-white/40">
                      {p.metricLabel}
                    </div>
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.24em] text-white/40">
                    View case study →
                  </div>
                </div>
              </Tile>
            );
          })}
        </section>

        {/* ============ STACK + TIMELINE ============ */}
        <section aria-label="Stack and journey" className="mt-6 grid grid-cols-6 gap-3 md:grid-cols-12 md:gap-4">
          <Tile
            id="stack"
            variant="strong"
            className="col-span-6 md:col-span-12 min-h-[200px] justify-between overflow-hidden"
            index={0}
          >
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] tracking-[0.24em] text-white/60">
                <Cpu className="h-3 w-3" aria-hidden="true" /> TOOLKIT
              </div>
              <p className="hidden font-serif text-lg italic text-white/70 md:block">
                the daily instruments.
              </p>
            </div>
            <div className="relative -mx-6 overflow-hidden" aria-hidden="true">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-[oklch(0.14_0.02_270)] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-[oklch(0.14_0.02_270)] to-transparent" />
              <div className="flex w-max animate-marquee gap-3 whitespace-nowrap">
                {[...stack, ...stack].map((s, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 font-display text-sm font-medium text-white/85"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <ul className="sr-only">
              {stack.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </Tile>

          <Tile id="timeline" className="col-span-6 md:col-span-7 min-h-[320px]" index={1}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] tracking-[0.24em] text-white/60">
              <Sparkles className="h-3 w-3" aria-hidden="true" /> JOURNEY
            </div>
            <ol className="relative space-y-6 pl-6">
              <div className="absolute left-[7px] top-1 bottom-1 w-px bg-linear-to-b from-rose-400/60 via-rose-400/40 to-amber-400/30" aria-hidden="true" />
              {timeline.map((t) => (
                <li key={t.range} className="relative">
                  <span
                    className={`absolute -left-[22px] top-1 h-3 w-3 rounded-full ${
                      t.active
                        ? "bg-linear-to-br from-rose-400 to-amber-400 animate-pulse-ring"
                        : "bg-white/25"
                    }`}
                    aria-hidden="true"
                  />
                  <p className="font-mono text-[10px] tracking-widest text-white/40">{t.range}</p>
                  <h4 className="mt-1 font-display text-lg font-semibold text-white">{t.role}</h4>
                  <p className="mt-1 text-sm text-white/55">{t.body}</p>
                </li>
              ))}
            </ol>
          </Tile>

          <Tile variant="strong" className="col-span-6 md:col-span-5 min-h-[320px] justify-between" index={2}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] tracking-[0.24em] text-white/60">
              PHILOSOPHY
            </div>
            <blockquote className="font-serif text-3xl italic leading-snug text-white/95 md:text-4xl">
              &ldquo;The best interface is the one you never notice —
              <span className="aurora-text"> until it disappoints you.</span>&rdquo;
            </blockquote>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-white/50">
                <div className="h-px w-8 bg-white/30" />
                Design principle
              </div>
              <span className="font-mono text-[10px] text-white/40">/ms.001</span>
            </div>
          </Tile>
        </section>

        {/* ============ CONTACT BENTO ============ */}
        <section id="contact" aria-label="Contact" className="mt-6 grid grid-cols-6 gap-3 md:grid-cols-12 md:gap-4">
          <Tile
            variant="strong"
            className="group relative col-span-6 md:col-span-8 md:row-span-2 min-h-[360px] justify-between aurora-border"
            index={0}
          >
            <div className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-linear-to-br from-rose-500/50 via-rose-500/40 to-amber-400/40 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -top-24 left-10 h-48 w-48 rounded-full bg-amber-400/25 blur-3xl" aria-hidden="true" />
            <div className="flex items-center justify-between">
              <div className="relative inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-1 text-[10px] tracking-[0.24em] text-white/70 backdrop-blur">
                <Mail className="h-3 w-3" aria-hidden="true" /> LET&apos;S BUILD
              </div>
              <Waveform />
            </div>
            <div className="relative">
              <h3 className="font-display text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
                Have an idea that
                <br />
                <span className="aurora-text italic font-serif">needs to ship?</span>
              </h3>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/60 md:text-base">
                I take on a small number of engagements per quarter — architecture reviews,
                greenfield builds, and rescue projects.
              </p>
            </div>
            <a
              href={personalLinks.email.link}
              className="relative inline-flex w-fit items-center gap-2 overflow-hidden rounded-full bg-white px-6 py-3 text-xs font-semibold tracking-widest text-black shadow-[0_10px_40px_-8px_oklch(0.72_0.24_300/0.55)] transition hover:shadow-[0_20px_60px_-8px_oklch(0.72_0.24_300/0.75)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
              aria-label={`Email ${personalLinks.email.label}`}
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover:translate-x-full" aria-hidden="true" />
              <Mail className="relative h-3.5 w-3.5" aria-hidden="true" />
              <span className="relative">{personalLinks.email.label}</span>
              <ArrowUpRight className="relative h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </Tile>

          <Tile className="col-span-3 md:col-span-4 min-h-[172px] justify-between" index={1}>
            <div className="flex items-center justify-between text-white/40">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <span className="text-[10px] tracking-[0.24em]">BASED</span>
            </div>
            <div>
              <p className="font-display text-2xl font-semibold text-white">Islamabad</p>
              <p className="text-xs text-white/50">Pakistan · UTC+5</p>
            </div>
          </Tile>

          <Tile
            variant="glass"
            className="group col-span-3 md:col-span-4 min-h-[172px] justify-between"
            index={2}
          >
            <a
              href={personalLinks.linkedin.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-full flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 rounded-xl"
              aria-label="LinkedIn profile"
            >
              <div className="flex items-center justify-between text-white/50">
                <span className="font-mono text-xs tracking-widest">in/</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
              <div>
                <p className="font-display text-xl font-semibold text-white">LinkedIn</p>
                <p className="text-xs text-white/50">{personalLinks.linkedin.label}</p>
              </div>
            </a>
          </Tile>

          <Tile
            variant="glass"
            className="group col-span-6 md:col-span-12 min-h-[120px] flex-row items-center justify-between"
            index={3}
          >
            <a
              href={personalLinks.github.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 rounded-xl"
              aria-label="GitHub profile"
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm tracking-widest text-white/80">gh/</span>
                <div>
                  <p className="font-display text-lg font-semibold text-white">
                    {personalLinks.github.label}
                  </p>
                  <p className="text-xs text-white/50">Open-source · experiments · dotfiles</p>
                </div>
              </div>
              <div className="hidden items-center gap-2 text-xs text-white/50 md:flex">
                Visit repository
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
            </a>
          </Tile>
        </section>
      </main>

      <footer className="relative mt-12 border-t border-white/5" role="contentinfo">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-6 py-8 text-xs text-white/50 md:flex-row md:items-center">
          <p className="font-mono">© 2026 Muhammad Shayan — Crafted in Islamabad.</p>
          <p className="font-mono uppercase tracking-[0.24em]">Obsidian Aurora · v2026.3</p>
        </div>
      </footer>

      <MotionToggle />
      <ProjectModal project={active} onClose={() => setActive(null)} />
    </div>
  );
}
