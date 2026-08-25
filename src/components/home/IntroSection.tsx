import Image from "next/image";

const legendItems = [
  {
    id: "craneo",
    title: "Cráneo",
    subtitle: "Protección ósea externa",
    dotClass: "bg-craneo border border-[#D0D0D4]",
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
    subtitle: "Órgano afectado por la inflación",
    dotClass: "bg-cerebro border border-primary/25",
  },
] as const;

export function IntroSection() {
  return (
    <section id="que-es" className="scroll-mt-16 bg-white section-pad">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-[1.75rem] font-extrabold leading-tight text-primary md:text-[2.5rem]">
            ¿Qué es la meningitis?
          </h2>

          <div className="mt-6 space-y-5 text-[16px] leading-[26px] text-dark">
            <p>
              La meningitis es una enfermedad que{" "}
              <strong className="font-bold text-primary">
                afecta a las membranas que recubren el cerebro, el cerebelo y la
                médula espinal.
              </strong>{" "}
              Estas membranas se llaman <em className="italic">meninges</em> y
              desempeñan un papel importante en la protección y el funcionamiento
              adecuado del sistema nervioso central.
              <sup className="ml-0.5 text-[0.7em] text-muted">1,2</sup>
            </p>
            <p>
              La inflamación de las meninges habitualmente sucede cuando una
              bacteria, virus, hongo o parásito infecta el líquido que rodea al
              cerebro, afectando a su vez a las meninges.
              <sup className="ml-0.5 text-[0.7em] text-muted">1</sup>
            </p>
          </div>

          <div className="mt-8 rounded-[12px] border border-[#A6C0D6] bg-white p-5">
            <ul className="flex flex-col gap-2">
              {legendItems.map((item, index) => (
                <li key={item.id} className="contents">
                  <div className="flex items-start gap-4">
                    <span
                      className={`mt-0.5 h-10 w-10 shrink-0 rounded-full ${item.dotClass}`}
                      aria-hidden
                    />
                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold text-primary">{item.title}</p>
                        {"badge" in item && item.badge && (
                          <span className="rounded-md bg-[#E07A6A] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm leading-snug text-muted">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                  {index < legendItems.length - 1 && (
                    <div className="h-px w-full bg-[#E8E4EC]" aria-hidden />
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl">
            <Image
              src="/home/anatomia-meninges.png"
              alt="Ilustración: el cráneo, las meninges y el cerebro."
              width={1200}
              height={700}
              className="h-auto w-full"
              sizes="(max-width: 768px) 100vw, 42rem"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
