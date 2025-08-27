'use client'

import { useState } from 'react'
import Header from '../../components/Header'
import MusicPlayer from '../../components/MusicPlayer'
import { mockSongs, mockPlaylists, Song, Playlist } from '../../lib/musicData'

export default function PlaylistsPage() {
  const [currentSong, setCurrentSong] = useState<Song | undefined>()
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null)

  const handlePlay = (song: Song) => {
    setCurrentSong(song)
    setIsPlaying(true)
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
      const nextIndex = currentIndex === 0 ? mockSongs.length - 1 : currentIndex - 1
      setCurrentSong(mockSongs[nextIndex])
    }
  }

  const handleLike = (songId: string) => {
    console.log('Liked song:', songId)
  }

  const getPlaylistSongs = (playlist: Playlist): Song[] => {
    return mockSongs.filter(song => playlist.songs.includes(song.id))
  }

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pb-32">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Your Playlists</h1>
          <p className="text-gray-400">
            Organize your music into personalized playlists for every mood and occasion.
          </p>
        </div>

        {!selectedPlaylist ? (
          /* Playlists Grid */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">All Playlists</h2>
              <button className="btn-primary">
                Create New Playlist
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mockPlaylists.map(playlist => (
                <div 
                  key={playlist.id} 
                  className="bg-dark-800 rounded-lg p-6 border border-dark-700 hover:border-primary-500 transition-colors cursor-pointer group"
                  onClick={() => setSelectedPlaylist(playlist)}
                >
                  <div className="text-center space-y-4">
                    <div className="w-32 h-32 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                      <span className="text-white font-bold text-4xl">🎵</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg mb-2 group-hover:text-primary-400 transition-colors">
                        {playlist.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3">
                        {playlist.description || 'No description'}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{playlist.songs.length} songs</span>
                        <span>{formatDate(playlist.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Create New Playlist Card */}
              <div className="bg-dark-800/50 rounded-lg p-6 border-2 border-dashed border-dark-600 hover:border-primary-500 transition-colors cursor-pointer group">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 bg-dark-700 rounded-lg flex items-center justify-center mx-auto group-hover:bg-primary-600/20 transition-colors">
                    <span className="text-4xl text-gray-400 group-hover:text-primary-400 transition-colors">+</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-400 group-hover:text-primary-400 transition-colors">
                      Create New Playlist
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Start building your perfect playlist
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Playlist Detail View */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedPlaylist(null)}
                className="text-primary-400 hover:text-primary-300 transition-colors flex items-center space-x-2"
              >
                <span>←</span>
                <span>Back to Playlists</span>
              </button>
              <div className="flex items-center space-x-4">
                <button className="btn-primary">
                  Play All
                </button>
                <button className="btn-secondary">
                  Edit Playlist
                </button>
              </div>
            </div>

            {/* Playlist Header */}
            <div className="bg-dark-800 rounded-lg p-8 border border-dark-700">
              <div className="flex items-center space-x-6">
                <div className="w-32 h-32 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-6xl">🎵</span>
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-2">{selectedPlaylist.name}</h1>
                  <p className="text-gray-400 text-lg mb-4">
                    {selectedPlaylist.description || 'No description'}
                  </p>
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <span>Created by {selectedPlaylist.createdBy}</span>
                    <span>{selectedPlaylist.songs.length} songs</span>
                    <span>Updated {formatDate(selectedPlaylist.updatedAt)}</span>
                    <span className={selectedPlaylist.isPublic ? 'text-green-400' : 'text-yellow-400'}>
                      {selectedPlaylist.isPublic ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Playlist Songs */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Songs</h2>
              <div className="space-y-2">
                {getPlaylistSongs(selectedPlaylist).map((song, index) => (
                  <div
                    key={song.id}
                    className="bg-dark-800 rounded-lg p-4 border border-dark-700 hover:border-dark-600 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">🎵</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-500 text-sm w-8">{index + 1}</span>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white truncate">{song.title}</h4>
                            <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400 text-sm">
                          {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                        </span>
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
    </div>
  )
}
