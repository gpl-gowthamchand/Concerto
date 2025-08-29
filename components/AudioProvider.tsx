'use client'

import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react'

interface AudioContextType {
  isPlaying: boolean
  currentTrack: string | null
  volume: number
  isMuted: boolean
  play: (trackId: string) => void
  pause: () => void
  stop: () => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  skipTo: (time: number) => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function useAudio() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider')
  }
  return context
}

interface AudioProviderProps {
  children: ReactNode
}

export function AudioProvider({ children }: AudioProviderProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<string | null>(null)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement>(null)

  // Handle audio element events
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => {
      setIsPlaying(false)
      setCurrentTrack(null)
    }

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  // Update volume and mute state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const play = (trackId: string) => {
    setCurrentTrack(trackId)
    setIsPlaying(true)
    if (audioRef.current) {
      audioRef.current.play().catch(console.error)
    }
  }

  const pause = () => {
    setIsPlaying(false)
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }

  const stop = () => {
    setIsPlaying(false)
    setCurrentTrack(null)
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  const setVolumeSafe = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    setVolume(clampedVolume)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const skipTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, time)
    }
  }

  const value: AudioContextType = {
    isPlaying,
    currentTrack,
    volume,
    isMuted,
    play,
    pause,
    stop,
    setVolume: setVolumeSafe,
    toggleMute,
    skipTo
  }

  return (
    <AudioContext.Provider value={value}>
      <audio ref={audioRef} preload="metadata" />
      {children}
    </AudioContext.Provider>
  )
}
