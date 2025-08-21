'use client'

import { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react'
import { Song } from '../lib/musicData'

interface PlayerState {
  currentSong: Song | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  isShuffled: boolean
  repeatMode: 'none' | 'one' | 'all'
  queue: Song[]
  queueIndex: number
  history: Song[]
}

interface PlayerContextType {
  // State
  playerState: PlayerState
  
  // Controls
  play: (song?: Song) => void
  pause: () => void
  next: () => void
  previous: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  toggleShuffle: () => void
  cycleRepeatMode: () => void
  
  // Queue management
  addToQueue: (song: Song) => void
  removeFromQueue: (index: number) => void
  clearQueue: () => void
  setQueue: (songs: Song[]) => void
  playNext: () => void
  playPrevious: () => void
  
  // History
  addToHistory: (song: Song) => void
  clearHistory: () => void
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider')
  }
  return context
}

interface PlayerProviderProps {
  children: ReactNode
}

export function PlayerProvider({ children }: PlayerProviderProps) {
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentSong: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    isMuted: false,
    isShuffled: false,
    repeatMode: 'none',
    queue: [],
    queueIndex: -1,
    history: []
  })

  const audioRef = useRef<HTMLAudioElement>(null)
  const intervalRef = useRef<NodeJS.Timeout>()

  // Update current time every 100ms
  useEffect(() => {
    if (playerState.isPlaying) {
      intervalRef.current = setInterval(() => {
        if (audioRef.current) {
          setPlayerState(prev => ({
            ...prev,
            currentTime: audioRef.current?.currentTime || 0
          }))
        }
      }, 100)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [playerState.isPlaying])

  // Handle audio ended
  useEffect(() => {
    if (audioRef.current) {
      const handleEnded = () => {
        if (playerState.repeatMode === 'one') {
          // Repeat current song
          if (audioRef.current) {
            audioRef.current.currentTime = 0
            audioRef.current.play()
          }
        } else if (playerState.repeatMode === 'all' || playerState.queue.length > 0) {
          // Play next song
          next()
        } else {
          // Stop playing
          setPlayerState(prev => ({ ...prev, isPlaying: false }))
        }
      }

      audioRef.current.addEventListener('ended', handleEnded)
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('ended', handleEnded)
        }
      }
    }
  }, [playerState.repeatMode, playerState.queue])

  const play = (song?: Song) => {
    if (song) {
      setPlayerState(prev => ({
        ...prev,
        currentSong: song,
        isPlaying: true,
        queueIndex: prev.queue.findIndex(s => s.id === song.id)
      }))
      
      // Add to history
      addToHistory(song)
      
      // Play audio
      if (audioRef.current) {
        audioRef.current.src = song.url || '/api/placeholder/audio'
        audioRef.current.currentTime = 0
        audioRef.current.volume = playerState.isMuted ? 0 : playerState.volume
        audioRef.current.play()
      }
    } else {
      // Resume current song
      setPlayerState(prev => ({ ...prev, isPlaying: true }))
      if (audioRef.current) {
        audioRef.current.play()
      }
    }
  }

  const pause = () => {
    setPlayerState(prev => ({ ...prev, isPlaying: false }))
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }

  const next = () => {
    if (playerState.queue.length === 0) return

    let nextIndex: number
    if (playerState.isShuffled) {
      // Random next song
      nextIndex = Math.floor(Math.random() * playerState.queue.length)
    } else {
      // Sequential next song
      nextIndex = (playerState.queueIndex + 1) % playerState.queue.length
    }

    const nextSong = playerState.queue[nextIndex]
    play(nextSong)
  }

  const previous = () => {
    if (playerState.queue.length === 0) return

    let prevIndex: number
    if (playerState.isShuffled) {
      // Random previous song
      prevIndex = Math.floor(Math.random() * playerState.queue.length)
    } else {
      // Sequential previous song
      prevIndex = playerState.queueIndex === 0 
        ? playerState.queue.length - 1 
        : playerState.queueIndex - 1
    }

    const prevSong = playerState.queue[prevIndex]
    play(prevSong)
  }

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setPlayerState(prev => ({ ...prev, currentTime: time }))
    }
  }

  const setVolume = (volume: number) => {
    setPlayerState(prev => ({ ...prev, volume, isMuted: false }))
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }

  const toggleMute = () => {
    const newMuted = !playerState.isMuted
    setPlayerState(prev => ({ ...prev, isMuted: newMuted }))
    if (audioRef.current) {
      audioRef.current.volume = newMuted ? 0 : playerState.volume
    }
  }

  const toggleShuffle = () => {
    setPlayerState(prev => ({ ...prev, isShuffled: !prev.isShuffled }))
  }

  const cycleRepeatMode = () => {
    setPlayerState(prev => ({
      ...prev,
      repeatMode: prev.repeatMode === 'none' ? 'one' : prev.repeatMode === 'one' ? 'all' : 'none'
    }))
  }

  const addToQueue = (song: Song) => {
    setPlayerState(prev => ({
      ...prev,
      queue: [...prev.queue, song]
    }))
  }

  const removeFromQueue = (index: number) => {
    setPlayerState(prev => ({
      ...prev,
      queue: prev.queue.filter((_, i) => i !== index)
    }))
  }

  const clearQueue = () => {
    setPlayerState(prev => ({
      ...prev,
      queue: [],
      queueIndex: -1
    }))
  }

  const setQueue = (songs: Song[]) => {
    setPlayerState(prev => ({
      ...prev,
      queue: songs,
      queueIndex: 0
    }))
  }

  const playNext = () => {
    next()
  }

  const playPrevious = () => {
    previous()
  }

  const addToHistory = (song: Song) => {
    setPlayerState(prev => ({
      ...prev,
      history: [song, ...prev.history.filter(s => s.id !== song.id)].slice(0, 50)
    }))
  }

  const clearHistory = () => {
    setPlayerState(prev => ({ ...prev, history: [] }))
  }

  const value: PlayerContextType = {
    playerState,
    play,
    pause,
    next,
    previous,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeatMode,
    addToQueue,
    removeFromQueue,
    clearQueue,
    setQueue,
    playNext,
    playPrevious,
    addToHistory,
    clearHistory
  }

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio ref={audioRef} preload="metadata" />
    </PlayerContext.Provider>
  )
}
