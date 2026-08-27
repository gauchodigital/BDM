import Link from "next/link";

export function VacunacionFaqCta() {
  return (
    <section className="bg-white px-5 py-12 md:px-8 md:py-16">
      <div className="mx-auto w-full max-w-7xl">
        <div className="max-w-xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#DD876E]">
            Preguntas frecuentes
          </p>
          <h2 className="mt-3 text-[28px] font-extrabold leading-tight text-[#503C77] md:text-[2rem]">
            Todo lo que necesitás saber sobre las vacunas
          </h2>
          <Link
            href="/faq"
            className="mt-6 inline-flex h-[48px] min-w-[200px] items-center justify-center rounded-full bg-[#503C77] px-8 text-[15px] font-bold text-white transition hover:brightness-110"
          >
            Resolvé tus dudas
          </Link>
        </div>
      </div>
    </section>
  );
}
