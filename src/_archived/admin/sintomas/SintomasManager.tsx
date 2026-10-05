"use client";

import { useState, useTransition } from "react";
import {
  saveSintoma,
  deleteSintoma,
  toggleSintomaVisible,
} from "../actions";
import type { SintomaData } from "@/lib/sintomasData";
import { slugify } from "@/lib/slugify";

const INPUT =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none";
const LABEL = "mb-1 block text-xs text-white/40";

export function SintomasManager({
  initialData,
}: {
  initialData: SintomaData[];
}) {
  const [list, setList] = useState(initialData);
  const [form, setForm] = useState<SintomaData | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function openNew() {
    setForm({
      id: slugify(String(Date.now())),
      label: "",
      description: "",
      icon: "circle",
      phase: "early",
      visible: true,
    });
    setIsNew(true);
    setError(null);
  }

  function handleSave() {
    if (!form) return;
    startTransition(async () => {
      const res = await saveSintoma(form);
      if (!res.ok) {
        setError(res.error ?? "Error");
        return;
      }
      setList((prev) => {
        const idx = prev.findIndex((x) => x.id === form.id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = form;
          return copy;
        }
        return [...prev, form];
      });
      setForm(null);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Síntomas</h2>
          <p className="text-xs text-white/40">{list.length} ítems</p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
        >
          Nuevo síntoma
        </button>
      </div>

      <div className="space-y-3">
        {list.map((s) => (
          <div
            key={s.id}
            className={`flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 ${
              s.visible ? "" : "opacity-50"
            }`}
          >
            <div className="flex items-center gap-3">
              {s.icon.endsWith(".svg") || s.icon.startsWith("/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.icon} alt="" width={24} height={24} className="h-6 w-6" />
              ) : (
                <span className="material-symbols-outlined text-primary">
                  {s.icon}
                </span>
              )}
              <div>
                <p className="text-sm font-semibold text-white">{s.label}</p>
                <p className="text-[11px] text-white/40">
                  {s.phase === "alarm" ? "Alarma" : "Primeras 12hs"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="text-xs text-white/50"
                onClick={() =>
                  startTransition(async () => {
                    await toggleSintomaVisible(s.id);
                    setList((prev) =>
                      prev.map((x) =>
                        x.id === s.id ? { ...x, visible: !x.visible } : x,
                      ),
                    );
                  })
                }
              >
                {s.visible ? "Ocultar" : "Mostrar"}
              </button>
              <button
                type="button"
                className="text-xs text-primary"
                onClick={() => {
                  setForm({ ...s });
                  setIsNew(false);
                  setError(null);
                }}
              >
                Editar
              </button>
              <button
                type="button"
                className="text-xs text-red-400"
                onClick={() => {
                  if (!confirm("¿Eliminar?")) return;
                  startTransition(async () => {
                    await deleteSintoma(s.id);
                    setList((prev) => prev.filter((x) => x.id !== s.id));
                  });
                }}
              >
                Borrar
              </button>
            </div>
          </div>
        ))}
      </div>

      {form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#1a1524] p-6">
            <h3 className="mb-4 text-base font-bold text-white">
              {isNew ? "Nuevo síntoma" : "Editar síntoma"}
            </h3>
            <div className="space-y-3">
              <div>
                <label className={LABEL}>Etiqueta</label>
                <input
                  className={INPUT}
                  value={form.label}
                  onChange={(e) => {
                    const label = e.target.value;
                    setForm({
                      ...form,
                      label,
                      ...(isNew ? { id: slugify(label) } : {}),
                    });
                  }}
                />
              </div>
              <div>
                <label className={LABEL}>Descripción</label>
                <textarea
                  className={INPUT}
                  rows={2}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={LABEL}>Fase</label>
                <select
                  className={INPUT}
                  value={form.phase}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phase: e.target.value as SintomaData["phase"],
                    })
                  }
                >
                  <option value="early">Primeras 12hs</option>
                  <option value="alarm">Señales de alarma</option>
                </select>
              </div>
              <div>
                <label className={LABEL}>Icono (ruta SVG o Material Symbol)</label>
                <input
                  className={INPUT}
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                />
              </div>
            </div>
            {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-lg px-4 py-2 text-sm text-white/50"
                onClick={() => setForm(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={pending}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
                onClick={handleSave}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
