"use client";

import { useState, useTransition } from "react";
import { saveFaqItem, deleteFaqItem, toggleFaqVisible } from "../actions";
import type { FaqData } from "@/lib/faqTypes";
import { FAQ_CATEGORIES } from "@/lib/faqTypes";
import { slugify } from "@/lib/slugify";

const INPUT =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none";
const LABEL = "mb-1 block text-xs text-white/40";

export function FaqManager({ initialData }: { initialData: FaqData[] }) {
  const [list, setList] = useState(initialData);
  const [form, setForm] = useState<FaqData | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSave() {
    if (!form) return;
    startTransition(async () => {
      const res = await saveFaqItem(form);
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
          <h2 className="text-lg font-bold text-white">FAQ</h2>
          <p className="text-xs text-white/40">{list.length} preguntas</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setForm({
              id: slugify(String(Date.now())),
              category: "meningitis",
              question: "",
              answer: "",
              visible: true,
            });
            setIsNew(true);
            setError(null);
          }}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
        >
          Nueva pregunta
        </button>
      </div>

      <div className="space-y-3">
        {list.map((f) => (
          <div
            key={f.id}
            className={`rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 ${
              f.visible ? "" : "opacity-50"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold text-white">{f.question}</p>
              <p className="mt-1 text-[11px] text-white/35">
                {FAQ_CATEGORIES.find((c) => c.id === f.category)?.label ??
                  f.category}
              </p>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  className="text-xs text-white/50"
                  onClick={() =>
                    startTransition(async () => {
                      await toggleFaqVisible(f.id);
                      setList((prev) =>
                        prev.map((x) =>
                          x.id === f.id ? { ...x, visible: !x.visible } : x,
                        ),
                      );
                    })
                  }
                >
                  {f.visible ? "Ocultar" : "Mostrar"}
                </button>
                <button
                  type="button"
                  className="text-xs text-primary"
                  onClick={() => {
                    setForm({ ...f });
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
                      await deleteFaqItem(f.id);
                      setList((prev) => prev.filter((x) => x.id !== f.id));
                    });
                  }}
                >
                  Borrar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-xl border border-white/10 bg-[#1a1524] p-6">
            <h3 className="mb-4 text-base font-bold text-white">
              {isNew ? "Nueva pregunta" : "Editar pregunta"}
            </h3>
            <div className="space-y-3">
              <div>
                <label className={LABEL}>Categoría</label>
                <select
                  className={INPUT}
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  {FAQ_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={LABEL}>Pregunta</label>
                <input
                  className={INPUT}
                  value={form.question}
                  onChange={(e) => {
                    const question = e.target.value;
                    setForm({
                      ...form,
                      question,
                      ...(isNew ? { id: slugify(question) } : {}),
                    });
                  }}
                />
              </div>
              <div>
                <label className={LABEL}>Respuesta</label>
                <textarea
                  className={`${INPUT} min-h-28`}
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
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
