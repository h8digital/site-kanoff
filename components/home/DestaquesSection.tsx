// build: 2026-06-01
import { supabase, fmt } from '@/lib/supabase'
import DestaquesSlider from './DestaquesSlider'

async function getDestaques() {
  const { data } = await supabase
    .from('produtos')
    .select('id,nome,slug,titulo_site,preco_locacao_diario,produto_fotos(url,principal)')
    .eq('ativo', 1)
    .eq('publicado_site', true)
    .eq('destaque_home', true)
    .order('ordem_site')
    .limit(10)
  return data ?? []
}

export default async function DestaquesSection() {
  const produtos = await getDestaques()
  if (produtos.length === 0) return null

  const items = produtos.map((p: any) => {
    const fotos = p.produto_fotos ?? []
    return {
      id:     p.id,
      nome:   p.titulo_site ?? p.nome,
      slug:   p.slug ?? String(p.id),
      foto:   fotos.find((f: any) => f.principal)?.url ?? fotos[0]?.url ?? '',
      preco:  Number(p.preco_locacao_diario ?? 0),
    }
  })

  return <DestaquesSlider items={items} fmt={fmt} />
}
