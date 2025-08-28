'use client'

import { useState, useEffect, useCallback } from 'react'
import { Song } from '../lib/musicData'

interface QueueState {
  originalQueue: Song[]
  currentQueue: Song[]
  currentIndex: number
  history: Song[]
  isShuffled: boolean
  shuffledIndices: number[]
}

interface QueueManager {
  queue: Song[]
  currentSong: Song | null
  currentIndex: number
  history: Song[]
  hasNext: boolean
  hasPrevious: boolean
  isShuffled: boolean
  
  // Queue manipulation
  setQueue: (songs: Song[], startIndex?: number) => void
  addToQueue: (song: Song, position?: 'next' | 'end') => void
  removeFromQueue: (index: number) => void
  clearQueue: () => void
  moveInQueue: (fromIndex: number, toIndex: number) => void
  
  // Playback control
  next: () => Song | null
  previous: () => Song | null
  jumpTo: (index: number) => Song | null
  
  // Shuffle and repeat
  toggleShuffle: () => void
  shuffle: () => void
  unshuffle: () => void
  
  // Utility
  getUpNext: (count?: number) => Song[]
  saveState: () => void
  loadState: () => void
}

export function useQueueManager(): QueueManager {
  const [state, setState] = useState<QueueState>({
    originalQueue: [],
    currentQueue: [],
    currentIndex: -1,
    history: [],
    isShuffled: false,
    shuffledIndices: []
  })

  // Load queue state from localStorage on mount
  useEffect(() => {
    loadState()
  }, [])

  // Save state whenever it changes
  useEffect(() => {
    if (state.currentQueue.length > 0) {
      saveState()
    }
  }, [state])

  const saveState = useCallback(() => {
    try {
      const stateToSave = {
        ...state,
        history: state.history.slice(-20) // Only save last 20 history items
      }
      localStorage.setItem('concerto-queue-state', JSON.stringify(stateToSave))
    } catch (error) {
      console.error('Failed to save queue state:', error)
    }
  }, [state])

  const loadState = useCallback(() => {
    try {
      const saved = localStorage.getItem('concerto-queue-state')
      if (saved) {
        const parsed = JSON.parse(saved)
        setState(prev => ({ ...prev, ...parsed }))
      }
    } catch (error) {
      console.error('Failed to load queue state:', error)
    }
  }, [])

  // Fisher-Yates shuffle algorithm
  const createShuffledIndices = useCallback((length: number, currentIndex: number = -1): number[] => {
    const indices = Array.from({ length }, (_, i) => i)
    
    // Remove current song from shuffle if it exists
    if (currentIndex >= 0 && currentIndex < length) {
      indices.splice(currentIndex, 1)
    }
    
    // Shuffle the remaining indices
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[indices[i], indices[j]] = [indices[j], indices[i]]
    }
    
    // Put current song at the beginning if it exists
    if (currentIndex >= 0 && currentIndex < length) {
      indices.unshift(currentIndex)
    }
    
    return indices
  }, [])

  const setQueue = useCallback((songs: Song[], startIndex: number = 0) => {
    setState(prev => ({
      ...prev,
      originalQueue: [...songs],
      currentQueue: [...songs],
      currentIndex: Math.max(0, Math.min(startIndex, songs.length - 1)),
      isShuffled: false,
      shuffledIndices: []
    }))
  }, [])

  const addToQueue = useCallback((song: Song, position: 'next' | 'end' = 'end') => {
    setState(prev => {
      const newQueue = [...prev.currentQueue]
      const newOriginalQueue = [...prev.originalQueue]
      
      if (position === 'next' && prev.currentIndex >= 0) {
        newQueue.splice(prev.currentIndex + 1, 0, song)
        newOriginalQueue.splice(prev.currentIndex + 1, 0, song)
      } else {
        newQueue.push(song)
        newOriginalQueue.push(song)
      }
      
      // Update shuffled indices if shuffled
      let newShuffledIndices = prev.shuffledIndices
      if (prev.isShuffled) {
        if (position === 'next' && prev.currentIndex >= 0) {
          newShuffledIndices = prev.shuffledIndices.map(index => 
            index > prev.currentIndex ? index + 1 : index
          )
          newShuffledIndices.splice(
            newShuffledIndices.indexOf(prev.currentIndex) + 1, 
            0, 
            prev.currentIndex + 1
          )
        } else {
          newShuffledIndices = [...prev.shuffledIndices, newQueue.length - 1]
        }
      }
      
      return {
        ...prev,
        originalQueue: newOriginalQueue,
        currentQueue: newQueue,
        shuffledIndices: newShuffledIndices
      }
    })
  }, [])

  const removeFromQueue = useCallback((index: number) => {
    setState(prev => {
      if (index < 0 || index >= prev.currentQueue.length) return prev
      
      const newQueue = prev.currentQueue.filter((_, i) => i !== index)
      const newOriginalQueue = prev.originalQueue.filter((_, i) => i !== index)
      
      let newCurrentIndex = prev.currentIndex
      if (index <= prev.currentIndex && prev.currentIndex > 0) {
        newCurrentIndex = prev.currentIndex - 1
      } else if (index === prev.currentIndex && index === prev.currentQueue.length - 1) {
        newCurrentIndex = Math.max(0, newQueue.length - 1)
      }
      
      // Update shuffled indices
      let newShuffledIndices = prev.shuffledIndices
      if (prev.isShuffled) {
        newShuffledIndices = prev.shuffledIndices
          .filter(i => i !== index)
          .map(i => i > index ? i - 1 : i)
      }
      
      return {
        ...prev,
        originalQueue: newOriginalQueue,
        currentQueue: newQueue,
        currentIndex: newCurrentIndex,
        shuffledIndices: newShuffledIndices
      }
    })
  }, [])

  const clearQueue = useCallback(() => {
    setState(prev => ({
      ...prev,
      originalQueue: [],
      currentQueue: [],
      currentIndex: -1,
      isShuffled: false,
      shuffledIndices: []
    }))
  }, [])

  const moveInQueue = useCallback((fromIndex: number, toIndex: number) => {
    setState(prev => {
      if (fromIndex < 0 || fromIndex >= prev.currentQueue.length ||
          toIndex < 0 || toIndex >= prev.currentQueue.length ||
          fromIndex === toIndex) {
        return prev
      }
      
      const newQueue = [...prev.currentQueue]
      const [movedSong] = newQueue.splice(fromIndex, 1)
      newQueue.splice(toIndex, 0, movedSong)
      
      // Update current index
      let newCurrentIndex = prev.currentIndex
      if (fromIndex === prev.currentIndex) {
        newCurrentIndex = toIndex
      } else if (fromIndex < prev.currentIndex && toIndex >= prev.currentIndex) {
        newCurrentIndex = prev.currentIndex - 1
      } else if (fromIndex > prev.currentIndex && toIndex <= prev.currentIndex) {
        newCurrentIndex = prev.currentIndex + 1
      }
      
      return {
        ...prev,
        originalQueue: [...newQueue], // Update original queue too
        currentQueue: newQueue,
        currentIndex: newCurrentIndex
      }
    })
  }, [])

  const jumpTo = useCallback((index: number): Song | null => {
    if (index < 0 || index >= state.currentQueue.length) return null
    
    setState(prev => {
      // Add current song to history if we're jumping away from it
      const newHistory = prev.currentIndex >= 0 && prev.currentQueue[prev.currentIndex]
        ? [prev.currentQueue[prev.currentIndex], ...prev.history.slice(0, 19)]
        : prev.history
      
      return {
        ...prev,
        currentIndex: index,
        history: newHistory
      }
    })
    
    return state.currentQueue[index]
  }, [state.currentQueue])

  const next = useCallback((): Song | null => {
    if (state.currentQueue.length === 0) return null
    
    let nextIndex: number
    
    if (state.isShuffled && state.shuffledIndices.length > 0) {
      const currentShuffleIndex = state.shuffledIndices.indexOf(state.currentIndex)
      nextIndex = currentShuffleIndex < state.shuffledIndices.length - 1
        ? state.shuffledIndices[currentShuffleIndex + 1]
        : state.shuffledIndices[0] // Loop back to start
    } else {
      nextIndex = state.currentIndex < state.currentQueue.length - 1
        ? state.currentIndex + 1
        : 0 // Loop back to start
    }
    
    return jumpTo(nextIndex)
  }, [state, jumpTo])

  const previous = useCallback((): Song | null => {
    if (state.currentQueue.length === 0) return null
    
    // If we have history, go back to previous song
    if (state.history.length > 0) {
      const previousSong = state.history[0]
      const previousIndex = state.currentQueue.findIndex(song => song.id === previousSong.id)
      
      if (previousIndex >= 0) {
        setState(prev => ({
          ...prev,
          currentIndex: previousIndex,
          history: prev.history.slice(1) // Remove from history
        }))
        return previousSong
      }
    }
    
    // Otherwise, go to previous in queue
    let prevIndex: number
    
    if (state.isShuffled && state.shuffledIndices.length > 0) {
      const currentShuffleIndex = state.shuffledIndices.indexOf(state.currentIndex)
      prevIndex = currentShuffleIndex > 0
        ? state.shuffledIndices[currentShuffleIndex - 1]
        : state.shuffledIndices[state.shuffledIndices.length - 1] // Loop to end
    } else {
      prevIndex = state.currentIndex > 0
        ? state.currentIndex - 1
        : state.currentQueue.length - 1 // Loop to end
    }
    
    return jumpTo(prevIndex)
  }, [state, jumpTo])

  const shuffle = useCallback(() => {
    setState(prev => {
      const shuffledIndices = createShuffledIndices(prev.currentQueue.length, prev.currentIndex)
      return {
        ...prev,
        isShuffled: true,
        shuffledIndices
      }
    })
  }, [createShuffledIndices])

  const unshuffle = useCallback(() => {
    setState(prev => ({
      ...prev,
      isShuffled: false,
      shuffledIndices: []
    }))
  }, [])

  const toggleShuffle = useCallback(() => {
    if (state.isShuffled) {
      unshuffle()
    } else {
      shuffle()
    }
  }, [state.isShuffled, shuffle, unshuffle])

  const getUpNext = useCallback((count: number = 5): Song[] => {
    if (state.currentQueue.length === 0) return []
    
    const upNext: Song[] = []
    let index = state.currentIndex
    
    for (let i = 0; i < count && i < state.currentQueue.length - 1; i++) {
      if (state.isShuffled && state.shuffledIndices.length > 0) {
        const currentShuffleIndex = state.shuffledIndices.indexOf(index)
        const nextShuffleIndex = (currentShuffleIndex + 1) % state.shuffledIndices.length
        index = state.shuffledIndices[nextShuffleIndex]
      } else {
        index = (index + 1) % state.currentQueue.length
      }
      
      upNext.push(state.currentQueue[index])
    }
    
    return upNext
  }, [state])

  return {
    queue: state.currentQueue,
    currentSong: state.currentIndex >= 0 ? state.currentQueue[state.currentIndex] : null,
    currentIndex: state.currentIndex,
    history: state.history,
    hasNext: state.currentQueue.length > 1,
    hasPrevious: state.currentQueue.length > 1 || state.history.length > 0,
    isShuffled: state.isShuffled,
    
    setQueue,
    addToQueue,
    removeFromQueue,
    clearQueue,
    moveInQueue,
    
    next,
    previous,
    jumpTo,
    
    toggleShuffle,
    shuffle,
    unshuffle,
    
    getUpNext,
    saveState,
    loadState
  }
}

