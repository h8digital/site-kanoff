// build: 2026-06-01
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Política de Privacidade — Kanoff Soluções',
  description: 'Saiba como a Kanoff Soluções coleta, usa e protege seus dados pessoais.',
}

export const revalidate = 0

async function getConteudo() {
  const { data } = await supabase
    .from('site_config')
    .select('valor')
    .eq('chave', 'politica_privacidade')
    .maybeSingle()
  return data?.valor ?? ''
}

export default async function PoliticaPrivacidadePage() {
  const conteudo = await getConteudo()
  const dataAtualizacao = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(180deg,#12103A 0%,var(--bg) 100%)', padding: '48px 0 32px' }}>
        <div className="container">
          <p className="section-label">Documento legal</p>
          <h1 style={{ fontSize: 'clamp(28px,4vw,48px)', marginBottom: 8 }}>
            POLÍTICA DE <span className="neon-text">PRIVACIDADE</span>
          </h1>
          <div className="divider-neon" />
          <p style={{ color: 'var(--slate)', fontSize: 15, marginTop: 16 }}>
            Kanoff Soluções — Como coletamos, usamos e protegemos seus dados
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px 80px' }}>
        <div style={{
          maxWidth: 820,
          background: 'var(--surface)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 'var(--r-lg)',
          padding: 'clamp(24px, 5vw, 56px)',
        }}>
          {conteudo ? (
            <div
              className="politica-content"
              dangerouslySetInnerHTML={{ __html: conteudo }}
            />
          ) : (
            <p style={{ color: 'var(--slate)', textAlign: 'center', padding: '60px 0' }}>
              Conteúdo em breve.
            </p>
          )}

          <hr style={{ margin: '40px 0 24px', border: 'none', borderTop: '1px solid rgba(255,255,255,0.07)' }} />
          <p style={{ color: 'var(--slate)', fontSize: 13 }}>
            Última atualização: {dataAtualizacao}
          </p>
        </div>
      </div>
    </div>
  )
}
