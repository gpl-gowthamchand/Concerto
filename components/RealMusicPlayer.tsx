'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Heart,
  Plus,
  Share2,
  List,
  Maximize2,
  Minimize2
} from 'lucide-react'
import { YouTubeMusicTrack } from '../lib/youtubeMusicService'
import { SlideIn } from './PageTransition'

interface RealMusicPlayerProps {
  currentTrack: YouTubeMusicTrack | null
  isPlaying: boolean
  onPlay: () => void
  onPause: () => void
  onNext: () => void
  onPrevious: () => void
  onTrackSelect: (track: YouTubeMusicTrack) => void
  onVolumeChange: (volume: number) => void
  onShuffle: () => void
  onRepeat: () => void
  onLike: (track: YouTubeMusicTrack) => void
  onAddToPlaylist: (track: YouTubeMusicTrack) => void
  onShare: (track: YouTubeMusicTrack) => void
  onFullscreen: () => void
}

export default function RealMusicPlayer({
  currentTrack,
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onTrackSelect,
  onVolumeChange,
  onShuffle,
  onRepeat,
  onLike,
  onAddToPlaylist,
  onShare,
  onFullscreen
}: RealMusicPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isMuted, setIsMuted] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showQueue, setShowQueue] = useState(false)
  const [queue] = useState<YouTubeMusicTrack[]>([])
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set())

  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  // Initialize audio element
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      // For educational purposes, we'll use a mock audio source
      // In a real implementation, this would use the actual YouTube audio stream
      audioRef.current.src = `https://www.youtube.com/watch?v=${currentTrack.id}`
      audioRef.current.load()
      
      // Set duration from track metadata
      setDuration(currentTrack.duration)
      setCurrentTime(0)
    }
  }, [currentTrack])

  // Audio event handlers
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleEnded = () => {
    onNext()
  }

  // Progress bar click handler
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && audioRef.current) {
      const rect = progressRef.current.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const width = rect.width
      const clickTime = (clickX / width) * duration
      
      audioRef.current.currentTime = clickTime
      setCurrentTime(clickTime)
    }
  }

  // Volume control
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
    onVolumeChange(newVolume)
    
    if (newVolume === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    if (isMuted) {
      handleVolumeChange(volume)
    } else {
      handleVolumeChange(0)
    }
  }

  // Shuffle and repeat
  const toggleShuffle = () => {
    setIsShuffled(!isShuffled)
    onShuffle()
  }

  const toggleRepeat = () => {
    const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all']
    const currentIndex = modes.indexOf(repeatMode)
    const nextMode = modes[(currentIndex + 1) % modes.length]
    setRepeatMode(nextMode)
    onRepeat()
  }

  // Like track
  const handleLike = () => {
    if (currentTrack) {
      const newLikedTracks = new Set(likedTracks)
      if (newLikedTracks.has(currentTrack.id)) {
        newLikedTracks.delete(currentTrack.id)
      } else {
        newLikedTracks.add(currentTrack.id)
      }
      setLikedTracks(newLikedTracks)
      onLike(currentTrack)
    }
  }

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Get repeat icon
  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'one': return '1'
      case 'all': return '∞'
      default: return '↻'
    }
  }

  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4">
        <div className="text-center text-gray-400">
          <p>No track selected. Choose a song to start playing!</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="metadata"
      />

      {/* Main Player UI */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-gray-800 border-t border-gray-700 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            
            {/* Track Info */}
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={currentTrack.thumbnail}
                  alt={currentTrack.title}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="min-w-0 flex-1">
                <h3 className="text-white font-semibold truncate">
                  {currentTrack.title}
                </h3>
                <p className="text-gray-400 text-sm truncate">
                  {currentTrack.artist}
                </p>
                {currentTrack.album && (
                  <p className="text-gray-500 text-xs truncate">
                    {currentTrack.album}
                  </p>
                )}
              </div>

              {/* Like Button */}
              <button
                onClick={handleLike}
                className={`p-2 rounded-full transition-colors ${
                  likedTracks.has(currentTrack.id)
                    ? 'text-red-500 hover:text-red-400'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Like"
              >
                <Heart className="w-5 h-5" fill={likedTracks.has(currentTrack.id) ? 'currentColor' : 'none'} />
              </button>

              {/* Add to Playlist */}
              <button
                onClick={() => onAddToPlaylist(currentTrack)}
                className="p-2 text-gray-400 hover:text-white rounded-full transition-colors"
                title="Add to Playlist"
              >
                <Plus className="w-5 h-5" />
              </button>

              {/* Share */}
              <button
                onClick={() => onShare(currentTrack)}
                className="p-2 text-gray-400 hover:text-white rounded-full transition-colors"
                title="Share"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center space-x-4">
              {/* Shuffle */}
              <button
                onClick={toggleShuffle}
                className={`p-2 rounded-full transition-colors ${
                  isShuffled ? 'text-green-500' : 'text-gray-400 hover:text-white'
                }`}
                title="Shuffle"
              >
                <Shuffle className="w-5 h-5" />
              </button>

              {/* Previous */}
              <button
                onClick={onPrevious}
                className="p-2 text-gray-400 hover:text-white rounded-full transition-colors"
                title="Previous"
              >
                <SkipBack className="w-6 h-6" />
              </button>

              {/* Play/Pause */}
              <button
                onClick={isPlaying ? onPause : onPlay}
                className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </button>

              {/* Next */}
              <button
                onClick={onNext}
                className="p-2 text-gray-400 hover:text-white rounded-full transition-colors"
                title="Next"
              >
                <SkipForward className="w-6 h-6" />
              </button>

              {/* Repeat */}
              <button
                onClick={toggleRepeat}
                className={`p-2 rounded-full transition-colors ${
                  repeatMode !== 'none' ? 'text-green-500' : 'text-gray-400 hover:text-white'
                }`}
                title="Repeat"
              >
                <span className="text-sm font-bold">{getRepeatIcon()}</span>
              </button>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center space-x-4">
              {/* Queue */}
              <button
                onClick={() => setShowQueue(!showQueue)}
                className={`p-2 rounded-full transition-colors ${
                  showQueue ? 'text-blue-500' : 'text-gray-400 hover:text-white'
                }`}
                title="Queue"
              >
                <List className="w-5 h-5" />
              </button>

              {/* Volume Control */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="p-2 text-gray-400 hover:text-white rounded-full transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-20 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Fullscreen */}
              <button
                onClick={() => {
                  setIsFullscreen(!isFullscreen)
                  onFullscreen()
                }}
                className="p-2 text-gray-400 hover:text-white rounded-full transition-colors"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div
              ref={progressRef}
              onClick={handleProgressClick}
              className="w-full h-2 bg-gray-700 rounded-full cursor-pointer relative group"
            >
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transition-all duration-200 relative"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
            </div>
            
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Queue Panel */}
      {showQueue && (
        <SlideIn className="fixed bottom-20 left-4 right-4 bg-gray-800 rounded-lg border border-gray-700 shadow-2xl max-h-96 overflow-hidden">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Queue</h3>
              <button
                onClick={() => setShowQueue(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {queue.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Queue is empty</p>
              ) : (
                queue.map((track, index) => (
                  <div
                    key={track.id}
                    className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
                      index === 0 ? 'bg-purple-600/20 border border-purple-500/30' : 'hover:bg-gray-700'
                    }`}
                    onClick={() => onTrackSelect(track)}
                  >
                    <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={track.thumbnail}
                        alt={track.title}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{track.title}</p>
                      <p className="text-gray-400 text-sm truncate">{track.artist}</p>
                    </div>
                    
                    <span className="text-gray-500 text-sm">
                      {formatTime(track.duration)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </SlideIn>
      )}
    </>
  )
}
