"use client";

import { useState, useTransition } from "react";
import {
  saveGlosarioTerm,
  deleteGlosarioTerm,
  toggleGlosarioVisible,
} from "../actions";
import type { GlosarioData } from "@/lib/glosarioData";
import { slugify } from "@/lib/slugify";

const INPUT =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none";
const LABEL = "mb-1 block text-xs text-white/40";

export function GlosarioManager({
  initialData,
}: {
  initialData: GlosarioData[];
}) {
  const [list, setList] = useState(initialData);
  const [form, setForm] = useState<GlosarioData | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSave() {
    if (!form) return;
    startTransition(async () => {
      const res = await saveGlosarioTerm(form);
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
          <h2 className="text-lg font-bold text-white">Glosario</h2>
          <p className="text-xs text-white/40">{list.length} términos</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setForm({
              id: slugify(String(Date.now())),
              term: "",
              definition: "",
              visible: true,
            });
            setIsNew(true);
            setError(null);
          }}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
        >
          Nuevo término
        </button>
      </div>

      <div className="space-y-3">
        {list.map((g) => (
          <div
            key={g.id}
            className={`flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 ${
              g.visible ? "" : "opacity-50"
            }`}
          >
            <p className="text-sm font-semibold text-white">{g.term}</p>
            <div className="flex gap-2">
              <button
                type="button"
                className="text-xs text-white/50"
                onClick={() =>
                  startTransition(async () => {
                    await toggleGlosarioVisible(g.id);
                    setList((prev) =>
                      prev.map((x) =>
                        x.id === g.id ? { ...x, visible: !x.visible } : x,
                      ),
                    );
                  })
                }
              >
                {g.visible ? "Ocultar" : "Mostrar"}
              </button>
              <button
                type="button"
                className="text-xs text-primary"
                onClick={() => {
                  setForm({ ...g });
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
                    await deleteGlosarioTerm(g.id);
                    setList((prev) => prev.filter((x) => x.id !== g.id));
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
              {isNew ? "Nuevo término" : "Editar término"}
            </h3>
            <div className="space-y-3">
              <div>
                <label className={LABEL}>Término</label>
                <input
                  className={INPUT}
                  value={form.term}
                  onChange={(e) => {
                    const term = e.target.value;
                    setForm({
                      ...form,
                      term,
                      ...(isNew ? { id: slugify(term) } : {}),
                    });
                  }}
                />
              </div>
              <div>
                <label className={LABEL}>Definición</label>
                <textarea
                  className={`${INPUT} min-h-24`}
                  value={form.definition}
                  onChange={(e) =>
                    setForm({ ...form, definition: e.target.value })
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
