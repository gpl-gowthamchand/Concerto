'use client'

import { useState, useEffect } from 'react'
import { usePlayer } from '../contexts/PlayerContext'
import { useAuth } from '../contexts/AuthContext'
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Heart,
  Play,
  Plus,
  MoreHorizontal
} from 'lucide-react'
import { mockSongs } from '../lib/musicData'

interface Recommendation {
  id: string
  title: string
  artist: string
  album: string
  genre: string
  duration: number
  reason: string
  confidence: number
  type: 'similar' | 'trending' | 'discovery' | 'mood'
}

export default function AIRecommendations() {
  const { playerState } = usePlayer()
  const { user } = useAuth()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMood, setSelectedMood] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')

  // Mock AI recommendation generation
  useEffect(() => {
    const generateRecommendations = () => {
      setIsLoading(true)
      
      // Simulate AI processing time
      setTimeout(() => {
        const mockRecommendations: Recommendation[] = [
          {
            id: 'rec1',
            title: 'Bohemian Rhapsody',
            artist: 'Queen',
            album: 'A Night at the Opera',
            genre: 'Rock',
            duration: 355,
            reason: 'Based on your love for classic rock',
            confidence: 0.94,
            type: 'similar'
          },
          {
            id: 'rec2',
            title: 'Hotel California',
            artist: 'Eagles',
            album: 'Hotel California',
            genre: 'Rock',
            duration: 391,
            reason: 'Similar to your recent listens',
            confidence: 0.89,
            type: 'similar'
          },
          {
            id: 'rec3',
            title: 'Imagine',
            artist: 'John Lennon',
            album: 'Imagine',
            genre: 'Pop',
            duration: 183,
            reason: 'Trending in your region',
            confidence: 0.82,
            type: 'trending'
          },
          {
            id: 'rec4',
            title: 'Stairway to Heaven',
            artist: 'Led Zeppelin',
            album: 'Led Zeppelin IV',
            genre: 'Rock',
            duration: 482,
            reason: 'New discovery based on your taste',
            confidence: 0.78,
            type: 'discovery'
          },
          {
            id: 'rec5',
            title: 'What a Wonderful World',
            artist: 'Louis Armstrong',
            album: 'What a Wonderful World',
            genre: 'Jazz',
            duration: 139,
            reason: 'Perfect for your current mood',
            confidence: 0.85,
            type: 'mood'
          }
        ]
        
        setRecommendations(mockRecommendations)
        setIsLoading(false)
      }, 1500)
    }

    generateRecommendations()
  }, [])

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-400'
    if (confidence >= 0.8) return 'text-yellow-400'
    if (confidence >= 0.7) return 'text-orange-400'
    return 'text-red-400'
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'similar':
        return <TrendingUp className="w-4 h-4" />
      case 'trending':
        return <Clock className="w-4 h-4" />
      case 'discovery':
        return <Sparkles className="w-4 h-4" />
      case 'mood':
        return <Heart className="w-4 h-4" />
      default:
        return <Brain className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'similar':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'trending':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'discovery':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'mood':
        return 'bg-pink-500/20 text-pink-400 border-pink-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const filteredRecommendations = recommendations.filter(rec => {
    if (selectedMood !== 'all' && rec.type === 'mood') return false
    if (selectedType !== 'all' && rec.type !== selectedType) return false
    return true
  })

  if (isLoading) {
    return (
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">AI Recommendations</h3>
        </div>
        
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-400 mb-2">AI is analyzing your music taste...</p>
          <p className="text-sm text-gray-500">Finding the perfect songs for you</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-purple-500 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">AI Recommendations</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Powered by</span>
          <span className="text-primary-400 font-semibold">Concerto AI</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-1 bg-dark-700 border border-dark-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Types</option>
          <option value="similar">Similar Songs</option>
          <option value="trending">Trending</option>
          <option value="discovery">New Discoveries</option>
          <option value="mood">Mood-Based</option>
        </select>
        
        <select
          value={selectedMood}
          onChange={(e) => setSelectedMood(e.target.value)}
          className="px-3 py-1 bg-dark-700 border border-dark-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Moods</option>
          <option value="energetic">Energetic</option>
          <option value="calm">Calm</option>
          <option value="happy">Happy</option>
          <option value="melancholic">Melancholic</option>
        </select>
      </div>

      {/* Recommendations List */}
      <div className="space-y-3">
        {filteredRecommendations.map((rec) => (
          <div key={rec.id} className="flex items-center space-x-3 p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors">
            {/* Album Art */}
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">🎵</span>
            </div>
            
            {/* Song Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-white font-medium truncate">{rec.title}</span>
                <span className={`px-2 py-1 rounded-full text-xs border ${getTypeColor(rec.type)}`}>
                  {getTypeIcon(rec.type)}
                </span>
              </div>
              <p className="text-gray-400 text-sm truncate">{rec.artist} • {rec.album}</p>
              <p className="text-gray-500 text-xs">{rec.reason}</p>
            </div>
            
            {/* Confidence Score */}
            <div className="text-right">
              <div className={`text-sm font-medium ${getConfidenceColor(rec.confidence)}`}>
                {(rec.confidence * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-gray-400">confidence</div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Play className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Plus className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* AI Insights */}
      <div className="mt-6 pt-6 border-t border-dark-600">
        <h4 className="text-lg font-medium text-white mb-3">AI Insights</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-dark-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-white font-medium">Listening Pattern</span>
            </div>
            <p className="text-gray-400 text-sm">
              You prefer energetic rock music in the evenings and calm jazz during work hours.
            </p>
          </div>
          
          <div className="bg-dark-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="text-white font-medium">Discovery Rate</span>
            </div>
            <p className="text-gray-400 text-sm">
              You discover 3-5 new songs weekly. Your taste is expanding into jazz and classical.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
