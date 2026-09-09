"use client";

import { useState, type ReactNode } from "react";
import referencias from "../../../referencias-data.json";

const LINK_CLASS =
  "text-[#2E7D32] underline underline-offset-2";

function linkifyUrls(text: string, keyBase: number): ReactNode[] {
  const parts = text.split(/(https?:\/\/[^\s)]+)/g);
  const nodes: ReactNode[] = [];

  parts.forEach((part, i) => {
    if (!/^https?:\/\//.test(part)) {
      nodes.push(<span key={`${keyBase}-${i}`}>{part}</span>);
      return;
    }

    const href = part.replace(/[.,;:]+$/, "");
    const trail = part.slice(href.length);
    nodes.push(
      <a
        key={`${keyBase}-${i}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`break-all ${LINK_CLASS}`}
      >
        {href}
      </a>,
    );
    if (trail) {
      nodes.push(<span key={`${keyBase}-${i}-t`}>{trail}</span>);
    }
  });

  return nodes;
}

function linkify(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const md = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  let last = 0;
  let key = 0;
  let match: RegExpExecArray | null;
  while ((match = md.exec(text))) {
    if (match.index > last) {
      nodes.push(...linkifyUrls(text.slice(last, match.index), key));
      key += 50;
    }
    nodes.push(
      <a
        key={`md-${key++}`}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className={LINK_CLASS}
      >
        {match[1]}
      </a>,
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    nodes.push(...linkifyUrls(text.slice(last), key));
  }
  return nodes;
}

export function ReferencesAccordion() {
  const [open, setOpen] = useState(false);

  return (
    <section className="border-t border-[#D8D4DE] bg-[#F8F6FB]">
      <div className="mx-auto w-full max-w-7xl px-6 py-8 md:px-8 md:py-9">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full cursor-pointer items-center justify-between gap-4 text-left"
        >
          <span className="text-[17px] font-bold leading-tight text-[#503C77] md:text-[18px]">
            Referencias
          </span>
          <span
            className="material-symbols-outlined text-[22px] leading-none text-[#503C77]/70"
            aria-hidden
          >
            {open ? "remove" : "add"}
          </span>
        </button>

        {open && (
          <div className="mt-5 border-t border-[#E5E0EC] pt-5">
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
