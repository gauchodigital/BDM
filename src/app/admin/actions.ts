"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { readCausas, writeCausas, type CausaData } from "@/lib/causasData";
import { readSintomas, writeSintomas, type SintomaData } from "@/lib/sintomasData";
import { readFaq, writeFaq, type FaqData } from "@/lib/faqData";
import {
  readTestimonios,
  writeTestimonios,
  type TestimonioData,
} from "@/lib/testimoniosData";
import { readGlosario, writeGlosario, type GlosarioData } from "@/lib/glosarioData";
import { slugify } from "@/lib/slugify";

async function isAuthed(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin-session")?.value;
  return !!process.env.ADMIN_TOKEN && session === process.env.ADMIN_TOKEN;
}

export async function login(
  _: unknown,
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const password = formData.get("password") as string;

  if (!process.env.ADMIN_TOKEN) {
    return { ok: false, error: "ADMIN_TOKEN no configurado en .env.local" };
  }

  if (password !== process.env.ADMIN_TOKEN) {
    return { ok: false, error: "Contraseña incorrecta" };
  }

  const cookieStore = await cookies();
  cookieStore.set("admin-session", process.env.ADMIN_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return { ok: true };
}

function revalidatePublic() {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/causas");
  revalidatePath("/sintomas");
  revalidatePath("/faq");
  revalidatePath("/glosario");
  revalidatePath("/vacunacion");
}

// --- Causas ---

export async function saveCausa(
  data: CausaData,
): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAuthed())) return { ok: false, error: "No autorizado" };

  const title = data.title.trim();
  if (!title) return { ok: false, error: "El título es obligatorio" };

  const id = data.id.trim() || slugify(title);
  const slug = data.slug.trim() || slugify(title);
  const entry: CausaData = { ...data, id, slug, title };

  const list = readCausas();
  const idx = list.findIndex((c) => c.id === id);
  if (idx >= 0) list[idx] = entry;
  else list.push(entry);
  writeCausas(list);

  revalidatePublic();
  revalidatePath(`/causas/${slug}`);
  revalidatePath("/admin/causas");
  return { ok: true };
}

export async function deleteCausa(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAuthed())) return { ok: false, error: "No autorizado" };
  writeCausas(readCausas().filter((c) => c.id !== id));
  revalidatePublic();
  revalidatePath("/admin/causas");
  return { ok: true };
}

export async function toggleCausaVisible(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAuthed())) return { ok: false, error: "No autorizado" };
  const list = readCausas();
  const idx = list.findIndex((c) => c.id === id);
  if (idx >= 0) list[idx].visible = !list[idx].visible;
  writeCausas(list);
  revalidatePublic();
  revalidatePath("/admin/causas");
  return { ok: true };
}

// --- Síntomas ---

export async function saveSintoma(
  data: SintomaData,
): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAuthed())) return { ok: false, error: "No autorizado" };
  if (!data.label.trim()) return { ok: false, error: "La etiqueta es obligatoria" };

  const id = data.id.trim() || slugify(data.label);
  const entry = { ...data, id, label: data.label.trim() };
  const list = readSintomas();
  const idx = list.findIndex((s) => s.id === id);
  if (idx >= 0) list[idx] = entry;
  else list.push(entry);
  writeSintomas(list);
  revalidatePublic();
  revalidatePath("/admin/sintomas");
  return { ok: true };
}

export async function deleteSintoma(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAuthed())) return { ok: false, error: "No autorizado" };
  writeSintomas(readSintomas().filter((s) => s.id !== id));
  revalidatePublic();
  revalidatePath("/admin/sintomas");
  return { ok: true };
}

export async function toggleSintomaVisible(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAuthed())) return { ok: false, error: "No autorizado" };
  const list = readSintomas();
  const idx = list.findIndex((s) => s.id === id);
  if (idx >= 0) list[idx].visible = !list[idx].visible;
  writeSintomas(list);
  revalidatePublic();
  revalidatePath("/admin/sintomas");
  return { ok: true };
}

// --- FAQ ---

export async function saveFaqItem(
  data: FaqData,
): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAuthed())) return { ok: false, error: "No autorizado" };
  if (!data.question.trim()) return { ok: false, error: "La pregunta es obligatoria" };

  const id = data.id.trim() || slugify(data.question);
  const entry = { ...data, id, question: data.question.trim() };
  const list = readFaq();
  const idx = list.findIndex((f) => f.id === id);
  if (idx >= 0) list[idx] = entry;
  else list.push(entry);
  writeFaq(list);
  revalidatePublic();
  revalidatePath("/admin/faq");
  return { ok: true };
}

export async function deleteFaqItem(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAuthed())) return { ok: false, error: "No autorizado" };
  writeFaq(readFaq().filter((f) => f.id !== id));
  revalidatePublic();
  revalidatePath("/admin/faq");
  return { ok: true };
}

export async function toggleFaqVisible(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAuthed())) return { ok: false, error: "No autorizado" };
  const list = readFaq();
  const idx = list.findIndex((f) => f.id === id);
  if (idx >= 0) list[idx].visible = !list[idx].visible;
  writeFaq(list);
  revalidatePublic();
  revalidatePath("/admin/faq");
  return { ok: true };
}

// --- Testimonios ---

export async function saveTestimonio(
  data: TestimonioData,
): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAuthed())) return { ok: false, error: "No autorizado" };
  if (!data.name.trim()) return { ok: false, error: "El nombre es obligatorio" };

  const id = data.id.trim() || slugify(data.name);
  const slug = data.slug.trim() || slugify(data.name);
  const entry = { ...data, id, slug, name: data.name.trim() };
  const list = readTestimonios();
  const idx = list.findIndex((t) => t.id === id);
  if (idx >= 0) list[idx] = entry;
  else list.push(entry);
  writeTestimonios(list);
  revalidatePublic();
  revalidatePath("/admin/testimonios");
  return { ok: true };
}

export async function deleteTestimonio(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAuthed())) return { ok: false, error: "No autorizado" };
  writeTestimonios(readTestimonios().filter((t) => t.id !== id));
  revalidatePublic();
  revalidatePath("/admin/testimonios");
  return { ok: true };
}

export async function toggleTestimonioVisible(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAuthed())) return { ok: false, error: "No autorizado" };
  const list = readTestimonios();
  const idx = list.findIndex((t) => t.id === id);
  if (idx >= 0) list[idx].visible = !list[idx].visible;
  writeTestimonios(list);
  revalidatePublic();
  revalidatePath("/admin/testimonios");
  return { ok: true };
}

// --- Glosario ---

export async function saveGlosarioTerm(
  data: GlosarioData,
): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAuthed())) return { ok: false, error: "No autorizado" };
  if (!data.term.trim()) return { ok: false, error: "El término es obligatorio" };

  const id = data.id.trim() || slugify(data.term);
  const entry = { ...data, id, term: data.term.trim() };
  const list = readGlosario();
  const idx = list.findIndex((g) => g.id === id);
  if (idx >= 0) list[idx] = entry;
  else list.push(entry);
  writeGlosario(list);
  revalidatePublic();
  revalidatePath("/admin/glosario");
  return { ok: true };
}

export async function deleteGlosarioTerm(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAuthed())) return { ok: false, error: "No autorizado" };
  writeGlosario(readGlosario().filter((g) => g.id !== id));
  revalidatePublic();
  revalidatePath("/admin/glosario");
  return { ok: true };
}

export async function toggleGlosarioVisible(
  id: string,
): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAuthed())) return { ok: false, error: "No autorizado" };
  const list = readGlosario();
  const idx = list.findIndex((g) => g.id === id);
  if (idx >= 0) list[idx].visible = !list[idx].visible;
  writeGlosario(list);
  revalidatePublic();
  revalidatePath("/admin/glosario");
  return { ok: true };
}
