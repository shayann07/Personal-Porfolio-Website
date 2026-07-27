## Audit: what's actually happening

I inspected the live page. The cloud layer **is** in the DOM and rendering — it isn't a missing element or a z-index bug:

- `src/routes/index.tsx:581` renders `<div className="cloud-bg" aria-hidden />` inside `.grain relative isolate`.
- Computed styles confirm: `position: fixed`, full viewport (1522×904), `z-index: -2`, `opacity: 1`, gradients present, both drift pseudo-layers animating (`cloud-drift-a/b`, `blur(120px)`, opacity 0.55).

The problem is that it's **visually invisible**, not absent. Three reasons:

1. **The cloud colors are almost black.** `--cloud-1 #3b2a63`, `--cloud-2 #1a3a5f`, `--cloud-3 #5a2440`, `--cloud-4 #0d1a2a` — each mixed at only 45–60% over `--void #05060a`. The dominant layer (`--cloud-4`, a near-black navy at 60% covering an ellipse 100%×80%) flattens the other three into the void.
2. **The layer is `position: fixed` with no scroll response.** Everything below the hero sees the exact same static wash, so the page reads as flat black once you scroll.
3. **Content sits on top with its own dark scrims.** The liquid-glass tiles use dark backdrop scrims, so what little tint exists gets absorbed.

Net: the previous version's visible cloudy aurora was replaced by a much darker, lower-contrast palette during the cosmic-black retune.

## Plan

**1. Retune the cloud palette (`src/styles.css`)**
- Raise the cloud hues into visible territory while staying cosmic-black overall: brighter violet, teal, and plum stops, and drop the near-black `--cloud-4` from a dominant fill to a subtle vignette.
- Increase per-gradient mix strength so the wash is readable against `#05060a` without turning the page purple.

**2. Rebuild the cloud composition**
- Add a third drifting blob (currently only `::before` / `::after`) on its own slower animation so the motion never visibly loops in sync.
- Larger, softer radii with staggered durations; keep `translate3d` + `will-change: transform` so it stays GPU-composited.
- Add a soft radial vignette on top so edges stay dark and center reads cloudy — this is what gave the earlier version depth.

**3. Make the background respond to scroll**
- Give the cloud container a very slow parallax drift tied to scroll position (CSS-driven, transform only, no per-frame React state) so lower sections get fresh cloud coverage instead of the same static frame.

**4. Keep glass legible**
- Slightly reduce the darkness of the tile scrims so the clouds show through the glass, which is the whole point of the liquid-glass look, while preserving text contrast.

**5. Respect motion + mobile budgets**
- Keep drift animations off under `prefers-reduced-motion`.
- Keep the existing mobile override (`blur(70px)`, lower opacity), retuned to the new palette so mobile still shows clouds rather than mud.

**6. Verify**
- Screenshot the hero, a mid-page section, and the footer via Playwright to confirm the clouds are visible at all scroll depths, and re-check mobile width.

### Technical notes
All changes are confined to `src/styles.css` (the `.cloud-bg` block, cloud tokens, glass scrim tokens, and the reduced-motion / mobile media queries), plus a possible one-line class addition on the existing `.cloud-bg` div in `src/routes/index.tsx` for the scroll parallax. No structural or content changes.
