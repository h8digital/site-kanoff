// build: 2026-06-01
import HeroClient from './HeroClient'
import { supabase } from '@/lib/supabase'

export const revalidate = 0

async function getHeroConfig() {
  const chaves = ['hero_bg_url','hero_titulo','hero_subtitulo','hero_cta_texto','hero_cta2_texto','stat_equipamentos','stat_categorias','stat_prazo','empresa_whatsapp']
  const { data } = await supabase
    .from('site_config')
    .select('chave,valor')
    .in('chave', chaves)
  const map: Record<string,string> = {}
  ;(data ?? []).forEach((r: any) => { map[r.chave] = r.valor ?? '' })
  return map
}

export default async function HeroSection() {
  const config = await getHeroConfig()
  return <HeroClient config={config} />
}
