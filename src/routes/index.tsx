import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { personalLinks } from "@/config/personalLinks";
import { CV_URL } from "@/config/links";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Muhammad Shayan | Senior Android & Flutter Engineer",
      },
      {
        name: "description",
        content:
          "Senior Mobile Engineer specializing in offline-first architecture, ML integration, and high-performance Android/Flutter applications. Explore my production-grade portfolio.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:title",
        content: "Muhammad Shayan | Senior Android & Flutter Engineer",
      },
      {
        property: "og:description",
        content:
          "Senior Mobile Engineer specializing in offline-first architecture, ML integration, and high-performance Android/Flutter applications.",
      },
      { property: "og:image", content: "/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Muhammad Shayan | Senior Android & Flutter Engineer",
      },
      {
        name: "twitter:description",
        content:
          "Senior Mobile Engineer specializing in offline-first architecture, ML integration, and high-performance Android/Flutter applications.",
      },
      { name: "twitter:image", content: "/og-image.png" },
      { name: "theme-color", content: "#f5f3ee" },
    ],
    links: [{ rel: "canonical", href: "https://shayxo.dev" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Muhammad Shayan",
          jobTitle: "Senior Android & Flutter Engineer",
          url: "https://shayxo.dev",
          sameAs: [
            "https://github.com/shayann07",
            "https://www.linkedin.com/in/shayann07",
          ],
          description:
            "Specialized in offline-first sync mechanisms, 99%+ crash-free releases, and performance optimization.",
          knowsAbout: [
            "Android Development",
            "Flutter",
            "Kotlin",
            "Dart",
            "Machine Learning",
            "System Design",
          ],
          image: "https://shayxo.dev/og-image.png",
          address: {
            "@type": "PostalAddress",
            addressCountry: "PK",
          },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Muhammad Shayan - Independent Mobile Engineer",
          url: "https://shayxo.dev",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://shayxo.dev/?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }),
      },
    ],
  }),
  component: Index,
});

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const tileBase =
  "bg-surface border border-ink/10 p-6 flex flex-col transition-all duration-300 hover:border-ink/30";
const inkTile =
  "bg-deep-ink text-paper border border-deep-ink p-6 flex flex-col transition-all duration-300";

const projects = [
  {
    tag: "Fintech · Flutter",
    title: "Nexus Pay",
    version: "v2.4.0",
    body: "Cross-platform banking with offline-first sync. 100k+ downloads, 99.9% crash-free sessions.",
    metric: "99.9%",
    metricLabel: "Crash-free",
  },
  {
    tag: "Health · Android",
    title: "PulseTrack",
    version: "v1.8",
    body: "On-device ML for heart-rate variability. Kotlin, Jetpack Compose, TensorFlow Lite.",
    metric: "42%",
    metricLabel: "Faster inference",
  },
  {
    tag: "Logistics · Flutter",
    title: "Cargo OS",
    version: "v3.0",
    body: "Fleet ops console. Offline-first BLoC architecture syncing 10k+ events per shift.",
    metric: "10k+",
    metricLabel: "Events / shift",
  },
  {
    tag: "Commerce · Android",
    title: "SwiftCart",
    version: "v2.0",
    body: "Native shopping with edge-cached product graphs. Cut cold-start by 58%.",
    metric: "58%",
    metricLabel: "Faster cold-start",
  },
];

const timeline = [
  {
    range: "2023 — Present",
    role: "Senior Flutter Engineer",
    body: "Scaling consumer-facing fintech to 1M+ users.",
    active: true,
  },
  {
    range: "2021 — 2023",
    role: "Android Developer",
    body: "Native retail and logistics systems at production scale.",
  },
  {
    range: "2020",
    role: "Mobile Engineer",
    body: "Started the journey — Kotlin, MVVM, clean architecture.",
  },
];

const expertise = [
  "Flutter",
  "Kotlin",
  "Android SDK",
  "Dart",
  "Jetpack Compose",
  "Firebase",
  "Clean Architecture",
  "Offline-First Sync",
  "TensorFlow Lite",
  "CI / CD",
];

function Tile({
  children,
  className = "",
  variant = "surface",
  index = 0,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "surface" | "ink";
  index?: number;
  id?: string;
}) {
  return (
    <motion.div
      id={id}
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className={`${variant === "ink" ? inkTile : tileBase} ${className}`}
    >
      {children}
    </motion.div>
  );
}

function EyebrowLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">
      {children}
    </p>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-paper text-deep-ink">
      {/* Top rail */}
      <header className="border-b border-ink/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a href="#" className="font-display text-lg font-bold tracking-tight">
            Shayan<span className="text-ink/40">.</span>
          </a>
          <nav className="hidden gap-8 text-xs font-semibold uppercase tracking-[0.18em] md:flex">
            <a href="#work" className="hover:opacity-60">Work</a>
            <a href="#timeline" className="hover:opacity-60">Timeline</a>
            <a href="#contact" className="hover:opacity-60">Contact</a>
          </nav>
          <a
            href={CV_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 border border-deep-ink px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] transition-colors hover:bg-deep-ink hover:text-paper"
          >
            CV
            <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        {/* Hero bento */}
        <section className="grid auto-rows-[140px] grid-cols-4 gap-3 md:grid-cols-12">
          <Tile className="col-span-4 md:col-span-8 md:row-span-2 justify-between" index={0}>
            <div>
              <EyebrowLabel>Mobile Engineer · 2026</EyebrowLabel>
              <h1 className="mt-4 font-display text-4xl font-bold leading-[0.95] tracking-tight md:text-6xl">
                Muhammad
                <br />
                Shayan
              </h1>
            </div>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink">
              Architecting fluid mobile experiences using{" "}
              <span className="font-semibold text-deep-ink">Android</span> and{" "}
              <span className="font-semibold text-deep-ink">Flutter</span>. Offline-first,
              crash-resistant, and shipped at scale.
            </p>
          </Tile>

          <Tile variant="ink" className="col-span-4 md:col-span-4 md:row-span-2 justify-between" index={1}>
            <EyebrowLabel>Expertise</EyebrowLabel>
            <div className="flex flex-wrap gap-2">
              {expertise.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-paper/25 px-3 py-1 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="font-mono text-[11px] opacity-40">
              System.out.println("Crafting...");
            </div>
          </Tile>

          {/* Timeline */}
          <Tile id="timeline" className="col-span-4 md:col-span-4 md:row-span-3" index={2}>
            <EyebrowLabel>Timeline</EyebrowLabel>
            <div className="mt-6 space-y-6">
              {timeline.map((t) => (
                <div key={t.range} className="relative border-l-2 border-ink/20 pl-4">
                  <div
                    className={`absolute -left-[5px] top-0 h-2 w-2 rounded-full ${
                      t.active ? "bg-deep-ink" : "bg-ink/40"
                    }`}
                  />
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-50">
                    {t.range}
                  </p>
                  <h4 className="text-sm font-bold">{t.role}</h4>
                  <p className="text-xs leading-relaxed text-ink">{t.body}</p>
                </div>
              ))}
            </div>
          </Tile>

          {/* Featured Project */}
          <Tile className="group col-span-4 md:col-span-5 md:row-span-3 justify-between" index={3}>
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <EyebrowLabel>Featured Case Study</EyebrowLabel>
                  <h3 className="mt-2 font-display text-3xl font-bold">Nexus Pay</h3>
                </div>
                <span className="bg-deep-ink px-2 py-1 font-mono text-[10px] text-paper">
                  v2.4.0
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink">
                Comprehensive cross-platform banking. 100k+ downloads, 99.9% crash-free
                sessions, sub-second cold starts on mid-tier Android.
              </p>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <div className="font-display text-4xl font-extrabold leading-none">99.9%</div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] opacity-60">
                  Crash-free
                </div>
              </div>
              <ArrowUpRight className="h-6 w-6 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </div>
          </Tile>

          <Tile className="col-span-2 md:col-span-3 md:row-span-1 flex-row items-center gap-3" index={4}>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-600 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-ink">
              Available for new projects
            </p>
          </Tile>

          <Tile variant="ink" className="col-span-2 md:col-span-3 md:row-span-2 justify-between" index={5}>
            <EyebrowLabel>Connect</EyebrowLabel>
            <div className="space-y-2 text-sm">
              <a
                href={personalLinks.linkedin.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-transform hover:translate-x-1"
              >
                LinkedIn →
              </a>
              <a
                href={personalLinks.github.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-transform hover:translate-x-1"
              >
                GitHub →
              </a>
              <a
                href={personalLinks.email.link}
                className="block transition-transform hover:translate-x-1"
              >
                Email →
              </a>
            </div>
          </Tile>

          <Tile className="col-span-4 md:col-span-3 md:row-span-1 justify-center" index={6}>
            <p className="font-display text-xs italic leading-snug text-ink">
              "Simplicity is the ultimate sophistication in mobile architecture."
            </p>
          </Tile>
        </section>

        {/* Work grid */}
        <section id="work" className="mt-16">
          <div className="mb-6 flex items-end justify-between border-b border-ink/10 pb-4">
            <div>
              <EyebrowLabel>Selected Work · 2020 — 2026</EyebrowLabel>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
                Case Studies
              </h2>
            </div>
            <span className="hidden font-mono text-xs text-ink md:block">
              04 / projects
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-12">
            {projects.map((p, i) => (
              <Tile
                key={p.title}
                className={`group ${
                  i === 0 ? "md:col-span-7" : i === 1 ? "md:col-span-5" : "md:col-span-6"
                } min-h-[240px] justify-between`}
                index={i}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <EyebrowLabel>{p.tag}</EyebrowLabel>
                    <span className="bg-deep-ink px-2 py-0.5 font-mono text-[10px] text-paper">
                      {p.version}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-2xl font-bold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink">{p.body}</p>
                </div>
                <div className="mt-6 flex items-end justify-between border-t border-ink/10 pt-4">
                  <div>
                    <div className="font-display text-3xl font-extrabold leading-none">
                      {p.metric}
                    </div>
                    <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] opacity-60">
                      {p.metricLabel}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-[0.15em]">
                    Case Study
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Tile>
            ))}
          </div>
        </section>

        {/* Contact bento */}
        <section id="contact" className="mt-16">
          <div className="mb-6 flex items-end justify-between border-b border-ink/10 pb-4">
            <div>
              <EyebrowLabel>Contact</EyebrowLabel>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
                Start a Project
              </h2>
            </div>
          </div>

          <div className="grid auto-rows-[140px] grid-cols-4 gap-3 md:grid-cols-12">
            <Tile variant="ink" className="col-span-4 md:col-span-7 md:row-span-2 justify-between" index={0}>
              <EyebrowLabel>Let's Build</EyebrowLabel>
              <div>
                <h3 className="font-display text-3xl font-bold leading-tight md:text-5xl">
                  Have a mobile idea that needs to ship?
                </h3>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-paper/70">
                  I take on a small number of engagements per quarter — architecture reviews,
                  greenfield builds, and rescue projects.
                </p>
              </div>
              <a
                href={personalLinks.email.link}
                className="inline-flex w-fit items-center gap-2 bg-paper px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-deep-ink transition-colors hover:bg-surface"
              >
                <Mail className="h-3.5 w-3.5" />
                {personalLinks.email.label}
              </a>
            </Tile>

            <Tile className="col-span-2 md:col-span-5 md:row-span-1 flex-row items-center gap-3" index={1}>
              <MapPin className="h-4 w-4 text-ink" />
              <div>
                <EyebrowLabel>Based in</EyebrowLabel>
                <p className="font-display text-lg font-semibold">Islamabad · PK</p>
              </div>
            </Tile>

            <Tile className="col-span-2 md:col-span-5 md:row-span-1 justify-between" index={2}>
              <EyebrowLabel>Response time</EyebrowLabel>
              <p className="font-display text-lg font-semibold">Within 24 hours</p>
            </Tile>

            <Tile className="group col-span-2 md:col-span-3 md:row-span-1 flex-row items-center justify-between" index={3}>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-ink/60">
                  In
                </span>
                <a
                  href={personalLinks.linkedin.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold"
                >
                  {personalLinks.linkedin.label}
                </a>
              </div>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Tile>

            <Tile className="group col-span-2 md:col-span-3 md:row-span-1 flex-row items-center justify-between" index={4}>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-ink/60">
                  Gh
                </span>
                <a
                  href={personalLinks.github.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold"
                >
                  {personalLinks.github.label}
                </a>
              </div>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Tile>
          </div>
        </section>
      </main>

      <footer className="mt-16 border-t border-ink/10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-6 py-8 text-xs text-ink md:flex-row md:items-center">
          <p className="font-mono">© 2026 Muhammad Shayan — Crafted in Islamabad.</p>
          <p className="font-mono uppercase tracking-[0.2em]">Paper & Ink · v2026.1</p>
        </div>
      </footer>
    </div>
  );
}
