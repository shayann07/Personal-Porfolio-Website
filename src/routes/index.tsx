import { createFileRoute } from "@tanstack/react-router";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ShaderBackground } from "@/components/ShaderBackground";
import { Cursor } from "@/components/Cursor";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Muhammad Shayan — Android & Flutter Engineer" },
      { name: "description", content: "Mobile engineer designing offline-first, crash-resistant Android & Flutter apps with on-device ML. Selected work, lab, and contact." },
      { property: "og:title", content: "Muhammad Shayan — Android & Flutter Engineer" },
      { property: "og:description", content: "Offline-first, crash-resistant mobile apps with on-device ML. Selected work, lab, and contact." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

/* -------------------------------- data -------------------------------- */

const PROJECTS = [
  {
    n: "01", title: "AI Trust Ledger", tag: "Fintech · Android · 2025", role: "Kotlin · Firebase · MVVM",
    href: "#", tint: "#7dd3fc", accent: "#22d3ee",
    desc: "Investment platform with automated ROI cycles and real-time portfolio tracking.",
    stack: ["Kotlin", "Firebase", "MVVM", "Coroutines"],
    metrics: [{ k: "Users", v: "5K+" }, { k: "Crash-free", v: "99.8%" }, { k: "Rating", v: "4.7★" }],
  },
  {
    n: "02", title: "LeafBloom", tag: "On-device ML · 2025", role: "TFLite · Compose · CameraX",
    href: "#", tint: "#86efac", accent: "#4ade80",
    desc: "AI-powered plant disease diagnosis running on-device via TensorFlow Lite.",
    stack: ["TFLite", "Compose", "CameraX", "Room"],
    metrics: [{ k: "Accuracy", v: "95%" }, { k: "Response", v: "<2s" }, { k: "Models", v: "12" }],
  },
  {
    n: "03", title: "GitPulse", tag: "Flutter · Dev tool · 2024", role: "Flutter · GraphQL · OAuth",
    href: "#", tint: "#a5b4fc", accent: "#a78bfa",
    desc: "Developer productivity tracker with GitHub sync and contribution analytics.",
    stack: ["Flutter", "OAuth", "GraphQL", "Riverpod"],
    metrics: [{ k: "Syncs", v: "Real-time" }, { k: "APIs", v: "5+" }, { k: "Charts", v: "15" }],
  },
  {
    n: "04", title: "Medicare", tag: "HealthTech · 2024", role: "Flutter · Firebase · Stripe",
    href: "#", tint: "#fca5a5", accent: "#f0abfc",
    desc: "Tele-health & pharmacy platform — appointments, chat, payments and pharmacy flows in one app.",
    stack: ["Flutter", "Firebase", "Stripe", "Riverpod"],
    metrics: [{ k: "Rating", v: "4.8★" }, { k: "Resolution", v: "97%" }, { k: "Follow-up", v: "93%" }],
  },
];

const STACK: { name: string; kind: string }[] = [
  { name: "Kotlin",          kind: "daily" },
  { name: "Jetpack Compose", kind: "ui" },
  { name: "Flutter",         kind: "cross-platform" },
  { name: "Dart",            kind: "language" },
  { name: "Java",            kind: "legacy/interop" },
  { name: "MVVM · Clean",    kind: "architecture" },
  { name: "Coroutines",      kind: "concurrency" },
  { name: "Firebase",        kind: "backend" },
  { name: "Retrofit",        kind: "rest" },
  { name: "GraphQL · Apollo",kind: "queries" },
  { name: "Room · SQLite",   kind: "persistence" },
  { name: "TensorFlow Lite", kind: "on-device ml" },
  { name: "ML Kit",          kind: "vision" },
  { name: "Git · CI/CD",     kind: "delivery" },
  { name: "Fastlane",        kind: "release" },
  { name: "JUnit · Espresso",kind: "testing" },
];

const METRICS = [
  { v: "3+",     k: "Production apps shipped", s: "Live on stores" },
  { v: "10k+",   k: "Total installs",          s: "Across all apps" },
  { v: "40–60%", k: "Performance gains",       s: "Optimization work" },
  { v: "99%+",   k: "Crash-free releases",     s: "Production stability" },
];

const TIMELINE = [
  {
    y: "2024 → Now", t: "Independent Mobile Engineer", o: "Independent",
    b: [
      "3 production apps shipped with 10k+ combined installs",
      "Architected offline-first sync using Room + Firestore",
      "99.5% crash-free builds across all releases",
      "CI/CD pipelines with automated testing",
    ],
  },
  {
    y: "2025", t: "Android Developer Intern", o: "Appverse Technologies",
    b: [
      "Modular Jetpack Compose UI with MVVM architecture",
      "Integrated REST & GraphQL with Retrofit + Apollo",
      "Contributed to CI/CD workflow improvements",
      "Optimized app performance for 40–60% gains",
    ],
  },
  {
    y: "2021 – 2025", t: "BS Software Engineering", o: "University of Sargodha",
    b: [
      "Specialized in mobile development & software architecture",
      "Multiple Android projects with ML integration",
      "Deep focus on algorithms, systems design, mobile frameworks",
      "Graduated with honors in mobile app development",
    ],
  },
];

const LAB = [
  { t: "ML Gesture Recognition", s: "In Progress", d: "Real-time hand gesture detection using TensorFlow Lite for intuitive app controls.", tech: ["TFLite", "Kotlin", "ML Kit", "CameraX"], tint: "#7dd3fc" },
  { t: "ML Model Optimizer",     s: "Research",    d: "Compress and optimize TensorFlow Lite models for mobile deployment.",                tech: ["TFLite", "Python", "Quantization"],  tint: "#c4b5fd" },
  { t: "Voice Command Layer",    s: "In Progress", d: "Privacy-first voice recognition with on-device processing and ML inference.",         tech: ["TFLite", "Audio", "On-device"],      tint: "#fdba74" },
];

/* --------------------------- kinetic helpers -------------------------- */

function SplitReveal({ text, delay = 0, className = "", once = true }: { text: string; delay?: number; className?: string; once?: boolean }) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((w, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {Array.from(w).map((ch, ci) => (
            <span key={ci} className="char-mask">
              <motion.span
                initial={{ y: "110%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once, amount: 0.1, margin: "0px 0px -5% 0px" }}
                transition={{ duration: 0.9, ease: [0.7, 0, 0.2, 1], delay: delay + (wi * 0.03) + (ci * 0.015) }}
              >
                {ch}
              </motion.span>
            </span>
          ))}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}

/* Above-the-fold variant: animates on mount, not on viewport */
function SplitEnter({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((w, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {Array.from(w).map((ch, ci) => (
            <span key={ci} className="char-mask">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.9, ease: [0.7, 0, 0.2, 1], delay: delay + (wi * 0.03) + (ci * 0.015) }}
              >
                {ch}
              </motion.span>
            </span>
          ))}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}

/* -------------------------------- header ------------------------------ */

function Header() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () => new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Asia/Karachi", hour12: false }).format(new Date());
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <>
      {/* Top-left mark */}
      <div className="fixed left-3 top-3 z-40 md:left-10 md:top-8">
        <a href="#top" data-cursor="Home" className="glass inline-flex items-center gap-2 rounded-[var(--radius-pill)] px-3 py-1.5 text-white md:gap-3 md:px-3.5 md:py-2">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-[10px] font-bold text-black md:h-6 md:w-6">S</span>
          <span className="micro-eyebrow text-white">Shayan / DE</span>
        </a>
      </div>
      {/* Center pill nav */}
      <nav className="fixed left-1/2 top-6 z-40 hidden -translate-x-1/2 md:top-8 md:block">
        <div className="glass-strong flex items-center gap-1 rounded-[var(--radius-pill)] p-1.5">
          {[["Work","#work"],["Signals","#metrics"],["Story","#story"],["Lab","#lab"],["Stack","#index"],["Contact","#contact"]].map(([l,h]) => (
            <a key={l} href={h} data-cursor="Jump" className="micro-eyebrow rounded-full px-4 py-2 text-white/70 transition hover:bg-white/10 hover:text-white">
              {l}
            </a>
          ))}
        </div>
      </nav>
      {/* Top-right status */}
      <div className="fixed right-3 top-3 z-40 md:right-10 md:top-8">
        <span className="chip"><span className="dot live" />KHI · <span className="tabular-nums text-white">{time || "--:--:--"}</span></span>
      </div>
      {/* Mobile bottom nav */}
      <nav className="fixed bottom-3 left-1/2 z-40 -translate-x-1/2 md:hidden">
        <div className="glass-strong flex max-w-[calc(100vw-1.5rem)] items-center gap-0.5 overflow-x-auto rounded-[var(--radius-pill)] p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[["Work","#work"],["Signals","#metrics"],["Story","#story"],["Lab","#lab"],["Stack","#index"],["Contact","#contact"]].map(([l,h]) => (
            <a key={l} href={h} className="micro-eyebrow shrink-0 rounded-full px-3 py-1.5 text-white/75 transition hover:bg-white/10 hover:text-white">
              {l}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}

/* --------------------------------- hero ------------------------------- */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 1], [0, 4]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  return (
    <section id="top" ref={ref} className="relative overflow-hidden pb-8 pt-20 md:pb-14 md:pt-24">
      {/* ambient blobs */}
      <div className="glow-blob left-[-10%] top-[10%] h-[300px] w-[300px]" style={{ background: "radial-gradient(circle, #4c1d95 0%, transparent 60%)", opacity: .35 }} />
      <div className="glow-blob right-[-8%] top-[35%] h-[280px] w-[280px]" style={{ background: "radial-gradient(circle, #0891b2 0%, transparent 60%)", opacity: .28 }} />

      <motion.div style={{ y, scale, opacity, filter }} className="container-x grid grid-cols-12 items-center gap-6 md:gap-10">
        {/* Left: type */}
        <div className="col-span-12 md:col-span-7">
          <div className="mb-4 flex flex-wrap items-center gap-1.5 md:mb-6 md:gap-2.5">
            <span className="chip"><span className="dot live" />Available · Q3 2026</span>
            <span className="chip">Karachi ⇄ Remote</span>
          </div>

          <h1 className="hd-display text-white [font-size:clamp(32px,9vw,84px)] md:[font-size:var(--text-display)]">
            <div><SplitEnter text="Muhammad" /></div>
            <div className="flex items-center gap-[2vw]">
              <span className="serifital italic text-white/95"><SplitEnter text="Shayan" delay={0.08} /></span>
              <motion.span
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.7, duration: 0.9, ease: [0.7, 0, 0.2, 1] }}
                className="inline-grid h-[0.85em] w-[0.85em] max-h-[72px] max-w-[72px] shrink-0 place-items-center rounded-full"
                style={{ background: "conic-gradient(from 210deg,#a78bfa,#22d3ee,#f0abfc,#a78bfa)" }}
                aria-hidden
              >
                <span className="text-[0.35em] font-black text-white mix-blend-overlay">✦</span>
              </motion.span>
            </div>
            <div className="text-white/70"><SplitEnter text="mobile, made calm." delay={0.16} /></div>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.9 }}
            className="mt-5 max-w-sm body-sm text-white/60 md:mt-7"
          >
            Offline-first Android & Flutter apps. On-device ML. Real-time sync.
          </motion.p>
        </div>

        {/* Right: iridescent orb visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1.2, ease: [0.7, 0, 0.2, 1] }}
          className="relative col-span-12 md:col-span-5"
        >
          <div className="relative mx-auto aspect-[5/6] w-full max-w-[420px]">
            {/* orbit rings */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-[-6%] rounded-full border border-white/10"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              style={{ maskImage: "radial-gradient(circle,transparent 55%,black 60%)" }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-[6%] rounded-full border border-white/15"
              animate={{ rotate: -360 }}
              transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
              style={{ maskImage: "radial-gradient(circle,transparent 60%,black 65%)" }}
            />
            {/* orb card — pure CSS gradient mesh */}
            <div className="relative h-full w-full overflow-hidden rounded-[28px] ring-1 ring-white/10" style={{ background: "radial-gradient(circle at 50% 40%, #1a1030 0%, #050507 70%)" }}>
              {/* base gradient mesh */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(60% 55% at 30% 30%, #a78bfa66, transparent 60%)," +
                    "radial-gradient(55% 50% at 75% 65%, #22d3ee55, transparent 65%)," +
                    "radial-gradient(45% 45% at 60% 20%, #f0abfc44, transparent 70%)",
                }}
              />
              {/* orb sphere */}
              <motion.div
                aria-hidden
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute left-1/2 top-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background:
                    "conic-gradient(from 0deg, #a78bfa, #22d3ee, #f0abfc, #a78bfa)",
                  filter: "blur(2px)",
                  boxShadow:
                    "inset -30px -30px 80px rgba(0,0,0,0.55), inset 20px 20px 60px rgba(255,255,255,0.15), 0 40px 120px -20px #a78bfa88",
                }}
              />
              {/* specular highlight */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background:
                    "radial-gradient(30% 25% at 35% 30%, rgba(255,255,255,0.55), transparent 70%)",
                }}
              />
              {/* grid overlay */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.15]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                  maskImage: "radial-gradient(70% 70% at 50% 50%, black, transparent 75%)",
                }}
              />
              <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(70% 60% at 50% 45%, transparent, #050507cc 95%)" }} />
              {/* floating stat chips */}
              <div className="absolute left-3 top-3 flex flex-col gap-2">
                <span className="chip"><span className="dot live" />live</span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                <div>
                  <div className="micro-eyebrow text-white/70">Shipped</div>
                  <div className="stat-num text-white">10k+</div>
                </div>
                <div className="text-right">
                  <div className="micro-eyebrow text-white/70">Crash-free</div>
                  <div className="stat-num text-white">99%+</div>
                </div>
              </div>
            </div>
            {/* floating shard */}
            <motion.div
              aria-hidden
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-4 top-8 h-10 w-10 rotate-12 rounded-md"
              style={{ background: "linear-gradient(135deg,#a78bfa,#22d3ee)", boxShadow: "0 20px 60px -20px #a78bfa88" }}
            />
            <motion.div
              aria-hidden
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-3 bottom-14 h-8 w-8 -rotate-12 rounded-full"
              style={{ background: "linear-gradient(135deg,#f0abfc,#a78bfa)", boxShadow: "0 20px 60px -20px #f0abfc88" }}
            />
          </div>
        </motion.div>
      </motion.div>

      <motion.div style={{ opacity }} className="pointer-events-none container-x mt-8 hidden items-center justify-between micro-eyebrow text-white/50 md:flex">
        <span className="inline-flex items-center gap-2"><span className="tsep" /> Scroll to explore</span>
        <span>Muhammad Shayan · Karachi ⇄ Remote</span>
      </motion.div>
    </section>
  );
}

/* -------------------------------- marquee ----------------------------- */

function Marquee() {
  const A = ["Available for work", "Android engineering", "Flutter apps", "On-device ML", "Offline-first"];
  const B = ["Karachi ⇄ Remote", "Kotlin · Compose", "TFLite · ML Kit", "99%+ crash-free", "40–60% faster"];
  const rowA = (
    <div className="flex shrink-0 items-center gap-5 pr-5 md:gap-8 md:pr-8">
      {A.map((t, i) => (
        <span key={i} className="flex items-center gap-5 md:gap-8">
          <span className="font-display font-extrabold leading-none text-white/95" style={{ fontSize: "var(--text-h2)", letterSpacing: 0 }}>{t}</span>
          <span className="serifital italic leading-none text-[color:var(--violet)]" style={{ fontSize: "var(--text-h2)" }}>✦</span>
        </span>
      ))}
    </div>
  );
  const rowB = (
    <div className="flex shrink-0 items-center gap-5 pr-5 md:gap-8 md:pr-8">
      {B.map((t, i) => (
        <span key={i} className="flex items-center gap-5 md:gap-8">
          <span className="serifital italic leading-none text-white/60" style={{ fontSize: "var(--text-h3)" }}>{t}</span>
          <span className="mono leading-none text-white/25" style={{ fontSize: "var(--text-h3)" }}>/</span>
        </span>
      ))}
    </div>
  );
  return (
    <section aria-hidden className="relative hidden overflow-hidden border-y border-white/10 py-2 sm:block md:py-2.5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#050507] to-transparent md:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#050507] to-transparent md:w-32" />
      <div className="marquee-track flex">{rowA}{rowA}</div>
      <div className="marquee-track flex mt-2" style={{ animationDirection: "reverse", animationDuration: "55s" }}>{rowB}{rowB}</div>
    </section>
  );
}

/* --------------------------------- work ------------------------------- */

function WorkList() {
  return (
    <section id="work" className="relative section-y">
      <div className="container-x">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4 md:mb-10">
          <div className="min-w-0">
            <div className="chip mb-4"><span className="dot" />Selected Work</div>
            <h2 className="hd-2 text-white">
              Recent <span className="serifital italic text-[color:var(--violet)]">shipments.</span>
            </h2>
          </div>
          <div className="micro-eyebrow hidden text-right md:block">
            2023 — 2026<br/>Index (05)
          </div>
        </div>

        <div className="grid grid-cols-12 gap-3 md:gap-4">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.n} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ p, i }: { p: typeof PROJECTS[number]; i: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 25 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 25 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => { mx.set(0); my.set(0); };

  // staggered layout: alternate wide/narrow, big first card
  const layout = "col-span-12 sm:col-span-6";
  const cardSize = "min-h-[228px] sm:min-h-[300px] lg:min-h-[320px]";

  return (
    <motion.a
      ref={ref}
      href={p.href}
      data-cursor="View"
      onMouseMove={onMove}
      onMouseLeave={reset}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.7, 0, 0.2, 1], delay: (i % 3) * 0.06 }}
      style={{ perspective: 1200 }}
      className={`${layout} group block`}
    >
      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className={`tile relative overflow-hidden ${cardSize}`}
      >
        {/* gradient art plate */}
        <div aria-hidden className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 transition duration-[900ms] group-hover:scale-[1.06]"
            style={{
              background:
                `radial-gradient(60% 60% at 20% 20%, ${p.tint}55, transparent 65%),` +
                `radial-gradient(55% 55% at 80% 30%, ${p.accent}44, transparent 70%),` +
                `radial-gradient(70% 65% at 60% 90%, ${p.tint}33, transparent 70%),` +
                `linear-gradient(135deg, #0b0b14 0%, #050507 100%)`,
            }}
          />
          {/* orbit ring accent */}
          <div
            className="absolute -right-16 -top-16 h-56 w-56 rounded-full border opacity-40 md:h-72 md:w-72"
            style={{ borderColor: `${p.tint}55` }}
          />
          <div
            className="absolute -right-8 -top-8 h-32 w-32 rounded-full border opacity-30 md:h-40 md:w-40"
            style={{ borderColor: `${p.accent}66` }}
          />
          {/* grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />
          {/* vignette for text legibility */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #05050700 0%, #050507ee 100%)" }} />
        </div>

        {/* top row: index + chip */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-2 p-3 md:p-4">
          <span className="num-idx">— {p.n}</span>
          <span className="chip max-w-[70%] truncate"><span className="dot shrink-0" style={{ background: p.tint, boxShadow: `0 0 12px ${p.tint}` }} />{p.tag}</span>
        </div>

        {/* bottom content */}
        <div className="absolute inset-x-0 bottom-0 p-3.5 md:p-5">
          <div className="flex flex-wrap items-end justify-between gap-3 md:gap-5">
            <div className="min-w-0 flex-1">
              <div className="hd-3 text-white">{p.title}</div>
              <p className="mt-1 max-w-md body-sm text-white/70 line-clamp-2">{p.desc}</p>
              <div className="mt-2 flex flex-wrap gap-1 md:mt-3 md:gap-1.5">
                {p.stack.map((t) => (
                  <span key={t} className="micro-eyebrow rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-1 text-white/70">{t}</span>
                ))}
              </div>
              <div className="mt-2 hidden flex-wrap gap-x-4 gap-y-2 sm:flex md:mt-3 md:gap-x-5">
                {p.metrics.map((m) => (
                  <div key={m.k}>
                    <div className="text-white" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-lg)", lineHeight: 1.05, letterSpacing: 0 }}>{m.v}</div>
                    <div className="micro-eyebrow mt-1 text-white/45">{m.k}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex w-full items-center justify-between gap-3 md:w-auto md:justify-end">
              <span className="micro-eyebrow text-white/60">{p.role}</span>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition group-hover:bg-white group-hover:text-black md:h-9 md:w-9">↗</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.a>
  );
}

/* --------------------------------- about ------------------------------ */

function Studio() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [110, -40]);

  const stats = [
    { k: "Apps shipped",   v: "3+" },
    { k: "Installs",       v: "10k+" },
    { k: "Crash-free",     v: "99%+" },
    { k: "Perf gains",     v: "40–60%" },
  ];

  return (
    <section id="studio" ref={ref} className="relative overflow-hidden section-y">
      <div className="glow-blob left-[10%] top-[20%] h-[280px] w-[280px]" style={{ background: "radial-gradient(circle, #2a2d38, transparent 60%)", opacity: .42 }} />

      <div className="container-x">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4 md:mb-10">
          <div>
            <div className="chip mb-4"><span className="dot" />The Studio · 001</div>
            <h2 className="hd-2 text-white">
                Mobile, made <span className="serifital italic text-[color:var(--violet)]">calm.</span>
            </h2>
          </div>
          <div className="micro-eyebrow hidden max-w-xs sm:block">
              Android · Flutter · Karachi, PK<br/>Offline-first · Crash-resistant · On-device ML.
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* pull-quote glass card */}
          <motion.div style={{ y: y1 }} className="col-span-12 md:col-span-7">
            <div className="tile relative p-5 md:p-8">
                <div className="absolute right-5 top-3 serifital text-[64px] leading-none text-white/10 md:text-[80px]">“</div>
              <div className="serifital text-white/95 leading-[1.15]" style={{ fontSize: "var(--text-h3)" }}>
                Great mobile UX is invisible engineering — <span className="italic text-[color:var(--violet)]">offline that just works, sync you never notice, releases that don&apos;t crash.</span>
              </div>
              <div className="mt-6 flex items-center gap-3 md:mt-7">
                <div className="h-10 w-10 overflow-hidden rounded-full ring-1 ring-white/20">
                  <img src="/portrait.jpg" alt="" className="h-full w-full object-cover" />
                </div>
                <div>
                  <div className="micro-eyebrow text-white">Muhammad Shayan</div>
                  <div className="micro-eyebrow">Android &amp; Flutter Engineer</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* stat cluster */}
          <motion.div style={{ y: y2 }} className="col-span-12 grid grid-cols-2 gap-3 md:col-span-5 md:gap-4">
            {stats.map((s) => (
              <div key={s.k} className="tile flex min-h-[110px] flex-col justify-between p-4 md:min-h-[128px] md:p-5">
                <div className="micro-eyebrow">{s.k}</div>
                <div className="stat-num text-white">{s.v}</div>
              </div>
            ))}
          </motion.div>

          {/* bio strip */}
          <div className="col-span-12 mt-2 grid grid-cols-12 gap-4 md:mt-4 md:gap-6">
            <p className="col-span-12 body-md text-white/70 md:col-span-6">
              I work end-to-end on mobile products — from Compose UI systems and offline-first data layers to on-device ML inference and CI/CD delivery pipelines.
            </p>
            <p className="col-span-12 body-md text-white/70 md:col-span-5 md:col-start-8">
              Currently exploring on-device ML for gesture and voice interfaces, and model-optimization workflows that keep inference fast on mid-range Android devices.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- index ------------------------------ */

function IndexStack() {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <section id="index" className="relative border-t border-white/10 section-y">
      <div className="container-x">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4 md:mb-10">
          <div>
            <div className="chip mb-4"><span className="dot" />Index · Toolkit</div>
            <h2 className="hd-2 text-white">
              Instruments I <span className="serifital italic text-[color:var(--violet)]">reach for.</span>
            </h2>
          </div>
          <div className="micro-eyebrow hidden text-right sm:block">
            {STACK.length} systems<br/>Continuously curated
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 md:gap-2.5">
          {STACK.map((s, i) => (
            <motion.button
              key={s.name}
              type="button"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              data-cursor={s.kind}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.03 }}
              className="tile group flex items-center gap-2 px-2.5 py-2 md:gap-3 md:px-4 md:py-3"
              style={{ transform: hovered === i ? "translateY(-4px)" : undefined }}
            >
              <span className="num-idx">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-white" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--text-sm)", lineHeight: 1.1, letterSpacing: 0 }}>{s.name}</span>
              <span className="micro-eyebrow hidden group-hover:text-[color:var(--violet)] sm:inline">/ {s.kind}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- contact ---------------------------- */

function Metrics() {
  return (
    <section id="metrics" className="relative border-t border-white/10 section-y">
      <div className="container-x">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4 md:mb-10">
          <div>
            <div className="chip mb-4"><span className="dot live" />Command Center</div>
            <h2 className="hd-2 text-white">
              Signals from <span className="serifital italic text-[color:var(--violet)]">production.</span>
            </h2>
          </div>
          <div className="micro-eyebrow hidden text-right sm:block">
            Real-time performance<br/>&amp; reliability metrics
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.k}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1], delay: i * 0.06 }}
              className="tile p-4 md:p-5"
            >
              <div className="micro-eyebrow">{m.s}</div>
              <div className="stat-num mt-4 text-white md:mt-5">{m.v}</div>
              <div className="micro-eyebrow mt-3 text-white/70">{m.k}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Timeline() {
  return (
    <section id="story" className="relative border-t border-white/10 section-y">
      <div className="container-x">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4 md:mb-10">
          <div>
            <div className="chip mb-4"><span className="dot" />The Story</div>
            <h2 className="hd-2 text-white">
              Chapters, <span className="serifital italic text-[color:var(--violet)]">in order.</span>
            </h2>
          </div>
          <div className="micro-eyebrow hidden text-right sm:block">
            {TIMELINE.length} chapters<br/>2021 — Now
          </div>
        </div>
        <div className="relative grid grid-cols-12 gap-3 md:gap-4">
          <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px bg-gradient-to-b from-transparent via-white/25 to-transparent md:block" />
          {TIMELINE.map((c, i) => (
            <motion.div
              key={c.t}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1], delay: (i % 3) * 0.05 }}
              className={`col-span-12 md:col-span-6 ${i % 2 ? "md:col-start-7" : ""}`}
            >
              <div className="tile p-4 md:p-5">
                <div className="flex items-center gap-3">
                  <span className="micro-eyebrow text-[color:var(--violet)]">{c.y}</span>
                  <span className="h-px flex-1 bg-white/10" />
                </div>
                <div className="mt-3 hd-3 text-white">{c.t}</div>
                <div className="micro-eyebrow mt-2 text-white/55">{c.o}</div>
                <ul className="mt-4 space-y-2">
                  {c.b.slice(0, 3).map((line) => (
                    <li key={line} className="flex gap-3 body-sm text-white/70">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--violet)]" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Lab() {
  return (
    <section id="lab" className="relative border-t border-white/10 section-y">
      <div className="container-x">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4 md:mb-10">
          <div>
            <div className="chip mb-4"><span className="dot" />The Lab · Experiments</div>
            <h2 className="hd-2 text-white">
              What I&apos;m <span className="serifital italic text-[color:var(--violet)]">tinkering on.</span>
            </h2>
          </div>
          <div className="micro-eyebrow hidden text-right sm:block">
            {LAB.length} experiments<br/>Mostly on-device ML
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
          {LAB.map((l, i) => (
            <motion.div
              key={l.t}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1], delay: i * 0.06 }}
              className="tile group relative overflow-hidden p-4 md:p-5"
            >
              <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full opacity-25 blur-3xl transition group-hover:opacity-50" style={{ background: `radial-gradient(circle, ${l.tint}, transparent 70%)` }} />
              <div className="relative flex items-center justify-between">
                <span className="chip"><span className="dot" style={{ background: l.tint, boxShadow: `0 0 10px ${l.tint}` }} />{l.s}</span>
                <span className="num-idx">— {String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="relative mt-5 hd-3 text-white">{l.t}</div>
              <p className="relative mt-2 body-sm text-white/70">{l.d}</p>
              <div className="relative mt-4 flex flex-wrap gap-1.5">
                {l.tech.map((t) => (
                  <span key={t} className="micro-eyebrow rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-1 text-white/70">{t}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden border-t border-white/10 section-y pb-24 md:pb-[var(--space-section)]">
      <div className="glow-blob left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2" style={{ background: "radial-gradient(circle, #2a2d38, transparent 60%)", opacity: .45 }} />

      <div className="relative container-x">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex"><span className="chip"><span className="dot live" />Booking Q3 — Q4 2026</span></div>
          <h2 className="hd-1 text-white">
            <div><SplitReveal text="Let's build" /></div>
            <div><span className="serifital italic text-[color:var(--violet)]"><SplitReveal text="something rare." delay={0.08} /></span></div>
          </h2>

          <div className="mt-7 flex flex-col items-center gap-4 md:mt-9">
            <a href="mailto:hello@shayxo.dev" data-cursor="Write" className="pill-btn max-w-full text-white !px-4 !py-3 md:!px-6 md:!py-4">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white text-black md:h-8 md:w-8">✎</span>
              <span className="min-w-0 truncate" style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--text-base)", lineHeight: 1.1, letterSpacing: 0 }}>hello@shayxo.dev</span>
              <span className="mono shrink-0 text-lg md:text-xl">↗</span>
            </a>

            <div className="flex flex-wrap justify-center gap-3">
              {[
                { l: "GitHub @shayann07",   h: "https://github.com/shayann07" },
                { l: "LinkedIn /in/shayann07", h: "https://www.linkedin.com/in/shayann07" },
                { l: "Résumé (PDF)",        h: "/muhammad_shayan_cv.pdf" },
              ].map((s) => (
                <a key={s.l} href={s.h} data-cursor={s.l} className="chip hover:border-white/30 hover:text-white">{s.l} ↗</a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-9 grid grid-cols-2 gap-3 md:mt-12 md:grid-cols-4 md:gap-4">
          {[
            { k: "Location", v: "Karachi, PK" },
            { k: "Working",  v: "Global · Remote" },
            { k: "Response", v: "< 24 hours" },
            { k: "Timezone", v: "GMT +5" },
          ].map((c) => (
            <div key={c.k} className="tile p-3.5 md:p-4">
              <div className="micro-eyebrow">{c.k}</div>
              <div className="mono mt-3 body-sm text-white">{c.v}</div>
            </div>
          ))}
        </div>

        <div className="mt-9 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-6 micro-eyebrow text-white/40">
          <span>© 2026 Muhammad Shayan</span>
          <span>Built kinetic — no template.</span>
          <a className="linkline" href="#top">Back to top ↑</a>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- page ------------------------------- */

function Page() {
  return (
    <div className="grain relative isolate min-h-screen text-white">
      <ShaderBackground />
      <Cursor />
      <Header />
      <main>
        <Hero />
        <Marquee />
        <WorkList />
        <Metrics />
        <Studio />
        <Timeline />
        <Lab />
        <IndexStack />
        <Contact />
      </main>
    </div>
  );
}
