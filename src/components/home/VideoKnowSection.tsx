import Image from "next/image";
import {
  VIDEO_CONCIENTIZACION_URL,
  VIDEO_CONCIENTIZACION_ID,
  CENTROS_VACUNACION_URL,
} from "@/lib/siteLinks";
import { TRACK } from "@/lib/analytics";
import { Button } from "@/components/ui/Button";

/**
 * Dos bloques apilados y pegados (como en Figma):
 * 1) Celeste — título + video
 * 2) Violeta — ¿Dónde me vacuno?
 */
export function VideoKnowSection() {
  const thumb = `https://i.ytimg.com/vi/${VIDEO_CONCIENTIZACION_ID}/hqdefault.jpg`;

  return (
    <div className="flex flex-col">
      {/* Bloque 1 — Todo lo que tenés que saber */}
      <section className="bg-light">
        <div className="mx-auto max-w-6xl px-6 py-10 md:px-8 md:py-14">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-[20px] font-extrabold leading-tight text-primary">
              Todo lo que tenés que saber
            </h2>

            <a
              href={VIDEO_CONCIENTIZACION_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-track={TRACK.events.videoClick}
              data-location="que-es-video"
              className={`${TRACK.ctaClass} group relative mt-6 block overflow-hidden rounded-2xl bg-black shadow-md transition hover:shadow-lg`}
            >
              <div className="relative aspect-video">
                <Image
                  src={thumb}
                  alt="Video: Meningitis — Todo lo que tenés que saber"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 42rem"
                />
                <span className="absolute inset-0 bg-black/25 transition group-hover:bg-black/35" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/80 text-white shadow-lg transition group-hover:scale-105">
                    <span className="material-symbols-outlined text-3xl">
                      play_arrow
                    </span>
                  </span>
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Bloque 2 — ¿Dónde me vacuno? */}
      <section className="bg-primary">
        <div className="mx-auto max-w-6xl px-6 py-10 md:px-8 md:py-14">
          <div className="mx-auto max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
              ¿Dónde me vacuno?
            </p>
            <h2 className="mt-3 text-[28px] font-extrabold leading-[1.15] !text-white">
              Encontrá tu centro de vacunación
            </h2>
            <p className="mt-4 text-[15px] leading-[1.6] text-white/85 md:text-base">
              Buscá el vacunatorio más cercano según tu ubicación.
            </p>
            <Button
              href={CENTROS_VACUNACION_URL}
              variant="onPrimary"
              className="mt-8 w-full !rounded-[10px] !py-3.5 text-[15px] font-bold"
              trackEvent={TRACK.events.vacunarseClick}
              trackLocation="vacunatorios-cta"
            >
              Ver centros disponibles
              <span aria-hidden className="text-lg leading-none">
                →
              </span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
