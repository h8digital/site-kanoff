// build: 2026-06-02
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
  const [cotacao,   setCotacao]   = useState<any>(null)
  const [loading,   setLoading]   = useState(true)
  const [erro,      setErro]      = useState('')
  const [acao,      setAcao]      = useState<'aprovar'|'recusar'|null>(null)
  const [motivo,    setMotivo]    = useState('')
  const [enviando,  setEnviando]  = useState(false)
  const [resultado, setResultado] = useState<'aprovada'|'recusada'|null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      // Tenta por token_cliente primeiro, depois token_aprovacao
      let { data, error } = await supabase
        .from('cotacoes')
        .select(`
          id, numero, status, origem, periodo_nome,
          data_emissao, data_validade, subtotal, total, token_aprovacao,
          observacoes,
          clientes(nome, celular, email),
          cotacao_itens(
            quantidade, preco_unitario, total_item, descricao,
            produtos(nome, titulo_site, produto_fotos(url, principal))
          )
        `)
        .eq('token_cliente', token)
        .maybeSingle()

      if (!data && !error) {
        // Tenta pelo token_aprovacao (link enviado pelo ERP)
        const res = await supabase
          .from('cotacoes')
          .select(`
            id, numero, status, origem, periodo_nome,
            data_emissao, data_validade, subtotal, total, token_aprovacao,
            observacoes,
            clientes(nome, celular, email),
            cotacao_itens(
              quantidade, preco_unitario, total_item, descricao,
              produtos(nome, titulo_site, produto_fotos(url, principal))
            )
          `)
          .eq('token_aprovacao', token)
          .maybeSingle()
        data = res.data; error = res.error
      }

      if (error || !data) {
        setErro('Cotação não encontrada. Verifique o link recebido.')
      } else {
        setCotacao(data)
      }
      setLoading(false)
    }
    if (token) load()
  }, [token])

  async function responder() {
    if (!acao || !cotacao) return
    if (acao === 'recusar' && !motivo.trim()) { alert('Por favor, informe o motivo da recusa.'); return }
    setEnviando(true)
    try {
      const res = await fetch('/api/cotacoes/aprovar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token:    cotacao.token_aprovacao,
          acao,
          motivo,
          nome:     (cotacao.clientes as any)?.nome,
          telefone: (cotacao.clientes as any)?.celular,
          email:    (cotacao.clientes as any)?.email,
        }),
      })
      const d = await res.json()
      if (d.error) setErro(d.error)
      else setResultado(acao === 'aprovar' ? 'aprovada' : 'recusada')
    } catch { setErro('Erro ao processar. Tente novamente.') }
    setEnviando(false)
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ paddingTop: 72, minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'var(--font-title)', color: 'var(--primary)', letterSpacing: '0.2em' }}>CARREGANDO...</div>
    </div>
  )

  if (erro && !cotacao) return (
    <div style={{ paddingTop: 72, minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '0 24px' }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🔍</div>
        <h2 style={{ fontSize: 24, marginBottom: 12 }}>COTAÇÃO <span style={{ color: '#f87171' }}>NÃO ENCONTRADA</span></h2>
        <p style={{ color: 'var(--slate)', marginBottom: 28 }}>Verifique o link recebido ou entre em contato.</p>
        <a href="https://wa.me/5551996556699" target="_blank" rel="noreferrer" className="btn-primary">Falar com a Equipe</a>
      </div>
    </div>
  )

  // ── Resultado da aprovação ────────────────────────────────────────────────
  if (resultado) return (
    <div style={{ paddingTop: 72, minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '0 24px', maxWidth: 480 }}>
        <div style={{ fontSize: 72, marginBottom: 20 }}>{resultado === 'aprovada' ? '🎉' : '😔'}</div>
        <h2 style={{ fontSize: 28, marginBottom: 12 }}>
          {resultado === 'aprovada'
            ? <><span className="neon-text">APROVADA</span> COM SUCESSO</>
            : <>COTAÇÃO <span style={{ color: '#f87171' }}>RECUSADA</span></>}
        </h2>
        <p style={{ color: 'var(--slate)', lineHeight: 1.7, marginBottom: 32 }}>
          {resultado === 'aprovada'
            ? 'Ótimo! Nossa equipe entrará em contato para confirmar os detalhes da locação e agendar a entrega.'
            : 'Entendemos. Se mudar de ideia ou tiver dúvidas, entre em contato com nossa equipe.'}
        </p>
        <a href={`https://wa.me/5551996556699?text=Olá! Sobre a cotação ${cotacao?.numero}.`}
          target="_blank" rel="noreferrer" className="btn-primary">
          Falar com a Equipe
        </a>
        <Link href="/equipamentos" className="btn-ghost" style={{ display:'block', marginTop: 12 }}>
          Ver Equipamentos
        </Link>
      </div>
    </div>
  )

  const st    = STATUS[cotacao.status] ?? STATUS.aguardando
  const itens = cotacao.cotacao_itens ?? []
  const podeResponder = cotacao.status === 'aguardando' && cotacao.token_aprovacao

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(180deg,#12103A 0%,var(--bg) 100%)', padding: '48px 0 0' }}>
        <div className="container">
          <p className="section-label">Sua solicitação</p>
          <h1 style={{ fontSize: 'clamp(24px,4vw,40px)', marginBottom: 12 }}>
            COTAÇÃO <span className="neon-text">{cotacao.numero}</span>
          </h1>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: 99, marginBottom: 24,
            background: `${st.cor}18`, border: `1px solid ${st.cor}44`,
          }}>
            <span style={{ fontSize: 18 }}>{st.icon}</span>
            <span style={{ fontFamily: 'var(--font-title)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: st.cor }}>
              {st.label}
            </span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px 80px' }}>
        <div className="cotacao-grid-layout">

          {/* Itens */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontFamily: 'var(--font-title)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--primary)' }}>
                {itens.length} Equipamento(s)
                {cotacao.periodo_nome && <span style={{ marginLeft: 12, fontWeight: 400, color: 'var(--slate)' }}>— {cotacao.periodo_nome}</span>}
              </div>
              {itens.map((item: any, i: number) => {
                const prod  = item.produtos
                const nome  = prod?.titulo_site ?? prod?.nome ?? item.descricao ?? '—'
                const fotos = prod?.produto_fotos ?? []
                const foto  = fotos.find((f: any) => f.principal)?.url ?? fotos[0]?.url
                return (
                  <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
                    {foto && (
                      <div style={{ width: 60, height: 46, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: '#fff' }}>
                        <img src={foto} alt={nome} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }} />
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

            {/* ── Área de Aprovação / Recusa ── */}
            {podeResponder && (
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--r-lg)', padding: 24 }}>
                <h3 style={{ fontFamily: 'var(--font-title)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--primary)', marginBottom: 16 }}>
                  Sua Resposta
                </h3>

                {!acao ? (
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <button onClick={() => setAcao('aprovar')} className="btn-primary" style={{ flex: 1, minWidth: 140, padding: '14px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      ✅ Aprovar Cotação
                    </button>
                    <button onClick={() => setAcao('recusar')}
                      style={{ flex: 1, minWidth: 140, padding: '14px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 'var(--r-sm)', border: '1px solid rgba(248,113,113,0.4)', background: 'rgba(248,113,113,0.08)', color: '#f87171', cursor: 'pointer', fontFamily: 'var(--font-title)', fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                      ❌ Recusar
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ padding: '12px 16px', borderRadius: 'var(--r-md)', border: `1px solid ${acao === 'aprovar' ? 'rgba(52,211,153,0.3)' : 'rgba(248,113,113,0.3)'}`, background: acao === 'aprovar' ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)' }}>
                      <span style={{ color: acao === 'aprovar' ? '#34d399' : '#f87171', fontWeight: 700, fontSize: 14 }}>
                        {acao === 'aprovar' ? '✅ Aprovando a cotação' : '❌ Recusando a cotação'}
                      </span>
                    </div>
                    {acao === 'recusar' && (
                      <div>
                        <label style={{ display: 'block', fontSize: 12, color: 'var(--slate)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Motivo da recusa *</label>
                        <textarea value={motivo} onChange={e => setMotivo(e.target.value)} rows={3}
                          placeholder="Ex: Valor acima do orçamento, não preciso mais..."
                          style={{ width: '100%', borderRadius: 'var(--r-sm)', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: 'var(--fg)', padding: '10px 14px', fontSize: 14, resize: 'vertical', fontFamily: 'inherit' }} />
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button onClick={responder} disabled={enviando} className="btn-primary"
                        style={{ flex: 2, padding: '12px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {enviando ? 'Enviando...' : 'Confirmar'}
                      </button>
                      <button onClick={() => { setAcao(null); setMotivo('') }}
                        style={{ flex: 1, padding: '12px 0', borderRadius: 'var(--r-sm)', border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'var(--slate)', cursor: 'pointer', fontSize: 13 }}>
                        Voltar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Status final — não pode mais responder */}
            {!podeResponder && cotacao.status !== 'aguardando' && (
              <div style={{ padding: '16px 20px', borderRadius: 'var(--r-md)', border: `1px solid ${st.cor}33`, background: `${st.cor}10`, textAlign: 'center' }}>
                <span style={{ fontSize: 24, display: 'block', marginBottom: 6 }}>{st.icon}</span>
                <span style={{ color: st.cor, fontWeight: 700, fontSize: 14 }}>{st.label}</span>
              </div>
            )}
          </div>

          {/* Resumo lateral */}
          <div style={{ position: 'sticky', top: 88 }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--r-lg)', padding: 24 }}>
              <h3 style={{ fontFamily: 'var(--font-title)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--primary)', marginBottom: 20 }}>Resumo</h3>

              {[
                { l: 'Número',    v: cotacao.numero },
                { l: 'Emissão',   v: cotacao.data_emissao ? new Date(cotacao.data_emissao+'T12:00:00').toLocaleDateString('pt-BR') : '—' },
                { l: 'Validade',  v: cotacao.data_validade ? new Date(cotacao.data_validade+'T12:00:00').toLocaleDateString('pt-BR') : '—' },
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

              <a href={`https://wa.me/5551996556699?text=Olá! Tenho dúvidas sobre a cotação ${cotacao.numero}.`}
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

      <style>{`
        .cotacao-grid-layout { display: grid; grid-template-columns: 1fr 340px; gap: 32px; align-items: start; }
        @media(max-width:768px) { .cotacao-grid-layout { display: flex !important; flex-direction: column !important; } }
      `}</style>
    </div>
  )
}
