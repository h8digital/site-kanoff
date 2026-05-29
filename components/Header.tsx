// build: 2026-05-29 17:55:15
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useCarrinho } from '@/contexts/CarrinhoContext'

const NAV = [
  { href: '/',              label: 'Início' },
  { href: '/equipamentos',  label: 'Equipamentos' },
  { href: '/sobre',         label: 'Quem Somos' },
  { href: '/contato',       label: 'Contato' },
  { href: '/contrato',      label: 'Contrato' },
]

export default function Header() {
  const { totalItens } = useCarrinho()
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <header style={{
      position:   'fixed',
      top:        0,
      left:       0,
      right:      0,
      zIndex:     1000,
      transition: 'all 0.3s ease',
      background: scrolled ? 'rgba(10,5,30,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
    }}>
      <div className="container" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', height:72 }}>

        {/* Logo */}
        <Link href="/" style={{ display:'flex', alignItems:'center', flexShrink:0 }}>
          <Image
            src="https://www.kanoffsolucoes.com.br/wp-content/uploads/2026/05/Logotipo-Alta.png"
            alt="Kanoff Soluções"
            width={140}
            height={48}
            style={{ objectFit:'contain' }}
            priority
          />
        </Link>

        {/* Nav desktop */}
        <nav className="hide-mobile" style={{ display:'flex', gap:8 }}>
          {NAV.map(n => (
            <Link key={n.href} href={n.href} style={{
              fontFamily: 'var(--font-title)',
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'rgba(255,255,255,0.7)',
              padding: '8px 14px',
              borderRadius: 'var(--r-sm)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = 'var(--primary)'
              ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,184,0,0.07)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'
              ;(e.currentTarget as HTMLElement).style.background = 'transparent'
            }}>
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Ações */}
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          {/* Carrinho */}
          <Link href="/carrinho" style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'center', width:40, height:40 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: totalItens > 0 ? 'var(--primary)' : 'rgba(255,255,255,0.7)' }}>
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {totalItens > 0 && <span className="cart-badge">{totalItens}</span>}
          </Link>

          {/* CTA */}
          <Link href="/carrinho" className="btn-primary hide-mobile" style={{ padding:'10px 20px', fontSize:11 }}>
            Solicitar Cotação
          </Link>

          {/* Hamburguer mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background:'none', border:'none', cursor:'pointer', color:'var(--white)', padding:4 }}
            className="show-mobile"
            aria-label="Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div style={{
          background: 'rgba(10,5,30,0.98)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '20px 24px 28px',
        }}>
          {NAV.map(n => (
            <Link key={n.href} href={n.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                fontFamily: 'var(--font-title)',
                fontSize: 13,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'rgba(255,255,255,0.8)',
                padding: '14px 0',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}>
              {n.label}
            </Link>
          ))}
          <Link href="/carrinho" onClick={() => setMenuOpen(false)}
            className="btn-primary"
            style={{ marginTop:20, width:'100%', justifyContent:'center' }}>
            Solicitar Cotação
          </Link>
        </div>
      )}

      <style>{`
        @media (min-width: 769px) { .show-mobile { display: none } }
        @media (max-width: 768px) { .hide-mobile { display: none } }
      `}</style>
    </header>
  )
}
