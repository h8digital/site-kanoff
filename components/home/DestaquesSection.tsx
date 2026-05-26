// build: 2026-05-26 02:27:50
import { supabase, fmt, PERIODOS } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'

async function getDestaques() {
  const { data } = await supabase
    .from('produtos')
    .select('id,nome,slug,titulo_site,preco_locacao_diario,preco_fds,preco_locacao_semanal,preco_quinzenal,preco_locacao_mensal,produto_fotos(url,principal)')
    .eq('ativo', 1)
    .eq('publicado_site', true)
    .eq('destaque_home', true)
    .order('ordem_site')
    .limit(6)
  return data ?? []
}

export default async function DestaquesSection() {
  const produtos = await getDestaques()
  if (produtos.length === 0) return null

  return (
    <section className="section" style={{ background:'var(--bg)' }}>
      <div className="container">
        <div style={{ marginBottom:48 }}>
          <p className="section-label">Mais alugados</p>
          <h2 className="section-title">EQUIPAMENTOS EM <span className="neon-text">DESTAQUE</span></h2>
          <div className="divider-neon" />
        </div>

        <div className="grid-3">
          {produtos.map((p: any) => {
            const fotos = p.produto_fotos ?? []
            const foto  = fotos.find((f: any) => f.principal)?.url ?? fotos[0]?.url
            const preco = Number(p.preco_locacao_diario ?? 0)

            return (
              <Link key={p.id} href={`/equipamentos/${p.slug ?? p.id}`} style={{ textDecoration:'none' }}>
                <div className="produto-card">
                  <div className="produto-card-img">
                    {foto
                      ? <Image src={foto} alt={p.nome} fill style={{ objectFit:'cover' }} sizes="(max-width:768px)100vw,33vw" />
                      : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:48, opacity:.3 }}>🔧</div>
                    }
                    <div className="badge badge-primary" style={{ position:'absolute', top:12, left:12 }}>Destaque</div>
                  </div>

                  <div className="produto-card-body">
                    <h3 style={{ fontFamily:'var(--font-body)', fontSize:15, fontWeight:700, color:'rgba(255,255,255,0.9)', textTransform:'none', letterSpacing:0, lineHeight:1.4 }}>
                      {p.titulo_site ?? p.nome}
                    </h3>
                    {preco > 0 && (
                      <div>
                        <div style={{ fontSize:11, color:'var(--slate)', marginBottom:2 }}>A partir de</div>
                        <div className="produto-preco-tag">{fmt.money(preco)}<span style={{ fontSize:12, fontWeight:400, color:'var(--slate)' }}>/dia</span></div>
                      </div>
                    )}
                    <div className="btn-primary" style={{ textAlign:'center', padding:'10px 0', fontSize:12, marginTop:'auto' }}>
                      Adicionar ao Carrinho
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div style={{ textAlign:'center', marginTop:40 }}>
          <Link href="/equipamentos" className="btn-outline">Ver todos os equipamentos →</Link>
        </div>
      </div>
    </section>
  )
}
