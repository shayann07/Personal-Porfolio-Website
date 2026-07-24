Port the existing React + Vite + Tailwind v3 single-page portfolio into this TanStack Start + Tailwind v4 workspace, replacing the placeholder index page.

## What we're porting
- Source repo: `shayann07/portfolio-mockup` (React 18, Vite, Tailwind 3.4.16, Framer Motion, Lenis, react-helmet-async).
- 10 sections: Navbar, Hero, Story, CommandCenter, Projects, Skills, Lab, CTA, Contact, Footer.
- Dark theme, custom scrollbar, cursor glow, animated raindrops, smooth scroll.

## Target stack adaptations
- TanStack Start v1 file-based routing.
- Tailwind v4 CSS-first tokens in `src/styles.css`.
- React 19 (keep components functional; avoid legacy APIs).
- Replace `react-helmet-async` with TanStack `head()` in `src/routes/index.tsx` and `src/routes/__root.tsx`.
- Load Inter font via `<link>` in `src/routes/__root.tsx` head, not CSS `@import`.
- Keep single-page scrolling behavior on `/` (the user explicitly asked to clone a single-page portfolio).

## Implementation steps

1. **Dependencies**
   - Install `framer-motion`, `lenis`, `lucide-react` with `bun add`.
   - Skip unused deps from source (`@radix-ui/*`, `class-variance-authority`, `react-router-dom`, `react-helmet-async`).

2. **Design tokens / global styles**
   - Map the source `tailwind.config.js` dark theme colors into `src/styles.css` `:root` / `.dark` using oklch.
   - Preserve custom scrollbar styling in `src/styles.css`.
   - Add global base rules (font-feature-settings, overscroll-behavior, smooth scroll).

3. **Static assets**
   - Copy `public/og-image.png` and `public/muhammad_shayan_cv.pdf` from `/tmp/portfolio-mockup/public` into `public/`.

4. **Shared code**
   - Port `src/utils/animation-variants.ts`.
   - Port `src/hooks/useMobile.ts` and `src/hooks/useScrollAnimation.ts`.
   - Port `src/config/icons.ts`, `src/config/links.ts`, `src/config/personalLinks.ts`.
   - Port shared components: `CursorGlow`, `SectionHeader`, `CardParticles`, `SEO/MetaHead`, `SEO/StructuredData`.

5. **Sections**
   - Port each section folder under `src/sections/` preserving component structure:
     - `Navbar`, `HeroSection`, `StorySection`, `CommandCenterSection`, `ProjectsSection`, `SkillsSection`, `LabSection`, `CTASection`, `ContactSection`, `Footer`.
   - Update Tailwind class names for v4 where needed (e.g., `bg-gradient-to-r` → `bg-linear-to-r`, bare `border`, etc.).

6. **Routing / entry**
   - Replace `src/routes/index.tsx` with the portfolio landing page.
   - Create a page component that composes all sections, handles Lenis smooth scroll, cursor glow, and suspense lazy loading.
   - Move SEO meta from `MetaHead`/`StructuredData` into the route `head()`.

7. **Verification**
   - Run typecheck and dev build.
   - Spot-check the preview for sections, dark theme, and animations.

## Notes
- The source contact form is `mailto:` only; keep it unchanged.
- Source icons rely on remote Anima CDN URLs in `src/config/icons.ts`; preserve them for now and note the TODO.
- Keep the existing project structure conventions (`src/components/`, `src/hooks/`, `src/sections/`, `src/lib/` for utilities).