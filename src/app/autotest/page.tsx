import type { Metadata } from "next";
import Link from "next/link";
import { AutotestQuiz } from "@/components/autotest/AutotestQuiz";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Autotest de vacunas",
  description:
    "Ingresá la fecha de nacimiento y descubrí qué vacunas corresponden según el Calendario Nacional de Vacunación.",
};

export default function AutotestPage() {
  return (
    <section className="min-h-[70vh] bg-[#F7F5FA] px-5 py-10 md:px-8 md:py-14">
      <div className="mx-auto w-full max-w-7xl">
        <nav
          className="animate-fade-up mb-6 text-[13px] text-muted"
          aria-label="Miga de pan"
        >
          <Link href="/" className="hover:text-primary hover:underline">
            Inicio
          </Link>
          <span className="mx-2" aria-hidden>
            /
          </span>
          <span className="text-primary">Autotest de vacunas</span>
        </nav>
        <Reveal delay={80}>
          <AutotestQuiz variant="byAge" collapsibleMonths />
        </Reveal>
      </div>
    </section>
  );
}
