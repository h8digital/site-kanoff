// build: 2026-05-29 17:55:15
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol:'https', hostname:'www.kanoffsolucoes.com.br' },
      { protocol:'https', hostname:'ojgapdjobnflcawfshir.supabase.co' },
    ],
  },
}

export default nextConfig
