"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOBILE_TAB_ITEMS, isHomeHeroRoute } from "@/lib/navLinks";

function isTabActive(pathname: string, match: string) {
  if (match === "que-es") return isHomeHeroRoute(pathname);
  return pathname === `/${match}` || pathname.startsWith(`/${match}/`);
}

function NavIcon({ src, active }: { src: string; active: boolean }) {
  return (
    <span
      aria-hidden
      className="block size-6 shrink-0"
      style={{
        backgroundColor: active ? "#442748" : "#9B95A8",
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

export function MobileAppNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-[55] border-t border-[#e2e8f0] bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_1px_rgba(0,0,0,0.08)] lg:hidden"
      aria-label="Navegación principal"
    >
      <div className="grid h-14 grid-cols-5">
        {MOBILE_TAB_ITEMS.map((tab) => {
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
      </div>
    </nav>
  );
}
