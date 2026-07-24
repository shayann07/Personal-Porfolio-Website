import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { personalLinks } from "@/config/personalLinks";
import { CV_URL } from "@/config/links";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Shayan Daily — Vol. VI · Muhammad Shayan, Engineer" },
      {
        name: "description",
        content:
          "A broadsheet portfolio of Muhammad Shayan — six years of Android, Flutter and offline-first mobile engineering, set in ink and cream.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "The Shayan Daily — A Portfolio in Print" },
      {
        property: "og:description",
        content:
          "Dispatches from a working mobile engineer. Case files, instruments, and correspondence.",
      },
      { property: "og:image", content: "/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "The Shayan Daily — A Portfolio in Print" },
      { name: "twitter:image", content: "/og-image.png" },
      { name: "theme-color", content: "#f2ecdc" },
    ],
    links: [{ rel: "canonical", href: "https://shayxo.dev" }],
  }),
  component: Index,
});

/* ================================================================ *
 * THE SHAYAN DAILY — a broadsheet-style personal portfolio         *
 * ================================================================ */

const EDITION_DATE = new Date().toLocaleDateString("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const TICKER_ITEMS = [
  "LATE EDITION",
  "KARACHI · 32°C · CLEAR",
  "SHIPPING VELOCITY UP 12% WoW",
  "PROD INCIDENTS · 0",
  "ANDROID 15 ROLLOUT · STABLE",
  "FLUTTER 3.24 · ADOPTED",
  "COFFEE INDEX · 3 cups",
  "COMMITS TODAY · 14",
  "OFFLINE-FIRST · ALWAYS",
  "OPEN FOR COMMISSION · Q3 · 2026",
];

const PROJECTS = [
  {
    slug: "NEXUS-PAY",
    kicker: "FINTECH · FLUTTER",
    headline: "A wallet for a coverage-shy world.",
    byline: "Ledger design · Biometric transactions · Tokenised cards",
    body: "An offline-first challenger bank shipped to a million wallets across three emerging markets. Every debit is signed on-device and reconciled the moment a bar of signal returns.",
    metric: "1.2M installs",
    year: "2025",
    stack: ["Flutter", "Rust FFI", "gRPC", "SQLCipher"],
  },
  {
    slug: "SWIFTCART-OS",
    kicker: "COMMERCE · ANDROID",
    headline: "A storefront that outruns its network.",
    byline: "Predictive prefetch · Baseline profiles · Edge cache",
    body: "Rebuilt a marketplace's core purchase flow in Jetpack Compose. Startup fell from 2.4s to 640ms on mid-tier hardware; conversion rose 8% in the first sprint after launch.",
    metric: "-73% cold start",
    year: "2024",
    stack: ["Kotlin", "Compose", "Baseline Profiles", "Apollo"],
  },
  {
    slug: "AURA-SCAN",
    kicker: "ON-DEVICE ML · KMP",
    headline: "Diagnostics without a datacenter.",
    byline: "TensorFlow Lite · Camera2 pipeline · Kotlin Multiplatform",
    body: "A field-medic imaging tool that classifies skin lesions on a battery, no cloud round-trip. Ninety-four percent parity with the reference model, shipped as one binary to Android and iOS.",
    metric: "94% F1 · 0 network",
    year: "2024",
    stack: ["KMP", "TFLite", "Camera2", "SwiftUI"],
  },
  {
    slug: "GLASSMORPH-KIT",
    kicker: "OSS · DESIGN SYSTEM",
    headline: "A Compose kit for the glass era.",
    byline: "Blur primitives · Motion tokens · Accessible by default",
    body: "An open-source Jetpack Compose library that treats glassmorphism as a first-class design token — with contrast guards, reduced-motion fallbacks, and 12kb of shipped code.",
    metric: "3.4k stars",
    year: "2023",
    stack: ["Kotlin", "Compose", "Skia", "GitHub Actions"],
  },
];

const INSTRUMENTS = [
  { group: "PLATFORMS",  items: ["Android · Kotlin",  "Flutter · Dart",   "Kotlin Multiplatform", "iOS · Swift interop"] },
  { group: "UI SYSTEMS", items: ["Jetpack Compose",   "Material 3",       "Compose Multiplatform",  "Skia · Custom Canvas"] },
  { group: "DATA",       items: ["Room · SQLDelight", "Ktor · gRPC",      "Apollo · GraphQL",       "Protobuf · FlatBuffers"] },
  { group: "RUNTIME",    items: ["Coroutines · Flow", "Rx · legacy",      "Rust FFI",               "WorkManager · JobScheduler"] },
  { group: "QUALITY",    items: ["Baseline Profiles", "Macrobenchmark",   "Detekt · Ktlint",        "Turbine · MockK"] },
  { group: "DELIVERY",   items: ["Fastlane",          "GitHub Actions",   "Firebase App Dist.",      "Play Console · TestFlight"] },
];

const CHRONICLE = [
  { year: "2026 — Now", role: "Independent Mobile Engineer",          note: "Case work for fintech, health, and commerce clients." },
  { year: "2023 — 2025", role: "Senior Flutter Engineer, Nexus Labs", note: "Led the wallet team through a 1M-user launch." },
  { year: "2021 — 2023", role: "Android Engineer, SwiftCart",         note: "Rewrote checkout in Compose; owned performance track." },
  { year: "2020 — 2021", role: "Mobile Engineer, First Post",         note: "Shipped a Kotlin news reader used across the newsroom." },
  { year: "2019 — 2020", role: "Junior Developer, Freelance",         note: "Small apps, big lessons. Learned the value of shipping." },
];

const CORRESPONDENCE = [
  {
    tag: "COMMISSION",
    title: "Available for a case file.",
    body: "Taking on one new engagement this quarter — offline-first mobile, on-device ML, or a performance rescue on an ailing Android codebase.",
  },
  {
    tag: "SPEAKING",
    title: "Talks & workshops.",
    body: "Happy to speak on Compose performance, Flutter at scale, or the strange art of building for intermittent connectivity.",
  },
  {
    tag: "MENTORING",
    title: "Two open slots.",
    body: "I keep two free mentoring slots each month for engineers from Pakistan and the wider region. Write, and we'll find a time.",
  },
];

/* -------------------------------------------------------------- *
 * Small print utilities                                          *
 * -------------------------------------------------------------- */

function Ticker() {
  const line = TICKER_ITEMS.join("   ✦   ");
  return (
    <div className="rule-b overflow-hidden bg-[color:var(--deep-ink)] text-[color:var(--paper)]">
      <div className="flex whitespace-nowrap py-1.5">
        <div className="ticker-track flex shrink-0">
          <span className="smallcaps px-6 tracking-[0.3em]">{line}</span>
          <span className="smallcaps px-6 tracking-[0.3em]" aria-hidden>{line}</span>
        </div>
      </div>
    </div>
  );
}

function Masthead() {
  const [now, setNow] = useState<string>("--:--:--");
  useEffect(() => {
    const tick = () => setNow(new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Asia/Karachi",
    }));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <header className="mx-auto max-w-[1240px] px-6 pt-6">
      {/* top meta row */}
      <div className="rule-b flex items-end justify-between pb-2 folio">
        <span>Vol. VI · No. 041</span>
        <span className="hidden sm:inline">Est. MMXIX · Karachi ⟶ The World</span>
        <span className="tabular-nums">{now} PKT</span>
      </div>
      {/* masthead nameplate */}
      <div className="rule-triple-b pt-6 pb-3 text-center">
        <div className="smallcaps mb-2 text-[color:var(--stamp)]">The Broadsheet Portfolio of</div>
        <h1 className="headline text-[13vw] leading-[0.85] md:text-[112px]">
          The Shayan Daily
        </h1>
        <p className="deck mt-3 text-lg md:text-xl">
          &ldquo;All the code that's fit to ship&rdquo; — a personal record, printed weekly.
        </p>
      </div>
      {/* sub-meta */}
      <div className="mt-3 grid grid-cols-2 items-baseline gap-4 pb-3 folio md:grid-cols-4">
        <span>{EDITION_DATE.toUpperCase()}</span>
        <span className="text-center md:text-left">EDITION · LATE · WEB</span>
        <span className="text-center md:text-right">PRICE · YOUR ATTENTION</span>
        <span className="text-right">SIX SECTIONS · ONE ENGINEER</span>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------- *
 * Sections                                                        *
 * -------------------------------------------------------------- */

function FrontPage() {
  return (
    <section className="mx-auto max-w-[1240px] px-6 pt-8 pb-14">
      {/* Lead — three-column top-of-fold */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        {/* Left column — kicker + big headline */}
        <div className="md:col-span-5 rule-r pr-8">
          <div className="smallcaps mb-3 text-[color:var(--stamp)]">Section I · The Lead</div>
          <h2 className="headline text-[56px] md:text-[76px]">
            Mobile engineer,<br />
            <em className="italic font-normal">still shipping,</em><br />
            after six years.
          </h2>
          <p className="deck mt-4 text-xl">
            Muhammad Shayan builds Android &amp; Flutter software that works
            in the seat back of a bus with no signal — and on a MacBook Pro at
            head office. This is his record.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a href={personalLinks.email.link} className="stamp text-xs">Commission a piece</a>
            <a href={CV_URL} className="link-ink font-mono text-sm">
              Download the résumé →
            </a>
          </div>
        </div>

        {/* Middle column — article body */}
        <div className="md:col-span-4">
          <div className="smallcaps mb-2">From the desk of the engineer</div>
          <h3 className="headline mb-3 text-2xl">A note on how this paper is made.</h3>
          <div className="dropcap columns-1 text-[15px] leading-[1.55] text-[color:var(--ink)]">
            I have spent the better part of a decade learning that software is not
            written for machines — it is written for the tired person on the far
            end of a broken pipe. The dispatches on the following pages are all,
            in their way, letters to that person. Some are apps, some are
            libraries, some are quiet rewrites of things that used to be loud.
            Each was measured; each shipped; each was, I hope, a small kindness
            to somebody's afternoon.
          </div>
          <p className="marginalia mt-4">
            — <span className="not-italic font-semibold">M.S.</span>, Karachi
          </p>
        </div>

        {/* Right column — sidebar / index */}
        <aside className="md:col-span-3 rule-l pl-6">
          <div className="smallcaps mb-3 text-[color:var(--stamp)]">Inside this issue</div>
          <ul className="space-y-2 text-[15px]">
            {[
              ["I", "The Lead", "01"],
              ["II", "Dispatches", "02"],
              ["III", "Instruments", "06"],
              ["IV", "Chronicle", "08"],
              ["V", "Correspondence", "10"],
              ["VI", "Colophon", "12"],
            ].map(([n, name, pg]) => (
              <li key={name} className="leaders">
                <span className="folio w-6 shrink-0">{n}</span>
                <a
                  href={`#${(name as string).toLowerCase()}`}
                  className="link-ink no-underline hover:underline"
                >
                  {name}
                </a>
                <span className="dots" />
                <span className="folio">p.{pg}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 border border-[color:var(--rule)] p-4">
            <div className="smallcaps mb-2 text-[color:var(--stamp)]">At a glance</div>
            <dl className="space-y-2 text-[15px]">
              {[
                ["Years shipping", "6"],
                ["Apps in production", "17"],
                ["Total installs", "3.2M+"],
                ["Countries reached", "24"],
                ["Timezone", "GMT+5"],
              ].map(([k, v]) => (
                <div key={k} className="leaders">
                  <dt>{k}</dt>
                  <span className="dots" />
                  <dd className="font-mono tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Dispatches() {
  return (
    <section id="dispatches" className="rule-t bg-[color:var(--paper)]">
      <div className="mx-auto max-w-[1240px] px-6 py-14">
        <SectionHeading roman="II" name="Dispatches" note="Selected case files, ordered by recency." />
        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-2">
          {PROJECTS.map((p, i) => (
            <ProjectArticle key={p.slug} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectArticle({ project, index }: { project: (typeof PROJECTS)[number]; index: number }) {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [20, -20]);
  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div className="rule-b mb-4 flex items-baseline justify-between pb-2">
        <span className="folio">CASE No. {String(index + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}</span>
        <span className="folio">{project.year}</span>
      </div>

      {/* Halftone illustration */}
      <motion.div style={{ y }} className="halftone rule-b relative aspect-[16/9] w-full overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, oklch(0.42 0.09 ${45 + index * 60}) 0%, oklch(0.28 0.05 ${60 + index * 60}) 100%)`,
          }}
        />
        <div className="absolute inset-0 flex items-end p-6">
          <span
            className="headline text-[color:var(--paper)] opacity-70"
            style={{ fontSize: "clamp(28px, 4vw, 56px)" }}
          >
            {project.slug}
          </span>
        </div>
      </motion.div>

      <div className="mt-5">
        <div className="smallcaps mb-2 text-[color:var(--stamp)]">{project.kicker}</div>
        <h3 className="headline text-[34px] leading-[0.98]">{project.headline}</h3>
        <p className="deck mt-2 text-lg">{project.byline}</p>
        <p className="mt-4 text-[15px] leading-[1.6] text-[color:var(--ink)]">{project.body}</p>

        <div className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-2 rule-t pt-3">
          <span className="folio">RESULT · <strong className="font-mono not-italic text-[color:var(--deep-ink)]">{project.metric}</strong></span>
          <span className="folio">SET IN · {project.stack.join(" · ")}</span>
          <a href="#" className="link-ink ml-auto font-mono text-xs">Read the case file →</a>
        </div>
      </div>
    </motion.article>
  );
}

function SectionHeading({ roman, name, note }: { roman: string; name: string; note: string }) {
  return (
    <div id={name.toLowerCase()} className="rule-thick-b flex flex-wrap items-end justify-between gap-4 pb-3">
      <div>
        <div className="folio text-[color:var(--stamp)]">SECTION {roman}</div>
        <h2 className="headline mt-1 text-[54px] leading-none md:text-[72px]">{name}</h2>
      </div>
      <p className="deck max-w-md text-right text-lg">{note}</p>
    </div>
  );
}

function Instruments() {
  return (
    <section id="instruments" className="rule-t bg-[color:var(--surface)]">
      <div className="mx-auto max-w-[1240px] px-6 py-14">
        <SectionHeading
          roman="III"
          name="Instruments"
          note="The tools kept on the workbench, ordered by proximity to hand."
        />
        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-3">
          {INSTRUMENTS.map((col) => (
            <div key={col.group}>
              <div className="rule-b flex items-baseline justify-between pb-2">
                <span className="smallcaps">{col.group}</span>
                <span className="folio">{col.items.length} entries</span>
              </div>
              <ul className="mt-3 space-y-2 text-[15px]">
                {col.items.map((it, i) => (
                  <li key={it} className="leaders">
                    <span className="folio w-6 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <span>{it}</span>
                    <span className="dots" />
                    <span className="font-mono text-xs">★★★★★</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="asterism mt-12" />
      </div>
    </section>
  );
}

function Chronicle() {
  return (
    <section id="chronicle" className="rule-t bg-[color:var(--paper)]">
      <div className="mx-auto max-w-[1240px] px-6 py-14">
        <SectionHeading
          roman="IV"
          name="Chronicle"
          note="A tidy accounting of the years, for those who wonder how one arrives here."
        />
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <ul className="space-y-4">
              {CHRONICLE.map((row, i) => (
                <motion.li
                  key={row.year}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="rule-b grid grid-cols-12 items-baseline gap-4 pb-4"
                >
                  <span className="folio col-span-3 text-[color:var(--stamp)]">{row.year}</span>
                  <div className="col-span-9 md:col-span-6">
                    <h3 className="headline text-[22px]">{row.role}</h3>
                    <p className="deck text-base">{row.note}</p>
                  </div>
                  <span className="hidden md:col-span-3 md:block text-right font-mono text-xs text-[color:var(--ink)]">
                    ENTRY {String(CHRONICLE.length - i).padStart(2, "0")}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
          <aside className="md:col-span-4 border border-[color:var(--rule)] p-5">
            <div className="smallcaps mb-2 text-[color:var(--stamp)]">A working philosophy</div>
            <p className="deck text-lg">
              &ldquo;The best software feels inevitable, as though it could not have
              been written any other way. My job is to keep editing until it does.&rdquo;
            </p>
            <div className="mt-4 flex items-center justify-between">
              <span className="folio">— M.S.</span>
              <span className="stamp text-[10px]">Filed · 2026</span>
            </div>

            <div className="rule-t mt-6 pt-4">
              <div className="smallcaps mb-3">Beliefs, briefly</div>
              <ul className="space-y-2 text-[14px] leading-[1.5]">
                <li>❦ Ship first, refactor from evidence.</li>
                <li>❦ Offline is a first-class user.</li>
                <li>❦ Every animation earns its milliseconds.</li>
                <li>❦ Tests are letters to your future self.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Correspondence() {
  const [msg, setMsg] = useState("");
  return (
    <section id="correspondence" className="rule-t bg-[color:var(--surface)]">
      <div className="mx-auto max-w-[1240px] px-6 py-14">
        <SectionHeading
          roman="V"
          name="Correspondence"
          note="Letters to the editor, addressed for reply. All are read; most receive an answer."
        />
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-7 space-y-6">
            {CORRESPONDENCE.map((c, i) => (
              <motion.div
                key={c.tag}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="rule-b pb-6"
              >
                <div className="flex items-baseline justify-between">
                  <span className="smallcaps text-[color:var(--stamp)]">{c.tag}</span>
                  <span className="folio">LETTER {String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="headline mt-2 text-[30px]">{c.title}</h3>
                <p className="deck mt-2 text-lg">{c.body}</p>
              </motion.div>
            ))}
          </div>

          <aside className="md:col-span-5">
            <div className="rule-thick-t border-x border-b border-[color:var(--rule)] bg-[color:var(--paper)] p-6">
              <div className="folio text-[color:var(--stamp)]">FORM 1B · PRIVATE POST</div>
              <h3 className="headline mt-2 text-[38px] leading-none">Address the editor.</h3>
              <p className="deck mt-2">
                A few lines on what you're building, and I'll write back inside 48 hours.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const url = `${personalLinks.email.link}?subject=${encodeURIComponent(
                    "A letter from the paper",
                  )}&body=${encodeURIComponent(msg || "Hello Shayan,\n\n")}`;
                  window.location.href = url;
                }}
                className="mt-5 space-y-4"
              >
                <label className="block">
                  <span className="smallcaps text-[color:var(--ink)]">Your dispatch</span>
                  <textarea
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    rows={5}
                    placeholder="Dear Shayan — we're building an app that…"
                    className="mt-2 w-full resize-none border border-[color:var(--rule)] bg-[color:var(--paper)] p-3 font-serif text-[16px] italic text-[color:var(--deep-ink)] outline-none placeholder:text-[color:var(--ink)]/60 focus:border-[color:var(--stamp)]"
                  />
                </label>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[color:var(--ink)]">
                    Signed with intention · Delivered by hand
                  </span>
                  <button type="submit" className="stamp text-xs">Post the letter</button>
                </div>
              </form>

              <div className="rule-t mt-6 grid grid-cols-2 gap-4 pt-4">
                <a href={personalLinks.github.link} className="link-ink font-mono text-sm">
                  GITHUB · {personalLinks.github.label}
                </a>
                <a href={personalLinks.linkedin.link} className="link-ink font-mono text-sm">
                  LINKEDIN · {personalLinks.linkedin.label}
                </a>
              </div>
            </div>
            <p className="marginalia mt-3 pl-2">
              &nbsp;— Or, without ceremony: <a className="link-ink" href={personalLinks.email.link}>{personalLinks.email.label}</a>
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Colophon() {
  return (
    <footer id="colophon" className="rule-t bg-[color:var(--paper)]">
      <div className="mx-auto max-w-[1240px] px-6 py-10">
        <div className="rule-b flex flex-wrap items-baseline justify-between gap-4 pb-3">
          <div>
            <div className="folio text-[color:var(--stamp)]">SECTION VI</div>
            <h2 className="headline mt-1 text-[36px]">Colophon</h2>
          </div>
          <p className="deck max-w-md text-right">
            Set in Instrument Serif &amp; JetBrains Mono. Printed on cream oklch(0.955 0.018 85).
            Composed in Karachi. Shipped over TLS.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6 folio md:grid-cols-4">
          <div>
            <div className="smallcaps mb-1">Editor-in-Chief</div>
            <div className="text-[color:var(--deep-ink)] font-serif text-lg not-italic">Muhammad Shayan</div>
          </div>
          <div>
            <div className="smallcaps mb-1">Correspondents</div>
            <div className="text-[color:var(--deep-ink)] font-serif text-lg not-italic">One. Same person.</div>
          </div>
          <div>
            <div className="smallcaps mb-1">Print run</div>
            <div className="text-[color:var(--deep-ink)] font-serif text-lg not-italic">∞ digital impressions</div>
          </div>
          <div>
            <div className="smallcaps mb-1">Next edition</div>
            <div className="text-[color:var(--deep-ink)] font-serif text-lg not-italic">When there is news.</div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <span className="folio">© {new Date().getFullYear()} · The Shayan Daily · All rights lightly reserved.</span>
          <span className="stamp text-[10px]">Ex Libris · Karachi</span>
        </div>
      </div>
    </footer>
  );
}

/* -------------------------------------------------------------- *
 * Root                                                            *
 * -------------------------------------------------------------- */

function Index() {
  return (
    <div className="newsprint min-h-screen text-[color:var(--deep-ink)]">
      <Ticker />
      <Masthead />
      <FrontPage />
      <Dispatches />
      <Instruments />
      <Chronicle />
      <Correspondence />
      <Colophon />
    </div>
  );
}
