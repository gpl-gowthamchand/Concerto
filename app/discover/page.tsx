'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import AIRecommendations from '@/components/AIRecommendations'
import SocialFeatures from '@/components/SocialFeatures'
import MoodPlaylists from '@/components/MoodPlaylists'
import AdvancedUI from '@/components/AdvancedUI'
import MobileOptimizations from '@/components/MobileOptimizations'
import PerformanceFeatures from '@/components/PerformanceFeatures'
import FinalPolish from '@/components/FinalPolish'
import AdvancedDiscovery from '@/components/AdvancedDiscovery'
import MusicProductionStudio from '@/components/MusicProductionStudio'
import ProfessionalDevOps from '@/components/ProfessionalDevOps'
import BusinessIntelligence from '@/components/BusinessIntelligence'

export default function DiscoverPage() {
  const { isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState('ai-recommendations')

  const tabs = [
    { id: 'ai-recommendations', name: '🤖 AI Recommendations', component: AIRecommendations, needsSongProps: true },
    { id: 'social-features', name: '👥 Social Features', component: SocialFeatures, needsSongProps: false },
    { id: 'mood-playlists', name: '🎭 Mood Playlists', component: MoodPlaylists, needsSongProps: false },
    { id: 'advanced-ui', name: '✨ Advanced UI', component: AdvancedUI, needsSongProps: false },
    { id: 'mobile-optimizations', name: '📱 Mobile Features', component: MobileOptimizations, needsSongProps: false },
    { id: 'performance-features', name: '⚡ Performance', component: PerformanceFeatures, needsSongProps: false },
    { id: 'final-polish', name: '🎯 Quality Assurance', component: FinalPolish, needsSongProps: false },
    { id: 'ai-discovery', name: '🧠 AI Discovery Engine', component: AdvancedDiscovery, needsSongProps: false },
    { id: 'production-studio', name: '🎛️ Music Production Studio', component: MusicProductionStudio, needsSongProps: false },
    { id: 'devops', name: '🚀 DevOps & Deployment', component: ProfessionalDevOps, needsSongProps: false },
    { id: 'business-intelligence', name: '📊 Business Intelligence', component: BusinessIntelligence, needsSongProps: false }
  ]

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">Please sign in to access the discover features.</p>
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
            🎵 Discover Amazing Music & Features
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore AI-powered recommendations, social features, mood-based playlists, and advanced music production tools.
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
                if (tab.id === 'production-studio') {
                  const ProductionComponent = tab.component as typeof MusicProductionStudio
                  return <ProductionComponent key={tab.id} onSave={() => {}} onExport={() => {}} />
                }
                if (tab.needsSongProps) {
                  const AIComponent = tab.component as typeof AIRecommendations
                  return <AIComponent key={tab.id} onSongSelect={() => {}} onPlaylistCreate={() => {}} />
                }
                const DefaultComponent = tab.component as React.ComponentType
                return <DefaultComponent key={tab.id} />
              }
              return null
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
