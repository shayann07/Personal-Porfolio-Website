import { createFileRoute } from "@tanstack/react-router";
import { motion, useMotionValue, useScroll, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Cursor } from "@/components/Cursor";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Muhammad Shayan — Spatial Portfolio" },
      { name: "description", content: "Spatial portfolio of Muhammad Shayan — Mobile Engineer building Android, Flutter, and on-device ML products. A layered glass bento in monochrome platinum." },
      { property: "og:title", content: "Muhammad Shayan — Spatial Portfolio" },
      { property: "og:description", content: "Layered glass bento portfolio: Android, Flutter, on-device ML, and offline-first mobile systems." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

const METRICS = [
  { v: "3+", k: "Live Apps" },
  { v: "10k+", k: "Installs", accent: true },
  { v: "99%+", k: "Stability" },
  { v: "60%", k: "Perf. Gain" },
];

const WORK = [
  { title: "LeafBloom", desc: "On-device plant disease diagnosis. TFLite + Compose + CameraX.", tag: "Vision ML" },
  { title: "GitPulse", desc: "Flutter GitHub analytics with GraphQL and live sync.", tag: "Dev Tool" },
  { title: "Medicare", desc: "HealthTech: appointments, chat, Stripe payments, pharmacy.", tag: "HealthTech" },
];

const LAB = [
  { title: "VectorMap.os", status: "WIP" },
  { title: "ShaderPlay Flutter", status: "Done" },
  { title: "TensorFlow.Mobile", status: "Beta" },
];

/* ---------- pointer parallax context via CSS vars ---------- */

function useKarachiTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () => new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Karachi", hour12: false }).format(new Date());
    setTime(fmt());
    const id = window.setInterval(() => setTime(fmt()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

/* ---------- Depth wrapper: subscribes to pointer + scroll ---------- */

function DepthTile({
  depth = 1,
  className = "",
  children,
  pointerX,
  pointerY,
}: {
  depth?: number;
  className?: string;
  children: ReactNode;
  pointerX: ReturnType<typeof useMotionValue<number>>;
  pointerY: ReturnType<typeof useMotionValue<number>>;
}) {
  // depth: 0 (far, minimal motion) -> 3 (near, most motion)
  const magnitude = depth * 6; // px
  const tx = useTransform(pointerX, (v) => v * magnitude);
  const ty = useTransform(pointerY, (v) => v * magnitude);
  const sx = useSpring(tx, { stiffness: 120, damping: 22, mass: 0.6 });
  const sy = useSpring(ty, { stiffness: 120, damping: 22, mass: 0.6 });

  return (
    <motion.div style={{ x: sx, y: sy }} className={className}>
      {children}
    </motion.div>
  );
}

function SplitReveal({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(" ").map((word, wi) => (
        <span key={`${word}-${wi}`} className="inline-block whitespace-nowrap">
          {Array.from(word).map((ch, ci) => (
            <span key={`${ch}-${ci}`} className="char-mask">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.9, ease: [0.7, 0, 0.2, 1], delay: delay + wi * 0.03 + ci * 0.015 }}
              >
                {ch}
              </motion.span>
            </span>
          ))}
          {wi < text.split(" ").length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}

/* ---------- Header ---------- */

function Header() {
  const time = useKarachiTime();
  return (
    <header className="fixed inset-x-0 top-0 z-40 px-[var(--space-gutter)] py-3 md:py-5">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3">
        <a href="#top" data-cursor="Home" className="glass-pill">
          <span className="visual-mark">S</span>
          <span className="nav-link">Shayan</span>
        </a>
        <nav aria-label="Primary" className="glass-pill hidden md:inline-flex">
          {[["Work", "#work"], ["Lab", "#lab"], ["Contact", "#contact"]].map(([label, href]) => (
            <a key={label} href={href} data-cursor="Jump" className="nav-link">{label}</a>
          ))}
        </nav>
        <div className="glass-pill">
          <span className="nav-link">
            <span className="live-dot mr-2" />
            KHI {time || "--:--"}
          </span>
        </div>
      </div>
    </header>
  );
}

function MobileNav() {
  return (
    <nav aria-label="Mobile" className="fixed bottom-3 left-1/2 z-40 -translate-x-1/2 md:hidden">
      <div className="glass-pill">
        {[["Work", "#work"], ["Lab", "#lab"], ["Contact", "#contact"]].map(([l, h]) => (
          <a key={l} href={h} className="nav-link">{l}</a>
        ))}
      </div>
    </nav>
  );
}

/* ---------- Ambient glows with scroll drift ---------- */

function AmbientGlows() {
  const { scrollYProgress } = useScroll();
  const yA = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const yB = useTransform(scrollYProgress, [0, 1], [0, -240]);
  const sA = useSpring(yA, { stiffness: 40, damping: 20 });
  const sB = useSpring(yB, { stiffness: 40, damping: 20 });
  return (
    <>
      <motion.div className="ambient-glow ambient-glow--a" style={{ y: sA }} aria-hidden />
      <motion.div className="ambient-glow ambient-glow--b" style={{ y: sB }} aria-hidden />
    </>
  );
}

/* ---------- Tiles ---------- */

function HeroTile({ px, py }: { px: any; py: any }) {
  return (
    <DepthTile depth={2.4} pointerX={px} pointerY={py} className="md:col-span-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.7, 0, 0.2, 1] }}
        className="tile glass-near group min-h-[420px] md:min-h-[480px] flex flex-col justify-between"
      >
        <div>
          <h1 className="hd-display">
            <span className="block"><SplitReveal text="Muhammad" /></span>
            <span className="block text-[color:var(--mid)] transition-colors duration-700 group-hover:text-[color:var(--platinum)]">
              <SplitReveal text="Shayan" delay={0.1} />
            </span>
          </h1>
          <p className="mt-8 max-w-md body-md">
            Mobile Engineer specializing in Android, Flutter, and high-performance on-device ML architectures.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <span className="chip chip--solid">Android</span>
          <span className="chip">Flutter</span>
          <span className="chip">On-Device ML</span>
        </div>
      </motion.div>
    </DepthTile>
  );
}

function MetricsTile({ px, py }: { px: any; py: any }) {
  return (
    <DepthTile depth={2.8} pointerX={px} pointerY={py} className="md:col-span-4">
      <div className="grid grid-cols-2 gap-4 md:gap-5">
        {METRICS.map((m, i) => (
          <motion.div
            key={m.k}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, delay: i * 0.06, ease: [0.7, 0, 0.2, 1] }}
            whileHover={{ y: -4 }}
            className={`tile ${m.accent ? "tile--inverted" : "glass-mid"} flex flex-col items-center justify-center text-center min-h-[7.5rem] md:min-h-[8.5rem]`}
          >
            <div className="stat-num">{m.v}</div>
            <div className="eyebrow mt-2">{m.k}</div>
          </motion.div>
        ))}
      </div>
    </DepthTile>
  );
}

function FlagshipTile({ px, py }: { px: any; py: any }) {
  return (
    <DepthTile depth={1.6} pointerX={px} pointerY={py} className="md:col-span-7">
      <motion.a
        href="#contact"
        data-cursor="View"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.7, 0, 0.2, 1] }}
        className="tile glass-mid group block min-h-[320px] cursor-pointer"
      >
        <span className="lens-flare" aria-hidden />
        <div className="relative flex h-full flex-col justify-between">
          <div>
            <div className="eyebrow mb-6">Flagship Project</div>
            <h3 className="hd-2">AI Trust Ledger</h3>
            <p className="mt-4 max-w-md body-md">
              Fintech app: ROI cycles, portfolio tracking, and resilient financial flows built on Kotlin, Firebase, and MVVM.
            </p>
          </div>
          <div className="mt-8 flex items-center gap-6">
            <span className="eyebrow text-[color:var(--platinum)] inline-flex items-center gap-2">
              Case Study
              <span className="text-lg transition-transform duration-500 group-hover:translate-x-2">→</span>
            </span>
            <div className="h-px w-12 bg-white/20" />
            <span className="eyebrow">99.8% Crash-Free</span>
          </div>
        </div>
      </motion.a>
    </DepthTile>
  );
}

function LabTile({ px, py }: { px: any; py: any }) {
  const time = useKarachiTime();
  return (
    <DepthTile depth={1.8} pointerX={px} pointerY={py} className="md:col-span-5">
      <motion.div
        id="lab"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, delay: 0.08, ease: [0.7, 0, 0.2, 1] }}
        className="tile glass-near min-h-[320px] flex flex-col justify-between"
      >
        <div>
          <div className="eyebrow mb-8">Lab Experiments</div>
          <ul className="space-y-1">
            {LAB.map((l) => (
              <li key={l.title} className="lab-row">
                <span>{l.title}</span>
                <span className="lab-status">{l.status}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
          <span className="eyebrow">Karachi</span>
          <div className="flex items-center gap-2">
            <span className="live-dot" />
            <span className="eyebrow">{time || "--:--"} GMT+5</span>
          </div>
        </div>
      </motion.div>
    </DepthTile>
  );
}

function WorkTile({ w, i, px, py }: { w: (typeof WORK)[number]; i: number; px: any; py: any }) {
  const depths = [1.2, 1.4, 1.0];
  return (
    <DepthTile depth={depths[i] ?? 1} pointerX={px} pointerY={py} className="md:col-span-4">
      <motion.a
        href="#contact"
        data-cursor="View"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7, delay: i * 0.08, ease: [0.7, 0, 0.2, 1] }}
        whileHover={{ y: -6 }}
        className="tile glass-far group block min-h-[220px]"
      >
        <div className="relative flex h-full flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="eyebrow">{String(i + 2).padStart(2, "0")}</span>
              <span className="chip">{w.tag}</span>
            </div>
            <h3 className="hd-3 mt-6">{w.title}</h3>
            <p className="body-sm mt-3">{w.desc}</p>
          </div>
          <div className="eyebrow mt-6 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-1">
            Explore Stack →
          </div>
        </div>
      </motion.a>
    </DepthTile>
  );
}

function ContactStrip() {
  return (
    <motion.div
      id="contact"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1] }}
      className="md:col-span-12 footer-strip flex flex-col md:flex-row items-center justify-between gap-6"
    >
      <div className="flex flex-wrap items-center gap-6 md:gap-10">
        <a href="mailto:hello@shayxo.dev" data-cursor="Write" className="eyebrow hover:text-[color:var(--platinum)] transition-colors">hello@shayxo.dev ↗</a>
        <a href="https://github.com/shayann07" data-cursor="GitHub" className="eyebrow hover:text-[color:var(--platinum)] transition-colors">GitHub ↗</a>
        <a href="https://www.linkedin.com/in/shayann07" data-cursor="LinkedIn" className="eyebrow hover:text-[color:var(--platinum)] transition-colors">LinkedIn ↗</a>
      </div>
      <div className="eyebrow">Spatial Folio — v4 — Platinum</div>
    </motion.div>
  );
}

/* ---------- Page ---------- */

function Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    let nx = 0;
    let ny = 0;
    const onMove = (e: PointerEvent) => {
      nx = (e.clientX / window.innerWidth - 0.5) * 2;
      ny = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          px.set(nx);
          py.set(ny);
          raf = 0;
        });
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [px, py, reduce]);

  return (
    <div id="top" ref={containerRef} className="grain relative isolate min-h-screen overflow-x-clip">
      <AmbientGlows />
      <Cursor />
      <Header />
      <MobileNav />

      <main className="relative z-10 pt-24 pb-24 md:pt-32">
        <section id="work" className="container-x">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
            <HeroTile px={px} py={py} />
            <MetricsTile px={px} py={py} />
            <FlagshipTile px={px} py={py} />
            <LabTile px={px} py={py} />
            {WORK.map((w, i) => (
              <WorkTile key={w.title} w={w} i={i} px={px} py={py} />
            ))}
            <ContactStrip />
          </div>
        </section>
      </main>
    </div>
  );
}
