import { useCallback, useEffect, useRef } from "react";

/**
 * Shared spatial pointer helper: writes --px/--py (0..1 local pointer position)
 * and --rx/--ry (tilt in deg) onto the element with a single rAF-throttled
 * style write. Disabled for reduced-motion and coarse pointers.
 */
export function useSpatialPointer<T extends HTMLElement>(tilt = 6) {
  const ref = useRef<T>(null);
  const enabled = useRef(true);
  const raf = useRef(0);
  const next = useRef({ px: 0.5, py: 0.5 });

  const flush = useCallback(() => {
    raf.current = 0;
    const el = ref.current;
    if (!el) return;
    const { px, py } = next.current;
    el.style.setProperty("--px", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--py", `${(py * 100).toFixed(1)}%`);
    el.style.setProperty("--ry", `${((px - 0.5) * 2 * tilt).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${((py - 0.5) * -2 * tilt).toFixed(2)}deg`);
  }, [tilt]);

  useEffect(() => {
    enabled.current =
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      !window.matchMedia("(pointer: coarse)").matches;
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<T>) => {
      if (!enabled.current) return;
      const r = e.currentTarget.getBoundingClientRect();
      next.current = {
        px: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)),
        py: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height)),
      };
      if (!raf.current) raf.current = requestAnimationFrame(flush);
    },
    [flush],
  );

  const onPointerLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }, []);

  return { ref, onPointerMove, onPointerLeave };
}
