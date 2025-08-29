'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { 
  Play, 
  Heart, 
  Plus, 
  Music, 
  TrendingUp, 
  Clock, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  Shuffle,
  Download,
  Volume2,
  Mic,
  Radio,
  List,
  Settings,
  X
} from 'lucide-react'

// Import all our new functional components and hooks
import FunctionalMusicPlayer from '../components/FunctionalMusicPlayer'
import FunctionalSearchBar from '../components/FunctionalSearchBar'
import MusicLibrary from '../components/MusicLibrary'
import PWAInstaller from '../components/PWAInstaller'
import { mockSongs, Song } from '../lib/musicData'
import { usePlaylistManager } from '../hooks/usePlaylistManager'
import { useUserPreferences } from '../hooks/useUserPreferences'
import { useQueueManager } from '../hooks/useQueueManager'

interface SearchResult {
  id: string
  type: 'song' | 'artist' | 'album' | 'playlist' | 'lyric'
  title: string
  subtitle: string
  icon: React.ReactNode
  data?: Song
  highlight?: string
}

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Use our custom hooks
  const playlistManager = usePlaylistManager()
  const userPrefs = useUserPreferences()
  const queueManager = useQueueManager()

  // Update time every minute for greeting
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon' 
    return 'Good evening'
  }

  // Get user's favorite songs and recently played
  const likedSongs = mockSongs.filter(song => userPrefs.isLiked(song.id))
  const recentlyPlayedSongs = userPrefs.preferences.recentlyPlayed
    .slice(0, 6)
    .map(id => mockSongs.find(song => song.id === id))
    .filter((song): song is Song => song !== undefined)

  const featuredPlaylists = [
    { 
      id: 1, 
      title: "Today's Top Hits", 
      description: "The biggest songs right now", 
      image: "🔥", 
      songCount: 50,
      color: "from-youtube-600 to-youtube-800"
    },
    { 
      id: 2, 
      title: "Chill Vibes", 
      description: "Relax and unwind", 
      image: "🌙", 
      songCount: 75,
      color: "from-blue-600 to-blue-800"
    },
    { 
      id: 3, 
      title: "Workout Beats", 
      description: "High energy music", 
      image: "💪", 
      songCount: 40,
      color: "from-green-600 to-green-800"
    }
  ]

  const handleSearch = (query: string, filters: { songs?: boolean; artists?: boolean; albums?: boolean }) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    const results: SearchResult[] = []
    
    if (filters.songs !== false) {
      const songResults = mockSongs.filter(song => 
        song.title.toLowerCase().includes(query.toLowerCase()) ||
        song.artist.toLowerCase().includes(query.toLowerCase()) ||
        song.album.toLowerCase().includes(query.toLowerCase())
      )
      
      songResults.forEach(song => {
        results.push({
          id: song.id,
          type: 'song',
          title: song.title,
          subtitle: `${song.artist} • ${song.album}`,
          icon: <Music className="w-5 h-5" />,
          data: song
        })
      })
    }

    setSearchResults(results)
    setShowSearchResults(true)
  }

  const handleSongSelect = (song: Song) => {
    setCurrentSong(song)
    setIsPlaying(true)
    userPrefs.addToRecentlyPlayed(song.id)
    setShowSearchResults(false)
    setSearchQuery('')
  }

  const handlePlayPause = () => {
    if (currentSong) {
      setIsPlaying(!isPlaying)
    }
  }

  const handleNext = () => {
    if (currentSong) {
      const currentIndex = mockSongs.findIndex(song => song.id === currentSong.id)
      const nextIndex = (currentIndex + 1) % mockSongs.length
      const nextSong = mockSongs[nextIndex]
      setCurrentSong(nextSong)
      userPrefs.addToRecentlyPlayed(nextSong.id)
    }
  }

  const handlePrevious = () => {
    if (currentSong) {
      const currentIndex = mockSongs.findIndex(song => song.id === currentSong.id)
      const prevIndex = currentIndex === 0 ? mockSongs.length - 1 : currentIndex - 1
      const prevSong = mockSongs[prevIndex]
      setCurrentSong(prevSong)
      userPrefs.addToRecentlyPlayed(prevSong.id)
    }
  }

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      playlistManager.createPlaylist(newPlaylistName.trim())
      setNewPlaylistName('')
      setShowCreatePlaylist(false)
    }
  }

  const handleLikeSong = (songId: string) => {
    userPrefs.toggleLiked(songId)
  }

  const handleAddToPlaylist = (songId: string, playlistId: string) => {
    const song = mockSongs.find(s => s.id === songId)
    if (song) {
      playlistManager.addToPlaylist(playlistId, song)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900">
      {/* Header */}
      <header className="bg-dark-800/80 backdrop-blur-md border-b border-dark-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-400 to-purple-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Concerto</h1>
                <p className="text-gray-400 text-sm">Your music companion</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/discover" className="btn-secondary">
                <Music className="w-4 h-4 mr-2" />
                Discover
              </Link>
              <Link href="/library" className="btn-secondary">
                <List className="w-4 h-4 mr-2" />
                Library
              </Link>
              <Link href="/playlists" className="btn-secondary">
                <Heart className="w-4 h-4 mr-2" />
                Playlists
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 pb-32">
        {/* Greeting Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            {getGreeting()}, Music Lover! 🎵
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover, create, and enjoy your perfect music experience with Concerto
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-12">
          <FunctionalSearchBar 
            onSearch={handleSearch}
            placeholder="Search for songs, artists, albums..."
            className="max-w-2xl mx-auto"
          />
          
          {/* Search Results */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="mt-4 max-w-2xl mx-auto">
              <div className="bg-dark-800 rounded-lg border border-dark-700 max-h-96 overflow-y-auto">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => result.type === 'song' && result.data && handleSongSelect(result.data)}
                    className="flex items-center space-x-4 p-4 hover:bg-dark-700 cursor-pointer transition-colors border-b border-dark-700 last:border-b-0"
                  >
                    <div className="text-primary-400">
                      {result.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium truncate">{result.title}</h4>
                      <p className="text-gray-400 text-sm truncate">{result.subtitle}</p>
                    </div>
                    {result.type === 'song' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (result.data) handleLikeSong(result.data.id)
                        }}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Heart className="w-4 h-4" fill={result.data && userPrefs.isLiked(result.data.id) ? 'currentColor' : 'none'} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-dark-800 rounded-lg p-6 border border-dark-700 hover:border-primary-500 transition-colors">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Trending Now</h3>
              <p className="text-gray-400 mb-4">Discover what's hot in music right now</p>
              <Link href="/discover" className="btn-primary w-full">
                Explore Trends
              </Link>
            </div>
          </div>

          <div className="bg-dark-800 rounded-lg p-6 border border-dark-700 hover:border-primary-500 transition-colors">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Radio className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Radio Stations</h3>
              <p className="text-gray-400 mb-4">Listen to curated radio stations</p>
              <button className="btn-primary w-full">
                Start Listening
              </button>
            </div>
          </div>

          <div className="bg-dark-800 rounded-lg p-6 border border-dark-700 hover:border-primary-500 transition-colors">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Voice Commands</h3>
              <p className="text-gray-400 mb-4">Control music with your voice</p>
              <button className="btn-primary w-full">
                Try Voice Control
              </button>
            </div>
          </div>
        </div>

        {/* Featured Playlists */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Featured Playlists</h2>
            <button className="text-primary-400 hover:text-primary-300 transition-colors">
              View All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPlaylists.map((playlist) => (
              <div key={playlist.id} className="bg-dark-800 rounded-lg p-6 border border-dark-700 hover:border-primary-500 transition-colors cursor-pointer group">
                <div className="text-center space-y-4">
                  <div className={`w-32 h-32 bg-gradient-to-br ${playlist.color} rounded-lg flex items-center justify-center mx-auto group-hover:scale-105 transition-transform`}>
                    <span className="text-white font-bold text-4xl">{playlist.image}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg mb-2 group-hover:text-primary-400 transition-colors">
                      {playlist.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-3">
                      {playlist.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{playlist.songCount} songs</span>
                      <span>Updated today</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Played */}
        {recentlyPlayedSongs.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Recently Played</h2>
              <button className="text-primary-400 hover:text-primary-300 transition-colors">
                View All
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {recentlyPlayedSongs.map((song) => (
                <div
                  key={song.id}
                  onClick={() => handleSongSelect(song)}
                  className="bg-dark-800 rounded-lg p-4 border border-dark-700 hover:border-primary-500 transition-colors cursor-pointer group"
                >
                  <div className="text-center space-y-3">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                      <span className="text-white font-bold text-2xl">{song.cover}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-white text-sm truncate group-hover:text-primary-400 transition-colors">
                        {song.title}
                      </h4>
                      <p className="text-gray-400 text-xs truncate">{song.artist}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Liked Songs */}
        {likedSongs.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Liked Songs</h2>
              <button className="text-primary-400 hover:text-primary-300 transition-colors">
                View All
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {likedSongs.slice(0, 6).map((song) => (
                <div
                  key={song.id}
                  onClick={() => handleSongSelect(song)}
                  className="bg-dark-800 rounded-lg p-4 border border-dark-700 hover:border-primary-500 transition-colors cursor-pointer group"
                >
                  <div className="text-center space-y-3">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-pink-600 rounded-lg flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                      <span className="text-white font-bold text-2xl">{song.cover}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-white text-sm truncate group-hover:text-primary-400 transition-colors">
                        {song.title}
                      </h4>
                      <p className="text-gray-400 text-xs truncate">{song.artist}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Playlist Modal */}
        {showCreatePlaylist && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-dark-800 rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-semibold text-white mb-4">Create New Playlist</h3>
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Playlist name"
                className="w-full p-3 bg-dark-700 text-white rounded-lg border border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
              />
              <div className="flex space-x-3">
                <button
                  onClick={handleCreatePlaylist}
                  className="flex-1 btn-primary"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowCreatePlaylist(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PWA Installer */}
        <PWAInstaller />
      </main>

      {/* Music Player */}
      {currentSong && (
        <FunctionalMusicPlayer
          currentSong={currentSong}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}
    </div>
  )
}