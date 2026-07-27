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

        <span className="spatial-cluster__rule" />

        <div className="spatial-slab">
          <span className="spatial__sheen" />
          <div className="spatial-slab__head">
            <span className="spatial__dot" />
            <span className="spatial__label">runtime</span>
          </div>
          <div className="spatial-slab__wave">
            {Array.from({ length: 22 }).map((_, i) => (
              <span key={i} style={{ animationDelay: `${i * 0.07}s` }} />
            ))}
          </div>
          <ul className="spatial-slab__rows">
            {["kotlin · compose", "flutter · dart", "tflite · edge"].map((t, i) => (
              <li key={t} style={{ animationDelay: `${i * 0.9}s` }}>
                <i />
                <span className="spatial__label">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="spatial-gauge">
          <svg viewBox="0 0 100 100" aria-hidden>
            <circle className="spatial-gauge__track" cx="50" cy="50" r="42" />
            <circle className="spatial-gauge__arc" cx="50" cy="50" r="42" />
          </svg>
          <div className="spatial-gauge__mid">
            <strong>60</strong>
            <span className="spatial__label">fps</span>
          </div>
        </div>

        <div className="spatial-tag">
          <span className="spatial__dot" />
          <span className="spatial__label">karachi · pkt</span>
        </div>

        <div className="spatial-chipfloat">
          <AnimatedIcon name="layers" size={18} />
        </div>
      </div>
    </div>
  );
}