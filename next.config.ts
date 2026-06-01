// build: 2026-06-01
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol:'https', hostname:'www.kanoffsolucoes.com.br' },
      { protocol:'https', hostname:'ojgapdjobnflcawfshir.supabase.co' },
    ],
  },

  async headers() {
    const csp = [
      // script-src cobre a maioria dos navegadores
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googletagmanager.com",

      // script-src-elem sobrescreve script-src em Chrome/Edge modernos — GTM exige isso
      "script-src-elem 'self' 'unsafe-inline' https://*.googletagmanager.com",

      // script-src-attr para handlers inline (onclick etc)
      "script-src-attr 'unsafe-inline'",

      // Estilos
      "style-src 'self' 'unsafe-inline'",
      "style-src-elem 'self' 'unsafe-inline'",
      "style-src-attr 'unsafe-inline'",

      // Imagens
      "img-src 'self' data: blob: https://*.google-analytics.com https://*.googletagmanager.com https://*.supabase.co https://www.kanoffsolucoes.com.br",

      // Conexões: GA4, GTM, Supabase, ViaCEP
      "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://www.google-analytics.com https://*.supabase.co wss://*.supabase.co https://viacep.com.br",

      // Frames: GTM preview + Supabase (PDF)
      "frame-src 'self' https://*.googletagmanager.com https://*.supabase.co",

      // Workers: GA4 usa service workers
      "worker-src 'self' blob:",

      "font-src 'self' data:",
      "object-src 'none'",
      "default-src 'self'",
    ].join('; ')

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy',   value: csp },
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

export default nextConfig
