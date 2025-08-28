'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Shuffle,
  Repeat,
  Heart,
  Maximize2
} from 'lucide-react'

interface Song {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  cover: string
}

interface ModernMusicPlayerProps {
  currentSong?: Song
  isPlaying: boolean
  onPlayPause: () => void
  onNext: () => void
  onPrevious: () => void
}

export default function ModernMusicPlayer({ 
  currentSong, 
  isPlaying, 
  onPlayPause, 
  onNext, 
  onPrevious 
}: ModernMusicPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(180) // 3 minutes default
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none')
  
  const progressRef = useRef<HTMLDivElement>(null)

  // Mock song data for demo
  const demoSong: Song = {
    id: '1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 200,
    cover: '/api/placeholder/80/80'
  }

  const song = currentSong || demoSong

  // Simulate time progression when playing
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            onNext()
            return 0
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, duration, onNext])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect()
      const percent = (e.clientX - rect.left) / rect.width
      const newTime = percent * duration
      setCurrentTime(newTime)
    }
  }

  const toggleRepeat = () => {
    setRepeatMode(prev => {
      if (prev === 'none') return 'one'
      if (prev === 'one') return 'all'
      return 'none'
    })
  }

  const progress = (currentTime / duration) * 100

  if (!currentSong) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-50">
      {/* Progress Bar */}
      <div 
        ref={progressRef}
        className="w-full h-1 bg-gray-700 cursor-pointer group hover:h-2 transition-all duration-200"
        onClick={handleProgressClick}
      >
        <div 
          className="h-full bg-gradient-to-r from-spotify-500 to-youtube-600 relative transition-colors"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3">
        {/* Song Info */}
        <div className="flex items-center space-x-4 min-w-0 w-1/4">
          <div className="w-14 h-14 bg-gradient-to-br from-youtube-600 to-spotify-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
            <span className="text-white font-bold text-lg">♪</span>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-white font-medium truncate text-sm hover:underline cursor-pointer">{song.title}</h4>
            <p className="text-gray-400 text-xs truncate hover:underline cursor-pointer">{song.artist}</p>
          </div>
                      <button
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2 rounded-full transition-colors hidden md:block ${
                isLiked ? 'text-youtube-500' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center space-y-2 w-1/2 max-w-md">
          {/* Control Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsShuffled(!isShuffled)}
              className={`p-2 rounded-full transition-colors ${
                isShuffled ? 'text-youtube-500' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              onClick={onPrevious}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button
              onClick={onPlayPause}
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-black" />
              ) : (
                <Play className="w-4 h-4 text-black ml-0.5" />
              )}
            </button>

            <button
              onClick={onNext}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            <button
              onClick={toggleRepeat}
              className={`p-2 rounded-full transition-colors relative ${
                repeatMode !== 'none' ? 'text-youtube-500' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Repeat className="w-4 h-4" />
              {repeatMode === 'one' && (
                <span className="absolute -top-1 -right-1 text-xs bg-youtube-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">1</span>
              )}
            </button>
          </div>

          {/* Time Display */}
          <div className="flex items-center space-x-2 text-xs text-gray-400 w-full">
            <span className="w-10 text-right">{formatTime(currentTime)}</span>
            <div className="flex-1" />
            <span className="w-10">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume & Extra Controls */}
        <div className="flex items-center space-x-4 w-1/4 justify-end">
          <button className="p-2 text-gray-400 hover:text-white transition-colors hidden lg:block">
            <Maximize2 className="w-4 h-4" />
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            
            <div className="w-20 hidden md:block">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  const newVolume = parseFloat(e.target.value)
                  setVolume(newVolume)
                  setIsMuted(newVolume === 0)
                }}
                className="w-full h-1 bg-dark-600 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
