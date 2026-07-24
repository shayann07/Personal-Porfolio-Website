import { createFileRoute } from "@tanstack/react-router";
import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight, Mail, FileDown, MapPin, Gauge, Zap } from "lucide-react";
import { personalLinks } from "@/config/personalLinks";
import portrait from "/portrait.jpg?url";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Muhammad Shayan — Software Engineer & AI Developer" },
      { name: "description", content: "Portfolio of Muhammad Shayan — building high-performance products with AI, mobile and web." },
      { property: "og:title", content: "Muhammad Shayan — Software Engineer & AI Developer" },
      { property: "og:description", content: "Portfolio of Muhammad Shayan — building high-performance products with AI, mobile and web." },
      { property: "og:image", content: "/og-image.png" },
      { name: "twitter:image", content: "/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

/* ═══════════════════════════════ Motion System ═══════════════════════════════ */
type Intensity = "low" | "high";
const MotionCtx = createContext<{ intensity: Intensity; setIntensity: (v: Intensity) => void; reduced: boolean }>({
  intensity: "high", setIntensity: () => {}, reduced: false,
});
const useMotionPref = () => useContext(MotionCtx);

function MotionProvider({ children }: { children: React.ReactNode }) {
  const reduced = !!useReducedMotion();
  const [intensity, setIntensity] = useState<Intensity>("high");
  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("motion-intensity")) as Intensity | null;
    if (saved === "low" || saved === "high") setIntensity(saved);
    else if (reduced) setIntensity("low");
    else if (typeof navigator !== "undefined") {
      const n = navigator as any;
      if ((n.hardwareConcurrency || 8) <= 4 || (n.deviceMemory || 8) <= 4) setIntensity("low");
    }
  }, [reduced]);
  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? "low" : intensity;
    try { localStorage.setItem("motion-intensity", intensity); } catch {}
  }, [intensity, reduced]);
  return <MotionCtx.Provider value={{ intensity, setIntensity, reduced }}>{children}</MotionCtx.Provider>;
}

/* ═══════════════════════════════ Utilities ═══════════════════════════════ */
function useClock(tz = "Asia/Karachi") {
  const [time, setTime] = useState(() => fmt(new Date(), tz));
  useEffect(() => { const id = setInterval(() => setTime(fmt(new Date(), tz)), 30_000); return () => clearInterval(id); }, [tz]);
  return time;
}
function fmt(d: Date, tz: string) {
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: tz }).format(d);
}

function useRafPointer(cb: (x: number, y: number, el: HTMLElement) => void) {
  const raf = useRef(0);
  const pending = useRef<{ x: number; y: number; el: HTMLElement } | null>(null);
  return useCallback((e: React.PointerEvent<HTMLElement>) => {
    pending.current = { x: e.clientX, y: e.clientY, el: e.currentTarget };
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => { raf.current = 0; if (pending.current) cb(pending.current.x, pending.current.y, pending.current.el); });
  }, [cb]);
}

/* ═══════════════════════════════ Liquid Glass Tile ═══════════════════════════════ */
function Tile({
  className = "", children, href, dark = false, tilt = 12, parallax,
}: {
  className?: string; children?: React.ReactNode; href?: string; dark?: boolean; tilt?: number;
  parallax?: MotionValue<number>;
}) {
  const { intensity, reduced } = useMotionPref();
  const enabled = !reduced && intensity === "high";
  const strength = enabled ? tilt : 0;

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 220, damping: 22, mass: 0.4 });
  const sry = useSpring(ry, { stiffness: 220, damping: 22, mass: 0.4 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const lift = useMotionValue(0);
  const sLift = useSpring(lift, { stiffness: 180, damping: 24 });

  const fallbackY = useMotionValue(0);
  const yOffset = parallax ?? fallbackY;
  const shadowY = useTransform(sLift, v => 20 + v * 0.9);
  const shadowBlur = useTransform(sLift, v => 40 + v * 1.6);

  const transform = useMotionTemplate`perspective(1400px) translate3d(0, ${yOffset}px, ${sLift}px) rotateX(${srx}deg) rotateY(${sry}deg)`;
  const glow = useMotionTemplate`radial-gradient(600px circle at ${gx}% ${gy}%, oklch(0.72 0.20 285 / 0.30), oklch(0.82 0.14 210 / 0.10) 35%, transparent 65%)`;
  const specular = useMotionTemplate`radial-gradient(220px circle at ${gx}% ${gy}%, rgba(255,255,255,0.30), transparent 60%)`;
  const shadow = useMotionTemplate`0 ${shadowY}px ${shadowBlur}px -20px oklch(0.72 0.20 285 / 0.45), 0 30px 80px -30px rgba(0,0,0,0.7)`;

  const onMove = useRafPointer((cx, cy, el) => {
    const r = el.getBoundingClientRect();
    const px = (cx - r.left) / r.width;
    const py = (cy - r.top) / r.height;
    ry.set((px - 0.5) * strength);
    rx.set(-(py - 0.5) * strength);
    gx.set(px * 100); gy.set(py * 100);
  });
  const onEnter = () => { if (enabled) lift.set(32); };
  const onLeave = () => { rx.set(0); ry.set(0); lift.set(0); };

  const Comp: any = href ? "a" : "div";
  const props: any = href ? { href, target: href.startsWith("http") || href.startsWith("mailto") ? "_blank" : undefined, rel: "noreferrer" } : {};

  return (
    <motion.div
      onPointerMove={enabled ? onMove : undefined}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      style={{ transform, boxShadow: shadow, transformStyle: "preserve-3d", willChange: "transform" }}
      className={`glass ${dark ? "glass-dark" : ""} ${className}`}
    >
      <Comp {...props} className="block h-full w-full rounded-[inherit]">
        {/* Dynamic ambient glow */}
        <motion.div aria-hidden className="absolute inset-0 rounded-[inherit] pointer-events-none opacity-0 [.glass:hover_&]:opacity-100 transition-opacity duration-500" style={{ background: glow }} />
        {/* Specular highlight following cursor (liquid feel) */}
        <motion.div aria-hidden className="absolute inset-0 rounded-[inherit] pointer-events-none opacity-0 [.glass:hover_&]:opacity-100 transition-opacity duration-500 mix-blend-screen" style={{ background: specular }} />
        <div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
          {children}
        </div>
      </Comp>
    </motion.div>
  );
}

/* ═══════════════════════════════ 3D Cube ═══════════════════════════════ */
function Cube({ size = 160, rotate }: { size?: number; rotate?: MotionValue<number> }) {
  const { intensity, reduced } = useMotionPref();
  const spin = !reduced && intensity === "high";
  const half = size / 2;
  const faces = [
    { t: `translateZ(${half}px)` },
    { t: `rotateY(180deg) translateZ(${half}px)` },
    { t: `rotateY(90deg) translateZ(${half}px)` },
    { t: `rotateY(-90deg) translateZ(${half}px)` },
    { t: `rotateX(90deg) translateZ(${half}px)` },
    { t: `rotateX(-90deg) translateZ(${half}px)` },
  ];
  const fallback = useMotionValue(0);
  const scrollRot = rotate ?? fallback;
  const rotX = useTransform(scrollRot, v => v * 0.4);
  const scrollTransform = useMotionTemplate`rotateY(${scrollRot}deg) rotateX(${rotX}deg)`;
  return (
    <motion.div
      className={spin ? "spin-xy" : ""}
      style={{ width: size, height: size, transformStyle: "preserve-3d", transform: spin ? undefined : (scrollTransform as any) }}
    >
      {faces.map((f, i) => <div key={i} className="cube-face" style={{ transform: f.t }} />)}
    </motion.div>
  );
}

/* ═══════════════════════════════ Orbit ═══════════════════════════════ */
function Orbit({ radius, duration, size = 8, color = "oklch(0.72 0.20 285 / 0.9)", delay = 0 }: any) {
  const { intensity, reduced } = useMotionPref();
  const on = !reduced && intensity === "high";
  return (
    <div className="absolute inset-0 flex items-center justify-center"
      style={{ animation: on ? `spin-y ${duration}s linear infinite` : undefined, animationDelay: `${delay}s`, transformStyle: "preserve-3d" }}>
      <div className="ring3d" style={{ width: radius * 2, height: radius * 2 }} />
      <div style={{ position: "absolute", width: size, height: size, borderRadius: 9999,
          background: color, boxShadow: `0 0 20px ${color}`, transform: `translateX(${radius}px)` }} />
    </div>
  );
}

/* ═══════════════════════════════ Cursor spot ═══════════════════════════════ */
function CursorSpot() {
  const { intensity, reduced } = useMotionPref();
  const x = useMotionValue(-500); const y = useMotionValue(-500);
  const sx = useSpring(x, { stiffness: 90, damping: 26, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 90, damping: 26, mass: 0.5 });
  useEffect(() => {
    if (reduced || intensity === "low") return;
    let raf = 0, px = -500, py = -500;
    const on = (e: PointerEvent) => { px = e.clientX - 350; py = e.clientY - 350; if (!raf) raf = requestAnimationFrame(() => { raf = 0; x.set(px); y.set(py); }); };
    window.addEventListener("pointermove", on, { passive: true });
    return () => { window.removeEventListener("pointermove", on); cancelAnimationFrame(raf); };
  }, [x, y, intensity, reduced]);
  if (reduced || intensity === "low") return null;
  return (
    <motion.div aria-hidden style={{ x: sx, y: sy }} className="pointer-events-none fixed left-0 top-0 z-0 h-[700px] w-[700px] rounded-full will-change-transform">
      <div className="h-full w-full rounded-full opacity-70"
           style={{ background: "radial-gradient(closest-side, oklch(0.72 0.20 285 / 0.35), oklch(0.82 0.14 210 / 0.14) 45%, transparent 70%)" }} />
    </motion.div>
  );
}

/* ═══════════════════════════════ HUD & Toggle ═══════════════════════════════ */
function PerfHUD() {
  const [fps, setFps] = useState(0);
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    let raf = 0, frames = 0, last = performance.now();
    const loop = (t: number) => { frames++; if (t - last > 500) { setFps(Math.round((frames * 1000) / (t - last))); frames = 0; last = t; } raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  if (!import.meta.env.DEV) return null;
  return <div className="fixed bottom-3 left-3 z-50 rounded-md border border-hairline bg-background/60 px-2 py-1 font-mono text-[10px] tracking-widest text-foreground/50 backdrop-blur">FPS {fps}</div>;
}

function MotionToggle() {
  const { intensity, setIntensity, reduced } = useMotionPref();
  return (
    <button
      onClick={() => setIntensity(intensity === "high" ? "low" : "high")}
      aria-label={`Motion intensity ${intensity}. Click to toggle.`}
      className="group inline-flex items-center gap-1.5 rounded-full border border-hairline bg-foreground/5 px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-foreground/70 backdrop-blur-md transition hover:bg-foreground/10 hover:text-foreground"
    >
      {intensity === "high" ? <Zap className="h-3 w-3" /> : <Gauge className="h-3 w-3" />}
      {reduced ? "reduced" : intensity}
    </button>
  );
}

/* ═══════════════════════════════ Page ═══════════════════════════════ */
function Index() {
  return (
    <MotionProvider>
      <IndexInner />
      <PerfHUD />
    </MotionProvider>
  );
}

function IndexInner() {
  const { intensity, reduced } = useMotionPref();
  const enabled = !reduced && intensity === "high";
  const time = useClock("Asia/Karachi");

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const nameY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const nameOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const nameScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const gridZ = useTransform(scrollYProgress, [0, 1], [0, enabled ? 220 : 0]);
  const gridRot = useTransform(scrollYProgress, [0, 1], [0, enabled ? -8 : 0]);

  const { scrollYProgress: pageY } = useScroll();
  const orbY1 = useTransform(pageY, [0, 1], [0, -300]);
  const orbY2 = useTransform(pageY, [0, 1], [0, 400]);
  const orbY3 = useTransform(pageY, [0, 1], [0, -200]);

  // Parallax depths for tiles (varying speeds)
  const paraA = useTransform(pageY, [0, 1], [0, enabled ? -50 : 0]);
  const paraB = useTransform(pageY, [0, 1], [0, enabled ? -110 : 0]);
  const paraC = useTransform(pageY, [0, 1], [0, enabled ? -35 : 0]);
  const paraD = useTransform(pageY, [0, 1], [0, enabled ? -85 : 0]);
  const paraE = useTransform(pageY, [0, 1], [0, enabled ? -140 : 0]);
  const paraF = useTransform(pageY, [0, 1], [0, enabled ? -65 : 0]);
  const cubeRot = useTransform(pageY, [0, 1], [0, 720]);

  const projects = useMemo(() => [
    { name: "Numi",   role: "AI budgeting for iOS",       tag: "SwiftUI · CoreML", year: "2025", tint: "from-violet-500/25 to-fuchsia-500/10" },
    { name: "Signal", role: "Realtime market dashboard",  tag: "Next.js · WS",     year: "2025", tint: "from-cyan-400/25 to-blue-500/10" },
    { name: "Kairos", role: "Voice-first journaling",     tag: "RN · Whisper",     year: "2024", tint: "from-emerald-400/25 to-teal-500/10" },
    { name: "Loom",   role: "Design tokens pipeline",     tag: "TS · CLI",         year: "2024", tint: "from-amber-400/25 to-orange-500/10" },
  ], []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Atmosphere layer */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <motion.div style={{ y: orbY1, background: "radial-gradient(closest-side, oklch(0.72 0.20 285 / 0.85), transparent)" }}
          className="orb orb-a left-[-10%] top-[6%] h-[560px] w-[560px]" />
        <motion.div style={{ y: orbY2, background: "radial-gradient(closest-side, oklch(0.82 0.14 210 / 0.75), transparent)" }}
          className="orb orb-b right-[-8%] top-[28%] h-[620px] w-[620px]" />
        <motion.div style={{ y: orbY3, background: "radial-gradient(closest-side, oklch(0.75 0.22 340 / 0.65), transparent)" }}
          className="orb orb-c left-[25%] bottom-[-15%] h-[680px] w-[680px]" />
      </div>
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 opacity-[0.045]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)", backgroundSize: "72px 72px" }} />
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 grain" />

      <CursorSpot />

      {/* ═══ Top bar ═══ */}
      <header className="relative z-30 mx-auto flex max-w-[1440px] items-center justify-between px-6 py-6 md:px-10 md:py-8">
        <div className="flex items-center gap-3">
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 text-emerald-400 dot-ping" aria-hidden />
          <span className="text-sm font-medium tracking-tight">Muhammad Shayan</span>
        </div>
        <nav className="hidden gap-8 md:flex" aria-label="Primary">
          {["Work","About","Stack","Contact"].map(x => (
            <a key={x} href={`#${x.toLowerCase()}`} className="text-sm text-foreground/60 transition hover:text-foreground">{x}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <MotionToggle />
          <div className="hidden items-center gap-1.5 text-xs text-foreground/60 sm:flex">
            <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span>Karachi · {time}</span>
          </div>
        </div>
      </header>

      {/* ═══ HERO ═══ */}
      <section ref={heroRef} className="scene relative z-10 mx-auto max-w-[1440px] px-4 md:px-10">
        <div className="flex items-center gap-3 pl-2">
          <span className="eyebrow">Portfolio</span>
          <span className="h-px flex-1 bg-hairline" />
          <span className="eyebrow">v2026.6</span>
        </div>

        <motion.h1
          aria-label="Muhammad Shayan"
          style={{ y: nameY, opacity: nameOpacity, scale: nameScale }}
          className="h-display mt-6 pointer-events-none select-none will-change-transform"
        >
          <span className="block text-[clamp(72px,17vw,280px)]">Muhammad</span>
          <span className="block text-[clamp(72px,17vw,280px)] -mt-[0.08em] italic-serif">Shayan.</span>
        </motion.h1>

        <div className="mt-8 flex max-w-2xl flex-col gap-4 pl-2">
          <p className="body-lg">
            Software engineer & AI developer based in Karachi. I design and ship <span className="italic-serif text-foreground">fast, quiet, human</span> products across iOS, web and applied AI.
          </p>
        </div>

        {/* Bento grid — hierarchy: 1 hero tile + 6 supporting */}
        <motion.div
          style={{ z: gridZ, rotateX: gridRot, transformStyle: "preserve-3d" }}
          className="mt-20 grid grid-cols-6 gap-4 md:mt-28"
        >
          {/* Hero tile — Selected Work with floating cube */}
          <Reveal className="col-span-6 md:col-span-4 aspect-[16/9] md:aspect-[16/7]">
            <Tile href="#work" tilt={10} parallax={paraB}>
              <div className="relative h-full w-full">
                <div className="absolute right-6 top-6 md:right-12 md:top-12" style={{ transform: "translateZ(100px)" }}>
                  <div className="floaty"><Cube size={140} rotate={cubeRot} /></div>
                </div>
                <div className="flex h-full flex-col justify-between p-8 md:p-12" style={{ transform: "translateZ(50px)" }}>
                  <div className="flex items-center justify-between">
                    <span className="eyebrow">01 · Selected Work</span>
                    <span className="hidden font-mono text-xs text-foreground/40 md:inline">2020 — 2026</span>
                  </div>
                  <div className="max-w-xl">
                    <div className="h-display text-5xl md:text-7xl">
                      Ambitious products,<br/>
                      <span className="italic-serif">quietly obsessed over.</span>
                    </div>
                    <p className="body-sm mt-5 max-w-md">
                      Indie iOS launches, production dashboards, AI tooling — full-cycle craft from first sketch to shipped release.
                    </p>
                  </div>
                </div>
              </div>
            </Tile>
          </Reveal>

          {/* Portrait */}
          <Reveal delay={0.05} className="col-span-6 md:col-span-2 aspect-[4/5]">
            <Tile dark tilt={8} parallax={paraD}>
              <img src={portrait} alt="Muhammad Shayan portrait" className="absolute inset-0 h-full w-full object-cover opacity-95" loading="lazy" width={1024} height={1280} style={{ transform: "translateZ(10px) scale(1.05)" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-between p-6" style={{ transform: "translateZ(60px)" }}>
                <span className="eyebrow text-white/70">02 · Portrait</span>
                <div>
                  <div className="h-3 text-lg text-white">Engineer</div>
                  <div className="body-sm mt-1 text-white/60">Building AI-first products.</div>
                </div>
              </div>
            </Tile>
          </Reveal>

          {/* Orbital System — 3D flagship */}
          <Reveal delay={0.1} className="col-span-6 md:col-span-2 aspect-[4/5]">
            <Tile tilt={12} parallax={paraE}>
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center"><div className="ring3d ring-conic" style={{ width: 340, height: 340 }} /></div>
                <Orbit radius={110} duration={16} size={12} color="oklch(0.72 0.20 285 / 0.9)" />
                <Orbit radius={150} duration={22} size={8}  color="oklch(0.82 0.14 210 / 0.9)" delay={2} />
                <Orbit radius={190} duration={30} size={6}  color="oklch(0.75 0.22 340 / 0.9)" delay={4} />
                <div className="floaty-slow relative z-10 h-24 w-24 rounded-full"
                  style={{ background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), oklch(0.72 0.20 285 / 0.6) 40%, oklch(0.82 0.14 210 / 0.4) 70%, transparent)",
                           boxShadow: "0 0 60px oklch(0.72 0.20 285 / 0.6), inset 0 0 30px rgba(255,255,255,0.4)",
                           transform: "translateZ(60px)" }} />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                  <span className="eyebrow">03 · System</span>
                  <span className="font-mono text-[10px] text-foreground/60">live</span>
                </div>
              </div>
            </Tile>
          </Reveal>

          {/* Contact */}
          <Reveal delay={0.15} className="col-span-6 md:col-span-2 aspect-[4/3]">
            <Tile href={personalLinks.email.link} parallax={paraA}>
              <div className="flex h-full flex-col justify-between p-7" style={{ transform: "translateZ(40px)" }}>
                <div className="flex items-center justify-between">
                  <span className="eyebrow">04 · Say hi</span>
                  <Mail className="h-4 w-4 text-foreground/50" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="h-3 text-base md:text-lg tracking-tight break-all">{personalLinks.email.label}</div>
                  <div className="body-sm mt-2 text-foreground/45">Replies within 24h · Mon–Fri</div>
                </div>
              </div>
            </Tile>
          </Reveal>

          {/* Résumé */}
          <Reveal delay={0.2} className="col-span-6 md:col-span-2 aspect-[4/3]">
            <Tile href="/muhammad_shayan_cv.pdf" parallax={paraC}>
              <div className="flex h-full flex-col justify-between p-7" style={{ transform: "translateZ(40px)" }}>
                <div className="flex items-center justify-between">
                  <span className="eyebrow">05 · Résumé</span>
                  <FileDown className="h-4 w-4 text-foreground/50" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="h-3 text-lg">Full experience</div>
                  <div className="body-sm mt-2 text-foreground/45">PDF · 2 pages · updated Jun 2026</div>
                </div>
              </div>
            </Tile>
          </Reveal>

          {/* GitHub + LinkedIn — split */}
          <Reveal delay={0.25} className="col-span-3 md:col-span-1 aspect-square">
            <Tile href={personalLinks.github.link} parallax={paraF}>
              <div className="flex h-full flex-col items-start justify-between p-5" style={{ transform: "translateZ(30px)" }}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.4-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/></svg>
                <div>
                  <div className="eyebrow">GitHub</div>
                  <div className="mt-1 text-sm font-medium">{personalLinks.github.label}</div>
                </div>
              </div>
            </Tile>
          </Reveal>
          <Reveal delay={0.27} className="col-span-3 md:col-span-1 aspect-square">
            <Tile href={personalLinks.linkedin.link} parallax={paraF}>
              <div className="flex h-full flex-col items-start justify-between p-5" style={{ transform: "translateZ(30px)" }}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.8v1.7h.1c.5-1 1.9-2 3.9-2 4.2 0 5 2.8 5 6.4V21h-4v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21h-4V9z"/></svg>
                <div>
                  <div className="eyebrow">LinkedIn</div>
                  <div className="mt-1 text-sm font-medium">{personalLinks.linkedin.label}</div>
                </div>
              </div>
            </Tile>
          </Reveal>
        </motion.div>
      </section>

      {/* ═══ Work list — deep 3D hover ═══ */}
      <section id="work" className="scene relative z-10 mx-auto mt-40 max-w-[1440px] px-6 md:mt-56 md:px-10">
        <SectionHead eyebrow="Selected Work" title="Recent projects, quietly obsessed over." />
        <ul className="mt-14 border-y border-hairline">
          {projects.map((p, i) => <ProjectRow key={p.name} project={p} index={i} />)}
        </ul>
      </section>

      {/* ═══ About ═══ */}
      <section id="about" className="relative z-10 mx-auto mt-40 max-w-[1440px] px-6 md:mt-56 md:px-10">
        <SectionHead eyebrow="About" title="Engineer by trade. Designer by instinct." />
        <div className="mt-14 grid grid-cols-12 gap-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="col-span-12 md:col-span-7">
            <p className="h-3 text-2xl md:text-3xl">
              I build software that feels considered — <span className="italic-serif text-foreground">fast, quiet, and human</span>. My work sits between mobile apps, AI systems and the design details that make them worth using.
            </p>
            <p className="body mt-6 max-w-2xl">
              Currently based in Karachi. Previously shipped indie iOS apps, production dashboards, and AI tooling for teams that care about craft.
            </p>
          </motion.div>
          <div className="col-span-12 md:col-span-5">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-8">
              {[["Focus","iOS · AI · Web"],["Based","Karachi, PK"],["Since","2020"],["Available","Q3 2026"]].map(([k,v]) => (
                <div key={k}>
                  <dt className="eyebrow">{k}</dt>
                  <dd className="mt-2 text-lg tracking-tight">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ═══ Stack ═══ */}
      <section id="stack" className="relative z-10 mt-40 md:mt-56">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10">
          <SectionHead eyebrow="Toolkit" title="Tools I reach for daily." />
        </div>
        <div className="mt-14 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className={`${enabled ? "marquee" : "flex"} gap-14 whitespace-nowrap px-6 h-display text-5xl md:text-7xl`}>
            {Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="flex items-center gap-14">
                {["Swift","SwiftUI","TypeScript","React","Next.js","Node","Python","PyTorch","Figma","Postgres","Rust","Tailwind"].map(t => (
                  <span key={t} className="flex items-center gap-14">
                    <span>{t}</span>
                    <span className="text-violet-400/40">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Contact ═══ */}
      <section id="contact" className="scene relative z-10 mx-auto mt-40 max-w-[1440px] px-6 pb-24 md:mt-56 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}
          className="glass relative p-10 md:p-16"
          style={{ transform: "perspective(1600px) rotateX(2deg)" }}
        >
          <div className="absolute -right-16 -top-16 hidden md:block" style={{ transform: "translateZ(100px)" }}>
            <div className="floaty"><Cube size={220} rotate={cubeRot} /></div>
          </div>
          <div className="relative max-w-3xl" style={{ transform: "translateZ(40px)" }}>
            <span className="eyebrow">Let's build</span>
            <h2 className="h-display mt-6 text-[clamp(48px,9vw,140px)]">
              Have a project<br/><span className="italic-serif">in mind?</span>
            </h2>
            <p className="body-lg mt-6 max-w-xl">
              I take on a small number of collaborations each year. If you're building something ambitious, I'd love to hear about it.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a href={personalLinks.email.link} className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-medium text-black transition hover:opacity-90 shimmer">
                <Mail className="h-4 w-4" strokeWidth={2} />
                {personalLinks.email.label}
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a href="/muhammad_shayan_cv.pdf" className="inline-flex items-center gap-3 rounded-full border border-hairline px-6 py-4 text-sm font-medium transition hover:bg-foreground/5">
                <FileDown className="h-4 w-4" strokeWidth={2} />
                Download résumé
              </a>
            </div>
          </div>
        </motion.div>

        <footer className="mt-10 flex flex-col items-start justify-between gap-4 text-xs text-foreground/45 md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} Muhammad Shayan. Handcrafted in Karachi.</div>
          <div className="font-mono">v2026.6 · built with intent</div>
        </footer>
      </section>
    </div>
  );
}

function ProjectRow({ project, index }: { project: any; index: number }) {
  const { intensity, reduced } = useMotionPref();
  const enabled = !reduced && intensity === "high";
  const rx = useMotionValue(0), ry = useMotionValue(0), gx = useMotionValue(50), gy = useMotionValue(50);
  const srx = useSpring(rx, { stiffness: 220, damping: 22 });
  const sry = useSpring(ry, { stiffness: 220, damping: 22 });
  const transform = useMotionTemplate`perspective(1600px) rotateX(${srx}deg) rotateY(${sry}deg)`;
  const light = useMotionTemplate`radial-gradient(700px circle at ${gx}% ${gy}%, rgba(255,255,255,0.08), transparent 60%)`;

  const onMove = useRafPointer((cx, cy, el) => {
    const r = el.getBoundingClientRect();
    const px = (cx - r.left) / r.width, py = (cy - r.top) / r.height;
    ry.set((px - 0.5) * 6); rx.set(-(py - 0.5) * 4);
    gx.set(px * 100); gy.set(py * 100);
  });
  const onLeave = () => { rx.set(0); ry.set(0); };

  return (
    <motion.li
      onPointerMove={enabled ? (onMove as any) : undefined}
      onPointerLeave={onLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.05, ease: [0.16,1,0.3,1] }}
      style={{ transform, transformStyle: "preserve-3d", willChange: "transform" }}
      className="group relative border-b border-hairline last:border-b-0"
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: light }} />
      <a href="#" className="relative grid grid-cols-12 items-baseline gap-4 py-8 md:py-14 transition" style={{ transform: "translateZ(30px)" }}>
        <span className="col-span-1 font-mono text-xs text-foreground/40">0{index+1}</span>
        <span className="h-1 col-span-6 text-3xl md:col-span-5 md:text-6xl transition group-hover:translate-x-2 group-hover:text-white">{project.name}</span>
        <span className="body-sm col-span-5 md:col-span-4">{project.role}</span>
        <span className="hidden font-mono text-xs uppercase tracking-widest text-foreground/45 md:col-span-2 md:block">{project.tag}</span>
        <span className="hidden text-right font-mono text-xs text-foreground/40 md:col-span-1 md:block group-hover:text-foreground">{project.year} ↗</span>
      </a>
      <div className={`pointer-events-none absolute inset-x-0 -inset-y-1 -z-10 rounded-3xl bg-gradient-to-r ${project.tint} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100`} />
    </motion.li>
  );
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40, rotateX: -10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, delay: 0.15 + delay, ease: [0.16,1,0.3,1] }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}

function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="flex items-end justify-between border-b border-hairline pb-6">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="h-1 mt-4 max-w-2xl text-4xl md:text-6xl">{title}</h2>
      </div>
    </div>
  );
}
