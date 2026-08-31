import { Reveal } from "@/components/ui/Reveal";

export function CompromisoSocialSection() {
  return (
    <section className="section-pad bg-white">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
        <Reveal>
          <div className="max-w-2xl lg:mx-auto lg:max-w-3xl lg:text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#DD876E]">
              Compromiso social
            </p>
            <h2 className="mt-3 text-[28px] font-extrabold leading-tight text-[#503C77] md:text-[2.5rem]">
              Por un mundo sin meningitis
            </h2>
            <p className="mt-4 text-[15px] leading-[1.6] text-dark md:text-[16px] lg:text-[18px]">
              Nos unimos al compromiso de la Organización Mundial de la Salud
              para poner fin a la meningitis para el 2030
              <sup className="text-[0.7em] text-muted">22</sup>.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
