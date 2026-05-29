// build: 2026-05-29 17:55:15
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase, fmt, PERIODOS } from '@/lib/supabase'
import ProdutoClient from './ProdutoClient'

async function getProduto(slug: string) {
  // Tenta pelo slug primeiro, depois pelo ID
  const { data: bySlug } = await supabase
    .from('produtos')
    .select('id,nome,slug,titulo_site,descricao_site,descricao,preco_locacao_diario,preco_fds,preco_locacao_semanal,preco_quinzenal,preco_locacao_mensal,categorias(nome),produto_fotos(url,principal),produto_acessorios(nome,quantidade,ativo)')
    .eq('publicado_site', true).eq('ativo', 1)
    .eq('slug', slug).maybeSingle()

  if (bySlug) return bySlug

  // Tenta pelo ID
  const numId = Number(slug)
  if (!isNaN(numId)) {
    const { data: byId } = await supabase
      .from('produtos')
      .select('id,nome,slug,titulo_site,descricao_site,descricao,preco_locacao_diario,preco_fds,preco_locacao_semanal,preco_quinzenal,preco_locacao_mensal,categorias(nome),produto_fotos(url,principal),produto_acessorios(nome,quantidade,ativo)')
      .eq('publicado_site', true).eq('ativo', 1)
      .eq('id', numId).maybeSingle()
    if (byId) return byId
  }
  return null
}

export async function generateMetadata({ params }: { params: Promise<{ slug:string }> }): Promise<Metadata> {
  const { slug } = await params
  const p = await getProduto(slug)
  if (!p) return { title:'Equipamento não encontrado' }
  return {
    title: p.titulo_site ?? p.nome,
    description: p.descricao_site ?? `Alugue ${p.nome} na Kanoff Soluções. Cotação online rápida.`,
    openGraph: {
      title: p.titulo_site ?? p.nome,
      images: (p.produto_fotos ?? []).slice(0,1).map((f: any) => ({ url: f.url })),
    },
    alternates: { canonical: `/equipamentos/${p.slug ?? p.id}` },
  }
}

export default async function ProdutoPage({ params }: { params: Promise<{ slug:string }> }) {
  const { slug } = await params
  const produto = await getProduto(slug)
  if (!produto) notFound()

  // Schema.org para o produto
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: produto.titulo_site ?? produto.nome,
    description: produto.descricao_site ?? produto.descricao ?? '',
    image: (produto.produto_fotos ?? []).map((f: any) => f.url),
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'BRL',
      lowPrice: produto.preco_locacao_diario ?? 0,
      offerCount: PERIODOS.filter(p => Number((produto as any)[p.campo] ?? 0) > 0).length,
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ProdutoClient produto={produto} />
    </>
  )
}
