import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Mail, FileDown, MapPin } from "lucide-react";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.4-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/>
  </svg>
);
const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.8v1.7h.1c.5-1 1.9-2 3.9-2 4.2 0 5 2.8 5 6.4V21h-4v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21h-4V9z"/>
  </svg>
);
import { personalLinks } from "@/config/personalLinks";
import portrait from "/portrait.jpg?url";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Muhammad Shayan — Software Engineer & AI Developer" },
      { name: "description", content: "Portfolio of Muhammad Shayan — software engineer building thoughtful, high-performance products with AI, mobile and web." },
      { property: "og:title", content: "Muhammad Shayan — Software Engineer & AI Developer" },
      { property: "og:description", content: "Portfolio of Muhammad Shayan — software engineer building thoughtful, high-performance products with AI, mobile and web." },
      { property: "og:image", content: "/og-image.png" },
      { name: "twitter:image", content: "/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

/* ————————————————————————————————————————————
   Live clock (Asia/Karachi)
———————————————————————————————————————————— */
function useClock(tz = "Asia/Karachi") {
  const [time, setTime] = useState(() => formatTime(new Date(), tz));
  useEffect(() => {
    const id = setInterval(() => setTime(formatTime(new Date(), tz)), 1000 * 30);
    return () => clearInterval(id);
  }, [tz]);
  return time;
}
function formatTime(d: Date, tz: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric", minute: "2-digit", hour12: true, timeZone: tz,
  }).format(d);
}

/* ————————————————————————————————————————————
   Cursor blob (follows mouse behind cards)
———————————————————————————————————————————— */
function CursorBlob() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 60, damping: 20, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 60, damping: 20, mass: 0.6 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX - 300);
      y.set(e.clientY - 300);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);
  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-0 h-[600px] w-[600px] rounded-full"
    >
      <div className="h-full w-full rounded-full opacity-60"
           style={{ background: "radial-gradient(closest-side, rgba(120,140,255,0.35), transparent 70%)" }} />
    </motion.div>
  );
}

/* ————————————————————————————————————————————
   Tile primitive
———————————————————————————————————————————— */
function Tile({
  className = "",
  children,
  as: As = "div",
  href,
  label,
  dark = false,
}: {
  className?: string;
  children?: React.ReactNode;
  as?: any;
  href?: string;
  label?: string;
  dark?: boolean;
}) {
  const Comp: any = href ? "a" : As;
  const props: any = href
    ? { href, target: href.startsWith("http") || href.startsWith("mailto") ? "_blank" : undefined, rel: "noreferrer" }
    : {};
  return (
    <Comp
      {...props}
      className={`tile ${dark ? "tile-dark" : ""} arrow-btn group relative overflow-hidden ${className}`}
    >
      <div className="grain absolute inset-0 rounded-[inherit]" />
      <div className="relative flex h-full w-full flex-col">
        {children}
        {label && (
          <div className="mt-auto flex items-end justify-between p-6 md:p-7">
            <span className={`text-base md:text-lg font-medium ${dark ? "text-white/90" : "text-foreground"}`}>
              {label}
            </span>
            <span className={`arrow inline-flex h-9 w-9 items-center justify-center rounded-full border ${dark ? "border-white/25 text-white/90" : "border-foreground/15 text-foreground"}`}>
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
            </span>
          </div>
        )}
      </div>
    </Comp>
  );
}

/* ————————————————————————————————————————————
   Page
———————————————————————————————————————————— */
function Index() {
  const time = useClock("Asia/Karachi");

  // Scroll-linked headline motion (kinetic name reveal)
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const nameY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const nameOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.15]);
  const nameBlur = useTransform(scrollYProgress, [0, 1], [0, 8]);
  const nameFilter = useTransform(nameBlur, (v) => `blur(${v}px)`);

  const projects = useMemo(
    () => [
      { name: "Numi", role: "AI-powered budgeting app", tag: "iOS · SwiftUI · CoreML", year: "2025" },
      { name: "Signal", role: "Realtime market dashboard", tag: "Next.js · WebSockets", year: "2025" },
      { name: "Kairos", role: "Voice-first journaling", tag: "React Native · Whisper", year: "2024" },
      { name: "Loom", role: "Design tokens pipeline", tag: "TypeScript · CLI", year: "2024" },
    ],
    []
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Aurora background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <div className="blob left-[-10%] top-[10%] h-[520px] w-[520px]"
             style={{ background: "radial-gradient(closest-side, rgba(190,170,255,0.55), transparent)" }} />
        <div className="blob right-[-8%] top-[35%] h-[560px] w-[560px]"
             style={{ background: "radial-gradient(closest-side, rgba(255,190,170,0.5), transparent)" }} />
        <div className="blob left-[30%] bottom-[-10%] h-[600px] w-[600px]"
             style={{ background: "radial-gradient(closest-side, rgba(170,220,255,0.5), transparent)" }} />
      </div>

      <CursorBlob />

      {/* Top bar */}
      <header className="relative z-20 mx-auto flex max-w-[1440px] items-center justify-between px-6 py-6 md:px-10 md:py-8">
        <div className="flex items-center gap-3">
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 text-emerald-500 dot-ping" />
          <span className="text-sm font-medium tracking-tight text-foreground">Muhammad Shayan</span>
        </div>
        <nav className="hidden gap-8 text-sm text-subtle md:flex">
          <a href="#work" className="text-foreground/60 transition hover:text-foreground">Work</a>
          <a href="#about" className="text-foreground/60 transition hover:text-foreground">About</a>
          <a href="#stack" className="text-foreground/60 transition hover:text-foreground">Stack</a>
          <a href="#contact" className="text-foreground/60 transition hover:text-foreground">Contact</a>
        </nav>
        <div className="flex items-center gap-3 text-xs text-foreground/60">
          <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} />
          <span className="hidden sm:inline">Karachi · {time}</span>
          <span className="sm:hidden">{time}</span>
        </div>
      </header>

      {/* Hero — giant name behind bento grid */}
      <section ref={heroRef} className="relative z-10 mx-auto max-w-[1440px] px-4 md:px-10">
        <div className="relative">
          {/* Kinetic name */}
          <motion.h1
            aria-label="Muhammad Shayan"
            style={{ y: nameY, opacity: nameOpacity, filter: nameFilter }}
            className="display pointer-events-none select-none text-foreground"
          >
            <span className="block text-[clamp(72px,17vw,280px)]">Muhammad</span>
            <span className="block text-[clamp(72px,17vw,280px)] -mt-[0.08em]">Shayan.</span>
          </motion.h1>

          {/* Bento grid overlays the name */}
          <div className="relative z-10 -mt-[clamp(120px,22vw,360px)] grid grid-cols-6 gap-3 md:gap-4">
            {/* Row 1 */}
            <BentoReveal className="col-span-6 md:col-span-2 aspect-[4/3]">
              <Tile href="#about" label="About">
                <TileBadge>01 / Profile</TileBadge>
              </Tile>
            </BentoReveal>

            <BentoReveal delay={0.05} className="col-span-6 md:col-span-4 aspect-[16/9] md:aspect-[16/6]">
              <Tile href="#work" label="Selected Work">
                <div className="flex items-start justify-between p-6 md:p-7">
                  <TileBadge>02 / Portfolio</TileBadge>
                  <span className="hidden text-xs uppercase tracking-[0.2em] text-foreground/50 md:inline">2020 — 2026</span>
                </div>
                <div className="px-6 pb-4 md:px-7">
                  <p className="max-w-md text-sm text-foreground/60 md:text-base">
                    Shipping ambitious products across mobile, web and AI — from a solo indie iOS launch to production dashboards used daily.
                  </p>
                </div>
              </Tile>
            </BentoReveal>

            {/* Row 2 */}
            <BentoReveal delay={0.1} className="col-span-6 md:col-span-2 aspect-[4/3] md:aspect-[4/5]">
              <Tile href={personalLinks.email.link} label="Contact">
                <TileBadge>03 / Say hello</TileBadge>
                <div className="px-6 md:px-7 mt-4">
                  <p className="font-mono text-xs text-foreground/60 md:text-sm">{personalLinks.email.label}</p>
                </div>
              </Tile>
            </BentoReveal>

            <BentoReveal delay={0.15} className="col-span-6 md:col-span-2 aspect-[4/5]">
              {/* Portrait tile */}
              <div className="tile tile-dark relative h-full w-full overflow-hidden">
                <img
                  src={portrait}
                  alt="Portrait of Muhammad Shayan"
                  className="absolute inset-0 h-full w-full object-cover opacity-95"
                  loading="lazy"
                  width={1024}
                  height={1280}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-6">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-white/70">04 / Portrait</span>
                  <span className="text-[10px] font-mono text-white/70">PKR · 24°C</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="text-white/95 text-lg font-medium tracking-tight">Software Engineer</div>
                  <div className="text-white/60 text-xs mt-1">Building AI-first products, calmly.</div>
                </div>
              </div>
            </BentoReveal>

            <BentoReveal delay={0.2} className="col-span-3 md:col-span-1 aspect-square">
              <Tile href={personalLinks.github.link}>
                <div className="flex h-full flex-col items-start justify-between p-6">
                <GithubIcon className="h-6 w-6" />
                  <div>
                    <div className="text-xs text-foreground/50">GitHub</div>
                    <div className="text-sm font-medium">{personalLinks.github.label}</div>
                  </div>
                </div>
              </Tile>
            </BentoReveal>

            <BentoReveal delay={0.22} className="col-span-3 md:col-span-1 aspect-square">
              <Tile href={personalLinks.linkedin.link}>
                <div className="flex h-full flex-col items-start justify-between p-6">
                <LinkedinIcon className="h-6 w-6" />
                  <div>
                    <div className="text-xs text-foreground/50">LinkedIn</div>
                    <div className="text-sm font-medium">{personalLinks.linkedin.label}</div>
                  </div>
                </div>
              </Tile>
            </BentoReveal>

            <BentoReveal delay={0.25} className="col-span-6 md:col-span-2 aspect-[4/3] md:aspect-auto md:row-span-1">
              <Tile href="/muhammad_shayan_cv.pdf" label="Résumé">
                <div className="flex items-start justify-between p-6 md:p-7">
                  <TileBadge>05 / PDF · 2 pages</TileBadge>
                  <FileDown className="h-5 w-5 text-foreground/60" strokeWidth={1.5} />
                </div>
                <div className="px-6 pb-4 md:px-7">
                  <p className="text-sm text-foreground/60">Full experience, education and toolkit — one crisp download.</p>
                </div>
              </Tile>
            </BentoReveal>
          </div>
        </div>
      </section>

      {/* Work */}
      <section id="work" className="relative z-10 mx-auto mt-32 max-w-[1440px] px-6 md:mt-48 md:px-10">
        <SectionHead eyebrow="Selected Work" title="Recent projects, quietly obsessed over." />
        <ul className="mt-14 divide-y divide-foreground/10 border-y border-foreground/10">
          {projects.map((p, i) => (
            <motion.li
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
              className="group"
            >
              <a href="#" className="grid grid-cols-12 items-baseline gap-4 py-8 md:py-10 transition hover:opacity-90">
                <span className="col-span-1 font-mono text-xs text-foreground/40">0{i + 1}</span>
                <span className="col-span-6 text-3xl font-medium tracking-tight md:col-span-5 md:text-5xl">{p.name}</span>
                <span className="col-span-5 text-sm text-foreground/60 md:col-span-4">{p.role}</span>
                <span className="hidden text-xs font-mono uppercase tracking-widest text-foreground/50 md:col-span-2 md:block">{p.tag}</span>
                <span className="hidden text-right font-mono text-xs text-foreground/40 md:col-span-1 md:block group-hover:text-foreground">
                  {p.year} ↗
                </span>
              </a>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* About */}
      <section id="about" className="relative z-10 mx-auto mt-32 max-w-[1440px] px-6 md:mt-48 md:px-10">
        <SectionHead eyebrow="About" title="Engineer by trade. Designer by instinct." />
        <div className="mt-14 grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-7">
            <p className="text-2xl leading-snug text-foreground/85 md:text-3xl">
              I build software that feels considered — fast, quiet, and human. My work sits between mobile apps, AI systems and the design details that make them worth using.
            </p>
            <p className="mt-6 max-w-2xl text-base text-foreground/60">
              Currently based in Karachi. Previously shipped indie iOS apps, production dashboards, and AI tooling for teams that care about craft. Comfortable owning a product end-to-end from architecture to the last pixel.
            </p>
          </div>
          <div className="col-span-12 md:col-span-5">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-8">
              {[
                ["Focus", "iOS · AI · Web"],
                ["Based", "Karachi, PK"],
                ["Since", "2020"],
                ["Available", "Q3 2026"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs uppercase tracking-widest text-foreground/40">{k}</dt>
                  <dd className="mt-2 text-lg tracking-tight">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Stack marquee */}
      <section id="stack" className="relative z-10 mt-32 md:mt-48">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10">
          <SectionHead eyebrow="Toolkit" title="Tools I reach for daily." />
        </div>
        <div className="mt-14 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="marquee-track gap-14 whitespace-nowrap px-6 text-5xl font-medium tracking-tight text-foreground/70 md:text-7xl">
            {Array.from({ length: 2 }).map((_, idx) => (
              <div key={idx} className="flex items-center gap-14">
                {["Swift", "SwiftUI", "TypeScript", "React", "Next.js", "Node", "Python", "PyTorch", "Figma", "Postgres", "Rust", "Tailwind"].map((t) => (
                  <span key={t} className="flex items-center gap-14">
                    <span>{t}</span>
                    <span className="text-foreground/20">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="relative z-10 mx-auto mt-32 max-w-[1440px] px-6 pb-24 md:mt-48 md:px-10">
        <div className="tile grain relative overflow-hidden p-10 md:p-16">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.25em] text-foreground/50">Let's build</div>
            <h2 className="display mt-6 text-[clamp(48px,9vw,140px)] text-foreground">
              Have a project<br /><span className="italic font-light">in mind?</span>
            </h2>
            <p className="mt-6 max-w-xl text-base text-foreground/60 md:text-lg">
              I take on a small number of collaborations each year. If you're building something ambitious, I'd love to hear about it.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href={personalLinks.email.link}
                className="group inline-flex items-center gap-3 rounded-full bg-foreground px-6 py-4 text-sm font-medium text-background transition hover:opacity-90"
              >
                <Mail className="h-4 w-4" strokeWidth={2} />
                {personalLinks.email.label}
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="/muhammad_shayan_cv.pdf"
                className="inline-flex items-center gap-3 rounded-full border border-foreground/15 px-6 py-4 text-sm font-medium text-foreground transition hover:bg-foreground/5"
              >
                <FileDown className="h-4 w-4" strokeWidth={2} />
                Download résumé
              </a>
            </div>
          </div>
        </div>

        <footer className="mt-10 flex flex-col items-start justify-between gap-4 text-xs text-foreground/50 md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} Muhammad Shayan. Handcrafted in Karachi.</div>
          <div className="font-mono">v2026.4 · built with intent</div>
        </footer>
      </section>
    </div>
  );
}

function TileBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6 md:p-7">
      <span className="inline-flex items-center rounded-full border border-foreground/10 bg-background/40 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-foreground/60 backdrop-blur">
        {children}
      </span>
    </div>
  );
}

function BentoReveal({
  children, className = "", delay = 0,
}: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.9, delay: 0.15 + delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="flex items-end justify-between border-b border-foreground/10 pb-6">
      <div>
        <div className="font-mono text-xs uppercase tracking-[0.25em] text-foreground/50">{eyebrow}</div>
        <h2 className="mt-3 max-w-2xl text-3xl font-medium tracking-tight md:text-5xl">{title}</h2>
      </div>
    </div>
  );
}
