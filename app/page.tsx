import type { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import PeriodoSelector from '@/components/home/PeriodoSelector'
import DestaquesSection from '@/components/home/DestaquesSection'
import CategoriasSection from '@/components/home/CategoriasSection'
import ComoFunciona from '@/components/home/ComoFunciona'
import CTASection from '@/components/home/CTASection'

export const metadata: Metadata = {
  title: 'Kanoff Soluções — Locação de Andaimes e Equipamentos para Construção Civil',
  description: 'Alugue andaimes, betoneiras, esmerilhadeiras e equipamentos para construção civil. Cotação online rápida, entrega e retirada em Sapucaia do Sul e região metropolitana de Porto Alegre.',
  alternates: { canonical: '/' },
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
