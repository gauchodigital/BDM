import { TestimonialsTabs } from "@/components/home/TestimonialsTabs";
import { Reveal } from "@/components/ui/Reveal";
import type { TestimonioData } from "@/lib/testimoniosData";

export function TestimonialsSection({
  testimonios,
}: {
  testimonios: TestimonioData[];
}) {
  return (
    <section id="testimonios" className="scroll-mt-16 bg-[#F5F5F5] py-10 md:py-16 lg:bg-[linear-gradient(180deg,#F8F6FB_0%,#F5F5F5_45%,#F5F5F5_100%)] lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
        <div className="max-w-2xl lg:mx-auto lg:max-w-none lg:text-center">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-accent">
              Escuchá las experiencias
            </p>
            <h2 className="mt-3 text-[28px] font-extrabold leading-tight text-primary md:text-[2.5rem]">
              Meningitis en primera persona
            </h2>
          </Reveal>
          <Reveal delay={100} className="mt-8 lg:mt-10">
            <TestimonialsTabs items={testimonios} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
