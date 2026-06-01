// build: 2026-06-01
'use client'
import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCarrinho } from '@/contexts/CarrinhoContext'

export interface SliderItem {
  id: number
  nome: string
  slug: string
  foto: string
  preco: number
}

interface Props {
  items: SliderItem[]
  label?: string
  titulo?: string
  tituloDestaque?: string
  verTodosHref?: string
  verTodosLabel?: string
  badge?: string
}

const money = (v: number) =>
  'R$ ' + Number(v ?? 0).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')

export default function DestaquesSlider({
  items,
  label = 'Mais alugados',
  titulo = 'EQUIPAMENTOS EM',
  tituloDestaque = 'DESTAQUE',
  verTodosHref = '/equipamentos',
  verTodosLabel = 'Ver todos os equipamentos →',
  badge = 'Destaque',
}: Props) {
  const [index, setIndex]       = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX]     = useState(0)
  const [moved, setMoved]       = useState(false)
  const [addedId, setAddedId]   = useState<number | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const { adicionar } = useCarrinho()

  const maxIndex = Math.max(0, items.length - 4)
  const prev = useCallback(() => setIndex(i => Math.max(0, i - 1)), [])
  const next = useCallback(() => setIndex(i => Math.min(maxIndex, i + 1)), [maxIndex])

  function onPointerDown(e: React.PointerEvent) {
    setIsDragging(true)
    setMoved(false)
    setStartX(e.clientX)
    trackRef.current?.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!isDragging) return
    if (Math.abs(e.clientX - startX) > 8) setMoved(true)
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!isDragging) return
    setIsDragging(false)
    const diff = startX - e.clientX
    if (Math.abs(diff) > 40) {
      if (diff > 0) next()
      else prev()
    }
  }

  function handleAdd(e: React.MouseEvent, item: SliderItem) {
    e.preventDefault()
    e.stopPropagation()
    adicionar({ produto_id: item.id, nome: item.nome, slug: item.slug, foto: item.foto, preco_unitario: item.preco })
    setAddedId(item.id)
    setTimeout(() => setAddedId(null), 1800)
  }

  return (
    <section className="section" style={{ background:'var(--bg)', overflow:'hidden' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:40, flexWrap:'wrap', gap:16 }}>
          <div>
            <p className="section-label">{label}</p>
            <h2 className="section-title">{titulo} <span className="neon-text">{tituloDestaque}</span></h2>
            <div className="divider-neon" />
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={prev} disabled={index === 0}
              style={{ width:44, height:44, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.15)', background:'rgba(255,255,255,0.05)', cursor:index===0?'not-allowed':'pointer', color:index===0?'rgba(255,255,255,0.2)':'var(--fg)', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button onClick={next} disabled={index >= maxIndex}
              style={{ width:44, height:44, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.15)', background:'rgba(255,255,255,0.05)', cursor:index>=maxIndex?'not-allowed':'pointer', color:index>=maxIndex?'rgba(255,255,255,0.2)':'var(--fg)', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>

        {/* Slider */}
        <div style={{ overflow:'hidden', margin:'0 -8px' }}>
          <div
            ref={trackRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => setIsDragging(false)}
            style={{
              display:'flex',
              transform:`translateX(calc(-${index} * var(--slide-w)))`,
              transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect:'none',
              touchAction:'pan-y',
            }}>
            {items.map(item => (
              <div key={item.id} className="destaque-slide">
                {/* Link só navega se não houve drag */}
                <Link
                  href={`/equipamentos/${item.slug}`}
                  onClick={e => { if (moved) e.preventDefault() }}
                  style={{ textDecoration:'none', display:'block', height:'100%' }}>
                  <div className="produto-card" style={{ height:'100%', userSelect:'none' }}>
                    <div className="produto-card-img">
                      {item.foto
                        ? <Image src={item.foto} alt={item.nome} fill style={{ objectFit:'contain', padding:'12px', background:'#ffffff' }} sizes="(max-width:768px) 100vw, 25vw" draggable={false} />
                        : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:48, opacity:.3 }}>🔧</div>
                      }
                      <div className="badge badge-primary" style={{ position:'absolute', top:12, left:12 }}>{badge}</div>
                    </div>
                    <div className="produto-card-body">
                      <h3 style={{ fontFamily:'var(--font-body)', fontSize:14, fontWeight:700, color:'rgba(255,255,255,0.9)', textTransform:'none', letterSpacing:0, lineHeight:1.4 }}>
                        {item.nome}
                      </h3>
                      {item.preco > 0 && (
                        <div>
                          <div style={{ fontSize:11, color:'var(--slate)', marginBottom:2 }}>A partir de</div>
                          <div className="produto-preco-tag">{money(item.preco)}<span style={{ fontSize:12, fontWeight:400, color:'var(--slate)' }}>/dia</span></div>
                        </div>
                      )}
                      <button
                        onClick={e => handleAdd(e, item)}
                        style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', padding:'10px 0', fontSize:12, marginTop:'auto', borderRadius:'var(--r-sm)', border:'none', cursor:'pointer', fontFamily:'var(--font-title)', fontWeight:700, textTransform:'uppercase', letterSpacing:'1.5px', transition:'all 0.2s',
                          background: addedId===item.id ? 'rgba(52,211,153,0.2)' : 'var(--primary)',
                          color: addedId===item.id ? '#34d399' : 'var(--bg)',
                        }}>
                        {addedId===item.id ? '✓ Adicionado' : 'Adicionar ao Carrinho'}
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        {maxIndex > 0 && (
          <div style={{ display:'flex', justifyContent:'center', gap:6, marginTop:28 }}>
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button key={i} onClick={() => setIndex(i)}
                style={{ width:i===index?24:8, height:8, borderRadius:4, border:'none', cursor:'pointer', transition:'all 0.3s',
                  background: i===index ? 'var(--primary)' : 'rgba(255,255,255,0.15)' }} />
            ))}
          </div>
        )}

        <div style={{ textAlign:'center', marginTop:32 }}>
          <Link href={verTodosHref} className="btn-outline">{verTodosLabel}</Link>
        </div>
      </div>

      <style>{`
        :root { --slide-w: 25%; }
        .destaque-slide { flex: 0 0 calc(25% - 16px); margin: 0 8px; min-width: 0; }
        @media (max-width: 1024px) {
          :root { --slide-w: 33.333%; }
          .destaque-slide { flex: 0 0 calc(33.333% - 16px); }
        }
        @media (max-width: 640px) {
          :root { --slide-w: 100%; }
          .destaque-slide { flex: 0 0 calc(100% - 16px); }
        }
      `}</style>
    </section>
  )
}
