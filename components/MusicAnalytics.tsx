'use client'

import { useState, useEffect } from 'react'
import { 
  Clock, 
  TrendingUp, 
  Music, 
  Play
} from 'lucide-react'
import { mockSongs } from '../lib/musicData'

interface ListeningSession {
  songId: string
  duration: number
  timestamp: Date
  completed: boolean
}

interface GenreStats {
  genre: string
  count: number
  totalDuration: number
  percentage: number
}

interface ArtistStats {
  artist: string
  count: number
  totalDuration: number
  percentage: number
}

export default function MusicAnalytics() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [listeningSessions, setListeningSessions] = useState<ListeningSession[]>([])
  const [genreStats, setGenreStats] = useState<GenreStats[]>([])
  const [artistStats, setArtistStats] = useState<ArtistStats[]>([])
  const [totalListeningTime, setTotalListeningTime] = useState(0)
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>([])

  // Generate mock listening data
  useEffect(() => {
    const generateMockData = () => {
      const sessions: ListeningSession[] = []
      const now = new Date()
      
      // Generate sessions for the last 30 days
      for (let i = 0; i < 100; i++) {
        const randomSong = mockSongs[Math.floor(Math.random() * mockSongs.length)]
        const randomDaysAgo = Math.floor(Math.random() * 30)
        const randomHoursAgo = Math.floor(Math.random() * 24)
        const randomMinutesAgo = Math.floor(Math.random() * 60)
        
        const timestamp = new Date(now)
        timestamp.setDate(timestamp.getDate() - randomDaysAgo)
        timestamp.setHours(timestamp.getHours() - randomHoursAgo)
        timestamp.setMinutes(timestamp.getMinutes() - randomMinutesAgo)
        
        const duration = Math.floor(Math.random() * randomSong.duration) + 30
        const completed = Math.random() > 0.3 // 70% completion rate
        
        sessions.push({
          songId: randomSong.id,
          duration,
          timestamp,
          completed
        })
      }
      
      setListeningSessions(sessions)
    }

    generateMockData()
  }, [])

  // Calculate statistics
  useEffect(() => {
    if (listeningSessions.length === 0) return

    // Calculate total listening time
    const totalTime = listeningSessions.reduce((sum, session) => sum + session.duration, 0)
    setTotalListeningTime(totalTime)

    // Calculate genre statistics
    const genreMap = new Map<string, { count: number; totalDuration: number }>()
    
    listeningSessions.forEach(session => {
      const song = mockSongs.find(s => s.id === session.songId)
      if (song?.genre) {
        const existing = genreMap.get(song.genre) || { count: 0, totalDuration: 0 }
        existing.count++
        existing.totalDuration += session.duration
        genreMap.set(song.genre, existing)
      }
    })

    const genreStatsArray: GenreStats[] = Array.from(genreMap.entries()).map(([genre, stats]) => ({
      genre,
      count: stats.count,
      totalDuration: stats.totalDuration,
      percentage: (stats.count / listeningSessions.length) * 100
    })).sort((a, b) => b.count - a.count)

    setGenreStats(genreStatsArray)

    // Calculate artist statistics
    const artistMap = new Map<string, { count: number; totalDuration: number }>()
    
    listeningSessions.forEach(session => {
      const song = mockSongs.find(s => s.id === session.songId)
      if (song?.artist) {
        const existing = artistMap.get(song.artist) || { count: 0, totalDuration: 0 }
        existing.count++
        existing.totalDuration += session.duration
        artistMap.set(song.artist, existing)
      }
    })

    const artistStatsArray: ArtistStats[] = Array.from(artistMap.entries()).map(([artist, stats]) => ({
      artist,
      count: stats.count,
      totalDuration: stats.totalDuration,
      percentage: (stats.count / listeningSessions.length) * 100
    })).sort((a, b) => b.count - a.count)

    setArtistStats(artistStatsArray)

    // Set favorite genres (top 3)
    setFavoriteGenres(genreStatsArray.slice(0, 3).map(g => g.genre))
  }, [listeningSessions])

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Music Analytics</h2>
          <p className="text-gray-400">Your listening habits and preferences</p>
        </div>
        
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d' | '1y')}
          className="px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-dark-800 rounded-lg p-4 border border-dark-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Listening</p>
              <p className="text-white font-semibold">{formatDuration(totalListeningTime)}</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-800 rounded-lg p-4 border border-dark-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Songs Played</p>
              <p className="text-white font-semibold">{listeningSessions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-800 rounded-lg p-4 border border-dark-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Completion Rate</p>
              <p className="text-white font-semibold">
                {formatPercentage((listeningSessions.filter(s => s.completed).length / listeningSessions.length) * 100)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-dark-800 rounded-lg p-4 border border-dark-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Top Genre</p>
              <p className="text-white font-semibold">{favoriteGenres[0] || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Genre Distribution */}
        <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
          <h3 className="text-lg font-semibold text-white mb-4">Genre Distribution</h3>
          <div className="space-y-3">
            {genreStats.slice(0, 8).map((genre, index) => (
              <div key={genre.genre} className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: `hsl(${index * 45}, 70%, 60%)` }} />
                <div className="flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">{genre.genre}</span>
                    <span className="text-gray-400">{formatPercentage(genre.percentage)}</span>
                  </div>
                  <div className="w-full bg-dark-600 rounded-full h-2 mt-1">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${genre.percentage}%`,
                        backgroundColor: `hsl(${index * 45}, 70%, 60%)`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Artist Performance */}
        <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
          <h3 className="text-lg font-semibold text-white mb-4">Top Artists</h3>
          <div className="space-y-3">
            {artistStats.slice(0, 8).map((artist, index) => (
              <div key={artist.artist} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <span className="text-gray-300">{artist.artist}</span>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm">{artist.count} plays</p>
                  <p className="text-gray-400 text-xs">{formatDuration(artist.totalDuration)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Listening Activity</h3>
        <div className="space-y-3">
          {listeningSessions.slice(0, 10).map((session, index) => {
            const song = mockSongs.find(s => s.id === session.songId)
            if (!song) return null

            return (
              <div key={index} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">🎵</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{song.title}</p>
                    <p className="text-gray-400 text-sm">{song.artist}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-300 text-sm">
                    {session.timestamp.toLocaleDateString()}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {formatDuration(session.duration)}
                    {session.completed ? ' ✓' : ' ⏸️'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
