'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
  Brain, 
  Play, 
  Plus,
  Shuffle,
  Zap,
  Lightbulb,
  BarChart3,
  RefreshCw,
  Star,
  Search
} from 'lucide-react'
import { Song, mockSongs } from '../lib/musicData'
import { FadeIn, SlideIn, StaggeredList, StaggeredItem } from './PageTransition'

interface Recommendation {
  id: string
  type: 'similar' | 'mood' | 'trending' | 'discovery' | 'personalized'
  title: string
  description: string
  songs: Song[]
  confidence: number
  reason: string
  icon: string
  color: string
}

interface AIRecommendationsProps {
  onSongSelect: (song: Song) => void
  onPlaylistCreate: (songs: Song[], name: string) => void
  userHistory?: Song[]
}

export default function AIRecommendations({ 
  onSongSelect, 
  onPlaylistCreate,
  userHistory = []
}: AIRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [selectedType, setSelectedType] = useState<string>('all')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Generate AI recommendations based on user data and music patterns
  const generateRecommendations = useMemo(() => {
    const allRecommendations: Recommendation[] = []

    // 1. Similar Songs Recommendation
    if (userHistory.length > 0) {
      const recentSongs = userHistory.slice(-5)
      const similarSongs = findSimilarSongs(recentSongs)
      
      allRecommendations.push({
        id: 'similar-1',
        type: 'similar',
        title: 'Based on Your Recent Listens',
        description: 'Songs similar to what you\'ve been enjoying lately',
        songs: similarSongs.slice(0, 8),
        confidence: 0.89,
        reason: 'High similarity to recent listening patterns',
        icon: '🎯',
        color: 'from-blue-500 to-purple-600'
      })
    }

    // 2. Mood-Based Recommendations
    const moodRecommendations = generateMoodRecommendations()
    allRecommendations.push(...moodRecommendations)

    // 3. Trending Songs
    const trendingSongs = getTrendingSongs()
    allRecommendations.push({
      id: 'trending-1',
      type: 'trending',
      title: 'Trending Now',
      description: 'What\'s popular and gaining momentum',
      songs: trendingSongs.slice(0, 6),
      confidence: 0.76,
      reason: 'High play count and recent activity',
      icon: '🔥',
      color: 'from-orange-500 to-red-600'
    })

    // 4. Discovery Recommendations
    const discoverySongs = getDiscoverySongs()
    allRecommendations.push({
      id: 'discovery-1',
      type: 'discovery',
      title: 'Hidden Gems',
      description: 'Underrated songs you might love',
      songs: discoverySongs.slice(0, 6),
      confidence: 0.68,
      reason: 'High quality, low exposure tracks',
      icon: '💎',
      color: 'from-green-500 to-teal-600'
    })

    // 5. Personalized Mix
    if (userHistory.length > 0) {
      const personalizedMix = createPersonalizedMix(userHistory)
      allRecommendations.push({
        id: 'personalized-1',
        type: 'personalized',
        title: 'Your Perfect Mix',
        description: 'Curated just for your taste',
        songs: personalizedMix.slice(0, 10),
        confidence: 0.94,
        reason: 'Based on your unique listening patterns',
        icon: '✨',
        color: 'from-pink-500 to-purple-600'
      })
    }

    return allRecommendations
  }, [userHistory])

  // Find similar songs based on genre, year, and artist
  const findSimilarSongs = (referenceSongs: Song[]): Song[] => {
    const genreCounts: Record<string, number> = {}
    const yearRange = { min: 9999, max: 0 }
    const artistCounts: Record<string, number> = {}

    // Analyze reference songs
    referenceSongs.forEach(song => {
      genreCounts[song.genre] = (genreCounts[song.genre] || 0) + 1
      yearRange.min = Math.min(yearRange.min, song.year)
      yearRange.max = Math.max(yearRange.max, song.year)
      artistCounts[song.artist] = (artistCounts[song.artist] || 0) + 1
    })

    // Find similar songs
    return mockSongs
      .filter(song => !referenceSongs.find(ref => ref.id === song.id))
      .map(song => {
        let score = 0
        
        // Genre similarity
        if (genreCounts[song.genre]) {
          score += genreCounts[song.genre] * 3
        }
        
        // Year similarity
        if (song.year >= yearRange.min - 5 && song.year <= yearRange.max + 5) {
          score += 2
        }
        
        // Artist similarity
        if (artistCounts[song.artist]) {
          score += artistCounts[song.artist] * 2
        }

        return { song, score }
      })
      .sort((a, b) => b.score - a.score)
      .map(item => item.song)
  }

  // Generate mood-based recommendations
  const generateMoodRecommendations = (): Recommendation[] => {
    const moods = [
      {
        name: 'Energetic',
        icon: '⚡',
        color: 'from-yellow-500 to-orange-600',
        genres: ['Rock', 'Electronic', 'Pop'],
        description: 'High-energy tracks to boost your mood'
      },
      {
        name: 'Chill',
        icon: '🌙',
        color: 'from-blue-500 to-indigo-600',
        genres: ['Jazz', 'Classical', 'Ambient'],
        description: 'Relaxing music for unwinding'
      },
      {
        name: 'Happy',
        icon: '☀️',
        color: 'from-green-500 to-emerald-600',
        genres: ['Pop', 'Folk', 'Reggae'],
        description: 'Upbeat tunes to brighten your day'
      }
    ]

    return moods.map((mood, index) => {
      const moodSongs = mockSongs.filter(song => 
        mood.genres.includes(song.genre)
      ).slice(0, 6)

      return {
        id: `mood-${index}`,
        type: 'mood',
        title: `${mood.name} Vibes`,
        description: mood.description,
        songs: moodSongs,
        confidence: 0.72 + (index * 0.05),
        reason: `Based on ${mood.name.toLowerCase()} music patterns`,
        icon: mood.icon,
        color: mood.color
      }
    })
  }

  // Get trending songs (simulated)
  const getTrendingSongs = (): Song[] => {
    return mockSongs
      .sort(() => Math.random() - 0.5)
      .slice(0, 8)
  }

  // Get discovery songs (simulated)
  const getDiscoverySongs = (): Song[] => {
    return mockSongs
      .filter(song => song.year < 2000) // Older, potentially undiscovered
      .sort(() => Math.random() - 0.5)
      .slice(0, 6)
  }

  // Create personalized mix
  const createPersonalizedMix = (history: Song[]): Song[] => {
    const genrePreferences = history.reduce((acc, song) => {
      acc[song.genre] = (acc[song.genre] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const favoriteGenres = Object.entries(genrePreferences)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([genre]) => genre)

    return mockSongs
      .filter(song => favoriteGenres.includes(song.genre))
      .sort(() => Math.random() - 0.5)
      .slice(0, 10)
  }

  // Filter recommendations
  const filteredRecommendations = recommendations.filter(rec => {
    if (selectedType !== 'all' && rec.type !== selectedType) return false
    if (searchQuery && !rec.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  // Handle playlist creation
  const handleCreatePlaylist = (songs: Song[], name: string) => {
    onPlaylistCreate(songs, name)
  }

  // Simulate AI analysis
  const simulateAnalysis = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      setRecommendations(generateRecommendations)
    }, 2000)
  }

  useEffect(() => {
    setRecommendations(generateRecommendations)
  }, [generateRecommendations])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-3xl">
              <Brain className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              AI Music Recommendations
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover your next favorite songs with intelligent AI-powered suggestions
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row items-center justify-between mb-8 space-y-4 lg:space-y-0">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search recommendations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-800 text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Types</option>
              <option value="similar">Similar Songs</option>
              <option value="mood">Mood-Based</option>
              <option value="trending">Trending</option>
              <option value="discovery">Discovery</option>
              <option value="personalized">Personalized</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={simulateAnalysis}
              disabled={isAnalyzing}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              {isAnalyzing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4" />
              )}
              <span>{isAnalyzing ? 'Analyzing...' : 'Refresh AI'}</span>
            </button>
            
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Advanced</span>
            </button>
          </div>
        </div>

        {/* AI Insights Panel */}
        {showAdvanced && (
          <SlideIn className="mb-8">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <span>AI Insights</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-700 rounded-lg">
                  <div className="text-2xl mb-2">🎵</div>
                  <div className="text-sm text-gray-400">Songs Analyzed</div>
                  <div className="text-xl font-semibold text-white">{mockSongs.length}</div>
                </div>
                <div className="text-center p-4 bg-gray-700 rounded-lg">
                  <div className="text-2xl mb-2">🧠</div>
                  <div className="text-sm text-gray-400">AI Confidence</div>
                  <div className="text-xl font-semibold text-white">89%</div>
                </div>
                <div className="text-center p-4 bg-gray-700 rounded-lg">
                  <div className="text-2xl mb-2">⚡</div>
                  <div className="text-sm text-gray-400">Recommendations</div>
                  <div className="text-xl font-semibold text-white">{recommendations.length}</div>
                </div>
              </div>
            </div>
          </SlideIn>
        )}

        {/* Recommendations Grid */}
        <StaggeredList staggerDelay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRecommendations.map((recommendation) => (
              <StaggeredItem key={recommendation.id}>
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-200">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-gradient-to-r ${recommendation.color} rounded-xl flex items-center justify-center text-2xl`}>
                        {recommendation.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{recommendation.title}</h3>
                        <p className="text-gray-400 text-sm">{recommendation.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">{recommendation.confidence}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{recommendation.reason}</div>
                    </div>
                  </div>

                  {/* Songs List */}
                  <div className="space-y-2 mb-4">
                    {recommendation.songs.slice(0, 4).map((song) => (
                      <div
                        key={song.id}
                        className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer group"
                        onClick={() => onSongSelect(song)}
                      >
                        <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                          <Play className="w-3 h-3 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-white font-medium truncate">{song.title}</div>
                          <div className="text-gray-400 text-sm truncate">{song.artist}</div>
                        </div>
                        <div className="text-gray-500 text-sm">
                          {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      {recommendation.songs.length} songs • {Math.floor(recommendation.songs.reduce((acc, song) => acc + song.duration, 0) / 60)}m
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCreatePlaylist(recommendation.songs, recommendation.title)}
                        className="flex items-center space-x-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => {/* TODO: Implement shuffle play */}}
                        className="flex items-center space-x-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm"
                      >
                        <Shuffle className="w-3 h-3" />
                        <span>Shuffle</span>
                      </button>
                    </div>
                  </div>
                </div>
              </StaggeredItem>
            ))}
          </div>
        </StaggeredList>

        {/* Empty State */}
        {filteredRecommendations.length === 0 && (
          <FadeIn className="text-center py-16">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No recommendations found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or refresh the AI analysis</p>
            <button
              onClick={simulateAnalysis}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              Refresh AI Analysis
            </button>
          </FadeIn>
        )}
      </div>
    </div>
  )
}
