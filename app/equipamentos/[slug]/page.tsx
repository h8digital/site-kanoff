// build: 2026-05-29 17:55:15
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase, fmt, PERIODOS } from '@/lib/supabase'
import ProdutoClient from './ProdutoClient'
import ProdutosRelacionados from '@/components/produto/ProdutosRelacionados'

async function getProduto(slug: string) {
  // Tenta pelo slug primeiro, depois pelo ID
  const { data: bySlug } = await supabase
    .from('produtos')
    .select('id,nome,slug,titulo_site,descricao_site,seo_title,seo_description,descricao,preco_locacao_diario,preco_fds,preco_locacao_semanal,preco_quinzenal,preco_locacao_mensal,categoria_id,categorias(id,nome),produto_fotos(url,principal),produto_acessorios(nome,quantidade,ativo)')
    .eq('publicado_site', true).eq('ativo', 1)
    .eq('slug', slug).maybeSingle()

  if (bySlug) return bySlug

  // Tenta pelo ID
  const numId = Number(slug)
  if (!isNaN(numId)) {
    const { data: byId } = await supabase
      .from('produtos')
      .select('id,nome,slug,titulo_site,descricao_site,seo_title,seo_description,descricao,preco_locacao_diario,preco_fds,preco_locacao_semanal,preco_quinzenal,preco_locacao_mensal,categoria_id,categorias(id,nome),produto_fotos(url,principal),produto_acessorios(nome,quantidade,ativo)')
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
  const nomePublico = p.titulo_site ?? p.nome
  const seoTitle    = p.seo_title || `${nomePublico} — Locação em Sapucaia do Sul | Kanoff Soluções`
  const seoDesc     = p.seo_description || p.descricao_site ||
    `Alugue ${nomePublico} na Kanoff Soluções. Cotação online rápida, entrega e retirada em Sapucaia do Sul e região metropolitana de Porto Alegre.`
  return {
    title:       seoTitle,
    description: seoDesc,
    openGraph: {
      title:       seoTitle,
      description: seoDesc,
      images: (p.produto_fotos ?? []).slice(0,1).map((f: any) => ({ url: f.url })),
    },
    twitter: {
      card:        'summary_large_image',
      title:       seoTitle,
      description: seoDesc,
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
      <ProdutosRelacionados
        produtoId={produto.id}
        categoriaId={(produto.categorias as any)?.id ?? produto.categoria_id ?? null}
        categoriaNome={(produto.categorias as any)?.nome ?? ''}
      />
    </>
  )
}
