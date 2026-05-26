// build: 2026-05-26 01:22:52 UTC
'use client'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Partículas animadas no canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: { x:number; y:number; vx:number; vy:number; r:number; a:number }[] = []

    function resize() {
      if (!canvas) return
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 60; i++) {
      particles.push({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r:  Math.random() * 1.5 + 0.5,
        a:  Math.random() * 0.4 + 0.1,
      })
    }

    function draw() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,184,0,${p.a})`
        ctx.fill()
      })
      // Linhas de conexão
      particles.forEach((p1, i) => {
        particles.slice(i+1).forEach(p2 => {
          const d = Math.hypot(p1.x-p2.x, p1.y-p2.y)
          if (d < 100) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(255,184,0,${0.08*(1-d/100)})`
            ctx.stroke()
          }
        })
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animId) }
  }, [])

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #0A051E 0%, #12103A 50%, #0A051E 100%)',
    }}>
      {/* Canvas de partículas */}
      <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.6 }} />

      {/* Gradientes decorativos */}
      <div style={{ position:'absolute', top:'20%', right:'10%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,184,0,0.08) 0%, transparent 70%)', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:'10%', left:'5%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)', pointerEvents:'none' }} />

      {/* Conteúdo */}
      <div className="container" style={{ position:'relative', zIndex:2, paddingTop:120, paddingBottom:80 }}>
        <div style={{ maxWidth:700 }}>
          {/* Badge */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'6px 14px', background:'rgba(255,184,0,0.1)', border:'1px solid rgba(255,184,0,0.3)', borderRadius:99, marginBottom:28 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:'#FFB800', boxShadow:'0 0 8px #FFB800', animation:'pulse 2s ease infinite' }} />
            <span style={{ fontFamily:'var(--font-title)', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.2em', color:'var(--primary)' }}>
              Locação em Sapucaia do Sul / RS
            </span>
          </div>

          <h1 style={{ fontSize:'clamp(36px,5.5vw,72px)', marginBottom:24, lineHeight:1.1 }}>
            EQUIPAMENTOS{' '}
            <span className="neon-text">PRONTOS</span>{' '}
            PARA SUA{' '}
            <span style={{ color:'var(--purple)', textShadow:'0 0 20px rgba(168,85,247,0.5)' }}>OBRA</span>
          </h1>

          <p style={{ fontSize:18, color:'var(--slate)', lineHeight:1.8, marginBottom:40, maxWidth:560 }}>
            Alugue andaimes, betoneiras e equipamentos para construção civil com cotação online em minutos. Entrega e retirada em Sapucaia do Sul e região metropolitana.
          </p>

          <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
            <Link href="/equipamentos" className="btn-primary">
              Ver Equipamentos
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <a href="https://wa.me/5551996556699?text=Olá!%20Gostaria%20de%20uma%20cotação." target="_blank" rel="noreferrer" className="btn-outline">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              WhatsApp
            </a>
          </div>

          {/* Stats */}
          <div style={{ display:'flex', gap:40, marginTop:60, flexWrap:'wrap' }}>
            {[
              { n:'54+',  l:'Equipamentos' },
              { n:'10',   l:'Categorias' },
              { n:'2h',   l:'Resposta Rápida' },
            ].map(s => (
              <div key={s.l}>
                <div style={{ fontFamily:'var(--font-title)', fontSize:32, fontWeight:900, color:'var(--primary)', textShadow:'0 0 20px rgba(255,184,0,0.4)' }}>{s.n}</div>
                <div style={{ fontSize:13, color:'var(--slate)', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seta scroll */}
      <div style={{ position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)', animation:'float 2s ease-in-out infinite' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,184,0,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }`}</style>
    </section>
  )
}
