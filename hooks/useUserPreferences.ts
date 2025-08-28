'use client'

import { useState, useEffect, useCallback } from 'react'

interface UserPreferences {
  // Audio settings
  volume: number
  isMuted: boolean
  audioQuality: 'low' | 'medium' | 'high'
  crossfade: boolean
  crossfadeDuration: number

  // Playback settings
  shuffleMode: boolean
  repeatMode: 'none' | 'one' | 'all'
  autoplay: boolean
  
  // UI settings
  theme: 'dark' | 'light' | 'auto'
  language: string
  showLyrics: boolean
  compactMode: boolean
  
  // Privacy settings
  shareListeningActivity: boolean
  allowExplicitContent: boolean
  
  // Notification settings
  pushNotifications: boolean
  emailNotifications: boolean
  
  // Social settings
  profileVisible: boolean
  showRecentlyPlayed: boolean
  
  // Recently played songs
  recentlyPlayed: string[]
  
  // Liked songs
  likedSongs: string[]
  
  // User stats
  totalListeningTime: number
  songsPlayed: number
  favoriteGenres: string[]
}

const defaultPreferences: UserPreferences = {
  volume: 0.7,
  isMuted: false,
  audioQuality: 'high',
  crossfade: false,
  crossfadeDuration: 3,
  
  shuffleMode: false,
  repeatMode: 'none',
  autoplay: true,
  
  theme: 'dark',
  language: 'en',
  showLyrics: true,
  compactMode: false,
  
  shareListeningActivity: true,
  allowExplicitContent: true,
  
  pushNotifications: true,
  emailNotifications: false,
  
  profileVisible: true,
  showRecentlyPlayed: true,
  
  recentlyPlayed: [],
  likedSongs: [],
  
  totalListeningTime: 0,
  songsPlayed: 0,
  favoriteGenres: []
}

interface UserPreferencesManager {
  preferences: UserPreferences
  updatePreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void
  resetPreferences: () => void
  exportPreferences: () => string
  importPreferences: (data: string) => boolean
  
  // Helper methods for common operations
  toggleLike: (songId: string) => boolean
  isLiked: (songId: string) => boolean
  addToRecentlyPlayed: (songId: string) => void
  incrementPlayCount: (duration: number) => void
  updateListeningStats: (genre: string) => void
}

export function useUserPreferences(): UserPreferencesManager {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences)

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('concerto-user-preferences')
      if (saved) {
        const parsed = JSON.parse(saved)
        setPreferences({ ...defaultPreferences, ...parsed })
      }
    } catch (error) {
      console.error('Failed to load user preferences:', error)
    }
  }, [])

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('concerto-user-preferences', JSON.stringify(preferences))
    } catch (error) {
      console.error('Failed to save user preferences:', error)
    }
  }, [preferences])

  const updatePreference = useCallback(<K extends keyof UserPreferences>(
    key: K, 
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  const resetPreferences = useCallback(() => {
    setPreferences(defaultPreferences)
    localStorage.removeItem('concerto-user-preferences')
  }, [])

  const exportPreferences = useCallback((): string => {
    return JSON.stringify(preferences, null, 2)
  }, [preferences])

  const importPreferences = useCallback((data: string): boolean => {
    try {
      const parsed = JSON.parse(data)
      setPreferences({ ...defaultPreferences, ...parsed })
      return true
    } catch (error) {
      console.error('Failed to import preferences:', error)
      return false
    }
  }, [])

  const toggleLike = useCallback((songId: string): boolean => {
    const isCurrentlyLiked = preferences.likedSongs.includes(songId)
    const newLikedSongs = isCurrentlyLiked
      ? preferences.likedSongs.filter(id => id !== songId)
      : [...preferences.likedSongs, songId]
    
    updatePreference('likedSongs', newLikedSongs)
    return !isCurrentlyLiked
  }, [preferences.likedSongs, updatePreference])

  const isLiked = useCallback((songId: string): boolean => {
    return preferences.likedSongs.includes(songId)
  }, [preferences.likedSongs])

  const addToRecentlyPlayed = useCallback((songId: string) => {
    const filtered = preferences.recentlyPlayed.filter(id => id !== songId)
    const newRecentlyPlayed = [songId, ...filtered].slice(0, 50) // Keep last 50
    
    updatePreference('recentlyPlayed', newRecentlyPlayed)
  }, [preferences.recentlyPlayed, updatePreference])

  const incrementPlayCount = useCallback((duration: number) => {
    updatePreference('songsPlayed', preferences.songsPlayed + 1)
    updatePreference('totalListeningTime', preferences.totalListeningTime + duration)
  }, [preferences.songsPlayed, preferences.totalListeningTime, updatePreference])

  const updateListeningStats = useCallback((genre: string) => {
    if (!genre) return
    
    const currentGenres = [...preferences.favoriteGenres]
    const existingIndex = currentGenres.findIndex(g => g === genre)
    
    if (existingIndex >= 0) {
      // Move to front (most recently played)
      currentGenres.splice(existingIndex, 1)
      currentGenres.unshift(genre)
    } else {
      // Add new genre
      currentGenres.unshift(genre)
    }
    
    // Keep only top 10 genres
    updatePreference('favoriteGenres', currentGenres.slice(0, 10))
  }, [preferences.favoriteGenres, updatePreference])

  return {
    preferences,
    updatePreference,
    resetPreferences,
    exportPreferences,
    importPreferences,
    toggleLike,
    isLiked,
    addToRecentlyPlayed,
    incrementPlayCount,
    updateListeningStats
  }
}

