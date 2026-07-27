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
          <span className="spatial__sheen" />
          <div className="spatial__paneHead">
            <span className="spatial__label">latency</span>
            <span className="spatial__label spatial__label--dim">ms</span>
          </div>
          <div className="spatial__bars">
            {[38, 62, 44, 78, 56, 92, 70, 48].map((h, i) => (
              <span key={i} style={{ height: `${h}%`, animationDelay: `${i * 0.16}s` }} />
            ))}
          </div>
          <span className="spatial__baseline" />
        </div>

        {/* mid pane — module grid */}
        <div className="spatial__pane spatial__pane--mid">
          <span className="spatial__sheen" />
          <div className="spatial__grid">
            {Array.from({ length: 9 }).map((_, i) => (
              <span
                key={i}
                data-hot={i === 4 ? "" : undefined}
                style={{ animationDelay: `${i * 0.12}s` }}
              />
            ))}
          </div>
          <span className="spatial__scan" />
        </div>

        {/* front pane — the "card" */}
        <div className="spatial__pane spatial__pane--front">
          <span className="spatial__sheen" />
          <div className="spatial__row spatial__row--between">
            <span className="spatial__row">
              <span className="spatial__dot" />
              <span className="spatial__label">on-device</span>
            </span>
            <span className="spatial__icon spatial__icon--sm">
              <AnimatedIcon name="chip" size={18} />
            </span>
          </div>
          <div className="spatial__readout">
            <strong>18.4</strong>
            <span className="spatial__label">ms / frame</span>
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

/**
 * Secondary spatial cluster used beside body copy: shallower depth, same
 * liquid-glass language. Pointer parallax shares the rAF-throttled approach.
 */
export function SpatialCluster() {
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
      tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / window.innerWidth)) * 10;
      ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / window.innerHeight)) * -7;
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
    <div className="spatial-cluster" ref={ref} aria-hidden>
      <div className="spatial-cluster__scene">
        <span className="spatial-cluster__glow" />

        <div className="spatial-card spatial-card--a">
          <span className="spatial__label">years shipping</span>
          <strong className="spatial-card__num">04</strong>
          <div className="spatial-cluster__ticks">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        </div>

        <div className="spatial-card spatial-card--b">
          <span className="spatial-cluster__icon"><AnimatedIcon name="bolt" size={18} /></span>
          <div>
            <strong className="spatial-card__num spatial-card__num--sm">60fps</strong>
            <span className="spatial__label">mid-range target</span>
          </div>
        </div>

        <div className="spatial-card spatial-card--c">
          <span className="spatial__dot" />
          <span className="spatial__label">karachi · pkt</span>
        </div>

        <div className="spatial-card spatial-card--d">
          <AnimatedIcon name="layers" size={18} />
        </div>
      </div>
    </div>
  );
}