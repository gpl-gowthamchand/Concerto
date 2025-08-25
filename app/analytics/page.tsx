'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import AudioVisualizer from '@/components/AudioVisualizer'
import Equalizer from '@/components/Equalizer'
import MusicAnalytics from '@/components/MusicAnalytics'
import ProductionTesting from '@/components/ProductionTesting'

export default function AnalyticsPage() {
  const { isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState('audio-visualizer')

  const tabs = [
    { id: 'audio-visualizer', name: '🎵 Audio Visualizer', component: AudioVisualizer },
    { id: 'equalizer', name: '🎛️ Equalizer', component: Equalizer },
    { id: 'music-analytics', name: '📊 Music Analytics', component: MusicAnalytics },
    { id: 'production-testing', name: '🚀 Production Testing', component: ProductionTesting }
  ]

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">Please sign in to access the analytics features.</p>
          <a href="/auth/login" className="btn-primary">Sign In</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📊 Analytics & Production Testing Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced audio visualization, equalizer controls, music analytics, and comprehensive production testing tools.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap justify-center lg:justify-start px-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-4 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {tabs.map((tab) => {
              if (activeTab === tab.id) {
                const Component = tab.component
                return <Component key={tab.id} />
              }
              return null
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
