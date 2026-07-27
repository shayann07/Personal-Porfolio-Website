import { memo, type ReactElement } from "react";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import {
  ArrowRight,
  ArrowDownToLine,
  Mail,
  Rocket,
  Download,
  ShieldCheck,
  Gauge,
  Orbit,
  Sparkles,
  Cpu,
  MapPin,
  Clock,
  Copy,
  Check,
  AlertCircle,
  Layers,
  type LucideIcon,
} from "lucide-react";

type GlyphProps = { size?: number; strokeWidth?: number; focusable?: boolean };

function GithubGlyph({ size = 20 }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
      <path d="M12 1.8a10.2 10.2 0 0 0-3.23 19.88c.51.09.7-.22.7-.49v-1.9c-2.84.62-3.44-1.2-3.44-1.2-.47-1.18-1.14-1.5-1.14-1.5-.93-.63.07-.62.07-.62 1.03.07 1.57 1.06 1.57 1.06.91 1.57 2.4 1.12 2.99.86.09-.66.36-1.12.65-1.38-2.27-.26-4.66-1.14-4.66-5.06 0-1.12.4-2.03 1.05-2.75-.1-.26-.46-1.3.1-2.71 0 0 .86-.28 2.81 1.05a9.7 9.7 0 0 1 5.12 0c1.95-1.33 2.8-1.05 2.8-1.05.57 1.41.21 2.45.11 2.71.66.72 1.05 1.63 1.05 2.75 0 3.93-2.4 4.79-4.68 5.05.37.32.7.94.7 1.9v2.82c0 .27.19.59.71.49A10.2 10.2 0 0 0 12 1.8Z" />
    </svg>
  );
}

function LinkedinGlyph({ size = 20 }: GlyphProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.83v1.64h.05A4.2 4.2 0 0 1 17.6 8.7c4.04 0 4.79 2.62 4.79 6.03V21h-4v-5.4c0-1.29-.02-2.95-1.83-2.95-1.84 0-2.12 1.4-2.12 2.85V21h-4V9Z" />
    </svg>
  );
}

export type IconName =
  | "arrow"
  | "download"
  | "mail"
  | "github"
  | "linkedin"
  | "rocket"
  | "installs"
  | "stability"
  | "perf"
  | "orbit"
  | "spark"
  | "chip"
  | "pin"
  | "clock"
  | "copy"
  | "check"
  | "alert"
  | "layers";

type Motion = "slide" | "bob" | "pulse" | "spin" | "none";

const MAP: Record<IconName, { icon: LucideIcon | ((p: GlyphProps) => ReactElement); motion: Motion }> = {
  arrow: { icon: ArrowRight, motion: "slide" },
  download: { icon: ArrowDownToLine, motion: "bob" },
  mail: { icon: Mail, motion: "none" },
  github: { icon: GithubGlyph, motion: "none" },
  linkedin: { icon: LinkedinGlyph, motion: "none" },
  rocket: { icon: Rocket, motion: "bob" },
  installs: { icon: Download, motion: "bob" },
  stability: { icon: ShieldCheck, motion: "pulse" },
  perf: { icon: Gauge, motion: "pulse" },
  orbit: { icon: Orbit, motion: "spin" },
  spark: { icon: Sparkles, motion: "pulse" },
  chip: { icon: Cpu, motion: "pulse" },
  pin: { icon: MapPin, motion: "none" },
  clock: { icon: Clock, motion: "none" },
  copy: { icon: Copy, motion: "none" },
  check: { icon: Check, motion: "none" },
  alert: { icon: AlertCircle, motion: "none" },
  layers: { icon: Layers, motion: "none" },
};

const EASE: Transition = { duration: 2.6, repeat: Infinity, ease: "easeInOut" };

export const Icon = memo(function Icon({
  name,
  size = 20,
  className = "",
  strokeWidth = 1.6,
}: {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  const reduce = useReducedMotion();
  const entry = MAP[name];
  if (!entry) return null;
  const Glyph = entry.icon;

  const idle =
    reduce || entry.motion === "none"
      ? undefined
      : entry.motion === "bob"
        ? { y: [0, -2.5, 0] }
        : entry.motion === "pulse"
          ? { opacity: [0.65, 1, 0.65], scale: [1, 1.06, 1] }
          : entry.motion === "spin"
            ? { rotate: 360 }
            : undefined;

  const transition: Transition | undefined =
    entry.motion === "spin" ? { duration: 16, repeat: Infinity, ease: "linear" } : EASE;

  return (
    <motion.span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: size, height: size, willChange: "transform" }}
      initial={reduce ? false : { opacity: 0, scale: 0.85 }}
      whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      animate={idle}
      transition={idle ? transition : { duration: 0.35, ease: "easeOut" }}
      variants={
        entry.motion === "slide" && !reduce ? { rest: { x: 0 }, hover: { x: 3 } } : undefined
      }
    >
      <Glyph size={size} strokeWidth={strokeWidth} focusable={false} />
    </motion.span>
  );
});