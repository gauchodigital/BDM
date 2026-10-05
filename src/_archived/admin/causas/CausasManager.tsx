"use client";

import { useState, useTransition } from "react";
import {
  saveCausa,
  deleteCausa,
  toggleCausaVisible,
} from "../actions";
import type { CausaData, CausaTagColor } from "@/lib/causasData";
import { slugify } from "@/lib/slugify";

const INPUT =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none";
const LABEL = "mb-1 block text-xs text-white/40";

const EMPTY: CausaData = {
  id: "",
  slug: "",
  tagLabel: "",
  tagColor: "accent",
  title: "",
  description: "",
  body: "",
  visible: true,
};

export function CausasManager({ initialData }: { initialData: CausaData[] }) {
  const [list, setList] = useState(initialData);
  const [form, setForm] = useState<CausaData | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function openNew() {
    setForm({ ...EMPTY, id: slugify(String(Date.now())) });
    setIsNew(true);
    setError(null);
  }

  function openEdit(c: CausaData) {
    setForm({ ...c });
    setIsNew(false);
    setError(null);
  }

  function handleSave() {
    if (!form) return;
    startTransition(async () => {
      const res = await saveCausa(form);
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
          <h2 className="text-lg font-bold text-white">Causas</h2>
          <p className="text-xs text-white/40">{list.length} ítems</p>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
        >
          Nueva causa
        </button>
      </div>

      <div className="space-y-3">
        {list.map((c) => (
          <div
            key={c.id}
            className={`flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 ${
              c.visible ? "" : "opacity-50"
            }`}
          >
            <div>
              <p className="text-sm font-semibold text-white">{c.title}</p>
              <p className="text-xs text-white/40">
                {c.tagLabel} · /causas/{c.slug}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="text-xs text-white/50 hover:text-white"
                onClick={() =>
                  startTransition(async () => {
                    await toggleCausaVisible(c.id);
                    setList((prev) =>
                      prev.map((x) =>
                        x.id === c.id ? { ...x, visible: !x.visible } : x,
                      ),
                    );
                  })
                }
              >
                {c.visible ? "Ocultar" : "Mostrar"}
              </button>
              <button
                type="button"
                className="text-xs text-primary hover:underline"
                onClick={() => openEdit(c)}
              >
                Editar
              </button>
              <button
                type="button"
                className="text-xs text-red-400"
                onClick={() => {
                  if (!confirm("¿Eliminar?")) return;
                  startTransition(async () => {
                    await deleteCausa(c.id);
                    setList((prev) => prev.filter((x) => x.id !== c.id));
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
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-white/10 bg-[#1a1524] p-6">
            <h3 className="mb-4 text-base font-bold text-white">
              {isNew ? "Nueva causa" : "Editar causa"}
            </h3>
            <div className="space-y-3">
              <div>
                <label className={LABEL}>Título</label>
                <input
                  className={INPUT}
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setForm({
                      ...form,
                      title,
                      ...(isNew
                        ? { id: slugify(title), slug: slugify(title) }
                        : {}),
                    });
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={LABEL}>Tag</label>
                  <input
                    className={INPUT}
                    value={form.tagLabel}
                    onChange={(e) =>
                      setForm({ ...form, tagLabel: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className={LABEL}>Color tag</label>
                  <select
                    className={INPUT}
                    value={form.tagColor}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        tagColor: e.target.value as CausaTagColor,
                      })
                    }
                  >
                    <option value="accent">accent</option>
                    <option value="primary">primary</option>
                    <option value="secondary">secondary</option>
                    <option value="light">light</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={LABEL}>Slug</label>
                <input
                  className={INPUT}
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                />
              </div>
              <div>
                <label className={LABEL}>
                  Descripción corta (usá **texto** para negrita)
                </label>
                <textarea
                  className={`${INPUT} min-h-20`}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={LABEL}>Cuerpo (detalle)</label>
                <textarea
                  className={`${INPUT} min-h-32`}
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
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
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
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
