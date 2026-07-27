## Palette: Cosmic + Crimson Signal

Retire vanilla `#F1FEC8` entirely. New roles:

| Role | Value | Used for |
|---|---|---|
| Void / background | `#23212C` Cosmic | page base, shader floor |
| Deep shade | `#1A1820` | vignette, cloud depth, card scrims |
| Foreground | `#EDEBDE` Cotton | all body/heading text, icons |
| Muted foreground | Cotton @ 62% | captions, meta, labels |
| Accent / signal | `#8B1221` Crimson | CTAs, hover arrows, active nav, focus ring, chart/stat highlights |
| Accent lift | `#B8202F` | crimson hover/glow state (raw crimson is dark on cosmic) |
| Glass edge | Cotton @ 8–14% | borders, specular highlights |

Crimson stays a *signal* colour: one accent per view, never as a large fill. Text on crimson is Cotton.

## Files to change

**`src/styles.css`**
- `--silver: #d9e6ad` → Cotton-derived neutral; `--platinum` → `#EDEBDE`.
- `--cloud-1..4` → cosmic/plum-ink neutrals (`#2E2B3A`, `#332F3E`, `#1A1820`, `#120F16`) with a faint crimson-tinted cloud (`#3A1A22`) at low opacity so the aurora reads warm rather than gray.
- `--primary` → crimson, `--primary-foreground` → Cotton; `--ring` → crimson lift.
- Replace hardcoded `#F1FEC8` / `#cbdb9a` occurrences (work-row arrow gradient, hero orb, selection, wordmark gradients) with Cotton→crimson equivalents.
- `.hero-orb` conic gradient re-lit in cosmic ink with a single crimson quadrant and Cotton specular.
- `::selection` background → crimson, colour → Cotton.

**`src/components/ShaderBackground.tsx`**
- Shader ramp: `c0` near-black cosmic `#141219`, `c1` `#23212C`, `c2` plum-slate `#3A3446`, `c3` bloom → Cotton `#EDEBDE` (bloom weight kept at current strength).
- Add a low-weight crimson tint band (`#5A1520`) between `c2` and the bloom so highlights warm toward red before hitting cotton, instead of going neutral gray.
- Vignette and grain unchanged.

**Sections / components** (`src/routes/index.tsx`, section files, `AnimatedIcon.tsx`)
- Audit for any remaining vanilla-family literals and swap to tokens; icons inherit `currentColor` (Cotton) with crimson only on active/hover.

## Verification
- Re-run `bunx vitest run` (motion specs are colour-agnostic, should pass unchanged).
- Regenerate visual baselines with `test:visual:update`, since every baseline shifts with the recolour.
- Contrast check: Cotton on Cosmic ≈ 13:1 (AAA). Crimson `#8B1221` on Cosmic is only ~2:1, so crimson is never used for body text — only fills, rules, and glow, with Cotton text on top.
