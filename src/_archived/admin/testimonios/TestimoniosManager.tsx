"use client";

import { useState, useTransition } from "react";
import {
  saveTestimonio,
  deleteTestimonio,
  toggleTestimonioVisible,
} from "../actions";
import type { TestimonioData } from "@/lib/testimoniosData";
import { slugify } from "@/lib/slugify";

const INPUT =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none";
const LABEL = "mb-1 block text-xs text-white/40";

export function TestimoniosManager({
  initialData,
}: {
  initialData: TestimonioData[];
}) {
  const [list, setList] = useState(initialData);
  const [form, setForm] = useState<TestimonioData | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSave() {
    if (!form) return;
    startTransition(async () => {
      const res = await saveTestimonio(form);
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
          <h2 className="text-lg font-bold text-white">Testimonios</h2>
          <p className="text-xs text-white/40">{list.length} ítems</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setForm({
              id: slugify(String(Date.now())),
              slug: "",
              name: "",
              role: "",
              category: "paciente",
              quote: "",
              videoUrl: "",
              thumbnailSrc: "",
              visible: true,
            });
            setIsNew(true);
            setError(null);
          }}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
        >
          Nuevo testimonio
        </button>
      </div>

      <div className="space-y-3">
        {list.map((t) => (
          <div
            key={t.id}
            className={`flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 ${
              t.visible ? "" : "opacity-50"
            }`}
          >
            <div>
              <p className="text-sm font-semibold text-white">{t.name}</p>
              <p className="text-xs text-white/40">
                {t.category === "medico" ? "Médico" : "Paciente"}
                {t.role ? ` · ${t.role}` : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="text-xs text-white/50"
                onClick={() =>
                  startTransition(async () => {
                    await toggleTestimonioVisible(t.id);
                    setList((prev) =>
                      prev.map((x) =>
                        x.id === t.id ? { ...x, visible: !x.visible } : x,
                      ),
                    );
                  })
                }
              >
                {t.visible ? "Ocultar" : "Mostrar"}
              </button>
              <button
                type="button"
                className="text-xs text-primary"
                onClick={() => {
                  setForm({ ...t });
                  setIsNew(false);
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
                    await deleteTestimonio(t.id);
                    setList((prev) => prev.filter((x) => x.id !== t.id));
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
          <div className="w-full max-w-lg rounded-xl border border-white/10 bg-[#1a1524] p-6">
            <h3 className="mb-4 text-base font-bold text-white">
              {isNew ? "Nuevo testimonio" : "Editar testimonio"}
            </h3>
            <div className="space-y-3">
              <div>
                <label className={LABEL}>Nombre</label>
                <input
                  className={INPUT}
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm({
                      ...form,
                      name,
                      ...(isNew
                        ? { id: slugify(name), slug: slugify(name) }
                        : {}),
                    });
                  }}
                />
              </div>
              <div>
                <label className={LABEL}>Rol</label>
                <input
                  className={INPUT}
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="Ej. Médica pediatra / Paciente"
                />
              </div>
              <div>
                <label className={LABEL}>Categoría</label>
                <select
                  className={INPUT}
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value as TestimonioData["category"],
                    })
                  }
                >
                  <option value="medico">Entrevistas a médicos</option>
                  <option value="paciente">Testimonios de pacientes</option>
                </select>
              </div>
              <div>
                <label className={LABEL}>Cita (opcional)</label>
                <textarea
                  className={`${INPUT} min-h-20`}
                  value={form.quote}
                  onChange={(e) => setForm({ ...form, quote: e.target.value })}
                />
              </div>
              <div>
                <label className={LABEL}>URL del video</label>
                <input
                  className={INPUT}
                  value={form.videoUrl}
                  onChange={(e) =>
                    setForm({ ...form, videoUrl: e.target.value })
                  }
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
