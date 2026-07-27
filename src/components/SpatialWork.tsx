import { AnimatedIcon } from "./AnimatedIcon";
import { useSpatialPointer } from "./useSpatialPointer";

const SCENES = ["ledger", "vision", "pulse", "care"] as const;

/** Per-project spatial diorama: floating depth planes over a perspective grid. */
function WorkScene({ variant }: { variant: (typeof SCENES)[number] }) {
  return (
    <span className="wscene" data-scene={variant} aria-hidden>
      <span className="wscene__grid" />
      <span className="wscene__glow" />
      <span className="wscene__stage">
        {variant === "ledger" && (
          <>
            <span className="wslab wslab--back" />
            <span className="wslab wslab--mid">
              <span className="wline" style={{ width: "62%" }} />
              <span className="wline" style={{ width: "38%" }} />
            </span>
            <span className="wslab wslab--front">
              <span className="wslab__row"><i /><i /><i /></span>
              <span className="wbeam" />
            </span>
          </>
        )}
        {variant === "vision" && (
          <>
            <span className="wslab wslab--back" />
            <span className="wframe">
              <span className="wframe__corner" />
              <span className="wscan" />
              <span className="wleaf" />
            </span>
            <span className="wtag wtag--a">98.2%</span>
          </>
        )}
        {variant === "pulse" && (
          <>
            <span className="worbit worbit--o1" />
            <span className="worbit worbit--o2" />
            <span className="wcore" />
            <span className="wnode wnode--n1" />
            <span className="wnode wnode--n2" />
            <span className="wnode wnode--n3" />
          </>
        )}
        {variant === "care" && (
          <>
            <span className="wslab wslab--back" />
            <span className="wphone">
              <span className="wphone__bar" />
              <span className="wpulse" />
            </span>
            <span className="wtag wtag--b">Booked</span>
          </>
        )}
      </span>
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
