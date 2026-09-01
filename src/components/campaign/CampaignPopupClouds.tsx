import Image from "next/image";

const CLOUD = {
  puffy: { src: "/home/clouds/cloud-puffy.webp", width: 1400, height: 811 },
  bubbles: { src: "/home/clouds/cloud-bubbles.webp", width: 1404, height: 833 },
} as const;

interface PopupCloud {
  id: string;
  art: keyof typeof CLOUD;
  top?: string;
  bottom?: string;
  width: string;
  opacity: number;
  duration: number;
  phase: number;
  flip?: boolean;
  squash?: number;
}

/** Nubes de fondo: recorren la pantalla detrás del modal. */
const BACKDROP_CLOUDS: PopupCloud[] = [
  {
    id: "bg-1",
    art: "puffy",
    top: "8%",
    width: "min(58vw, 420px)",
    opacity: 0.72,
    duration: 52,
    phase: 0.12,
  },
  {
    id: "bg-2",
    art: "bubbles",
    top: "34%",
    width: "min(46vw, 320px)",
    opacity: 0.55,
    duration: 64,
    phase: 0.48,
    flip: true,
  },
  {
    id: "bg-3",
    art: "puffy",
    bottom: "10%",
    width: "min(72vw, 520px)",
    opacity: 0.82,
    duration: 44,
    phase: 0.72,
    squash: 0.94,
  },
];

/** Nubes en primer plano: asoman por arriba y abajo del modal. */
const FOREGROUND_CLOUDS: PopupCloud[] = [
  {
    id: "fg-top",
    art: "bubbles",
    top: "-4%",
    width: "min(88vw, 560px)",
    opacity: 0.9,
    duration: 38,
    phase: 0.3,
    flip: true,
  },
  {
    id: "fg-bottom",
    art: "puffy",
    bottom: "-10%",
    width: "min(95vw, 620px)",
    opacity: 0.95,
    duration: 34,
    phase: 0.62,
    squash: 0.9,
  },
];

function DriftingCloud({ cloud }: { cloud: PopupCloud }) {
  const art = CLOUD[cloud.art];
  const shape = [
    cloud.flip ? "scaleX(-1)" : null,
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
        animationDuration: `${cloud.duration}s`,
        animationDelay: `${-cloud.duration * cloud.phase}s`,
        ["--rest-x" as string]: `calc((-101vw - 100%) * ${cloud.phase})`,
      }}
    >
      <Image
        src={art.src}
        alt=""
        width={art.width}
        height={art.height}
        sizes="(max-width: 768px) 90vw, 560px"
        className="h-auto w-full select-none"
        style={shape ? { transform: shape } : undefined}
        aria-hidden
      />
    </div>
  );
}

/** Cielo + nubes animadas del popup de campaña (mismas que el hero). */
export function CampaignPopupClouds() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,#001B36_0%,#002540_30%,#003551_60%,#004F6D_100%)]" />
        {BACKDROP_CLOUDS.map((cloud) => (
          <DriftingCloud key={cloud.id} cloud={cloud} />
        ))}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,rgba(122,120,187,0.18)_0%,transparent_58%)]" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[5] overflow-hidden"
        aria-hidden
      >
        {FOREGROUND_CLOUDS.map((cloud) => (
          <DriftingCloud key={cloud.id} cloud={cloud} />
        ))}
      </div>
    </>
  );
}
