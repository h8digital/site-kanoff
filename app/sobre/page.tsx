// build: 2026-05-26 01:22:52 UTC
'use client'
import Link from 'next/link'

const valores = [
  { icon:'🛡️', titulo:'Compromisso',      desc:'Com a segurança, a qualidade e a satisfação do cliente em cada entrega.' },
  { icon:'💎', titulo:'Transparência',    desc:'Em todas as relações — preços claros, contratos honestos, sem surpresas.' },
  { icon:'⏱️', titulo:'Responsabilidade', desc:'Com prazos, processos e pessoas. Palavra empenhada é compromisso cumprido.' },
  { icon:'🚀', titulo:'Inovação',         desc:'Para oferecer soluções cada vez mais eficientes para sua obra.' },
  { icon:'🤝', titulo:'Parceria',         desc:'Como base de relações duradouras. Cada cliente é um parceiro.' },
  { icon:'💛', titulo:'Respeito',         desc:'Às pessoas, aos clientes e ao ambiente de trabalho.' },
]

export default function SobrePage() {
  return (
    <div style={{ paddingTop:72, background:'var(--bg)' }}>

      {/* Hero */}
      <section style={{ background:'linear-gradient(135deg,#12103A 0%,#0A051E 100%)', padding:'80px 0', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <div className="container">
          <p className="section-label">Nossa história</p>
          <h1 style={{ fontSize:'clamp(32px,5vw,64px)', marginBottom:16 }}>
            QUEM <span className="neon-text">SOMOS</span>
          </h1>
          <div className="divider-neon" />
          <p style={{ fontSize:18, color:'var(--slate)', maxWidth:640, lineHeight:1.8 }}>
            A Kanoff Soluções é a concretização de um sonho — a crença de que dedicação, profissionalismo e propósito podem transformar negócios e gerar impacto real.
          </p>
        </div>
      </section>

      {/* História */}
      <section className="section">
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:60, alignItems:'center' }}>
            <div>
              <p className="section-label">Desde março de 2026</p>
              <h2 className="section-title" style={{ fontSize:'clamp(24px,3vw,36px)' }}>NOSSA <span className="neon-text">HISTÓRIA</span></h2>
              <div className="divider-neon" />
              <p style={{ color:'var(--slate)', lineHeight:1.9, marginBottom:20 }}>
                Iniciamos nossas atividades em <strong style={{ color:'rgba(255,255,255,0.8)' }}>03 de março de 2026</strong>, com sede em Sapucaia do Sul/RS, na Avenida Rubem Berta, nº 495.
              </p>
              <p style={{ color:'var(--slate)', lineHeight:1.9, marginBottom:20 }}>
                Nascemos com o compromisso de oferecer soluções completas, seguras e eficientes para obras, projetos e operações de diferentes portes.
              </p>
              <p style={{ color:'var(--slate)', lineHeight:1.9 }}>
                Desde o primeiro dia, nossa essência é entregar mais do que serviços e equipamentos: entregar <strong style={{ color:'rgba(255,255,255,0.8)' }}>confiança, parceria e resultados</strong>.
              </p>
            </div>
            <div style={{ background:'var(--bg-card)', border:'1px solid rgba(255,184,0,0.2)', borderRadius:'var(--r-xl)', padding:40 }}>
              {[
                { icon:'🎯', titulo:'Nossa Missão', desc:'Entregar soluções completas em locação de equipamentos e serviços técnicos, com qualidade, segurança e agilidade.' },
                { icon:'🔭', titulo:'Nossa Visão',  desc:'Ser referência regional em locação de equipamentos, reconhecida pela confiabilidade e excelência no atendimento.' },
              ].map(item => (
                <div key={item.titulo} style={{ marginBottom:32 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                    <span style={{ fontSize:24 }}>{item.icon}</span>
                    <h3 style={{ fontFamily:'var(--font-title)', fontSize:13, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', color:'var(--primary)' }}>{item.titulo}</h3>
                  </div>
                  <p style={{ fontSize:14, color:'var(--slate)', lineHeight:1.7 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="section" style={{ background:'#12103A' }}>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <p className="section-label">DNA da empresa</p>
            <h2 className="section-title">NOSSOS <span className="neon-text">VALORES</span></h2>
            <div className="divider-neon" style={{ margin:'16px auto 0' }} />
          </div>
          <div className="grid-3">
            {valores.map(v => (
              <div key={v.titulo} style={{ background:'var(--bg)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'var(--r-lg)', padding:'28px 24px', transition:'all 0.3s' }}
                onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor='rgba(255,184,0,0.3)';el.style.transform='translateY(-4px)'}}
                onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor='rgba(255,255,255,0.07)';el.style.transform='translateY(0)'}}>
                <div style={{ fontSize:32, marginBottom:14 }}>{v.icon}</div>
                <h3 style={{ fontFamily:'var(--font-title)', fontSize:13, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:'var(--primary)', marginBottom:10 }}>{v.titulo}</h3>
                <p style={{ fontSize:14, color:'var(--slate)', lineHeight:1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm" style={{ textAlign:'center', background:'var(--bg)' }}>
        <div className="container">
          <h2 style={{ fontSize:28, marginBottom:16 }}>PRONTO PARA <span className="neon-text">COMEÇAR</span>?</h2>
          <p style={{ color:'var(--slate)', marginBottom:28 }}>Solicite sua cotação online ou fale diretamente com nossa equipe.</p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/equipamentos" className="btn-primary">Ver Equipamentos</Link>
            <Link href="/contato" className="btn-outline">Fale Conosco</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
