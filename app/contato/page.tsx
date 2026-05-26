// build: 2026-05-26 01:22:52 UTC
'use client'
import type { Metadata } from 'next'
import { useState } from 'react'

export default function ContatoPage() {
  const [form, setForm]     = useState({ nome:'', email:'', telefone:'', mensagem:'' })
  const [salvando, setSalvando] = useState(false)
  const [sucesso, setSucesso]   = useState(false)
  const [erro, setErro]         = useState('')

  const F = (k: keyof typeof form) => ({
    value: form[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) =>
      setForm(f=>({...f,[k]:e.target.value})),
  })

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nome.trim()) { setErro('Informe seu nome.'); return }
    if (!form.mensagem.trim()) { setErro('Escreva sua mensagem.'); return }
    setSalvando(true); setErro('')

    const res = await fetch('/api/contato', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!data.ok) { setErro(data.error ?? 'Erro ao enviar.'); setSalvando(false); return }
    setSucesso(true); setSalvando(false)
  }

  return (
    <div style={{ paddingTop:72, background:'var(--bg)', minHeight:'100vh' }}>
      <section style={{ background:'linear-gradient(180deg,#12103A 0%,var(--bg) 100%)', padding:'60px 0 0' }}>
        <div className="container">
          <p className="section-label">Fale conosco</p>
          <h1 style={{ fontSize:'clamp(28px,4vw,48px)', marginBottom:8 }}>
            ENTRE EM <span className="neon-text">CONTATO</span>
          </h1>
          <div className="divider-neon" />
        </div>
      </section>

      <section style={{ padding:'40px 0 80px' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48 }}>

            {/* Formulário */}
            <div style={{ background:'var(--bg-card)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'var(--r-lg)', padding:'32px' }}>
              {sucesso ? (
                <div style={{ textAlign:'center', padding:'40px 0' }}>
                  <div style={{ fontSize:56, marginBottom:16 }}>✅</div>
                  <h3 style={{ color:'var(--primary)', marginBottom:8 }}>MENSAGEM ENVIADA!</h3>
                  <p style={{ color:'var(--slate)', fontSize:14 }}>Retornaremos em breve. Obrigado pelo contato!</p>
                </div>
              ) : (
                <>
                  <h2 style={{ fontFamily:'var(--font-title)', fontSize:14, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', color:'var(--primary)', marginBottom:24 }}>Envie uma mensagem</h2>
                  {erro && <div style={{ background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.3)', borderRadius:'var(--r-sm)', padding:'10px 14px', fontSize:13, color:'#fca5a5', marginBottom:16 }}>⚠ {erro}</div>}
                  <form onSubmit={enviar} style={{ display:'flex', flexDirection:'column', gap:16 }}>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                      <div><label className="label">Nome *</label><input {...F('nome')} className="input" placeholder="Seu nome" /></div>
                      <div><label className="label">Telefone</label><input {...F('telefone')} className="input" placeholder="(51) 9 9999-9999" /></div>
                    </div>
                    <div><label className="label">E-mail</label><input {...F('email')} type="email" className="input" placeholder="seu@email.com" /></div>
                    <div><label className="label">Mensagem *</label><textarea {...F('mensagem')} className="input" rows={5} placeholder="Descreva sua necessidade..." style={{ resize:'vertical' }} /></div>
                    <button type="submit" disabled={salvando} className="btn-primary" style={{ justifyContent:'center', padding:'16px 0' }}>
                      {salvando ? 'Enviando...' : 'Enviar Mensagem'}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Info */}
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              {[
                { icon:'📍', titulo:'Endereço', cont:'Av. Rubem Berta, 495, Centro\nSapucaia do Sul/RS' },
                { icon:'📞', titulo:'Telefone / WhatsApp', cont:'(51) 99655-6699', href:'https://wa.me/5551996556699' },
                { icon:'✉️', titulo:'E-mail', cont:'contato@kanoffsolucoes.com.br', href:'mailto:contato@kanoffsolucoes.com.br' },
                { icon:'🕐', titulo:'Horário', cont:'Seg–Sex: 08h às 18h\nSáb: 08h às 12h' },
              ].map(item => (
                <div key={item.titulo} style={{ background:'var(--bg-card)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'var(--r-md)', padding:'20px 24px', display:'flex', gap:16, alignItems:'flex-start' }}>
                  <span style={{ fontSize:28, flexShrink:0 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontFamily:'var(--font-title)', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', color:'var(--primary)', marginBottom:6 }}>{item.titulo}</div>
                    {item.href
                      ? <a href={item.href} target={item.href.startsWith('http')?'_blank':'_self'} rel="noreferrer" style={{ fontSize:14, color:'rgba(255,255,255,0.7)', lineHeight:1.6, whiteSpace:'pre-line', transition:'color .2s' }}
                          onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color='var(--primary)'}
                          onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.7)'}>
                          {item.cont}
                        </a>
                      : <span style={{ fontSize:14, color:'rgba(255,255,255,0.7)', lineHeight:1.6, whiteSpace:'pre-line' }}>{item.cont}</span>
                    }
                  </div>
                </div>
              ))}

              {/* Mapa */}
              <div style={{ borderRadius:'var(--r-lg)', overflow:'hidden', border:'1px solid rgba(255,255,255,0.08)', height:220 }}>
                <iframe
                  src="https://maps.google.com/maps?q=Rubem%20Berta%2C%20495%2C%20Centro%2C%20Sapucaia%20do%20Sul%2C%20RS&t=m&z=16&output=embed&iwloc=near"
                  width="100%" height="220" style={{ border:0, filter:'invert(90%) hue-rotate(180deg)' }}
                  loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  title="Localização Kanoff Soluções"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
