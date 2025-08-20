'use client'

import { useState } from 'react'
import Header from '../../components/Header'
import MusicPlayer from '../../components/MusicPlayer'
import MusicLibrary from '../../components/MusicLibrary'
import { mockSongs, Song } from '../../lib/musicData'

export default function LibraryPage() {
  const [currentSong, setCurrentSong] = useState<Song | undefined>()
  const [isPlaying, setIsPlaying] = useState(false)

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
      
      <main className="container mx-auto px-4 py-8 pb-32">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Music Library</h1>
          <p className="text-gray-400">
            Discover and organize your music collection. Browse by genre, artist, or album.
          </p>
        </div>

        <MusicLibrary
          songs={mockSongs}
          currentSongId={currentSong?.id}
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onLike={handleLike}
          onAddToPlaylist={handleAddToPlaylist}
        />
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
