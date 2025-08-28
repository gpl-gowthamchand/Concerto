import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '../contexts/AuthContext'
import { PlayerProvider } from '../contexts/PlayerContext'
import { ThemeProvider } from '../contexts/ThemeContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Concerto - Where Every Note Matters',
  description: 'A free music streaming app - discover, play, and enjoy music without limits',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-dark-800 text-white transition-colors duration-300`}>
        <ThemeProvider>
          <AuthProvider>
            <PlayerProvider>
              {children}
            </PlayerProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
