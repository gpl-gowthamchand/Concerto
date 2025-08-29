'use client'

import { useState, useEffect, useCallback } from 'react'
import { Song, Playlist } from '../lib/musicData'

interface PlaylistManager {
  playlists: Playlist[]
  createPlaylist: (name: string, description?: string) => Playlist
  deletePlaylist: (playlistId: string) => void
  addToPlaylist: (playlistId: string, song: Song) => void
  removeFromPlaylist: (playlistId: string, songId: string) => void
  updatePlaylist: (playlistId: string, updates: Partial<Playlist>) => void
  getPlaylistSongs: (playlistId: string, allSongs: Song[]) => Song[]
  isInPlaylist: (playlistId: string, songId: string) => boolean
}

export function usePlaylistManager(): PlaylistManager {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [mounted, setMounted] = useState(false)

  // Load playlists from localStorage on mount
  useEffect(() => {
    setMounted(true)
    
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('concerto-playlists')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setPlaylists(parsed.map((p: any) => ({
            ...p,
            createdAt: new Date(p.createdAt),
            updatedAt: new Date(p.updatedAt)
          })))
        } catch (error) {
          console.error('Failed to load playlists:', error)
          // Initialize with default playlists
          initializeDefaultPlaylists()
        }
      } else {
        initializeDefaultPlaylists()
      }
    }
  }, [])

  // Save playlists to localStorage whenever they change
  useEffect(() => {
    if (mounted && playlists.length > 0 && typeof window !== 'undefined') {
      localStorage.setItem('concerto-playlists', JSON.stringify(playlists))
    }
  }, [playlists, mounted])

  const initializeDefaultPlaylists = useCallback(() => {
    const defaultPlaylists: Playlist[] = [
      {
        id: 'liked-songs',
        name: 'Liked Songs',
        description: 'Your favorite tracks',
        cover: '❤️',
        songs: [],
        createdBy: 'user',
        isPublic: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'recently-played',
        name: 'Recently Played',
        description: 'Your recently listened tracks',
        cover: '🕒',
        songs: [],
        createdBy: 'system',
        isPublic: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'downloads',
        name: 'Downloaded Music',
        description: 'Available offline',
        cover: '⬇️',
        songs: [],
        createdBy: 'system',
        isPublic: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
    setPlaylists(defaultPlaylists)
  }, [])

  const createPlaylist = useCallback((name: string, description?: string): Playlist => {
    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      description: description?.trim() || '',
      cover: '🎵',
      songs: [],
      createdBy: 'user',
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setPlaylists(prev => [...prev, newPlaylist])
    return newPlaylist
  }, [])

  const deletePlaylist = useCallback((playlistId: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== playlistId))
  }, [])

  const addToPlaylist = useCallback((playlistId: string, song: Song) => {
    setPlaylists(prev => prev.map(p => 
      p.id === playlistId 
        ? { ...p, songs: [...p.songs, song], updatedAt: new Date() }
        : p
    ))
  }, [])

  const removeFromPlaylist = useCallback((playlistId: string, songId: string) => {
    setPlaylists(prev => prev.map(p => 
      p.id === playlistId 
        ? { ...p, songs: p.songs.filter(s => s.id !== songId), updatedAt: new Date() }
        : p
    ))
  }, [])

  const updatePlaylist = useCallback((playlistId: string, updates: Partial<Playlist>) => {
    setPlaylists(prev => prev.map(p => 
      p.id === playlistId 
        ? { ...p, ...updates, updatedAt: new Date() }
        : p
    ))
  }, [])

  const getPlaylistSongs = useCallback((playlistId: string, allSongs: Song[]): Song[] => {
    const playlist = playlists.find(p => p.id === playlistId)
    if (!playlist) return []
    
    return playlist.songs.map(songId => 
      allSongs.find(song => song.id === songId)
    ).filter((song): song is Song => song !== undefined)
  }, [playlists])

  const isInPlaylist = useCallback((playlistId: string, songId: string): boolean => {
    const playlist = playlists.find(p => p.id === playlistId)
    return playlist ? playlist.songs.includes(songId) : false
  }, [playlists])

  // Return empty state during SSR
  if (!mounted) {
    return {
      playlists: [],
      createPlaylist: () => ({ id: '', name: '', description: '', cover: '', songs: [], createdBy: '', isPublic: false, createdAt: new Date(), updatedAt: new Date() }),
      deletePlaylist: () => {},
      addToPlaylist: () => {},
      removeFromPlaylist: () => {},
      updatePlaylist: () => {},
      getPlaylistSongs: () => [],
      isInPlaylist: () => false
    }
  }

  return {
    playlists,
    createPlaylist,
    deletePlaylist,
    addToPlaylist,
    removeFromPlaylist,
    updatePlaylist,
    getPlaylistSongs,
    isInPlaylist
  }
}

