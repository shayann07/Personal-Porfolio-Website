import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useSpring, useTransform, useReducedMotion, type MotionValue } from "framer-motion";
import { memo, useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Cursor } from "@/components/Cursor";
import { Icon } from "@/components/Icon";
import { useReveal } from "@/hooks/useReveal";
import { CV_URL } from "@/config/links";
import { personalLinks } from "@/config/personalLinks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Muhammad Shayan — Android, Flutter & On-Device ML Engineer" },
      { name: "description", content: "Mobile engineer in Karachi building Android (Kotlin, Compose), Flutter and on-device ML products — offline-first fintech, health and vision apps." },
      { property: "og:title", content: "Muhammad Shayan — Android, Flutter & On-Device ML Engineer" },
      { property: "og:description", content: "Android, Flutter, TensorFlow Lite and offline-first mobile systems. Selected work, experiments and contact." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { property: "og:image", content: "/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Muhammad Shayan — Android, Flutter & On-Device ML Engineer" },
      { name: "twitter:description", content: "Android, Flutter, TensorFlow Lite and offline-first mobile systems." },
      { name: "twitter:image", content: "/og-image.png" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Muhammad Shayan",
          jobTitle: "Mobile Engineer",
          email: personalLinks.email.link,
          address: { "@type": "PostalAddress", addressLocality: "Karachi", addressCountry: "PK" },
          knowsAbout: ["Android", "Kotlin", "Jetpack Compose", "Flutter", "TensorFlow Lite"],
          sameAs: [personalLinks.github.link, personalLinks.linkedin.link],
        }),
      },
    ],
  }),
  component: Page,
});

/* ---------- Data ---------- */
const METRICS = [
  { v: "3+", k: "Live Apps", icon: "rocket" },
  { v: "10k+", k: "Installs", icon: "installs" },
  { v: "99%+", k: "Stability", icon: "stability" },
  { v: "60%", k: "Perf Gain", icon: "perf" },
] as const;

const FACTS = [
  { label: "Role", value: "Senior Mobile Engineer", icon: "chip" },
  { label: "Based in", value: "Karachi, PK · UTC+5", icon: "pin" },
  { label: "Experience", value: "4 years shipping", icon: "clock" },
  { label: "Focus", value: "Kotlin · Flutter · TFLite", icon: "layers" },
] as const;

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
  const y1 = useTransform(scrollY, [0, 500], [0, 120]);
  const y2 = useTransform(scrollY, [0, 500], [0, -60]);
  const sy1 = useSpring(y1, { stiffness: 60, damping: 22 });
  const sy2 = useSpring(y2, { stiffness: 60, damping: 22 });

  return (
    <section id="top" aria-labelledby="hero-title" className="section pt-[max(5.5rem,9vh)]">
      <div className="container-x">
        <Reveal>
          <div className="flex items-center gap-2 eyebrow">
            <span className="live-dot" /> Available · Q3 2026
          </div>
        </Reveal>
        <div className="relative mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-12 items-end gap-8">
          <div className="md:col-span-8 relative z-10">
            <h1 id="hero-title" className="hd-hero">
              <span className="block"><SplitReveal text="Muhammad" /></span>
              <span className="block text-[color:var(--mid)]"><SplitReveal text="Shayan." delay={0.15} /></span>
            </h1>
            <Reveal delay={0.6}>
              <p className="body-md mt-6 md:mt-8 max-w-xl">
                Mobile Engineer building <span className="text-[color:var(--platinum)]">Android, Flutter and on-device ML products</span> — from offline-first fintech to camera-driven vision apps. Based in Karachi, shipping worldwide.
              </p>
            </Reveal>
            <Reveal delay={0.75}>
              <div className="mt-7 md:mt-9 flex flex-wrap items-center gap-3">
                <a href="#contact" className="btn btn-primary" data-cursor="Write">
                  <Icon name="mail" size={16} /> Start a Project
                </a>
                <a
                  href={CV_URL}
                  download
                  aria-label="Download Muhammad Shayan's CV (PDF)"
                  className="btn btn-ghost"
                  data-cursor="Save"
                >
                  <Icon name="download" size={16} /> Download CV
                  <span className="ml-1 opacity-50">PDF</span>
                </a>
                <a href="#work" className="btn btn-ghost" data-cursor="Scroll">
                  See Work <Icon name="arrow" size={16} />
                </a>
              </div>
            </Reveal>
          </div>
          <motion.div style={{ y: sy1 }} className="md:col-span-4 flex justify-center md:justify-end" aria-hidden>
            <div className="hero-orb" aria-hidden />
          </motion.div>
        </div>

        {/* Floating meta strip */}
        <motion.div style={{ y: sy2 }} className="mt-10 md:mt-16 glass rounded-[var(--radius-lg)] md:rounded-[var(--radius-xl)] p-4 md:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {METRICS.map((m, i) => (
            <Reveal key={m.k} delay={i * 0.08}>
              <div className="flex min-w-0 items-center gap-3 md:gap-4">
                <span className="metric-icon shrink-0"><Icon name={m.icon} size={20} /></span>
                <div className="min-w-0">
                  <div className="stat-num">{m.v}</div>
                  <div className="eyebrow mt-1 truncate">{m.k}</div>
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
      <div className="container-narrow grid gap-6">
        <Reveal>
          <p className="body-md">
            Four years shipping production mobile apps across fintech, health, and creator tools. I favour architectures that are boring where it counts — offline-first, testable, observable — and expressive where users touch them. Kotlin and Flutter are my daily languages; TensorFlow Lite is where I have the most fun.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="body-md">
            I write my own animation systems, sweat over 60fps on mid-range Androids, and believe good interfaces feel physical. Currently open to senior mobile roles and long-term product partnerships.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <ul className="flex flex-wrap gap-2 pt-4" aria-label="Core technologies">
            {STACK.slice(0, 6).map((s) => <li key={s} className="chip">{s}</li>)}
          </ul>
        </Reveal>
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
        <ul className="glass rounded-[var(--radius-lg)] md:rounded-[var(--radius-2xl)] overflow-hidden">
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
                  <span className="body-sm mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span>{w.desc}</span>
                    <span className="opacity-40 hidden sm:inline">·</span>
                    <span className="eyebrow">{w.tag}</span>
                    <span className="opacity-40 hidden sm:inline">·</span>
                    <span className="eyebrow">{w.year}</span>
                  </span>
                </span>
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
      <ul className="container-x grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
        {LAB.map((l, i) => (
          <li key={l.title} className="h-full">
            <Reveal delay={i * 0.08} className="h-full">
              <a
                href="#contact"
                data-cursor="View"
                aria-label={`${l.title} — ${l.note} (${l.status})`}
                className="glass-soft h-full rounded-[var(--radius-lg)] md:rounded-[var(--radius-xl)] p-5 md:p-7 flex flex-col justify-between min-h-[168px] md:min-h-[220px] group"
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
      <div className="container-x grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
        <Reveal className="lg:col-span-4">
          <aside aria-label="Contact details" className="glass-soft h-full rounded-[var(--radius-lg)] md:rounded-[var(--radius-xl)] p-5 md:p-8 flex flex-col justify-between gap-8 md:min-h-[420px]">
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
            <div className="pt-5 border-t border-white/10">
              <div className="eyebrow flex items-center gap-2"><span className="live-dot" /> Currently available</div>
              <div className="body-sm mt-2">Booking projects starting August 2026.</div>
            </div>
          </aside>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-8">
          <form onSubmit={submit} aria-labelledby="contact-title" className="glass rounded-[var(--radius-lg)] md:rounded-[var(--radius-xl)] p-5 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
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
        <div className="mt-8 md:mt-10 flex flex-col md:flex-row items-center justify-between gap-3 border-t border-white/10 pt-6 text-center md:text-left">
          <div className="eyebrow">© 2026 Muhammad Shayan · Karachi</div>
          <div className="eyebrow opacity-60">Built with TanStack Start · Motion · Tailwind v4</div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Page ---------- */
function Page() {
  const { scrollY } = useScroll();

  return (
    <div className="grain relative isolate min-h-dvh overflow-x-clip">
      <div className="cloud-bg" aria-hidden />
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
