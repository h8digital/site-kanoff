import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.kanoffsolucoes.com.br'
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/carrinho', '/minha-conta'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  }
}
