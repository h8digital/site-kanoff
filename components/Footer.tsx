// build: 2026-05-26 01:22:52 UTC
'use client'
import Link from 'next/link'
import Image from 'next/image'

const EMPRESA = {
  nome:      'Kanoff Soluções',
  endereco:  'Av. Rubem Berta, 495, Centro',
  cidade:    'Sapucaia do Sul/RS',
  tel:       '(51) 99655-6699',
  wa:        '5551996556699',
  email:     'contato@kanoffsolucoes.com.br',
  horario:   'Seg–Sex: 08h às 18h | Sáb: 08h às 12h',
  facebook:  'https://www.facebook.com/kanoffsolucoes',
  instagram: 'https://www.instagram.com/kanoffsolucoes',
}

const schemaOrg = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: EMPRESA.nome,
  description: 'Locação de andaimes, betoneiras e equipamentos para construção civil em Sapucaia do Sul e região metropolitana de Porto Alegre.',
  url: 'https://www.kanoffsolucoes.com.br',
  telephone: '+55-51-99655-6699',
  email: EMPRESA.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Avenida Rubem Berta, 495',
    addressLocality: 'Sapucaia do Sul',
    addressRegion: 'RS',
    addressCountry: 'BR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -29.8347,
    longitude: -51.1489,
  },
  openingHours: ['Mo-Fr 08:00-18:00', 'Sa 08:00-12:00'],
  sameAs: [EMPRESA.facebook, EMPRESA.instagram],
}

export default function Footer() {
  return (
    <footer style={{ background:'#07041A', borderTop:'1px solid rgba(255,255,255,0.07)', paddingTop:60, paddingBottom:24 }}>
      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      <div className="container">
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:40, marginBottom:48 }}>

          {/* Coluna 1 — Marca */}
          <div>
            <Image
              src="https://www.kanoffsolucoes.com.br/wp-content/uploads/2026/05/Logotipo-Alta.png"
              alt="Kanoff Soluções"
              width={140}
              height={48}
              style={{ objectFit:'contain', marginBottom:20 }}
            />
            <p style={{ fontSize:14, color:'var(--slate)', lineHeight:1.7, marginBottom:20, maxWidth:280 }}>
              Soluções completas em locação de equipamentos e serviços técnicos para sua obra.
            </p>
            {/* Redes */}
            <div style={{ display:'flex', gap:10 }}>
              <a href={EMPRESA.facebook} target="_blank" rel="noreferrer" style={{
                width:36, height:36, borderRadius:8, background:'rgba(255,255,255,0.07)',
                border:'1px solid rgba(255,255,255,0.12)', display:'flex', alignItems:'center',
                justifyContent:'center', color:'rgba(255,255,255,0.6)', transition:'all 0.2s',
              }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='var(--primary)';(e.currentTarget as HTMLElement).style.color='var(--primary)'}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.12)';(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.6)'}}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href={EMPRESA.instagram} target="_blank" rel="noreferrer" style={{
                width:36, height:36, borderRadius:8, background:'rgba(255,255,255,0.07)',
                border:'1px solid rgba(255,255,255,0.12)', display:'flex', alignItems:'center',
                justifyContent:'center', color:'rgba(255,255,255,0.6)', transition:'all 0.2s',
              }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='var(--primary)';(e.currentTarget as HTMLElement).style.color='var(--primary)'}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.12)';(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.6)'}}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href={`https://wa.me/${EMPRESA.wa}`} target="_blank" rel="noreferrer" style={{
                width:36, height:36, borderRadius:8, background:'rgba(255,255,255,0.07)',
                border:'1px solid rgba(255,255,255,0.12)', display:'flex', alignItems:'center',
                justifyContent:'center', color:'rgba(255,255,255,0.6)', transition:'all 0.2s',
              }}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='#25D366';(e.currentTarget as HTMLElement).style.color='#25D366'}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.12)';(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.6)'}}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              </a>
            </div>
          </div>

          {/* Coluna 2 — Navegação */}
          <div>
            <h4 style={{ fontFamily:'var(--font-title)', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.2em', color:'var(--primary)', marginBottom:20 }}>Navegação</h4>
            {[
              { href:'/',             l:'Início' },
              { href:'/equipamentos', l:'Equipamentos' },
              { href:'/sobre',        l:'Quem Somos' },
              { href:'/contato',      l:'Contato' },
              { href:'/carrinho',     l:'Minha Cotação' },
            ].map(i => (
              <Link key={i.href} href={i.href} style={{ display:'block', fontSize:14, color:'var(--slate)', marginBottom:10, transition:'color 0.2s' }}
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color='var(--primary)'}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color='var(--slate)'}>
                {i.l}
              </Link>
            ))}
          </div>

          {/* Coluna 3 — Categorias */}
          <div>
            <h4 style={{ fontFamily:'var(--font-title)', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.2em', color:'var(--primary)', marginBottom:20 }}>Equipamentos</h4>
            {['Andaimes e Escadas','Construção Civil','Ferramentas Elétricas','Geração de Energia','Movimentação de Cargas','Equipamentos de Solda'].map(cat => (
              <Link key={cat} href={`/equipamentos?categoria=${encodeURIComponent(cat)}`}
                style={{ display:'block', fontSize:14, color:'var(--slate)', marginBottom:10, transition:'color 0.2s' }}
                onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color='var(--primary)'}
                onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color='var(--slate)'}>
                {cat}
              </Link>
            ))}
          </div>

          {/* Coluna 4 — Contato */}
          <div>
            <h4 style={{ fontFamily:'var(--font-title)', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.2em', color:'var(--primary)', marginBottom:20 }}>Contato</h4>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {[
                { icon:'📍', text: `${EMPRESA.endereco}\n${EMPRESA.cidade}` },
                { icon:'📞', text: EMPRESA.tel },
                { icon:'✉️', text: EMPRESA.email },
                { icon:'🕐', text: EMPRESA.horario },
              ].map((item, i) => (
                <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                  <span style={{ fontSize:14, flexShrink:0, marginTop:1 }}>{item.icon}</span>
                  <span style={{ fontSize:13, color:'var(--slate)', lineHeight:1.5, whiteSpace:'pre-line' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.07)', paddingTop:24, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <p style={{ fontSize:13, color:'rgba(255,255,255,0.3)' }}>
            © {new Date().getFullYear()} Kanoff Soluções — Todos os direitos reservados
          </p>
          <div style={{ display:'flex', gap:20 }}>
            <Link href="/politica-de-privacidade" style={{ fontSize:13, color:'rgba(255,255,255,0.3)', transition:'color 0.2s' }}
              onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color='var(--primary)'}
              onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.3)'}>
              Política de Privacidade
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer > .container > div:first-of-type {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 480px) {
          footer > .container > div:first-of-type {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  )
}
