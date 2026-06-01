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
    // Conforme documentação oficial do Google:
    // https://developers.google.com/tag-platform/security/guides/csp
    const csp = [
      // GTM snippet inline + scripts externos do GTM e GA4
      // 'unsafe-inline' necessário para Next.js styled-jsx e script inline do GTM
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://googletagmanager.com https://tagmanager.google.com https://*.googletagmanager.com",

      // Modo de visualização GTM exige esses domínios de estilo
      "style-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://googletagmanager.com https://tagmanager.google.com https://fonts.googleapis.com",

      // Imagens: GA4 + GTM + modo preview + Supabase + domínio próprio
      "img-src 'self' data: blob: https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://googletagmanager.com https://*.googletagmanager.com https://ssl.gstatic.com https://www.gstatic.com https://*.supabase.co https://www.kanoffsolucoes.com.br",

      // Conexões: GA4 + GTM
      "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://*.googletagmanager.com https://*.supabase.co wss://*.supabase.co https://viacep.com.br",

      // Fontes: modo preview GTM usa Google Fonts
      "font-src 'self' data: https://fonts.gstatic.com",

      // Frames: GTM preview + Supabase (PDF do contrato)
      "frame-src 'self' https://www.googletagmanager.com https://googletagmanager.com https://*.googletagmanager.com https://*.supabase.co",

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
