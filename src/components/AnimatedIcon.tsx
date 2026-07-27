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
          {/* core */}
          <circle cx="12" cy="12" r="2.25" fill="currentColor" fillOpacity="0.18" />
          <circle cx="12" cy="12" r="2.25" />
          {/* two tilted orbital rings */}
          <motion.g
            style={{ transformOrigin: "12px 12px" }}
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 16, repeat: loop, ease: "linear" }}
          >
            <ellipse cx="12" cy="12" rx="9.25" ry="4" transform="rotate(-24 12 12)" opacity="0.85" />
            <ellipse cx="12" cy="12" rx="9.25" ry="4" transform="rotate(56 12 12)" opacity="0.4" />
          </motion.g>
          {/* satellite travelling the primary ring */}
          <motion.g
            style={{ transformOrigin: "12px 12px" }}
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 6, repeat: loop, ease: "linear" }}
          >
            <circle cx="20.45" cy="8.24" r="1.5" fill="currentColor" stroke="none" />
          </motion.g>
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
