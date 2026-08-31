import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

const legendItems = [
  {
    id: "craneo",
    title: "Cráneo",
    subtitle: "Protección ósea externa",
    dotClass: "bg-[#E8E4EC]",
  },
  {
    id: "meninges",
    title: "Meninges",
    subtitle: "3 capas de membrana protectora",
    dotClass: "bg-meninges border border-meninges-stroke",
    badge: "SE INFLAMAN",
  },
  {
    id: "cerebro",
    title: "Cerebro",
    subtitle: "Órgano afectado por la inflamación",
    dotClass: "bg-cerebro",
  },
] as const;

function LegendList() {
  return (
    <ul className="overflow-hidden rounded-[12px] border border-[#E5E5E5] bg-white">
      {legendItems.map((item, i) => (
        <li
          key={item.id}
          className={`flex items-start gap-3 px-4 py-3.5 ${
            i > 0 ? "border-t border-[#E5E5E5]" : ""
          }`}
        >
          <span
            className={`mt-0.5 size-8 shrink-0 rounded-full ${item.dotClass}`}
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[15px] font-bold leading-snug text-[#442748]">
                {item.title}
              </p>
              {"badge" in item && item.badge ? (
                <span className="rounded-md bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <p className="mt-0.5 text-[13px] leading-snug text-muted">
              {item.subtitle}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function IntroSection() {
  return (
    <section
      id="que-es"
      className="section-pad scroll-mt-16 bg-white"
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
                <strong className="font-bold text-primary">
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
            <LegendList />
          </Reveal>
          <Reveal delay={120} className="mt-8">
            <div className="overflow-hidden">
              <Image
                src="/home/anatomia-meninges.png"
                alt="Ilustración: el cráneo, las meninges y el cerebro."
                width={1200}
                height={700}
                className="h-auto w-full"
                sizes="100vw"
              />
            </div>
          </Reveal>
        </div>

        {/* Desktop */}
        <div className="hidden lg:block">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
              Entendiendo la enfermedad
            </p>
            <h2 className="mt-2 text-[2.5rem] font-extrabold leading-tight text-primary">
              ¿Qué es la meningitis?
            </h2>
          </Reveal>

          <div className="mt-10 grid grid-cols-[1.15fr_0.85fr] items-start gap-14">
            <div>
              <Reveal delay={80}>
                <div className="max-w-xl space-y-5 text-[16px] leading-[26px] text-dark">
                  <p>
                    La meningitis es una enfermedad que{" "}
                    <strong className="font-bold text-primary">
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
              <Reveal delay={120} className="mt-10 max-w-xl">
                <Image
                  src="/home/anatomia-meninges.png"
                  alt="Ilustración: el cráneo, las meninges y el cerebro."
                  width={1200}
                  height={700}
                  className="h-auto w-full"
                  sizes="36rem"
                />
              </Reveal>
            </div>

            <Reveal delay={100} from="right" className="pt-2">
              <LegendList />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
