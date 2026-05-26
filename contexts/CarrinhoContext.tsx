// build: 2026-05-26 01:22:52 UTC
'use client'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { PERIODOS } from '@/lib/supabase'

export type Periodo = typeof PERIODOS[number]

export type ItemCarrinho = {
  produto_id:    number
  nome:          string
  slug:          string
  foto:          string | null
  quantidade:    number
  preco_unitario: number
}

type CarrinhoCtx = {
  itens:      ItemCarrinho[]
  periodo:    Periodo | null
  total:      number
  totalItens: number
  setPeriodo: (p: Periodo) => void
  adicionar:  (item: Omit<ItemCarrinho, 'quantidade'>) => void
  remover:    (produto_id: number) => void
  alterar:    (produto_id: number, qtd: number) => void
  limpar:     () => void
}

const Ctx = createContext<CarrinhoCtx | null>(null)

export function CarrinhoProvider({ children }: { children: React.ReactNode }) {
  const [itens,   setItens]   = useState<ItemCarrinho[]>([])
  const [periodo, setPeriodoS]= useState<Periodo | null>(null)

  // Carregar do localStorage ao montar
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kanoff_carrinho')
      if (saved) {
        const { itens: i, periodo: p } = JSON.parse(saved)
        if (i) setItens(i)
        if (p) setPeriodoS(p)
      }
    } catch {}
  }, [])

  // Salvar no localStorage sempre que mudar
  useEffect(() => {
    try {
      localStorage.setItem('kanoff_carrinho', JSON.stringify({ itens, periodo }))
    } catch {}
  }, [itens, periodo])

  const setPeriodo = useCallback((p: Periodo) => {
    setPeriodoS(p)
    // Ao mudar o período, atualiza preços dos itens no carrinho
    // (o preço por período vem do produto, mas o carrinho guarda o preço snapshot)
  }, [])

  const adicionar = useCallback((item: Omit<ItemCarrinho, 'quantidade'>) => {
    setItens(prev => {
      const existe = prev.find(i => i.produto_id === item.produto_id)
      if (existe) {
        return prev.map(i =>
          i.produto_id === item.produto_id
            ? { ...i, quantidade: i.quantidade + 1 }
            : i
        )
      }
      return [...prev, { ...item, quantidade: 1 }]
    })
  }, [])

  const remover = useCallback((produto_id: number) => {
    setItens(prev => prev.filter(i => i.produto_id !== produto_id))
  }, [])

  const alterar = useCallback((produto_id: number, qtd: number) => {
    if (qtd <= 0) { remover(produto_id); return }
    setItens(prev => prev.map(i =>
      i.produto_id === produto_id ? { ...i, quantidade: qtd } : i
    ))
  }, [remover])

  const limpar = useCallback(() => {
    setItens([]); setPeriodoS(null)
  }, [])

  const total      = itens.reduce((s, i) => s + i.preco_unitario * i.quantidade, 0)
  const totalItens = itens.reduce((s, i) => s + i.quantidade, 0)

  return (
    <Ctx.Provider value={{ itens, periodo, total, totalItens, setPeriodo, adicionar, remover, alterar, limpar }}>
      {children}
    </Ctx.Provider>
  )
}

export function useCarrinho() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCarrinho fora do CarrinhoProvider')
  return ctx
}
