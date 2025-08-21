'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Header from '../../../components/Header'
import AuthForms from '../../../components/AuthForms'
import { useAuth } from '../../../contexts/AuthContext'

export default function SignupPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/')
    }
  }, [isAuthenticated, isLoading, router])

  const handleSignupSuccess = () => {
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
          <h1 className="text-4xl font-bold text-white mb-4">Join Concerto</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Create your free account and start discovering unlimited music. Build playlists, save favorites, and enjoy personalized recommendations.
          </p>
        </div>

        <AuthForms 
          defaultMode="signup" 
          onSuccess={handleSignupSuccess}
        />

        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/auth/login')}
              className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Why Join Concerto?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎵</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Unlimited Music</h3>
              <p className="text-gray-400">Access millions of songs across all genres, completely free.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Cross Platform</h3>
              <p className="text-gray-400">Listen on any device, anywhere, anytime with seamless sync.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Smart Discovery</h3>
              <p className="text-gray-400">Find new music tailored to your taste with AI-powered recommendations.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
