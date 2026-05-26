// build: 2026-05-26 02:27:50
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const ICONES: Record<string, string> = {
  'Andaimes e Escadas':       '🏗️',
  'Construção Civil':         '🧱',
  'Ferramentas Elétricas':    '⚡',
  'Geração de Energia':       '🔋',
  'Movimentação de Cargas':   '🏋️',
  'Equipamentos de Solda':    '🔥',
  'Climatização':             '❄️',
  'Equipamentos de Jardinagem':'🌿',
  'Limpeza':                  '🧹',
  'Terraplanagem':            '🚜',
}

async function getCategorias() {
  const { data } = await supabase
    .from('produtos')
    .select('categorias(id,nome)')
    .eq('ativo', 1)
    .eq('publicado_site', true)
  const cats = new Map<number, string>()
  ;(data ?? []).forEach((p: any) => {
    const c = p.categorias
    if (c?.id && c?.nome) cats.set(c.id, c.nome)
  })
  return Array.from(cats.values())
}

export default async function CategoriasSection() {
  const cats = await getCategorias()

  return (
    <section className="section" style={{ background:'linear-gradient(180deg,var(--bg) 0%,#12103A 100%)' }}>
      <div className="container">
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <p className="section-label">Catálogo</p>
          <h2 className="section-title">CATEGORIAS DE <span className="neon-text">LOCAÇÃO</span></h2>
          <div className="divider-neon" style={{ margin:'16px auto 0' }} />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:16 }}>
          {cats.map(cat => (
            <Link key={cat} href={`/equipamentos?categoria=${encodeURIComponent(cat)}`}
              style={{ textDecoration:'none' }}>
              <div style={{
                position: 'relative',
                padding: '28px 20px',
                background: 'var(--bg-card)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 'var(--r-lg)',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'rgba(255,184,0,0.4)'
                el.style.transform = 'translateY(-4px)'
                el.style.boxShadow = '0 12px 40px rgba(0,0,0,0.5)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'rgba(255,255,255,0.08)'
                el.style.transform = 'translateY(0)'
                el.style.boxShadow = 'none'
              }}>
                {/* Glow decoration */}
                <div style={{ position:'absolute', top:-30, right:-30, width:80, height:80, borderRadius:'50%', background:'radial-gradient(circle,rgba(255,184,0,0.08) 0%,transparent 70%)', pointerEvents:'none' }} />

                <div style={{ fontSize:40, marginBottom:12 }}>{ICONES[cat] ?? '🔧'}</div>
                <div style={{ fontFamily:'var(--font-title)', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'rgba(255,255,255,0.85)', lineHeight:1.4 }}>
                  {cat}
                </div>
                <div style={{ marginTop:10, fontSize:11, color:'var(--primary)', fontFamily:'var(--font-title)', textTransform:'uppercase', letterSpacing:'0.1em' }}>
                  Ver →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
