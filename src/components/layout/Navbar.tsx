"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { VACUNARSE_URL } from "@/lib/siteLinks";
import { TRACK } from "@/lib/analytics";
import { NAV_LINKS } from "@/lib/navLinks";

export function Navbar() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-50 bg-primary">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 md:h-16 md:px-8">
        <Link href="/" className="inline-flex items-center" aria-label="BastaDeMeningitis">
          <Image
            src="/brand/logo-manito-white.png"
            alt=""
            width={58}
            height={64}
            className="h-9 w-auto md:h-10"
            priority
          />
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => {
            const pathOnly = link.href.split("#")[0] || "/";
            const active =
              pathOnly === "/"
                ? pathname === "/"
                : pathname === pathOnly || pathname.startsWith(pathOnly + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  active ? "text-white" : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Button
            href={VACUNARSE_URL}
            external
            variant="onPrimary"
            className="!py-2 !px-4 text-xs"
            trackEvent={TRACK.events.vacunarseClick}
            trackLocation="navbar"
          >
            Vacunarse ahora
          </Button>
        </div>
      </nav>
    </header>
  );
}
