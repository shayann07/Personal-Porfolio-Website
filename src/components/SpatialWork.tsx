import { AnimatedIcon } from "./AnimatedIcon";
import { useSpatialPointer } from "./useSpatialPointer";

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
          <span className="work-pane__year eyebrow">{item.year}</span>
        </span>

        <span className="work-pane__art" aria-hidden>
          <span className="work-pane__bars">
            {[42, 74, 55, 88, 63, 96].map((h, i) => (
              <i key={i} style={{ height: `${h}%`, animationDelay: `${i * 0.14}s` }} />
            ))}
          </span>
          <span className="work-pane__chip">
            <AnimatedIcon name="chip" size={16} />
          </span>
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
