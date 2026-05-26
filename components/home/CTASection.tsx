// build: 2026-05-26 02:27:50
import Link from 'next/link'

export default function CTASection() {
  return (
    <section style={{
      padding: '80px 0',
      background: 'linear-gradient(135deg,#12103A 0%,#1a0f3a 50%,#12103A 100%)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decoração */}
      <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle,rgba(255,184,0,0.05) 0%,transparent 60%)', pointerEvents:'none' }} />

      <div className="container" style={{ position:'relative', zIndex:1, textAlign:'center' }}>
        <p className="section-label">Pronto para começar?</p>
        <h2 style={{ fontSize:'clamp(28px,4vw,52px)', marginBottom:16 }}>
          SOLICITE SUA <span className="neon-text">COTAÇÃO</span>
        </h2>
        <p style={{ fontSize:16, color:'var(--slate)', maxWidth:480, margin:'0 auto 40px', lineHeight:1.7 }}>
          Respondemos em até 2 horas úteis. Seg–Sex: 08h às 18h | Sáb: 08h às 12h.
        </p>
        <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
          <Link href="/equipamentos" className="btn-primary" style={{ padding:'18px 40px', fontSize:13 }}>
            Montar Cotação Online
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
          <a href="https://wa.me/5551996556699?text=Olá!%20Gostaria%20de%20fazer%20uma%20cotação%20de%20equipamentos." target="_blank" rel="noreferrer" className="btn-outline" style={{ padding:'18px 40px', fontSize:13 }}>
            Falar no WhatsApp
          </a>
        </div>
        <p style={{ marginTop:32, fontSize:13, color:'rgba(255,255,255,0.25)' }}>
          📍 Av. Rubem Berta, 495 — Sapucaia do Sul/RS
        </p>
      </div>
    </section>
  )
}
