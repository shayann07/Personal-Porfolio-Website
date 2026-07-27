import { memo } from "react";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import {
  ArrowRight,
  ArrowDownToLine,
  Mail,
  Github,
  Linkedin,
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

const MAP: Record<IconName, { icon: LucideIcon; motion: Motion }> = {
  arrow: { icon: ArrowRight, motion: "slide" },
  download: { icon: ArrowDownToLine, motion: "bob" },
  mail: { icon: Mail, motion: "none" },
  github: { icon: Github, motion: "none" },
  linkedin: { icon: Linkedin, motion: "none" },
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
      <Glyph size={size} strokeWidth={strokeWidth} absoluteStrokeWidth focusable={false} />
    </motion.span>
  );
});