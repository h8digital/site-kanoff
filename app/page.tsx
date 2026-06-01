// build: 2026-06-01
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'
import HeroSection from '@/components/home/HeroSection'
import PeriodoSelector from '@/components/home/PeriodoSelector'
import DestaquesSection from '@/components/home/DestaquesSection'
import CategoriasSection from '@/components/home/CategoriasSection'
import ComoFunciona from '@/components/home/ComoFunciona'
import CTASection from '@/components/home/CTASection'

export const revalidate = 0

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await supabase
    .from('site_config')
    .select('chave,valor')
    .in('chave', ['meta_titulo_home','meta_descricao_home'])

  const map: Record<string,string> = {}
  ;(data ?? []).forEach((r: any) => { map[r.chave] = r.valor ?? '' })

  const title = map['meta_titulo_home'] ||
    'Kanoff Soluções — Locação de Andaimes e Equipamentos para Construção Civil'
  const description = map['meta_descricao_home'] ||
    'Alugue andaimes, betoneiras, esmerilhadeiras e equipamentos para construção civil. Cotação online rápida, entrega e retirada em Sapucaia do Sul e região metropolitana de Porto Alegre.'

  return {
    title,
    description,
    alternates: { canonical: '/' },
    openGraph: { title, description },
  }
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PeriodoSelector />
      <DestaquesSection />
      <CategoriasSection />
      <ComoFunciona />
      <CTASection />
    </>
  )
}
