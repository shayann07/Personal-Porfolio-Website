import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Props = { name: string; className?: string; size?: number };

export const AnimatedIcon = memo(function AnimatedIcon({ name, className = "", size = 20 }: Props) {
  const reduce = useReducedMotion();
  const stroke = "currentColor";
  const sw = 1.6;
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke,
    strokeWidth: sw,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
    focusable: false,
  };
  const loop = reduce ? 0 : Infinity;

  switch (name) {
    case "arrow":
      return (
        <svg {...common}>
          <motion.path d="M5 12h14" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
          <motion.path d="M13 6l6 6-6 6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.3 }} />
        </svg>
      );
    case "spark":
      return (
        <svg {...common}>
          <motion.path
            d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M19 5l-4 4M9 15l-4 4"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2.4, repeat: loop }}
          />
        </svg>
      );
    case "gear":
      return (
      <motion.svg {...common} animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 18, repeat: loop, ease: "linear" }}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" />
        </motion.svg>
      );
    case "bolt":
      return (
        <svg {...common}>
          <motion.path
            d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"
            fill="currentColor"
            fillOpacity="0.15"
            initial={{ scale: 0.9 }}
            animate={{ scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 2, repeat: loop }}
          />
        </svg>
      );
    case "orbit":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
          <motion.circle
            cx="12" cy="12" r="7.5"
            opacity="0.45"
            animate={reduce ? undefined : { opacity: [0.2, 0.55, 0.2] }}
            transition={{ duration: 3, repeat: loop, ease: "easeInOut" }}
          />
          <motion.g
            style={{ transformOrigin: "12px 12px" }}
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 8, repeat: loop, ease: "linear" }}
          >
            <circle cx="19.5" cy="12" r="1.6" fill="currentColor" stroke="none" />
          </motion.g>
        </svg>
      );
    case "download":
      return (
        <svg {...common}>
          <motion.path
            d="M12 3v10"
            animate={reduce ? undefined : { y: [0, 2, 0] }}
            transition={{ duration: 1.8, repeat: loop, ease: "easeInOut" }}
          />
          <motion.path
            d="M8 9.5l4 4 4-4"
            animate={reduce ? undefined : { y: [0, 2, 0] }}
            transition={{ duration: 1.8, repeat: loop, ease: "easeInOut" }}
          />
          <path d="M4 17.5v1.5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1.5" opacity="0.7" />
        </svg>
      );
    case "layers":
      return (
        <svg {...common}>
          <motion.path
            d="M12 3l8 4.5-8 4.5-8-4.5L12 3z"
            fill="currentColor" fillOpacity="0.16"
            animate={reduce ? undefined : { y: [0, -1.2, 0] }}
            transition={{ duration: 3, repeat: loop, ease: "easeInOut" }}
          />
          <motion.path d="M4 12l8 4.5 8-4.5" opacity="0.75" animate={reduce ? undefined : { y: [0, 1, 0] }} transition={{ duration: 3, repeat: loop, ease: "easeInOut", delay: 0.2 }} />
          <motion.path d="M4 16.5L12 21l8-4.5" opacity="0.45" animate={reduce ? undefined : { y: [0, 1.6, 0] }} transition={{ duration: 3, repeat: loop, ease: "easeInOut", delay: 0.4 }} />
        </svg>
      );
    case "wave":
      return (
        <svg {...common}>
          <motion.path
            d="M2 12c2.5-5 5-5 7.5 0s5 5 7.5 0 5-5 5 0"
            animate={reduce ? undefined : { x: [0, -5, 0] }}
            transition={{ duration: 3.2, repeat: loop, ease: "easeInOut" }}
          />
          <motion.path
            d="M2 17c2.5-4 5-4 7.5 0s5 4 7.5 0 5-4 5 0"
            opacity="0.45"
            animate={reduce ? undefined : { x: [0, 5, 0] }}
            transition={{ duration: 3.8, repeat: loop, ease: "easeInOut" }}
          />
        </svg>
      );
    case "chip":
      return (
        <svg {...common}>
          <rect x="7" y="7" width="10" height="10" rx="2.5" fill="currentColor" fillOpacity="0.14" />
          <motion.rect
            x="10.25" y="10.25" width="3.5" height="3.5" rx="1" fill="currentColor" stroke="none"
            animate={reduce ? undefined : { opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 2, repeat: loop, ease: "easeInOut" }}
          />
          <path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4" opacity="0.65" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <motion.rect x="3" y="5" width="18" height="14" rx="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
          <motion.path d="M3 7l9 6 9-6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.3 }} />
        </svg>
      );
    case "github":
      return (
        <svg {...common}>
          <path d="M9 19c-4 1.5-4-2-6-2m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C7.7 4 6.7 4.3 6.7 4.3a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 5.3 10.7c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V22" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 1 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    case "plus":
      return (
        <motion.svg {...common} whileHover={{ rotate: 90 }} transition={{ duration: 0.4 }}>
          <path d="M12 5v14M5 12h14" />
        </motion.svg>
      );
    default:
      return null;
  }
});
