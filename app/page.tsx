'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Play, Heart, Plus, Music, TrendingUp, Clock, Users, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import ModernMusicPlayer from '../components/ModernMusicPlayer'
import MusicLibrary from '../components/MusicLibrary'
import PWAInstaller from '../components/PWAInstaller'
import { mockSongs, Song } from '../lib/musicData'

export default function Home() {
  const [currentSong, setCurrentSong] = useState<Song | undefined>()
  const [isPlaying, setIsPlaying] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSection, setActiveSection] = useState('home')

  const recentlyPlayed = mockSongs.slice(0, 4)
  const featuredPlaylists = [
    { id: 1, title: "Today's Top Hits", description: "The biggest songs right now", image: "🔥", songCount: 50 },
    { id: 2, title: "Chill Vibes", description: "Relax and unwind", image: "🌙", songCount: 75 },
    { id: 3, title: "Workout Beats", description: "High energy music", image: "💪", songCount: 40 },
    { id: 4, title: "Focus Flow", description: "Music for concentration", image: "🧠", songCount: 60 },
    { id: 5, title: "Party Mix", description: "Get the party started", image: "🎉", songCount: 35 },
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
    console.log('Liked song:', songId)
  }

  const handleAddToPlaylist = (song: Song) => {
    console.log('Add to playlist:', song.title)
  }

  return (
    <div className="min-h-screen bg-dark-800 flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-dark-900 z-40 border-r border-dark-700">
        <div className="p-6">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-spotify-500 to-spotify-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold text-white">Concerto</span>
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

          {/* Library */}
          <div className="mb-6">
            <h3 className="text-gray-400 text-sm font-semibold mb-4 uppercase tracking-wider">Your Music</h3>
            <div className="space-y-2">
              <div className="sidebar-item">
                <Heart className="w-5 h-5" />
                <span>Liked Songs</span>
              </div>
              <Link href="/playlists" className="sidebar-item">
                <Users className="w-5 h-5" />
                <span>Playlists</span>
              </Link>
            </div>
          </div>

          {/* Create Playlist */}
          <button className="w-full btn-primary flex items-center justify-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create Playlist</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 pb-32">
        {/* Top Bar */}
        <div className="sticky top-0 bg-dark-800/80 backdrop-blur-md border-b border-dark-700 z-30">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
              <button className="w-8 h-8 rounded-full bg-dark-900 flex items-center justify-center hover:bg-dark-700 transition-colors">
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              <button className="w-8 h-8 rounded-full bg-dark-900 flex items-center justify-center hover:bg-dark-700 transition-colors">
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="What do you want to listen to?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-dark-850 border border-dark-600 rounded-full py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-spotify-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="btn-secondary text-sm">Premium</button>
              <div className="w-8 h-8 bg-gradient-to-r from-spotify-500 to-spotify-400 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">U</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Greeting */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Good evening</h1>
            <p className="text-gray-400">Ready to discover your next favorite song?</p>
          </div>

          {/* Quick Access */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {recentlyPlayed.map((song) => (
              <div key={song.id} className="bg-dark-850 rounded-lg flex items-center hover:bg-dark-700 transition-all duration-200 cursor-pointer group">
                <div className="w-20 h-20 bg-gradient-to-br from-spotify-500 to-spotify-400 rounded-l-lg flex items-center justify-center text-2xl">
                  🎵
                </div>
                <div className="p-4 flex-1">
                  <h3 className="font-semibold text-white truncate">{song.title}</h3>
                  <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                </div>
                <div className="pr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handlePlay(song)}
                    className="w-10 h-10 bg-spotify-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    <Play className="w-4 h-4 text-white fill-current" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Recently Played Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Recently played</h2>
              <Link href="/library" className="text-gray-400 hover:text-white text-sm font-semibold">
                Show all
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {mockSongs.slice(0, 5).map((song) => (
                <div key={song.id} className="music-card">
                  <div className="aspect-square bg-gradient-to-br from-spotify-500 to-spotify-400 rounded-lg mb-4 flex items-center justify-center text-4xl relative group">
                    🎵
                    <button 
                      onClick={() => handlePlay(song)}
                      className="absolute bottom-2 right-2 w-10 h-10 bg-spotify-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                    >
                      <Play className="w-4 h-4 text-white fill-current" />
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
              <Link href="/discover" className="text-gray-400 hover:text-white text-sm font-semibold">
                Show all
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {featuredPlaylists.map((playlist) => (
                <div key={playlist.id} className="music-card">
                  <div className="aspect-square bg-gradient-to-br from-accent-purple to-accent-pink rounded-lg mb-4 flex items-center justify-center text-4xl relative group">
                    {playlist.image}
                    <button className="absolute bottom-2 right-2 w-10 h-10 bg-spotify-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110">
                      <Play className="w-4 h-4 text-white fill-current" />
                    </button>
                  </div>
                  <h3 className="font-semibold text-white truncate mb-1">{playlist.title}</h3>
                  <p className="text-gray-400 text-sm truncate">{playlist.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* More Music */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Explore more music</h2>
              <Link href="/library" className="text-gray-400 hover:text-white text-sm font-semibold">
                View all
              </Link>
            </div>
            
            <MusicLibrary
              songs={mockSongs.slice(5, 11)}
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