"use client";

import { useState, type ReactNode } from "react";
import referencias from "../../../referencias-data.json";

function linkify(text: string): ReactNode[] {
  const parts = text.split(/(https?:\/\/[^\s)]+)/g);
  return parts.map((part, i) => {
    if (/^https?:\/\//.test(part)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all text-[#2E7D32] underline underline-offset-2"
        >
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function ReferencesAccordion() {
  const [open, setOpen] = useState(false);

  return (
    <section className="bg-white">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-8">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-[108px] w-full items-center justify-between gap-4 py-6 text-left md:px-2"
        >
          <span className="text-[22px] font-bold leading-[28px] text-[#442748]">
            Referencias
          </span>
          <span
            className="material-symbols-outlined text-[22px] leading-none text-[#442748]"
            aria-hidden
          >
            {open ? "remove" : "add"}
          </span>
        </button>

        {open && (
          <div className="border-t border-[#E5E5E5] pb-6 pt-4">
            <ol className="list-decimal space-y-4 pl-5 text-[13px] leading-[1.55] text-[#5C5670]">
              {(referencias as string[]).map((ref, i) => (
                <li key={i} className="pl-1">
                  {linkify(ref)}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}
