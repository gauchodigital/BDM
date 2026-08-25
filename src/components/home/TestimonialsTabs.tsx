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

export function TestimonialsTabs({ items }: { items: TestimonioData[] }) {
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
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
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
    <div>
      <div
        role="tablist"
        className="flex h-12 items-center gap-1 rounded-[10px] bg-[#503C77] p-1"
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
              className={`flex h-full flex-1 items-center justify-center rounded-[10px] px-2 text-center leading-tight transition-colors ${
                active
                  ? "bg-white text-[13px] font-bold text-[#442748]"
                  : "text-[11px] font-normal text-white/65 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 text-center text-sm text-white/70">
          Pronto vas a poder ver los testimonios de esta categoría.
        </p>
      ) : (
        <>
          <div className="relative mt-6">
            <div
              ref={trackRef}
              className="flex touch-pan-x snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              onScroll={() => {
                if (scrollingRef.current) return;
                const el = trackRef.current;
                if (!el || !el.clientWidth) return;
                const next = Math.round(el.scrollLeft / el.clientWidth);
                const clamped = Math.max(0, Math.min(next, filtered.length - 1));
                if (clamped !== index) setIndex(clamped);
              }}
            >
              {filtered.map((item) => {
                const thumb = thumbFor(item);
                return (
                  <article
                    key={item.id}
                    className="relative w-full min-w-full shrink-0 snap-center overflow-hidden rounded-[10px] bg-black/30"
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
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

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
                      ) : (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                          <span className="rounded-full bg-black/50 px-4 py-2 text-[12px] font-semibold text-white/80">
                            Video pendiente
                          </span>
                        </div>
                      )}

                      <div className="pointer-events-none absolute bottom-4 left-4 z-10 max-w-[75%] overflow-hidden rounded-[8px] border-l-4 border-accent bg-white px-3 py-2 shadow-md">
                        <p className="text-[14px] font-bold leading-tight text-accent">
                          {item.name}
                        </p>
                        <p className="mt-0.5 text-[12px] leading-tight text-dark">
                          {item.role}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {filtered.length > 1 && (
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
                      : "h-1.5 w-1.5 bg-white"
                  }`}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
