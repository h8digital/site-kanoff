// build: 2026-05-26 02:27:50
'use client'
import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { supabase, fmt, PERIODOS } from '@/lib/supabase'
import { useCarrinho } from '@/contexts/CarrinhoContext'

type Produto = {
  id:number; nome:string; slug:string; titulo_site:string|null
  preco_locacao_diario:number; preco_fds:number; preco_locacao_semanal:number
  preco_quinzenal:number; preco_locacao_mensal:number
  categorias:any
  produto_fotos:{url:string;principal:boolean}[]
}

const CAMPO: Record<string, string> = {
  'Diário':'preco_locacao_diario','Final de Semana':'preco_fds',
  'Semanal':'preco_locacao_semanal','Quinzenal':'preco_quinzenal','Mensal':'preco_locacao_mensal',
}

function catNome(cat: any): string {
  if (!cat) return ''
  if (Array.isArray(cat)) return cat[0]?.nome ?? ''
  return cat?.nome ?? ''
}

export default function CatalogoClient({ categorias }: { categorias:{id:number;nome:string}[] }) {
  const params    = useSearchParams()
  const { periodo, setPeriodo, adicionar, itens } = useCarrinho()

  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading,  setLoading]  = useState(true)
  const [busca,    setBusca]    = useState('')
  const [catFiltro,setCatFiltro]= useState(params.get('categoria') ?? '')
  const [adicionado, setAdicionado] = useState<number|null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('produtos')
      .select('id,nome,slug,titulo_site,preco_locacao_diario,preco_fds,preco_locacao_semanal,preco_quinzenal,preco_locacao_mensal,categorias(nome),produto_fotos(url,principal)')
      .eq('ativo', 1)
      .eq('publicado_site', true)
      .order('ordem_site').order('nome')
    setProdutos((data ?? []) as unknown as Produto[])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const filtrados = produtos.filter(p => {
    const okCat   = !catFiltro || catNome(p.categorias) === catFiltro
    const b       = busca.toLowerCase()
    const okBusca = !b || p.nome.toLowerCase().includes(b) || (p.titulo_site ?? '').toLowerCase().includes(b)
    return okCat && okBusca
  })

  function precoAtual(p: Produto) {
    if (!periodo) return p.preco_locacao_diario
    const campo = CAMPO[periodo.nome] as keyof Produto
    return Number(p[campo] ?? p.preco_locacao_diario ?? 0)
  }

  function addCarrinho(p: Produto) {
    if (!periodo) { alert('Selecione um período antes de adicionar ao carrinho!'); return }
    const foto = (p.produto_fotos ?? []).find(f => f.principal)?.url ?? p.produto_fotos?.[0]?.url ?? null
    adicionar({ produto_id:p.id, nome:p.titulo_site??p.nome, slug:p.slug??String(p.id), foto, preco_unitario:precoAtual(p) })
    setAdicionado(p.id)
    setTimeout(() => setAdicionado(null), 1500)
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>

      {/* Header do catálogo */}
      <div style={{ background:'linear-gradient(180deg,#12103A 0%,var(--bg) 100%)', padding:'40px 0 0' }}>
        <div className="container">
          <h1 style={{ fontSize:'clamp(24px,4vw,40px)', marginBottom:8 }}>
            EQUIPAMENTOS PARA <span className="neon-text">LOCAÇÃO</span>
          </h1>
          <p style={{ color:'var(--slate)', fontSize:15, marginBottom:32 }}>
            {filtrados.length} equipamento(s) disponíve{filtrados.length===1?'l':'is'}
            {catFiltro ? ` em ${catFiltro}` : ''}
          </p>

          {/* Período */}
          <div style={{ marginBottom:20 }}>
            <p style={{ fontFamily:'var(--font-title)', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', color:'var(--slate)', marginBottom:10 }}>
              Período de locação:
            </p>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {PERIODOS.map(p => (
                <button key={p.id} onClick={() => setPeriodo(p)}
                  className={`periodo-btn ${periodo?.id===p.id?'ativo':''}`}>
                  {p.nome}
                </button>
              ))}
            </div>
          </div>

          {/* Busca e categoria */}
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', paddingBottom:24 }}>
            <input
              value={busca} onChange={e=>setBusca(e.target.value)}
              className="input"
              placeholder="Buscar equipamento..."
              style={{ flex:'1 1 260px', maxWidth:400 }}
            />
            <select
              value={catFiltro} onChange={e=>setCatFiltro(e.target.value)}
              className="input"
              style={{ flex:'0 0 220px' }}>
              <option value="">Todas as categorias</option>
              {categorias.map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
            </select>
            {catFiltro && (
              <button onClick={()=>setCatFiltro('')} className="btn-ghost">✕ Limpar</button>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="container" style={{ padding:'32px 24px 80px' }}>
        {loading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:'80px 0' }}>
            <div style={{ fontFamily:'var(--font-title)', color:'var(--primary)', fontSize:14, letterSpacing:'0.2em' }}>CARREGANDO...</div>
          </div>
        ) : filtrados.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 0' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
            <h3 style={{ color:'rgba(255,255,255,0.5)', fontSize:18, fontFamily:'var(--font-body)', fontWeight:400 }}>Nenhum equipamento encontrado.</h3>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:20 }}>
            {filtrados.map(p => {
              const fotos = p.produto_fotos ?? []
              const foto  = fotos.find(f=>f.principal)?.url ?? fotos[0]?.url
              const preco = precoAtual(p)
              const noCarrinho = itens.some(i=>i.produto_id===p.id)
              const acabouDeAdicionar = adicionado === p.id

              return (
                <div key={p.id} className="produto-card">
                  <Link href={`/equipamentos/${p.slug??p.id}`} style={{ textDecoration:'none', display:'block' }}>
                    <div className="produto-card-img">
                      {foto
                        ? <Image src={foto} alt={p.nome} fill style={{ objectFit:'cover' }} sizes="(max-width:768px)50vw,25vw" />
                        : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:40, opacity:.25 }}>🔧</div>
                      }
                      {catNome(p.categorias) && (
                        <div style={{ position:'absolute', bottom:8, left:8, background:'rgba(0,0,0,0.7)', color:'var(--slate)', fontSize:10, padding:'3px 8px', borderRadius:4, fontWeight:600 }}>
                          {catNome(p.categorias)}
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="produto-card-body">
                    <Link href={`/equipamentos/${p.slug??p.id}`} style={{ textDecoration:'none' }}>
                      <h3 style={{ fontFamily:'var(--font-body)', fontSize:14, fontWeight:700, color:'rgba(255,255,255,0.9)', textTransform:'none', letterSpacing:0, lineHeight:1.4 }}>
                        {p.titulo_site ?? p.nome}
                      </h3>
                    </Link>

                    {preco > 0 && (
                      <div>
                        <div style={{ fontSize:10, color:'var(--slate)' }}>
                          {periodo ? `${periodo.nome} — a partir de` : 'Diário — a partir de'}
                        </div>
                        <div className="produto-preco-tag" style={{ fontSize:18 }}>
                          {fmt.money(preco)}
                          <span style={{ fontSize:11, fontWeight:400, color:'var(--slate)' }}>
                            /{periodo?.nome.toLowerCase()??'dia'}
                          </span>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => addCarrinho(p)}
                      className="btn-primary"
                      style={{
                        width:'100%', justifyContent:'center', marginTop:'auto',
                        padding:'10px 0', fontSize:12,
                        background: acabouDeAdicionar ? '#34d399' : noCarrinho ? 'rgba(255,184,0,0.2)' : undefined,
                        color: noCarrinho && !acabouDeAdicionar ? 'var(--primary)' : undefined,
                        border: noCarrinho ? '1px solid rgba(255,184,0,0.4)' : 'none',
                        boxShadow: acabouDeAdicionar ? '0 0 20px rgba(52,211,153,0.4)' : undefined,
                      }}>
                      {acabouDeAdicionar ? '✓ Adicionado!' : noCarrinho ? `✓ No carrinho (${itens.find(i=>i.produto_id===p.id)?.quantidade??1})` : '+ Adicionar'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
