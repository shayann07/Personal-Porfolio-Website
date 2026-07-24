import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { ShaderBackground } from "@/components/ShaderBackground";
import { Cursor } from "@/components/Cursor";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Muhammad Shayan — Android & Flutter Engineer" },
      { name: "description", content: "Mobile engineer designing offline-first, crash-resistant Android & Flutter apps with on-device ML. Selected work, lab, and contact." },
      { property: "og:title", content: "Muhammad Shayan — Android & Flutter Engineer" },
      { property: "og:description", content: "Offline-first, crash-resistant mobile apps with on-device ML. Selected work, lab, and contact." },
      { property: "og:image", content: "/og-image.png" },
      { name: "twitter:image", content: "/og-image.png" },
    ],
  }),
  component: Page,
});

/* -------------------------------- data -------------------------------- */

const PROJECTS = [
  {
    n: "01", title: "AI Trust Ledger", tag: "Fintech · Android · 2025", role: "Kotlin · Firebase · MVVM",
    img: "/portrait.jpg", href: "#", tint: "#7dd3fc",
    desc: "Investment platform with automated ROI cycles and real-time portfolio tracking.",
    stack: ["Kotlin", "Firebase", "MVVM", "Coroutines"],
    metrics: [{ k: "Users", v: "5K+" }, { k: "Crash-free", v: "99.8%" }, { k: "Rating", v: "4.7★" }],
  },
  {
    n: "02", title: "LeafBloom", tag: "On-device ML · 2025", role: "TFLite · Compose · CameraX",
    img: "/portrait.jpg", href: "#", tint: "#86efac",
    desc: "AI-powered plant disease diagnosis running on-device via TensorFlow Lite.",
    stack: ["TFLite", "Compose", "CameraX", "Room"],
    metrics: [{ k: "Accuracy", v: "95%" }, { k: "Response", v: "<2s" }, { k: "Models", v: "12" }],
  },
  {
    n: "03", title: "GitPulse", tag: "Flutter · Dev tool · 2024", role: "Flutter · GraphQL · OAuth",
    img: "/portrait.jpg", href: "#", tint: "#a5b4fc",
    desc: "Developer productivity tracker with GitHub sync and contribution analytics.",
    stack: ["Flutter", "OAuth", "GraphQL", "Riverpod"],
    metrics: [{ k: "Syncs", v: "Real-time" }, { k: "APIs", v: "5+" }, { k: "Charts", v: "15" }],
  },
  {
    n: "04", title: "Medicare", tag: "HealthTech · 2024", role: "Flutter · Firebase · Stripe",
    img: "/portrait.jpg", href: "#", tint: "#fca5a5",
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
      <div className="fixed left-4 top-4 z-40 md:left-10 md:top-8">
        <a href="#top" data-cursor="Home" className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-white md:gap-3 md:px-3.5 md:py-2">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-[10px] font-bold text-black md:h-6 md:w-6">S</span>
          <span className="mono text-[10px] uppercase tracking-[0.22em] md:text-[11px]">Shayan / DE</span>
        </a>
      </div>
      {/* Center pill nav */}
      <nav className="fixed left-1/2 top-6 z-40 hidden -translate-x-1/2 md:top-8 md:block">
        <div className="glass-strong flex items-center gap-1 rounded-full p-1.5">
          {[["Work","#work"],["Signals","#metrics"],["Story","#story"],["Lab","#lab"],["Stack","#index"],["Contact","#contact"]].map(([l,h]) => (
            <a key={l} href={h} data-cursor="Jump" className="mono rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white/70 transition hover:bg-white/10 hover:text-white">
              {l}
            </a>
          ))}
        </div>
      </nav>
      {/* Top-right status */}
      <div className="fixed right-4 top-4 z-40 md:right-10 md:top-8">
        <span className="chip"><span className="dot live" />KHI · <span className="tabular-nums text-white">{time || "--:--:--"}</span></span>
      </div>
      {/* Mobile bottom nav */}
      <nav className="fixed bottom-3 left-1/2 z-40 -translate-x-1/2 md:hidden">
        <div className="glass-strong flex max-w-[calc(100vw-1.5rem)] items-center gap-0.5 overflow-x-auto rounded-full p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[["Work","#work"],["Signals","#metrics"],["Story","#story"],["Lab","#lab"],["Stack","#index"],["Contact","#contact"]].map(([l,h]) => (
            <a key={l} href={h} className="mono shrink-0 rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-white/75 transition hover:bg-white/10 hover:text-white">
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
  const y = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const blur = useTransform(scrollYProgress, [0, 1], [0, 8]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  return (
    <section id="top" ref={ref} className="relative flex min-h-screen flex-col justify-between overflow-hidden pb-16 pt-36 md:pt-40">
      {/* ambient blobs */}
      <div className="glow-blob left-[-10%] top-[10%] h-[420px] w-[420px]" style={{ background: "radial-gradient(circle, #2a2d38 0%, transparent 60%)", opacity: .7 }} />
      <div className="glow-blob right-[-8%] top-[35%] h-[380px] w-[380px]" style={{ background: "radial-gradient(circle, #1a1c24 0%, transparent 60%)", opacity: .6 }} />

      <motion.div style={{ y, scale, opacity, filter }} className="mx-auto w-full max-w-[1800px] px-6 md:px-10">
        <div className="mb-10 flex flex-wrap items-center gap-3">
          <span className="chip"><span className="dot live" />Available · Q3 2026</span>
          <span className="chip">Android · Flutter · ML</span>
          <span className="chip">Karachi ⇄ Remote</span>
        </div>

        <h1 className="display text-white text-[clamp(56px,14.5vw,260px)]">
          <div><SplitEnter text="Muhammad" /></div>
          <div className="flex items-center gap-[2vw] pl-[6vw]">
            <span className="serifital italic text-white/95"><SplitEnter text="Shayan" delay={0.08} /></span>
            <motion.span
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.7, duration: 0.9, ease: [0.7, 0, 0.2, 1] }}
              className="inline-grid h-[1em] w-[1em] max-h-[110px] max-w-[110px] place-items-center rounded-full"
              style={{ background: "radial-gradient(circle at 30% 30%, #e6e8ef, #1a1c24)" }}
              aria-hidden
            >
              <span className="text-[0.4em] font-black text-white">✦</span>
            </motion.span>
          </div>
          <div><SplitEnter text="mobile, made calm." delay={0.16} /></div>
        </h1>

        {/* footer grid: intro + orbit cards */}
        <div className="mt-16 grid grid-cols-12 items-end gap-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.9 }}
            className="col-span-12 max-w-md text-base leading-relaxed text-white/70 md:col-span-4"
          >
            I design offline-first, crash-resistant Android & Flutter apps — with on-device ML, real-time sync, and 40–60% performance gains in the workflows that matter.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.9 }}
            className="col-span-12 grid grid-cols-3 gap-3 md:col-span-6 md:col-start-7"
          >
            {[
              { k: "Now",   v: "Independent",       s: "Mobile engineer" },
              { k: "Focus", v: "Android · Flutter", s: "On-device ML" },
              { k: "Shipped", v: "10k+",            s: "Installs · 3 apps" },
            ].map((c) => (
              <div key={c.k} className="tile p-4">
                <div className="eyebrow">{c.k}</div>
                <div className="mt-3 display text-white text-[clamp(20px,1.8vw,28px)] leading-none">{c.v}</div>
                <div className="mono mt-2 text-[11px] uppercase tracking-[0.22em] text-white/50">{c.s}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <motion.div style={{ opacity }} className="pointer-events-none absolute inset-x-0 bottom-6 mx-auto flex max-w-[1800px] items-center justify-between px-6 mono text-[11px] tracking-[0.24em] uppercase text-white/50 md:px-10">
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
    <div className="flex shrink-0 items-center gap-10 pr-10">
      {A.map((t, i) => (
        <span key={i} className="flex items-center gap-10">
          <span className="display text-[8vw] leading-none text-white/95">{t}</span>
          <span className="serifital italic text-[8vw] leading-none text-[color:var(--violet)]">✦</span>
        </span>
      ))}
    </div>
  );
  const rowB = (
    <div className="flex shrink-0 items-center gap-10 pr-10">
      {B.map((t, i) => (
        <span key={i} className="flex items-center gap-10">
          <span className="serifital italic text-[6vw] leading-none text-white/60">{t}</span>
          <span className="mono text-[6vw] leading-none text-white/25">/</span>
        </span>
      ))}
    </div>
  );
  return (
    <section aria-hidden className="relative border-y border-white/10 py-6 overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-40 bg-gradient-to-r from-[#050507] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-40 bg-gradient-to-l from-[#050507] to-transparent" />
      <div className="marquee-track flex">{rowA}{rowA}</div>
      <div className="marquee-track flex mt-2" style={{ animationDirection: "reverse", animationDuration: "55s" }}>{rowB}{rowB}</div>
    </section>
  );
}

/* --------------------------------- work ------------------------------- */

function WorkList() {
  return (
    <section id="work" className="relative py-32">
      <div className="mx-auto max-w-[1800px] px-6 md:px-10">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <div className="chip mb-4"><span className="dot" />Selected Work</div>
            <h2 className="display text-white text-[clamp(40px,6vw,96px)]">
              Recent <span className="serifital italic text-[color:var(--violet)]">shipments.</span>
            </h2>
          </div>
          <div className="mono hidden text-right text-[11px] uppercase tracking-[0.24em] text-white/50 md:block">
            2023 — 2026<br/>Index (05)
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
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
  const layout = i === 0
    ? "col-span-12"
    : i % 3 === 1 ? "col-span-12 md:col-span-7"
    : i % 3 === 2 ? "col-span-12 md:col-span-5"
    : "col-span-12 md:col-span-6";

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
        className="tile relative aspect-[16/10] overflow-hidden"
      >
        {/* image plate */}
        <div className="absolute inset-0">
          <img src={p.img} alt="" className="h-full w-full object-cover opacity-60 transition duration-[900ms] group-hover:scale-[1.04] group-hover:opacity-80" />
          <div className="absolute inset-0" style={{ background: `radial-gradient(60% 60% at 70% 30%, ${p.tint}33, transparent 70%), linear-gradient(180deg, #05050700 0%, #050507ee 100%)` }} />
        </div>

        {/* top row: index + chip */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6">
          <span className="num-idx">— {p.n}</span>
          <span className="chip"><span className="dot" style={{ background: p.tint, boxShadow: `0 0 12px ${p.tint}` }} />{p.tag}</span>
        </div>

        {/* bottom content */}
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="display text-white text-[clamp(32px,5vw,80px)] leading-[0.9]">{p.title}</div>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-white/70">{p.desc}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.stack.map((t) => (
                  <span key={t} className="mono rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/70">{t}</span>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                {p.metrics.map((m) => (
                  <div key={m.k}>
                    <div className="display text-white text-[clamp(18px,1.6vw,22px)] leading-none">{m.v}</div>
                    <div className="mono mt-1 text-[10px] uppercase tracking-[0.2em] text-white/45">{m.k}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="mono text-[11px] uppercase tracking-[0.22em] text-white/60">{p.role}</span>
              <span className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition group-hover:bg-white group-hover:text-black">↗</span>
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
    <section id="studio" ref={ref} className="relative overflow-hidden py-32 md:py-40">
      <div className="glow-blob left-[10%] top-[20%] h-[400px] w-[400px]" style={{ background: "radial-gradient(circle, #2a2d38, transparent 60%)", opacity: .5 }} />

      <div className="mx-auto max-w-[1800px] px-6 md:px-10">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="chip mb-4"><span className="dot" />The Studio · 001</div>
            <h2 className="display text-white text-[clamp(40px,6vw,96px)]">
                Mobile, made <span className="serifital italic text-[color:var(--violet)]">calm.</span>
            </h2>
          </div>
          <div className="mono max-w-xs text-[12px] uppercase tracking-[0.22em] text-white/50">
              Android · Flutter · Karachi, PK<br/>Offline-first · Crash-resistant · On-device ML.
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* pull-quote glass card */}
          <motion.div style={{ y: y1 }} className="col-span-12 md:col-span-7">
            <div className="tile relative p-8 md:p-12">
              <div className="absolute right-6 top-4 serifital text-[140px] leading-none text-white/10">“</div>
              <div className="serifital text-white/95 text-[clamp(28px,3.4vw,52px)] leading-[1.1]">
                Great mobile UX is invisible engineering — <span className="italic text-[color:var(--violet)]">offline that just works, sync you never notice, releases that don&apos;t crash.</span>
              </div>
              <div className="mt-10 flex items-center gap-4">
                <div className="h-12 w-12 overflow-hidden rounded-full ring-1 ring-white/20">
                  <img src="/portrait.jpg" alt="" className="h-full w-full object-cover" />
                </div>
                <div>
                  <div className="mono text-[12px] uppercase tracking-[0.22em] text-white">Muhammad Shayan</div>
                  <div className="mono text-[11px] uppercase tracking-[0.22em] text-white/50">Android &amp; Flutter Engineer</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* stat cluster */}
          <motion.div style={{ y: y2 }} className="col-span-12 grid grid-cols-2 gap-4 md:col-span-5">
            {stats.map((s) => (
              <div key={s.k} className="tile flex flex-col justify-between p-6 aspect-square">
                <div className="mono text-[11px] uppercase tracking-[0.22em] text-white/50">{s.k}</div>
                <div className="display text-white text-[clamp(48px,6vw,88px)] leading-none">{s.v}</div>
              </div>
            ))}
          </motion.div>

          {/* bio strip */}
          <div className="col-span-12 mt-6 grid grid-cols-12 gap-6">
            <p className="col-span-12 text-lg leading-relaxed text-white/70 md:col-span-6">
              I work end-to-end on mobile products — from Compose UI systems and offline-first data layers to on-device ML inference and CI/CD delivery pipelines.
            </p>
            <p className="col-span-12 text-lg leading-relaxed text-white/70 md:col-span-5 md:col-start-8">
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
    <section id="index" className="relative border-t border-white/10 py-32">
      <div className="mx-auto max-w-[1800px] px-6 md:px-10">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="chip mb-4"><span className="dot" />Index · Toolkit</div>
            <h2 className="display text-white text-[clamp(40px,6vw,96px)]">
              Instruments I <span className="serifital italic text-[color:var(--violet)]">reach for.</span>
            </h2>
          </div>
          <div className="mono text-right text-[11px] uppercase tracking-[0.22em] text-white/50">
            {STACK.length} systems<br/>Continuously curated
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
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
              className="tile group flex items-center gap-4 px-5 py-4 md:px-7 md:py-5"
              style={{ transform: hovered === i ? "translateY(-6px)" : undefined }}
            >
              <span className="num-idx">{String(i + 1).padStart(2, "0")}</span>
              <span className="display text-white text-[clamp(22px,2.6vw,40px)] leading-none">{s.name}</span>
              <span className="mono text-[10.5px] uppercase tracking-[0.22em] text-white/50 group-hover:text-[color:var(--violet)]">/ {s.kind}</span>
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
    <section id="metrics" className="relative border-t border-white/10 py-32">
      <div className="mx-auto max-w-[1800px] px-6 md:px-10">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="chip mb-4"><span className="dot live" />Command Center</div>
            <h2 className="display text-white text-[clamp(40px,6vw,96px)]">
              Signals from <span className="serifital italic text-[color:var(--violet)]">production.</span>
            </h2>
          </div>
          <div className="mono text-right text-[11px] uppercase tracking-[0.24em] text-white/50">
            Real-time performance<br/>&amp; reliability metrics
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.k}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1], delay: i * 0.06 }}
              className="tile p-6 md:p-8"
            >
              <div className="mono text-[10.5px] uppercase tracking-[0.22em] text-white/50">{m.s}</div>
              <div className="mt-6 display text-white text-[clamp(44px,5.4vw,84px)] leading-none">{m.v}</div>
              <div className="mono mt-4 text-[11px] uppercase tracking-[0.22em] text-white/70">{m.k}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Timeline() {
  return (
    <section id="story" className="relative border-t border-white/10 py-32">
      <div className="mx-auto max-w-[1800px] px-6 md:px-10">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="chip mb-4"><span className="dot" />The Story</div>
            <h2 className="display text-white text-[clamp(40px,6vw,96px)]">
              Chapters, <span className="serifital italic text-[color:var(--violet)]">in order.</span>
            </h2>
          </div>
          <div className="mono text-right text-[11px] uppercase tracking-[0.24em] text-white/50">
            {TIMELINE.length} chapters<br/>2021 — Now
          </div>
        </div>
        <div className="relative grid grid-cols-12 gap-6">
          <div className="pointer-events-none absolute inset-y-0 left-6 w-px bg-gradient-to-b from-transparent via-white/25 to-transparent md:left-1/2" />
          {TIMELINE.map((c, i) => (
            <motion.div
              key={c.t}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1], delay: (i % 3) * 0.05 }}
              className={`col-span-12 md:col-span-6 ${i % 2 ? "md:col-start-7" : ""}`}
            >
              <div className="tile p-6 md:p-8">
                <div className="flex items-center gap-3">
                  <span className="mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--violet)]">{c.y}</span>
                  <span className="h-px flex-1 bg-white/10" />
                </div>
                <div className="mt-4 display text-white text-[clamp(24px,2.4vw,34px)] leading-tight">{c.t}</div>
                <div className="mono mt-2 text-[11px] uppercase tracking-[0.22em] text-white/55">{c.o}</div>
                <ul className="mt-5 space-y-2">
                  {c.b.map((line) => (
                    <li key={line} className="flex gap-3 text-sm text-white/70">
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
    <section id="lab" className="relative border-t border-white/10 py-32">
      <div className="mx-auto max-w-[1800px] px-6 md:px-10">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="chip mb-4"><span className="dot" />The Lab · Experiments</div>
            <h2 className="display text-white text-[clamp(40px,6vw,96px)]">
              What I&apos;m <span className="serifital italic text-[color:var(--violet)]">tinkering on.</span>
            </h2>
          </div>
          <div className="mono text-right text-[11px] uppercase tracking-[0.24em] text-white/50">
            {LAB.length} experiments<br/>Mostly on-device ML
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {LAB.map((l, i) => (
            <motion.div
              key={l.t}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1], delay: i * 0.06 }}
              className="tile group relative overflow-hidden p-6 md:p-8"
            >
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-30 blur-3xl transition group-hover:opacity-60" style={{ background: `radial-gradient(circle, ${l.tint}, transparent 70%)` }} />
              <div className="relative flex items-center justify-between">
                <span className="chip"><span className="dot" style={{ background: l.tint, boxShadow: `0 0 10px ${l.tint}` }} />{l.s}</span>
                <span className="num-idx">— {String(i + 1).padStart(2, "0")}</span>
              </div>
              <div className="relative mt-8 display text-white text-[clamp(24px,2.2vw,32px)] leading-tight">{l.t}</div>
              <p className="relative mt-3 text-sm leading-relaxed text-white/70">{l.d}</p>
              <div className="relative mt-6 flex flex-wrap gap-2">
                {l.tech.map((t) => (
                  <span key={t} className="mono rounded-full border border-white/15 bg-white/[0.04] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/70">{t}</span>
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
    <section id="contact" className="relative overflow-hidden border-t border-white/10 py-32">
      <div className="glow-blob left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2" style={{ background: "radial-gradient(circle, #2a2d38, transparent 60%)", opacity: .6 }} />

      <div className="relative mx-auto max-w-[1800px] px-6 md:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex"><span className="chip"><span className="dot live" />Booking Q3 — Q4 2026</span></div>
          <h2 className="display text-white text-[clamp(56px,12vw,200px)] leading-[0.86]">
            <div><SplitReveal text="Let's build" /></div>
            <div><span className="serifital italic text-[color:var(--violet)]"><SplitReveal text="something rare." delay={0.08} /></span></div>
          </h2>

          <div className="mt-14 flex flex-col items-center gap-6">
            <a href="mailto:hello@shayxo.dev" data-cursor="Write" className="pill-btn text-white">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-black">✎</span>
              <span className="display text-[clamp(22px,2.6vw,36px)] leading-none">hello@shayxo.dev</span>
              <span className="mono text-xl">↗</span>
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

        <div className="mt-24 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { k: "Location", v: "Karachi, PK" },
            { k: "Working",  v: "Global · Remote" },
            { k: "Response", v: "< 24 hours" },
            { k: "Timezone", v: "GMT +5" },
          ].map((c) => (
            <div key={c.k} className="tile p-5">
              <div className="mono text-[10.5px] uppercase tracking-[0.22em] text-white/50">{c.k}</div>
              <div className="mt-3 mono text-sm text-white">{c.v}</div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-8 mono text-[11px] uppercase tracking-[0.22em] text-white/40">
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
