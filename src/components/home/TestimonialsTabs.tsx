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
    <div className="lg:grid lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:items-center lg:gap-14">
      {/* Figma: track púrpura, tab activo blanco con borde */}
      <div
        role="tablist"
        className="flex h-12 items-center gap-1 rounded-[12px] bg-[#503C77] p-1 lg:h-auto lg:flex-col lg:items-stretch lg:gap-2 lg:self-start lg:rounded-2xl lg:p-2"
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
              className={`flex h-full flex-1 items-center justify-center rounded-[10px] px-2 text-center leading-tight transition-colors lg:h-auto lg:flex-none lg:justify-start lg:px-5 lg:py-4 lg:text-left ${
                active
                  ? "border border-[#503C77] bg-white text-[13px] font-bold text-[#503C77] shadow-[0_1px_3px_rgba(68,39,72,0.12)] lg:text-[15px]"
                  : "text-[13px] font-normal text-white/75 hover:text-white/90 lg:text-[15px]"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted lg:mt-0">
          Pronto vas a poder ver los testimonios de esta categoría.
        </p>
      ) : (
        <div className="lg:min-w-0">
          <div className="relative mt-6 lg:mt-0">
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
                      ) : (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                          <span className="rounded-full bg-black/50 px-4 py-2 text-[12px] font-semibold text-white/80">
                            Video pendiente
                          </span>
                        </div>
                      )}

                      {/* Badge nombre — Figma: blanco, nombre coral + rol */}
                      <div className="pointer-events-none absolute bottom-3 left-3 z-10 max-w-[78%] rounded-[8px] bg-white px-3 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.18)]">
                        <p className="text-[13px] font-bold leading-snug text-[#DD876E]">
                          {item.name}
                          <span className="font-normal text-[#5C5670]">
                            {" "}
                            | {item.role}
                          </span>
                        </p>
                      </div>

                      {item.videoUrl ? (
                        <a
                          href={item.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded bg-black/70 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-sm"
                          aria-label="Mirar en YouTube"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-3.5 w-3.5 fill-[#FF0000]"
                            aria-hidden
                          >
                            <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.75 15.5v-7l6.5 3.5-6.5 3.5z" />
                          </svg>
                          Mirar en YouTube
                        </a>
                      ) : null}
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
                      : "h-1.5 w-1.5 bg-[#DD876E]/35"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
