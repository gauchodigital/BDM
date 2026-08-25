export const TIPOS_VACUNATORIO = ["Farmacia", "Hospital", "Vacunatorio"] as const;

export type TipoVacunatorio = (typeof TIPOS_VACUNATORIO)[number] | string;

export interface CentroVacunacion {
  id: string;
  nombre: string;
  tipo: TipoVacunatorio;
  provincia: string;
  localidad: string;
  barrio?: string;
  direccion: string;
  lat?: number;
  lng?: number;
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values.map((v) => v.trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "es"),
  );
}

export function parseCentros(raw: unknown): CentroVacunacion[] {
  if (Array.isArray(raw)) return raw as CentroVacunacion[];
  if (raw && typeof raw === "object" && "centros" in raw) {
    return (raw as { centros: CentroVacunacion[] }).centros ?? [];
  }
  return [];
}

export function localidadesDe(
  centros: CentroVacunacion[],
  provincia: string,
): string[] {
  return uniqueSorted(
    centros.filter((c) => c.provincia === provincia).map((c) => c.localidad),
  );
}

export function barriosDe(
  centros: CentroVacunacion[],
  provincia: string,
  localidad: string,
): string[] {
  return uniqueSorted(
    centros
      .filter((c) => c.provincia === provincia && c.localidad === localidad)
      .map((c) => c.barrio ?? ""),
  );
}

export function filtrarCentros(
  centros: CentroVacunacion[],
  {
    provincia,
    localidad,
    barrio,
    tipo,
  }: {
    provincia: string;
    localidad: string;
    barrio: string;
    tipo: string;
  },
): CentroVacunacion[] {
  if (!provincia) return [];
  return centros.filter((c) => {
    if (c.provincia !== provincia) return false;
    if (localidad && c.localidad !== localidad) return false;
    if (barrio && (c.barrio ?? "") !== barrio) return false;
    if (tipo && tipo !== "Todos" && c.tipo !== tipo) return false;
    return true;
  });
}

export function mapsSearchUrl(centro: CentroVacunacion): string {
  if (centro.lat != null && centro.lng != null) {
    return `https://www.google.com/maps/search/?api=1&query=${centro.lat},${centro.lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${centro.direccion}, ${centro.localidad}, ${centro.provincia}`,
  )}`;
}

export function mapsDirectionsUrl(centro: CentroVacunacion): string {
  const dest =
    centro.lat != null && centro.lng != null
      ? `${centro.lat},${centro.lng}`
      : `${centro.direccion}, ${centro.localidad}, ${centro.provincia}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`;
}

export function mapsEmbedQuery(provincia: string, localidad: string): string {
  return [localidad, provincia, "Argentina"].filter(Boolean).join(", ");
}
