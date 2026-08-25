"use client";

import { useMemo, useState } from "react";
import { FAQ_CATEGORIES, type FaqData } from "@/lib/faqTypes";

export function FaqAccordion({
  items,
  showCategories = true,
}: {
  items: FaqData[];
  showCategories?: boolean;
}) {
  const categories = useMemo(() => {
    const present = new Set(items.map((i) => i.category));
    const known = FAQ_CATEGORIES.filter((c) => present.has(c.id));
    const extra = [...present]
      .filter((id) => !FAQ_CATEGORIES.some((c) => c.id === id))
      .map((id) => ({ id, label: id }));
    return [...known, ...extra];
  }, [items]);

  const defaultCategory =
    categories.find((c) => c.id === "que-son")?.id ?? categories[0]?.id ?? "";
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = showCategories
    ? items.filter((i) => i.category === activeCategory)
    : items;

  return (
    <div>
      {showCategories && categories.length > 0 ? (
        <>
          <p className="mb-4 text-[11px] font-extrabold uppercase leading-[16.8px] tracking-[1.3px] text-[#dd876e]">
            SELECCIONÁ UNA CATEGORÍA
          </p>
          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((cat) => {
              const active = cat.id === activeCategory;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setOpenId(null);
                  }}
                  className={`rounded-[99px] px-5 py-3 text-[13px] font-bold transition ${
                    active
                      ? "bg-[#503c77] text-white shadow-[4px_2px_4px_rgba(0,0,0,0.25)]"
                      : "border border-[#e2e8f0] bg-white text-[rgba(26,10,46,0.45)] hover:border-[#503c77]/30"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </>
      ) : null}

      <div className="flex flex-col gap-4">
        {filtered.map((item) => {
          const open = openId === item.id;
          return (
            <div
              key={item.id}
              className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-[2px_2px_0_rgba(92,82,184,0.15)]"
            >
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 px-3 py-4 text-left"
                aria-expanded={open}
                onClick={() => setOpenId(open ? null : item.id)}
              >
                <span className="text-[15px] font-bold leading-6 text-[#442748]">
                  {item.question}
                </span>
                <span
                  className="material-symbols-outlined shrink-0 text-[20px] leading-none text-[#503c77]"
                  aria-hidden
                >
                  {open ? "remove" : "add"}
                </span>
              </button>
              {open ? (
                <p className="border-t border-[#e2e8f0] px-3 pb-4 pt-3 text-[15px] leading-6 text-[#442748]/85 animate-fade-in">
                  {item.answer}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
