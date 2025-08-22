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
  List,
  Maximize2,
  Minimize2
} from 'lucide-react'
import AudioVisualizer from './AudioVisualizer'

interface Song {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  cover: string
}

interface MusicPlayerProps {
  currentSong?: Song
  isPlaying: boolean
  onPlayPause: () => void
  onNext: () => void
  onPrevious: () => void
}

export default function MusicPlayer({ 
  currentSong, 
  isPlaying, 
  onPlayPause, 
  onNext, 
  onPrevious 
}: MusicPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none')
  const [showQueue, setShowQueue] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  // Mock song data for demo
  const demoSong: Song = {
    id: '1',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    duration: 355,
    cover: '/api/placeholder/80/80'
  }

  const song = currentSong || demoSong

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && audioRef.current) {
      const rect = progressRef.current.getBoundingClientRect()
      const percent = (e.clientX - rect.left) / rect.width
      const newTime = percent * duration
      setCurrentTime(newTime)
      if (audioRef.current) {
        audioRef.current.currentTime = newTime
      }
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleLike = () => {
    setIsLiked(!isLiked)
  }

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled)
  }

  const cycleRepeatMode = () => {
    setRepeatMode(prev => {
      if (prev === 'none') return 'one'
      if (prev === 'one') return 'all'
      return 'none'
    })
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark-800 border-t border-dark-700 p-4 z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Song Info */}
        <div className="flex items-center space-x-4 min-w-0 flex-1">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">🎵</span>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-white font-medium truncate">{song.title}</h4>
            <p className="text-gray-400 text-sm truncate">{song.artist}</p>
          </div>
          <button
            onClick={toggleLike}
            className={`p-2 rounded-full transition-colors ${
              isLiked 
                ? 'text-red-500 hover:text-red-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center space-y-2 flex-1">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleShuffle}
              className={`p-2 rounded-full transition-colors ${
                isShuffled ? 'text-primary-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Shuffle className="w-5 h-5" />
            </button>
            <button
              onClick={onPrevious}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <SkipBack className="w-6 h-6" />
            </button>
            <button
              onClick={onPlayPause}
              className="w-12 h-12 bg-primary-600 hover:bg-primary-700 rounded-full flex items-center justify-center text-white transition-colors"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </button>
            <button
              onClick={onNext}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <SkipForward className="w-6 h-6" />
            </button>
            <button
              onClick={cycleRepeatMode}
              className={`p-2 rounded-full transition-colors ${
                repeatMode !== 'none' ? 'text-primary-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Repeat className="w-5 h-5" />
              {repeatMode === 'one' && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary-400 rounded-full"></span>
              )}
            </button>
            
            {/* Queue Button */}
            <button
              onClick={() => setShowQueue(!showQueue)}
              className={`p-2 rounded-full transition-colors ${
                showQueue ? 'text-primary-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
            
            {/* Expand/Collapse Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="flex items-center space-x-3 w-full max-w-md">
            <span className="text-xs text-gray-400 w-12 text-right">
              {formatTime(currentTime)}
            </span>
            <div
              ref={progressRef}
              className="flex-1 h-1 bg-dark-600 rounded-full cursor-pointer relative"
              onClick={handleProgressClick}
            >
              <div 
                className="h-full bg-primary-500 rounded-full relative"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-primary-400 rounded-full opacity-0 hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
            <span className="text-xs text-gray-400 w-12">
              {formatTime(duration)}
            </span>
          </div>
          
          {/* Audio Visualizer */}
          {isExpanded && (
            <div className="w-full max-w-md">
              <AudioVisualizer 
                type="bars" 
                height={40} 
                color="#0ea5e9"
                className="w-full"
              />
            </div>
          )}
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-3 flex-1 justify-end">
          <button
            onClick={toggleMute}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <div className="w-24">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-full h-1 bg-dark-600 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      </div>

      {/* Hidden audio element for demo */}
      <audio
        ref={audioRef}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={onNext}
      />
      
      {/* Queue Display */}
      {showQueue && (
        <div className="fixed bottom-32 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-dark-800 border border-dark-700 rounded-lg shadow-xl z-40 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-dark-600">
            <h3 className="text-lg font-semibold text-white">Queue</h3>
            <p className="text-sm text-gray-400">Upcoming songs</p>
          </div>
          
          <div className="p-2">
            {/* Mock queue items */}
            {[
              { id: '1', title: 'Bohemian Rhapsody', artist: 'Queen', duration: 355 },
              { id: '2', title: 'Hotel California', artist: 'Eagles', duration: 391 },
              { id: '3', title: 'Imagine', artist: 'John Lennon', duration: 183 },
              { id: '4', title: 'Stairway to Heaven', artist: 'Led Zeppelin', duration: 482 }
            ].map((song, index) => (
              <div key={song.id} className="flex items-center space-x-3 p-2 hover:bg-dark-700 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xs">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{song.title}</p>
                  <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                </div>
                <span className="text-gray-400 text-xs">
                  {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
