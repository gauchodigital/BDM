"use client";

import { useState } from "react";
import { BACTERIANA } from "@/lib/bacterianaContent";

export function BacterianaSintomas() {
  const { sintomas } = BACTERIANA;
  const [activeId, setActiveId] = useState<string>(sintomas.categories[0].id);
  const active =
    sintomas.categories.find((c) => c.id === activeId) ??
    sintomas.categories[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max flex-nowrap items-center gap-1.5 pb-1">
          {sintomas.categories.map((cat) => {
            const selected = cat.id === activeId;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveId(cat.id)}
                className={`shrink-0 whitespace-nowrap rounded-[99px] px-4 py-3 text-[13px] font-bold transition ${
                  selected
                    ? "bg-[#503c77] text-white shadow-[4px_2px_4px_rgba(0,0,0,0.25)]"
                    : "border border-[#e2e8f0] bg-white text-[rgba(26,10,46,0.45)]"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-2.5">
        {active.items.map((item) => (
          <li
            key={item.label}
            className="flex min-h-[72px] items-center gap-2 rounded-[12px] border border-[#a6c0d6] bg-white px-3 py-4"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.icon}
              alt=""
              width={28}
              height={28}
              className="size-7 shrink-0"
            />
            <span className="text-left text-[13px] font-bold leading-snug text-[#442748]">
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
