import { createFileRoute } from "@tanstack/react-router";
import { CursorGlow } from "@/components/CursorGlow";
import { useMobile } from "@/hooks";
import { Navbar } from "@/sections/Navbar";
import { HeroSection } from "@/sections/HeroSection";
import Lenis from "lenis";
import { Suspense, lazy, useEffect, useRef } from "react";

const CommandCenterSection = lazy(() =>
  import("@/sections/CommandCenterSection").then((module) => ({
    default: module.CommandCenterSection,
  })),
);
const ContactSection = lazy(() =>
  import("@/sections/ContactSection").then((module) => ({
    default: module.ContactSection,
  })),
);
const Footer = lazy(() =>
  import("@/sections/Footer").then((module) => ({ default: module.Footer })),
);
const LabSection = lazy(() =>
  import("@/sections/LabSection").then((module) => ({ default: module.LabSection })),
);
const ProjectsSection = lazy(() =>
  import("@/sections/ProjectsSection").then((module) => ({
    default: module.ProjectsSection,
  })),
);
const SkillsSection = lazy(() =>
  import("@/sections/SkillsSection").then((module) => ({
    default: module.SkillsSection,
  })),
);
const StorySection = lazy(() =>
  import("@/sections/StorySection").then((module) => ({
    default: module.StorySection,
  })),
);
const CTASection = lazy(() =>
  import("@/sections/CTASection").then((module) => ({
    default: module.CTASection,
  })),
);

const ScrollbarRevealer = () => {
  useEffect(() => {
    document.body.classList.remove("loading");
  }, []);
  return null;
};

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
      { name: "theme-color", content: "#050816" },
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

function Index() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobile();

  useEffect(() => {
    window.scrollTo(0, 0);

    const safetyTimeout = setTimeout(() => {
      document.body.classList.remove("loading");
    }, 4000);

    return () => clearTimeout(safetyTimeout);
  }, []);

  useEffect(() => {
    if (!scrollContainerRef.current || isMobile) return;

    const lenis = new Lenis({
      wrapper: scrollContainerRef.current,
      content: contentRef.current as HTMLElement,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [isMobile]);

  return (
    <div className="bg-background text-foreground font-inter text-base">
      <div className="relative h-screen w-full">
        <main
          ref={scrollContainerRef}
          className="custom-scrollbar relative h-full w-full overflow-x-hidden overflow-y-auto bg-background"
          role="main"
        >
          <CursorGlow />
          <div className="pointer-events-none fixed inset-0 z-50 bg-[radial-gradient(900px_at_400px_300px,rgba(139,92,246,0.08),rgba(0,0,0,0)_60%)]" />
          <div className="pointer-events-none fixed inset-0 z-40 h-[500px] w-[500px] translate-x-[150px] translate-y-[50px]">
            <div className="h-full w-full rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.12)_0%,rgba(168,85,247,0.06)_50%,rgba(0,0,0,0)_70%)] opacity-60 blur-[80px]" />
          </div>
          <div ref={contentRef} className="relative z-10">
            <Navbar />
            <HeroSection />
            <Suspense fallback={null}>
              <ScrollbarRevealer />
              <StorySection />
              <CommandCenterSection />
              <ProjectsSection />
              <SkillsSection />
              <LabSection />
              <CTASection />
              <ContactSection />
              <Footer />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
