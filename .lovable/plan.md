## Plan: make the portfolio less text-heavy and more visually appealing

### Goal
Shift the page from text/card-heavy to a visual-first kinetic portfolio: fewer words, stronger visual hierarchy, more cinematic surfaces, and consistent premium styling.

### What I’ll change
1. **Rebuild the visual rhythm**
   - Reduce repeated section headings and explanatory paragraphs.
   - Turn sections into full-width visual scenes instead of many similar cards.
   - Keep only short, high-impact copy where it helps scanning.

2. **Upgrade the hero into a visual centerpiece**
   - Replace the current orb-card composition with a cleaner cinematic hero: large name/type treatment, layered glass panels, animated gradient mesh, depth rings, and compact status chips.
   - Keep it CSS/Framer-based, not the previous 3D/image approach.

3. **Redesign projects as visual case-study panels**
   - Make each project card feel like a product poster: abstract app-interface shapes, device silhouettes, signal lines, metrics, and minimal text.
   - Move descriptions into smaller reveal/hover states so the default view is visual.

4. **Compress supporting sections**
   - Merge or simplify text-heavy areas like story, lab, stack, and metrics.
   - Use visual dashboards, timelines, icon-like modules, and compact stats instead of long paragraphs and bullet lists.

5. **Create a cohesive gradient/glass system**
   - Add semantic design tokens for gradient accents, glass depth, glow, and visual panels in `src/styles.css`.
   - Remove scattered inline hardcoded visual styling where practical and replace it with reusable classes.

6. **Keep it mobile-safe**
   - Ensure all visual panels scale down cleanly.
   - Keep section heights compact and avoid oversized hero/card blocks on small screens.
   - Preserve readable contrast over the shader background.

### Technical approach
- Main implementation will be in `src/routes/index.tsx` and `src/styles.css`.
- Keep existing real portfolio data, but present less of it upfront.
- Keep `ShaderBackground` and `Cursor`, but tune the page components around them.
- Use Framer Motion only for GPU-friendly transforms/opacity; avoid layout-heavy animation.
- Maintain the existing metadata/head setup.