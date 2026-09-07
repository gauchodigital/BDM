import { Button } from "@/components/ui/Button";
import { SkyBackdrop } from "@/components/home/SkyBackdrop";

function ScrollCue() {
  return (
    <div className="flex justify-center bg-white py-6 lg:py-8">
      <a
        href="/#que-es"
        className="flex flex-col items-center text-[#DD876E] transition hover:brightness-110"
        aria-label="Ir a ¿Qué es la meningitis?"
      >
        <svg
          width="20"
          height="36"
          viewBox="0 0 20 36"
          fill="none"
          className="animate-scroll-bounce"
          aria-hidden
        >
          {/* Tallo punteado + flecha — accent #DD876E */}
          <path
            d="M10 2v20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="2.5 4"
          />
          <path
            d="M4 18l6 8 6-8"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </div>
  );
}

export function HeroSection() {
  return (
    <>
      {/* Mobile */}
      <div className="lg:hidden">
        <section className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#0B1C33]">
          <SkyBackdrop variant="mobile" />
          <div className="relative z-10 flex flex-1 flex-col px-6 pb-24 pt-28">
            <div className="pt-2">
              <h1 className="animate-fade-up text-[48px] font-black leading-[1.15] tracking-normal text-white">
                La meningitis puede afectar los sueños de tu hijo
                <sup className="ml-0.5 align-super text-[0.45em] font-bold text-white/80">
                  1
                </sup>
              </h1>
              <p className="animate-fade-up animate-delay-1 mt-4 max-w-sm text-[16px] leading-[1.55] text-white/85">
                Conocé todo lo que necesitás saber para proteger a tu familia.
              </p>
            </div>

            <div className="animate-fade-up animate-delay-2 mt-auto flex flex-col gap-3 pb-2">
              <Button
                href="/#que-es"
                variant="cta"
                className="!rounded-[10px] !bg-[#DD876E] !px-6 !py-3.5 text-[15px] font-bold !text-white hover:!brightness-105"
              >
                ¿Qué es la meningitis?
              </Button>
              <Button
                href="/autotest"
                variant="onPrimary"
                className="!rounded-[10px] !border-2 !border-white !bg-white !px-6 !py-3.5 text-[15px] font-bold !text-[#503C77] hover:!bg-white/90"
              >
                ¿Estás al día con las vacunas?
              </Button>
            </div>
          </div>
        </section>
        <ScrollCue />
      </div>

      {/* Desktop */}
      <div className="hidden lg:block">
        <section className="relative min-h-[100svh] overflow-hidden bg-[#0B1C33]">
          <SkyBackdrop variant="desktop" />
          <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl items-center px-8 pb-16 pt-32">
            <div className="max-w-[36rem]">
              <h1 className="animate-fade-up text-[48px] font-black leading-[1.15] tracking-normal text-white xl:text-[56px]">
                La meningitis puede afectar los sueños de tu hijo
                <sup className="ml-0.5 align-super text-[0.45em] font-bold text-white/75">
                  1
                </sup>
              </h1>
              <p className="animate-fade-up animate-delay-1 mt-5 text-[18px] leading-[1.55] text-white/85">
                Conocé todo lo que necesitás saber para proteger a tu familia.
              </p>
              <div className="animate-fade-up animate-delay-2 mt-8 flex flex-wrap gap-3">
                <Button
                  href="/#que-es"
                  variant="cta"
                  className="!rounded-[10px] !bg-[#DD876E] !px-6 !py-3.5 text-[15px] font-bold !text-white hover:!brightness-105"
                >
                  ¿Qué es la meningitis?
                </Button>
                <Button
                  href="/autotest"
                  variant="onPrimary"
                  className="!rounded-[10px] !border-2 !border-white !bg-white !px-6 !py-3.5 text-[15px] font-bold !text-[#503C77] hover:!bg-white/90"
                >
                  ¿Estás al día con las vacunas?
                </Button>
              </div>
            </div>
          </div>
        </section>
        <ScrollCue />
      </div>
    </>
  );
}
