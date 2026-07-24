import { createFileRoute } from "@tanstack/react-router";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Cursor } from "@/components/Cursor";
import { ShaderBackground } from "@/components/ShaderBackground";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Muhammad Shayan — Mobile Engineer" },
      { name: "description", content: "A visual portfolio for Muhammad Shayan, Android and Flutter engineer building offline-first mobile apps, on-device ML, and polished product systems." },
      { property: "og:title", content: "Muhammad Shayan — Mobile Engineer" },
      { property: "og:description", content: "Android, Flutter, offline-first sync, on-device ML, and production-ready mobile product engineering." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

const PROJECTS = [
  {
    n: "01",
    title: "AI Trust Ledger",
    tag: "Fintech",
    role: "Kotlin · Firebase · MVVM",
    desc: "ROI cycles, portfolio tracking, and resilient financial flows.",
    stack: ["Kotlin", "Firebase", "MVVM"],
    metric: "99.8%",
    label: "Crash-free",
    tone: "aqua",
  },
  {
    n: "02",
    title: "LeafBloom",
    tag: "On-device ML",
    role: "TFLite · Compose · CameraX",
    desc: "Plant disease diagnosis running locally on Android devices.",
    stack: ["TFLite", "Compose", "CameraX"],
    metric: "95%",
    label: "Accuracy",
    tone: "mint",
  },
  {
    n: "03",
    title: "GitPulse",
    tag: "Dev Tool",
    role: "Flutter · GraphQL · OAuth",
    desc: "GitHub analytics, sync, contribution graphs, and workflow signals.",
    stack: ["Flutter", "GraphQL", "Riverpod"],
    metric: "Live",
    label: "Sync",
    tone: "violet",
  },
  {
    n: "04",
    title: "Medicare",
    tag: "HealthTech",
    role: "Flutter · Firebase · Stripe",
    desc: "Appointments, chat, payments, pharmacy flows, and follow-up care.",
    stack: ["Flutter", "Firebase", "Stripe"],
    metric: "4.8★",
    label: "Rating",
    tone: "rose",
  },
];

const METRICS = [
  { v: "3+", k: "Apps shipped" },
  { v: "10k+", k: "Installs" },
  { v: "99%+", k: "Stable releases" },
  { v: "60%", k: "Perf gains" },
];

const STACK = ["Kotlin", "Compose", "Flutter", "TFLite", "Firebase", "GraphQL", "Room", "CI/CD", "ML Kit", "Fastlane", "Riverpod", "Testing"];

const LAB = [
  { title: "Gesture ML", sub: "CameraX + TFLite", tone: "aqua" },
  { title: "Voice Layer", sub: "Private on-device commands", tone: "violet" },
  { title: "Model Optimizer", sub: "Smaller, faster inference", tone: "mint" },
];

function Header() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const format = () => new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Karachi", hour12: false }).format(new Date());
    setTime(format());
    const id = window.setInterval(() => setTime(format()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-[var(--space-gutter)] py-3 md:py-5">
      <div className="mx-auto flex max-w-[1800px] items-center justify-between gap-3">
        <a href="#top" data-cursor="Home" className="glass-pill group inline-flex items-center gap-2">
          <span className="visual-mark">S</span>
          <span className="micro-eyebrow text-foreground">Shayan</span>
        </a>
        <nav aria-label="Primary" className="glass-pill hidden items-center gap-1 md:flex">
          {[["Work", "#work"], ["Signal", "#signal"], ["Lab", "#lab"], ["Contact", "#contact"]].map(([label, href]) => (
            <a key={label} href={href} data-cursor="Jump" className="nav-link">
              {label}
            </a>
          ))}
        </nav>
        <div className="glass-pill inline-flex items-center gap-2">
          <span className="live-dot" />
          <span className="micro-eyebrow text-foreground/80">KHI {time || "--:--"}</span>
        </div>
      </div>
    </header>
  );
}

function SplitEnter({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(" ").map((word, wordIndex) => (
        <span key={`${word}-${wordIndex}`} className="inline-block whitespace-nowrap">
          {Array.from(word).map((char, charIndex) => (
            <span key={`${char}-${charIndex}`} className="char-mask">
              <motion.span
                initial={{ y: "110%", rotate: 5 }}
                animate={{ y: "0%", rotate: 0 }}
                transition={{ duration: 0.85, ease: [0.7, 0, 0.2, 1], delay: delay + wordIndex * 0.025 + charIndex * 0.012 }}
              >
                {char}
              </motion.span>
            </span>
          ))}
          {wordIndex < text.split(" ").length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const artY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.2]);

  return (
    <section id="top" ref={ref} className="relative min-h-[88svh] overflow-hidden pt-24 md:min-h-[92svh] md:pt-28">
      <motion.div style={{ y, opacity }} className="container-x grid min-h-[calc(88svh-6rem)] grid-cols-12 items-center gap-6 md:min-h-[calc(92svh-7rem)] md:gap-10">
        <div className="col-span-12 md:col-span-7">
          <div className="mb-5 flex flex-wrap gap-2">
            <span className="chip"><span className="live-dot" />Available Q3</span>
            <span className="chip">Android · Flutter · ML</span>
          </div>
          <h1 className="hero-title">
            <span className="block"><SplitEnter text="Muhammad" /></span>
            <span className="block"><SplitEnter text="Shayan" delay={0.08} className="serifital text-foreground/90" /></span>
          </h1>
          <div className="mt-5 grid max-w-xl grid-cols-2 gap-2 sm:grid-cols-4 md:mt-7">
            {METRICS.map((m, index) => (
              <motion.div
                key={m.k}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.45 + index * 0.06 }}
                className="metric-glass"
              >
                <div className="stat-num text-foreground">{m.v}</div>
                <div className="micro-eyebrow mt-1 text-foreground/55">{m.k}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div style={{ y: artY }} className="col-span-12 md:col-span-5">
          <HeroVisual />
        </motion.div>
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="hero-stage" aria-label="Abstract mobile product system visual">
      <div className="hero-stage__mesh" />
      <div className="hero-stage__ring hero-stage__ring--one" />
      <div className="hero-stage__ring hero-stage__ring--two" />
      <motion.div
        aria-hidden
        className="phone-shell"
        animate={{ y: [0, -10, 0], rotate: [-2, 1, -2] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="phone-screen">
          <div className="screen-bar" />
          <div className="screen-orb" />
          <div className="screen-lines">
            <span />
            <span />
            <span />
          </div>
          <div className="screen-dock">
            <i />
            <i />
            <i />
          </div>
        </div>
      </motion.div>
      <motion.div className="float-panel float-panel--left" animate={{ y: [0, 12, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
        <span className="micro-eyebrow">Offline sync</span>
        <strong>Stable</strong>
      </motion.div>
      <motion.div className="float-panel float-panel--right" animate={{ y: [0, -12, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
        <span className="micro-eyebrow">On-device ML</span>
        <strong>Fast</strong>
      </motion.div>
    </div>
  );
}

function WorkGallery() {
  return (
    <section id="work" className="relative section-y">
      <div className="container-x">
        <SectionIntro eyebrow="Selected work" title="Four product systems, visualized." />
        <div className="grid grid-cols-12 gap-3 md:gap-4">
          {PROJECTS.map((project, index) => (
            <ProjectPoster key={project.n} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectPoster({ project, index }: { project: typeof PROJECTS[number]; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), { stiffness: 180, damping: 24 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), { stiffness: 180, damping: 24 });

  const onMove = (event: React.MouseEvent) => {
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href="#contact"
      data-cursor="View"
      onMouseMove={onMove}
      onMouseLeave={reset}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.75, ease: [0.7, 0, 0.2, 1], delay: index * 0.04 }}
      className={`project-poster project-poster--${project.tone} ${index === 0 ? "lg:col-span-6" : "lg:col-span-6"}`}
      style={{ perspective: 1000 }}
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="project-poster__inner">
        <div className="poster-art" aria-hidden>
          <div className="poster-art__mesh" />
          <div className="poster-art__device">
            <span />
            <span />
            <span />
          </div>
          <div className="poster-art__orbit" />
          <div className="poster-art__signal poster-art__signal--one" />
          <div className="poster-art__signal poster-art__signal--two" />
        </div>

        <div className="poster-copy">
          <div className="flex items-center justify-between gap-3">
            <span className="num-idx">— {project.n}</span>
            <span className="chip">{project.tag}</span>
          </div>
          <div className="mt-auto">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="hd-3 text-foreground">{project.title}</h2>
                <p className="mt-1 max-w-sm body-sm text-foreground/62">{project.desc}</p>
              </div>
              <div className="poster-metric">
                <strong>{project.metric}</strong>
                <span>{project.label}</span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.stack.map((item) => (
                <span key={item} className="mini-token">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.a>
  );
}

function SignalSection() {
  return (
    <section id="signal" className="relative border-t border-border section-y">
      <div className="container-x">
        <div className="visual-split">
          <div className="signal-orb" aria-hidden>
            <div />
            <span />
            <span />
            <span />
          </div>
          <div className="signal-board">
            <SectionIntro eyebrow="Production signal" title="Engineering shown as motion, not paragraphs." compact />
            <div className="signal-grid">
              {METRICS.map((metric) => (
                <div key={metric.k} className="signal-cell">
                  <strong>{metric.v}</strong>
                  <span>{metric.k}</span>
                </div>
              ))}
            </div>
            <div className="stack-river" aria-label="Technology stack">
              {STACK.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LabSection() {
  return (
    <section id="lab" className="relative border-t border-border section-y">
      <div className="container-x">
        <SectionIntro eyebrow="Lab" title="Small experiments, big interfaces." />
        <div className="lab-grid">
          {LAB.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: index * 0.05 }}
              className={`lab-card lab-card--${item.tone}`}
            >
              <div className="lab-visual" aria-hidden>
                <span />
                <span />
                <span />
              </div>
              <div>
                <h2>{item.title}</h2>
                <p>{item.sub}</p>
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
    <section id="contact" className="relative overflow-hidden border-t border-border section-y pb-24">
      <div className="container-x">
        <div className="contact-scene">
          <div className="contact-aura" aria-hidden />
          <div className="relative z-10 max-w-2xl">
            <span className="chip"><span className="live-dot" />Booking Q3 — Q4</span>
            <h2 className="mt-5 hd-1 text-foreground">Build the app people keep.</h2>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="mailto:hello@shayxo.dev" data-cursor="Write" className="pill-btn text-foreground">
                <span className="visual-mark">✎</span>
                <span className="font-display font-bold">hello@shayxo.dev</span>
                <span aria-hidden>↗</span>
              </a>
              <a href="https://github.com/shayann07" data-cursor="GitHub" className="chip hover:border-foreground/30">GitHub ↗</a>
              <a href="https://www.linkedin.com/in/shayann07" data-cursor="LinkedIn" className="chip hover:border-foreground/30">LinkedIn ↗</a>
            </div>
          </div>
        </div>
        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 micro-eyebrow text-foreground/40">
          <span>© 2026 Muhammad Shayan</span>
          <a href="#top" className="linkline">Back to top ↑</a>
        </footer>
      </div>
    </section>
  );
}

function SectionIntro({ eyebrow, title, compact = false }: { eyebrow: string; title: string; compact?: boolean }) {
  return (
    <div className={compact ? "mb-5" : "mb-7 md:mb-10"}>
      <span className="chip"><span className="live-dot" />{eyebrow}</span>
      <h2 className="mt-4 max-w-3xl hd-2 text-foreground">{title}</h2>
    </div>
  );
}

function MobileNav() {
  return (
    <nav aria-label="Mobile primary" className="fixed bottom-3 left-1/2 z-40 -translate-x-1/2 md:hidden">
      <div className="glass-pill flex max-w-[calc(100vw-1.5rem)] items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {[["Work", "#work"], ["Signal", "#signal"], ["Lab", "#lab"], ["Contact", "#contact"]].map(([label, href]) => (
          <a key={label} href={href} className="nav-link shrink-0">{label}</a>
        ))}
      </div>
    </nav>
  );
}

function Page() {
  return (
    <div className="grain relative isolate min-h-screen overflow-x-clip text-foreground">
      <ShaderBackground />
      <Cursor />
      <Header />
      <MobileNav />
      <main>
        <Hero />
        <WorkGallery />
        <SignalSection />
        <LabSection />
        <Contact />
      </main>
    </div>
  );
}