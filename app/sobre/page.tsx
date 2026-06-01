// build: 2026-06-01
import type { Metadata } from 'next'
import SobreClient from './SobreClient'

export const metadata: Metadata = {
  title: 'Quem Somos — Kanoff Soluções',
  description: 'Conheça a Kanoff Soluções, especialista em locação de equipamentos para construção civil em Sapucaia do Sul e região metropolitana de Porto Alegre.',
  alternates: { canonical: '/sobre' },
  openGraph: {
    title: 'Quem Somos | Kanoff Soluções',
    description: 'Especialistas em locação de equipamentos para construção civil. Sapucaia do Sul, RS.',
  },
}

export default function SobrePage() {
  return <SobreClient />
}
