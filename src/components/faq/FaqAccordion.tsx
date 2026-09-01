"use client";

import { useMemo, useState } from "react";
import { RichText } from "@/components/ui/RichText";
import { FAQ_CATEGORIES, type FaqData } from "@/lib/faqTypes";

function FaqQuestionList({
  items,
  openId,
  setOpenId,
  variant = "default",
}: {
  items: FaqData[];
  openId: string | null;
  setOpenId: (id: string | null) => void;
  variant?: "default" | "panel";
}) {
  const isPanel = variant === "panel";

  return (
    <div className={`flex flex-col ${isPanel ? "gap-3" : "gap-4"}`}>
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div
            key={item.id}
            className={`relative overflow-hidden bg-white transition-shadow duration-300 ${
              isPanel
                ? "rounded-[14px] shadow-[0_2px_10px_rgba(80,60,119,0.07)] hover:shadow-[0_4px_16px_rgba(80,60,119,0.1)]"
                : "rounded-xl border border-[#e2e8f0] shadow-[2px_2px_6px_rgba(54,50,118,0.1)]"
            } ${open && isPanel ? "shadow-[0_4px_20px_rgba(80,60,119,0.12)]" : ""}`}
          >
            {!isPanel ? (
              <span
                className={`absolute bottom-0 left-0 top-0 w-1.5 bg-[#A6C0D6] transition-opacity duration-300 ease-out ${
                  open ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden
              />
            ) : null}
            <button
              type="button"
              className={`flex w-full items-center justify-between gap-4 text-left transition-[padding] duration-300 ease-out ${
                isPanel ? "px-5 py-[18px]" : open ? "py-4 pl-5 pr-3" : "px-3 py-4"
              }`}
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : item.id)}
            >
              <span
                className={`leading-snug text-[#442748] ${
                  isPanel
                    ? "text-[15px] font-bold md:text-[16px]"
                    : "text-[15px] font-[900]"
                }`}
              >
                {item.question}
              </span>
              <span
                className={`material-symbols-outlined shrink-0 text-[22px] leading-none text-[#503c77] transition-transform duration-300 ease-out ${
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
                  className={`space-y-3 border-t border-[#E8E4EF] px-5 py-4 transition-opacity duration-300 ease-out ${
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
                            : "text-[14px] leading-[1.6] text-[#442748]/85"
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
  );
}

function CategoryPills({
  categories,
  activeCategory,
  onSelect,
  vertical = false,
}: {
  categories: { id: string; label: string }[];
  activeCategory: string;
  onSelect: (id: string) => void;
  vertical?: boolean;
}) {
  return (
    <div
      className={vertical ? "flex flex-col gap-2.5" : "flex flex-wrap gap-2"}
      role="tablist"
      aria-label="Categorías de preguntas frecuentes"
    >
      {categories.map((cat) => {
        const active = cat.id === activeCategory;
        return (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(cat.id)}
            className={`rounded-full px-5 py-3 text-[13px] font-bold leading-snug transition-all duration-200 ${
              vertical ? "w-full text-left" : ""
            } ${
              active
                ? "bg-primary text-white shadow-[0_4px_14px_rgba(80,60,119,0.28)]"
                : "border border-[#E2E8F0] bg-white text-[#7A7585] hover:border-primary/25 hover:text-primary"
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}

export function FaqAccordion({
  items,
  showCategories = true,
  showHeader = false,
}: {
  items: FaqData[];
  showCategories?: boolean;
  showHeader?: boolean;
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

  const selectCategory = (id: string) => {
    setActiveCategory(id);
    setOpenId(null);
  };

  const categoryLabel = (
    <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-accent">
      SELECCIONÁ UNA CATEGORÍA
    </p>
  );

  const pageHeader = showHeader ? (
    <>
      <h1 className="text-[28px] font-[900] leading-[1.12] text-primary md:text-[32px] lg:text-[38px] xl:text-[42px] xl:leading-[1.1]">
        Todo lo que necesitas saber sobre las vacunas y la meningitis
      </h1>
      <p className="mt-4 text-[15px] leading-[1.6] text-muted md:text-[16px]">
        Seleccioná una categoría para explorar las preguntas.
      </p>
    </>
  ) : null;

  if (!showCategories && !showHeader) {
    return (
      <FaqQuestionList
        items={filtered}
        openId={openId}
        setOpenId={setOpenId}
      />
    );
  }

  return (
    <>
      {/* Mobile */}
      <div className="lg:hidden">
        {pageHeader}
        {showCategories && categories.length > 0 ? (
          <div className={pageHeader ? "mt-8" : ""}>
            <div className="mb-4">{categoryLabel}</div>
            <CategoryPills
              categories={categories}
              activeCategory={activeCategory}
              onSelect={selectCategory}
            />
          </div>
        ) : null}
        <div className={showCategories && categories.length > 0 ? "mt-6" : ""}>
          <FaqQuestionList
            items={filtered}
            openId={openId}
            setOpenId={setOpenId}
          />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:grid lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start lg:gap-8 xl:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] xl:gap-10">
        <aside className="sticky top-24 pr-2">
          {pageHeader}
          {showCategories && categories.length > 0 ? (
            <div className="mt-8 xl:mt-10">
              <div className="mb-4">{categoryLabel}</div>
              <CategoryPills
                categories={categories}
                activeCategory={activeCategory}
                onSelect={selectCategory}
                vertical
              />
            </div>
          ) : null}
        </aside>

        <div
          key={activeCategory}
          className="animate-fade-up rounded-[20px] bg-[#F4F1F8] p-5 xl:rounded-[24px] xl:p-6"
          role="tabpanel"
        >
          <FaqQuestionList
            items={filtered}
            openId={openId}
            setOpenId={setOpenId}
            variant="panel"
          />
        </div>
      </div>
    </>
  );
}
