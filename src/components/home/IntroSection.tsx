import { Reveal } from "@/components/ui/Reveal";
import { AnatomyInteractive } from "@/components/home/AnatomyInteractive";

export function IntroSection() {
  return (
    <section
      id="que-es"
      /* py-16/md:py-24 replican section-pad; en desktop la sección ocupa
         la pantalla completa y centra su contenido. */
      className="scroll-mt-16 bg-white py-16 md:py-24 lg:py-20"
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
        {/* Mobile */}
        <div className="lg:hidden">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-accent">
              Entendiendo la enfermedad
            </p>
            <h2 className="mt-2 text-[1.75rem] font-extrabold leading-tight text-primary md:text-[2.5rem]">
              ¿Qué es la meningitis?
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <div className="mt-6 space-y-5 text-[16px] leading-[26px] text-dark">
              <p>
                La meningitis es una enfermedad que{" "}
                <strong className="font-semibold text-[#442748]">
                  afecta a las membranas que recubren el cerebro, el cerebelo y
                  la médula espinal.
                </strong>{" "}
                Estas membranas se llaman <em className="italic">meninges</em> y
                desempeñan un papel importante en la protección y el
                funcionamiento adecuado del sistema nervioso central.
                <sup className="ml-0.5 text-[0.7em] text-muted">1,2</sup>
              </p>
              <p>
                La inflamación de las meninges habitualmente sucede cuando una
                bacteria, virus, hongo o parásito infecta el líquido que rodea al
                cerebro, afectando a su vez a las meninges.
                <sup className="ml-0.5 text-[0.7em] text-muted">1</sup>
              </p>
            </div>
          </Reveal>
          <Reveal delay={100} className="mt-8">
            <AnatomyInteractive />
          </Reveal>
        </div>

        {/* Desktop */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-start gap-10 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] xl:gap-12">
            <div>
              <Reveal>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
                  Entendiendo la enfermedad
                </p>
                <h2 className="mt-2 text-[2.5rem] font-extrabold leading-tight text-primary">
                  ¿Qué es la meningitis?
                </h2>
              </Reveal>
              <Reveal delay={80}>
                <div className="mt-5 max-w-[34rem] space-y-4 text-[16px] leading-[26px] text-dark">
                  <p>
                    La meningitis es una enfermedad que{" "}
                    <strong className="font-semibold text-[#442748]">
                      afecta a las membranas que recubren el cerebro, el
                      cerebelo y la médula espinal.
                    </strong>{" "}
                    Estas membranas se llaman{" "}
                    <em className="italic">meninges</em> y desempeñan un papel
                    importante en la protección y el funcionamiento adecuado del
                    sistema nervioso central.
                    <sup className="ml-0.5 text-[0.7em] text-muted">1,2</sup>
                  </p>
                  <p>
                    La inflamación de las meninges habitualmente sucede cuando
                    una bacteria, virus, hongo o parásito infecta el líquido que
                    rodea al cerebro, afectando a su vez a las meninges.
                    <sup className="ml-0.5 text-[0.7em] text-muted">1</sup>
                  </p>
                </div>
              </Reveal>
            </div>

            <Reveal delay={100} from="right">
              <AnatomyInteractive className="w-full" />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
