import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const SOURCE = path.join(
  ROOT,
  "_tmp-ubicaciones/data/vacunatorios_coordinates_con_barrios.json",
);
const OUTPUT = path.join(ROOT, "centros-data.json");

const PROVINCIA_MAP = {
  "Capital Federal": "CABA",
  Cordoba: "Córdoba",
  "Entre Rios": "Entre Ríos",
  Neuquen: "Neuquén",
  "Rio Negro": "Río Negro",
  "Santiago Del Estero": "Santiago del Estero",
  "Tierra Del Fuego": "Tierra del Fuego",
  Tucuman: "Tucumán",
};

function normalizeProvincia(provincia) {
  const trimmed = (provincia ?? "").trim();
  return PROVINCIA_MAP[trimmed] ?? trimmed;
}

/** @param {{ nombre?: string; tipo?: string }} row */
export function classifyTipoCentro(row) {
  const nombre = (row.nombre ?? "").toLowerCase();
  const tipoRaw = (row.tipo ?? "").toLowerCase();
  const combined = `${nombre} ${tipoRaw}`;

  if (row.tipo === "Vacunatorio" || /vacunatorio|vacunar/.test(combined)) {
    return "Vacunatorio";
  }
  if (
    /hospital|cl[ií]nica|clinica|sanatorio|instituto m[eé]dico|medical|m[eé]dico/.test(
      combined,
    )
  ) {
    return "Hospital";
  }
  if (/farmacia|pharmacy|droguer[ií]a|farmacity|farmaplus|farma/.test(combined)) {
    return "Farmacia";
  }
  if (row.tipo === "Farmacia") return "Farmacia";
  return "Farmacia";
}

function transformRow(row) {
  const barrio = (row.barrio ?? "").trim();
  return {
    id: String(row.id),
    nombre: (row.nombre ?? "").trim(),
    tipo: classifyTipoCentro(row),
    provincia: normalizeProvincia(row.provincia),
    localidad: (row.localidad ?? "").trim(),
    ...(barrio ? { barrio } : {}),
    direccion: (row.domicilio ?? "").trim(),
    telefono: (row.telefono ?? "").trim(),
    lat: typeof row.lat === "number" ? row.lat : undefined,
    lng: typeof row.lng === "number" ? row.lng : undefined,
  };
}

function main() {
  if (!fs.existsSync(SOURCE)) {
    console.error("Missing source file:", SOURCE);
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(SOURCE, "utf-8"));
  const rows = Array.isArray(raw) ? raw : (raw.data ?? []);
  const centros = rows.map(transformRow).filter((c) => c.nombre && c.provincia);

  const byTipo = centros.reduce(
    (acc, c) => {
      acc[c.tipo] = (acc[c.tipo] ?? 0) + 1;
      return acc;
    },
    /** @type {Record<string, number>} */ ({}),
  );

  fs.writeFileSync(OUTPUT, JSON.stringify(centros));
  console.log(`Wrote ${centros.length} centros to ${OUTPUT}`);
  console.log("By tipo:", byTipo);
}

main();
