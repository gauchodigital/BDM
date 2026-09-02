"use client";

const COLORS = [
  "#FEC4B3",
  "#B8B5E8",
  "#503C77",
  "#DD876E",
  "#FFFFFF",
  "#C9A8E8",
  "#7A78BB",
  "#FFD6AA",
];

const BURSTS = [
  { x: "22%", y: "42%", delay: 0, particles: 18, distance: 72 },
  { x: "50%", y: "32%", delay: 0.15, particles: 20, distance: 88 },
  { x: "78%", y: "44%", delay: 0.3, particles: 18, distance: 76 },
  { x: "35%", y: "58%", delay: 0.5, particles: 14, distance: 64 },
  { x: "65%", y: "56%", delay: 0.65, particles: 14, distance: 68 },
  { x: "50%", y: "48%", delay: 0.85, particles: 16, distance: 56 },
] as const;

/** Fuegos artificiales CSS al completar el hold del popup home 2. */
export function PopupFireworks() {
  return (
    <div
      className="popup-fireworks pointer-events-none absolute inset-0 z-20 overflow-hidden"
      aria-hidden
    >
      {BURSTS.map((burst, burstIndex) =>
        Array.from({ length: burst.particles }, (_, particleIndex) => {
          const angle = (360 / burst.particles) * particleIndex + burstIndex * 8;
          const color = COLORS[(burstIndex + particleIndex) % COLORS.length];
          const isStreak = particleIndex % 2 === 0;
          const distance = burst.distance + (particleIndex % 5) * 12;

          return (
            <span
              key={`${burstIndex}-${particleIndex}`}
              className={
                isStreak
                  ? "popup-firework-streak absolute"
                  : "popup-firework-particle absolute"
              }
              style={{
                left: burst.x,
                top: burst.y,
                backgroundColor: color,
                animationDelay: `${burst.delay}s`,
                ["--fw-angle" as string]: `${angle}deg`,
                ["--fw-distance" as string]: `${distance}px`,
              }}
            />
          );
        }),
      )}
      <span className="popup-firework-flash absolute left-1/2 top-[42%]" />
      <span
        className="popup-firework-flash popup-firework-flash-delayed absolute left-[28%] top-[52%]"
        style={{ animationDelay: "0.28s" }}
      />
      <span
        className="popup-firework-flash popup-firework-flash-delayed absolute left-[72%] top-[50%]"
        style={{ animationDelay: "0.52s" }}
      />
      <span className="popup-firework-ring absolute left-1/2 top-[42%]" />
    </div>
  );
}
