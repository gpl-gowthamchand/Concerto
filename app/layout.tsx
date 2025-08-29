import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '../components/ThemeProvider'
import { AudioProvider } from '../components/AudioProvider'
import { PWAProvider } from '../components/PWAProvider'
import { AuthProvider } from '../contexts/AuthContext'

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
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            <AudioProvider>
              <PWAProvider>
                {children}
              </PWAProvider>
            </AudioProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
