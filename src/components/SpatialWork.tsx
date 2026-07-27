import { AnimatedIcon } from "./AnimatedIcon";
import { useSpatialPointer } from "./useSpatialPointer";

const SCENES = ["ledger", "vision", "pulse", "care"] as const;

/**
 * Per-project schematic: precise hairline vector plate, no glow blobs.
 * Drawn on a shared 240x120 grid so every card reads with identical rhythm.
 */
function WorkScene({ variant }: { variant: (typeof SCENES)[number] }) {
  return (
    <span className="wplate" data-scene={variant} aria-hidden>
      <svg className="wplate__svg" viewBox="0 0 240 120" fill="none" preserveAspectRatio="xMidYMid meet">
        <g className="wplate__grid" stroke="currentColor" strokeWidth="0.5">
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1="16" x2="224" y1={24 + i * 24} y2={24 + i * 24} />
          ))}
        </g>

        {variant === "ledger" && (
          <>
            <path
              className="wplate__area"
              d="M16 92 L64 74 L104 82 L148 48 L192 56 L224 30 L224 104 L16 104 Z"
            />
            <path className="wplate__draw" d="M16 92 L64 74 L104 82 L148 48 L192 56 L224 30" />
            {[[64, 74], [148, 48], [224, 30]].map(([x, y], i) => (
              <circle key={i} className="wplate__node" cx={x} cy={y} r="2.4" />
            ))}
          </>
        )}

        {variant === "vision" && (
          <>
            <path
              className="wplate__draw"
              d="M120 96 C 96 84 82 62 90 38 C 116 34 138 48 142 72 C 144 86 134 94 120 96 Z"
            />
            <path className="wplate__hair" d="M120 96 C 116 74 112 56 100 42" />
            <g className="wplate__reticle">
              <path d="M66 34 L66 22 L78 22" />
              <path d="M174 22 L186 22 L186 34" />
              <path d="M186 86 L186 98 L174 98" />
              <path d="M78 98 L66 98 L66 86" />
            </g>
            <line className="wplate__scan" x1="66" x2="186" y1="0" y2="0" />
          </>
        )}

        {variant === "pulse" && (
          <>
            <path className="wplate__hair" d="M32 84 L88 84 L112 56 L168 56" />
            <path className="wplate__hair" d="M112 56 L136 32 L208 32" />
            <path className="wplate__draw" d="M32 84 L88 84 L112 56 L168 56 L192 84 L208 84" />
            {[[32, 84], [88, 84], [112, 56], [136, 32], [168, 56], [208, 32]].map(([x, y], i) => (
              <circle key={i} className="wplate__node" cx={x} cy={y} r="3" style={{ animationDelay: `${i * 0.18}s` }} />
            ))}
          </>
        )}

        {variant === "care" && (
          <>
            <rect className="wplate__hair" x="24" y="22" width="76" height="76" rx="8" />
            {[0, 1, 2].map((r) =>
              [0, 1, 2, 3].map((c) => (
                <rect
                  key={`${r}-${c}`}
                  className={r === 1 && c === 2 ? "wplate__cell wplate__cell--on" : "wplate__cell"}
                  x={34 + c * 16}
                  y={38 + r * 18}
                  width="10"
                  height="10"
                  rx="2"
                />
              )),
            )}
            <path
              className="wplate__draw"
              d="M116 62 L140 62 L148 44 L160 82 L170 62 L216 62"
            />
          </>
        )}
      </svg>
      <span className="wplate__sheen" />
    </span>
  );
}

export type WorkItem = {
  title: string;
  desc: string;
  tag: string;
  year: string;
};

/** One depth-layered project pane with pointer tilt + glow trail. */
function WorkPane({ item, index }: { item: WorkItem; index: number }) {
  const { ref, onPointerMove, onPointerLeave } = useSpatialPointer<HTMLAnchorElement>(7);
  const depth = index % 2 === 0 ? "near" : "far";

  return (
    <a
      ref={ref}
      href="#contact"
      data-cursor="View"
      data-depth={depth}
      className="work-pane spatial-interactive"
      style={{ ["--pane-delay" as string]: `${index * 0.09}s` }}
      aria-label={`${item.title} — ${item.tag}, ${item.year}. Enquire about this project.`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onBlur={onPointerLeave}
    >
      <span className="work-pane__trail" aria-hidden />
      <span className="work-pane__inner">
        <span className="work-pane__top">
          <span className="work-pane__num">{String(index + 1).padStart(2, "0")}</span>
          <span className="work-pane__year unit">{item.year}</span>
        </span>

        <span className="work-pane__art" aria-hidden>
          <WorkScene variant={SCENES[index % SCENES.length]} />
        </span>

        <span className="work-pane__body">
          <span className="work-pane__title">{item.title}</span>
          <span className="body-sm mt-2 block">{item.desc}</span>
          <span className="mt-3 flex items-center justify-between gap-3">
            <span className="eyebrow">{item.tag}</span>
            <span className="work-pane__arrow" aria-hidden>
              <AnimatedIcon name="arrow" size={16} />
            </span>
          </span>
        </span>
      </span>
    </a>
  );
}

export function SpatialWork({ items }: { items: WorkItem[] }) {
  return (
    <ul className="work-panes">
      {items.map((w, i) => (
        <li key={w.title}>
          <WorkPane item={w} index={i} />
        </li>
      ))}
    </ul>
  );
}

export default SpatialWork;
