// build: 2026-05-26 contrato-template
import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Contrato de Locação — Kanoff Soluções',
  description: 'Contrato padrão de locação de equipamentos da Kanoff Soluções. Consulte os termos e condições.',
}

async function getContratoData() {
  // Buscar configurações
  const { data: cfgData } = await supabase
    .from('site_config')
    .select('chave,valor')
    .in('chave', ['template_contrato_id','url_contrato_padrao','empresa_whatsapp','contrato_html'])
  const cfg: Record<string,string> = {}
  ;(cfgData ?? []).forEach(r => { cfg[r.chave] = r.valor ?? '' })

  // Tentar buscar o template HTML do ERP
  const templateId = cfg.template_contrato_id ? Number(cfg.template_contrato_id) : null
  let htmlContent = cfg.contrato_html ?? ''

  if (templateId && !htmlContent) {
    const { data: tpl } = await supabase
      .from('doc_templates')
      .select('nome,conteudo')
      .eq('id', templateId)
      .maybeSingle()
    if (tpl?.conteudo) {
      // Remover variáveis de template que não fazem sentido na versão pública
      htmlContent = tpl.conteudo
        .replace(/\{\{[^}]+\}\}/g, '_________________')
    }
  }

  return { cfg, htmlContent }
}

export default async function ContratoPage() {
  const { cfg, htmlContent } = await getContratoData()
  const pdfUrl = cfg.url_contrato_padrao ?? ''
  const wa     = cfg.empresa_whatsapp || '5551996556699'

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
          {/* Botão imprimir/gerar PDF */}
          <button
            onClick={undefined}
            id="btn-pdf"
            style={{ display:'inline-flex', alignItems:'center', gap:8,
              padding:'12px 24px', borderRadius:'var(--r-sm)', cursor:'pointer',
              background:'var(--primary)', color:'var(--bg)',
              fontFamily:'var(--font-title)', fontSize:13, fontWeight:700,
              textTransform:'uppercase', letterSpacing:'2px', border:'none' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Baixar / Imprimir PDF
          </button>
          {pdfUrl && (
            <a href={pdfUrl} target="_blank" rel="noreferrer" className="btn-outline">
              Abrir arquivo original
            </a>
          )}
          <a href={`https://wa.me/${wa}?text=Tenho uma dúvida sobre o contrato de locação.`}
            target="_blank" rel="noreferrer" className="btn-ghost">
            Dúvidas? WhatsApp
          </a>
        </div>

        {/* Conteúdo do contrato */}
        {htmlContent ? (
          <div id="contrato-content" style={{
            background: '#fff', color: '#111',
            borderRadius:'var(--r-lg)', padding:'48px',
            border:'1px solid rgba(255,255,255,0.1)',
            fontFamily: 'Georgia, serif',
            fontSize: 15, lineHeight: 1.8,
            maxWidth: 860, margin:'0 auto',
          }}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        ) : pdfUrl ? (
          <div style={{ borderRadius:'var(--r-lg)', overflow:'hidden', border:'1px solid rgba(255,255,255,0.1)', minHeight:'80vh' }}>
            <iframe
              src={`${pdfUrl}#toolbar=1&navpanes=0`}
              width="100%" height="900"
              style={{ border:'none', display:'block', minHeight:'80vh' }}
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

      {/* Script para o botão PDF */}
      <script dangerouslySetInnerHTML={{ __html: `
        document.getElementById('btn-pdf')?.addEventListener('click', function() {
          var content = document.getElementById('contrato-content');
          if (content) {
            var w = window.open('', '_blank');
            w.document.write('<html><head><title>Contrato de Locação — Kanoff Soluções</title>');
            w.document.write('<style>body{font-family:Georgia,serif;font-size:15px;line-height:1.8;padding:48px;max-width:860px;margin:0 auto;color:#111}</style>');
            w.document.write('</head><body>');
            w.document.write(content.innerHTML);
            w.document.write('</body></html>');
            w.document.close();
            setTimeout(function(){ w.print(); }, 800);
          } else {
            window.print();
          }
        });
      ` }} />

      <style>{`
        @media print {
          body { background: white !important; color: #111 !important; }
          .no-print { display: none !important; }
          #contrato-content { border: none !important; box-shadow: none !important; padding: 0 !important; }
        }
        @media(max-width:768px) {
          #contrato-content { padding: 24px !important; }
        }
      `}</style>
    </div>
  )
}
