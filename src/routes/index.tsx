import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { ShaderBackground } from "@/components/ShaderBackground";
import { Cursor } from "@/components/Cursor";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Muhammad Shayan — Design Engineer & Interfaces for the Web" },
      { name: "description", content: "Design engineer building kinetic, high-fidelity interfaces. Selected work, experiments, and contact." },
      { property: "og:title", content: "Muhammad Shayan — Design Engineer" },
      { property: "og:description", content: "Design engineer building kinetic, high-fidelity interfaces." },
      { property: "og:image", content: "/og-image.png" },
      { name: "twitter:image", content: "/og-image.png" },
    ],
  }),
  component: Page,
});

/* -------------------------------- data -------------------------------- */

const PROJECTS = [
  { n: "01", title: "Aetheris",    tag: "Fintech · 2025",       role: "Design + Build",         img: "/portrait.jpg", href: "#", tint: "#e6e8ef", desc: "Realtime treasury console with kinetic data surfaces." },
  { n: "02", title: "Nova Studio", tag: "Creative tool · 2025", role: "Product design",         img: "/portrait.jpg", href: "#", tint: "#c9ccd6", desc: "Node-based motion editor for the browser." },
  { n: "03", title: "Orbit",       tag: "AI platform · 2024",   role: "Frontend engineering",   img: "/portrait.jpg", href: "#", tint: "#9aa0b0", desc: "Agentic workflows with a streaming, glassy UI." },
  { n: "04", title: "Halcyon",     tag: "Health · 2024",        role: "Design engineering",     img: "/portrait.jpg", href: "#", tint: "#7a8090", desc: "Clinical dashboards that feel calm under load." },
  { n: "05", title: "Meridian",    tag: "SaaS · 2023",          role: "Interface systems",      img: "/portrait.jpg", href: "#", tint: "#525663", desc: "Design-system tooling for a 40-person product org." },
];

const STACK: { name: string; kind: string }[] = [
  { name: "React",      kind: "daily" },
  { name: "TypeScript", kind: "primary" },
  { name: "Motion",     kind: "motion" },
  { name: "GLSL",       kind: "shaders" },
  { name: "Three.js",   kind: "3d/rt" },
  { name: "Tailwind",   kind: "styling" },
  { name: "Node",       kind: "runtime" },
  { name: "Rust",       kind: "systems" },
  { name: "Figma",      kind: "ux" },
  { name: "Blender",    kind: "3d" },
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
      <div className="fixed left-6 top-6 z-40 md:left-10 md:top-8">
        <a href="#top" data-cursor="Home" className="glass inline-flex items-center gap-3 rounded-full px-3.5 py-2 text-white">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-[10px] font-bold text-black">S</span>
          <span className="mono text-[11px] uppercase tracking-[0.22em]">Shayan / DE</span>
        </a>
      </div>
      {/* Center pill nav */}
      <nav className="fixed left-1/2 top-6 z-40 hidden -translate-x-1/2 md:top-8 md:block">
        <div className="glass-strong flex items-center gap-1 rounded-full p-1.5">
          {[["Work","#work"],["Studio","#studio"],["Index","#index"],["Contact","#contact"]].map(([l,h]) => (
            <a key={l} href={h} data-cursor="Jump" className="mono rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white/70 transition hover:bg-white/10 hover:text-white">
              {l}
            </a>
          ))}
        </div>
      </nav>
      {/* Top-right status */}
      <div className="fixed right-6 top-6 z-40 md:right-10 md:top-8">
        <span className="chip"><span className="dot live" />KHI · <span className="tabular-nums text-white">{time || "--:--:--"}</span></span>
      </div>
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
          <span className="chip">Portfolio / Vol. 26</span>
          <span className="chip">v2026.4</span>
        </div>

        <h1 className="display text-white text-[clamp(56px,14.5vw,260px)]">
          <div><SplitEnter text="Design" /></div>
          <div className="flex items-center gap-[2vw] pl-[6vw]">
            <span className="serifital italic text-white/95"><SplitEnter text="engineer" delay={0.08} /></span>
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
          <div><SplitEnter text="for the web." delay={0.16} /></div>
        </h1>

        {/* footer grid: intro + orbit cards */}
        <div className="mt-16 grid grid-cols-12 items-end gap-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.9 }}
            className="col-span-12 max-w-md text-base leading-relaxed text-white/70 md:col-span-4"
          >
            I build kinetic, high-fidelity product interfaces at the seam of design and engineering — motion systems, real-time UI, WebGL.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.9 }}
            className="col-span-12 grid grid-cols-3 gap-3 md:col-span-6 md:col-start-7"
          >
            {[
              { k: "Now",   v: "Aetheris",        s: "Design engineer" },
              { k: "Focus", v: "Motion · WebGL",  s: "Realtime UI" },
              { k: "Since", v: "2019",            s: "40+ products" },
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
  const A = ["Available for work", "Kinetic interfaces", "Realtime motion", "WebGL", "Design systems"];
  const B = ["Karachi ⇄ Remote", "React · TypeScript", "GLSL · Three.js", "Vol. 26", "2019 — 2026"];
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
    { k: "Years shipping", v: "7" },
    { k: "Products",       v: "40+" },
    { k: "Teams",          v: "12" },
    { k: "Coffee / week",  v: "∞" },
  ];

  return (
    <section id="studio" ref={ref} className="relative overflow-hidden py-32 md:py-40">
      <div className="glow-blob left-[10%] top-[20%] h-[400px] w-[400px]" style={{ background: "radial-gradient(circle, #2a2d38, transparent 60%)", opacity: .5 }} />

      <div className="mx-auto max-w-[1800px] px-6 md:px-10">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="chip mb-4"><span className="dot" />The Studio · 001</div>
            <h2 className="display text-white text-[clamp(40px,6vw,96px)]">
              A studio of <span className="serifital italic text-[color:var(--violet)]">one.</span>
            </h2>
          </div>
          <div className="mono max-w-xs text-[12px] uppercase tracking-[0.22em] text-white/50">
            Design engineer · Karachi, PK<br/>Working with teams worldwide since 2019.
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* pull-quote glass card */}
          <motion.div style={{ y: y1 }} className="col-span-12 md:col-span-7">
            <div className="tile relative p-8 md:p-12">
              <div className="absolute right-6 top-4 serifital text-[140px] leading-none text-white/10">“</div>
              <div className="serifital text-white/95 text-[clamp(28px,3.4vw,52px)] leading-[1.1]">
                Interfaces should feel like instruments — <span className="italic text-[color:var(--violet)]">precise, tactile, alive.</span>
              </div>
              <div className="mt-10 flex items-center gap-4">
                <div className="h-12 w-12 overflow-hidden rounded-full ring-1 ring-white/20">
                  <img src="/portrait.jpg" alt="" className="h-full w-full object-cover" />
                </div>
                <div>
                  <div className="mono text-[12px] uppercase tracking-[0.22em] text-white">Muhammad Shayan</div>
                  <div className="mono text-[11px] uppercase tracking-[0.22em] text-white/50">Design Engineer · Est. 2019</div>
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
              I work at the seam of interface, motion, and systems — shipping products end-to-end from typographic systems to WebGL shaders.
            </p>
            <p className="col-span-12 text-lg leading-relaxed text-white/70 md:col-span-5 md:col-start-8">
              Currently exploring real-time rendering, generative type, and interaction models that feel physically responsive.
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
            <a href="mailto:hello@muhammadshayan.dev" data-cursor="Write" className="pill-btn text-white">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-black">✎</span>
              <span className="display text-[clamp(22px,2.6vw,36px)] leading-none">hello@muhammadshayan.dev</span>
              <span className="mono text-xl">↗</span>
            </a>

            <div className="flex flex-wrap justify-center gap-3">
              {[
                { l: "GitHub",   h: "https://github.com" },
                { l: "LinkedIn", h: "https://linkedin.com" },
                { l: "X",        h: "https://x.com" },
                { l: "Résumé",   h: "/muhammad_shayan_cv.pdf" },
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
        <Studio />
        <IndexStack />
        <Contact />
      </main>
    </div>
  );
}
