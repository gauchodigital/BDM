"use client";

import Link from "next/link";
import { EquipoGate } from "@/components/equipo/EquipoGate";

export default function EquipoEventosPage() {
  return (
    <EquipoGate>
      <div className="flex h-[calc(100vh-64px)] flex-col">
        <div className="flex items-center gap-3 border-b border-[#e8e4f0] bg-white px-5 py-2.5">
          <Link
            href="/equipo"
            className="text-[13px] font-semibold text-[#503C77] underline"
          >
            ← Portal
          </Link>
          <span className="text-[13px] text-[#6b6578]">
            Catálogo de eventos · también en{" "}
            <code className="text-xs">docs/Eventos-medicion-BDM.html</code>
          </span>
        </div>
        <iframe
          title="Eventos de medición BDM"
          src="/equipo/eventos.html"
          className="min-h-0 w-full flex-1 border-0 bg-white"
        />
      </div>
    </EquipoGate>
  );
}
