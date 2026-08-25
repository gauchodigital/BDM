import { TestimonialsTabs } from "@/components/home/TestimonialsTabs";
import type { TestimonioData } from "@/lib/testimoniosData";

export function TestimonialsSection({
  testimonios,
}: {
  testimonios: TestimonioData[];
}) {
  return (
    <section id="testimonios" className="scroll-mt-16 section-pad bg-[#442748]">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-8">
        <div className="mx-auto max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
            Escuchá las experiencias
          </p>
          <h2 className="mt-3 text-[28px] font-extrabold leading-tight !text-white">
            Meningitis en primera persona
          </h2>
          <div className="mt-8">
            <TestimonialsTabs items={testimonios} />
          </div>
        </div>
      </div>
    </section>
  );
}
