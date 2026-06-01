// build: 2026-06-01
import { createClient } from '@supabase/supabase-js'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cliente público — sem cache (Next.js 15 usa cache por padrão no fetch)
export const supabase = createClient(url, anon, {
  global: {
    fetch: (input, init) =>
      fetch(input, { ...init, cache: 'no-store' }),
  },
})

// Helpers de formatação
export const fmt = {
  money: (v: number) =>
    'R$ ' + Number(v ?? 0).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
  phone: (v: string) =>
    v?.replace(/\D/g,'').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3') ?? v,
}

// Mapa: nome do período → campo do banco
export const PERIODO_CAMPO: Record<string, string> = {
  'Diário':           'preco_locacao_diario',
  'Final de Semana':  'preco_fds',
  'Semanal':          'preco_locacao_semanal',
  'Quinzenal':        'preco_quinzenal',
  'Mensal':           'preco_locacao_mensal',
}

export const PERIODOS = [
  { id: 1, nome: 'Diário',          dias: 1,  campo: 'preco_locacao_diario'  },
  { id: 8, nome: 'Final de Semana', dias: 3,  campo: 'preco_fds'             },
  { id: 2, nome: 'Semanal',         dias: 7,  campo: 'preco_locacao_semanal' },
  { id: 3, nome: 'Quinzenal',       dias: 15, campo: 'preco_quinzenal'       },
  { id: 4, nome: 'Mensal',          dias: 30, campo: 'preco_locacao_mensal'  },
]
