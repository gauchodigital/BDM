"use client";

import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

/** Section wrapper with scroll reveal — same motion language as home. */
export function RevealSection({
  children,
  className = "",
  id,
  delay = 0,
  from = "up",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
  from?: "up" | "left" | "right" | "none";
}) {
  return (
    <section id={id} className={className}>
      <Reveal delay={delay} from={from}>
        {children}
      </Reveal>
    </section>
  );
}
