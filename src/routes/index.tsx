import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { memo, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Cursor } from "@/components/Cursor";
import { AnimatedIcon } from "@/components/AnimatedIcon";
import { useReveal } from "@/hooks/useReveal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Muhammad Shayan — Mobile Engineer" },
      { name: "description", content: "Portfolio of Muhammad Shayan — Mobile Engineer building Android, Flutter, and on-device ML products from Karachi." },
      { property: "og:title", content: "Muhammad Shayan — Mobile Engineer" },
      { property: "og:description", content: "Android, Flutter, on-device ML, and offline-first mobile systems by Muhammad Shayan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

/* ---------- Data ---------- */
const METRICS = [
  { v: "3+", k: "Live Apps", icon: "bolt" },
  { v: "10k+", k: "Installs", icon: "orbit" },
  { v: "99%+", k: "Stability", icon: "spark" },
  { v: "60%", k: "Perf Gain", icon: "gear" },
];

const WORK = [
  { title: "AI Trust Ledger", desc: "Fintech: ROI cycles, portfolio tracking, resilient financial flows.", tag: "Fintech · Kotlin", year: "2025" },
  { title: "LeafBloom", desc: "On-device plant disease diagnosis. TFLite + Compose + CameraX.", tag: "Vision ML · Android", year: "2024" },
  { title: "GitPulse", desc: "Flutter GitHub analytics with GraphQL and live sync.", tag: "Dev Tool · Flutter", year: "2024" },
  { title: "Medicare", desc: "HealthTech: appointments, chat, Stripe payments, pharmacy.", tag: "HealthTech · Flutter", year: "2023" },
];

const LAB = [
  { title: "VectorMap.os", note: "Offline-first vector maps", status: "WIP" },
  { title: "ShaderPlay Flutter", note: "GLSL runtime in Skia", status: "Done" },
  { title: "TensorFlow.Mobile", note: "Micro-model tooling", status: "Beta" },
];

const STACK = ["Android", "Kotlin", "Jetpack Compose", "Flutter", "Dart", "TensorFlow Lite", "Firebase", "GraphQL", "MVVM", "Stripe"];

const HERO_NODES = ["Kotlin", "Compose", "Flutter", "TFLite", "CameraX", "GraphQL"];

/* ---------- Utilities ---------- */
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

function SplitReveal({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
      {text.split(" ").map((word, wi) => (
        <span key={`${word}-${wi}`} className="inline-block whitespace-nowrap">
          {Array.from(word).map((ch, ci) => (
            <span key={`${ch}-${ci}`} className="char-mask">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.9, ease: [0.7, 0, 0.2, 1], delay: delay + wi * 0.04 + ci * 0.015 }}
              >
                {ch}
              </motion.span>
            </span>
          ))}
          {wi < text.split(" ").length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
      </span>
    </span>
  );
}

const Reveal = memo(function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ ["--reveal-delay" as string]: `${Math.round(delay * 1000)}ms` }}>
      {children}
    </div>
  );
});

function SectionHead({ id, eyebrow, title, kicker }: { id?: string; eyebrow: string; title: string; kicker?: string }) {
  return (
    <div className="section-head container-x">
      <div className="rule" aria-hidden />
      <div className="flex items-baseline gap-3">
        <span className="eyebrow">{eyebrow}</span>
        {kicker && <span className="eyebrow opacity-40">/ {kicker}</span>}
      </div>
      <h2 id={id} className="hd-2 mt-2 max-w-3xl">{title}</h2>
    </div>
  );
}

/* ---------- Header + Nav ---------- */
function Header() {
  const time = useKarachiTime();
  return (
    <header className="fixed inset-x-0 top-0 z-40 px-[var(--space-gutter)] py-4">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-3">
        <a href="#top" data-cursor="Home" className="pill">
          <span className="mark">S</span>
          <span className="nav-link">Shayan</span>
        </a>
        <div className="hidden md:block">
          <nav aria-label="Primary" className="pill">
            {[["Work", "#work"], ["Lab", "#lab"], ["About", "#about"], ["Contact", "#contact"]].map(([label, href]) => (
              <a key={label} href={href} data-cursor="Jump" className="nav-link">{label}</a>
            ))}
          </nav>
        </div>
        <div className="hidden sm:block">
          <div className="pill">
            <span className="nav-link">
              <span className="live-dot" aria-hidden />
              KHI {time || "--:--"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileNav() {
  return (
    <nav
      aria-label="Section navigation"
      className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-1/2 z-40 w-[calc(100%-1.5rem)] max-w-[380px] -translate-x-1/2 md:hidden"
    >
      <div className="pill w-full justify-between">
        {[["Work", "#work"], ["Lab", "#lab"], ["About", "#about"], ["Contact", "#contact"]].map(([l, h]) => (
          <a key={l} href={h} className="nav-link flex-1 justify-center">{l}</a>
        ))}
      </div>
    </nav>
  );
}

/* ---------- Hero ---------- */
function Hero({ scrollY }: { scrollY: MotionValue<number> }) {
  const y1 = useTransform(scrollY, [0, 520], [0, 82]);
  const y2 = useTransform(scrollY, [0, 520], [0, -44]);
  const sy1 = useSpring(y1, { stiffness: 60, damping: 22 });
  const sy2 = useSpring(y2, { stiffness: 60, damping: 22 });

  return (
    <section id="top" aria-labelledby="hero-title" className="hero-section pt-[max(5.5rem,8vh)]">
      <div className="container-x">
        <div className="hero-composition">
          <div className="hero-copy">
            <Reveal>
              <div className="flex items-center gap-2 eyebrow">
                <span className="live-dot" /> Available · Q3 2026
              </div>
            </Reveal>
            <h1 id="hero-title" className="hd-hero">
              <span className="block"><SplitReveal text="Muhammad" /></span>
              <span className="block text-[color:var(--mid)]"><SplitReveal text="Shayan." delay={0.15} /></span>
            </h1>
            <Reveal delay={0.6}>
              <p className="body-md mt-5 md:mt-7 max-w-xl">
                Mobile Engineer building <span className="text-[color:var(--platinum)]">Android, Flutter and on-device ML products</span> — from offline-first fintech to camera-driven vision apps. Based in Karachi, shipping worldwide.
              </p>
            </Reveal>
            <Reveal delay={0.75}>
              <div className="mt-6 md:mt-8 flex flex-wrap items-center gap-3">
                <a href="#contact" className="btn btn-primary" data-cursor="Write">
                  <AnimatedIcon name="mail" size={16} /> Start a Project
                </a>
                <a href="#work" className="btn btn-ghost" data-cursor="Scroll">
                  See Work <AnimatedIcon name="arrow" size={16} />
                </a>
              </div>
            </Reveal>
          </div>

          <motion.div style={{ y: sy1 }} className="hero-visual" aria-hidden>
            <div className="liquid-stage">
              <div className="liquid-stage__halo" />
              <div className="liquid-stage__glass">
                <div className="liquid-stage__scan" />
                <div className="liquid-stage__code">
                  <span>class MotionSystem</span>
                  <span>compose {`{`} 60fps {`}`}</span>
                  <span>camera.ai.sync()</span>
                  <span>offlineFirst=true</span>
                </div>
              </div>
              <div className="liquid-stage__rail" />
              {HERO_NODES.map((node, i) => (
                <span key={node} className={`hero-node hero-node--${i + 1}`}>{node}</span>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div style={{ y: sy2 }} className="metrics-strip">
          {METRICS.map((m, i) => (
            <Reveal key={m.k} delay={i * 0.08} className="metric-reveal">
              <div className="metric-item">
                <span className="metric-icon"><AnimatedIcon name={m.icon} size={20} /></span>
                <div className="min-w-0">
                  <div className="stat-num">{m.v}</div>
                  <div className="eyebrow mt-1">{m.k}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- About ---------- */
function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="section">
      <SectionHead id="about-title" eyebrow="01 / About" title="Engineer's mind. Designer's obsession." kicker="Craft" />
      <div className="container-x about-flow">
        <Reveal className="about-statement">
          <p>
            I turn complex mobile systems into interfaces that feel physical, fast, and precise.
          </p>
        </Reveal>
        <div className="about-detail">
          <Reveal>
            <p className="body-md">
              Four years shipping production mobile apps across fintech, health, and creator tools. I favour architectures that are boring where it counts — offline-first, testable, observable — and expressive where users touch them.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="body-md">
              Kotlin and Flutter are my daily languages. TensorFlow Lite, CameraX, motion systems, and mid-range device performance are where I have the most fun.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <ul className="flex flex-wrap gap-2 pt-3" aria-label="Core technologies">
              {STACK.slice(0, 7).map((s) => <li key={s} className="chip">{s}</li>)}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------- Work ---------- */
function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="section">
      <SectionHead id="work-title" eyebrow="02 / Selected Work" title="Products, shipped." kicker="2023 — 2025" />
      <div className="container-x">
        <ul className="work-list">
          {WORK.map((w, i) => (
            <li key={w.title}>
              <a
                href="#contact"
                data-cursor="View"
                aria-label={`${w.title} — ${w.tag}, ${w.year}. Enquire about this project.`}
                className="work-row group"
              >
                <span className="work-row__num">{String(i + 1).padStart(2, "0")}</span>
                <span className="block min-w-0">
                  <span className="work-row__title block truncate">{w.title}</span>
                  <span className="work-row__meta">
                    <span className="eyebrow">{w.tag}</span>
                    <span className="eyebrow">{w.year}</span>
                  </span>
                </span>
                <span className="work-row__desc">{w.desc}</span>
                <span className="work-row__arrow" aria-hidden>
                  <AnimatedIcon name="arrow" size={18} />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- Lab ---------- */
function Lab() {
  return (
    <section id="lab" aria-labelledby="lab-title" className="section">
      <SectionHead id="lab-title" eyebrow="03 / Lab" title="Experiments in motion." kicker="Open source" />
      <ul className="container-x lab-flow">
        {LAB.map((l, i) => (
          <li key={l.title} className="h-full">
            <Reveal delay={i * 0.08} className="h-full">
              <a
                href="#contact"
                data-cursor="View"
                aria-label={`${l.title} — ${l.note} (${l.status})`}
                className="lab-pod group"
              >
                <span className="flex items-center justify-between">
                  <span className="text-[color:var(--platinum)]/70 icon-float"><AnimatedIcon name="orbit" size={20} /></span>
                  <span className="eyebrow">{l.status}</span>
                </span>
                <span className="block mt-6">
                  <span className="hd-3 block">{l.title}</span>
                  <span className="body-sm mt-2 block">{l.note}</span>
                  <span className="mt-3 flex items-center gap-2 eyebrow text-[color:var(--platinum)] opacity-60 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100 transition-opacity">
                    Explore <AnimatedIcon name="arrow" size={14} />
                  </span>
                </span>
              </a>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- Marquee ---------- */
function Ribbon() {
  return (
    <div className="marquee my-[calc(var(--space-section)/2)]" aria-hidden>
      <div className="marquee__track">
        {Array.from({ length: 2 }).map((_, k) => (
          <div key={k} className="marquee__item">
            {STACK.map((s, i) => (
              <span key={`${k}-${i}`} className={i % 2 ? "marquee__item--outline" : ""}>{s}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Contact ---------- */
function Contact() {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  function submit(e: FormEvent) {
    e.preventDefault();
    setState("sending");
    // Mailto handoff — no backend
    const body = encodeURIComponent(`From: ${form.name} <${form.email}>\n\n${form.message}`);
    const subject = encodeURIComponent(form.subject || "Project inquiry");
    setTimeout(() => {
      window.location.href = `mailto:hello@shayxo.dev?subject=${subject}&body=${body}`;
      setState("sent");
    }, 400);
  }

  const disabled = !form.name || !form.email || !form.message || state === "sending";

  return (
    <section id="contact" aria-labelledby="contact-title" className="section">
      <SectionHead id="contact-title" eyebrow="04 / Contact" title="Let's build something calm and fast." kicker="Reply in ~24h" />
      <div className="container-x contact-panel">
        <Reveal>
          <aside aria-label="Contact details" className="contact-aside">
            <div className="space-y-6">
              <div>
                <span className="eyebrow">Email</span>
                <a href="mailto:hello@shayxo.dev" className="hd-3 mt-2 flex min-w-0 items-center gap-3 hover:opacity-70 transition-opacity">
                  <span className="shrink-0 text-[color:var(--platinum)]/70"><AnimatedIcon name="mail" size={20} /></span>
                  <span className="truncate">hello@shayxo.dev</span>
                </a>
              </div>
              <div>
                <span className="eyebrow">Elsewhere</span>
                <div className="mt-3 flex flex-col gap-3">
                  <a href="https://github.com/shayann07" target="_blank" rel="noreferrer noopener" className="flex min-w-0 items-center gap-3 body-md hover:text-[color:var(--platinum)] transition-colors">
                    <span className="shrink-0"><AnimatedIcon name="github" size={18} /></span>
                    <span className="truncate">github.com/shayann07</span>
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                  <a href="https://www.linkedin.com/in/shayann07" target="_blank" rel="noreferrer noopener" className="flex min-w-0 items-center gap-3 body-md hover:text-[color:var(--platinum)] transition-colors">
                    <span className="shrink-0"><AnimatedIcon name="linkedin" size={18} /></span>
                    <span className="truncate">linkedin.com/in/shayann07</span>
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="pt-5 border-t border-[color:var(--hairline)]">
              <div className="eyebrow flex items-center gap-2"><span className="live-dot" /> Currently available</div>
              <div className="body-sm mt-2">Booking projects starting August 2026.</div>
            </div>
          </aside>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={submit} aria-labelledby="contact-title" className="contact-form">
            <div className="field md:col-span-1">
              <label htmlFor="name">Name</label>
              <input id="name" name="name" autoComplete="name" required maxLength={80} className="input" placeholder="Ada Lovelace" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="field md:col-span-1">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" autoComplete="email" inputMode="email" required type="email" maxLength={120} className="input" placeholder="you@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="field md:col-span-2">
              <label htmlFor="subject">Subject</label>
              <input id="subject" name="subject" maxLength={140} className="input" placeholder="What are we building?" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            </div>
            <div className="field md:col-span-2">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" required maxLength={2000} aria-describedby="message-hint" className="textarea" placeholder="Tell me about the product, timeline, and stack…" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              <span id="message-hint" className="body-sm opacity-60">Max 2000 characters.</span>
            </div>
            <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-4 pt-2">
              <p role="status" aria-live="polite" className="eyebrow opacity-60">
                {state === "sent" ? "Message handed off to your mail app." : state === "sending" ? "Opening your mail app…" : "Sends via your mail app — no data stored."}
              </p>
              <button type="submit" disabled={disabled} className="btn btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
                {state === "sent" ? "Sent ✓" : state === "sending" ? "Sending…" : "Send Message"}
                {state === "idle" && <AnimatedIcon name="arrow" size={14} />}
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer className="section pt-0">
      <div className="container-x">
        <Reveal>
          <div className="wordmark-bg leading-none" aria-hidden>SHAYAN</div>
        </Reveal>
        <div className="mt-8 md:mt-10 flex flex-col md:flex-row items-center justify-between gap-3 border-t border-[color:var(--hairline)] pt-6 text-center md:text-left">
          <div className="eyebrow">© 2026 Muhammad Shayan · Karachi</div>
          <div className="eyebrow opacity-60">Built with TanStack Start · Motion · Tailwind v4</div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Page ---------- */
function CloudBg() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      el.style.setProperty("--cloud-scroll", p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="cloud-bg" aria-hidden ref={ref}>
      <div className="cloud-bg__layer" />
      <div className="cloud-bg__wash" />
      <div className="cloud-bg__mist cloud-bg__mist--upper" />
      <div className="cloud-bg__mist cloud-bg__mist--main" />
      <div className="cloud-bg__mist cloud-bg__mist--low" />
      <div className="cloud-bg__vignette" />
    </div>
  );
}

function Page() {
  const { scrollY } = useScroll();

  return (
    <div className="grain relative isolate min-h-dvh overflow-x-clip">
      <CloudBg />
      <a href="#main" className="skip-link">Skip to content</a>
      <Cursor />
      <Header />
      <MobileNav />

      <main id="main" tabIndex={-1} className="relative z-10 pb-28 md:pb-20">
        <Hero scrollY={scrollY} />
        <About />
        <Work />
        <Ribbon />
        <Lab />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}
