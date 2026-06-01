// build: 2026-06-01
import { supabase } from '@/lib/supabase'
import DestaquesSlider, { SliderItem } from '@/components/home/DestaquesSlider'

interface Props {
  produtoId: number
  categoriaId: number | null
  categoriaNome: string
}

export default async function ProdutosRelacionados({ produtoId, categoriaId, categoriaNome }: Props) {
  if (!categoriaId) return null

  const { data } = await supabase
    .from('produtos')
    .select('id,nome,slug,titulo_site,preco_locacao_diario,produto_fotos(url,principal)')
    .eq('ativo', 1)
    .eq('publicado_site', true)
    .eq('categoria_id', categoriaId)
    .neq('id', produtoId)
    .order('ordem_site')
    .limit(10)

  if (!data || data.length === 0) return null

  const items: SliderItem[] = data.map((p: any) => {
    const fotos = p.produto_fotos ?? []
    return {
      id:    p.id,
      nome:  p.titulo_site ?? p.nome,
      slug:  p.slug ?? String(p.id),
      foto:  fotos.find((f: any) => f.principal)?.url ?? fotos[0]?.url ?? '',
      preco: Number(p.preco_locacao_diario ?? 0),
    }
  })

  return (
    <DestaquesSlider
      items={items}
      label="Veja também"
      titulo="MAIS DA CATEGORIA"
      tituloDestaque={categoriaNome.toUpperCase()}
      verTodosHref={`/equipamentos?categoria=${encodeURIComponent(categoriaNome)}`}
      verTodosLabel={`Ver todos em ${categoriaNome} →`}
      badge="Categoria"
    />
  )
}
