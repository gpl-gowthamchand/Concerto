'use client'

import { 
  useState, 
  useEffect, 
  useRef
} from 'react'
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
  Download
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
  genre?: string
  year?: number
}

interface FunctionalMusicPlayerProps {
  currentSong?: Song
  playlist: Song[]
  isPlaying: boolean
  onPlayPause: () => void
  onNext: () => void
  onPrevious: () => void
  onSongChange: (song: Song) => void
  onLike: (songId: string) => void
}

export default function FunctionalMusicPlayer({ 
  currentSong, 
  playlist,
  isPlaying, 
  onPlayPause, 
  onNext, 
  onPrevious,
  onSongChange,
  onLike
}: FunctionalMusicPlayerProps) {
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none')
  const [isBuffering, setIsBuffering] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  // Demo audio URL for when no audioUrl is provided
  const getDemoAudioUrl = () => {
    // Using a free audio sample for demo purposes
    return 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  }

  // Handle audio loading and playing
  useEffect(() => {
    if (audioRef.current && currentSong) {
      const audio = audioRef.current
      const audioUrl = currentSong.audioUrl || getDemoAudioUrl()
      
      audio.src = audioUrl
      audio.volume = isMuted ? 0 : volume
      
      if (isPlaying) {
        setIsBuffering(true)
        audio.play().catch(error => {
          console.log('Audio play failed:', error)
          setIsBuffering(false)
        })
      } else {
        audio.pause()
      }
    }
  }, [currentSong, isPlaying, volume, isMuted])

  // Audio event handlers
  useEffect(() => {
    const audioElement = audioRef.current
    if (!audioElement) return

    const handleLoadedMetadata = () => {
      setDuration(audioElement.duration)
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime)
    }

    const handleCanPlay = () => {
      setIsBuffering(false)
    }

    const handleWaiting = () => {
      setIsBuffering(true)
    }

    const handleEnded = () => {
      handleSongEnd()
    }

    const handleError = () => {
      setIsBuffering(false)
      console.log('Audio error occurred')
    }

    audioElement.addEventListener('loadedmetadata', handleLoadedMetadata)
    audioElement.addEventListener('timeupdate', handleTimeUpdate)
    audioElement.addEventListener('canplay', handleCanPlay)
    audioElement.addEventListener('waiting', handleWaiting)
    audioElement.addEventListener('ended', handleEnded)
    audioElement.addEventListener('error', handleError)

    return () => {
      audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata)
      audioElement.removeEventListener('timeupdate', handleTimeUpdate)
      audioElement.removeEventListener('canplay', handleCanPlay)
      audioElement.removeEventListener('waiting', handleWaiting)
      audioElement.removeEventListener('ended', handleEnded)
      audioElement.removeEventListener('error', handleError)
    }
  }, [])

  useEffect(() => {
    const audioElement = audioRef.current
    if (audioElement) {
      const handleEnded = () => {
        if (repeatMode === 'one') {
          audioElement.currentTime = 0
          audioElement.play()
        } else if (repeatMode === 'all' || playlist.length > 1) {
          onNext()
        } else {
          onPlayPause()
        }
      }
      
      audioElement.addEventListener('ended', handleEnded)
      return () => {
        audioElement.removeEventListener('ended', handleEnded)
      }
    }
  }, [repeatMode, playlist.length, onNext, onPlayPause])

  useEffect(() => {
    const audioElement = audioRef.current
    if (audioElement) {
      audioElement.addEventListener('timeupdate', handleTimeUpdate)
      return () => {
        audioElement.removeEventListener('timeupdate', handleTimeUpdate)
      }
    }
  }, [])

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && audioRef.current && duration) {
      const rect = progressRef.current.getBoundingClientRect()
      const percent = (e.clientX - rect.left) / rect.width
      const newTime = percent * duration
      audioRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const toggleMute = () => {
    const newMuted = !isMuted
    setIsMuted(newMuted)
    if (audioRef.current) {
      audioRef.current.volume = newMuted ? 0 : volume
    }
  }

  const toggleRepeat = () => {
    setRepeatMode(prev => {
      if (prev === 'none') return 'one'
      if (prev === 'one') return 'all'
      return 'none'
    })
  }

  const handleShuffle = () => {
    setIsShuffled(!isShuffled)
    if (!isShuffled && playlist.length > 1) {
      // Shuffle to a random song
      const randomIndex = Math.floor(Math.random() * playlist.length)
      const randomSong = playlist[randomIndex]
      if (randomSong.id !== currentSong?.id) {
        onSongChange(randomSong)
      }
    }
  }

  const handleShare = () => {
    if (currentSong) {
      navigator.clipboard.writeText(`Check out "${currentSong.title}" by ${currentSong.artist} on Concerto!`)
    }
  }

  const progress = duration ? (currentTime / duration) * 100 : 0

  if (!currentSong) return null

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        preload="metadata"
        crossOrigin="anonymous"
      />
      
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-50">
        {/* Progress Bar */}
        <div 
          ref={progressRef}
          className="w-full h-1 bg-gray-700 cursor-pointer group hover:h-2 transition-all duration-200"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-gradient-to-r from-spotify-500 to-youtube-600 relative transition-all duration-100"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
          </div>
          {isBuffering && (
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-pulse" />
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-3">
          {/* Song Info */}
          <div className="flex items-center space-x-4 min-w-0 w-1/4">
            <div className="w-14 h-14 bg-gradient-to-br from-youtube-600 to-spotify-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg relative">
              <span className="text-white font-bold text-lg">♪</span>
              {isBuffering && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-white font-medium truncate text-sm hover:underline cursor-pointer">{currentSong.title}</h4>
              <p className="text-gray-400 text-xs truncate hover:underline cursor-pointer">{currentSong.artist}</p>
            </div>
            <button
              onClick={() => onLike(currentSong.id)}
              className={`p-2 rounded-full transition-colors hidden md:block ${
                currentSong.isLiked ? 'text-youtube-500' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${currentSong.isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Player Controls */}
          <div className="flex flex-col items-center space-y-2 w-1/2 max-w-md">
            {/* Control Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleShuffle}
                className={`p-2 rounded-full transition-colors ${
                  isShuffled ? 'text-youtube-500' : 'text-gray-400 hover:text-white'
                }`}
                title="Shuffle"
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                onClick={onPrevious}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Previous"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={onPlayPause}
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                title={isPlaying ? 'Pause' : 'Play'}
                disabled={isBuffering}
              >
                {isBuffering ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-4 h-4 text-black" />
                ) : (
                  <Play className="w-4 h-4 text-black ml-0.5" />
                )}
              </button>

              <button
                onClick={onNext}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Next"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              <button
                onClick={toggleRepeat}
                className={`p-2 rounded-full transition-colors relative ${
                  repeatMode !== 'none' ? 'text-youtube-500' : 'text-gray-400 hover:text-white'
                }`}
                title={`Repeat: ${repeatMode}`}
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
            <button 
              onClick={handleShare}
              className="p-2 text-gray-400 hover:text-white transition-colors hidden lg:block"
              title="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            
            <button className="p-2 text-gray-400 hover:text-white transition-colors hidden lg:block" title="Download">
              <Download className="w-4 h-4" />
            </button>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
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
                  onChange={handleVolumeChange}
                  className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                  title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

