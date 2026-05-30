// build: 2026-05-29 17:55:15
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
export const runtime = 'nodejs'

// USA A SERVICE ROLE KEY — nunca exposta no cliente
// Isso garante que o site escreve no banco sem precisar de RLS
const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // ← variável secreta, só no servidor
)

export async function POST(req: NextRequest) {
  try {
    const { cliente, periodo, itens, total, data_necessidade } = await req.json()

    if (!cliente?.nome?.trim())   return NextResponse.json({ ok:false, error:'Nome obrigatório.' })
    if (!cliente?.telefone?.trim()) return NextResponse.json({ ok:false, error:'Telefone obrigatório.' })
    if (!itens?.length)           return NextResponse.json({ ok:false, error:'Carrinho vazio.' })

    const hoje     = new Date().toLocaleDateString('sv-SE', { timeZone:'America/Sao_Paulo' })
    const validade = new Date(Date.now()+7*86400000).toLocaleDateString('sv-SE', { timeZone:'America/Sao_Paulo' })

    // ── Criar ou buscar cliente ───────────────────────────────────────────────
    let clienteId: number|null = null

    if (cliente.email) {
      const { data } = await sb.from('clientes').select('id').ilike('email', cliente.email.trim()).limit(1).maybeSingle()
      if (data?.id) clienteId = data.id
    }
    if (!clienteId && cliente.telefone) {
      const tel = cliente.telefone.replace(/\D/g,'')
      const { data } = await sb.from('clientes').select('id').or(`celular.ilike.%${tel}%,telefone.ilike.%${tel}%`).limit(1).maybeSingle()
      if (data?.id) clienteId = data.id
    }
    if (!clienteId) {
      const { data, error } = await sb.from('clientes').insert({
        nome:            cliente.nome.trim(),
        email:           cliente.email?.trim()||null,
        celular:         cliente.telefone?.trim()||null,
        cidade:          cliente.cidade?.trim()||null,
        tipo:            'PF',
        ativo:           1,
        origem_cadastro: 'site',
      }).select('id').maybeSingle()
      if (error) return NextResponse.json({ ok:false, error:'Erro ao registrar cliente: '+error.message })
      clienteId = data?.id ?? null
    }
    if (!clienteId) return NextResponse.json({ ok:false, error:'Erro ao identificar cliente.' })

    // ── Criar cotação ─────────────────────────────────────────────────────────
    // Formatar data_necessidade para exibição
    let dataNecess = ''
    if (data_necessidade) {
      const [y,m,d] = data_necessidade.split('-')
      dataNecess = `${d}/${m}/${y}`
    }

    const obs = [
      'Cotação via site.',
      dataNecess ? `📅 Precisa para: ${dataNecess}.` : '',
      periodo ? `Período: ${periodo.nome} (${periodo.dias} dias).` : '',
      cliente.obra ? `Obra/Projeto: ${cliente.obra}.` : '',
      cliente.observacoes ? `Obs: ${cliente.observacoes}` : '',
    ].filter(Boolean).join(' ')

    // Gerar token único para o cliente consultar a cotação
    const token_cliente = [...Array(32)].map(() => Math.floor(Math.random()*16).toString(16)).join('')

    const { data: cotacao, error: cotErr } = await sb.from('cotacoes').insert({
      cliente_id:    clienteId,
      status:        'aguardando',
      origem:        'site',
      periodo_nome:  periodo?.nome ?? null,
      data_emissao:  hoje,
      data_validade: validade,
      subtotal:      total,
      desconto:      0,
      acrescimo:     0,
      total:         total,
      observacoes:   obs,
      token_cliente:    token_cliente,
      data_necessidade: data_necessidade ?? null,
    }).select('id,numero,token_cliente').maybeSingle()

    if (cotErr) return NextResponse.json({ ok:false, error:'Erro ao criar cotação: '+cotErr.message })
    if (!cotacao) return NextResponse.json({ ok:false, error:'Cotação não retornou dados.' })

    // ── Inserir itens ─────────────────────────────────────────────────────────
    await sb.from('cotacao_itens').insert(
      itens.map((i: any) => ({
        cotacao_id:    cotacao.id,
        produto_id:    i.produto_id,
        quantidade:    i.quantidade,
        preco_unitario: i.preco_unitario,
        total_item:    i.preco_unitario * i.quantidade,
        descricao:     i.nome,
      }))
    )

    return NextResponse.json({ ok:true, numero:cotacao.numero, cotacao_id:cotacao.id, token_cliente:cotacao.token_cliente })

  } catch(e:any) {
    return NextResponse.json({ ok:false, error:e.message })
  }
}
