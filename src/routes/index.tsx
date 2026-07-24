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
  { n: "01", title: "Aetheris", tag: "Fintech · 2025", role: "Design + Build", img: "/portrait.jpg", href: "#", tint: "#a78bfa" },
  { n: "02", title: "Nova Studio", tag: "Creative tool · 2025", role: "Product design", img: "/portrait.jpg", href: "#", tint: "#67e8f9" },
  { n: "03", title: "Orbit", tag: "AI platform · 2024", role: "Frontend engineering", img: "/portrait.jpg", href: "#", tint: "#f472b6" },
  { n: "04", title: "Halcyon", tag: "Health · 2024", role: "Design engineering", img: "/portrait.jpg", href: "#", tint: "#facc15" },
  { n: "05", title: "Meridian", tag: "SaaS · 2023", role: "Interface systems", img: "/portrait.jpg", href: "#", tint: "#4ade80" },
];

const STACK = ["React", "TypeScript", "Motion", "GLSL", "Three.js", "Tailwind", "Node", "Rust", "Figma", "Blender"];

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
    <header className="fixed inset-x-0 top-0 z-40 mix-blend-difference">
      <div className="mx-auto flex max-w-[1800px] items-center justify-between px-6 py-6 text-white md:px-10">
        <a href="#top" data-cursor="Home" className="mono text-[13px] tracking-[0.18em] uppercase">M. Shayan<span className="opacity-40"> /</span> DE</a>
        <nav className="hidden gap-8 md:flex">
          {[["Work","#work"],["Index","#index"],["Studio","#studio"],["Contact","#contact"]].map(([l,h]) => (
            <a key={l} href={h} className="linkline mono text-[12px] tracking-[0.22em] uppercase">{l}</a>
          ))}
        </nav>
        <div className="mono text-[12px] tracking-[0.18em]">
          <span className="opacity-50">KHI</span> <span className="tabular-nums">{time || "--:--:--"}</span>
        </div>
      </div>
    </header>
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
    <section id="top" ref={ref} className="relative flex min-h-screen flex-col justify-between pb-16 pt-32">
      <motion.div style={{ y, scale, opacity, filter }} className="mx-auto w-full max-w-[1800px] px-6 md:px-10">
        <div className="mb-8 flex items-end justify-between">
          <div className="eyebrow flex items-center gap-3">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--violet)]" />
            <span>Portfolio · Vol. 26</span>
          </div>
          <div className="hidden text-right mono text-[11px] tracking-[0.24em] uppercase text-white/50 md:block">
            (01) Available Q3 · 2026
          </div>
        </div>

        <h1 className="display text-white text-[clamp(56px,14vw,240px)]">
          <div><SplitEnter text="Design" /></div>
          <div className="pl-[8vw]">
            <span className="serifital italic text-white/90"><SplitEnter text="engineer" delay={0.1} /></span>
          </div>
          <div><SplitEnter text="for the web." delay={0.2} /></div>
        </h1>

        <div className="mt-14 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-5">
            <p className="max-w-md text-base leading-relaxed text-white/70">
              <SplitEnter text="I build kinetic, high-fidelity product interfaces at the seam of design and engineering — motion systems, real-time UI, WebGL." delay={0.35} />
            </p>
          </div>
          <div className="col-span-12 md:col-span-4 md:col-start-9 flex items-end gap-6">
            <div>
              <div className="eyebrow mb-2">Now</div>
              <div className="mono text-sm text-white">Building at <span className="text-[color:var(--violet)]">Aetheris</span></div>
            </div>
            <div>
              <div className="eyebrow mb-2">Focus</div>
              <div className="mono text-sm text-white">Motion · WebGL · Systems</div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div style={{ opacity }} className="pointer-events-none absolute inset-x-0 bottom-6 mx-auto flex max-w-[1800px] items-center justify-between px-6 mono text-[11px] tracking-[0.24em] uppercase text-white/50 md:px-10">
        <span>Scroll ↓</span>
        <span>Muhammad Shayan · Karachi ⇄ Remote</span>
      </motion.div>
    </section>
  );
}

/* -------------------------------- marquee ----------------------------- */

function Marquee() {
  const items = ["Available for work", "2026", "Design engineering", "Motion", "WebGL", "Interfaces", "Kinetic type"];
  const row = (
    <div className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((t, i) => (
        <span key={i} className="flex items-center gap-10">
          <span className="display text-[10vw] leading-none text-white/95">{t}</span>
          <span className="serifital italic text-[10vw] leading-none text-[color:var(--violet)]">✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <section aria-hidden className="border-y border-white/10 py-8 overflow-hidden">
      <div className="marquee-track flex">
        {row}{row}
      </div>
    </section>
  );
}

/* --------------------------------- work ------------------------------- */

function WorkList() {
  const [active, setActive] = useState<number | null>(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 220, damping: 30 });
  const sy = useSpring(my, { stiffness: 220, damping: 30 });

  const onMove = (e: React.MouseEvent) => { mx.set(e.clientX); my.set(e.clientY); };

  return (
    <section id="work" className="relative py-32" onMouseMove={onMove}>
      <div className="mx-auto max-w-[1800px] px-6 md:px-10">
        <div className="mb-16 flex items-end justify-between">
          <div className="eyebrow">Selected Work · 2023 — 2026</div>
          <div className="mono text-[11px] uppercase tracking-[0.24em] text-white/50">Index (05)</div>
        </div>

        <ul className="border-t border-white/10">
          {PROJECTS.map((p, i) => (
            <li
              key={p.n}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className="group relative border-b border-white/10"
            >
              <a href={p.href} data-cursor="View" className="grid grid-cols-12 items-center gap-4 py-8 md:py-10">
                <span className="col-span-1 mono text-[11px] tracking-[0.2em] text-white/40">{p.n}</span>
                <span className="col-span-6 md:col-span-5 display text-[clamp(36px,6.5vw,110px)] leading-none text-white transition-[letter-spacing,transform] duration-500 group-hover:tracking-[-0.02em]">
                  {p.title}
                </span>
                <span className="col-span-3 hidden mono text-[12px] uppercase tracking-[0.2em] text-white/50 md:block">{p.tag}</span>
                <span className="col-span-3 mono text-[12px] uppercase tracking-[0.2em] text-white/50 text-right md:col-span-3">{p.role} →</span>
              </a>
              <span
                className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-white/60 transition-transform duration-700 group-hover:scale-x-100"
                aria-hidden
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Cursor-following preview */}
      <motion.div
        style={{ x: sx, y: sy }}
        className="pointer-events-none fixed left-0 top-0 z-30 -translate-x-1/2 -translate-y-1/2"
      >
        <AnimatePresence>
          {active !== null && (
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.45, ease: [0.7, 0, 0.2, 1] }}
              className="relative h-[360px] w-[280px] overflow-hidden rounded-md ring-1 ring-white/15"
              style={{ boxShadow: `0 30px 90px -20px ${PROJECTS[active].tint}55` }}
            >
              <img src={PROJECTS[active].img} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 40%, ${PROJECTS[active].tint}30)` }} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

/* --------------------------------- about ------------------------------ */

function Studio() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [140, -60]);

  return (
    <section id="studio" ref={ref} className="relative py-40">
      <div className="mx-auto max-w-[1800px] px-6 md:px-10">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-5">
            <div className="eyebrow mb-6">The Studio · 001</div>
            <motion.div style={{ y: y1 }} className="serifital text-[clamp(42px,5.5vw,86px)] leading-[0.95] text-white">
              <SplitReveal text="Interfaces should feel like instruments — precise, tactile, alive." />
            </motion.div>
          </div>
          <div className="col-span-12 md:col-span-5 md:col-start-8">
            <motion.div style={{ y: y2 }} className="space-y-8 text-white/75">
              <p className="text-lg leading-relaxed">
                <SplitReveal text="I'm Muhammad Shayan, a design engineer working at the seam of interface, motion, and systems. I ship products end-to-end — from typographic systems to WebGL shaders." />
              </p>
              <p className="text-lg leading-relaxed">
                <SplitReveal text="Currently exploring real-time rendering, generative type, and interaction models that feel physically responsive." delay={0.1} />
              </p>
              <div className="hairline pt-6 grid grid-cols-2 gap-4 mono text-[12px] uppercase tracking-[0.2em]">
                <div><div className="text-white/40">Base</div><div className="text-white mt-1">Karachi, PK</div></div>
                <div><div className="text-white/40">Working</div><div className="text-white mt-1">Global · Remote</div></div>
                <div><div className="text-white/40">Since</div><div className="text-white mt-1">2019</div></div>
                <div><div className="text-white/40">Shipping</div><div className="text-white mt-1">40+ Products</div></div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- index ------------------------------ */

function IndexStack() {
  return (
    <section id="index" className="relative border-t border-white/10 py-32">
      <div className="mx-auto max-w-[1800px] px-6 md:px-10">
        <div className="mb-14 flex items-end justify-between">
          <div className="eyebrow">Index · Toolkit</div>
          <div className="mono text-[11px] uppercase tracking-[0.24em] text-white/50">{STACK.length} systems</div>
        </div>
        <ul>
          {STACK.map((s, i) => (
            <li key={s} className="group grid grid-cols-12 items-center gap-4 border-t border-white/10 py-6 last:border-b">
              <span className="col-span-1 mono text-[11px] tracking-[0.2em] text-white/40">{String(i + 1).padStart(2, "0")}</span>
              <span className="col-span-8 display text-[clamp(28px,4vw,64px)] leading-none text-white/90 transition-transform duration-500 group-hover:translate-x-4">
                {s}
              </span>
              <span className="col-span-3 mono text-[11px] uppercase tracking-[0.24em] text-white/40 text-right">
                {["daily", "primary", "primary", "shaders", "3d/rt", "styling", "runtime", "systems", "ux", "3d"][i]}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* --------------------------------- contact ---------------------------- */

function Contact() {
  return (
    <section id="contact" className="relative border-t border-white/10 py-32">
      <div className="mx-auto max-w-[1800px] px-6 md:px-10">
        <div className="eyebrow mb-8">Contact · 2026</div>
        <h2 className="display text-white text-[clamp(56px,13vw,220px)] leading-[0.86]">
          <div><SplitReveal text="Let's build" /></div>
          <div className="pl-[6vw]"><span className="serifital italic text-[color:var(--violet)]"><SplitReveal text="something rare." delay={0.08} /></span></div>
        </h2>

        <div className="mt-16 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-6">
            <a
              href="mailto:hello@muhammadshayan.dev"
              data-cursor="Write"
              className="group inline-flex items-center gap-4 text-white"
            >
              <span className="display text-[clamp(28px,3.6vw,54px)] linkline">hello@muhammadshayan.dev</span>
              <span className="mono text-2xl transition-transform group-hover:translate-x-2 group-hover:-translate-y-1">↗</span>
            </a>
            <div className="mt-8 flex flex-wrap gap-6 mono text-[12px] uppercase tracking-[0.24em] text-white/50">
              <a className="linkline" href="https://github.com" data-cursor="GitHub">GitHub ↗</a>
              <a className="linkline" href="https://linkedin.com" data-cursor="LinkedIn">LinkedIn ↗</a>
              <a className="linkline" href="https://x.com" data-cursor="X">X (Twitter) ↗</a>
              <a className="linkline" href="/muhammad_shayan_cv.pdf" data-cursor="CV">Résumé (PDF) ↗</a>
            </div>
          </div>
          <div className="col-span-12 md:col-span-4 md:col-start-9 space-y-6 mono text-[12px] uppercase tracking-[0.2em]">
            <div className="hairline pt-6">
              <div className="text-white/40">Currently</div>
              <div className="text-white mt-2 normal-case tracking-normal text-base">Booking select engagements for Q3 – Q4 2026.</div>
            </div>
            <div className="hairline pt-6">
              <div className="text-white/40">Response</div>
              <div className="text-white mt-2 normal-case tracking-normal text-base">Usually within 24 hours.</div>
            </div>
          </div>
        </div>

        <div className="mt-24 flex items-end justify-between border-t border-white/10 pt-8 mono text-[11px] uppercase tracking-[0.24em] text-white/40">
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
