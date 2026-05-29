// build: 2026-05-29 17:55:15
import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Contrato de Locação — Kanoff Soluções',
  description: 'Contrato padrão de locação de equipamentos da Kanoff Soluções. Consulte os termos e condições.',
  robots: { index: true, follow: true },
}

async function getContrato() {
  const { data } = await supabase
    .from('site_config')
    .select('chave,valor')
    .in('chave', ['url_contrato_padrao', 'empresa_nome', 'empresa_telefone', 'empresa_whatsapp'])
  const map: Record<string,string> = {}
  ;(data ?? []).forEach(r => { map[r.chave] = r.valor ?? '' })
  return map
}

export default async function ContratoPage() {
  const cfg = await getContrato()
  const url = cfg.url_contrato_padrao ?? ''
  const isPdf = url.toLowerCase().endsWith('.pdf') || url.includes('/storage/')

  return (
    <div style={{ paddingTop:72, minHeight:'100vh', background:'var(--bg)' }}>
      {/* Header */}
      <div style={{ background:'linear-gradient(180deg,#12103A 0%,var(--bg) 100%)', padding:'48px 0 32px' }}>
        <div className="container">
          <p className="section-label">Documento oficial</p>
          <h1 style={{ fontSize:'clamp(28px,4vw,48px)', marginBottom:8 }}>
            CONTRATO DE <span className="neon-text">LOCAÇÃO</span>
          </h1>
          <div className="divider-neon" />
          <p style={{ color:'var(--slate)', fontSize:15, marginTop:16 }}>
            Kanoff Soluções — Termos e condições de locação de equipamentos
          </p>
        </div>
      </div>

      <div className="container" style={{ padding:'32px 24px 80px' }}>
        {url ? (
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {/* Botão de download */}
            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <a href={url} target="_blank" rel="noreferrer"
                className="btn-primary" download>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Baixar PDF
              </a>
              <a href={`https://wa.me/${cfg.empresa_whatsapp || '5551996556699'}?text=Tenho uma dúvida sobre o contrato de locação.`}
                target="_blank" rel="noreferrer" className="btn-outline">
                Dúvidas? Fale conosco
              </a>
            </div>

            {/* Visualizador */}
            <div style={{
              borderRadius:'var(--r-lg)', overflow:'hidden',
              border:'1px solid rgba(255,255,255,0.1)',
              background:'rgba(255,255,255,0.02)',
              minHeight:'80vh',
            }}>
              {isPdf ? (
                <iframe
                  src={`${url}#toolbar=1&navpanes=0`}
                  width="100%" height="900"
                  style={{ border:'none', display:'block', minHeight:'80vh' }}
                  title="Contrato de Locação Kanoff Soluções"
                />
              ) : (
                <iframe
                  src={url}
                  width="100%" height="900"
                  style={{ border:'none', display:'block', minHeight:'80vh',
                    filter:'invert(90%) hue-rotate(180deg)' }}
                  title="Contrato de Locação Kanoff Soluções"
                />
              )}
            </div>

            <p style={{ fontSize:12, color:'rgba(255,255,255,0.3)', textAlign:'center' }}>
              Se o documento não carregar corretamente, use o botão "Baixar PDF" acima.
            </p>
          </div>
        ) : (
          <div style={{ textAlign:'center', padding:'80px 0' }}>
            <div style={{ fontSize:64, marginBottom:20, opacity:0.3 }}>📄</div>
            <h2 style={{ fontSize:24, marginBottom:12 }}>Documento em breve</h2>
            <p style={{ color:'var(--slate)', marginBottom:28, maxWidth:400, margin:'0 auto 28px' }}>
              O contrato de locação está sendo preparado. Entre em contato para mais informações.
            </p>
            <a href={`https://wa.me/${cfg.empresa_whatsapp || '5551996556699'}`}
              target="_blank" rel="noreferrer" className="btn-primary">
              Falar no WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
