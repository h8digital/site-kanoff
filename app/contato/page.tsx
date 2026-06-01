// build: 2026-06-01
import type { Metadata } from 'next'
import ContatoClient from './ContatoClient'

export const metadata: Metadata = {
  title: 'Contato — Kanoff Soluções',
  description: 'Entre em contato com a Kanoff Soluções. Atendimento em Sapucaia do Sul e região metropolitana de Porto Alegre. WhatsApp, e-mail ou formulário online.',
  alternates: { canonical: '/contato' },
  openGraph: {
    title: 'Contato | Kanoff Soluções',
    description: 'Fale com a Kanoff Soluções. Locação de equipamentos em Sapucaia do Sul e região.',
  },
}

export default function ContatoPage() {
  return <ContatoClient />
}
