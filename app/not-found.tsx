// build: 2026-06-12
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, fmt } from '@/lib/supabase'

interface ProdutoResult {
  id: number
  nome: string
  slug: string
  titulo_site: string | null
  preco_locacao_diario: number
  foto: string | null
}

export default function NotFound() {
  const router = useRouter()
  const [termo, setTermo]       = useState('')
  const [resultados, setResultados] = useState<ProdutoResult[]>([])
  const [buscando, setBuscando] = useState(false)
  const [buscou, setBuscou]     = useState(false)

  // Busca com debounce
  useEffect(() => {
    if (!termo.trim()) { setResultados([]); setBuscou(false); return }
    const t = setTimeout(async () => {
      setBuscando(true)
      const { data } = await supabase
        .from('produtos')
        .select('id,nome,slug,titulo_site,preco_locacao_diario,produto_fotos(url,principal)')
        .eq('ativo', 1)
        .or(`nome.ilike.%${termo}%,titulo_site.ilike.%${termo}%`)
        .limit(6)

      const lista: ProdutoResult[] = (data ?? []).map((p: any) => {
        const fotos = p.produto_fotos ?? []
        const principal = fotos.find((f: any) => f.principal) ?? fotos[0]
        return {
          id: p.id,
          nome: p.nome,
          slug: p.slug,
          titulo_site: p.titulo_site,
          preco_locacao_diario: p.preco_locacao_diario,
          foto: principal?.url ?? null,
        }
      })
      setResultados(lista)
      setBuscando(false)
      setBuscou(true)
    }, 350)
    return () => clearTimeout(t)
  }, [termo])

  function buscarEnter(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && termo.trim()) {
      router.push(`/equipamentos?busca=${encodeURIComponent(termo.trim())}`)
    }
  }

  return (
    <div style={{ paddingTop:88, minHeight:'100vh', background:'var(--bg)', display:'flex', alignItems:'center' }}>
      <div style={{
        background:'linear-gradient(180deg,#12103A 0%,var(--bg) 100%)',
        padding:'40px 0',
        width:'100%',
      }}>
        <div className="container" style={{ textAlign:'center', maxWidth:640, margin:'0 auto' }}>

          {/* 404 */}
          <div style={{
            fontFamily:'var(--font-title)',
            fontSize:'clamp(64px,14vw,120px)',
            fontWeight:900,
            lineHeight:1,
            color:'var(--primary)',
            textShadow:'0 0 32px rgba(255,184,0,0.4)',
            marginBottom:8,
          }}>
            404
          </div>

          <h1 style={{ fontSize:'clamp(20px,4vw,32px)', marginBottom:12 }}>
            PÁGINA <span className="neon-text">NÃO ENCONTRADA</span>
          </h1>

          <p style={{ color:'var(--slate)', fontSize:15, lineHeight:1.7, marginBottom:32, maxWidth:480, marginLeft:'auto', marginRight:'auto' }}>
            O link que você acessou pode ter mudado ou o equipamento não está mais disponível.
            Use a busca abaixo para encontrar o que você precisa.
          </p>

          {/* Caixa de busca */}
          <div style={{ position:'relative', maxWidth:480, margin:'0 auto 12px' }}>
            <input
              value={termo}
              onChange={e => setTermo(e.target.value)}
              onKeyDown={buscarEnter}
              placeholder="Buscar equipamento... ex: betoneira, andaime, martelete"
              autoFocus
              className="input"
              style={{
                width:'100%',
                padding:'16px 48px 16px 20px',
                fontSize:15,
                borderColor: termo ? 'rgba(255,184,0,0.4)' : undefined,
                background:'rgba(255,255,255,0.04)',
              }}
            />
            <div style={{
              position:'absolute', right:16, top:'50%', transform:'translateY(-50%)',
              fontSize:18, color: buscando ? 'var(--primary)' : 'rgba(255,255,255,0.3)',
            }}>
              {buscando ? '⏳' : '🔍'}
            </div>
          </div>

          {/* Resultados da busca */}
          {buscou && (
            <div style={{ maxWidth:480, margin:'0 auto 24px', textAlign:'left' }}>
              {resultados.length === 0 ? (
                <div style={{
                  background:'var(--bg-card)', border:'1px solid rgba(255,255,255,0.08)',
                  borderRadius:'var(--r-lg)', padding:'20px', textAlign:'center',
                  color:'var(--slate)', fontSize:13,
                }}>
                  Nenhum equipamento encontrado para "{termo}".<br/>
                  Tente outro termo ou veja o catálogo completo abaixo.
                </div>
              ) : (
                <div style={{ background:'var(--bg-card)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'var(--r-lg)', overflow:'hidden' }}>
                  {resultados.map((p, i) => (
                    <Link key={p.id} href={`/equipamentos/${p.slug}`}
                      style={{
                        display:'flex', alignItems:'center', gap:14, padding:'12px 16px',
                        borderBottom: i < resultados.length-1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                        textDecoration:'none', transition:'background .15s',
                      }}
                      onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background='rgba(255,184,0,0.05)'}
                      onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='transparent'}
                    >
                      <div style={{ width:48, height:40, borderRadius:6, overflow:'hidden', background:'rgba(255,255,255,0.04)', flexShrink:0, position:'relative' }}>
                        {p.foto
                          ? <Image src={p.foto} alt={p.nome} fill style={{ objectFit:'cover' }} sizes="48px" />
                          : <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', fontSize:18, opacity:.3 }}>🔧</div>
                        }
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.9)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {p.titulo_site || p.nome}
                        </div>
                        <div style={{ fontSize:12, color:'var(--primary)', fontFamily:'var(--font-title)' }}>
                          {fmt.money(p.preco_locacao_diario)}<span style={{ fontSize:10, color:'var(--slate)' }}>/dia</span>
                        </div>
                      </div>
                      <div style={{ color:'rgba(255,255,255,0.3)', fontSize:14 }}>→</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Links rápidos */}
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', marginBottom:8 }}>
            <Link href="/" className="btn-primary">🏠 Página Inicial</Link>
            <Link href="/equipamentos" className="btn-outline">🔧 Ver Equipamentos</Link>
          </div>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', marginTop:12 }}>
            <Link href="/contato" className="btn-ghost" style={{ fontSize:13 }}>📞 Contato</Link>
            <a href="https://wa.me/5551996556699" target="_blank" rel="noreferrer" className="btn-ghost" style={{ fontSize:13 }}>
              💬 Falar no WhatsApp
            </a>
          </div>

        </div>
      </div>
    </div>
  )
}
