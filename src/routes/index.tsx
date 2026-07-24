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
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight, Mail, FileDown, MapPin, Sparkles, Gauge, Zap } from "lucide-react";
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

/* ————————————————————————— Motion Intensity Context ————————————————————————— */
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
    // Auto-drop on low-end devices
    else if (typeof navigator !== "undefined") {
      const nav = navigator as any;
      const cores = nav.hardwareConcurrency || 8;
      const mem = nav.deviceMemory || 8;
      if (cores <= 4 || mem <= 4) setIntensity("low");
    }
  }, [reduced]);
  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? "low" : intensity;
    try { localStorage.setItem("motion-intensity", intensity); } catch {}
  }, [intensity, reduced]);
  return <MotionCtx.Provider value={{ intensity, setIntensity, reduced }}>{children}</MotionCtx.Provider>;
}

/* ————————————————————————— Clock ————————————————————————— */
function useClock(tz = "Asia/Karachi") {
  const [time, setTime] = useState(() => fmt(new Date(), tz));
  useEffect(() => {
    const id = setInterval(() => setTime(fmt(new Date(), tz)), 30_000);
    return () => clearInterval(id);
  }, [tz]);
  return time;
}
function fmt(d: Date, tz: string) {
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: tz }).format(d);
}

/* ————————————————————————— rAF throttled pointer ————————————————————————— */
function useRafPointer(cb: (x: number, y: number, el: HTMLElement) => void) {
  const raf = useRef(0);
  const pending = useRef<{ x: number; y: number; el: HTMLElement } | null>(null);
  return useCallback((e: React.PointerEvent<HTMLElement>) => {
    pending.current = { x: e.clientX, y: e.clientY, el: e.currentTarget };
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      if (pending.current) cb(pending.current.x, pending.current.y, pending.current.el);
    });
  }, [cb]);
}

/* ————————————————————————— Cursor spotlight ————————————————————————— */
function CursorSpot() {
  const { intensity, reduced } = useMotionPref();
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const sx = useSpring(x, { stiffness: 80, damping: 24, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 80, damping: 24, mass: 0.5 });
  useEffect(() => {
    if (reduced || intensity === "low") return;
    let raf = 0; let px = -500, py = -500;
    const on = (e: PointerEvent) => { px = e.clientX - 350; py = e.clientY - 350; if (!raf) raf = requestAnimationFrame(() => { raf = 0; x.set(px); y.set(py); }); };
    window.addEventListener("pointermove", on, { passive: true });
    return () => { window.removeEventListener("pointermove", on); cancelAnimationFrame(raf); };
  }, [x, y, intensity, reduced]);
  if (reduced || intensity === "low") return null;
  return (
    <motion.div aria-hidden style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-0 h-[700px] w-[700px] rounded-full will-change-transform">
      <div className="h-full w-full rounded-full opacity-70"
           style={{ background: "radial-gradient(closest-side, rgba(167,139,250,0.35), rgba(56,189,248,0.15) 45%, transparent 70%)" }} />
    </motion.div>
  );
}

/* ————————————————————————— 3D Tilt Tile ————————————————————————— */
function Tile3D({
  className = "", children, href, dark = false, intensity: intensityProp = 14, parallax,
}: {
  className?: string; children?: React.ReactNode; href?: string; dark?: boolean; intensity?: number;
  parallax?: MotionValue<number>;
}) {
  const { intensity: motionPref, reduced } = useMotionPref();
  const enabled = !reduced && motionPref === "high";
  const strength = enabled ? intensityProp : 0;

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 220, damping: 20, mass: 0.4 });
  const sry = useSpring(ry, { stiffness: 220, damping: 20, mass: 0.4 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const lift = useMotionValue(0);
  const sLift = useSpring(lift, { stiffness: 180, damping: 22 });

  const yOffset = parallax ?? useMotionValue(0);

  const transform = useMotionTemplate`perspective(1400px) translate3d(0, ${yOffset}px, ${sLift}px) rotateX(${srx}deg) rotateY(${sry}deg)`;
  const glow = useMotionTemplate`radial-gradient(500px circle at ${gx}% ${gy}%, rgba(167,139,250,0.35), rgba(56,189,248,0.12) 35%, transparent 65%)`;
  const sheen = useMotionTemplate`linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.14) ${gx}%, transparent 60%)`;
  const shadow = useMotionTemplate`0 ${sLift}px ${useTransform(sLift, v => 40 + v * 1.6)}px -20px rgba(120,80,255,0.5), 0 30px 80px -30px rgba(0,0,0,0.7)`;

  const onMove = useRafPointer((cx, cy, el) => {
    const r = el.getBoundingClientRect();
    const px = (cx - r.left) / r.width;
    const py = (cy - r.top) / r.height;
    ry.set((px - 0.5) * strength);
    rx.set(-(py - 0.5) * strength);
    gx.set(px * 100); gy.set(py * 100);
  });
  const onEnter = () => { if (enabled) lift.set(28); };
  const onLeave = () => { rx.set(0); ry.set(0); lift.set(0); };

  const Comp: any = href ? "a" : "div";
  const props: any = href ? { href, target: href.startsWith("http") || href.startsWith("mailto") ? "_blank" : undefined, rel: "noreferrer" } : {};

  return (
    <motion.div
      onPointerMove={enabled ? onMove : undefined}
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      style={{ transform, boxShadow: shadow, transformStyle: "preserve-3d", willChange: "transform" }}
      className={`tile ${dark ? "tile-dark" : ""} ${className}`}
    >
      <Comp {...props} className="block h-full w-full rounded-[inherit] overflow-hidden">
        <motion.div aria-hidden className="absolute inset-0 rounded-[inherit] pointer-events-none opacity-0 mix-blend-plus-lighter transition-opacity duration-500 hover:opacity-100 [.tile:hover_&]:opacity-100" style={{ background: glow }} />
        <motion.div aria-hidden className="absolute inset-0 rounded-[inherit] pointer-events-none opacity-0 [.tile:hover_&]:opacity-100 transition-opacity duration-500" style={{ background: sheen }} />
        <div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
          {children}
        </div>
      </Comp>
    </motion.div>
  );
}

/* ————————————————————————— 3D Cube ————————————————————————— */
function Cube3D({ size = 200, rotate }: { size?: number; rotate?: MotionValue<number> }) {
  const { intensity, reduced } = useMotionPref();
  const s = size; const half = s / 2;
  const faces = [
    { t: `translateZ(${half}px)` },
    { t: `rotateY(180deg) translateZ(${half}px)` },
    { t: `rotateY(90deg) translateZ(${half}px)` },
    { t: `rotateY(-90deg) translateZ(${half}px)` },
    { t: `rotateX(90deg) translateZ(${half}px)` },
    { t: `rotateX(-90deg) translateZ(${half}px)` },
  ];
  const spin = !reduced && intensity === "high";
  const scrollRot = rotate ?? useMotionValue(0);
  const transform = useMotionTemplate`rotateY(${scrollRot}deg) rotateX(${useTransform(scrollRot, v => v * 0.4)}deg)`;
  return (
    <motion.div
      className={spin ? "spin-xy" : ""}
      style={{ width: s, height: s, transformStyle: "preserve-3d", transform: spin ? undefined : (transform as any) }}
    >
      {faces.map((f, i) => (
        <div key={i} className="cube-face" style={{ transform: f.t }} />
      ))}
    </motion.div>
  );
}

/* ————————————————————————— Orbit ————————————————————————— */
function Orbit({ radius, duration, size = 8, color = "rgba(167,139,250,0.9)", delay = 0 }: any) {
  const { intensity, reduced } = useMotionPref();
  const on = !reduced && intensity === "high";
  return (
    <div className="absolute inset-0 flex items-center justify-center"
      style={{ animation: on ? `spin3d-y ${duration}s linear infinite` : undefined, animationDelay: `${delay}s`, transformStyle: "preserve-3d" }}>
      <div className="ring3d" style={{ width: radius * 2, height: radius * 2 }} />
      <div style={{ position: "absolute", width: size, height: size, borderRadius: 9999,
          background: color, boxShadow: `0 0 20px ${color}`, transform: `translateX(${radius}px)` }} />
    </div>
  );
}

/* ————————————————————————— Perf HUD ————————————————————————— */
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
  return <div className="fixed bottom-3 left-3 z-50 font-mono text-[10px] tracking-widest text-foreground/40 backdrop-blur px-2 py-1 rounded border border-foreground/10">FPS {fps}</div>;
}

/* ————————————————————————— Motion Toggle ————————————————————————— */
function MotionToggle() {
  const { intensity, setIntensity, reduced } = useMotionPref();
  return (
    <button
      onClick={() => setIntensity(intensity === "high" ? "low" : "high")}
      aria-label={`Motion intensity: ${intensity}. Click to toggle.`}
      className="group inline-flex items-center gap-1.5 rounded-full border border-foreground/15 bg-foreground/5 px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-foreground/70 backdrop-blur transition hover:bg-foreground/10 hover:text-foreground"
    >
      {intensity === "high" ? <Zap className="h-3 w-3" /> : <Gauge className="h-3 w-3" />}
      {reduced ? "reduced" : intensity}
    </button>
  );
}

/* ————————————————————————— Page ————————————————————————— */
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
  const nameY = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const nameOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.05]);
  const nameScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const gridZ = useTransform(scrollYProgress, [0, 1], [0, enabled ? 220 : 0]);
  const gridRot = useTransform(scrollYProgress, [0, 1], [0, enabled ? -8 : 0]);

  const { scrollYProgress: pageY } = useScroll();
  const blobY1 = useTransform(pageY, [0, 1], [0, -300]);
  const blobY2 = useTransform(pageY, [0, 1], [0, 400]);
  const blobY3 = useTransform(pageY, [0, 1], [0, -200]);

  // Scroll-synced parallax for tiles (varying depths)
  const tileParaA = useTransform(pageY, [0, 1], [0, enabled ? -60 : 0]);
  const tileParaB = useTransform(pageY, [0, 1], [0, enabled ? -120 : 0]);
  const tileParaC = useTransform(pageY, [0, 1], [0, enabled ? -40 : 0]);
  const tileParaD = useTransform(pageY, [0, 1], [0, enabled ? -90 : 0]);
  const tileParaE = useTransform(pageY, [0, 1], [0, enabled ? -140 : 0]);
  const tileParaF = useTransform(pageY, [0, 1], [0, enabled ? -70 : 0]);

  // Cube scroll rotation
  const cubeRot = useTransform(pageY, [0, 1], [0, 720]);

  const projects = useMemo(() => [
    { name: "Numi", role: "AI budgeting for iOS", tag: "SwiftUI · CoreML", year: "2025", tint: "from-violet-500/30 to-fuchsia-500/10" },
    { name: "Signal", role: "Realtime market dashboard", tag: "Next.js · WS", year: "2025", tint: "from-cyan-400/30 to-blue-500/10" },
    { name: "Kairos", role: "Voice-first journaling", tag: "RN · Whisper", year: "2024", tint: "from-emerald-400/30 to-teal-500/10" },
    { name: "Loom", role: "Design tokens pipeline", tag: "TS · CLI", year: "2024", tint: "from-amber-400/30 to-orange-500/10" },
  ], []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Aurora background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <motion.div style={{ y: blobY1 }} className="blob blob-a left-[-10%] top-[6%] h-[560px] w-[560px]"
          initial={{ background: "radial-gradient(closest-side, rgba(167,139,250,0.8), transparent)" }} />
        <motion.div style={{ y: blobY2 }} className="blob blob-b right-[-8%] top-[28%] h-[620px] w-[620px]"
          initial={{ background: "radial-gradient(closest-side, rgba(56,189,248,0.7), transparent)" }} />
        <motion.div style={{ y: blobY3 }} className="blob blob-c left-[25%] bottom-[-15%] h-[680px] w-[680px]"
          initial={{ background: "radial-gradient(closest-side, rgba(244,114,182,0.7), transparent)" }} />
      </div>

      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 opacity-[0.05]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 grain-fixed" />

      <CursorSpot />

      {/* Top bar */}
      <header className="relative z-20 mx-auto flex max-w-[1440px] items-center justify-between px-6 py-6 md:px-10 md:py-8">
        <div className="flex items-center gap-3">
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 text-emerald-400 dot-ping" />
          <span className="text-sm font-medium tracking-tight">Muhammad Shayan</span>
        </div>
        <nav className="hidden gap-8 text-sm md:flex" aria-label="Primary">
          {["Work","About","Stack","Contact"].map(x => (
            <a key={x} href={`#${x.toLowerCase()}`} className="text-foreground/60 transition hover:text-foreground">{x}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-xs text-foreground/60">
          <MotionToggle />
          <div className="hidden items-center gap-1.5 sm:flex">
            <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span>Karachi · {time}</span>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section ref={heroRef} className="scene relative z-10 mx-auto max-w-[1440px] px-4 md:px-10">
        <motion.h1
          aria-label="Muhammad Shayan"
          style={{ y: nameY, opacity: nameOpacity, scale: nameScale }}
          className="display display-3d pointer-events-none select-none will-change-transform"
        >
          <span className="block text-[clamp(72px,17vw,280px)]">Muhammad</span>
          <span className="block text-[clamp(72px,17vw,280px)] -mt-[0.08em] italic-serif">Shayan.</span>
        </motion.h1>

        <motion.div
          style={{ z: gridZ, rotateX: gridRot, transformStyle: "preserve-3d" }}
          className="relative z-10 -mt-[clamp(120px,22vw,360px)] grid grid-cols-6 gap-3 md:gap-4"
        >
          {/* About */}
          <BentoReveal className="col-span-6 md:col-span-2 aspect-[4/3]">
            <Tile3D href="#about" parallax={tileParaA}>
              <div className="flex h-full flex-col justify-between p-6 md:p-7" style={{ transform: "translateZ(30px)" }}>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-violet-300" />
                  <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/50">01 / Profile</span>
                </div>
                <div>
                  <div className="text-xl font-medium tracking-tight">About</div>
                  <div className="mt-1 text-xs text-foreground/50">Engineer · Designer · Builder</div>
                </div>
              </div>
            </Tile3D>
          </BentoReveal>

          {/* Work + Cube */}
          <BentoReveal delay={0.05} className="col-span-6 md:col-span-4 aspect-[16/9] md:aspect-[16/6]">
            <Tile3D href="#work" intensity={10} parallax={tileParaB}>
              <div className="relative h-full w-full">
                <div className="absolute right-6 top-6 md:right-10 md:top-10" style={{ transform: "translateZ(90px)" }}>
                  <div className="floaty">
                    <Cube3D size={140} rotate={cubeRot} />
                  </div>
                </div>
                <div className="flex h-full flex-col justify-between p-6 md:p-10" style={{ transform: "translateZ(40px)" }}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/50">02 / Portfolio</span>
                    <span className="hidden font-mono text-xs text-foreground/40 md:inline">2020 — 2026</span>
                  </div>
                  <div>
                    <div className="display text-4xl md:text-6xl">Selected<br/><span className="italic-serif">Work.</span></div>
                    <p className="mt-4 max-w-md text-sm text-foreground/60 md:text-base">
                      Ambitious products across mobile, web and AI — indie iOS launches to production dashboards used daily.
                    </p>
                  </div>
                </div>
              </div>
            </Tile3D>
          </BentoReveal>

          {/* Contact */}
          <BentoReveal delay={0.1} className="col-span-6 md:col-span-2 aspect-[4/3] md:aspect-[4/5]">
            <Tile3D href={personalLinks.email.link} parallax={tileParaC}>
              <div className="flex h-full flex-col justify-between p-6 md:p-7" style={{ transform: "translateZ(35px)" }}>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-cyan-300" />
                  <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/50">03 / Say hi</span>
                </div>
                <div>
                  <div className="font-mono text-xs text-foreground/80 md:text-sm break-all">{personalLinks.email.label}</div>
                  <div className="mt-2 text-[10px] text-foreground/40">Reply within 24h · Mon–Fri</div>
                </div>
              </div>
            </Tile3D>
          </BentoReveal>

          {/* Portrait */}
          <BentoReveal delay={0.15} className="col-span-6 md:col-span-2 aspect-[4/5]">
            <Tile3D dark intensity={8} parallax={tileParaD}>
              <img src={portrait} alt="Muhammad Shayan" className="absolute inset-0 h-full w-full object-cover opacity-90" loading="lazy" width={1024} height={1280} style={{ transform: "translateZ(10px) scale(1.05)" }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-between p-6" style={{ transform: "translateZ(50px)" }}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-white/70">04 / Portrait</span>
                  <span className="text-[10px] font-mono text-white/70">PKR · 24°C</span>
                </div>
                <div>
                  <div className="text-lg font-medium text-white tracking-tight">Software Engineer</div>
                  <div className="mt-1 text-xs text-white/60">Building AI-first products.</div>
                </div>
              </div>
            </Tile3D>
          </BentoReveal>

          {/* Orbital */}
          <BentoReveal delay={0.2} className="col-span-6 md:col-span-2 aspect-[4/5]">
            <Tile3D intensity={12} parallax={tileParaE}>
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="ring3d ring-glow" style={{ width: 340, height: 340 }} />
                </div>
                <Orbit radius={110} duration={16} size={12} color="rgba(167,139,250,0.9)" />
                <Orbit radius={150} duration={22} size={8} color="rgba(56,189,248,0.9)" delay={2} />
                <Orbit radius={190} duration={30} size={6} color="rgba(244,114,182,0.9)" delay={4} />
                <div className="floaty-slow relative z-10 h-24 w-24 rounded-full"
                     style={{ background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(167,139,250,0.6) 40%, rgba(56,189,248,0.4) 70%, transparent)",
                              boxShadow: "0 0 60px rgba(167,139,250,0.6), inset 0 0 30px rgba(255,255,255,0.4)",
                              transform: "translateZ(60px)" }} />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/60">05 / System</span>
                  <span className="text-[10px] font-mono text-foreground/60">v2026.6</span>
                </div>
              </div>
            </Tile3D>
          </BentoReveal>

          {/* GitHub */}
          <BentoReveal delay={0.22} className="col-span-3 md:col-span-1 aspect-square">
            <Tile3D href={personalLinks.github.link} parallax={tileParaF}>
              <div className="flex h-full flex-col items-start justify-between p-5" style={{ transform: "translateZ(30px)" }}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.4-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/></svg>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-foreground/50">GitHub</div>
                  <div className="text-sm font-medium">{personalLinks.github.label}</div>
                </div>
              </div>
            </Tile3D>
          </BentoReveal>

          {/* LinkedIn */}
          <BentoReveal delay={0.24} className="col-span-3 md:col-span-1 aspect-square">
            <Tile3D href={personalLinks.linkedin.link} parallax={tileParaF}>
              <div className="flex h-full flex-col items-start justify-between p-5" style={{ transform: "translateZ(30px)" }}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.8v1.7h.1c.5-1 1.9-2 3.9-2 4.2 0 5 2.8 5 6.4V21h-4v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21h-4V9z"/></svg>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-foreground/50">LinkedIn</div>
                  <div className="text-sm font-medium">{personalLinks.linkedin.label}</div>
                </div>
              </div>
            </Tile3D>
          </BentoReveal>

          {/* Résumé */}
          <BentoReveal delay={0.26} className="col-span-6 md:col-span-2 aspect-[4/3] md:aspect-auto">
            <Tile3D href="/muhammad_shayan_cv.pdf" parallax={tileParaC}>
              <div className="flex h-full flex-col justify-between p-6 md:p-7" style={{ transform: "translateZ(30px)" }}>
                <div className="flex items-start justify-between">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/50">06 / PDF · 2 pages</span>
                  <FileDown className="h-5 w-5 text-foreground/60" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-xl font-medium tracking-tight">Résumé</div>
                  <p className="mt-1 text-sm text-foreground/55">Full experience, education & toolkit — one crisp download.</p>
                </div>
              </div>
            </Tile3D>
          </BentoReveal>
        </motion.div>
      </section>

      {/* WORK LIST — deep 3D hover */}
      <section id="work" className="scene relative z-10 mx-auto mt-40 max-w-[1440px] px-6 md:mt-56 md:px-10">
        <SectionHead eyebrow="Selected Work" title="Recent projects, quietly obsessed over." />
        <ul className="mt-14 border-y border-foreground/10 divide-y divide-foreground/10">
          {projects.map((p, i) => (
            <ProjectRow key={p.name} project={p} index={i} />
          ))}
        </ul>
      </section>

      {/* ABOUT */}
      <section id="about" className="relative z-10 mx-auto mt-32 max-w-[1440px] px-6 md:mt-48 md:px-10">
        <SectionHead eyebrow="About" title="Engineer by trade. Designer by instinct." />
        <div className="mt-14 grid grid-cols-12 gap-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="col-span-12 md:col-span-7">
            <p className="text-2xl leading-snug text-foreground/85 md:text-3xl">
              I build software that feels considered — <span className="italic-serif text-white">fast, quiet, and human</span>. My work sits between mobile apps, AI systems and the design details that make them worth using.
            </p>
            <p className="mt-6 max-w-2xl text-base text-foreground/60">
              Currently based in Karachi. Previously shipped indie iOS apps, production dashboards, and AI tooling for teams that care about craft.
            </p>
          </motion.div>
          <div className="col-span-12 md:col-span-5">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-8">
              {[["Focus","iOS · AI · Web"],["Based","Karachi, PK"],["Since","2020"],["Available","Q3 2026"]].map(([k,v]) => (
                <div key={k}>
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">{k}</dt>
                  <dd className="mt-2 text-lg tracking-tight">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* STACK */}
      <section id="stack" className="relative z-10 mt-32 md:mt-48">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10">
          <SectionHead eyebrow="Toolkit" title="Tools I reach for daily." />
        </div>
        <div className="mt-14 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className={`${enabled ? "marquee-track" : "flex"} gap-14 whitespace-nowrap px-6 text-5xl font-medium tracking-tight text-foreground/70 md:text-7xl`}>
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

      {/* CONTACT */}
      <section id="contact" className="relative z-10 mx-auto mt-32 max-w-[1440px] px-6 pb-24 md:mt-48 md:px-10 scene">
        <motion.div
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}
          className="tile relative overflow-hidden p-10 md:p-16"
          style={{ transform: "perspective(1400px) rotateX(2deg)" }}
        >
          <div className="absolute -right-24 -top-24 hidden md:block" style={{ transform: "translateZ(80px)" }}>
            <div className="floaty"><Cube3D size={220} rotate={cubeRot} /></div>
          </div>
          <div className="max-w-3xl">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/50">Let's build</div>
            <h2 className="display display-3d mt-6 text-[clamp(48px,9vw,140px)]">
              Have a project<br/><span className="italic-serif">in mind?</span>
            </h2>
            <p className="mt-6 max-w-xl text-base text-foreground/60 md:text-lg">
              I take on a small number of collaborations each year. If you're building something ambitious, I'd love to hear about it.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a href={personalLinks.email.link} className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-medium text-black transition hover:opacity-90 shimmer">
                <Mail className="h-4 w-4" strokeWidth={2} />
                {personalLinks.email.label}
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a href="/muhammad_shayan_cv.pdf" className="inline-flex items-center gap-3 rounded-full border border-white/15 px-6 py-4 text-sm font-medium transition hover:bg-white/5">
                <FileDown className="h-4 w-4" strokeWidth={2} />
                Download résumé
              </a>
            </div>
          </div>
        </motion.div>

        <footer className="mt-10 flex flex-col items-start justify-between gap-4 text-xs text-foreground/50 md:flex-row md:items-center">
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
  const ref = useRef<HTMLLIElement>(null);
  const rx = useMotionValue(0), ry = useMotionValue(0), gx = useMotionValue(50), gy = useMotionValue(50);
  const srx = useSpring(rx, { stiffness: 220, damping: 22 });
  const sry = useSpring(ry, { stiffness: 220, damping: 22 });
  const transform = useMotionTemplate`perspective(1600px) rotateX(${srx}deg) rotateY(${sry}deg)`;
  const light = useMotionTemplate`radial-gradient(600px circle at ${gx}% ${gy}%, rgba(255,255,255,0.08), transparent 60%)`;

  const onMove = useRafPointer((cx, cy, el) => {
    const r = el.getBoundingClientRect();
    const px = (cx - r.left) / r.width, py = (cy - r.top) / r.height;
    ry.set((px - 0.5) * 6); rx.set(-(py - 0.5) * 4);
    gx.set(px * 100); gy.set(py * 100);
  });
  const onLeave = () => { rx.set(0); ry.set(0); };

  return (
    <motion.li ref={ref}
      onPointerMove={enabled ? (onMove as any) : undefined}
      onPointerLeave={onLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.05, ease: [0.2,0.8,0.2,1] }}
      style={{ transform, transformStyle: "preserve-3d", willChange: "transform" }}
      className="group relative"
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: light }} />
      <a href="#" className="relative grid grid-cols-12 items-baseline gap-4 py-8 md:py-12 transition" style={{ transform: "translateZ(30px)" }}>
        <span className="col-span-1 font-mono text-xs text-foreground/40">0{index+1}</span>
        <span className="col-span-6 text-3xl font-medium tracking-tight md:col-span-5 md:text-5xl transition group-hover:translate-x-2 group-hover:text-white">{project.name}</span>
        <span className="col-span-5 text-sm text-foreground/60 md:col-span-4">{project.role}</span>
        <span className="hidden font-mono text-xs uppercase tracking-widest text-foreground/50 md:col-span-2 md:block">{project.tag}</span>
        <span className="hidden text-right font-mono text-xs text-foreground/40 md:col-span-1 md:block group-hover:text-foreground">{project.year} ↗</span>
      </a>
      <div className={`pointer-events-none absolute inset-x-0 -inset-y-1 -z-10 rounded-3xl bg-gradient-to-r ${project.tint} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100`} />
    </motion.li>
  );
}

function BentoReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 60, rotateX: -12 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, delay: 0.2 + delay, ease: [0.2,0.8,0.2,1] }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}

function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="flex items-end justify-between border-b border-foreground/10 pb-6">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/50">{eyebrow}</div>
        <h2 className="mt-3 max-w-2xl text-3xl font-medium tracking-tight md:text-5xl">{title}</h2>
      </div>
    </div>
  );
}
