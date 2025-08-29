'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
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
  Share2,
  Download,
  List
} from 'lucide-react'
import { RealSong } from '../lib/realMusicService'

interface WorkingMusicPlayerProps {
  currentSong: RealSong | null
  isPlaying: boolean
  onPlayPause: () => void
  onNext: () => void
  onPrevious: () => void
  onSongChange?: (song: RealSong) => void
  queue?: RealSong[]
}

export default function WorkingMusicPlayer({
  currentSong,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
  onSongChange,
  queue = []
}: WorkingMusicPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setMuted] = useState(false)
  const [showQueue, setShowQueue] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none')

  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const volumeRef = useRef<HTMLDivElement>(null)

  // Initialize audio when song changes
  useEffect(() => {
    if (currentSong && audioRef.current) {
      // For YouTube URLs, we'll use a proxy or embed approach
      if (currentSong.audioUrl.includes('youtube.com')) {
        // Use YouTube embed for demo
        const videoId = currentSong.audioUrl.split('v=')[1]
        if (videoId) {
          // Create YouTube iframe for playback
          const iframe = document.createElement('iframe')
          iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1`
          iframe.width = '0'
          iframe.height = '0'
          iframe.style.display = 'none'
          iframe.allow = 'autoplay; encrypted-media'
          
          // Remove previous iframe
          const existingIframe = document.querySelector('#youtube-player')
          if (existingIframe) {
            existingIframe.remove()
          }
          
          iframe.id = 'youtube-player'
          document.body.appendChild(iframe)
        }
      } else {
        // For other sources, try direct audio
        audioRef.current.src = currentSong.audioUrl
        audioRef.current.load()
      }
      
      // Reset time
      setCurrentTime(0)
      setDuration(currentSong.duration)
    }
  }, [currentSong])

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || currentSong?.duration || 0)
    }

    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0
        audio.play()
      } else if (repeatMode === 'all' && queue.length > 0) {
        onNext()
      } else if (queue.length > 0) {
        onNext()
      }
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentSong, queue, repeatMode, onNext])

  // Control play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error)
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  // Handle progress bar click
  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current) return
    
    const rect = progressRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const width = rect.width
    const clickTime = (clickX / width) * duration
    
    audioRef.current.currentTime = clickTime
    setCurrentTime(clickTime)
  }, [duration])

  // Handle volume change
  const handleVolumeChange = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeRef.current || !audioRef.current) return
    
    const rect = volumeRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const width = rect.width
    const newVolume = Math.max(0, Math.min(1, clickX / width))
    
    setVolume(newVolume)
    audioRef.current.volume = newVolume
    setMuted(false)
  }, [])

  // Format time
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Toggle like
  const toggleLike = () => {
    setIsLiked(!isLiked)
    // Here you would typically update the user's liked songs
  }

  // Toggle shuffle
  const toggleShuffle = () => {
    setIsShuffled(!isShuffled)
    // Here you would typically shuffle the queue
  }

  // Toggle repeat
  const toggleRepeat = () => {
    const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all']
    const currentIndex = modes.indexOf(repeatMode)
    const nextIndex = (currentIndex + 1) % modes.length
    setRepeatMode(modes[nextIndex])
  }

  // Share song
  const shareSong = async () => {
    if (navigator.share && currentSong) {
      try {
        await navigator.share({
          title: currentSong.title,
          text: `Check out ${currentSong.title} by ${currentSong.artist}`,
          url: currentSong.audioUrl
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${currentSong?.title} by ${currentSong?.artist} - ${currentSong?.audioUrl}`)
    }
  }

  if (!currentSong) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark-800 border-t border-dark-700 z-50">
      {/* Main Player */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Song Info */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              {currentSong.cover.startsWith('http') ? (
                <img 
                  src={currentSong.cover} 
                  alt={currentSong.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-white font-bold text-2xl">{currentSong.cover}</span>
              )}
            </div>
            
            <div className="min-w-0 flex-1">
              <h3 className="text-white font-semibold truncate">{currentSong.title}</h3>
              <p className="text-gray-400 text-sm truncate">{currentSong.artist}</p>
              <p className="text-gray-500 text-xs truncate">{currentSong.album}</p>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleShuffle}
              className={`p-2 rounded-full transition-colors ${
                isShuffled ? 'text-primary-400 bg-primary-400/20' : 'text-gray-400 hover:text-white'
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
              className="w-12 h-12 bg-primary-600 hover:bg-primary-700 rounded-full flex items-center justify-center transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-1" />
              )}
            </button>
            
            <button
              onClick={onNext}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <SkipForward className="w-6 h-6" />
            </button>
            
            <button
              onClick={toggleRepeat}
              className={`p-2 rounded-full transition-colors ${
                repeatMode !== 'none' ? 'text-primary-400 bg-primary-400/20' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Repeat className="w-5 h-5" />
              {repeatMode === 'one' && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary-400 rounded-full"></span>
              )}
            </button>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleLike}
              className={`p-2 rounded-full transition-colors ${
                isLiked ? 'text-red-400 hover:text-red-300' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Heart className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} />
            </button>
            
            <button
              onClick={shareSong}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setShowQueue(!showQueue)}
              className={`p-2 rounded-full transition-colors ${
                showQueue ? 'text-primary-400 bg-primary-400/20' : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
            
            <div className="relative" ref={volumeRef}>
              <button
                onClick={() => setMuted(!isMuted)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-24 h-2 bg-dark-700 rounded-full cursor-pointer">
                <div 
                  className="h-full bg-primary-500 rounded-full relative"
                  style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                >
                  <div 
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-primary-400 rounded-full -mr-1.5"
                    style={{ left: `${(isMuted ? 0 : volume) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div 
            ref={progressRef}
            className="w-full h-1 bg-dark-700 rounded-full cursor-pointer relative"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-primary-500 rounded-full transition-all duration-100"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
            <div 
              className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-primary-400 rounded-full -ml-1.5 cursor-pointer"
              style={{ left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Queue Panel */}
      {showQueue && (
        <div className="bg-dark-900 border-t border-dark-700 max-h-64 overflow-y-auto">
          <div className="container mx-auto px-4 py-3">
            <h3 className="text-white font-semibold mb-3">Queue</h3>
            {queue.length > 0 ? (
              <div className="space-y-2">
                {queue.map((song, index) => (
                  <div
                    key={song.id}
                    onClick={() => onSongChange?.(song)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-dark-700 cursor-pointer transition-colors"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      {song.cover.startsWith('http') ? (
                        <img 
                          src={song.cover} 
                          alt={song.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-white font-bold text-sm">{song.cover}</span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{song.title}</p>
                      <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                    </div>
                    
                    <span className="text-gray-500 text-sm">{formatTime(song.duration)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4">No songs in queue</p>
            )}
          </div>
        </div>
      )}

      {/* Hidden audio element for non-YouTube sources */}
      <audio ref={audioRef} preload="metadata" />
    </div>
  )
}
