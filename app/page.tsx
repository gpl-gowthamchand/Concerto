'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Heart, 
  Music, 
  TrendingUp, 
  Radio,
  List,
  Mic
} from 'lucide-react'

// Import real music service and working player
import WorkingMusicPlayer from '../components/WorkingMusicPlayer'
import FunctionalSearchBar from '../components/FunctionalSearchBar'
import PWAInstaller from '../components/PWAInstaller'
import { realMusicService, RealSong, RealPlaylist, SearchResult } from '../lib/realMusicService'
import { usePlaylistManager } from '../hooks/usePlaylistManager'
import { useUserPreferences } from '../hooks/useUserPreferences'

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSong, setCurrentSong] = useState<RealSong | null>(null)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [trendingSongs, setTrendingSongs] = useState<RealSong[]>([])
  const [featuredPlaylists, setFeaturedPlaylists] = useState<RealPlaylist[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Use our custom hooks
  const playlistManager = usePlaylistManager()
  const userPrefs = useUserPreferences()

  // Load real music data on component mount
  useEffect(() => {
    const loadMusicData = async () => {
      try {
        setIsLoading(true)
        
        // Load trending music and featured playlists
        const [trending, playlists] = await Promise.all([
          realMusicService.getTrendingMusic(20),
          realMusicService.getFeaturedPlaylists(10)
        ])
        
        setTrendingSongs(trending)
        setFeaturedPlaylists(playlists)
      } catch (error) {
        console.error('Error loading music data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMusicData()
  }, [])

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
  const likedSongs = trendingSongs.filter(song => userPrefs.isLiked(song.id))
  const recentlyPlayedSongs = userPrefs.preferences.recentlyPlayed
    .slice(0, 6)
    .map(id => trendingSongs.find(song => song.id === id))
    .filter((song): song is RealSong => song !== undefined)

  const handleSearch = async (query: string, filters: { songs?: boolean; artists?: boolean; albums?: boolean }) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    try {
      const results = await realMusicService.searchMusic(query, filters)
      setSearchResults(results)
      setShowSearchResults(true)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
      setShowSearchResults(false)
    }
  }

  const handleSongSelect = (song: RealSong) => {
    setCurrentSong(song)
    setIsPlaying(true)
    userPrefs.addToRecentlyPlayed(song.id)
    setShowSearchResults(false)
  }

  const handlePlayPause = () => {
    if (currentSong) {
      setIsPlaying(!isPlaying)
    }
  }

  const handleNext = () => {
    if (currentSong && trendingSongs.length > 0) {
      const currentIndex = trendingSongs.findIndex(song => song.id === currentSong.id)
      const nextIndex = (currentIndex + 1) % trendingSongs.length
      const nextSong = trendingSongs[nextIndex]
      setCurrentSong(nextSong)
      userPrefs.addToRecentlyPlayed(nextSong.id)
    }
  }

  const handlePrevious = () => {
    if (currentSong && trendingSongs.length > 0) {
      const currentIndex = trendingSongs.findIndex(song => song.id === currentSong.id)
      const prevIndex = currentIndex === 0 ? trendingSongs.length - 1 : currentIndex - 1
      const prevSong = trendingSongs[prevIndex]
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

  const handlePlaylistClick = (playlist: RealPlaylist) => {
    // Navigate to playlist page or play first song
    if (playlist.songs.length > 0) {
      handleSongSelect(playlist.songs[0])
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your music...</p>
        </div>
      </div>
    )
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
                    key={result.data.id}
                    onClick={() => result.type === 'song' && handleSongSelect(result.data as RealSong)}
                    className="flex items-center space-x-4 p-4 hover:bg-dark-700 cursor-pointer transition-colors border-b border-dark-700 last:border-b-0"
                  >
                    <div className="text-primary-400">
                      <Music className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium truncate">{result.data.title}</h4>
                      <p className="text-gray-400 text-sm truncate">
                        {result.type === 'song' 
                          ? `${(result.data as RealSong).artist} • ${(result.data as RealSong).album}`
                          : (result.data as RealPlaylist).description
                        }
                      </p>
                    </div>
                    {result.type === 'song' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleLikeSong(result.data.id)
                        }}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Heart className="w-4 h-4" fill={userPrefs.isLiked(result.data.id) ? 'currentColor' : 'none'} />
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
              <p className="text-gray-400 mb-4">Discover what&apos;s hot in music right now</p>
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
              <div 
                key={playlist.id} 
                onClick={() => handlePlaylistClick(playlist)}
                className="bg-dark-800 rounded-lg p-6 border border-dark-700 hover:border-primary-500 transition-colors cursor-pointer group"
              >
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto group-hover:scale-105 transition-transform overflow-hidden">
                    {playlist.cover.startsWith('http') ? (
                      <img 
                        src={playlist.cover} 
                        alt={playlist.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-4xl">{playlist.cover}</span>
                    )}
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
                      <span className="capitalize">{playlist.mood}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Songs */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Trending Songs</h2>
            <button className="text-primary-400 hover:text-primary-300 transition-colors">
              View All
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {trendingSongs.slice(0, 12).map((song) => (
              <div
                key={song.id}
                onClick={() => handleSongSelect(song)}
                className="bg-dark-800 rounded-lg p-4 border border-dark-700 hover:border-primary-500 transition-colors cursor-pointer group"
              >
                <div className="text-center space-y-3">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto group-hover:scale-105 transition-transform overflow-hidden">
                    {song.cover.startsWith('http') ? (
                      <img 
                        src={song.cover} 
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-2xl">{song.cover}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-white text-sm truncate group-hover:text-primary-400 transition-colors">
                      {song.title}
                    </h4>
                    <p className="text-gray-400 text-xs truncate">{song.artist}</p>
                    <p className="text-gray-500 text-xs truncate">{song.album}</p>
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
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center mx-auto group-hover:scale-105 transition-transform overflow-hidden">
                      {song.cover.startsWith('http') ? (
                        <img 
                          src={song.cover} 
                          alt={song.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-2xl">{song.cover}</span>
                      )}
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
                    <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-pink-600 rounded-lg flex items-center justify-center mx-auto group-hover:scale-105 transition-transform overflow-hidden">
                      {song.cover.startsWith('http') ? (
                        <img 
                          src={song.cover} 
                          alt={song.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-2xl">{song.cover}</span>
                      )}
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

      {/* Working Music Player */}
      {currentSong && (
        <WorkingMusicPlayer
          currentSong={currentSong}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrevious={handlePrevious}
          queue={trendingSongs}
        />
      )}
    </div>
  )
}