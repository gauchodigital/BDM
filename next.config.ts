import type { NextConfig } from "next";

/**
 * Export estático para subir por FTP/WinSCP (carpeta `out/`).
 * Look & feel, JS cliente (mapa, autotest, Firebase dashboard) se conservan.
 * `/admin` con server actions no aplica en estático (stub).
 */
const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
  trailingSlash: true,
};

export default nextConfig;
