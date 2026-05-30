// build: 2026-05-30
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Contrato de Locação — Kanoff Soluções',
  description: 'Contrato padrão de locação de equipamentos da Kanoff Soluções. Consulte os termos e condições.',
}

// Sem cache — sempre busca a versão mais recente do PDF
export const revalidate = 0

async function getContratoUrl() {
  const { data } = await supabase
    .from('site_config')
    .select('valor')
    .eq('chave', 'url_contrato_padrao')
    .maybeSingle()
  return data?.valor ?? ''
}

export default async function ContratoPage() {
  const pdfUrl = await getContratoUrl()
  const wa = '5551996556699'

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
        {/* Ações */}
        <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:28 }}>
          {pdfUrl && (
            <>
              <a href={pdfUrl} download="Contrato-Kanoff-Solucoes.pdf"
                style={{ display:'inline-flex', alignItems:'center', gap:8,
                  padding:'12px 24px', borderRadius:'var(--r-sm)', cursor:'pointer',
                  background:'var(--primary)', color:'var(--bg)',
                  fontFamily:'var(--font-title)', fontSize:13, fontWeight:700,
                  textTransform:'uppercase', letterSpacing:'2px',
                  border:'none', textDecoration:'none' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Baixar PDF
              </a>
              <a href={pdfUrl} target="_blank" rel="noreferrer" className="btn-outline">
                Abrir em nova aba
              </a>
            </>
          )}
          <a href={`https://wa.me/${wa}?text=Tenho uma dúvida sobre o contrato de locação.`}
            target="_blank" rel="noreferrer" className="btn-ghost">
            Dúvidas? WhatsApp
          </a>
        </div>

        {/* Exibição do PDF */}
        {pdfUrl ? (
          <div style={{
            borderRadius:'var(--r-lg)', overflow:'hidden',
            border:'1px solid rgba(255,255,255,0.1)',
            background:'#fff',
          }}>
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0&view=FitH`}
              width="100%"
              style={{ border:'none', display:'block', height:'85vh', minHeight:600 }}
              title="Contrato de Locação Kanoff Soluções"
            />
          </div>
        ) : (
          <div style={{ textAlign:'center', padding:'80px 0' }}>
            <div style={{ fontSize:64, marginBottom:20, opacity:0.3 }}>📄</div>
            <h2 style={{ fontSize:24, marginBottom:12 }}>Documento em breve</h2>
            <p style={{ color:'var(--slate)', maxWidth:400, margin:'0 auto 28px' }}>
              O contrato de locação está sendo preparado. Entre em contato para mais informações.
            </p>
            <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer" className="btn-primary">
              Falar no WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
