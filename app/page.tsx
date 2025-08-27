'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '../components/Header'
import MusicPlayer from '../components/MusicPlayer'
import SearchBar from '../components/SearchBar'
import MusicLibrary from '../components/MusicLibrary'
import PWAInstaller from '../components/PWAInstaller'
import { mockSongs, Song } from '../lib/musicData'

export default function Home() {
  const [currentSong, setCurrentSong] = useState<Song | undefined>()
  const [isPlaying, setIsPlaying] = useState(false)
  const [searchResults, setSearchResults] = useState<Song[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)

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

  const handleSearch = (query: string, filters: { songs?: boolean; artists?: boolean; albums?: boolean }) => {
    const results = mockSongs.filter(song => {
      const matchesQuery = song.title.toLowerCase().includes(query.toLowerCase()) ||
                          song.artist.toLowerCase().includes(query.toLowerCase()) ||
                          song.album.toLowerCase().includes(query.toLowerCase())
      
      const matchesFilters = (filters.songs && song.genre) ||
                            (filters.artists && song.artist) ||
                            (filters.albums && song.album)
      
      return matchesQuery && matchesFilters
    })
    
    setSearchResults(results)
    setShowSearchResults(true)
  }

  const handleLike = (songId: string) => {
    // In a real app, this would update the backend
    console.log('Liked song:', songId)
  }

  const handleAddToPlaylist = (song: Song) => {
    // In a real app, this would open a playlist selector
    console.log('Add to playlist:', song.title)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900">
      <Header />
      
      <main className="pb-32"> {/* Add bottom padding for music player */}
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
              Concerto
            </h1>
            <p className="text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Where every note matters. Discover, play, and enjoy music without limits - completely free.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <SearchBar onSearch={handleSearch} />
            </div>
            
            <div className="flex gap-4 justify-center mb-12">
              <button 
                onClick={() => setShowSearchResults(false)}
                className="btn-primary text-lg px-8 py-3"
              >
                Start Listening
              </button>
              <Link href="/library" className="btn-secondary text-lg px-8 py-3">
                Browse Library
              </Link>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {showSearchResults && (
          <div className="container mx-auto px-4 py-16">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Search Results</h2>
              <button
                onClick={() => setShowSearchResults(false)}
                className="text-primary-400 hover:text-primary-300 transition-colors"
              >
                ← Back to Home
              </button>
            </div>
            <MusicLibrary
              songs={searchResults}
              currentSongId={currentSong?.id}
              isPlaying={isPlaying}
              onPlay={handlePlay}
              onPause={handlePause}
              onLike={handleLike}
              onAddToPlaylist={handleAddToPlaylist}
            />
          </div>
        )}

        {/* Features Section */}
        {!showSearchResults && (
          <div className="container mx-auto px-4 py-16">
            <h2 className="text-4xl font-bold text-center text-white mb-12">Why Choose Concerto?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="card text-center">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎵</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Unlimited Music</h3>
                <p className="text-gray-400">Access millions of songs across all genres, completely free.</p>
              </div>
              
              <div className="card text-center">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎧</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">High Quality</h3>
                <p className="text-gray-400">Crystal clear audio quality for the best listening experience.</p>
              </div>
              
              <div className="card text-center">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Cross Platform</h3>
                <p className="text-gray-400">Listen on any device, anywhere, anytime.</p>
              </div>
            </div>
          </div>
        )}

        {/* Music Library Preview */}
        {!showSearchResults && (
          <div className="container mx-auto px-4 py-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">Featured Music</h2>
              <Link href="/library" className="text-primary-400 hover:text-primary-300 transition-colors">
                View All →
              </Link>
            </div>
            <MusicLibrary
              songs={mockSongs.slice(0, 6)}
              currentSongId={currentSong?.id}
              isPlaying={isPlaying}
              onPlay={handlePlay}
              onPause={handlePause}
              onLike={handleLike}
              onAddToPlaylist={handleAddToPlaylist}
            />
          </div>
        )}

        {/* Coming Soon Section */}
        {!showSearchResults && (
          <div className="container mx-auto px-4 py-16 text-center">
            <h2 className="text-4xl font-bold mb-4">More Features Coming</h2>
            <p className="text-xl text-gray-400 mb-8">
              We&apos;re building something amazing. Stay tuned for the full Concerto experience.
            </p>
            <div className="inline-block bg-primary-600 text-white px-6 py-3 rounded-full">
              🚀 Development in Progress
            </div>
          </div>
        )}
      </main>

      {/* Music Player */}
      <MusicPlayer
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
