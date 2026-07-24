import { createFileRoute } from "@tanstack/react-router";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Sparkles,
  Zap,
  Code2,
  Cpu,
  Layers,
  Rocket,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

/* ---------- Animated aurora backdrop ---------- */
function AuroraBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="aurora-blob"
        style={{
          top: "-20%",
          left: "-10%",
          width: "60vw",
          height: "60vw",
          background:
            "radial-gradient(circle, oklch(0.72 0.24 300 / 0.9), transparent 60%)",
          animation: "aurora-drift 24s ease-in-out infinite",
        }}
      />
      <div
        className="aurora-blob"
        style={{
          top: "10%",
          right: "-20%",
          width: "55vw",
          height: "55vw",
          background:
            "radial-gradient(circle, oklch(0.78 0.18 210 / 0.85), transparent 60%)",
          animation: "aurora-drift-2 28s ease-in-out infinite",
        }}
      />
      <div
        className="aurora-blob"
        style={{
          bottom: "-25%",
          left: "20%",
          width: "50vw",
          height: "50vw",
          background:
            "radial-gradient(circle, oklch(0.72 0.24 25 / 0.7), transparent 60%)",
          animation: "aurora-drift 32s ease-in-out infinite reverse",
        }}
      />
      {/* grid overlay */}
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

/* ---------- Glass tile with pointer-follow spotlight ---------- */
function Tile({
  children,
  className = "",
  variant = "glass",
  index = 0,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "glass" | "strong" | "solid";
  index?: number;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    ref.current!.style.setProperty("--mx", `${e.clientX - r.left}px`);
    ref.current!.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  const base =
    variant === "solid"
      ? "bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10"
      : variant === "strong"
        ? "glass-strong"
        : "glass";
  return (
    <motion.div
      ref={ref}
      id={id}
      onMouseMove={onMove}
      initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className={`spot tile-hover relative overflow-hidden rounded-2xl p-6 ${base} ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Cursor spotlight (full page) ---------- */
function CursorSpot() {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 60, damping: 20 });
  const sy = useSpring(y, { stiffness: 60, damping: 20 });
  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);
  const bg = useTransform([sx, sy], ([lx, ly]) =>
    `radial-gradient(400px circle at ${lx}px ${ly}px, oklch(0.72 0.24 300 / 0.15), transparent 60%)`,
  );
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30 hidden md:block"
      style={{ background: bg as unknown as string }}
    />
  );
}

/* ---------- Animated counter ---------- */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [v, setV] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
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
  }, [to]);
  return (
    <span ref={ref}>
      {Number.isInteger(to) ? Math.round(v) : v.toFixed(1)}
      {suffix}
    </span>
  );
}

/* ---------- Data ---------- */
const projects = [
  {
    tag: "Fintech · Flutter",
    title: "Nexus Pay",
    body: "Cross-platform banking with offline-first sync. 100k+ downloads, 99.9% crash-free.",
    metric: "99.9%",
    metricLabel: "Crash-free",
    accent: "from-fuchsia-400/40 to-violet-500/40",
    icon: Rocket,
  },
  {
    tag: "Health · Android",
    title: "PulseTrack",
    body: "On-device ML for heart-rate variability with TensorFlow Lite and Compose.",
    metric: "42%",
    metricLabel: "Faster inference",
    accent: "from-cyan-400/40 to-blue-500/40",
    icon: Cpu,
  },
  {
    tag: "Logistics · Flutter",
    title: "Cargo OS",
    body: "Fleet ops console. Offline-first BLoC architecture syncing 10k+ events per shift.",
    metric: "10k+",
    metricLabel: "Events / shift",
    accent: "from-rose-400/40 to-orange-500/40",
    icon: Layers,
  },
  {
    tag: "Commerce · Android",
    title: "SwiftCart",
    body: "Native shopping with edge-cached product graphs. Cut cold-start by 58%.",
    metric: "58%",
    metricLabel: "Faster cold-start",
    accent: "from-emerald-400/40 to-teal-500/40",
    icon: Zap,
  },
];

const stack = [
  "Flutter",
  "Kotlin",
  "Jetpack Compose",
  "Dart",
  "TensorFlow Lite",
  "Firebase",
  "Clean Architecture",
  "Offline-First",
  "Coroutines",
  "BLoC",
  "CI / CD",
  "Android SDK",
];

const timeline = [
  { range: "2023 — Now", role: "Senior Flutter Engineer", body: "Consumer fintech · 1M+ users.", active: true },
  { range: "2021 — 2023", role: "Android Developer", body: "Native retail & logistics at scale." },
  { range: "2020", role: "Mobile Engineer", body: "Kotlin · MVVM · Clean Architecture." },
];

function Index() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-paper text-deep-ink">
      <AuroraBackdrop />
      <CursorSpot />

      {/* NAV */}
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-4 z-40 mx-auto mt-4 flex w-[min(1100px,94%)] items-center justify-between rounded-full glass px-5 py-3"
      >
        <a href="#" className="flex items-center gap-2 font-display text-sm font-semibold tracking-tight">
          <span className="relative inline-flex h-2.5 w-2.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-fuchsia-400/60" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-gradient-to-br from-fuchsia-400 to-cyan-400" />
          </span>
          shayan<span className="text-white/40">.dev</span>
        </a>
        <nav className="hidden gap-7 text-xs font-medium tracking-wide text-white/70 md:flex">
          <a href="#work" className="transition hover:text-white">Work</a>
          <a href="#stack" className="transition hover:text-white">Stack</a>
          <a href="#timeline" className="transition hover:text-white">Journey</a>
          <a href="#contact" className="transition hover:text-white">Contact</a>
        </nav>
        <a
          href={CV_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400 px-4 py-1.5 text-xs font-semibold text-black transition hover:shadow-[0_0_30px_-4px_oklch(0.72_0.24_300/0.6)]"
        >
          Résumé
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </motion.header>

      <main className="relative mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
        {/* ============ HERO BENTO ============ */}
        <section className="grid grid-cols-6 gap-3 md:grid-cols-12 md:gap-4">
          {/* Hero name tile */}
          <Tile
            variant="strong"
            className="col-span-6 md:col-span-8 md:row-span-2 min-h-[360px] justify-between"
            index={0}
          >
            <div className="flex items-center gap-2 text-xs font-medium tracking-[0.24em] text-white/50">
              <Sparkles className="h-3.5 w-3.5" />
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
                className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-black transition hover:bg-white/90"
              >
                Start a project
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <a
                href="#work"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-xs font-semibold text-white/80 transition hover:border-white/30 hover:text-white"
              >
                See work
              </a>
            </div>
          </Tile>

          {/* Avatar / portrait tile */}
          <Tile className="col-span-3 md:col-span-4 md:row-span-2 items-center justify-center text-center min-h-[360px]" index={1}>
            <div className="relative flex h-40 w-40 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-400 blur-2xl opacity-60 animate-pulse" />
              <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-400 via-violet-500 to-cyan-400 font-display text-6xl font-semibold text-black">
                MS
              </div>
            </div>
            <p className="mt-6 font-serif text-2xl italic text-white/90">Muhammad Shayan</p>
            <p className="mt-1 text-xs tracking-[0.24em] text-white/40">ISLAMABAD · REMOTE</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-emerald-300">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/70" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Available Q3 · 2026
            </div>
          </Tile>

          {/* Metric — Users */}
          <Tile className="col-span-3 md:col-span-3 justify-between min-h-[160px]" index={2}>
            <div className="flex items-center justify-between text-white/40">
              <Code2 className="h-4 w-4" />
              <span className="text-[10px] tracking-[0.24em]">SHIPPED</span>
            </div>
            <div>
              <div className="font-display text-5xl font-semibold text-white">
                <Counter to={1} suffix="M+" />
              </div>
              <div className="mt-1 text-xs text-white/50">Users reached</div>
            </div>
          </Tile>

          {/* Metric — Crash free */}
          <Tile variant="strong" className="col-span-3 md:col-span-3 justify-between min-h-[160px]" index={3}>
            <div className="flex items-center justify-between text-white/40">
              <Zap className="h-4 w-4" />
              <span className="text-[10px] tracking-[0.24em]">STABILITY</span>
            </div>
            <div>
              <div className="font-display text-5xl font-semibold aurora-text">
                <Counter to={99.9} suffix="%" />
              </div>
              <div className="mt-1 text-xs text-white/50">Crash-free sessions</div>
            </div>
          </Tile>

          {/* Metric — Apps */}
          <Tile className="col-span-3 md:col-span-3 justify-between min-h-[160px]" index={4}>
            <div className="flex items-center justify-between text-white/40">
              <Layers className="h-4 w-4" />
              <span className="text-[10px] tracking-[0.24em]">RELEASED</span>
            </div>
            <div>
              <div className="font-display text-5xl font-semibold text-white">
                <Counter to={24} suffix="" />
              </div>
              <div className="mt-1 text-xs text-white/50">Production apps</div>
            </div>
          </Tile>

          {/* Metric — years */}
          <Tile className="col-span-3 md:col-span-3 justify-between min-h-[160px]" index={5}>
            <div className="flex items-center justify-between text-white/40">
              <Sparkles className="h-4 w-4" />
              <span className="text-[10px] tracking-[0.24em]">EXPERIENCE</span>
            </div>
            <div>
              <div className="font-display text-5xl font-semibold text-white">
                <Counter to={6} suffix="y" />
              </div>
              <div className="mt-1 text-xs text-white/50">Building mobile</div>
            </div>
          </Tile>
        </section>

        {/* ============ WORK BENTO ============ */}
        <section id="work" className="mt-6 grid grid-cols-6 gap-3 md:grid-cols-12 md:gap-4">
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
              >
                <div
                  className={`absolute -top-24 -right-24 h-56 w-56 rounded-full bg-gradient-to-br ${p.accent} blur-3xl opacity-70 transition-opacity duration-700 group-hover:opacity-100`}
                />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] tracking-[0.2em] text-white/60">
                      <Icon className="h-3 w-3" />
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
                    Case Study →
                  </div>
                </div>
              </Tile>
            );
          })}
        </section>

        {/* ============ STACK + TIMELINE ROW ============ */}
        <section className="mt-6 grid grid-cols-6 gap-3 md:grid-cols-12 md:gap-4">
          {/* Marquee stack */}
          <Tile
            id="stack"
            variant="strong"
            className="col-span-6 md:col-span-12 min-h-[200px] justify-between overflow-hidden"
            index={0}
          >
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] tracking-[0.24em] text-white/60">
                <Cpu className="h-3 w-3" /> TOOLKIT
              </div>
              <p className="hidden font-serif text-lg italic text-white/70 md:block">
                the daily instruments.
              </p>
            </div>
            <div className="relative -mx-6 overflow-hidden">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[oklch(0.14_0.02_270)] to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[oklch(0.14_0.02_270)] to-transparent" />
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
          </Tile>

          {/* Timeline */}
          <Tile id="timeline" className="col-span-6 md:col-span-7 min-h-[320px]" index={1}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] tracking-[0.24em] text-white/60">
              <Sparkles className="h-3 w-3" /> JOURNEY
            </div>
            <div className="relative space-y-6 pl-6">
              <div className="absolute left-[7px] top-1 bottom-1 w-px bg-gradient-to-b from-fuchsia-400/60 via-violet-400/40 to-cyan-400/30" />
              {timeline.map((t) => (
                <div key={t.range} className="relative">
                  <span
                    className={`absolute -left-[22px] top-1 h-3 w-3 rounded-full ${
                      t.active
                        ? "bg-gradient-to-br from-fuchsia-400 to-cyan-400 animate-pulse-ring"
                        : "bg-white/25"
                    }`}
                  />
                  <p className="font-mono text-[10px] tracking-widest text-white/40">{t.range}</p>
                  <h4 className="mt-1 font-display text-lg font-semibold text-white">{t.role}</h4>
                  <p className="mt-1 text-sm text-white/55">{t.body}</p>
                </div>
              ))}
            </div>
          </Tile>

          {/* Philosophy quote */}
          <Tile variant="strong" className="col-span-6 md:col-span-5 min-h-[320px] justify-between" index={2}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] tracking-[0.24em] text-white/60">
              PHILOSOPHY
            </div>
            <p className="font-serif text-3xl italic leading-snug text-white/95 md:text-4xl">
              “The best interface is the one you never notice —
              <span className="aurora-text"> until it disappoints you.</span>”
            </p>
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
        <section id="contact" className="mt-6 grid grid-cols-6 gap-3 md:grid-cols-12 md:gap-4">
          <Tile
            variant="strong"
            className="group relative col-span-6 md:col-span-8 md:row-span-2 min-h-[360px] justify-between"
            index={0}
          >
            <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-gradient-to-br from-fuchsia-500/40 via-violet-500/40 to-cyan-400/40 blur-3xl" />
            <div className="relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] tracking-[0.24em] text-white/60">
              <Mail className="h-3 w-3" /> LET&apos;S BUILD
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
              className="relative inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-semibold tracking-widest text-black transition hover:bg-white/90"
            >
              <Mail className="h-3.5 w-3.5" />
              {personalLinks.email.label}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </Tile>

          <Tile className="col-span-3 md:col-span-4 min-h-[172px] justify-between" index={1}>
            <div className="flex items-center justify-between text-white/40">
              <MapPin className="h-4 w-4" />
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
              className="flex h-full flex-col justify-between"
            >
              <div className="flex items-center justify-between text-white/50">
                <Linkedin className="h-5 w-5" />
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
              className="flex w-full items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <Github className="h-6 w-6 text-white/80" />
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

      <footer className="relative mt-12 border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-6 py-8 text-xs text-white/50 md:flex-row md:items-center">
          <p className="font-mono">© 2026 Muhammad Shayan — Crafted in Islamabad.</p>
          <p className="font-mono uppercase tracking-[0.24em]">Obsidian Aurora · v2026.2</p>
        </div>
      </footer>
    </div>
  );
}