## Rebuild: Kinetic Monolith Spatial Bento

Complete rebuild of the portfolio around the selected direction. Whole page, one unified spatial-bento surface, monochrome platinum tokens, pointer/scroll-driven parallax across z-stacked glass planes.

## Design system (locked)

Tokens rewritten in `src/styles.css`:

- Void `#030304`, panel base `#131317`, mid `#8A8F99`, silver `#C8CCD4`, light `#F0F1F3`. No hue.
- Sora (display, 400/600/800), Manrope (body, 400/500/700). Loaded via `<link>` in `__root.tsx`.
- Glass tiers (near/mid/far) with different `backdrop-blur`, `saturate`, opacity, border alpha, shadow depth — mapped to z-position in the bento.
- One inverted tile per group (white surface, dark text) as the accent anchor — the only "brightness accent" in a hueless palette.
- Radii on a 3-step scale: `1.5rem`, `2rem`, `2.5rem`. Uppercase eyebrows with `0.2–0.3em` tracking.

## Page structure (single scroll, one bento)

Replace the current multi-section layout with one continuous 12-column bento surface:

```text
┌──────────────────────────────┬──────────┐
│ HERO plane (Muhammad Shayan) │ 4 metric │
│ chips: Android/Flutter/ML    │ tiles 2x2│
├──────────────────────┬───────┴──────────┤
│ Flagship: AI Trust   │ Lab experiments  │
│ Ledger (lens flare)  │ + Karachi live   │
├──────────┬───────────┼──────────────────┤
│LeafBloom │ GitPulse  │ Medicare         │
├──────────┴───────────┴──────────────────┤
│ Contact strip (dashed) — GH · LI · Mail │
└─────────────────────────────────────────┘
```

Fixed glass pill header (Shayan mark · nav · KHI time) stays; mobile bottom pill nav stays. Everything else is one bento.

## Spatial motion

- **Ambient**: two blurred glow orbs fixed behind the bento drift with `useScroll` progress (translate only) — the only "light source" for the glass.
- **Pointer parallax**: single top-level `useMotionValue` for cursor; each tile subscribes with a depth weight (near tiles translate more, far tiles translate less). Springs on the values, transforms applied via `translate3d` for GPU.
- **Hover**: tiles tighten letter-spacing on the hero, scale-up on metrics, lens-flare sweep on the flagship, list items shift right and brighten in the lab list.
- **Reveal**: staggered `whileInView` scale/opacity per tile, disabled under `prefers-reduced-motion`.

## Files touched

- `src/styles.css` — rewrite tokens, glass tiers, eyebrow/heading utilities, remove unused liquid-glass carry-over.
- `src/routes/index.tsx` — rebuild `Page` around the new bento; keep `Header`, `MobileNav`, `SplitEnter`; delete `HeroVisual`, `WorkGallery`, `ProjectPoster`, `SignalSection`, `LabSection`, `Contact` sections in favor of new bento tile components (`HeroTile`, `MetricTile`, `FlagshipTile`, `LabTile`, `WorkTile`, `ContactStrip`) inside one `<SpatialBento>`.
- `src/routes/__root.tsx` — add Sora + Manrope `<link>` in head (keep existing links).
- Keep `ShaderBackground` and `Cursor` as-is (they already fit monochrome).
- Update route `head()` meta (title/description) to reflect the spatial rebrand.

## Content

All real content from the current file is preserved: 4 metrics, 4 projects (AI Trust Ledger flagship + LeafBloom, GitPulse, Medicare), 3 lab experiments, Karachi live time, GitHub/LinkedIn/email. Copy tightened to fit tile density.

## Out of scope

No new dependencies. No backend/data changes. MCP server untouched. Perf HUD, theme switcher, modals — not part of this pass.
