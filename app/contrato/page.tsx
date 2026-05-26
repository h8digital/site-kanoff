// build: 2026-05-26 02:27:50
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Contrato de Locação Padrão — Kanoff Soluções',
  description: 'Contrato de locação padrão Kanoff Soluções. Consulte os termos e condições de locação de equipamentos.',
  robots: { index: false, follow: false },
}

async function getContrato() {
  const { data } = await supabase
    .from('site_config')
    .select('valor')
    .eq('chave', 'url_contrato_padrao')
    .maybeSingle()
  return data?.valor ?? ''
}

export default async function ContratoPage() {
  const url = await getContrato()

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ background: 'linear-gradient(180deg,#12103A 0%,var(--bg) 100%)', padding: '60px 0 0' }}>
        <div className="container">
          <p className="section-label">Documento oficial</p>
          <h1 style={{ fontSize: 'clamp(28px,4vw,48px)', marginBottom: 8 }}>
            CONTRATO DE <span className="neon-text">LOCAÇÃO</span>
          </h1>
          <div className="divider-neon" />
          <p style={{ color: 'var(--slate)', fontSize: 15, marginTop: 16, marginBottom: 32 }}>
            Contrato de locação padrão — Kanoff Soluções
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px 80px' }}>
        {url ? (
          <div style={{ borderRadius: 'var(--r-lg)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
            <iframe
              src={url}
              width="100%"
              style={{ height: '80vh', border: 'none', display: 'block' }}
              title="Contrato de Locação Padrão Kanoff Soluções"
            />
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 20, opacity: 0.4 }}>📄</div>
            <p style={{ color: 'var(--slate)', fontSize: 16 }}>
              Contrato não disponível no momento. Entre em contato conosco.
            </p>
            <a
              href="https://wa.me/5551996556699"
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
              style={{ marginTop: 24, display: 'inline-flex' }}>
              Falar no WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
