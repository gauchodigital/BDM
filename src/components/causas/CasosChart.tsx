"use client";

import { useEffect, useRef, useState } from "react";

type ChartRow = {
  label: string;
  pct: number;
  color: string;
};

export function CasosChart({
  title,
  rows,
}: {
  title: string;
  rows: readonly ChartRow[];
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
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="flex flex-col gap-4 rounded-[12px] border border-[#e2e8f0] bg-white p-4 shadow-[2px_2px_4px_rgba(51,51,51,0.15)]"
    >
      <h3 className="text-[15px] font-bold text-[#442748]">{title}</h3>
      <div className="flex flex-col gap-5">
        {rows.map((row, i) => (
          <div key={row.label} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[13px] font-medium text-[#442748]">
              <span>{row.label}</span>
              <span>{row.pct}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#e9eff5]">
              <div
                className="h-full rounded-full ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  width: active ? `${row.pct}%` : "0%",
                  backgroundColor: row.color,
                  transitionProperty: "width",
                  transitionDuration: "1600ms",
                  transitionDelay: active ? `${i * 140}ms` : "0ms",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
