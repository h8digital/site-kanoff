// build: 2026-05-29 17:55:15
export default function ComoFunciona() {
  const passos = [
    { n:'01', icon:'🎯', titulo:'Escolha o Período', desc:'Selecione o período de locação — diário, semanal, quinzenal ou mensal. Todos os itens do pedido seguem o mesmo período.' },
    { n:'02', icon:'🛒', titulo:'Monte seu Carrinho', desc:'Navegue pelo catálogo e adicione os equipamentos que precisa. Veja o preço de cada item já calculado para o período escolhido.' },
    { n:'03', icon:'📋', titulo:'Solicite a Cotação', desc:'Preencha seus dados e envie o pedido. Nossa equipe confirma disponibilidade e retorna em até 2 horas úteis.' },
  ]

  return (
    <section className="section" style={{ background:'var(--bg)' }}>
      <div className="container">
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <p className="section-label">Simples assim</p>
          <h2 className="section-title">COMO <span className="neon-text">FUNCIONA</span></h2>
          <div className="divider-neon" style={{ margin:'16px auto 0' }} />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:24, position:'relative' }}>
          {/* Linha conectora */}
          <div style={{ position:'absolute', top:52, left:'17%', right:'17%', height:1, background:'linear-gradient(90deg,transparent,rgba(255,184,0,0.3),transparent)' }} className="hide-mobile" />

          {passos.map((p, i) => (
            <div key={i} style={{ textAlign:'center' }}>
              {/* Ícone com círculo neon */}
              <div style={{ position:'relative', display:'inline-block', marginBottom:24 }}>
                <div style={{
                  width:100, height:100, borderRadius:'50%',
                  background:'radial-gradient(circle,rgba(255,184,0,0.12) 0%,transparent 70%)',
                  border:'1px solid rgba(255,184,0,0.25)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:40, margin:'0 auto',
                  boxShadow:'0 0 30px rgba(255,184,0,0.1)',
                }}>
                  {p.icon}
                </div>
                <div style={{
                  position:'absolute', top:-6, right:-6,
                  fontFamily:'var(--font-title)', fontSize:11, fontWeight:900,
                  color:'var(--bg)', background:'var(--primary)',
                  width:28, height:28, borderRadius:'50%',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  boxShadow:'0 0 12px rgba(255,184,0,0.5)',
                }}>
                  {i+1}
                </div>
              </div>

              <h3 style={{ fontFamily:'var(--font-title)', fontSize:15, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'rgba(255,255,255,0.9)', marginBottom:12 }}>
                {p.titulo}
              </h3>
              <p style={{ fontSize:14, color:'var(--slate)', lineHeight:1.7, maxWidth:260, margin:'0 auto' }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
