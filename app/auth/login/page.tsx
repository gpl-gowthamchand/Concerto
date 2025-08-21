'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Header from '../../../components/Header'
import AuthForms from '../../../components/AuthForms'
import { useAuth } from '../../../contexts/AuthContext'

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/')
    }
  }, [isAuthenticated, isLoading, router])

  const handleLoginSuccess = () => {
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">🎵</span>
          </div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900">
      <Header />
      
      <main className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome Back to Concerto</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Sign in to continue your musical journey. Access your playlists, favorites, and personalized recommendations.
          </p>
        </div>

        <AuthForms 
          defaultMode="login" 
          onSuccess={handleLoginSuccess}
        />

        <div className="mt-8 text-center">
          <p className="text-gray-400">
            New to Concerto?{' '}
            <button
              onClick={() => router.push('/auth/signup')}
              className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              Create an account
            </button>
          </p>
        </div>
      </main>
    </div>
  )
}
