import Image from "next/image";

/**
 * Cielo del hero armado con las nubes 3D reales en lugar del banner plano.
 * El degradé replica el muestreado del banner original (#001B36 → #004F6D)
 * y cada nube deriva en horizontal a distinta velocidad para dar parallax.
 */

const CLOUDS = {
  puffy: { src: "/home/clouds/cloud-puffy.webp", width: 1400, height: 811 },
  bubbles: { src: "/home/clouds/cloud-bubbles.webp", width: 1404, height: 833 },
} as const;

interface Cloud {
  id: string;
  art: keyof typeof CLOUDS;
  /** Distancia al borde superior; usar `bottom` para el banco inferior. */
  top?: string;
  bottom?: string;
  width: string;
  opacity: number;
  blur?: number;
  /** Duración de la travesía completa, en segundos. */
  duration: number;
  /** Punto del recorrido en el que arranca (0 = entrando por la derecha). */
  phase: number;
  priority?: boolean;
  /** Espeja en horizontal: con sólo dos dibujos, evita siluetas repetidas. */
  flip?: boolean;
  /** Inclinación en grados. */
  tilt?: number;
  /** Achatado vertical (1 = sin deformar). */
  squash?: number;
}

/** Composición ancha: capas lejana, media y el banco inferior en primer plano. */
const DESKTOP_CLOUDS: Cloud[] = [
  // Todas ancladas por arriba: ninguna toca el borde inferior, así el piso
  // queda como cielo abierto. La más baja termina cerca del 78% de la altura.
  { id: "sky-1", art: "bubbles", top: "3%", width: "clamp(100px, 10vw, 180px)", opacity: 0.36, blur: 2.5, duration: 172, phase: 0.08, flip: true, tilt: -3 },
  { id: "sky-2", art: "puffy", top: "10%", width: "clamp(185px, 18vw, 330px)", opacity: 0.72, blur: 0.8, duration: 124, phase: 0.25, priority: true, tilt: 2, squash: 0.95 },
  { id: "sky-3", art: "puffy", top: "21%", width: "clamp(80px, 8vw, 145px)", opacity: 0.3, blur: 3, duration: 196, phase: 0.42, tilt: 4, squash: 0.9 },
  { id: "sky-4", art: "puffy", top: "28%", width: "clamp(210px, 21vw, 375px)", opacity: 0.68, blur: 1, duration: 132, phase: 0.68, tilt: -4, squash: 1.04 },
  { id: "sky-5", art: "bubbles", top: "38%", width: "clamp(145px, 14vw, 255px)", opacity: 0.55, blur: 1.4, duration: 148, phase: 0.58, flip: true, tilt: -2, squash: 1.06 },
  { id: "sky-6", art: "bubbles", top: "44%", width: "clamp(115px, 11.5vw, 205px)", opacity: 0.42, blur: 2, duration: 164, phase: 0.92, tilt: 3, squash: 0.92 },
  // Capa baja: flota sobre el piso en vez de apoyarse en él. Va más chica que
  // antes para poder colgar bien abajo sin meterse detrás del título.
  { id: "low-1", art: "bubbles", top: "52%", width: "clamp(255px, 28vw, 490px)", opacity: 1, duration: 72, phase: 0.5, priority: true, flip: true, tilt: 2, squash: 0.94 },
  { id: "low-2", art: "puffy", top: "58%", width: "clamp(190px, 20vw, 350px)", opacity: 1, duration: 86, phase: 0.15, priority: true },
  { id: "low-3", art: "puffy", top: "55%", width: "clamp(230px, 24vw, 430px)", opacity: 0.95, blur: 0.4, duration: 98, phase: 0.82, flip: true, tilt: -3, squash: 1.05 },
];

/** Composición vertical: nubes arriba y banco abajo, dejando limpio el centro. */
const MOBILE_CLOUDS: Cloud[] = [
  { id: "m-far-1", art: "bubbles", top: "4%", width: "clamp(150px, 42vw, 280px)", opacity: 0.5, blur: 2, duration: 150, phase: 0.3, flip: true, tilt: -4 },
  { id: "m-top-1", art: "puffy", top: "10%", width: "clamp(240px, 66vw, 420px)", opacity: 0.88, blur: 0.6, duration: 112, phase: 0.62, priority: true, tilt: 2 },
  { id: "m-near-1", art: "puffy", bottom: "-6%", width: "clamp(420px, 115vw, 700px)", opacity: 1, duration: 88, phase: 0.25, priority: true, flip: true, squash: 0.95 },
  { id: "m-near-2", art: "bubbles", bottom: "-12%", width: "clamp(460px, 128vw, 780px)", opacity: 1, duration: 74, phase: 0.7, priority: true, tilt: -2 },
];

function CloudLayer({ cloud }: { cloud: Cloud }) {
  const art = CLOUDS[cloud.art];
  // Va sobre la imagen y no sobre el contenedor: ahí el transform lo usa la deriva.
  const shape = [
    cloud.flip ? "scaleX(-1)" : null,
    cloud.tilt ? `rotate(${cloud.tilt}deg)` : null,
    cloud.squash && cloud.squash !== 1 ? `scaleY(${cloud.squash})` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className="cloud-drift absolute"
      style={{
        top: cloud.top,
        bottom: cloud.bottom,
        width: cloud.width,
        opacity: cloud.opacity,
        filter: cloud.blur ? `blur(${cloud.blur}px)` : undefined,
        animationDuration: `${cloud.duration}s`,
        animationDelay: `${-cloud.duration * cloud.phase}s`,
        // posición congelada equivalente cuando se reduce el movimiento
        ["--rest-x" as string]: `calc((-101vw - 100%) * ${cloud.phase})`,
      }}
    >
      <Image
        src={art.src}
        alt=""
        width={art.width}
        height={art.height}
        priority={cloud.priority}
        sizes="(max-width: 1024px) 100vw, 55vw"
        className="h-auto w-full select-none"
        style={shape ? { transform: shape } : undefined}
        aria-hidden
      />
    </div>
  );
}

export function SkyBackdrop({ variant }: { variant: "mobile" | "desktop" }) {
  const clouds = variant === "mobile" ? MOBILE_CLOUDS : DESKTOP_CLOUDS;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[linear-gradient(to_bottom_right,#001B36_0%,#002540_25%,#003551_50%,#004260_75%,#004F6D_100%)]"
      aria-hidden
    >
      {clouds.map((cloud) => (
        <CloudLayer key={cloud.id} cloud={cloud} />
      ))}

      {/* Scrim: oscurece sólo la banda donde va el texto. La máscara vertical
          lo desvanece hacia abajo para que el banco de nubes siga brillando. */}
      {variant === "mobile" ? (
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,27,54,0.5)_0%,rgba(0,27,54,0.12)_22%,rgba(0,27,54,0.38)_48%,rgba(0,27,54,0.28)_72%,rgba(0,27,54,0)_100%)]" />
      ) : (
        <div
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,27,54,0.97)_0%,rgba(0,27,54,0.8)_30%,rgba(0,27,54,0.3)_58%,rgba(0,27,54,0)_78%)]"
          style={{
            maskImage:
              "linear-gradient(to bottom, #000 0%, #000 70%, transparent 94%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, #000 0%, #000 70%, transparent 94%)",
          }}
        />
      )}
    </div>
  );
}
