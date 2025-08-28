import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '../components/ThemeProvider'
import { AudioProvider } from '../components/AudioProvider'
import { PWAProvider } from '../components/PWAProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Concerto - Professional Music App',
  description: 'Stream, create, and discover music with our comprehensive platform featuring AI recommendations, social features, and production tools.',
  keywords: 'music, streaming, production, AI, social, playlists, audio effects',
  authors: [{ name: 'Concerto Team' }],
  creator: 'Concerto Team',
  publisher: 'Concerto',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://concerto.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Concerto - Professional Music App',
    description: 'Stream, create, and discover music with our comprehensive platform',
    url: 'https://concerto.app',
    siteName: 'Concerto',
    images: [
      {
        url: '/icons/icon-512x512.png',
        width: 512,
        height: 512,
        alt: 'Concerto Music App',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Concerto - Professional Music App',
    description: 'Stream, create, and discover music with our comprehensive platform',
    images: ['/icons/icon-512x512.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Concerto',
    'application-name': 'Concerto',
    'msapplication-TileColor': '#8b5cf6',
    'msapplication-config': '/browserconfig.xml',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#8b5cf6" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#8b5cf6" />
        <meta name="msapplication-TileImage" content="/icons/icon-144x144.png" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <AudioProvider>
            <PWAProvider>
              {children}
            </PWAProvider>
          </AudioProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
