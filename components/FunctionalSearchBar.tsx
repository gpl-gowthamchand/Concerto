'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { 
  Search, 
  Mic, 
  X, 
  Clock, 
  Music, 
  User, 
  Disc3, 
  ListMusic,
  TrendingUp,
  History
} from 'lucide-react'
import { Song, mockSongs } from '../lib/musicData'

interface SearchResult {
  id: string
  type: 'song' | 'artist' | 'album' | 'playlist' | 'lyric'
  title: string
  subtitle: string
  icon: React.ReactNode
  data?: Song
  highlight?: string
}

interface FunctionalSearchBarProps {
  onSearch: (results: SearchResult[]) => void
  onSongSelect: (song: Song) => void
  placeholder?: string
  className?: string
}

export default function FunctionalSearchBar({ 
  onSearch, 
  onSongSelect,
  placeholder = "Search songs, artists, albums, or lyrics...",
  className = ""
}: FunctionalSearchBarProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchResult[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  
  const inputRef = useRef<HTMLInputElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('concerto-search-history')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Save search history to localStorage
  const saveSearchHistory = useCallback((newQuery: string) => {
    if (newQuery.trim() && !recentSearches.includes(newQuery)) {
      const updated = [newQuery, ...recentSearches.slice(0, 9)] // Keep last 10 searches
      setRecentSearches(updated)
      localStorage.setItem('concerto-search-history', JSON.stringify(updated))
    }
  }, [recentSearches])

  // Perform search with multiple criteria
  const performSearch = useCallback((searchQuery: string): SearchResult[] => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.toLowerCase()
    const results: SearchResult[] = []

    // Search songs by title
    mockSongs.forEach(song => {
      if (song.title.toLowerCase().includes(query)) {
        results.push({
          id: `song-title-${song.id}`,
          type: 'song',
          title: song.title,
          subtitle: `${song.artist} • ${song.album}`,
          icon: <Music className="w-4 h-4" />,
          data: song,
          highlight: song.title
        })
      }
    })

    // Search songs by artist
    mockSongs.forEach(song => {
      if (song.artist.toLowerCase().includes(query) && 
          !results.some(r => r.data?.id === song.id)) {
        results.push({
          id: `song-artist-${song.id}`,
          type: 'song',
          title: song.title,
          subtitle: `${song.artist} • ${song.album}`,
          icon: <User className="w-4 h-4" />,
          data: song,
          highlight: song.artist
        })
      }
    })

    // Search songs by album
    mockSongs.forEach(song => {
      if (song.album.toLowerCase().includes(query) && 
          !results.some(r => r.data?.id === song.id)) {
        results.push({
          id: `song-album-${song.id}`,
          type: 'album',
          title: song.title,
          subtitle: `${song.artist} • ${song.album}`,
          icon: <Disc3 className="w-4 h-4" />,
          data: song,
          highlight: song.album
        })
      }
    })

    // Search by genre
    mockSongs.forEach(song => {
      if (song.genre?.toLowerCase().includes(query) && 
          !results.some(r => r.data?.id === song.id)) {
        results.push({
          id: `song-genre-${song.id}`,
          type: 'song',
          title: song.title,
          subtitle: `${song.artist} • ${song.genre}`,
          icon: <ListMusic className="w-4 h-4" />,
          data: song,
          highlight: song.genre
        })
      }
    })

    // Search by year (if query is a number)
    if (/^\d{4}$/.test(query)) {
      const year = parseInt(query)
      mockSongs.forEach(song => {
        if (song.year === year && !results.some(r => r.data?.id === song.id)) {
          results.push({
            id: `song-year-${song.id}`,
            type: 'song',
            title: song.title,
            subtitle: `${song.artist} • ${song.year}`,
            icon: <Clock className="w-4 h-4" />,
            data: song,
            highlight: song.year?.toString()
          })
        }
      })
    }

    // Mock lyrics search (in real app, this would search actual lyrics)
    if (query.length > 3) {
      const lyricPhrases = [
        'is this the real life',
        'just a small town girl',
        'hello darkness my old friend',
        'imagine all the people',
        'sweet dreams are made of this',
        'i will always love you',
        'dont stop believing'
      ]
      
      lyricPhrases.forEach((phrase, index) => {
        if (phrase.includes(query) && results.length < 10) {
          const song = mockSongs[index % mockSongs.length]
          results.push({
            id: `lyric-${index}`,
            type: 'lyric',
            title: `"${phrase}"`,
            subtitle: `Lyrics in ${song.title} by ${song.artist}`,
            icon: <Mic className="w-4 h-4" />,
            data: song,
            highlight: phrase
          })
        }
      })
    }

    // Limit results
    return results.slice(0, 8)
  }, [])

  // Handle search input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    
    if (value.trim()) {
      setShowSuggestions(true)
      // Simulate search delay
      setTimeout(() => {
        const searchResults = performSearch(value)
        setSuggestions(searchResults)
      }, 300)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  // Handle search submission
  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return
    
    saveSearchHistory(searchQuery)
    const searchResults = performSearch(searchQuery)
    setShowSuggestions(false)
    onSearch(searchResults)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      // setSelectedIndex(prev => 
      //   prev < results.length - 1 ? prev + 1 : prev
      // )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      // setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (suggestions.length > 0) {
        const result = suggestions[0] // Assuming only one suggestion for now
        if (result.data) {
          onSongSelect(result.data)
        }
        handleSearch(result.title)
      } else {
        handleSearch()
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      // setSelectedIndex(-1)
    }
  }

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    if (result.data) {
      onSongSelect(result.data)
    }
    setQuery(result.title)
    handleSearch(result.title)
  }

  // Handle clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
        // setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            // setIsFocused(true)
            if (query.trim()) setShowSuggestions(true)
          }}
          onBlur={() => setShowSuggestions(false)}
          className="w-full bg-gray-800 border border-gray-600 rounded-full py-3 pl-10 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-youtube-500 focus:border-transparent transition-all duration-200"
        />
        
        {/* Loading indicator */}
        {/* {isSearching && (
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-youtube-500 rounded-full animate-spin" />
          </div>
        )} */}
        
        {/* Clear button */}
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setSuggestions([])
              setShowSuggestions(false)
              inputRef.current?.focus()
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Suggestions/Results */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {suggestions.length > 0 ? (
            <>
              <div className="p-3 border-b border-gray-700">
                <h3 className="text-white font-medium text-sm flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Search Results
                </h3>
              </div>
              {suggestions.map((result) => (
                <div
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="p-3 hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-700 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-gray-400">
                      {result.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium truncate text-sm">
                        {result.title}
                      </div>
                      <div className="text-gray-400 text-xs truncate">
                        {result.subtitle}
                      </div>
                    </div>
                    {result.type === 'lyric' && (
                      <div className="text-xs bg-youtube-600 text-white px-2 py-1 rounded">
                        LYRICS
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          ) : query.trim() ? (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300 mb-2">No results found</h3>
              <p className="text-gray-500">Try adjusting your search terms or browse our music library</p>
            </div>
          ) : (
            recentSearches.length > 0 && (
              <>
                <div className="p-3 border-b border-gray-700">
                  <h3 className="text-white font-medium text-sm flex items-center">
                    <History className="w-4 h-4 mr-2" />
                    Recent Searches
                  </h3>
                </div>
                {recentSearches.slice(0, 5).map((historyItem) => (
                  <div
                    key={historyItem}
                    onClick={() => {
                      setQuery(historyItem)
                      handleSearch(historyItem)
                    }}
                    className="p-3 hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-700 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-white text-sm">{historyItem}</span>
                    </div>
                  </div>
                ))}
              </>
            )
          )}
        </div>
      )}
    </div>
  )
}

