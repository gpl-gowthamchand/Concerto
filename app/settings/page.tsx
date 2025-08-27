'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Header from '../../components/Header'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Palette, 
  Bell, 
  Music, 
  Shield, 
  LogOut,
  Save,
  Moon,
  Sun,
  Monitor
} from 'lucide-react'

export default function SettingsPage() {
  const { user, isAuthenticated, isLoading, logout, updatePreferences } = useAuth()
  const router = useRouter()
  const [preferences, setPreferences] = useState({
    theme: 'dark' as 'light' | 'dark' | 'auto',
    language: 'en',
    notifications: true,
    autoPlay: true,
    crossfade: false,
    highQuality: true
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (user) {
      setPreferences({
        theme: user.preferences.theme,
        language: user.preferences.language,
        notifications: user.preferences.notifications,
        autoPlay: preferences.autoPlay,
        crossfade: preferences.crossfade,
        highQuality: preferences.highQuality
      })
    }
  }, [user, preferences.autoPlay, preferences.crossfade, preferences.highQuality])

  const handlePreferenceChange = (key: string, value: string | boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      updatePreferences(preferences)
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 1000))
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
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

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-gray-400">Customize your Concerto experience</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Section */}
            <div className="lg:col-span-1">
              <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-3xl">🎵</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white">{user?.username}</h3>
                  <p className="text-gray-400">{user?.email}</p>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Settings Sections */}
            <div className="lg:col-span-2 space-y-6">
              {/* Appearance */}
              <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
                <div className="flex items-center space-x-3 mb-6">
                  <Palette className="w-6 h-6 text-primary-400" />
                  <h3 className="text-xl font-semibold text-white">Appearance</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Theme
                    </label>
                    <div className="flex space-x-2">
                      {[
                        { value: 'light', icon: Sun, label: 'Light' },
                        { value: 'dark', icon: Moon, label: 'Dark' },
                        { value: 'auto', icon: Monitor, label: 'Auto' }
                      ].map(({ value, icon: Icon, label }) => (
                        <button
                          key={value}
                          onClick={() => handlePreferenceChange('theme', value)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                            preferences.theme === value
                              ? 'border-primary-500 bg-primary-500/20 text-primary-400'
                              : 'border-dark-600 text-gray-400 hover:border-dark-500'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Language
                    </label>
                    <select
                      value={preferences.language}
                      onChange={(e) => handlePreferenceChange('language', e.target.value)}
                      className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="it">Italiano</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
                <div className="flex items-center space-x-3 mb-6">
                  <Bell className="w-6 h-6 text-primary-400" />
                  <h3 className="text-xl font-semibold text-white">Notifications</h3>
                </div>
                
                <div className="space-y-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.notifications}
                      onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                      className="w-5 h-5 text-primary-600 bg-dark-700 border-dark-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-gray-300">Enable notifications</span>
                  </label>
                </div>
              </div>

              {/* Music Preferences */}
              <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
                <div className="flex items-center space-x-3 mb-6">
                  <Music className="w-6 h-6 text-primary-400" />
                  <h3 className="text-xl font-semibold text-white">Music Preferences</h3>
                </div>
                
                <div className="space-y-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.autoPlay}
                      onChange={(e) => handlePreferenceChange('autoPlay', e.target.checked)}
                      className="w-5 h-5 text-primary-600 bg-dark-700 border-dark-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-gray-300">Auto-play next song</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.crossfade}
                      onChange={(e) => handlePreferenceChange('crossfade', e.target.checked)}
                      className="w-5 h-5 text-primary-600 bg-dark-700 border-dark-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-gray-300">Enable crossfade between songs</span>
                  </label>
                  
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={preferences.highQuality}
                      onChange={(e) => handlePreferenceChange('highQuality', e.target.checked)}
                      className="w-5 h-5 text-primary-600 bg-dark-700 border-dark-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-gray-300">High quality audio streaming</span>
                  </label>
                  
                  <div className="pt-4 border-t border-dark-600">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Crossfade Duration: <span className="text-primary-400">3.5s</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="12"
                      step="0.5"
                      defaultValue="3.5"
                      className="w-full slider"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Audio Quality: <span className="text-primary-400">Lossless</span>
                    </label>
                    <select className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option value="lossy">Lossy (MP3)</option>
                      <option value="lossless">Lossless (FLAC)</option>
                      <option value="hires">Hi-Res (24-bit/96kHz)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Sample Rate: <span className="text-primary-400">44.1 kHz</span>
                    </label>
                    <select className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option value="44.1">44.1 kHz</option>
                      <option value="48">48 kHz</option>
                      <option value="96">96 kHz</option>
                      <option value="192">192 kHz</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Privacy & Security */}
              <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
                <div className="flex items-center space-x-3 mb-6">
                  <Shield className="w-6 h-6 text-primary-400" />
                  <h3 className="text-xl font-semibold text-white">Privacy & Security</h3>
                </div>
                
                <div className="space-y-4">
                  <p className="text-gray-400 text-sm">
                    Your data is encrypted and secure. We never share your personal information with third parties.
                  </p>
                  
                  <div className="flex space-x-3">
                    <button className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors">
                      Export Data
                    </button>
                    <button className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
