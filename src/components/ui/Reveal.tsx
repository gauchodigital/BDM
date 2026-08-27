"use client";

import {
  type ElementType,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

interface RevealProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** Retardo en ms para escalonar apariciones (stagger). */
  delay?: number;
  /** Dirección de entrada. */
  from?: "up" | "left" | "right" | "none";
}

const offsets: Record<NonNullable<RevealProps["from"]>, string> = {
  up: "translate-y-6",
  left: "-translate-x-6",
  right: "translate-x-6",
  none: "",
};

/**
 * Reveal al scroll (fade + slide). Una sola vez. Respeta prefers-reduced-motion.
 */
export function Reveal({
  as: Tag = "div",
  children,
  className = "",
  delay = 0,
  from = "up",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
      className={`transition-all duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
        shown
          ? "translate-x-0 translate-y-0 opacity-100"
          : `opacity-0 ${offsets[from]}`
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
