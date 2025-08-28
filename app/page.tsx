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
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState('')

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
      color: "from-spotify-600 to-green-800"
    },
    { 
      id: 4, 
      title: "Focus Flow", 
      description: "Music for concentration", 
      image: "🧠", 
      songCount: 60,
      color: "from-purple-600 to-accent-purple"
    },
    { 
      id: 5, 
      title: "Concerto Exclusives", 
      description: "Unique to our platform", 
      image: "🎼", 
      songCount: 25,
      color: "from-youtube-600 to-spotify-600"
    },
  ]

  const quickActions = [
    { icon: Radio, label: "Radio", color: "text-youtube-500", count: "12 stations" },
    { icon: Mic, label: "Podcasts", color: "text-spotify-500", count: "2.4k shows" },
    { icon: Volume2, label: "Live", color: "text-red-500", count: "56 active" },
    { icon: TrendingUp, label: "Charts", color: "text-orange-500", count: "Updated daily" },
  ]

  // Handle song selection and playback
  const handlePlay = useCallback((song: Song, playlist?: Song[]) => {
    const songsToQueue = playlist || [song]
    const startIndex = songsToQueue.findIndex(s => s.id === song.id)
    
    queueManager.setQueue(songsToQueue, startIndex)
    userPrefs.addToRecentlyPlayed(song.id)
    userPrefs.updateListeningStats(song.genre || 'Unknown')
    setIsPlaying(true)
  }, [queueManager, userPrefs])

  const handlePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  const handleNext = useCallback(() => {
    const nextSong = queueManager.next()
    if (nextSong) {
      userPrefs.addToRecentlyPlayed(nextSong.id)
      userPrefs.updateListeningStats(nextSong.genre || 'Unknown')
    }
  }, [queueManager, userPrefs])

  const handlePrevious = useCallback(() => {
    queueManager.previous()
  }, [queueManager])

  const handleLike = useCallback((songId: string) => {
    const isNowLiked = userPrefs.toggleLike(songId)
    
    // Add/remove from liked songs playlist
    if (isNowLiked) {
      const song = mockSongs.find(s => s.id === songId)
      if (song) {
        playlistManager.addToPlaylist('liked-songs', song)
      }
    } else {
      playlistManager.removeFromPlaylist('liked-songs', songId)
    }
  }, [userPrefs, playlistManager])

  const handleAddToPlaylist = useCallback((song: Song) => {
    // For now, add to a default "My Music" playlist or show playlist selector
    const myMusicPlaylist = playlistManager.playlists.find(p => p.name === 'My Music')
    if (myMusicPlaylist) {
      playlistManager.addToPlaylist(myMusicPlaylist.id, song)
    } else {
      // Create "My Music" playlist and add song
      const newPlaylist = playlistManager.createPlaylist('My Music', 'My personal collection')
      playlistManager.addToPlaylist(newPlaylist.id, song)
    }
  }, [playlistManager])

  const handleShuffle = useCallback(() => {
    if (mockSongs.length > 0) {
      queueManager.setQueue(mockSongs)
      queueManager.shuffle()
      const firstShuffledSong = queueManager.currentSong
      if (firstShuffledSong) {
        userPrefs.addToRecentlyPlayed(firstShuffledSong.id)
        setIsPlaying(true)
      }
    }
  }, [queueManager, userPrefs])

  const handleSearch = useCallback((results: SearchResult[]) => {
    setSearchResults(results)
    setShowSearchResults(results.length > 0)
  }, [])

  const handleSongSelect = useCallback((song: Song) => {
    handlePlay(song)
  }, [handlePlay])

  const handleCreatePlaylist = useCallback(() => {
    if (newPlaylistName.trim()) {
      playlistManager.createPlaylist(newPlaylistName.trim())
      setNewPlaylistName('')
      setShowCreatePlaylist(false)
    }
  }, [newPlaylistName, playlistManager])

  return (
    <div className="min-h-screen bg-dark-800 flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-black z-40 border-r border-gray-800">
        <div className="p-6">
          {/* Logo with Concerto Branding */}
          <Link href="/" className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 concerto-gradient rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">♪</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-white">Concerto</span>
              <span className="text-xs text-gray-400">Where every note matters</span>
            </div>
          </Link>

          {/* Main Navigation */}
          <div className="space-y-2 mb-8">
            <div className="sidebar-item active">
              <Music className="w-5 h-5" />
              <span>Home</span>
            </div>
            <Link href="/discover" className="sidebar-item">
              <TrendingUp className="w-5 h-5" />
              <span>Browse</span>
            </Link>
            <Link href="/library" className="sidebar-item">
              <Clock className="w-5 h-5" />
              <span>Your Library</span>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <h3 className="text-gray-400 text-sm font-semibold mb-4 uppercase tracking-wider">Quick Access</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <button key={index} className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-800 transition-colors group">
                  <action.icon className={`w-5 h-5 ${action.color} mb-1 group-hover:scale-110 transition-transform`} />
                  <span className="text-xs text-gray-400">{action.label}</span>
                  <span className="text-xs text-gray-500">{action.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Library */}
          <div className="mb-6">
            <h3 className="text-gray-400 text-sm font-semibold mb-4 uppercase tracking-wider">Your Music</h3>
            <div className="space-y-2">
              <div className="sidebar-item">
                <Heart className="w-5 h-5 text-youtube-500" />
                <span>Liked Songs</span>
                <span className="ml-auto text-xs text-gray-400">{likedSongs.length}</span>
              </div>
              <Link href="/playlists" className="sidebar-item">
                <Users className="w-5 h-5" />
                <span>Playlists</span>
                <span className="ml-auto text-xs text-gray-400">{playlistManager.playlists.length}</span>
              </Link>
              <div className="sidebar-item">
                <Download className="w-5 h-5" />
                <span>Downloads</span>
                <span className="ml-auto text-xs text-gray-400">
                  {playlistManager.getPlaylistSongs('downloads', mockSongs).length}
                </span>
              </div>
              <div className="sidebar-item">
                <List className="w-5 h-5" />
                <span>Queue</span>
                <span className="ml-auto text-xs text-gray-400">{queueManager.queue.length}</span>
              </div>
            </div>
          </div>

          {/* Create Playlist */}
          <div className="space-y-2">
            <button 
              onClick={() => setShowCreatePlaylist(true)}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Playlist</span>
            </button>
            <button 
              onClick={handleShuffle}
              className="w-full btn-primary-red flex items-center justify-center space-x-2"
            >
              <Shuffle className="w-4 h-4" />
              <span>Shuffle All</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 pb-32">
        {/* Top Bar */}
        <div className="sticky top-0 bg-gradient-to-r from-black via-gray-900 to-black z-30 border-b border-gray-800">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
              <button className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              <button className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
            
            {/* Functional Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <FunctionalSearchBar
                onSearch={handleSearch}
                onSongSelect={handleSongSelect}
                placeholder="Search songs, artists, albums, or lyrics..."
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/settings" className="btn-secondary text-sm flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
              <div className="w-10 h-10 concerto-gradient rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">U</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Search Results */}
          {showSearchResults && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Search Results</h2>
                <button
                  onClick={() => setShowSearchResults(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => result.data && handleSongSelect(result.data)}
                    className="music-card group cursor-pointer"
                  >
                    <div className="flex items-center space-x-3 p-4">
                      <div className="text-gray-400">
                        {result.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate">{result.title}</h3>
                        <p className="text-gray-400 text-sm truncate">{result.subtitle}</p>
                      </div>
                      {result.data && (
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity play-button">
                          <Play className="w-4 h-4 text-white fill-current" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Greeting & Stats */}
          {!showSearchResults && (
            <>
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">{getGreeting()}</h1>
                <div className="flex items-center space-x-6 text-gray-400">
                  <span>Ready to discover your next favorite song?</span>
                  <span>•</span>
                  <span>{userPrefs.preferences.songsPlayed} songs played</span>
                  <span>•</span>
                  <span>{Math.round(userPrefs.preferences.totalListeningTime / 60)} min listened</span>
                </div>
                
                <div className="flex items-center space-x-4 mt-6">
                  <button 
                    onClick={handleShuffle}
                    className="play-button-red"
                  >
                    <Shuffle className="w-6 h-6 text-white" />
                  </button>
                  <span className="text-white font-medium">Shuffle all your music</span>
                  {queueManager.currentSong && (
                    <span className="text-gray-400">• Now playing: {queueManager.currentSong.title}</span>
                  )}
                </div>
              </div>

              {/* Quick Access Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {recentlyPlayedSongs.map((song, index) => (
                  <div key={song.id} className="bg-gray-800 rounded-lg flex items-center hover:bg-gray-700 transition-all duration-200 cursor-pointer group">
                    <div className={`w-20 h-20 rounded-l-lg flex items-center justify-center text-2xl ${
                      index % 3 === 0 ? 'bg-gradient-to-br from-youtube-600 to-red-700' :
                      index % 3 === 1 ? 'bg-gradient-to-br from-spotify-500 to-green-700' :
                      'bg-gradient-to-br from-purple-600 to-accent-purple'
                    }`}>
                      🎵
                    </div>
                    <div className="p-4 flex-1">
                      <h3 className="font-semibold text-white truncate">{song.title}</h3>
                      <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                    </div>
                    <div className="pr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handlePlay(song, recentlyPlayedSongs)}
                        className={index % 2 === 0 ? "play-button-red" : "play-button"}
                      >
                        <Play className="w-5 h-5 text-white fill-current" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recently Played Section */}
              {recentlyPlayedSongs.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Jump back in</h2>
                    <Link href="/library" className="text-gray-400 hover:text-youtube-500 text-sm font-semibold transition-colors">
                      Show all
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {mockSongs.slice(0, 5).map((song, index) => (
                      <div key={song.id} className="music-card group">
                        <div className={`aspect-square rounded-lg mb-4 flex items-center justify-center text-4xl relative ${
                          index % 3 === 0 ? 'bg-gradient-to-br from-youtube-600 to-red-700' :
                          index % 3 === 1 ? 'bg-gradient-to-br from-spotify-500 to-green-700' :
                          'bg-gradient-to-br from-purple-600 to-accent-purple'
                        }`}>
                          🎵
                          <button 
                            onClick={() => handlePlay(song, mockSongs)}
                            className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 shadow-lg"
                          >
                            <Play className="w-4 h-4 text-black fill-current ml-0.5" />
                          </button>
                        </div>
                        <h3 className="font-semibold text-white truncate mb-1">{song.title}</h3>
                        <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Featured Playlists */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Made for you</h2>
                  <Link href="/discover" className="text-gray-400 hover:text-youtube-500 text-sm font-semibold transition-colors">
                    Show all
                  </Link>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {featuredPlaylists.map((playlist, index) => (
                    <div key={playlist.id} className="music-card group">
                      <div className={`aspect-square bg-gradient-to-br ${playlist.color} rounded-lg mb-4 flex items-center justify-center text-4xl relative`}>
                        {playlist.image}
                        <button 
                          onClick={() => {
                            // For demo, play a subset of songs
                            const playlistSongs = mockSongs.slice(index * 3, (index * 3) + 10)
                            handlePlay(playlistSongs[0], playlistSongs)
                          }}
                          className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 shadow-lg"
                        >
                          <Play className="w-4 h-4 text-black fill-current ml-0.5" />
                        </button>
                        {playlist.title.includes('Concerto') && (
                          <div className="absolute top-2 left-2 bg-youtube-600 text-white text-xs px-2 py-1 rounded-full">
                            EXCLUSIVE
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-white truncate mb-1">{playlist.title}</h3>
                      <p className="text-gray-400 text-sm truncate">{playlist.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Concerto Exclusives Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center">
                      <span className="concerto-gradient bg-clip-text text-transparent">Concerto Exclusives</span>
                      <span className="ml-2 bg-youtube-600 text-white text-xs px-2 py-1 rounded-full">NEW</span>
                    </h2>
                    <p className="text-gray-400 text-sm">Music you can only find here</p>
                  </div>
                  <Link href="/discover" className="text-gray-400 hover:text-youtube-500 text-sm font-semibold transition-colors">
                    Explore all
                  </Link>
                </div>
                
                <MusicLibrary
                  songs={mockSongs.slice(10, 16)}
                  currentSongId={queueManager.currentSong?.id}
                  isPlaying={isPlaying}
                  onPlay={(song) => handlePlay(song, mockSongs.slice(10, 16))}
                  onPause={handlePlayPause}
                  onLike={handleLike}
                  onAddToPlaylist={handleAddToPlaylist}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Functional Music Player */}
      {queueManager.currentSong && (
        <FunctionalMusicPlayer
          currentSong={queueManager.currentSong}
          playlist={queueManager.queue}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSongChange={(song) => {
            const index = queueManager.queue.findIndex(s => s.id === song.id)
            if (index >= 0) {
              queueManager.jumpTo(index)
            }
          }}
          onLike={handleLike}
        />
      )}

      {/* Create Playlist Modal */}
      {showCreatePlaylist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-xl font-bold text-white mb-4">Create Playlist</h3>
            <input
              type="text"
              placeholder="Playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-youtube-500"
              onKeyDown={(e) => e.key === 'Enter' && handleCreatePlaylist()}
              autoFocus
            />
            <div className="flex space-x-2">
              <button 
                onClick={handleCreatePlaylist}
                className="btn-primary flex-1"
                disabled={!newPlaylistName.trim()}
              >
                Create
              </button>
              <button 
                onClick={() => {
                  setShowCreatePlaylist(false)
                  setNewPlaylistName('')
                }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PWA Installer */}
      <PWAInstaller />
    </div>
  )
}