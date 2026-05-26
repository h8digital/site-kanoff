// build: 2026-05-26 01:22:52 UTC
import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.kanoffsolucoes.com.br'

  // Páginas estáticas
  const estaticas: MetadataRoute.Sitemap = [
    { url:`${BASE}/`,             lastModified:new Date(), changeFrequency:'weekly',  priority:1.0 },
    { url:`${BASE}/equipamentos`, lastModified:new Date(), changeFrequency:'daily',   priority:0.9 },
    { url:`${BASE}/sobre`,        lastModified:new Date(), changeFrequency:'monthly', priority:0.7 },
    { url:`${BASE}/contato`,      lastModified:new Date(), changeFrequency:'monthly', priority:0.6 },
  ]

  // Equipamentos publicados
  const { data } = await supabase
    .from('produtos')
    .select('slug,id,updated_at')
    .eq('publicado_site', true)
    .eq('ativo', 1)

  const equipamentos: MetadataRoute.Sitemap = (data ?? []).map((p: any) => ({
    url:             `${BASE}/equipamentos/${p.slug ?? p.id}`,
    lastModified:    p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority:        0.8,
  }))

  return [...estaticas, ...equipamentos]
}
