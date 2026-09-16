"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  TestimonioCategory,
  TestimonioData,
} from "@/lib/testimoniosData";

const TABS: { id: TestimonioCategory; label: string }[] = [
  { id: "medico", label: "Entrevistas a médicos" },
  { id: "paciente", label: "Testimonios de pacientes" },
];

function youtubeId(url: string): string | null {
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{6,})/,
  );
  return m?.[1] ?? null;
}

function thumbFor(item: TestimonioData): string | null {
  if (item.thumbnailSrc) return item.thumbnailSrc;
  const id = youtubeId(item.videoUrl);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}

function NameBadge({
  item,
  className = "",
}: {
  item: TestimonioData;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[10px] bg-white px-3.5 py-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.14)] ${className}`}
    >
      <p className="text-[13px] font-bold leading-snug text-[#DD876E] lg:text-[14px]">
        {item.name}
      </p>
    </div>
  );
}

function TestimonialsMobile({ items }: { items: TestimonioData[] }) {
  const [tab, setTab] = useState<TestimonioCategory>("medico");
  const [index, setIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollingRef = useRef(false);

  const filtered = useMemo(
    () => items.filter((t) => t.category === tab),
    [items, tab],
  );

  function goTo(next: number) {
    const el = trackRef.current;
    if (!el) return;
    scrollingRef.current = true;
    setIndex(next);
    const card = el.children[next] as HTMLElement | undefined;
    if (card) {
      el.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
    }
    window.setTimeout(() => {
      scrollingRef.current = false;
    }, 400);
  }

  useEffect(() => {
    setIndex(0);
    const el = trackRef.current;
    if (el) el.scrollTo({ left: 0 });
  }, [tab]);

  return (
    <div className="lg:hidden">
      <div
        role="tablist"
        className="flex w-full items-center gap-0.5 rounded-[10px] border border-[#503C77] bg-[#503C77] p-1"
      >
        {TABS.map((t) => {
          const active = t.id === tab;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={`flex min-w-0 flex-1 items-center justify-center whitespace-nowrap rounded-[8px] px-1.5 py-2 text-center text-[11px] leading-none transition-all duration-200 sm:flex-none sm:px-4 sm:py-1.5 sm:text-[13px] ${
                active
                  ? "bg-white font-bold text-[#503C77] shadow-[0_1px_4px_rgba(68,39,72,0.12)]"
                  : "font-medium text-white/85 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted">
          Pronto vas a poder ver los testimonios de esta categoría.
        </p>
      ) : (
        <div className="mt-6">
          <div
            ref={trackRef}
            className="flex touch-pan-x snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            onScroll={() => {
              if (scrollingRef.current) return;
              const el = trackRef.current;
              if (!el || !el.clientWidth) return;
              const children = Array.from(el.children) as HTMLElement[];
              let closest = 0;
              let minDist = Infinity;
              children.forEach((child, i) => {
                const dist = Math.abs(child.offsetLeft - el.scrollLeft);
                if (dist < minDist) {
                  minDist = dist;
                  closest = i;
                }
              });
              if (closest !== index) setIndex(closest);
            }}
          >
            {filtered.map((item) => {
              const thumb = thumbFor(item);
              return (
                <article
                  key={item.id}
                  className="relative w-[92%] min-w-[92%] shrink-0 snap-center overflow-hidden rounded-[12px] bg-black/30 shadow-[0_8px_24px_rgba(68,39,72,0.14)] sm:w-full sm:min-w-full"
                >
                  <div className="relative aspect-video">
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumb}
                        alt=""
                        draggable={false}
                        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[#5a3d62]" />
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                    {item.videoUrl ? (
                      <a
                        href={item.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-1/2 left-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#FF0000] text-white shadow-lg"
                        aria-label={`Ver video de ${item.name}`}
                      >
                        <span className="material-symbols-outlined text-[32px] leading-none">
                          play_arrow
                        </span>
                      </a>
                    ) : null}
                    <NameBadge
                      item={item}
                      className="pointer-events-none absolute bottom-3 left-3 z-10 max-w-[78%]"
                    />
                  </div>
                </article>
              );
            })}
          </div>

          {filtered.length > 1 ? (
            <div className="mt-5 flex items-center justify-center gap-2">
              {filtered.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Ver testimonio ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all ${
                    i === index
                      ? "h-2 w-2 bg-[#DD876E]"
                      : "h-1.5 w-1.5 bg-[#DD876E]/35"
                  }`}
                />
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

function TestimonialsDesktop({ items }: { items: TestimonioData[] }) {
  const [tab, setTab] = useState<TestimonioCategory>("medico");
  const [index, setIndex] = useState(0);

  const filtered = useMemo(
    () => items.filter((t) => t.category === tab),
    [items, tab],
  );

  useEffect(() => {
    setIndex(0);
  }, [tab]);

  const active = filtered[index] ?? filtered[0];
  const videoId = active ? youtubeId(active.videoUrl) : null;

  return (
    <div className="hidden lg:block">
      <div
        role="tablist"
        className="mx-auto inline-flex items-center gap-0.5 rounded-full bg-[#F0EDF5] p-1"
      >
        {TABS.map((t) => {
          const isActive = t.id === tab;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setTab(t.id)}
              className={`rounded-full px-4 py-1.5 text-[13px] transition-all duration-200 xl:px-5 ${
                isActive
                  ? "bg-white font-medium text-[#503C77] shadow-[0_1px_4px_rgba(68,39,72,0.08)]"
                  : "font-normal text-[#7A7585] hover:text-[#503C77]"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-[15px] text-muted">
          Pronto vas a poder ver los testimonios de esta categoría.
        </p>
      ) : active ? (
        <div className="mt-10 grid grid-cols-[minmax(0,1fr)_minmax(0,200px)] items-stretch gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,228px)] xl:gap-6">
          <article className="relative overflow-hidden rounded-[20px] bg-[#1a1228] shadow-[0_20px_56px_rgba(80,60,119,0.2)] ring-1 ring-[#7A78BB]/15">
            <div className="relative aspect-video w-full">
              {videoId ? (
                <iframe
                  key={`${tab}-${active.id}`}
                  src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
                  title={`Video de ${active.name}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[#503C77]/30">
                  <p className="text-sm font-medium text-white/80">
                    Video pendiente
                  </p>
                </div>
              )}
            </div>
          </article>

          <aside className="flex h-full min-h-0 flex-col gap-3">
            {filtered.map((item, i) => {
              const thumb = thumbFor(item);
              const selected = i === index;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Ver video de ${item.name}`}
                  className={`group flex min-h-0 flex-1 flex-col text-left transition-all duration-300 ${
                    selected ? "opacity-100" : "opacity-75 hover:opacity-100"
                  }`}
                >
                  <div
                    className={`relative min-h-0 flex-1 overflow-hidden rounded-[14px] transition-all duration-300 ${
                      selected
                        ? "shadow-[0_12px_28px_rgba(80,60,119,0.22)] ring-2 ring-[#7A78BB]"
                        : "shadow-[0_6px_18px_rgba(68,39,72,0.12)] ring-1 ring-[#E5E0EC] group-hover:ring-[#7A78BB]/50"
                    }`}
                  >
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumb}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[#5a3d62]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    {!selected ? (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="flex size-9 items-center justify-center rounded-full bg-[#FF0000] text-white shadow-lg xl:size-10">
                          <span className="material-symbols-outlined text-[20px] leading-none xl:text-[22px]">
                            play_arrow
                          </span>
                        </span>
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1.5 line-clamp-2 h-8 shrink-0 px-0.5 text-[11px] leading-snug xl:text-[12px]">
                    <span
                      className={`font-bold ${
                        selected ? "text-[#DD876E]" : "text-[#503C77]"
                      }`}
                    >
                      {item.name}
                    </span>
                  </p>
                </button>
              );
            })}
          </aside>
        </div>
      ) : null}
    </div>
  );
}

export function TestimonialsTabs({ items }: { items: TestimonioData[] }) {
  return (
    <>
      <TestimonialsMobile items={items} />
      <TestimonialsDesktop items={items} />
    </>
  );
}
