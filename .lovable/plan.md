## Goal
Fix the empty About band, upgrade icons, tighten spacing, add a resume download, complete SEO, and make the contact form give real success/failure feedback.

## 1. Empty section (img 1)
The About band reserves a wide left column that renders nothing, so the heading floats above a blank region. Rebuild About as a two-column composition where the left column carries actual content — a compact "at a glance" glass panel (role, location, availability, years shipping, current focus) — and the right column keeps the prose plus stack chips. On mobile it stacks with the panel below the prose.

## 2. Animated icons (img 2 and site-wide)
Replace the hand-drawn SVG set with Lucide icons wrapped in a shared motion component:
- New `src/components/Icon.tsx` — maps a semantic name to a Lucide icon, applies consistent size/stroke, and layers motion (subtle idle loop, hover/in-view response, draw-in on reveal), all disabled under `prefers-reduced-motion`, `aria-hidden` by default.
- Metric strip gets meaningful icons (Rocket / Download / ShieldCheck / Gauge) instead of the current abstract marks, at a larger optical size aligned to the numerals.
- Swap every `AnimatedIcon` usage across the page to the new component and delete the old file.

## 3. Spacing pass
- Reduce `--space-section` and section-head margins; remove the doubled gap between the section heading and content blocks.
- Normalise the vertical rhythm between hero → metric strip → About, and tighten the marquee's oversized surrounding margin.
- Audit each section for stacked padding (section padding + card padding + reveal margins) and collapse to a single spacing token per level.

## 4. Resume download
Add a "Download CV" button next to the hero CTAs and a matching entry in the contact aside, pointing at the existing `/muhammad_shayan_cv.pdf` via `src/config/links.ts`. Real `<a download>` with a descriptive `aria-label`, visible focus ring, and file-type/size hint.

## 5. SEO
- Expand the route `head()`: keyword-led title, canonical link, `og:url`, `og:image` + `twitter:image` using the existing `/og-image.png` (absolute URL derived at request time), `twitter:card` upgraded to `summary_large_image`.
- Root gets sitewide defaults (site name, viewport, Person JSON-LD); the home route gets Person/WebSite structured data with real links.
- Add `public/robots.txt` (allow all) and a `src/routes/sitemap[.]xml.ts` server route listing the single indexable route.

## 6. Contact form states
Keep the mailto handoff (your choice) but make it honest:
- Client-side validation with inline field errors (required, email format) before submit.
- Real states: idle → validating → opening mail app → handed off, plus a failure path if the mailto handoff can't be triggered, with a "copy email address" fallback that confirms on copy.
- `aria-live` status region, error summary linked to fields via `aria-describedby`, disabled submit only while in flight.

## Technical notes
- Icons via `lucide-react` (already available) + framer-motion wrapper; no new deps expected.
- Spacing changes stay in `src/styles.css` tokens so the whole page shifts consistently.
- Sitemap uses the empty `BASE_URL` placeholder since no custom domain is set yet.
