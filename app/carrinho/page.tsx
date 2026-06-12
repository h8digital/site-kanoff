// build: 2026-05-30 responsivo
'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { fmt } from '@/lib/supabase'
import { useCarrinho } from '@/contexts/CarrinhoContext'

export default function CarrinhoPage() {
  const { itens, periodo, total, alterar, remover, limpar } = useCarrinho()
  const router = useRouter()
  const [confirmando, setConfirmando] = useState(false)

  const [form, setForm] = useState({ nome:'', email:'', telefone:'', cidade:'', obra:'', observacoes:'', data_necessidade:'' })
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)
  const [tokenCotacao, setTokenCotacao] = useState('')
  const [numeroCotacao, setNumeroCotacao] = useState('')

  const F = (k: keyof typeof form) => ({
    value: form[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value })),
  })

  function maskTel(v: string) {
    v = v.replace(/\D/g,'').slice(0,11)
    if (v.length <= 2)  return `(${v}`
    if (v.length <= 7)  return `(${v.slice(0,2)}) ${v.slice(2)}`
    if (v.length <= 11) return `(${v.slice(0,2)}) ${v.slice(2,3)} ${v.slice(3,7)}-${v.slice(7)}`
    return v
  }

  function maskData(v: string) {
    v = v.replace(/\D/g,'').slice(0,8)
    if (v.length <= 2)  return v
    if (v.length <= 4)  return `${v.slice(0,2)}/${v.slice(2)}`
    return `${v.slice(0,2)}/${v.slice(2,4)}/${v.slice(4)}`
  }

  function dataParaBanco(v: string): string|null {
    const partes = v.split('/')
    if (partes.length !== 3 || partes[2].length !== 4) return null
    return `${partes[2]}-${partes[1]}-${partes[0]}`
  }

  async function finalizar() {
    if (!form.nome.trim()) { setErro('Informe seu nome.'); return }
    if (!form.telefone.trim()) { setErro('Informe seu telefone.'); return }
    if (!form.data_necessidade.trim()) { setErro('Informe para quando precisa dos equipamentos.'); return }
    setSalvando(true); setErro('')

    const res = await fetch('/api/cotacao', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cliente:          form,
        periodo:          periodo,
        itens:            itens.map(i => ({ produto_id:i.produto_id, quantidade:i.quantidade, preco_unitario:i.preco_unitario, nome:i.nome })),
        total:            total,
        data_necessidade: dataParaBanco(form.data_necessidade),
      }),
    })
    const data = await res.json()
    if (!data.ok) { setErro(data.error ?? 'Erro ao enviar. Tente novamente.'); setSalvando(false); return }
    if (data.token_cliente) setTokenCotacao(data.token_cliente)
    if (data.numero) setNumeroCotacao(data.numero)

    // Montar mensagem e abrir WhatsApp automaticamente
    const linhas = [
      `Olá! Acabei de solicitar uma cotação no site (Nº ${data.numero ?? ''}).`,
      '',
      `*Nome:* ${form.nome}`,
      `*Telefone:* ${form.telefone}`,
      form.cidade ? `*Cidade:* ${form.cidade}` : null,
      form.obra ? `*Obra/Projeto:* ${form.obra}` : null,
      form.data_necessidade ? `*Necessito a partir de:* ${form.data_necessidade}` : null,
      periodo ? `*Período:* ${periodo.nome}` : null,
      '',
      '*Equipamentos:*',
      ...itens.map(i => `• ${i.quantidade}x ${i.nome} — ${fmt.money(i.preco_unitario*i.quantidade)}`),
      '',
      `*Total estimado:* ${fmt.money(total)}`,
      form.observacoes ? `\n*Obs:* ${form.observacoes}` : null,
    ].filter(Boolean).join('\n')

    const urlWpp = `https://wa.me/5551996556699?text=${encodeURIComponent(linhas)}`
    window.open(urlWpp, '_blank')

    setSucesso(true)
    limpar()
    setSalvando(false)
  }

  // Sucesso
  if (sucesso) return (
    <div style={{ paddingTop:88, minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center', maxWidth:520, padding:'0 24px' }}>
        <div style={{ fontSize:72, marginBottom:24 }}>✅</div>
        <h1 style={{ fontSize:32, marginBottom:12, color:'var(--primary)' }}>COTAÇÃO ENVIADA!</h1>
        {numeroCotacao && (
          <div style={{ display:'inline-block', padding:'8px 20px', background:'rgba(255,184,0,0.1)', border:'1px solid rgba(255,184,0,0.3)', borderRadius:99, marginBottom:20 }}>
            <span style={{ fontFamily:'var(--font-title)', fontSize:13, fontWeight:700, color:'var(--primary)' }}>
              Nº {numeroCotacao}
            </span>
          </div>
        )}
        <p style={{ color:'var(--slate)', fontSize:16, lineHeight:1.7, marginBottom:24 }}>
          Recebemos seu pedido e abrimos o WhatsApp com os detalhes preenchidos — basta enviar a mensagem.
          Nossa equipe responde em até <strong style={{ color:'rgba(255,255,255,0.8)' }}>2 horas úteis</strong>.
        </p>
        {tokenCotacao && (
          <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'var(--r-lg)', padding:'16px 20px', marginBottom:24 }}>
            <p style={{ fontSize:13, color:'var(--slate)', marginBottom:10 }}>
              Acompanhe sua cotação pelo link abaixo:
            </p>
            <Link href={`/minha-cotacao/${tokenCotacao}`} className="btn-primary"
              style={{ display:'inline-flex', justifyContent:'center' }}>
              📋 Ver Minha Cotação
            </Link>
          </div>
        )}
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <Link href="/equipamentos" className="btn-outline">Ver mais equipamentos</Link>
          <a href="https://wa.me/5551996556699" target="_blank" rel="noreferrer" className="btn-ghost">Falar no WhatsApp</a>
        </div>
      </div>
    </div>
  )

  // Carrinho vazio
  if (itens.length === 0) return (
    <div style={{ paddingTop:88, minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center', maxWidth:400, padding:'0 24px' }}>
        <div style={{ fontSize:64, marginBottom:20, opacity:.5 }}>🛒</div>
        <h2 style={{ fontSize:24, marginBottom:12 }}>CARRINHO <span className="neon-text">VAZIO</span></h2>
        <p style={{ color:'var(--slate)', marginBottom:28 }}>Adicione equipamentos ao carrinho para solicitar uma cotação.</p>
        <Link href="/equipamentos" className="btn-primary">Ver Equipamentos</Link>
      </div>
    </div>
  )

  return (
    <div style={{ paddingTop:88, minHeight:'100vh', background:'var(--bg)' }}>
      <div style={{ background:'linear-gradient(180deg,#12103A 0%,var(--bg) 100%)', padding:'40px 0 0' }}>
        <div className="container">
          <h1 style={{ fontSize:'clamp(24px,4vw,40px)', marginBottom:8 }}>
            MINHA <span className="neon-text">COTAÇÃO</span>
          </h1>
          {periodo && (
            <div className="badge badge-primary" style={{ marginBottom:24 }}>
              Período: {periodo.nome}
            </div>
          )}
        </div>
      </div>

      <div className="container" style={{ padding:'32px 24px 80px' }}>
        {/* Grid principal — colapsa em coluna no mobile via CSS */}
        <div className="carrinho-grid">

          {/* ── Itens ──────────────────────────────────────────────── */}
          <div style={{ display:'flex', flexDirection:'column', gap:24 }}>

            {/* Lista de itens */}
            <div style={{ background:'var(--bg-card)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'var(--r-lg)', overflow:'hidden' }}>
              <div style={{ padding:'16px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)', fontFamily:'var(--font-title)', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', color:'var(--primary)' }}>
                {itens.length} Equipamento(s)
              </div>
              {itens.map(item => (
                <div key={item.produto_id} className="c-item" style={{ display:'flex', gap:16, padding:'16px 20px', borderBottom:'1px solid rgba(255,255,255,0.05)', alignItems:'center' }}>
                  {/* Foto */}
                  <div className="c-item-foto" style={{ width:72, height:54, borderRadius:'var(--r-sm)', overflow:'hidden', background:'rgba(255,255,255,0.04)', flexShrink:0, position:'relative' }}>
                    {item.foto
                      ? <Image src={item.foto} alt={item.nome} fill style={{ objectFit:'cover' }} sizes="72px" />
                      : <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', fontSize:24, opacity:.3 }}>🔧</div>
                    }
                  </div>
                  {/* Info */}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, fontWeight:600, color:'rgba(255,255,255,0.9)', marginBottom:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.nome}</div>
                    <div style={{ fontSize:13, color:'var(--primary)', fontFamily:'var(--font-title)' }}>{fmt.money(item.preco_unitario)}<span style={{ fontSize:10, color:'var(--slate)' }}>/{periodo?.nome.toLowerCase()??'un'}</span></div>
                  </div>
                  {/* Quantidade */}
                  <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                    <button onClick={() => alterar(item.produto_id, item.quantidade-1)}
                      style={{ width:28, height:28, borderRadius:6, border:'1px solid rgba(255,255,255,0.15)', background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.7)', cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>−</button>
                    <span style={{ fontFamily:'var(--font-title)', fontWeight:700, minWidth:24, textAlign:'center' }}>{item.quantidade}</span>
                    <button onClick={() => alterar(item.produto_id, item.quantidade+1)}
                      style={{ width:28, height:28, borderRadius:6, border:'1px solid rgba(255,184,0,0.3)', background:'rgba(255,184,0,0.1)', color:'var(--primary)', cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
                  </div>
                  {/* Subtotal */}
                  <div style={{ textAlign:'right', flexShrink:0, minWidth:80 }}>
                    <div style={{ fontFamily:'var(--font-title)', fontWeight:800, color:'var(--primary)', fontSize:15 }}>{fmt.money(item.preco_unitario*item.quantidade)}</div>
                  </div>
                  {/* Remover */}
                  <button onClick={() => remover(item.produto_id)}
                    style={{ background:'none', border:'none', color:'rgba(248,113,113,0.6)', cursor:'pointer', fontSize:18, padding:'4px', transition:'color .2s', flexShrink:0 }}
                    onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color='#f87171'}
                    onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color='rgba(248,113,113,0.6)'}>×</button>
                </div>
              ))}
            </div>

            {/* Formulário do cliente */}
            {!confirmando ? (
              <div style={{ background:'var(--bg-card)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'var(--r-lg)', padding:'24px' }}>
                <h3 style={{ fontFamily:'var(--font-title)', fontSize:13, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', color:'var(--primary)', marginBottom:20 }}>Seus Dados</h3>
                {erro && <div style={{ background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.3)', borderRadius:'var(--r-sm)', padding:'10px 14px', fontSize:13, color:'#fca5a5', marginBottom:16 }}>⚠ {erro}</div>}
                <div className="c-form-grid">
                  {/* Nome */}
                  <div>
                    <label className="label">Nome completo *</label>
                    <input value={form.nome} onChange={e=>setForm(f=>({...f,nome:e.target.value}))}
                      className="input" placeholder="Seu nome" />
                  </div>
                  {/* Telefone */}
                  <div>
                    <label className="label">Telefone / WhatsApp *</label>
                    <input value={form.telefone}
                      onChange={e=>setForm(f=>({...f,telefone:maskTel(e.target.value)}))}
                      className="input" placeholder="(51) 9 9999-9999"
                      inputMode="numeric" maxLength={16} />
                  </div>
                  {/* E-mail */}
                  <div>
                    <label className="label">E-mail</label>
                    <input value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}
                      className="input" placeholder="seu@email.com" type="email" />
                  </div>
                  {/* Cidade */}
                  <div>
                    <label className="label">Cidade</label>
                    <input value={form.cidade} onChange={e=>setForm(f=>({...f,cidade:e.target.value}))}
                      className="input" placeholder="Sapucaia do Sul" />
                  </div>
                  {/* Data */}
                  <div className="c-form-full" style={{
                    background:'rgba(255,184,0,0.08)', border:'1px solid rgba(255,184,0,0.25)',
                    borderRadius:'var(--r-md)', padding:'14px 16px' }}>
                    <label className="label" style={{ color:'var(--primary)' }}>
                      📅 Para quando precisa dos equipamentos? *
                    </label>
                    <input value={form.data_necessidade}
                      onChange={e=>setForm(f=>({...f,data_necessidade:maskData(e.target.value)}))}
                      className="input" placeholder="dd/mm/aaaa"
                      inputMode="numeric" maxLength={10}
                      style={{ marginTop:6, borderColor:'rgba(255,184,0,0.4)',
                        background:'rgba(255,184,0,0.05)' }} />
                    <div style={{ fontSize:11, color:'rgba(255,184,0,0.7)', marginTop:6 }}>
                      Informe a data de início da locação para que possamos confirmar disponibilidade.
                    </div>
                  </div>
                  {/* Obra */}
                  <div className="c-form-full">
                    <label className="label">Nome da obra / projeto</label>
                    <input value={form.obra} onChange={e=>setForm(f=>({...f,obra:e.target.value}))}
                      className="input" placeholder="Ex: Residência Silva, Obra Rua das Flores..." />
                  </div>
                  <div className="c-form-full">
                    <label className="label">Observações</label>
                    <textarea {...F('observacoes')} className="input" placeholder="Período desejado, endereço de entrega, dúvidas..." rows={3} style={{ resize:'vertical' }} />
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* ── Resumo ─────────────────────────────────────────────── */}
          <div className="c-resumo">
            <div style={{ background:'var(--bg-card)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'var(--r-lg)', padding:'24px' }}>
              <h3 style={{ fontFamily:'var(--font-title)', fontSize:13, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', color:'var(--primary)', marginBottom:20 }}>Resumo</h3>

              {periodo && (
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10, fontSize:13, color:'var(--slate)' }}>
                  <span>Período</span><span style={{ color:'rgba(255,255,255,0.7)', fontWeight:600 }}>{periodo.nome}</span>
                </div>
              )}
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10, fontSize:13, color:'var(--slate)' }}>
                <span>Equipamentos</span><span style={{ color:'rgba(255,255,255,0.7)' }}>{itens.reduce((s,i)=>s+i.quantidade,0)} unidades</span>
              </div>

              <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)', margin:'16px 0', paddingTop:16 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                  <span style={{ fontSize:13, color:'var(--slate)' }}>Total estimado</span>
                  <span style={{ fontFamily:'var(--font-title)', fontSize:24, fontWeight:900, color:'var(--primary)', textShadow:'0 0 16px rgba(255,184,0,0.4)' }}>{fmt.money(total)}</span>
                </div>
                <p style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:6, lineHeight:1.5 }}>
                  * Valor estimado sujeito a confirmação de disponibilidade e condições.
                </p>
              </div>

              <button onClick={finalizar} disabled={salvando}
                className="btn-primary"
                style={{ width:'100%', justifyContent:'center', padding:'16px 0', fontSize:13, marginTop:8,
                  opacity: salvando ? .7 : 1 }}>
                {salvando ? 'Enviando...' : '📲 Enviar Cotação via WhatsApp'}
              </button>
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:8, textAlign:'center', lineHeight:1.5 }}>
                Sua cotação será registrada e o WhatsApp abrirá automaticamente com os itens já preenchidos.
              </p>

              <div style={{ marginTop:12, display:'flex', justifyContent:'center' }}>
                <button onClick={() => { if (confirm('Limpar o carrinho?')) limpar() }}
                  style={{ background:'none', border:'none', color:'rgba(255,255,255,0.25)', fontSize:12, cursor:'pointer', transition:'color .2s' }}
                  onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color='rgba(248,113,113,0.6)'}
                  onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.25)'}>
                  Limpar carrinho
                </button>
              </div>

              <div style={{ marginTop:20, padding:'12px', background:'rgba(255,184,0,0.06)', border:'1px solid rgba(255,184,0,0.15)', borderRadius:'var(--r-sm)', fontSize:12, color:'rgba(255,255,255,0.5)', lineHeight:1.6 }}>
                🕐 Respondemos em até <strong style={{ color:'rgba(255,184,0,0.8)' }}>2 horas úteis</strong><br/>
                Seg–Sex: 08h às 18h | Sáb: 08h às 12h
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
