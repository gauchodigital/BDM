"use client";

import Link from "next/link";
import { EquipoGate } from "@/components/equipo/EquipoGate";

const CARDS = [
  {
    href: "/equipo/resumen",
    title: "Resumen para el equipo",
    desc: "Qué medimos, para qué sirve y dónde viven los datos (estilo entregable VSR).",
  },
  {
    href: "/equipo/datos",
    title: "Dashboard · datos en vivo",
    desc: "KPIs y charts de autotest, mapa y popups (Firestore).",
  },
  {
    href: "/equipo/eventos",
    title: "Catálogo de eventos",
    desc: "Lista de eventos bdm_* (GA4/GTM) y su equivalente en Firestore.",
  },
  {
    href: "/",
    title: "Ver el sitio",
    desc: "Abrir BastaDeMeningitis (público).",
  },
] as const;

export default function EquipoHomePage() {
  return (
    <EquipoGate>
      <div className="mx-auto max-w-[880px] px-6 py-10">
        <p className="m-0 mb-1 text-sm font-semibold uppercase tracking-wide text-[#6b6578]">
          Área interna
        </p>
        <h2 className="m-0 mb-2 text-[28px] font-extrabold text-[#3d2d5c]">
          ¿Qué necesitás?
        </h2>
        <p className="mb-8 max-w-xl text-[15px] text-[#6b6578]">
          Mismo rol que el portal VSR: acceso del equipo a medición y
          documentación. Login con Google (allowlist).
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="block rounded-[14px] border border-[#e8e4f0] bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,.05)] transition hover:border-[#503C77]/40 hover:shadow-[0_4px_16px_rgba(80,60,119,.12)]"
            >
              <h3 className="m-0 text-[17px] font-bold text-[#3d2d5c]">
                {card.title}
              </h3>
              <p className="mb-0 mt-2 text-[14px] leading-snug text-[#6b6578]">
                {card.desc}
              </p>
              <span className="mt-4 inline-block text-[13px] font-semibold text-[#503C77]">
                Abrir →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </EquipoGate>
  );
}
