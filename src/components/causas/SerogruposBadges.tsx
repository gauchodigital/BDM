"use client";

import { useEffect, useRef, useState } from "react";

const SIZE = 56;
const STROKE = 3;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

export function SerogruposBadges({
  letters,
  highlight,
}: {
  letters: readonly string[];
  highlight: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      setActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.4, rootMargin: "0px 0px -5% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex items-center justify-between gap-1">
      {letters.map((letter) => {
        const isHighlight = letter === highlight;
        const noRing = letter === "X";

        if (noRing) {
          return (
            <span
              key={letter}
              className="flex size-14 items-center justify-center text-[20px] font-black text-[#442748]"
            >
              {letter}
            </span>
          );
        }

        if (isHighlight) {
          return (
            <div
              key={letter}
              className="relative flex size-14 items-center justify-center"
            >
              <svg
                width={SIZE}
                height={SIZE}
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                className="absolute inset-0 -rotate-90"
                aria-hidden
              >
                <circle
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={R}
                  fill="none"
                  stroke="#DD876E"
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  strokeDasharray={C}
                  strokeDashoffset={active ? 0 : C}
                  style={{
                    transition: active
                      ? "stroke-dashoffset 1.4s cubic-bezier(0.22, 1, 0.36, 1)"
                      : "none",
                  }}
                />
              </svg>
              <span
                className="relative text-[20px] font-black text-[#DD876E] transition-opacity duration-500"
                style={{
                  opacity: active ? 1 : 0.35,
                  transitionDelay: active ? "400ms" : "0ms",
                }}
              >
                {letter}
              </span>
            </div>
          );
        }

        return (
          <div
            key={letter}
            className="flex size-14 items-center justify-center rounded-full border-[3px] border-solid border-[#442748] text-[20px] font-black text-[#442748]"
          >
            {letter}
          </div>
        );
      })}
    </div>
  );
}
