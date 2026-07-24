import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { ArrowUpRight, Mail, FileDown, MapPin, Sparkles } from "lucide-react";
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

/* ————————————————————————————— Clock ————————————————————————————— */
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

/* —————————————————— Cursor spotlight (GPU) —————————————————— */
function CursorSpot() {
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const sx = useSpring(x, { stiffness: 80, damping: 24, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 80, damping: 24, mass: 0.5 });
  useEffect(() => {
    const on = (e: PointerEvent) => { x.set(e.clientX - 350); y.set(e.clientY - 350); };
    window.addEventListener("pointermove", on);
    return () => window.removeEventListener("pointermove", on);
  }, [x, y]);
  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-0 h-[700px] w-[700px] rounded-full"
    >
      <div className="h-full w-full rounded-full opacity-70"
           style={{ background: "radial-gradient(closest-side, rgba(167,139,250,0.35), rgba(56,189,248,0.15) 45%, transparent 70%)" }} />
    </motion.div>
  );
}

/* —————————————————— 3D Tilt Tile —————————————————— */
function Tile3D({
  className = "", children, href, dark = false, intensity = 12,
}: {
  className?: string; children?: React.ReactNode; href?: string; dark?: boolean; intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 150, damping: 15 });
  const sry = useSpring(ry, { stiffness: 150, damping: 15 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const transform = useMotionTemplate`perspective(1200px) rotateX(${srx}deg) rotateY(${sry}deg)`;
  const glow = useMotionTemplate`radial-gradient(400px circle at ${gx}% ${gy}%, rgba(167,139,250,0.25), transparent 60%)`;

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * intensity);
    rx.set(-(py - 0.5) * intensity);
    gx.set(px * 100); gy.set(py * 100);
  };
  const onLeave = () => { rx.set(0); ry.set(0); };

  const inner = (
    <>
      <motion.div className="absolute inset-0 rounded-[inherit] pointer-events-none" style={{ background: glow }} />
      <div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </>
  );

  const Comp: any = href ? "a" : "div";
  const props: any = href ? { href, target: href.startsWith("http") || href.startsWith("mailto") ? "_blank" : undefined, rel: "noreferrer" } : {};

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ transform, transformStyle: "preserve-3d" }}
      className={`tile ${dark ? "tile-dark" : ""} ${className}`}
    >
      <Comp {...props} className="block h-full w-full rounded-[inherit] overflow-hidden">
        {inner}
      </Comp>
    </motion.div>
  );
}

/* —————————————————— 3D Rotating Cube —————————————————— */
function Cube3D({ size = 200 }: { size?: number }) {
  const s = size;
  const half = s / 2;
  const faces = [
    { t: `translateZ(${half}px)` },
    { t: `rotateY(180deg) translateZ(${half}px)` },
    { t: `rotateY(90deg) translateZ(${half}px)` },
    { t: `rotateY(-90deg) translateZ(${half}px)` },
    { t: `rotateX(90deg) translateZ(${half}px)` },
    { t: `rotateX(-90deg) translateZ(${half}px)` },
  ];
  return (
    <div className="spin-xy" style={{ width: s, height: s, transformStyle: "preserve-3d" }}>
      {faces.map((f, i) => (
        <div key={i} className="cube-face" style={{ transform: f.t }} />
      ))}
    </div>
  );
}

/* —————————————————— Orbiting satellite —————————————————— */
function Orbit({ radius, duration, size = 8, color = "rgba(167,139,250,0.9)", delay = 0 }: any) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ animation: `spin3d-y ${duration}s linear infinite`, animationDelay: `${delay}s`, transformStyle: "preserve-3d" }}
    >
      <div className="ring3d" style={{ width: radius * 2, height: radius * 2 }} />
      <div
        style={{
          position: "absolute", width: size, height: size, borderRadius: 9999,
          background: color, boxShadow: `0 0 20px ${color}`,
          transform: `translateX(${radius}px)`,
        }}
      />
    </div>
  );
}

/* —————————————————— Page —————————————————— */
function Index() {
  const time = useClock("Asia/Karachi");
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const nameY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const nameOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.1]);
  const gridZ = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const gridRot = useTransform(scrollYProgress, [0, 1], [0, -6]);

  const { scrollYProgress: pageY } = useScroll();
  const blobY1 = useTransform(pageY, [0, 1], [0, -300]);
  const blobY2 = useTransform(pageY, [0, 1], [0, 400]);
  const blobY3 = useTransform(pageY, [0, 1], [0, -200]);

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

      {/* subtle grid overlay */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 opacity-[0.05]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />

      <CursorSpot />

      {/* Top bar */}
      <header className="relative z-20 mx-auto flex max-w-[1440px] items-center justify-between px-6 py-6 md:px-10 md:py-8">
        <div className="flex items-center gap-3">
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 text-emerald-400 dot-ping" />
          <span className="text-sm font-medium tracking-tight">Muhammad Shayan</span>
        </div>
        <nav className="hidden gap-8 text-sm md:flex">
          {["Work","About","Stack","Contact"].map(x => (
            <a key={x} href={`#${x.toLowerCase()}`} className="text-foreground/60 transition hover:text-foreground">{x}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2 text-xs text-foreground/60">
          <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} />
          <span className="hidden sm:inline">Karachi · {time}</span>
          <span className="sm:hidden">{time}</span>
        </div>
      </header>

      {/* HERO — kinetic name + 3D bento */}
      <section ref={heroRef} className="scene relative z-10 mx-auto max-w-[1440px] px-4 md:px-10">
        <motion.h1
          aria-label="Muhammad Shayan"
          style={{ y: nameY, opacity: nameOpacity }}
          className="display display-3d pointer-events-none select-none"
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
            <Tile3D href="#about">
              <div className="flex h-full flex-col justify-between p-6 md:p-7">
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

          {/* Selected Work — big tile with floating cube */}
          <BentoReveal delay={0.05} className="col-span-6 md:col-span-4 aspect-[16/9] md:aspect-[16/6]">
            <Tile3D href="#work" intensity={8}>
              <div className="relative h-full w-full">
                <div className="absolute right-6 top-6 md:right-10 md:top-10" style={{ transform: "translateZ(60px)" }}>
                  <div className="floaty">
                    <Cube3D size={140} />
                  </div>
                </div>
                <div className="flex h-full flex-col justify-between p-6 md:p-10">
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

          {/* Contact tall */}
          <BentoReveal delay={0.1} className="col-span-6 md:col-span-2 aspect-[4/3] md:aspect-[4/5]">
            <Tile3D href={personalLinks.email.link}>
              <div className="flex h-full flex-col justify-between p-6 md:p-7">
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
            <Tile3D dark intensity={6}>
              <img src={portrait} alt="Muhammad Shayan" className="absolute inset-0 h-full w-full object-cover opacity-90" loading="lazy" width={1024} height={1280} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-between p-6">
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

          {/* Orbital "identity" tile — the wow */}
          <BentoReveal delay={0.2} className="col-span-6 md:col-span-2 aspect-[4/5]">
            <Tile3D intensity={10}>
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="ring3d ring-glow" style={{ width: 340, height: 340 }} />
                </div>
                <Orbit radius={110} duration={16} size={12} color="rgba(167,139,250,0.9)" />
                <Orbit radius={150} duration={22} size={8} color="rgba(56,189,248,0.9)" delay={2} />
                <Orbit radius={190} duration={30} size={6} color="rgba(244,114,182,0.9)" delay={4} />
                <div className="floaty-slow relative z-10 h-24 w-24 rounded-full"
                     style={{ background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(167,139,250,0.6) 40%, rgba(56,189,248,0.4) 70%, transparent)",
                              boxShadow: "0 0 60px rgba(167,139,250,0.6), inset 0 0 30px rgba(255,255,255,0.4)" }} />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-foreground/60">05 / System</span>
                  <span className="text-[10px] font-mono text-foreground/60">v2026.5</span>
                </div>
              </div>
            </Tile3D>
          </BentoReveal>

          {/* Github */}
          <BentoReveal delay={0.22} className="col-span-3 md:col-span-1 aspect-square">
            <Tile3D href={personalLinks.github.link}>
              <div className="flex h-full flex-col items-start justify-between p-5">
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
            <Tile3D href={personalLinks.linkedin.link}>
              <div className="flex h-full flex-col items-start justify-between p-5">
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
            <Tile3D href="/muhammad_shayan_cv.pdf">
              <div className="flex h-full flex-col justify-between p-6 md:p-7">
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

      {/* WORK LIST */}
      <section id="work" className="relative z-10 mx-auto mt-40 max-w-[1440px] px-6 md:mt-56 md:px-10">
        <SectionHead eyebrow="Selected Work" title="Recent projects, quietly obsessed over." />
        <ul className="mt-14 border-y border-foreground/10 divide-y divide-foreground/10">
          {projects.map((p, i) => (
            <motion.li key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.05, ease: [0.2,0.8,0.2,1] }}
              className="group relative"
            >
              <a href="#" className="grid grid-cols-12 items-baseline gap-4 py-8 md:py-12 transition">
                <span className="col-span-1 font-mono text-xs text-foreground/40">0{i+1}</span>
                <span className="col-span-6 text-3xl font-medium tracking-tight md:col-span-5 md:text-5xl transition group-hover:translate-x-2 group-hover:text-white">{p.name}</span>
                <span className="col-span-5 text-sm text-foreground/60 md:col-span-4">{p.role}</span>
                <span className="hidden font-mono text-xs uppercase tracking-widest text-foreground/50 md:col-span-2 md:block">{p.tag}</span>
                <span className="hidden text-right font-mono text-xs text-foreground/40 md:col-span-1 md:block group-hover:text-foreground">{p.year} ↗</span>
              </a>
              <div className={`pointer-events-none absolute inset-x-0 -inset-y-1 -z-10 rounded-3xl bg-gradient-to-r ${p.tint} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100`} />
            </motion.li>
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
          <div className="marquee-track gap-14 whitespace-nowrap px-6 text-5xl font-medium tracking-tight text-foreground/70 md:text-7xl">
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
            <div className="floaty"><Cube3D size={220} /></div>
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
          <div className="font-mono">v2026.5 · built with intent</div>
        </footer>
      </section>
    </div>
  );
}

function BentoReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 60, rotateX: -12 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
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
