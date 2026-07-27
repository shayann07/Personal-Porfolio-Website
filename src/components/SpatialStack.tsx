import { useEffect, useRef } from "react";
import { AnimatedIcon } from "./AnimatedIcon";

/**
 * Spatial UI: a visionOS-style stack of floating glass panes rendered in real
 * 3D perspective. Panes sit at different Z depths and respond to pointer with
 * a single rAF-throttled transform write on the scene root (no per-pane state).
 */
export function SpatialStack() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
      const ny = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
      tx = Math.max(-1, Math.min(1, nx)) * 14;
      ty = Math.max(-1, Math.min(1, ny)) * -10;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const apply = () => {
      raf = 0;
      el.style.setProperty("--ry", `${tx.toFixed(2)}deg`);
      el.style.setProperty("--rx", `${ty.toFixed(2)}deg`);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="spatial" ref={ref} aria-hidden>
      <div className="spatial__scene">
        {/* deepest: ambient light field */}
        <span className="spatial__glow" />

        {/* back pane — signal graph */}
        <div className="spatial__pane spatial__pane--back">
          <div className="spatial__bars">
            {[38, 62, 44, 78, 56, 92, 70].map((h, i) => (
              <span key={i} style={{ height: `${h}%`, animationDelay: `${i * 0.18}s` }} />
            ))}
          </div>
        </div>

        {/* mid pane — module grid */}
        <div className="spatial__pane spatial__pane--mid">
          <div className="spatial__grid">
            {Array.from({ length: 9 }).map((_, i) => (
              <span key={i} style={{ animationDelay: `${i * 0.12}s` }} />
            ))}
          </div>
        </div>

        {/* front pane — the "card" */}
        <div className="spatial__pane spatial__pane--front">
          <div className="spatial__row">
            <span className="spatial__dot" />
            <span className="spatial__label">on-device</span>
          </div>
          <div className="spatial__icon">
            <AnimatedIcon name="chip" size={26} />
          </div>
          <div className="spatial__meter"><i /></div>
        </div>

        {/* floating satellite chip */}
        <div className="spatial__pane spatial__pane--chip">
          <AnimatedIcon name="spark" size={16} />
        </div>
      </div>
    </div>
  );
}

export default SpatialStack;