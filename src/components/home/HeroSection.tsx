import { Button } from "@/components/ui/Button";

export function HeroSection() {
  return (
    <section className="relative bg-white px-6 pb-10 pt-10 md:px-8 md:pb-16 md:pt-16">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-[28rem] md:max-w-xl">
          <h1 className="animate-fade-up font-[family-name:var(--font-body)] text-[48px] font-black leading-[1.05] tracking-tight text-primary">
            La meningitis puede afectar los sueños de tu hijo
            <sup className="ml-0.5 text-[0.55em] font-bold align-super">1</sup>
          </h1>
          <p className="animate-fade-up animate-delay-1 mt-5 text-[16px] leading-[26px] text-dark">
            Conocé todo lo que necesitás saber para proteger a tu familia.
          </p>
          <div className="animate-fade-up animate-delay-2 mt-8 flex max-w-md flex-col gap-3">
            <Button
              href="/#que-es"
              variant="primary"
              className="w-full !rounded-xl !py-3.5 text-[15px] font-bold"
            >
              ¿Qué es la meningitis?
            </Button>
            <Button
              href="/vacunacion"
              variant="secondary"
              className="w-full !rounded-xl !border-2 !py-3.5 text-[15px] font-bold"
            >
              ¿Estás al día con las vacunas?
            </Button>
          </div>
        </div>

        <div className="mt-12 flex justify-center md:mt-16">
          <a
            href="#que-es"
            className="inline-flex flex-col items-center text-accent transition hover:opacity-80"
            aria-label="Seguir leyendo"
          >
            <svg
              viewBox="0 0 24 48"
              className="h-11 w-6 animate-bounce-soft"
              fill="currentColor"
              aria-hidden
            >
              <rect x="10" y="2" width="4" height="5" rx="1" />
              <rect x="10" y="11" width="4" height="5" rx="1" />
              <rect x="10" y="20" width="4" height="12" rx="1" />
              <path d="M12 46 L4 34 H20 Z" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
