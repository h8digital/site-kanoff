// build: 2026-05-29 17:55:15
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
        {/* Schema.org LocalBusiness — SEO local */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'Kanoff Soluções',
          description: 'Locação de equipamentos para construção civil em Sapucaia do Sul e região metropolitana de Porto Alegre.',
          url: SITE_URL,
          telephone: '+55-51-99655-6699',
          email: 'contato@kanoffsolucoes.com.br',
          priceRange: '$$',
          image: `${SITE_URL}/og-image.jpg`,
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Av. Rubem Berta, 495',
            addressLocality: 'Sapucaia do Sul',
            addressRegion: 'RS',
            postalCode: '93210-000',
            addressCountry: 'BR',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: -29.8271,
            longitude: -51.1452,
          },
          openingHoursSpecification: [
            { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '08:00', closes: '18:00' },
            { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '08:00', closes: '12:00' },
          ],
          sameAs: [
            'https://www.facebook.com/kanoffsolucoes',
            'https://www.instagram.com/kanoffsolucoes',
          ],
        })}} />
        {/* Google Tag Manager */}
        {/* GTM — versão com propagação de nonce (docs.google.com/tag-platform/security/guides/csp) */}
        <Script id="gtm-script" strategy="afterInteractive">{`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;
          var n=d.querySelector('[nonce]');
          n&&j.setAttribute('nonce',n.nonce||n.getAttribute('nonce'));
          f.parentNode.insertBefore(j,f);
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
