'use client'

import { useState, useRef } from 'react'
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX,
  Shuffle, 
  Repeat, 
  Heart, 
  Share2, 
  Download,
  ChevronUp,
  ChevronDown,
  X
} from 'lucide-react'

interface Song {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  cover: string
  audioUrl?: string
  isLiked?: boolean
}

interface MobileMusicPlayerProps {
  currentSong?: Song
  isPlaying: boolean
  onPlayPause: () => void
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  isVisible: boolean
}

export default function MobileMusicPlayer({
  currentSong,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  onClose,
  isVisible
}: MobileMusicPlayerProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const touchStartRef = useRef<number>(0)
  const touchStartTimeRef = useRef<number>(0)

  // Handle touch gestures for seeking
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX
    touchStartTimeRef.current = currentTime
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!progressRef.current || !audioRef.current) return
    
    const touch = e.touches[0]
    const rect = progressRef.current.getBoundingClientRect()
    const touchX = touch.clientX - rect.left
    const progress = Math.max(0, Math.min(1, touchX / rect.width))
    const newTime = progress * duration
    
    setCurrentTime(newTime)
  }

  const handleTouchEnd = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = currentTime
    }
  }

  // Format time helper
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Progress calculation
  const progress = duration ? (currentTime / duration) * 100 : 0

  if (!currentSong || !isVisible) return null

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={currentSong.audioUrl}
        preload="metadata"
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
      />

      {/* Mobile Player Interface */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${
        isExpanded ? 'h-full' : 'h-20'
      }`}>
        {/* Background overlay when expanded */}
        {isExpanded && (
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setIsExpanded(false)}
          />
        )}

        {/* Player Container */}
        <div className={`relative bg-gradient-to-br from-gray-900 to-gray-800 border-t border-gray-700 transition-all duration-300 ${
          isExpanded ? 'h-full' : 'h-20'
        }`}>
          {/* Collapsed Player */}
          {!isExpanded && (
            <div className="flex items-center justify-between px-4 py-2 h-full">
              {/* Song Info */}
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">♪</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-white font-medium truncate text-sm">{currentSong.title}</h4>
                  <p className="text-gray-400 text-xs truncate">{currentSong.artist}</p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={onPrevious}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                
                <button
                  onClick={onPlayPause}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-black" />
                  ) : (
                    <Play className="w-5 h-5 text-black ml-0.5" />
                  )}
                </button>
                
                <button
                  onClick={onNext}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              {/* Expand Button */}
              <button
                onClick={() => setIsExpanded(true)}
                className="p-2 text-gray-400 hover:text-white transition-colors ml-2"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Expanded Player */}
          {isExpanded && (
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ChevronDown className="w-6 h-6" />
                </button>
                <h3 className="text-white font-medium">Now Playing</h3>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Album Art */}
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <div className="w-64 h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-2xl">
                  <span className="text-white font-bold text-6xl">♪</span>
                </div>
                
                <h2 className="text-white text-2xl font-bold text-center mb-2">{currentSong.title}</h2>
                <p className="text-gray-400 text-lg text-center mb-6">{currentSong.artist}</p>
                
                {/* Progress Bar */}
                <div className="w-full max-w-md mb-4">
                  <div 
                    ref={progressRef}
                    className="w-full h-2 bg-gray-700 rounded-full cursor-pointer relative"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    />
                    <div 
                      className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg"
                      style={{ left: `calc(${progress}% - 8px)` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-400 mt-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Main Controls */}
                <div className="flex items-center space-x-6 mb-8">
                  <button
                    onClick={onPrevious}
                    className="p-3 text-gray-400 hover:text-white transition-colors"
                  >
                    <SkipBack className="w-8 h-8" />
                  </button>
                  
                  <button
                    onClick={onPlayPause}
                    className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                  >
                    {isPlaying ? (
                      <Pause className="w-8 h-8 text-black" />
                    ) : (
                      <Play className="w-8 h-8 text-black ml-1" />
                    )}
                  </button>
                  
                  <button
                    onClick={onNext}
                    className="p-3 text-gray-400 hover:text-white transition-colors"
                  >
                    <SkipForward className="w-8 h-8" />
                  </button>
                </div>

                {/* Secondary Controls */}
                <div className="flex items-center space-x-8">
                  <button className="p-3 text-gray-400 hover:text-white transition-colors">
                    <Shuffle className="w-6 h-6" />
                  </button>
                  
                  <button className="p-3 text-gray-400 hover:text-white transition-colors">
                    <Repeat className="w-6 h-6" />
                  </button>
                  
                  <button className="p-3 text-gray-400 hover:text-white transition-colors">
                    <Heart className={`w-6 h-6 ${currentSong.isLiked ? 'text-red-500 fill-current' : ''}`} />
                  </button>
                  
                  <button className="p-3 text-gray-400 hover:text-white transition-colors">
                    <Share2 className="w-6 h-6" />
                  </button>
                  
                  <button className="p-3 text-gray-400 hover:text-white transition-colors">
                    <Download className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Volume Control */}
              <div className="p-4 border-t border-gray-700">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      const newVolume = parseFloat(e.target.value)
                      setVolume(newVolume)
                      setIsMuted(newVolume === 0)
                      if (audioRef.current) {
                        audioRef.current.volume = newVolume
                      }
                    }}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  
                  <span className="text-gray-400 text-sm w-12 text-right">
                    {Math.round((isMuted ? 0 : volume) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
