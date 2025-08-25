'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Search, Filter, X, Music, User, Disc3 } from 'lucide-react'

interface SearchResult {
  id: string
  type: 'song' | 'artist' | 'album'
  title: string
  subtitle: string
  icon: React.ReactNode
}

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void
  placeholder?: string
  className?: string
}

interface SearchFilters {
  songs: boolean
  artists: boolean
  albums: boolean
}

export default function SearchBar({ 
  onSearch, 
  placeholder = "Search for songs, artists, albums...",
  className = ""
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    songs: true,
    artists: true,
    albums: true
  })
  const [suggestions, setSuggestions] = useState<SearchResult[]>([])
  
  const inputRef = useRef<HTMLInputElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  // Mock search suggestions
  const mockSuggestions = useCallback((): SearchResult[] => [
    { id: '1', type: 'song', title: 'Bohemian Rhapsody', subtitle: 'Queen', icon: <Music className="w-4 h-4" /> },
    { id: '2', type: 'artist', title: 'Queen', subtitle: 'Rock Band', icon: <User className="w-4 h-4" /> },
    { id: '3', type: 'album', title: 'A Night at the Opera', subtitle: 'Queen', icon: <Disc3 className="w-4 h-4" /> },
    { id: '4', type: 'song', title: 'Hotel California', subtitle: 'Eagles', icon: <Music className="w-4 h-4" /> },
    { id: '5', type: 'artist', title: 'Eagles', subtitle: 'Rock Band', icon: <User className="w-4 h-4" /> },
  ], [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (query.trim()) {
      const filtered = mockSuggestions().filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase())
      )
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }, [query, mockSuggestions])

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query, filters)
      setIsFocused(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleFilterChange = (filter: keyof SearchFilters) => {
    setFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }))
  }

  const handleSuggestionClick = (suggestion: SearchResult) => {
    setQuery(suggestion.title)
    onSearch(suggestion.title, filters)
    setIsFocused(false)
  }

  const clearSearch = () => {
    setQuery('')
    setSuggestions([])
    inputRef.current?.focus()
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="w-full pl-10 pr-20 py-3 bg-dark-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
        />
        
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-16 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-md transition-colors ${
            showFilters ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white hover:bg-dark-600'
          }`}
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Filters Dropdown */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-dark-700 border border-dark-600 rounded-lg shadow-lg z-20 p-4">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Search in:</h4>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.songs}
                onChange={() => handleFilterChange('songs')}
                className="w-4 h-4 text-primary-600 bg-dark-600 border-dark-500 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-300">Songs</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.artists}
                onChange={() => handleFilterChange('artists')}
                className="w-4 h-4 text-primary-600 bg-dark-600 border-dark-500 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-300">Artists</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.albums}
                onChange={() => handleFilterChange('albums')}
                className="w-4 h-4 text-primary-600 bg-dark-600 border-dark-500 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-300">Albums</span>
            </label>
          </div>
        </div>
      )}

      {/* Search Suggestions */}
      {isFocused && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-dark-700 border border-dark-600 rounded-lg shadow-lg z-20 max-h-80 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full flex items-center space-x-3 p-3 hover:bg-dark-600 transition-colors text-left"
            >
              <div className="text-gray-400">
                {suggestion.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-medium truncate">{suggestion.title}</div>
                <div className="text-gray-400 text-sm truncate">{suggestion.subtitle}</div>
              </div>
              <div className="text-xs text-gray-500 capitalize">{suggestion.type}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
