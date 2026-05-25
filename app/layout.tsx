import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import { CarrinhoProvider } from '@/contexts/CarrinhoContext'

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? 'GTM-594TSKZB'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.kanoffsolucoes.com.br'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:  'Kanoff Soluções — Locação de Andaimes e Equipamentos para Construção Civil',
    template: '%s | Kanoff Soluções',
  },
  description: 'Alugue andaimes, betoneiras, esmerilhadeiras e equipamentos para construção civil. Cotação online rápida, entrega e retirada. Sapucaia do Sul e região metropolitana de Porto Alegre.',
  keywords: ['locação de equipamentos', 'aluguel de andaimes', 'betoneiras', 'construção civil', 'Sapucaia do Sul', 'Porto Alegre', 'Kanoff Soluções'],
  authors: [{ name: 'Kanoff Soluções' }],
  creator: 'Kanoff Soluções',
  openGraph: {
    type:       'website',
    locale:     'pt_BR',
    url:        SITE_URL,
    siteName:   'Kanoff Soluções',
    title:      'Kanoff Soluções — Locação de Equipamentos',
    description:'Soluções completas em locação de equipamentos para construção civil.',
    images: [{
      url:    '/og-image.jpg',
      width:  1200,
      height: 628,
      alt:    'Kanoff Soluções',
    }],
  },
  twitter: {
    card:  'summary_large_image',
    title: 'Kanoff Soluções',
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `}</Script>
      </head>
      <body>
        {/* GTM noscript fallback */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0" width="0"
            style={{ display:'none', visibility:'hidden' }}
          />
        </noscript>

        <CarrinhoProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppFloat />
        </CarrinhoProvider>
      </body>
    </html>
  )
}
