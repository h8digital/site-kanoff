// build: 2026-05-29 17:55:15
'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { fmt, PERIODOS } from '@/lib/supabase'
import { useCarrinho } from '@/contexts/CarrinhoContext'

const CAMPO: Record<string, string> = {
  'Diário':'preco_locacao_diario','Final de Semana':'preco_fds',
  'Semanal':'preco_locacao_semanal','Quinzenal':'preco_quinzenal','Mensal':'preco_locacao_mensal',
}

export default function ProdutoClient({ produto }: { produto: any }) {
  const { periodo, setPeriodo, adicionar, itens, alterar } = useCarrinho()
  const [fotoIdx, setFotoIdx] = useState(0)
  const [adicionado, setAdicionado] = useState(false)

  const fotos      = produto.produto_fotos ?? []
  const fotoAtual  = fotos[fotoIdx]?.url ?? null
  const acessorios = (produto.produto_acessorios ?? []).filter((a: any) => a.ativo === 1)
  const noCarrinho = itens.find(i => i.produto_id === produto.id)

  const periodosDisponiveis = PERIODOS.filter(p => Number(produto[p.campo] ?? 0) > 0)

  function precoAtual() {
    if (!periodo) return produto.preco_locacao_diario ?? 0
    return Number(produto[CAMPO[periodo.nome] as string] ?? produto.preco_locacao_diario ?? 0)
  }

  function add() {
    if (!periodo && periodosDisponiveis.length > 0) {
      setPeriodo(periodosDisponiveis[0])
    }
    const p = periodo ?? periodosDisponiveis[0]
    if (!p) return
    adicionar({
      produto_id:     produto.id,
      nome:           produto.titulo_site ?? produto.nome,
      slug:           produto.slug ?? String(produto.id),
      foto:           fotos.find((f: any) => f.principal)?.url ?? fotos[0]?.url ?? null,
      preco_unitario: Number(produto[CAMPO[p.nome]] ?? produto.preco_locacao_diario ?? 0),
    })
    setAdicionado(true)
    setTimeout(() => setAdicionado(false), 2000)
  }

  return (
    <div style={{ paddingTop:72, background:'var(--bg)', minHeight:'100vh' }}>
      {/* Breadcrumb */}
      <div style={{ background:'linear-gradient(180deg,#12103A 0%,var(--bg) 100%)', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <div className="container">
          <div style={{ display:'flex', gap:8, alignItems:'center', fontSize:13, color:'var(--slate)' }}>
            <Link href="/" style={{ color:'var(--slate)', transition:'color .2s' }}
              onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color='var(--primary)'}
              onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color='var(--slate)'}>Início</Link>
            <span>/</span>
            <Link href="/equipamentos" style={{ color:'var(--slate)', transition:'color .2s' }}
              onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color='var(--primary)'}
              onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color='var(--slate)'}>Equipamentos</Link>
            <span>/</span>
            <span style={{ color:'rgba(255,255,255,0.7)' }}>{produto.titulo_site ?? produto.nome}</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding:'40px 24px 80px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, alignItems:'start' }}>

          {/* ── Galeria ────────────────────────────────────────────── */}
          <div>
            {/* Foto principal */}
            <div className="produto-foto-wrap" style={{ position:'relative', borderRadius:'var(--r-lg)', overflow:'hidden', background:'var(--bg-card)', border:'1px solid rgba(255,255,255,0.08)', aspectRatio:'4/3', marginBottom:12 }}>
              {fotoAtual
                ? <Image src={fotoAtual} alt={produto.nome} fill style={{ objectFit:'contain', padding:'12px', background:'#ffffff' }} sizes="50vw" priority />
                : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:80, opacity:.2 }}>🔧</div>
              }
            </div>
            {/* Thumbnails */}
            {fotos.length > 1 && (
              <div className="p-thumbs" style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {fotos.map((f: any, i: number) => (
                  <button key={i} onClick={() => setFotoIdx(i)}
                    style={{ width:72, height:54, borderRadius:'var(--r-sm)', overflow:'hidden', border:`2px solid ${i===fotoIdx?'var(--primary)':'rgba(255,255,255,0.1)'}`, cursor:'pointer', padding:0, background:'none', transition:'border-color .2s' }}>
                    <Image src={f.url} alt={`Foto ${i+1}`} width={72} height={54} style={{ objectFit:'cover', width:'100%', height:'100%' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info do produto ─────────────────────────────────────── */}
          <div>
            {produto.categorias?.nome && (
              <span className="badge badge-primary" style={{ marginBottom:12 }}>{produto.categorias.nome}</span>
            )}
            <h1 style={{ fontFamily:'var(--font-body)', fontSize:'clamp(22px,3vw,32px)', fontWeight:800, color:'rgba(255,255,255,0.95)', textTransform:'none', letterSpacing:'-0.5px', lineHeight:1.3, marginBottom:16 }}>
              {produto.titulo_site ?? produto.nome}
            </h1>

            {(produto.descricao_site || produto.descricao) && (
              <p style={{ fontSize:15, color:'var(--slate)', lineHeight:1.8, marginBottom:24 }}>
                {produto.descricao_site ?? produto.descricao}
              </p>
            )}

            {/* Acessórios */}
            {acessorios.length > 0 && (
              <div style={{ background:'rgba(255,184,0,0.07)', border:'1px solid rgba(255,184,0,0.2)', borderRadius:'var(--r-md)', padding:'12px 16px', marginBottom:24 }}>
                <p style={{ fontFamily:'var(--font-title)', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', color:'var(--primary)', marginBottom:8 }}>
                  🔩 Acessórios inclusos
                </p>
                {acessorios.map((a: any, i: number) => (
                  <div key={i} style={{ fontSize:13, color:'rgba(255,255,255,0.7)', marginBottom:4 }}>
                    • {a.quantidade}x {a.nome}
                  </div>
                ))}
              </div>
            )}

            {/* Período selector */}
            <div style={{ marginBottom:24 }}>
              <p className="label" style={{ marginBottom:10 }}>Período de locação</p>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {periodosDisponiveis.map(p => (
                  <button key={p.id} onClick={() => setPeriodo(p)}
                    className={`periodo-btn ${periodo?.id===p.id?'ativo':''}`}>
                    {p.nome}
                    <span style={{ display:'block', fontSize:11, fontFamily:'var(--font-title)', color: periodo?.id===p.id ? 'var(--primary)' : 'var(--slate)', marginTop:2 }}>
                      {fmt.money(Number(produto[p.campo]??0))}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Preço atual */}
            {precoAtual() > 0 && (
              <div style={{ marginBottom:28 }}>
                <div style={{ fontSize:12, color:'var(--slate)', marginBottom:4 }}>
                  {periodo ? `Preço ${periodo.nome.toLowerCase()}` : 'Preço diário'}
                </div>
                <div style={{ fontFamily:'var(--font-title)', fontSize:40, fontWeight:900, color:'var(--primary)', textShadow:'0 0 20px rgba(255,184,0,0.4)' }}>
                  {fmt.money(precoAtual())}
                  <span style={{ fontSize:16, fontWeight:400, color:'var(--slate)', marginLeft:6 }}>/{periodo?.nome.toLowerCase()??'dia'}</span>
                </div>
              </div>
            )}

            {/* Botões */}
            <div className="p-btns" style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <button onClick={add} className="btn-primary"
                style={{ justifyContent:'center', padding:'18px 0', fontSize:14,
                  background: adicionado ? '#34d399' : undefined,
                  boxShadow: adicionado ? '0 0 24px rgba(52,211,153,0.4)' : undefined }}>
                {adicionado ? '✓ Adicionado ao carrinho!' : noCarrinho ? `✓ No carrinho — adicionar mais` : `+ Adicionar ao carrinho`}
              </button>
              {noCarrinho && (
                <Link href="/carrinho" className="btn-outline" style={{ textAlign:'center', justifyContent:'center' }}>
                  Ver carrinho ({noCarrinho.quantidade} un.) →
                </Link>
              )}
              <a href="https://wa.me/5551996556699?text=Olá!%20Tenho%20interesse%20em%20locar:%20" target="_blank" rel="noreferrer"
                className="btn-ghost" style={{ justifyContent:'center' }}>
                Consultar disponibilidade via WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Tabela completa de preços */}
        {periodosDisponiveis.length > 0 && (
          <div className="p-precos" style={{ marginTop:60 }}>
            <h2 style={{ fontSize:20, marginBottom:24 }}>TABELA DE <span className="neon-text">PREÇOS</span></h2>
            <div style={{ background:'var(--bg-card)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'var(--r-lg)', overflow:'hidden' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ background:'rgba(255,184,0,0.08)', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
                    {['Período','Duração','Preço por unidade'].map(h => (
                      <th key={h} style={{ padding:'14px 20px', textAlign:'left', fontFamily:'var(--font-title)', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--primary)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {periodosDisponiveis.map((p, i) => (
                    <tr key={p.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.05)', background: periodo?.id===p.id?'rgba(255,184,0,0.05)':'transparent', cursor:'pointer' }}
                      onClick={() => setPeriodo(p)}>
                      <td style={{ padding:'14px 20px', fontSize:14, color:'rgba(255,255,255,0.9)', fontWeight:600 }}>
                        {periodo?.id===p.id && <span style={{ color:'var(--primary)', marginRight:8 }}>▶</span>}
                        {p.nome}
                      </td>
                      <td style={{ padding:'14px 20px', fontSize:14, color:'var(--slate)' }}>{p.dias === 1 ? '1 dia' : `${p.dias} dias`}</td>
                      <td style={{ padding:'14px 20px', fontFamily:'var(--font-title)', fontSize:16, fontWeight:800, color:'var(--primary)' }}>
                        {fmt.money(Number(produto[p.campo]??0))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize:12, color:'rgba(255,255,255,0.25)', marginTop:12 }}>
              * Clique num período para selecioná-lo. Preços sujeitos a confirmação de disponibilidade.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @media(max-width:768px){
          /* Foto e info em coluna única */
          .p-grid { display:flex!important; flex-direction:column!important; gap:24px!important; }
          /* Foto ocupa 100% da largura */
          .p-foto { width:100%!important; }
          /* Aspect ratio maior no mobile para foto maior */
          .p-foto-main { aspect-ratio:4/3!important; min-height:260px; }
          /* Thumbnails menores */
          .p-thumbs button { width:52px!important; height:40px!important; }
          /* Botões em coluna */
          .p-btns { flex-direction:column!important; }
          .p-btns a, .p-btns button { width:100%!important; justify-content:center!important; text-align:center; }
          /* Período buttons menores */
          .periodo-btn { padding:8px 12px!important; font-size:10px!important; }
          /* Tabela de preços scroll */
          .p-precos { overflow-x:auto!important; }
          .p-precos table { min-width:320px; }
        }
      `}</style>
    </div>
  )
}
