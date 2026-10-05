"use client";

import Link from "next/link";
import { EquipoGate } from "@/components/equipo/EquipoGate";

export default function EquipoResumenPage() {
  return (
    <EquipoGate>
      <div className="mx-auto max-w-[820px] px-6 py-8">
        <Link
          href="/equipo"
          className="text-[13px] font-semibold text-[#503C77] underline"
        >
          ← Portal
        </Link>

        <h2 className="mt-4 mb-2 text-[28px] font-extrabold text-[#3d2d5c]">
          Resumen · medición BDM
        </h2>
        <p className="mb-8 text-[15px] text-[#6b6578]">
          Equivalente al entregable de Virus VSR, adaptado a BastaDeMeningitis.
        </p>

        <Section title="1) El punto de partida">
          <p>
            El sitio tenía GTM/GA/Meta genéricos, pero el autotest, el mapa y los
            popups <strong>no registraban funnels de producto</strong>. La
            medición útil (pasos, abandono, provincias, respuestas) no existía
            en un dashboard propio.
          </p>
        </Section>

        <Section title="2) Lo que hicimos">
          <p className="font-semibold text-[#3d2d5c]">a. Medición de producto</p>
          <p>
            Instrumentamos autotest, mapa de vacunatorios y los 2 popups
            (campaña + pediatra). Cada acción se guarda en Firestore y se
            dispara a GA4/GTM con nombres <code>bdm_*</code> (paridad con el
            catálogo <code>vsr_*</code>).
          </p>
          <p className="mt-3 font-semibold text-[#3d2d5c]">
            b. Google Tag Manager / GA4 / Meta
          </p>
          <p>
            IDs en el sitio: GTM <code>GTM-NNSKLXPR</code>, GA4{" "}
            <code>G-L0Y9DF136T</code>, Meta Pixel. Los eventos de producto van
            por <code>dataLayer</code> + <code>gtag</code>. Ordenar el contenedor
            GTM (un disparador / una etiqueta, limpiar tags viejos) sigue el
            mismo criterio que VSR y se puede hacer en la cuenta GTM sin tocar
            más el código.
          </p>
          <p className="mt-3 font-semibold text-[#3d2d5c]">
            c. Dashboard a medida
          </p>
          <p>
            Tablero en vivo: funnel del autotest, abandono por paso, share /
            calendar, mapa (resultados → marcador → cómo llegar, provincias /
            localidades) y popups.
          </p>
          <p className="mt-3 font-semibold text-[#3d2d5c]">
            d. Portal interno
          </p>
          <p>
            Material del equipo (este resumen, dashboard, catálogo de eventos)
            en <code>/equipo</code>, con login Google + allowlist (no password
            compartida como VSR).
          </p>
        </Section>

        <Section title="3) Qué gana el cliente">
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>Cuánta gente hace el autotest y hasta dónde llega.</li>
            <li>Dónde abandona (paso 1 fecha / paso 2 checklist).</li>
            <li>Uso de share, recordatorio y popups (incl. Sí/No pediatra).</li>
            <li>Conversión del mapa: búsqueda → marcador → cómo llegar.</li>
            <li>Decisiones de campaña con datos reales, no a ciegas.</li>
          </ul>
        </Section>

        <Section title="4) Dónde viven los datos (privacidad)">
          <p>
            <strong>GA4</strong> (cuenta del cliente) y <strong>Firestore</strong>{" "}
            (proyecto de medición BDM) para el dashboard. 100% anónimo: edad en
            meses/bucket, pasos, provincia/localidad, respuestas del quiz; nunca
            nombre, email ni fecha de nacimiento exacta. Plan Spark (gratuito)
            alcanza para esta fase.
          </p>
        </Section>

        <Section title="5) Estado actual">
          <ul className="m-0 list-none space-y-1 pl-0">
            <li>✔ Eventos de producto en código (Firestore + GA4 <code>bdm_*</code>)</li>
            <li>✔ Dashboard <code>/equipo/datos</code> con Google Auth</li>
            <li>✔ Portal <code>/equipo</code> + catálogo de eventos</li>
            <li>✔ GTM / GA / Meta IDs cableados en el sitio</li>
            <li>○ Deploy en dominio final + env del servidor (si aplica)</li>
            <li>○ Ordenar contenedor GTM (tags viejos) — opcional, como VSR</li>
          </ul>
        </Section>

        <Section title="6) Accesos">
          <ul className="m-0 list-disc space-y-2 pl-5">
            <li>
              Portal equipo:{" "}
              <Link href="/equipo" className="text-[#503C77] underline">
                /equipo
              </Link>{" "}
              (Google + allowlist)
            </li>
            <li>
              Dashboard datos:{" "}
              <Link href="/equipo/datos" className="text-[#503C77] underline">
                /equipo/datos
              </Link>
            </li>
            <li>
              Catálogo eventos:{" "}
              <Link href="/equipo/eventos" className="text-[#503C77] underline">
                /equipo/eventos
              </Link>
            </li>
          </ul>
        </Section>

        <Section title="7) Recomendaciones / opcional">
          <ul className="m-0 list-disc space-y-1 pl-5">
            <li>Banner de consentimiento de cookies (recomendable).</li>
            <li>
              En GTM: un disparador + una etiqueta a GA4 para los <code>bdm_*</code>;
              pausar/limpiar tags frágiles viejos.
            </li>
            <li>
              Sumar emails del equipo en Firestore{" "}
              <code>allowedViewers</code>.
            </li>
          </ul>
        </Section>
      </div>
    </EquipoGate>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8 rounded-[14px] border border-[#e8e4f0] bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,.04)]">
      <h3 className="m-0 mb-3 text-[16px] font-bold text-[#3d2d5c]">{title}</h3>
      <div className="space-y-2 text-[14px] leading-[1.55] text-[#442748]">
        {children}
      </div>
    </section>
  );
}
