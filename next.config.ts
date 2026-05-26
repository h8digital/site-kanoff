// build: 2026-05-26 01:22:52 UTC
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
