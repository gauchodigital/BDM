"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LogoManito } from "@/components/layout/LogoManito";
import { SITE_NAME } from "@/lib/siteLinks";
import {
  CAUSAS_DROPDOWN,
  NAV_LINKS,
  isHomeHeroRoute,
} from "@/lib/navLinks";

function isLinkActive(pathname: string, href: string) {
  const pathOnly = href.split("#")[0] || "/";
  if (pathOnly === "/" || pathOnly === "/home2") {
    return pathname === pathOnly;
  }
  return pathname === pathOnly || pathname.startsWith(`${pathOnly}/`);
}

function CausasDropdown({
  open,
  onClose,
  solid,
}: {
  open: boolean;
  onClose: () => void;
  solid: boolean;
}) {
  if (!open) return null;

  return (
    <div
      className={`absolute right-0 top-[calc(100%+10px)] z-50 w-[340px] overflow-hidden rounded-[18px] border p-2 pt-3 shadow-[0_16px_48px_rgba(18,15,24,0.18)] before:absolute before:inset-x-0 before:-top-3 before:h-3 before:content-[''] ${
        solid
          ? "border-[#E8E4EC] bg-white"
          : "border-white/20 bg-[#1a1428] shadow-[0_16px_48px_rgba(0,0,0,0.45)]"
      }`}
      role="menu"
    >
      {CAUSAS_DROPDOWN.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          role="menuitem"
          onClick={onClose}
          className={`flex items-start gap-3 rounded-[12px] px-3 py-3 transition ${
            solid ? "hover:bg-[#F3EFF8]" : "hover:bg-white/10"
          }`}
        >
          <span
            className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full ${
              solid ? "bg-[#F3EFF8] text-primary" : "bg-white/12 text-[#FEC4B3]"
            }`}
          >
            <span className="material-symbols-outlined text-[20px] leading-none">
              {item.icon}
            </span>
          </span>
          <span className="min-w-0">
            <span
              className={`block text-[14px] font-bold leading-tight ${
                solid ? "text-[#503C77]" : "text-white"
              }`}
            >
              {item.title}
            </span>
            <span
              className={`mt-0.5 block text-[12px] leading-snug ${
                solid ? "text-[#6B6578]" : "text-white/65"
              }`}
            >
              {item.description}
            </span>
          </span>
        </Link>
      ))}

      <div
        className={`mx-2 my-1 h-px ${solid ? "bg-[#E8E4EC]" : "bg-white/15"}`}
      />

      <Link
        href="/causas"
        onClick={onClose}
        className={`flex items-center justify-between rounded-[12px] px-3 py-2.5 text-[13px] font-bold transition ${
          solid
            ? "text-primary hover:bg-[#F3EFF8]"
            : "text-[#FEC4B3] hover:bg-white/10"
        }`}
      >
        Ver todas las causas
        <span className="material-symbols-outlined text-[18px]">
          arrow_forward
        </span>
      </Link>
    </div>
  );
}

function NavLinks({
  pathname,
  queEsHref,
  solid,
}: {
  pathname: string;
  queEsHref: string;
  solid: boolean;
}) {
  const [causasOpen, setCausasOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) {
        setCausasOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function openCausas() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setCausasOpen(true);
  }

  function scheduleClose() {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setCausasOpen(false), 160);
  }

  return (
    <div ref={wrapRef} className="flex items-center gap-0.5">
      {NAV_LINKS.map((link) => {
        const href = link.href === "/#que-es" ? queEsHref : link.href;
        const active = isLinkActive(pathname, href);
        const isCausas = "hasDropdown" in link && link.hasDropdown;

        if (isCausas) {
          return (
            <div
              key={link.href}
              className="relative"
              onMouseEnter={openCausas}
              onMouseLeave={scheduleClose}
            >
              <button
                type="button"
                aria-expanded={causasOpen}
                aria-haspopup="menu"
                onClick={() => setCausasOpen((v) => !v)}
                onFocus={openCausas}
                className={`inline-flex items-center gap-1 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors xl:px-4 xl:text-[14px] ${
                  active || causasOpen
                    ? "bg-accent text-white shadow-[0_4px_14px_rgba(221,135,110,0.35)]"
                    : solid
                      ? "text-[#503C77]/75 hover:bg-[#F3EFF8] hover:text-[#503C77]"
                      : "text-white/85 hover:bg-white/15 hover:text-white"
                }`}
              >
                {link.label}
                <span
                  className={`material-symbols-outlined text-[16px] leading-none transition-transform ${
                    causasOpen ? "rotate-180" : ""
                  }`}
                >
                  expand_more
                </span>
              </button>

              <CausasDropdown
                open={causasOpen}
                onClose={() => setCausasOpen(false)}
                solid={solid}
              />
            </div>
          );
        }

        return (
          <Link
            key={link.href}
            href={href}
            className={`rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors xl:px-4 xl:text-[14px] ${
              active
                ? "bg-accent text-white shadow-[0_4px_14px_rgba(221,135,110,0.35)]"
                : solid
                  ? "text-[#503C77]/75 hover:bg-[#F3EFF8] hover:text-[#503C77]"
                  : "text-white/85 hover:bg-white/15 hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}

/**
 * Sticky home 1 / páginas:
 * - Pastilla blanca (logo + menú juntos)
 * - Al tope del home: logo suelto + pill de menú vidrio
 */
function DesktopNav({
  pathname,
  queEsHref,
  solid,
}: {
  pathname: string;
  queEsHref: string;
  solid: boolean;
}) {
  if (solid) {
    return (
      <div className="flex h-[56px] w-full items-center justify-between gap-4 rounded-full border border-[#E8E4EC] bg-white px-2 shadow-[0_10px_36px_rgba(18,15,24,0.14)]">
        <Link
          href="/"
          className="inline-flex shrink-0 items-center pl-3"
          aria-label={SITE_NAME}
        >
          <LogoManito
            variant="purple"
            priority
            className="h-10 w-auto"
            width={40}
            height={44}
          />
        </Link>
        <div className="pr-1">
          <NavLinks pathname={pathname} queEsHref={queEsHref} solid />
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-between gap-6">
      <Link
        href="/"
        className="inline-flex shrink-0 items-center"
        aria-label={SITE_NAME}
      >
        <LogoManito
          variant="white"
          priority
          className="h-12 w-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]"
          width={48}
          height={52}
        />
      </Link>

      <div className="flex h-[52px] items-center rounded-full border border-white/25 bg-white/12 px-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-md">
        <NavLinks pathname={pathname} queEsHref={queEsHref} solid={false} />
      </div>
    </div>
  );
}

/** Home 2 — barra violeta tradicional (logo + links, sticky). */
function DesktopNavTraditional({
  pathname,
  queEsHref,
}: {
  pathname: string;
  queEsHref: string;
}) {
  return (
    <div className="flex h-[72px] w-full items-center justify-between gap-6">
      <Link
        href="/home2"
        className="inline-flex shrink-0 items-center"
        aria-label={SITE_NAME}
      >
        <LogoManito
          variant="white"
          priority
          className="h-12 w-auto"
          width={48}
          height={52}
        />
      </Link>
      <NavLinks pathname={pathname} queEsHref={queEsHref} solid={false} />
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  const isHome2 = pathname === "/home2";
  const isHome1 = pathname === "/";
  const isHome = isHomeHeroRoute(pathname);
  const queEsHref = isHome2 ? "/home2#que-es" : "/#que-es";
  const solid = scrolled || !isHome1;

  return (
    <>
      {/* Mobile */}
      {isHome && !isHome2 ? (
        <header className="absolute inset-x-0 top-0 z-50 lg:hidden">
          <nav className="flex items-center px-6 pt-[max(1.75rem,env(safe-area-inset-top))] pb-2">
            <Link
              href="/"
              className="inline-flex items-center"
              aria-label={SITE_NAME}
            >
              <LogoManito
                variant="white"
                priority
                className="h-14 w-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
              />
            </Link>
          </nav>
        </header>
      ) : (
        <header className="bg-primary lg:hidden">
          <nav className="flex items-center px-5 py-4">
            <Link
              href={isHome2 ? "/home2" : "/"}
              className="inline-flex items-center"
              aria-label={SITE_NAME}
            >
              <LogoManito
                variant="white"
                className="h-14 w-auto"
                width={52}
                height={58}
              />
            </Link>
          </nav>
        </header>
      )}

      {/* Desktop home 2 — tradicional violeta */}
      {isHome2 ? (
        <header className="sticky top-0 z-50 hidden bg-primary lg:block">
          <div className="px-5 md:px-8">
            <nav
              className="mx-auto w-full max-w-7xl"
              aria-label="Navegación principal"
            >
              <DesktopNavTraditional
                pathname={pathname}
                queEsHref={queEsHref}
              />
            </nav>
          </div>
        </header>
      ) : (
        <header
          className={
            isHome1
              ? `fixed inset-x-0 top-0 z-50 hidden bg-transparent transition-[padding] duration-300 lg:block ${
                  solid ? "pb-2 pt-3" : "pb-2 pt-5"
                }`
              : "sticky top-0 z-50 hidden bg-transparent pb-2 pt-3 lg:block"
          }
        >
          <div className="px-5 md:px-8">
            <nav
              className="mx-auto w-full max-w-7xl"
              aria-label="Navegación principal"
            >
              <DesktopNav
                pathname={pathname}
                queEsHref={queEsHref}
                solid={solid}
              />
            </nav>
          </div>
        </header>
      )}
    </>
  );
}
