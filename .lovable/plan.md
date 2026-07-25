## Goal
Extend the Liquid Glass system so **every visible surface** across the site reads as the same refractive glass — not just pills, cards, tokens, and posters.

## Current state
`src/styles.css` already ships liquid-glass primitives (`.glass-pill`, `.chip`, `.mini-token`, `.metric-glass`, `.signal-cell`, `.lab-card`, `.project-poster__inner`, `.contact-scene`) with chromatic edges, specular highlights, 28px blur, and inner/outer shadows.

Surfaces that are NOT glass yet and break consistency:
- Header shell (`header`) — currently transparent, no glass tray.
- Hero visual: `.phone-shell`, `.phone-screen`, `.screen-*`, `.float-panel--left/right`, `.hero-stage__ring--*` — flat fills.
- Poster art device: `.poster-art__device`, `.poster-art__orbit` — flat.
- Visual split blocks in `SignalSection` and Lab section wrappers.
- Footer `.linkline`, `.visual-mark` badge, `.live-dot` container, `.micro-eyebrow` chips.
- Mobile bottom nav container.
- Any modal/overlay shells.

## Plan
1. Add a shared `.lg-surface` liquid-glass mixin utility in `src/styles.css` (single source of truth: fill, edge, chromatic ::before, specular ::after, blur, shadows) and refactor existing glass classes to compose from it — no visual regression.
2. Apply `.lg-surface` (or extend rules) to the missing surfaces:
   - Header: floating glass tray with rounded pill container.
   - Phone shell + screen + dock + floating panels (tinted glass, thinner blur inside screen).
   - Poster device frame and orbit ring.
   - Signal + Lab section outer cards.
   - Footer contact card refinements, `linkline` becomes glass chip on hover.
   - `visual-mark`, `micro-eyebrow`, `live-dot` wrapper → glass tokens.
   - Mobile bottom nav → glass tray matching header.
3. Tune blur/opacity per size tier (small tokens: 12px blur; medium cards: 20px; large trays: 28px) so small elements stay legible and large ones feel deep.
4. Respect `prefers-reduced-transparency` and existing reduced-motion guards — fall back to solid `--surface` fill.
5. Verify on mobile viewport (390px) that stacked glass layers don't tank FPS — cap `backdrop-filter` layers at ~6 concurrent by making pseudo-element highlights `will-change: opacity` only.

## Scope
CSS-only in `src/styles.css` plus minimal className additions in `src/routes/index.tsx` and `src/components/*` where wrapper markup already exists. No logic, no route, no data changes.

## Out of scope
Rewriting animations, changing palette, restructuring sections, or altering the MCP integration.