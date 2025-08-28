'use client'

import { useState, useEffect } from 'react'
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
  Search,
  Shuffle,
  MoreHorizontal,
  Download,
  Share2,
  Volume2,
  Mic,
  Radio
} from 'lucide-react'
import ModernMusicPlayer from '../components/ModernMusicPlayer'
import MusicLibrary from '../components/MusicLibrary'
import PWAInstaller from '../components/PWAInstaller'
import { mockSongs, Song } from '../lib/musicData'

export default function Home() {
  const [currentSong, setCurrentSong] = useState<Song | undefined>()
  const [isPlaying, setIsPlaying] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSection, setActiveSection] = useState('home')
  const [likedSongs, setLikedSongs] = useState<Set<string>>(new Set())
  const [currentTime, setCurrentTime] = useState(new Date())

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

  const recentlyPlayed = mockSongs.slice(0, 6)
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
    { icon: Radio, label: "Radio", color: "text-youtube-500" },
    { icon: Mic, label: "Podcasts", color: "text-spotify-500" },
    { icon: Volume2, label: "Live", color: "text-red-500" },
    { icon: TrendingUp, label: "Charts", color: "text-orange-500" },
  ]

  const handlePlay = (song: Song) => {
    setCurrentSong(song)
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleNext = () => {
    if (currentSong) {
      const currentIndex = mockSongs.findIndex(song => song.id === currentSong.id)
      const nextIndex = (currentIndex + 1) % mockSongs.length
      setCurrentSong(mockSongs[nextIndex])
    }
  }

  const handlePrevious = () => {
    if (currentSong) {
      const currentIndex = mockSongs.findIndex(song => song.id === currentSong.id)
      const prevIndex = currentIndex === 0 ? mockSongs.length - 1 : currentIndex - 1
      setCurrentSong(mockSongs[prevIndex])
    }
  }

  const handleLike = (songId: string) => {
    setLikedSongs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(songId)) {
        newSet.delete(songId)
      } else {
        newSet.add(songId)
      }
      return newSet
    })
  }

  const handleAddToPlaylist = (song: Song) => {
    console.log('Add to playlist:', song.title)
  }

  const handleShuffle = () => {
    const randomSong = mockSongs[Math.floor(Math.random() * mockSongs.length)]
    handlePlay(randomSong)
  }

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
            <div className={`sidebar-item ${activeSection === 'home' ? 'active' : ''}`} onClick={() => setActiveSection('home')}>
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
                <button key={index} className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-800 transition-colors">
                  <action.icon className={`w-5 h-5 ${action.color} mb-1`} />
                  <span className="text-xs text-gray-400">{action.label}</span>
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
                <span className="ml-auto text-xs text-gray-400">{likedSongs.size}</span>
              </div>
              <Link href="/playlists" className="sidebar-item">
                <Users className="w-5 h-5" />
                <span>Playlists</span>
              </Link>
              <div className="sidebar-item">
                <Download className="w-5 h-5" />
                <span>Downloads</span>
              </div>
            </div>
          </div>

          {/* Create Playlist */}
          <div className="space-y-2">
            <button className="w-full btn-primary flex items-center justify-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create Playlist</span>
            </button>
            <button className="w-full btn-primary-red flex items-center justify-center space-x-2">
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
            
            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search songs, artists, lyrics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-full py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-youtube-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="btn-secondary text-sm">Upgrade to Pro</button>
              <div className="w-10 h-10 concerto-gradient rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">U</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Greeting & Quick Play */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">{getGreeting()}</h1>
            <p className="text-gray-400 mb-6">Ready to discover your next favorite song?</p>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleShuffle}
                className="play-button-red"
              >
                <Shuffle className="w-6 h-6 text-white" />
              </button>
              <span className="text-white font-medium">Shuffle all your music</span>
            </div>
          </div>

          {/* Quick Access Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {recentlyPlayed.map((song, index) => (
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
                    onClick={() => handlePlay(song)}
                    className={index % 2 === 0 ? "play-button-red" : "play-button"}
                  >
                    <Play className="w-5 h-5 text-white fill-current" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Recently Played Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Recently played</h2>
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
                      onClick={() => handlePlay(song)}
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
                    <button className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 shadow-lg">
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
              currentSongId={currentSong?.id}
              isPlaying={isPlaying}
              onPlay={handlePlay}
              onPause={handlePause}
              onLike={handleLike}
              onAddToPlaylist={handleAddToPlaylist}
            />
          </div>
        </div>
      </div>

      {/* Music Player */}
      <ModernMusicPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />

      {/* PWA Installer */}
      <PWAInstaller />
    </div>
  )
}