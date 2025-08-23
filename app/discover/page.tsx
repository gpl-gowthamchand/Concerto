'use client'

import { useState } from 'react'
import Header from '../../components/Header'
import MusicPlayer from '../../components/MusicPlayer'
import SearchBar from '../../components/SearchBar'
import { mockSongs, Song, getRandomSongs, getLikedSongs } from '../../lib/musicData'
import AIRecommendations from '../../components/AIRecommendations'
import SocialFeatures from '../../components/SocialFeatures'
import MoodPlaylists from '../../components/MoodPlaylists'
import AdvancedUI from '../../components/AdvancedUI'

export default function DiscoverPage() {
  const [currentSong, setCurrentSong] = useState<Song | undefined>()
  const [isPlaying, setIsPlaying] = useState(false)
  const [searchResults, setSearchResults] = useState<Song[]>([])

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

  const handleSearch = (query: string, filters: any) => {
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
  }

  const handleLike = (songId: string) => {
    console.log('Liked song:', songId)
  }

  const handleAddToPlaylist = (song: Song) => {
    console.log('Add to playlist:', song.title)
  }

  const recommendedSongs = getRandomSongs(mockSongs, 6)
  const likedSongs = getLikedSongs(mockSongs).slice(0, 4)

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pb-32">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Discover Music</h1>
          <p className="text-gray-400">
            Find new music, explore different genres, and discover your next favorite song.
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Search & Explore</h2>
          <SearchBar onSearch={handleSearch} className="max-w-2xl" />
        </div>

        {/* AI Recommendations */}
        <div className="mb-12">
          <AIRecommendations />
        </div>

        {/* Social Features */}
        <div className="mb-12">
          <SocialFeatures />
        </div>

        {/* Mood-Based Playlists */}
        <div className="mb-12">
          <MoodPlaylists />
        </div>

        {/* Advanced UI Components */}
        <div className="mb-12">
          <AdvancedUI />
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Search Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {searchResults.map(song => (
                <div key={song.id} className="bg-dark-800 rounded-lg p-4 border border-dark-700 hover:border-dark-600 transition-colors">
                  <div className="text-center space-y-3">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">🎵</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-white truncate">{song.title}</h4>
                      <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                      <p className="text-gray-500 text-xs truncate">{song.album}</p>
                    </div>
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handlePlay(song)}
                        className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors"
                      >
                        <span className="text-sm">▶</span>
                      </button>
                      <button
                        onClick={() => handleLike(song.id)}
                        className={`p-2 rounded-full transition-colors ${
                          song.isLiked 
                            ? 'text-red-500 hover:text-red-400' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <span className="text-sm">❤</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended for You */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Recommended for You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recommendedSongs.map(song => (
              <div key={song.id} className="bg-dark-800 rounded-lg p-4 border border-dark-700 hover:border-dark-600 transition-colors">
                <div className="text-center space-y-3">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">🎵</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-white truncate">{song.title}</h4>
                    <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                    <p className="text-gray-500 text-xs truncate">{song.album}</p>
                  </div>
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handlePlay(song)}
                      className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors"
                    >
                      <span className="text-sm">▶</span>
                    </button>
                    <button
                      onClick={() => handleLike(song.id)}
                      className={`p-2 rounded-full transition-colors ${
                        song.isLiked 
                          ? 'text-red-500 hover:text-red-400' 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <span className="text-sm">❤</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Based on Your Likes */}
        {likedSongs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Based on Your Likes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {likedSongs.map(song => (
                <div key={song.id} className="bg-dark-800 rounded-lg p-4 border border-dark-700 hover:border-dark-600 transition-colors">
                  <div className="text-center space-y-3">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-2xl">🎵</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-white truncate">{song.title}</h4>
                      <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                      <p className="text-gray-500 text-xs truncate">{song.album}</p>
                    </div>
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handlePlay(song)}
                        className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors"
                      >
                        <span className="text-sm">▶</span>
                      </button>
                      <button
                        onClick={() => handleLike(song.id)}
                        className="p-2 text-red-500 hover:text-red-400 rounded-full transition-colors"
                      >
                        <span className="text-sm">❤</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Genre Exploration */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Explore Genres</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Rock', 'Pop', 'Jazz', 'Classical', 'Hip Hop', 'Electronic', 'Country', 'Blues'].map(genre => (
              <div key={genre} className="bg-dark-800 rounded-lg p-6 border border-dark-700 hover:border-primary-500 transition-colors cursor-pointer group">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <span className="text-white font-bold text-xl">🎵</span>
                  </div>
                  <h3 className="font-medium text-white group-hover:text-primary-400 transition-colors">{genre}</h3>
                  <p className="text-gray-400 text-sm">Discover {genre} music</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Music Player */}
      <MusicPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </div>
  )
}
