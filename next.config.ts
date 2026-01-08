import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // ✅ SOLUCIÓN MODERNA Y ESCALABLE (2026):
    // - Usa remotePatterns en lugar de domains (deprecated)
    // - Especifica protocolo explícitamente para mayor seguridad
    // - Permite control granular sobre hostname, pathname y puerto
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ui.shadcn.com",
        pathname: "/**",
      },
      // Agregar más dominios según necesidad:
      // {
      //   protocol: "https",
      //   hostname: "*.example.com",
      //   pathname: "/images/**",
      //   port: "443",
      // },
    ],
  },
};

export default nextConfig;
