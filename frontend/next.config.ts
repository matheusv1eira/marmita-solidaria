import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Configurações de Domínios para Imagens (Django / Avatares) */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/**',
      },
    ],
  },
  
  /* Turbopack e Otimizações de Compilação */
  turbopack: {
    // Regras otimizadas para o Tailwind CSS v4 / Turbopack
    rules: {
      "*.css": {
        loaders: ["postcss-loader"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;