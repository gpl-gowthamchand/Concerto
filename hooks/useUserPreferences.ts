'use client'

import { useState, useEffect, useCallback } from 'react'

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  language: string
  notifications: boolean
  recentlyPlayed: string[]
  likedSongs: string[]
  volume: number
  shuffle: boolean
  repeat: 'none' | 'one' | 'all'
  crossfade: boolean
  highQuality: boolean
  autoPlay: boolean
}

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'dark',
    language: 'en',
    notifications: true,
    recentlyPlayed: [],
    likedSongs: [],
    volume: 0.8,
    shuffle: false,
    repeat: 'none',
    crossfade: false,
    highQuality: true,
    autoPlay: false
  })
  const [mounted, setMounted] = useState(false)

  // Load preferences from localStorage on mount
  useEffect(() => {
    setMounted(true)
    
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('concerto-preferences')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setPreferences(prev => ({ ...prev, ...parsed }))
        } catch (error) {
          console.error('Failed to load preferences:', error)
        }
      }
    }
  }, [])

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem('concerto-preferences', JSON.stringify(preferences))
    }
  }, [preferences, mounted])

  const updatePreference = useCallback((key: keyof UserPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }, [])

  const toggleLiked = useCallback((songId: string) => {
    setPreferences(prev => ({
      ...prev,
      likedSongs: prev.likedSongs.includes(songId)
        ? prev.likedSongs.filter(id => id !== songId)
        : [...prev.likedSongs, songId]
    }))
  }, [])

  const isLiked = useCallback((songId: string) => {
    return preferences.likedSongs.includes(songId)
  }, [preferences.likedSongs])

  const addToRecentlyPlayed = useCallback((songId: string) => {
    setPreferences(prev => ({
      ...prev,
      recentlyPlayed: [
        songId,
        ...prev.recentlyPlayed.filter(id => id !== songId)
      ].slice(0, 50) // Keep only last 50 songs
    }))
  }, [])

  const clearRecentlyPlayed = useCallback(() => {
    setPreferences(prev => ({ ...prev, recentlyPlayed: [] }))
  }, [])

  const resetPreferences = useCallback(() => {
    const defaultPrefs: UserPreferences = {
      theme: 'dark',
      language: 'en',
      notifications: true,
      recentlyPlayed: [],
      likedSongs: [],
      volume: 0.8,
      shuffle: false,
      repeat: 'none',
      crossfade: false,
      highQuality: true,
      autoPlay: false
    }
    setPreferences(defaultPrefs)
  }, [])

  // Return default state during SSR
  if (!mounted) {
    return {
      preferences: {
        theme: 'dark',
        language: 'en',
        notifications: true,
        recentlyPlayed: [],
        likedSongs: [],
        volume: 0.8,
        shuffle: false,
        repeat: 'none',
        crossfade: false,
        highQuality: true,
        autoPlay: false
      },
      updatePreference: () => {},
      toggleLiked: () => {},
      isLiked: () => false,
      addToRecentlyPlayed: () => {},
      clearRecentlyPlayed: () => {},
      resetPreferences: () => {}
    }
  }

  return {
    preferences,
    updatePreference,
    toggleLiked,
    isLiked,
    addToRecentlyPlayed,
    clearRecentlyPlayed,
    resetPreferences
  }
}

