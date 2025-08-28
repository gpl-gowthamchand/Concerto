'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
  BarChart3, 
  Clock, 
  Music, 
  Heart, 
  Play, 
  Target,
  Award,
  Zap,
  Activity,
  PieChart,
  LineChart,
  RefreshCw,
  Download,
  Share2
} from 'lucide-react'
import { Song, mockSongs } from '../lib/musicData'
import { SlideIn, StaggeredItem } from './PageTransition'

interface AnalyticsData {
  totalSongs: number
  totalDuration: number
  totalPlays: number
  favoriteGenres: Array<{ genre: string; count: number; percentage: number }>
  listeningTrends: Array<{ date: string; plays: number }>
  topArtists: Array<{ artist: string; plays: number; songs: number }>
  topSongs: Array<{ song: Song; plays: number; lastPlayed: Date }>
  listeningHours: Array<{ hour: number; plays: number }>
  moodAnalysis: Array<{ mood: string; count: number; color: string }>
}

interface MusicAnalyticsProps {
  userHistory?: Song[]
  timeRange?: 'week' | 'month' | 'year' | 'all'
}

export default function MusicAnalytics({ 
  timeRange = 'month' 
}: MusicAnalyticsProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Generate mock analytics data
  const generateAnalytics = useMemo(() => {
    const data: AnalyticsData = {
      totalSongs: mockSongs.length,
      totalDuration: mockSongs.reduce((acc, song) => acc + song.duration, 0),
      totalPlays: Math.floor(Math.random() * 10000) + 5000,
      
      favoriteGenres: generateGenreStats(),
      listeningTrends: generateListeningTrends(),
      topArtists: generateTopArtists(),
      topSongs: generateTopSongs(),
      listeningHours: generateListeningHours(),
      moodAnalysis: generateMoodAnalysis()
    }
    
    return data
  }, [])

  // Generate genre statistics
  const generateGenreStats = () => {
    const genreCounts: Record<string, number> = {}
    mockSongs.forEach(song => {
      genreCounts[song.genre] = (genreCounts[song.genre] || 0) + 1
    })
    
    const total = Object.values(genreCounts).reduce((a, b) => a + b, 0)
    return Object.entries(genreCounts)
      .map(([genre, count]) => ({
        genre,
        count,
        percentage: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
  }

  // Generate listening trends
  const generateListeningTrends = () => {
    const trends = []
    const now = new Date()
    
    for (let i = 13; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      trends.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        plays: Math.floor(Math.random() * 100) + 20
      })
    }
    
    return trends
  }

  // Generate top artists
  const generateTopArtists = () => {
    const artistCounts: Record<string, { plays: number; songs: number }> = {}
    
    mockSongs.forEach(song => {
      if (!artistCounts[song.artist]) {
        artistCounts[song.artist] = { plays: 0, songs: 0 }
      }
      artistCounts[song.artist].plays += Math.floor(Math.random() * 1000) + 100
      artistCounts[song.artist].songs += 1
    })
    
    return Object.entries(artistCounts)
      .map(([artist, data]) => ({ artist, ...data }))
      .sort((a, b) => b.plays - a.plays)
      .slice(0, 10)
  }

  // Generate top songs
  const generateTopSongs = () => {
    return mockSongs
      .map(song => ({
        song,
        plays: Math.floor(Math.random() * 500) + 50,
        lastPlayed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      }))
      .sort((a, b) => b.plays - a.plays)
      .slice(0, 10)
  }

  // Generate listening hours
  const generateListeningHours = () => {
    const hours = []
    for (let hour = 0; hour < 24; hour++) {
      let plays = 0
      if (hour >= 8 && hour <= 12) plays = Math.floor(Math.random() * 200) + 100 // Morning
      else if (hour >= 17 && hour <= 22) plays = Math.floor(Math.random() * 300) + 200 // Evening
      else plays = Math.floor(Math.random() * 50) + 10 // Night
      
      hours.push({ hour, plays })
    }
    return hours
  }

  // Generate mood analysis
  const generateMoodAnalysis = () => {
    const moods = [
      { mood: 'Energetic', color: 'from-yellow-500 to-orange-600' },
      { mood: 'Calm', color: 'from-blue-500 to-indigo-600' },
      { mood: 'Happy', color: 'from-green-500 to-emerald-600' },
      { mood: 'Melancholic', color: 'from-purple-500 to-pink-600' },
      { mood: 'Focused', color: 'from-gray-500 to-slate-600' }
    ]
    
    return moods.map(mood => ({
      ...mood,
      count: Math.floor(Math.random() * 100) + 20
    }))
  }

  // Format duration
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  // Simulate data loading
  const refreshAnalytics = () => {
    setIsLoading(true)
    setTimeout(() => {
      setAnalyticsData(generateAnalytics)
      setIsLoading(false)
    }, 1500)
  }

  useEffect(() => {
    setAnalyticsData(generateAnalytics)
    setIsLoading(false)
  }, [generateAnalytics])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <BarChart3 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-300 mb-2">Analyzing your music data...</h2>
            <p className="text-gray-500">Crunching numbers and generating insights</p>
          </div>
        </div>
      </div>
    )
  }

  if (!analyticsData) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl">
              <BarChart3 className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Music Analytics
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Deep insights into your listening habits and music preferences
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row items-center justify-between mb-8 space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as 'week' | 'month' | 'year' | 'all')}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
              <option value="all">All Time</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={refreshAnalytics}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <Activity className="w-4 h-4" />
              <span>Advanced</span>
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StaggeredItem>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Songs</p>
                  <p className="text-3xl font-bold text-white">{formatNumber(analyticsData.totalSongs)}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Music className="w-6 h-6" />
                </div>
              </div>
            </div>
          </StaggeredItem>

          <StaggeredItem>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Duration</p>
                  <p className="text-3xl font-bold text-white">{formatDuration(analyticsData.totalDuration)}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
            </div>
          </StaggeredItem>

          <StaggeredItem>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Plays</p>
                  <p className="text-3xl font-bold text-white">{formatNumber(analyticsData.totalPlays)}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Play className="w-6 h-6" />
                </div>
              </div>
            </div>
          </StaggeredItem>

          <StaggeredItem>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Favorite Genre</p>
                  <p className="text-3xl font-bold text-white">{analyticsData.favoriteGenres[0]?.genre}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6" />
                </div>
              </div>
            </div>
          </StaggeredItem>
        </div>

        {/* Charts and Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Genre Distribution */}
          <StaggeredItem>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <PieChart className="w-5 h-5 text-blue-400" />
                <span>Genre Distribution</span>
              </h3>
              <div className="space-y-3">
                {analyticsData.favoriteGenres.slice(0, 6).map((genre) => (
                  <div key={genre.genre} className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
                    <span className="text-white font-medium flex-1">{genre.genre}</span>
                    <span className="text-gray-400">{genre.percentage}%</span>
                    <div className="w-20 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${genre.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </StaggeredItem>

          {/* Listening Trends */}
          <StaggeredItem>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <LineChart className="w-5 h-5 text-green-400" />
                <span>Listening Trends</span>
              </h3>
              <div className="flex items-end justify-between h-32 space-x-1">
                {analyticsData.listeningTrends.slice(-7).map((trend) => (
                  <div key={trend.date} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-b from-green-500 to-green-600 rounded-t"
                      style={{ height: `${(trend.plays / 100) * 100}%` }}
                    />
                    <span className="text-xs text-gray-400 mt-2">{trend.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </StaggeredItem>
        </div>

        {/* Top Artists and Songs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Artists */}
          <StaggeredItem>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-400" />
                <span>Top Artists</span>
              </h3>
              <div className="space-y-3">
                {analyticsData.topArtists.slice(0, 8).map((artist, index) => (
                  <div key={artist.artist} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{artist.artist}</div>
                      <div className="text-gray-400 text-sm">{artist.songs} songs</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">{formatNumber(artist.plays)}</div>
                      <div className="text-gray-400 text-xs">plays</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </StaggeredItem>

          {/* Top Songs */}
          <StaggeredItem>
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Target className="w-5 h-5 text-red-400" />
                <span>Top Songs</span>
              </h3>
              <div className="space-y-3">
                {analyticsData.topSongs.slice(0, 8).map((item, index) => (
                  <div key={item.song.id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium truncate">{item.song.title}</div>
                      <div className="text-gray-400 text-sm truncate">{item.song.artist}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">{formatNumber(item.plays)}</div>
                      <div className="text-gray-400 text-xs">plays</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </StaggeredItem>
        </div>

        {/* Advanced Analytics */}
        {showAdvanced && (
          <SlideIn className="mb-8">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
                <Zap className="w-5 h-5 text-purple-400" />
                <span>Advanced Insights</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Listening Hours */}
                <div>
                  <h4 className="text-lg font-medium text-white mb-4">Listening by Hour</h4>
                  <div className="flex items-end justify-between h-32 space-x-1">
                    {analyticsData.listeningHours.map((hour) => (
                      <div key={hour.hour} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-gradient-to-b from-purple-500 to-pink-600 rounded-t"
                          style={{ height: `${(hour.plays / 300) * 100}%` }}
                        />
                        <span className="text-xs text-gray-400 mt-2">{hour.hour}:00</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mood Analysis */}
                <div>
                  <h4 className="text-lg font-medium text-white mb-4">Mood Analysis</h4>
                  <div className="space-y-3">
                    {analyticsData.moodAnalysis.map((mood) => (
                      <div key={mood.mood} className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${mood.color}`} />
                        <span className="text-white font-medium flex-1">{mood.mood}</span>
                        <span className="text-gray-400">{mood.count}</span>
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full bg-gradient-to-r ${mood.color}`}
                            style={{ width: `${(mood.count / 100) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </SlideIn>
        )}

        {/* Export Options */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-4">
            <button className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
            <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              <Share2 className="w-4 h-4" />
              <span>Share Insights</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
