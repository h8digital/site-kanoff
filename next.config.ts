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
      // Scripts: próprio domínio + GTM (inline necessário para Next.js)
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googletagmanager.com",

      // Estilos: inline necessário para styled-jsx / Next.js
      "style-src 'self' 'unsafe-inline'",

      // Imagens: domínio próprio + GA + GTM + Supabase Storage + WordPress (logo/favicon)
      "img-src 'self' data: blob: https://*.google-analytics.com https://*.googletagmanager.com https://*.supabase.co https://www.kanoffsolucoes.com.br",

      // Conexões: API do site + GA + GTM + Supabase REST/Realtime + ViaCEP
      "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.supabase.co wss://*.supabase.co https://viacep.com.br",

      // Frames/iframes: GTM preview + Supabase Storage (PDF do contrato)
      "frame-src 'self' https://*.googletagmanager.com https://*.supabase.co",

      // Fontes e objetos
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
