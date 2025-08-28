'use client'

import React, { createContext, useContext, useState, useRef, useEffect } from 'react'

interface AudioContextType {
  isPlaying: boolean
  currentTrack: any | null
  volume: number
  isMuted: boolean
  play: (track?: any) => void
  pause: () => void
  stop: () => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  skipTo: (time: number) => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<any>(null)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio()
    audioRef.current.volume = volume
    audioRef.current.muted = isMuted

    // Audio event listeners
    const audio = audioRef.current
    audio.addEventListener('play', () => setIsPlaying(true))
    audio.addEventListener('pause', () => setIsPlaying(false))
    audio.addEventListener('ended', () => setIsPlaying(false))
    audio.addEventListener('error', () => setIsPlaying(false))

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted
    }
  }, [isMuted])

  const play = (track?: any) => {
    if (track) {
      setCurrentTrack(track)
      if (audioRef.current) {
        audioRef.current.src = track.audioUrl || track.videoUrl || ''
        audioRef.current.load()
      }
    }
    
    if (audioRef.current) {
      audioRef.current.play().catch(console.error)
    }
  }

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
  }

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setIsPlaying(false)
  }

  const setVolumeLevel = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    setVolume(clampedVolume)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const skipTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
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
    setVolume: setVolumeLevel,
    toggleMute,
    skipTo
  }

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider')
  }
  return context
}
