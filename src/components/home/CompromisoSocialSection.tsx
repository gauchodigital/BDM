import { Reveal } from "@/components/ui/Reveal";

export function CompromisoSocialSection() {
  return (
    <section className="bg-white px-5 pb-0 pt-[22px] md:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <Reveal>
          <div className="flex max-w-2xl flex-col gap-4 lg:mx-auto lg:max-w-3xl lg:text-center">
            <div className="flex flex-col gap-2">
              <p className="text-[11px] font-extrabold uppercase leading-[16.8px] tracking-[1.3px] text-[#DD876E]">
                Compromiso social
              </p>
              <h2 className="text-[28px] font-black leading-9 text-[#503C77] md:text-[2.5rem] md:leading-tight">
                Por un mundo sin meningitis
              </h2>
            </div>
            <p className="text-[16px] leading-[26px] text-[#442748] lg:text-[18px]">
              Nos unimos al compromiso de la Organización Mundial de la Salud
              para poner fin a la meningitis para el 2030
              <sup className="text-[10px] leading-[26px] text-[#442748]">
                22
              </sup>
              .
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
