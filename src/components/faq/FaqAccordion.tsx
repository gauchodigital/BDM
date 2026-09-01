"use client";

import { useMemo, useState } from "react";
import { RichText } from "@/components/ui/RichText";
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
              className="relative overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-[2px_2px_6px_rgba(54,50,118,0.1)]"
            >
              <span
                className={`absolute bottom-0 left-0 top-0 w-1.5 bg-[#A6C0D6] transition-opacity duration-300 ease-out ${
                  open ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden
              />
              <button
                type="button"
                className={`flex w-full items-start justify-between gap-3 py-4 text-left transition-[padding] duration-300 ease-out ${
                  open ? "pl-5 pr-3" : "px-3"
                }`}
                aria-expanded={open}
                onClick={() => setOpenId(open ? null : item.id)}
              >
                <span className="text-[15px] font-[900] leading-snug text-[#442748]">
                  {item.question}
                </span>
                <span
                  className={`material-symbols-outlined mt-0.5 shrink-0 text-[20px] leading-none text-[#503c77] transition-transform duration-300 ease-out ${
                    open ? "rotate-45" : "rotate-0"
                  }`}
                  aria-hidden
                >
                  add
                </span>
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
                aria-hidden={!open}
              >
                <div className="min-h-0 overflow-hidden">
                  <div
                    className={`space-y-3 border-t border-[#e2e8f0] py-4 pl-5 pr-3 transition-opacity duration-300 ease-out ${
                      open ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {item.answer.split(/\n\n+/).map((block) => {
                      const lines = block.split("\n").filter(Boolean);
                      const isList = lines.every((l) =>
                        l.trim().startsWith("- "),
                      );
                      if (isList) {
                        return (
                          <ul
                            key={block.slice(0, 40)}
                            className="list-disc space-y-1 pl-5 text-[14px] leading-[1.55] text-[#442748]/85"
                          >
                            {lines.map((l) => (
                              <li key={l}>{l.replace(/^\-\s*/, "")}</li>
                            ))}
                          </ul>
                        );
                      }
                      return (
                        <p
                          key={block.slice(0, 48)}
                          className={
                            block.trimStart().startsWith("*")
                              ? "text-[12px] italic leading-[1.5] text-[#442748]/70"
                              : "text-[14px] leading-[1.55] text-[#442748]/85"
                          }
                        >
                          <RichText text={block} />
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
