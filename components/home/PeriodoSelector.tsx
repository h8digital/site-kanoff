'use client'
import { useCarrinho } from '@/contexts/CarrinhoContext'
import { PERIODOS } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function PeriodoSelector() {
  const { periodo, setPeriodo } = useCarrinho()
  const router = useRouter()

  function selecionar(p: typeof PERIODOS[number]) {
    setPeriodo(p)
    router.push('/equipamentos')
  }

  return (
    <section style={{
      background: 'linear-gradient(180deg, #0A051E 0%, #12103A 100%)',
      padding: '60px 0',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div className="container">
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <p className="section-label">Primeiro passo</p>
          <h2 style={{ fontSize:'clamp(22px,3vw,36px)', marginBottom:12 }}>
            ESCOLHA O <span className="neon-text">PERÍODO</span> DE LOCAÇÃO
          </h2>
          <p style={{ color:'var(--slate)', fontSize:15, maxWidth:480, margin:'0 auto' }}>
            Todos os equipamentos do seu pedido seguirão o mesmo período. Preços calculados automaticamente.
          </p>
        </div>

        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          {PERIODOS.map(p => (
            <button
              key={p.id}
              onClick={() => selecionar(p)}
              className={`periodo-btn ${periodo?.id === p.id ? 'ativo' : ''}`}
              style={{ fontSize:13, padding:'14px 28px' }}
            >
              <span style={{ fontSize:18, marginRight:6 }}>
                {p.nome === 'Diário' ? '☀️' : p.nome === 'Final de Semana' ? '🏖️' : p.nome === 'Semanal' ? '📅' : p.nome === 'Quinzenal' ? '🗓️' : '📆'}
              </span>
              {p.nome}
              <span style={{ display:'block', fontSize:10, opacity:0.6, marginTop:2, fontFamily:'var(--font-body)', textTransform:'none', letterSpacing:0 }}>
                {p.dias === 1 ? '1 dia' : `${p.dias} dias`}
              </span>
            </button>
          ))}
        </div>

        {periodo && (
          <p style={{ textAlign:'center', marginTop:20, fontSize:13, color:'rgba(255,184,0,0.7)' }}>
            ✓ Período selecionado: <strong style={{ color:'var(--primary)' }}>{periodo.nome}</strong> — agora escolha os equipamentos
          </p>
        )}
      </div>
    </section>
  )
}
