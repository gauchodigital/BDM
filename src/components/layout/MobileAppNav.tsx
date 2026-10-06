"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoManito } from "@/components/layout/LogoManito";
import { SITE_NAME } from "@/lib/siteLinks";
import {
  CAUSAS_DROPDOWN,
  MOBILE_TAB_ITEMS,
  isHomeHeroRoute,
} from "@/lib/navLinks";

function isTabActive(pathname: string, match: string) {
  if (match === "que-es") return isHomeHeroRoute(pathname);
  return pathname === `/${match}` || pathname.startsWith(`/${match}/`);
}

function NavIcon({
  src,
  active,
  color,
}: {
  src: string;
  active?: boolean;
  color?: string;
}) {
  return (
    <span
      aria-hidden
      className="block size-6 shrink-0"
      style={{
        backgroundColor: color ?? (active ? "#442748" : "#9B95A8"),
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

const BOTTOM_TABS = MOBILE_TAB_ITEMS.filter((t) => t.match !== "faq");

const MENU_LINKS = [
  {
    href: "/#que-es",
    match: "que-es",
    label: "¿Qué es la meningitis?",
    hint: "Información clara para entenderla",
    icon: "/brand/icons/nav/que-es.svg",
  },
  {
    href: "/sintomas",
    match: "sintomas",
    label: "Síntomas",
    hint: "Señales de alerta y cuándo consultar",
    icon: "/brand/icons/nav/sintomas.svg",
  },
  {
    href: "/vacunacion",
    match: "vacunacion",
    label: "Vacunación",
    hint: "Calendario y centros cercanos",
    icon: "/brand/icons/nav/vacunacion.svg",
  },
  {
    href: "/faq",
    match: "faq",
    label: "Preguntas frecuentes",
    hint: "Respuestas rápidas y útiles",
    icon: "/brand/icons/nav/preguntas.svg",
  },
] as const;

export function MobileAppNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [causasOpen, setCausasOpen] = useState(true);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  if (pathname.startsWith("/admin")) return null;

  const queEsHref = pathname === "/home2" ? "/home2#que-es" : "/#que-es";
  const menuActive = menuOpen || pathname.startsWith("/faq");
  const causasActive =
    pathname === "/causas" || pathname.startsWith("/causas/");

  function closeMenu() {
    setMenuOpen(false);
  }

  function resolveHref(href: string, match: string) {
    if (match === "que-es") return queEsHref;
    return href;
  }

  return (
    <>
      {menuOpen ? (
        <div
          className="fixed inset-0 z-[60] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
        >
          <button
            type="button"
            aria-label="Cerrar menú"
            className="absolute inset-0 bg-[#120f18]/60 backdrop-blur-[2px] animate-fade-in"
            onClick={closeMenu}
          />

          <div className="absolute inset-x-0 bottom-0 flex max-h-[88svh] animate-fade-up flex-col overflow-hidden rounded-t-[24px] bg-white shadow-[0_-20px_60px_rgba(18,15,24,0.28)]">
            {/* Handle */}
            <div className="flex justify-center pt-3">
              <span className="h-1 w-10 rounded-full bg-[#D8D4DE]" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-4 pt-3">
              <Link
                href={pathname === "/home2" ? "/home2" : "/"}
                onClick={closeMenu}
                className="inline-flex items-center gap-3"
                aria-label={SITE_NAME}
              >
                <span className="flex size-11 items-center justify-center rounded-full bg-[#503C77]">
                  <LogoManito
                    variant="white"
                    className="h-7 w-auto"
                    width={28}
                    height={32}
                  />
                </span>
                <span>
                  <span className="block text-[15px] font-black leading-tight text-[#503C77]">
                    {SITE_NAME}
                  </span>
                  <span className="block text-[11px] font-medium text-[#6B6578]">
                    Información y prevención
                  </span>
                </span>
              </Link>
              <button
                type="button"
                onClick={closeMenu}
                className="flex size-10 items-center justify-center rounded-full bg-[#F3EFF8] text-[#503C77] transition active:scale-95"
                aria-label="Cerrar"
              >
                <span className="material-symbols-outlined text-[22px]">
                  close
                </span>
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-[calc(4.5rem+env(safe-area-inset-bottom))]">
              <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[#9B95A8]">
                Navegación
              </p>

              <div className="flex flex-col gap-1.5">
                {MENU_LINKS.map((item) => {
                  const href = resolveHref(item.href, item.match);
                  const active =
                    item.match === "que-es"
                      ? isHomeHeroRoute(pathname)
                      : isTabActive(pathname, item.match);

                  return (
                    <Link
                      key={item.href}
                      href={href}
                      onClick={closeMenu}
                      className={`flex items-center gap-3.5 rounded-[16px] px-3.5 py-3.5 transition active:scale-[0.99] ${
                        active
                          ? "bg-[#503C77] text-white shadow-[0_8px_24px_rgba(80,60,119,0.28)]"
                          : "bg-[#F7F5FA] text-[#503C77] hover:bg-[#EEEAF5]"
                      }`}
                    >
                      <span
                        className={`flex size-11 shrink-0 items-center justify-center rounded-[12px] ${
                          active ? "bg-white/15" : "bg-white"
                        }`}
                      >
                        <NavIcon
                          src={item.icon}
                          color={active ? "#FFFFFF" : "#503C77"}
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-bold leading-tight">
                          {item.label}
                        </span>
                        <span
                          className={`mt-0.5 block text-[12px] leading-snug ${
                            active ? "text-white/75" : "text-[#6B6578]"
                          }`}
                        >
                          {item.hint}
                        </span>
                      </span>
                      <span
                        className={`material-symbols-outlined text-[20px] ${
                          active ? "text-white/70" : "text-[#C4BED0]"
                        }`}
                      >
                        chevron_right
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Causas accordion */}
              <div className="mt-4 overflow-hidden rounded-[16px] bg-[#F7F5FA]">
                <button
                  type="button"
                  onClick={() => setCausasOpen((v) => !v)}
                  aria-expanded={causasOpen}
                  className={`flex w-full items-center gap-3.5 px-3.5 py-3.5 text-left transition ${
                    causasActive && !causasOpen ? "bg-[#503C77] text-white" : ""
                  }`}
                >
                  <span
                    className={`flex size-11 shrink-0 items-center justify-center rounded-[12px] ${
                      causasActive && !causasOpen
                        ? "bg-white/15"
                        : "bg-white"
                    }`}
                  >
                    <NavIcon
                      src="/brand/icons/nav/causas.svg"
                      color={
                        causasActive && !causasOpen ? "#FFFFFF" : "#503C77"
                      }
                    />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-[15px] font-bold leading-tight ${
                        causasActive && !causasOpen
                          ? "text-white"
                          : "text-[#503C77]"
                      }`}
                    >
                      Causas
                    </span>
                    <span
                      className={`mt-0.5 block text-[12px] leading-snug ${
                        causasActive && !causasOpen
                          ? "text-white/75"
                          : "text-[#6B6578]"
                      }`}
                    >
                      Bacteriana, viral, fúngica y parasitaria
                    </span>
                  </span>
                  <span
                    className={`material-symbols-outlined text-[22px] transition-transform duration-300 ${
                      causasOpen ? "rotate-180" : ""
                    } ${
                      causasActive && !causasOpen
                        ? "text-white/70"
                        : "text-[#9B95A8]"
                    }`}
                  >
                    expand_more
                  </span>
                </button>

                {causasOpen ? (
                  <div className="space-y-1.5 px-2.5 pb-2.5">
                    {CAUSAS_DROPDOWN.map((item) => {
                      const active = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMenu}
                          className={`flex items-start gap-3 rounded-[14px] px-3 py-3 transition ${
                            active
                              ? "bg-[#503C77] text-white"
                              : "bg-white text-[#503C77] shadow-[0_1px_0_rgba(80,60,119,0.04)]"
                          }`}
                        >
                          <span
                            className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full ${
                              active
                                ? "bg-white/15 text-[#FEC4B3]"
                                : "bg-[#F3EFF8] text-primary"
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px] leading-none">
                              {item.icon}
                            </span>
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[14px] font-bold leading-tight">
                              {item.title}
                            </span>
                            <span
                              className={`mt-0.5 block text-[12px] leading-snug ${
                                active ? "text-white/75" : "text-[#6B6578]"
                              }`}
                            >
                              {item.description}
                            </span>
                          </span>
                        </Link>
                      );
                    })}
                    <Link
                      href="/causas"
                      onClick={closeMenu}
                      className="flex items-center justify-between rounded-[14px] bg-white px-3.5 py-3 text-[13px] font-bold text-[#503C77]"
                    >
                      Ver todas las causas
                      <span className="material-symbols-outlined text-[18px] text-accent">
                        arrow_forward
                      </span>
                    </Link>
                  </div>
                ) : null}
              </div>

              {/* CTA */}
              <Link
                href="/autotest"
                onClick={closeMenu}
                className="mt-4 mb-2 flex items-center gap-3 rounded-[16px] bg-[#DD876E] px-4 py-4 text-white shadow-[0_10px_28px_rgba(221,135,110,0.35)] transition active:scale-[0.99]"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-[12px] bg-white/20">
                  <span className="material-symbols-outlined text-[22px]">
                    vaccines
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-black leading-tight">
                    ¿Estás al día con las vacunas?
                  </span>
                  <span className="mt-0.5 block text-[12px] text-white/85">
                    Completá el autotest en minutos
                  </span>
                </span>
                <span className="material-symbols-outlined text-[22px]">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>
        </div>
      ) : null}

      <nav
        className="fixed inset-x-0 bottom-0 z-[55] border-t border-[#e2e8f0] bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_1px_rgba(0,0,0,0.08)] lg:hidden"
        aria-label="Navegación principal"
      >
        <div className="grid h-14 grid-cols-5">
          {BOTTOM_TABS.map((tab) => {
            const href =
              tab.match === "que-es" && pathname === "/home2"
                ? "/home2#que-es"
                : tab.href;
            const active = isTabActive(pathname, tab.match);
            return (
              <Link
                key={tab.href}
                href={href}
                className={`flex min-w-0 flex-col items-center justify-center gap-1 px-0.5 ${
                  active
                    ? "border-t-[1.5px] border-[#442748] pt-px"
                    : "border-t-[1.5px] border-transparent"
                }`}
              >
                <NavIcon src={tab.icon} active={active} />
                <span
                  className={`max-w-full truncate text-[10px] leading-[15px] tracking-[0.04px] ${
                    active
                      ? "font-bold text-[#442748]"
                      : "font-normal text-[#9B95A8]"
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Abrir menú"
            className={`flex min-w-0 flex-col items-center justify-center gap-1 px-0.5 ${
              menuActive
                ? "border-t-[1.5px] border-[#442748] pt-px"
                : "border-t-[1.5px] border-transparent"
            }`}
          >
            <span
              className={`material-symbols-outlined text-[24px] leading-none ${
                menuActive ? "text-[#442748]" : "text-[#9B95A8]"
              }`}
            >
              {menuOpen ? "close" : "menu"}
            </span>
            <span
              className={`max-w-full truncate text-[10px] leading-[15px] tracking-[0.04px] ${
                menuActive
                  ? "font-bold text-[#442748]"
                  : "font-normal text-[#9B95A8]"
              }`}
            >
              Menú
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
