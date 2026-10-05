"use client";

import Image from "next/image";
import { useState } from "react";
import { VIDEO_CONCIENTIZACION_ID } from "@/lib/siteLinks";
import { TRACK } from "@/lib/analytics";
import { Reveal } from "@/components/ui/Reveal";

export function VideoKnowSection() {
  const [playing, setPlaying] = useState(false);
  const thumb = `https://i.ytimg.com/vi/${VIDEO_CONCIENTIZACION_ID}/hqdefault.jpg`;
  const embedSrc = `https://www.youtube.com/embed/${VIDEO_CONCIENTIZACION_ID}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <section className="bg-light">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-8 md:py-12 lg:py-10">
        <div className="md:grid md:grid-cols-[1fr_1.35fr] md:items-center md:gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          <Reveal>
            <h2 className="text-[20px] font-extrabold leading-tight text-primary md:text-[28px] lg:text-[36px] lg:leading-[1.15]">
              Todo lo que tenés que saber
            </h2>
          </Reveal>

          <Reveal delay={100} className="mt-6 md:mt-0">
            <div className="overflow-hidden rounded-2xl bg-black shadow-md">
              <div className="relative aspect-video">
                {playing ? (
                  <iframe
                    title="Video: Meningitis — Todo lo que tenés que saber"
                    src={embedSrc}
                    className="absolute inset-0 h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setPlaying(true)}
                    data-track={TRACK.events.videoClick}
                    data-location="que-es-video"
                    className={`${TRACK.ctaClass} group absolute inset-0 block w-full cursor-pointer`}
                    aria-label="Reproducir video: Todo lo que tenés que saber"
                  >
                    <Image
                      src={thumb}
                      alt="Video: Meningitis — Todo lo que tenés que saber"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 40rem"
                    />
                    <span className="absolute inset-0 bg-black/25 transition group-hover:bg-black/35" />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/80 text-white shadow-lg transition group-hover:scale-105">
                        <span className="material-symbols-outlined text-3xl">
                          play_arrow
                        </span>
                      </span>
                    </span>
                  </button>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
