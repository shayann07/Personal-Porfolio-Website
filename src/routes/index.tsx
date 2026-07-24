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
  Github,
  Layers,
  Linkedin,
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
}: {
  children: ReactNode;
  className?: string;
  variant?: "glass" | "strong" | "solid";
  index?: number;
  id?: string;
  as?: "div" | "button" | "article";
  onActivate?: () => void;
  ariaLabel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionPref();

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
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
      className={`spot tile-hover relative flex flex-col overflow-hidden rounded-2xl p-6 ${base} ${
        interactive
          ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          : ""
      } ${className}`}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
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
      <nav aria-label="Primary" className="hidden gap-7 text-xs font-medium tracking-wide text-white/70 md:flex">
        <a href="#work" className="transition hover:text-white focus-visible:outline-none focus-visible:text-white">Work</a>
        <a href="#stack" className="transition hover:text-white focus-visible:outline-none focus-visible:text-white">Stack</a>
        <a href="#timeline" className="transition hover:text-white focus-visible:outline-none focus-visible:text-white">Journey</a>
        <a href="#contact" className="transition hover:text-white focus-visible:outline-none focus-visible:text-white">Contact</a>
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
                className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-black transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400"
              >
                Start a project
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <a
                href="#work"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-xs font-semibold text-white/80 transition hover:border-white/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400"
              >
                See work
              </a>
            </div>
          </Tile>

          <Tile className="col-span-3 md:col-span-4 md:row-span-2 items-center justify-center text-center min-h-[360px]" index={1}>
            <div className="relative flex h-40 w-40 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-linear-to-br from-fuchsia-500 via-violet-500 to-cyan-400 blur-2xl opacity-60 animate-pulse" aria-hidden="true" />
              <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-linear-to-br from-fuchsia-400 via-violet-500 to-cyan-400 font-display text-6xl font-semibold text-black">
                MS
              </div>
            </div>
            <p className="mt-6 font-serif text-2xl italic text-white/90">Muhammad Shayan</p>
            <p className="mt-1 text-xs tracking-[0.24em] text-white/40">ISLAMABAD · REMOTE</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-emerald-300">
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/70" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Available Q3 · 2026
            </div>
          </Tile>

          {[
            { icon: Code2, label: "SHIPPED", to: 1, suffix: "M+", sub: "Users reached", strong: false },
            { icon: Zap, label: "STABILITY", to: 99.9, suffix: "%", sub: "Crash-free sessions", strong: true },
            { icon: Layers, label: "RELEASED", to: 24, suffix: "", sub: "Production apps", strong: false },
            { icon: Sparkles, label: "EXPERIENCE", to: 6, suffix: "y", sub: "Building mobile", strong: false },
          ].map((m, i) => {
            const Icon = m.icon;
            return (
              <Tile
                key={m.label}
                variant={m.strong ? "strong" : "glass"}
                className="col-span-3 md:col-span-3 justify-between min-h-[160px]"
                index={i + 2}
              >
                <div className="flex items-center justify-between text-white/40">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span className="text-[10px] tracking-[0.24em]">{m.label}</span>
                </div>
                <div>
                  <div className={`font-display text-5xl font-semibold ${m.strong ? "aurora-text" : "text-white"}`}>
                    <Counter to={m.to} suffix={m.suffix} />
                  </div>
                  <div className="mt-1 text-xs text-white/50">{m.sub}</div>
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
              <div className="absolute left-[7px] top-1 bottom-1 w-px bg-linear-to-b from-fuchsia-400/60 via-violet-400/40 to-cyan-400/30" aria-hidden="true" />
              {timeline.map((t) => (
                <li key={t.range} className="relative">
                  <span
                    className={`absolute -left-[22px] top-1 h-3 w-3 rounded-full ${
                      t.active
                        ? "bg-linear-to-br from-fuchsia-400 to-cyan-400 animate-pulse-ring"
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
            className="group relative col-span-6 md:col-span-8 md:row-span-2 min-h-[360px] justify-between"
            index={0}
          >
            <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-linear-to-br from-fuchsia-500/40 via-violet-500/40 to-cyan-400/40 blur-3xl" aria-hidden="true" />
            <div className="relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] tracking-[0.24em] text-white/60">
              <Mail className="h-3 w-3" aria-hidden="true" /> LET&apos;S BUILD
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
              className="relative inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-semibold tracking-widest text-black transition hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400"
              aria-label={`Email ${personalLinks.email.label}`}
            >
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              {personalLinks.email.label}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
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
              className="flex h-full flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 rounded-xl"
              aria-label="LinkedIn profile"
            >
              <div className="flex items-center justify-between text-white/50">
                <Linkedin className="h-4 w-4" aria-hidden="true" />
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
              className="flex w-full items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 rounded-xl"
              aria-label="GitHub profile"
            >
              <div className="flex items-center gap-4">
                <Github className="h-5 w-5 text-white/80" aria-hidden="true" />
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
