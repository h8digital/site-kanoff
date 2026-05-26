// build: 2026-05-26 hero-dynamic
import Link from 'next/link'
import HeroClient from './HeroClient'
import { supabase } from '@/lib/supabase'

async function getSiteConfig() {
  const { data } = await supabase
    .from('site_config')
    .select('chave,valor')
    .in('chave', [
      'hero_titulo', 'hero_subtitulo', 'hero_bg_url',
      'hero_cta_texto', 'hero_cta2_texto',
      'stat_equipamentos', 'stat_categorias', 'stat_prazo',
      'empresa_whatsapp',
    ])
  const map: Record<string,string> = {}
  ;(data ?? []).forEach(r => { map[r.chave] = r.valor ?? '' })
  return map
}

export default async function HeroSection() {
  const cfg = await getSiteConfig()

  const titulo    = cfg.hero_titulo    || 'EQUIPAMENTOS PRONTOS PARA SUA OBRA'
  const subtitulo = cfg.hero_subtitulo || 'Alugue andaimes, betoneiras e equipamentos para construção civil. Cotação online em minutos. Entrega e retirada em Sapucaia do Sul e região metropolitana.'
  const bgUrl     = cfg.hero_bg_url   || ''
  const cta1      = cfg.hero_cta_texto  || 'Ver Equipamentos'
  const cta2      = cfg.hero_cta2_texto || 'Falar no WhatsApp'
  const whatsapp  = cfg.empresa_whatsapp || '5551996556699'
  const stats = [
    { n: cfg.stat_equipamentos || '54+', l: 'Equipamentos' },
    { n: cfg.stat_categorias   || '10',  l: 'Categorias'   },
    { n: cfg.stat_prazo        || '2h',  l: 'Resposta'     },
  ]

  return (
    <HeroClient
      titulo={titulo}
      subtitulo={subtitulo}
      bgUrl={bgUrl}
      cta1={cta1}
      cta2={cta2}
      whatsapp={whatsapp}
      stats={stats}
    />
  )
}
