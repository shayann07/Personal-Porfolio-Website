import { useInView, UseInViewOptions } from "framer-motion";
import { useRef } from "react";

export const useScrollAnimation = (options?: UseInViewOptions) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.1,
    ...options,
  });

  return { ref, isInView };
};
