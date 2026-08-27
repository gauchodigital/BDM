import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { RichText } from "@/components/ui/RichText";
import { BacterianaPage } from "@/components/causas/BacterianaPage";
import { FungicaPage } from "@/components/causas/FungicaPage";
import { ParasitariaPage } from "@/components/causas/ParasitariaPage";
import { ViralPage } from "@/components/causas/ViralPage";
import { getCausaBySlug } from "@/lib/causasData";
import { WHATSAPP_URL } from "@/lib/siteLinks";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const causa = getCausaBySlug(slug);
  if (!causa) return { title: "Causa" };
  if (slug === "bacteriana") {
    return {
      title: "Meningitis bacteriana",
      description:
        "La meningitis bacteriana es la más grave: síntomas, grupos de riesgo, meningococo, secuelas y vacunación.",
    };
  }
  if (slug === "viral") {
    return {
      title: "Meningitis viral",
      description:
        "La meningitis viral es la más frecuente: síntomas, grupos de riesgo, tratamiento y cuándo buscar atención médica.",
    };
  }
  if (slug === "fungica") {
    return {
      title: "Meningitis fúngica",
      description:
        "La meningitis fúngica es poco frecuente: síntomas, grupos de riesgo, tratamiento antifúngico y cuándo buscar atención médica.",
    };
  }
  if (slug === "parasitaria") {
    return {
      title: "Meningitis parasitaria",
      description:
        "La meningitis parasitaria es poco frecuente: síntomas, grupos de riesgo, tratamiento y cuándo buscar atención médica.",
    };
  }
  return {
    title: causa.title,
    description: causa.description,
  };
}

export default async function CausaDetailPage({ params }: Props) {
  const { slug } = await params;
  const causa = getCausaBySlug(slug);
  if (!causa) notFound();

  if (slug === "bacteriana") {
    return <BacterianaPage />;
  }

  if (slug === "viral") {
    return <ViralPage />;
  }

  if (slug === "fungica") {
    return <FungicaPage />;
  }

  if (slug === "parasitaria") {
    return <ParasitariaPage />;
  }

  const paragraphs = causa.body.split(/\n\n+/).filter(Boolean);

  return (
    <Section tone="white" className="!pt-12 md:!pt-16">
      <Link
        href="/causas"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        <span className="material-symbols-outlined text-base">arrow_back</span>
        Volver a causas
      </Link>
      <Chip label={causa.tagLabel} color={causa.tagColor} />
      <h1 className="mt-3 max-w-2xl text-[2.125rem] font-black leading-tight text-primary md:text-[2.5rem]">
        {causa.title}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        <RichText text={causa.description} />
      </p>
      <div className="mt-8 max-w-2xl space-y-4">
        {paragraphs.map((p) => (
          <p key={p.slice(0, 40)} className="text-base leading-[1.65] text-dark">
            <RichText text={p} />
          </p>
        ))}
      </div>
      <div className="mt-10">
        <Button href={WHATSAPP_URL} external variant="primary">
          Consultar por WhatsApp
        </Button>
      </div>
    </Section>
  );
}
