/** Tabs del menú inferior tipo app (mobile). */
export const MOBILE_TAB_ITEMS = [
  {
    href: "/#que-es",
    match: "que-es",
    label: "¿Qué es?",
    icon: "/brand/icons/nav/que-es.svg",
  },
  {
    href: "/sintomas",
    match: "sintomas",
    label: "Síntomas",
    icon: "/brand/icons/nav/sintomas.svg",
  },
  {
    href: "/causas",
    match: "causas",
    label: "Causas",
    icon: "/brand/icons/nav/causas.svg",
  },
  {
    href: "/vacunacion",
    match: "vacunacion",
    label: "Vacunación",
    icon: "/brand/icons/nav/vacunacion.svg",
  },
  {
    href: "/faq",
    match: "faq",
    label: "Preguntas",
    icon: "/brand/icons/nav/preguntas.svg",
  },
] as const;

/** Links desktop / footer */
export const NAV_LINKS = [
  { href: "/#que-es", label: "¿Qué es?" },
  { href: "/sintomas", label: "Síntomas" },
  { href: "/causas", label: "Causas", hasDropdown: true },
  { href: "/vacunacion", label: "Vacunación" },
  { href: "/faq", label: "Preguntas" },
] as const;

/** Items del desplegable de Causas (desktop). */
export const CAUSAS_DROPDOWN = [
  {
    href: "/causas/bacteriana",
    title: "Bacteriana",
    description: "La más grave; puede avanzar en pocas horas.",
    icon: "emergency",
  },
  {
    href: "/causas/viral",
    title: "Viral",
    description: "La más frecuente; suele tener mejor evolución.",
    icon: "coronavirus",
  },
  {
    href: "/causas/fungica",
    title: "Fúngica",
    description: "Poco frecuente; más riesgosa si hay inmunodepresión.",
    icon: "microbiology",
  },
  {
    href: "/causas/parasitaria",
    title: "Parasitaria",
    description: "Poco frecuente; asociada a alimentos contaminados.",
    icon: "bug_report",
  },
] as const;

/** Rutas con hero a pantalla completa (navbar transparente sobre el cielo). */
export function isHomeHeroRoute(pathname: string): boolean {
  return pathname === "/" || pathname === "/home2";
}
