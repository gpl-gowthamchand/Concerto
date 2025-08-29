'use client'

import { useState, useEffect, useCallback } from 'react'
import { Song } from '../lib/musicData'

interface QueueManager {
  queue: Song[]
  currentIndex: number
  addToQueue: (song: Song) => void
  removeFromQueue: (index: number) => void
  moveInQueue: (fromIndex: number, toIndex: number) => void
  clearQueue: () => void
  shuffleQueue: () => void
  nextSong: () => Song | null
  previousSong: () => Song | null
  getCurrentSong: () => Song | null
  setCurrentIndex: (index: number) => void
}

export function useQueueManager(): QueueManager {
  const [queue, setQueue] = useState<Song[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  // Load queue from localStorage on mount
  useEffect(() => {
    setMounted(true)
    
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('concerto-queue')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          setQueue(parsed.queue || [])
          setCurrentIndex(parsed.currentIndex || 0)
        } catch (error) {
          console.error('Failed to load queue:', error)
        }
      }
    }
  }, [])

  // Save queue to localStorage whenever it changes
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem('concerto-queue', JSON.stringify({ queue, currentIndex }))
    }
  }, [queue, currentIndex, mounted])

  const addToQueue = useCallback((song: Song) => {
    setQueue(prev => [...prev, song])
  }, [])

  const removeFromQueue = useCallback((index: number) => {
    setQueue(prev => prev.filter((_, i) => i !== index))
    if (index < currentIndex) {
      setCurrentIndex(prev => prev - 1)
    }
  }, [currentIndex])

  const moveInQueue = useCallback((fromIndex: number, toIndex: number) => {
    setQueue(prev => {
      const newQueue = [...prev]
      const [movedSong] = newQueue.splice(fromIndex, 1)
      newQueue.splice(toIndex, 0, movedSong)
      return newQueue
    })
    
    // Adjust current index if needed
    if (fromIndex === currentIndex) {
      setCurrentIndex(toIndex)
    } else if (fromIndex < currentIndex && toIndex >= currentIndex) {
      setCurrentIndex(prev => prev - 1)
    } else if (fromIndex > currentIndex && toIndex <= currentIndex) {
      setCurrentIndex(prev => prev + 1)
    }
  }, [currentIndex])

  const clearQueue = useCallback(() => {
    setQueue([])
    setCurrentIndex(0)
  }, [])

  const shuffleQueue = useCallback(() => {
    setQueue(prev => {
      const shuffled = [...prev]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled
    })
  }, [])

  const nextSong = useCallback((): Song | null => {
    if (currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      return queue[nextIndex]
    }
    return null
  }, [currentIndex, queue])

  const previousSong = useCallback((): Song | null => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1
      setCurrentIndex(prevIndex)
      return queue[prevIndex]
    }
    return null
  }, [currentIndex, queue])

  const getCurrentSong = useCallback((): Song | null => {
    return queue[currentIndex] || null
  }, [queue, currentIndex])

  const setCurrentIndexSafe = useCallback((index: number) => {
    if (index >= 0 && index < queue.length) {
      setCurrentIndex(index)
    }
  }, [queue.length])

  // Return empty state during SSR
  if (!mounted) {
    return {
      queue: [],
      currentIndex: 0,
      addToQueue: () => {},
      removeFromQueue: () => {},
      moveInQueue: () => {},
      clearQueue: () => {},
      shuffleQueue: () => {},
      nextSong: () => null,
      previousSong: () => null,
      getCurrentSong: () => null,
      setCurrentIndex: () => {}
    }
  }

  return {
    queue,
    currentIndex,
    addToQueue,
    removeFromQueue,
    moveInQueue,
    clearQueue,
    shuffleQueue,
    nextSong,
    previousSong,
    getCurrentSong,
    setCurrentIndex: setCurrentIndexSafe
  }
}

