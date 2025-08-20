'use client'

import { useState } from 'react'
import { Play, Pause, Heart, MoreVertical, Clock } from 'lucide-react'

interface Song {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  cover: string
  isLiked?: boolean
}

interface SongCardProps {
  song: Song
  isPlaying?: boolean
  isCurrentSong?: boolean
  onPlay?: (song: Song) => void
  onPause?: () => void
  onLike?: (songId: string) => void
  onAddToPlaylist?: (song: Song) => void
}

export default function SongCard({
  song,
  isPlaying = false,
  isCurrentSong = false,
  onPlay,
  onPause,
  onLike,
  onAddToPlaylist
}: SongCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handlePlayPause = () => {
    if (isPlaying && onPause) {
      onPause()
    } else if (!isPlaying && onPlay) {
      onPlay(song)
    }
  }

  const handleLike = () => {
    if (onLike) {
      onLike(song.id)
    }
  }

  return (
    <div
      className={`group relative p-4 rounded-lg transition-all duration-200 ${
        isCurrentSong 
          ? 'bg-primary-600/20 border border-primary-500/30' 
          : 'bg-dark-800 hover:bg-dark-700 border border-dark-700 hover:border-dark-600'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center space-x-4">
        {/* Cover Art */}
        <div className="relative w-12 h-12 flex-shrink-0">
          <div className="w-full h-full bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">🎵</span>
          </div>
          
          {/* Play/Pause Overlay */}
          {isHovered && (
            <button
              onClick={handlePlayPause}
              className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
            </button>
          )}
        </div>

        {/* Song Info */}
        <div className="flex-1 min-w-0">
          <h4 className={`font-medium truncate ${
            isCurrentSong ? 'text-primary-200' : 'text-white'
          }`}>
            {song.title}
          </h4>
          <p className="text-gray-400 text-sm truncate">{song.artist}</p>
          <p className="text-gray-500 text-xs truncate">{song.album}</p>
        </div>

        {/* Duration */}
        <div className="flex items-center space-x-1 text-gray-400 text-sm">
          <Clock className="w-4 h-4" />
          <span>{formatDuration(song.duration)}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleLike}
            className={`p-2 rounded-full transition-colors ${
              song.isLiked 
                ? 'text-red-500 hover:text-red-400' 
                : 'text-gray-400 hover:text-white opacity-0 group-hover:opacity-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${song.isLiked ? 'fill-current' : ''}`} />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="p-2 text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {showOptions && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-dark-700 border border-dark-600 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    if (onAddToPlaylist) onAddToPlaylist(song)
                    setShowOptions(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-dark-600 hover:text-white transition-colors"
                >
                  Add to Playlist
                </button>
                <button
                  onClick={() => setShowOptions(false)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-dark-600 hover:text-white transition-colors"
                >
                  Download
                </button>
                <button
                  onClick={() => setShowOptions(false)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-dark-600 hover:text-white transition-colors"
                >
                  Share
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar for Current Song */}
      {isCurrentSong && (
        <div className="mt-3">
          <div className="w-full h-1 bg-dark-600 rounded-full">
            <div className="h-full bg-primary-500 rounded-full" style={{ width: '45%' }}></div>
          </div>
        </div>
      )}
    </div>
  )
}
