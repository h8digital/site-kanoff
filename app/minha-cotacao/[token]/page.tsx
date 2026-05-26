'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase, fmt } from '@/lib/supabase'

const STATUS: Record<string, { label: string; cor: string; icon: string }> = {
  aguardando: { label: 'Aguardando Resposta', cor: '#fbbf24', icon: '⏳' },
  aprovada:   { label: 'Aprovada',            cor: '#34d399', icon: '✅' },
  recusada:   { label: 'Recusada',            cor: '#f87171', icon: '❌' },
  expirada:   { label: 'Expirada',            cor: '#94a3b8', icon: '⌛' },
  convertida: { label: 'Convertida em Contrato', cor: '#818cf8', icon: '📋' },
  rascunho:   { label: 'Em elaboração',       cor: '#94a3b8', icon: '📝' },
}

export default function MinhaCotacaoPage() {
  const { token } = useParams() as { token: string }
  const [cotacao, setCotacao]  = useState<any>(null)
  const [loading, setLoading]  = useState(true)
  const [erro,    setErro]     = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data, error } = await supabase
        .from('cotacoes')
        .select(`
          id, numero, status, origem, periodo_nome,
          data_emissao, data_validade, subtotal, total,
          observacoes,
          clientes(nome, celular, email),
          cotacao_itens(
            quantidade, preco_unitario, total_item, descricao,
            produtos(nome, titulo_site, produto_fotos(url, principal))
          )
        `)
        .eq('token_cliente', token)
        .maybeSingle()

      if (error || !data) {
        setErro('Cotação não encontrada. Verifique o link recebido.')
      } else {
        setCotacao(data)
      }
      setLoading(false)
    }
    if (token) load()
  }, [token])

  if (loading) return (
    <div style={{ paddingTop: 72, minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'var(--font-title)', color: 'var(--primary)', letterSpacing: '0.2em' }}>CARREGANDO...</div>
    </div>
  )

  if (erro) return (
    <div style={{ paddingTop: 72, minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '0 24px' }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🔍</div>
        <h2 style={{ fontSize: 24, marginBottom: 12 }}>COTAÇÃO <span style={{ color: '#f87171' }}>NÃO ENCONTRADA</span></h2>
        <p style={{ color: 'var(--slate)', marginBottom: 28 }}>{erro}</p>
        <a href="https://wa.me/5551996556699" target="_blank" rel="noreferrer" className="btn-primary">
          Falar com a Equipe
        </a>
      </div>
    </div>
  )

  const st   = STATUS[cotacao.status] ?? STATUS.aguardando
  const itens = cotacao.cotacao_itens ?? []

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(180deg,#12103A 0%,var(--bg) 100%)', padding: '48px 0 0' }}>
        <div className="container">
          <p className="section-label">Sua solicitação</p>
          <h1 style={{ fontSize: 'clamp(24px,4vw,40px)', marginBottom: 12 }}>
            COTAÇÃO <span className="neon-text">{cotacao.numero}</span>
          </h1>
          {/* Status */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: 99, marginBottom: 24,
            background: `rgba(${st.cor === '#fbbf24' ? '251,191,36' : st.cor === '#34d399' ? '52,211,153' : st.cor === '#f87171' ? '248,113,113' : '129,140,248'},0.15)`,
            border: `1px solid ${st.cor}44`,
          }}>
            <span style={{ fontSize: 18 }}>{st.icon}</span>
            <span style={{ fontFamily: 'var(--font-title)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: st.cor }}>
              {st.label}
            </span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>

          {/* Itens */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontFamily: 'var(--font-title)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--primary)' }}>
                {itens.length} Equipamento(s)
                {cotacao.periodo_nome && <span style={{ marginLeft: 12, fontWeight: 400, color: 'var(--slate)' }}>— Período: {cotacao.periodo_nome}</span>}
              </div>
              {itens.map((item: any, i: number) => {
                const prod  = item.produtos
                const nome  = prod?.titulo_site ?? prod?.nome ?? item.descricao ?? '—'
                const fotos = prod?.produto_fotos ?? []
                const foto  = fotos.find((f: any) => f.principal)?.url ?? fotos[0]?.url
                return (
                  <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
                    {foto && (
                      <div style={{ width: 60, height: 46, borderRadius: 8, overflow: 'hidden', flexShrink: 0, position: 'relative', background: 'rgba(255,255,255,0.04)' }}>
                        <img src={foto} alt={nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{nome}</div>
                      <div style={{ fontSize: 12, color: 'var(--slate)', marginTop: 2 }}>
                        {item.quantidade} un. × {fmt.money(item.preco_unitario)}
                      </div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-title)', fontWeight: 800, color: 'var(--primary)', fontSize: 14 }}>
                      {fmt.money(item.total_item)}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Observações */}
            {cotacao.observacoes && (
              <div style={{ background: 'rgba(255,184,0,0.06)', border: '1px solid rgba(255,184,0,0.2)', borderRadius: 'var(--r-md)', padding: '14px 18px' }}>
                <div style={{ fontFamily: 'var(--font-title)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)', marginBottom: 6 }}>Observações</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{cotacao.observacoes}</div>
              </div>
            )}
          </div>

          {/* Resumo lateral */}
          <div style={{ position: 'sticky', top: 88 }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--r-lg)', padding: 24 }}>
              <h3 style={{ fontFamily: 'var(--font-title)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--primary)', marginBottom: 20 }}>Resumo</h3>

              {[
                { l: 'Número',    v: cotacao.numero },
                { l: 'Emissão',   v: cotacao.data_emissao ? new Date(cotacao.data_emissao + 'T12:00:00').toLocaleDateString('pt-BR') : '—' },
                { l: 'Validade',  v: cotacao.data_validade ? new Date(cotacao.data_validade + 'T12:00:00').toLocaleDateString('pt-BR') : '—' },
                { l: 'Período',   v: cotacao.periodo_nome ?? '—' },
                { l: 'Cliente',   v: (cotacao.clientes as any)?.nome ?? '—' },
              ].map(item => (
                <div key={item.l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 13 }}>
                  <span style={{ color: 'var(--slate)' }}>{item.l}</span>
                  <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500, textAlign: 'right', maxWidth: 180 }}>{item.v}</span>
                </div>
              ))}

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '16px 0', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 13, color: 'var(--slate)' }}>Total estimado</span>
                <span style={{ fontFamily: 'var(--font-title)', fontSize: 22, fontWeight: 900, color: 'var(--primary)', textShadow: '0 0 16px rgba(255,184,0,0.4)' }}>
                  {fmt.money(cotacao.total)}
                </span>
              </div>

              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', lineHeight: 1.5, marginBottom: 20 }}>
                * Valor estimado sujeito a confirmação de disponibilidade.
              </p>

              <a href={`https://wa.me/5551996556699?text=Olá! Tenho uma dúvida sobre a cotação ${cotacao.numero}.`}
                target="_blank" rel="noreferrer" className="btn-primary"
                style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '14px 0' }}>
                Falar com a Equipe
              </a>

              <Link href="/equipamentos" className="btn-ghost"
                style={{ display: 'flex', justifyContent: 'center', marginTop: 10, width: '100%' }}>
                Nova Cotação
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile fix */}
      <style>{`@media(max-width:768px){.container>div[style*="grid-template-columns"]{display:flex!important;flex-direction:column!important}}`}</style>
    </div>
  )
}
