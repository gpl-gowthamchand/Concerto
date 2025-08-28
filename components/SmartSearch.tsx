'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Search, 
  Mic, 
  Filter, 
  Sparkles, 
  Music, 
  Heart, 
  Star,
  TrendingUp,
  History,
  X,
  Play,
  Plus,
  Share2,
  Bookmark,
  MoreHorizontal,
  Lightbulb,
  Zap,
  Brain,
  Sliders,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  Quote
} from 'lucide-react'
import { Song, mockSongs } from '../lib/musicData'
import { FadeIn, SlideIn, StaggeredList, StaggeredItem } from './PageTransition'

interface SearchResult {
  id: string
  type: 'song' | 'artist' | 'album' | 'playlist' | 'genre'
  title: string
  subtitle: string
  description: string
  relevance: number
  metadata: Record<string, unknown>
  actions: string[]
  lyricMatch?: {
    text: string
    position: number
    context: string
  }
}

interface SearchFilter {
  type: string[]
  genre: string[]
  mood: string[]
  duration: { min: number; max: number }
  year: { min: number; max: number }
  bpm: { min: number; max: number }
  key: string[]
}

interface SmartSearchProps {
  onSongSelect: (song: Song) => void
  onSearchHistory: (query: string) => void
}

export default function SmartSearch({
  onSongSelect,
  onSearchHistory
}: SmartSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [searchFilters, setSearchFilters] = useState<SearchFilter>({
    type: [],
    genre: [],
    mood: [],
    duration: { min: 0, max: 600 },
    year: { min: 1900, max: 2024 },
    bpm: { min: 60, max: 200 },
    key: []
  })
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [voiceSearch, setVoiceSearch] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'relevance' | 'title' | 'artist' | 'year' | 'popularity'>('relevance')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [searchMode, setSearchMode] = useState<'general' | 'lyrics'>('general')

  // Initialize with mock search history and AI suggestions
  useEffect(() => {
    const mockHistory = [
      'jazz classics',
      'rock anthems',
      'electronic beats',
      'classical masterpieces',
      'hip hop essentials'
    ]
    
    const mockSuggestions = [
      'songs like Bohemian Rhapsody',
      'upbeat workout music',
      'relaxing jazz for studying',
      'electronic music for coding',
      'romantic ballads'
    ]
    
    setSearchHistory(mockHistory)
    setAiSuggestions(mockSuggestions)
  }, [])

  // Handle search
  const handleSearch = async (query: string) => {
    if (!query.trim()) return
    
    setIsSearching(true)
    
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Generate search results based on query
    const results = searchMode === 'lyrics' 
      ? generateLyricSearchResults(query)
      : generateSearchResults(query)
    
    setSearchResults(results)
    
    // Add to search history
    if (!searchHistory.includes(query)) {
      setSearchHistory(prev => [query, ...prev.slice(0, 9)])
    }
    
    // Add to recent searches
    setRecentSearches(prev => [query, ...prev.filter(s => s !== query).slice(0, 4)])
    
    setIsSearching(false)
    onSearchHistory(query)
  }

  // Generate mock search results
  const generateSearchResults = (query: string): SearchResult[] => {
    const queryLower = query.toLowerCase()
    const results: SearchResult[] = []
    
    // Search through songs
    mockSongs.forEach(song => {
      let relevance = 0
      const matchedFields: string[] = []
      
      if (song.title.toLowerCase().includes(queryLower)) {
        relevance += 10
        matchedFields.push('title')
      }
      if (song.artist.toLowerCase().includes(queryLower)) {
        relevance += 8
        matchedFields.push('artist')
      }
      if (song.album.toLowerCase().includes(queryLower)) {
        relevance += 6
        matchedFields.push('album')
      }
      if (song.genre.toLowerCase().includes(queryLower)) {
        relevance += 5
        matchedFields.push('genre')
      }
      
      if (relevance > 0) {
        results.push({
          id: song.id,
          type: 'song',
          title: song.title,
          subtitle: song.artist,
          description: `${song.album} • ${song.genre} • ${formatDuration(song.duration)}`,
          relevance,
          metadata: {
            ...song,
            matchedFields
          },
          actions: ['play', 'add_to_playlist', 'like', 'share', 'download']
        })
      }
    })
    
    // Add some mock artist and album results
    if (queryLower.includes('jazz')) {
      results.push({
        id: 'artist-jazz',
        type: 'artist',
        title: 'Jazz Legends',
        subtitle: 'Various Artists',
        description: 'Discover the greatest jazz musicians of all time',
        relevance: 9,
        metadata: { genre: 'Jazz', era: 'Classic' },
        actions: ['follow', 'view_albums', 'create_playlist']
      })
    }
    
    if (queryLower.includes('rock')) {
      results.push({
        id: 'album-rock',
        type: 'album',
        title: 'Rock Classics Collection',
        subtitle: 'Various Artists',
        description: 'The ultimate rock music compilation',
        relevance: 8,
        metadata: { genre: 'Rock', year: 2020 },
        actions: ['play', 'add_to_library', 'share']
      })
    }
    
    // Sort by relevance
    return results.sort((a, b) => b.relevance - a.relevance)
  }

  // Generate lyric search results
  const generateLyricSearchResults = (query: string): SearchResult[] => {
    const queryLower = query.toLowerCase()
    const results: SearchResult[] = []
    
    // Mock lyrics data for demonstration
    const mockLyrics: Record<string, string[]> = {
      '1': [
        "Yesterday, all my troubles seemed so far away",
        "Now it looks as though they're here to stay",
        "Oh, I believe in yesterday",
        "Suddenly, I'm not half the man I used to be",
        "There's a shadow hanging over me"
      ],
      '2': [
        "Here comes the sun, doo-doo-doo-doo",
        "Here comes the sun, and I say",
        "It's all right",
        "Little darlin', it's been a long cold lonely winter",
        "Little darlin', it feels like years since it's been here"
      ],
      '3': [
        "Imagine all the people living life in peace",
        "You may say I'm a dreamer, but I'm not the only one",
        "I hope someday you'll join us",
        "And the world will live as one",
        "Imagine all the people sharing all the world"
      ],
      '4': [
        "We will, we will rock you",
        "We will, we will rock you",
        "Buddy, you're a boy, make a big noise",
        "Playing in the street, gonna be a big man someday",
        "You got mud on your face, you big disgrace"
      ],
      '5': [
        "Don't stop believin', hold on to that feelin'",
        "Streetlight people, don't stop believin'",
        "Hold on to that feelin', streetlight people",
        "Don't stop believin', hold on to that feelin'",
        "Streetlight people, don't stop believin'"
      ]
    }
    
    // Search through lyrics
    mockSongs.forEach(song => {
      const lyrics = mockLyrics[song.id]
      if (lyrics) {
        let bestMatch: { text: string; position: number; context: string } | undefined
        let maxRelevance = 0
        
        lyrics.forEach((line, index) => {
          if (line.toLowerCase().includes(queryLower)) {
            const relevance = calculateLyricRelevance(line, queryLower)
            if (relevance > maxRelevance) {
              maxRelevance = relevance
              bestMatch = {
                text: line,
                position: index,
                context: getLyricContext(lyrics, index)
              }
            }
          }
        })
        
        if (bestMatch && maxRelevance > 0) {
          results.push({
            id: song.id,
            type: 'song',
            title: song.title,
            subtitle: song.artist,
            description: `${song.album} • ${song.genre} • ${formatDuration(song.duration)}`,
            relevance: maxRelevance,
            metadata: {
              ...song,
              matchedFields: ['lyrics']
            },
            actions: ['play', 'add_to_playlist', 'like', 'share', 'download'],
            lyricMatch: bestMatch
          })
        }
      }
    })
    
    // Sort by relevance
    return results.sort((a, b) => b.relevance - a.relevance)
  }

  // Calculate lyric relevance score
  const calculateLyricRelevance = (lyricLine: string, query: string): number => {
    const lineLower = lyricLine.toLowerCase()
    const queryWords = query.split(' ').filter(word => word.length > 2)
    
    let score = 0
    
    queryWords.forEach(word => {
      if (lineLower.includes(word)) {
        score += 5
        // Bonus for exact matches
        if (lineLower.includes(word)) {
          score += 3
        }
        // Bonus for word boundaries
        if (lineLower.includes(` ${word} `) || lineLower.startsWith(`${word} `) || lineLower.endsWith(` ${word}`)) {
          score += 2
        }
      }
    })
    
    // Bonus for longer matches
    if (lineLower.includes(query)) {
      score += 10
    }
    
    return score
  }

  // Get lyric context (surrounding lines)
  const getLyricContext = (lyrics: string[], position: number): string => {
    const start = Math.max(0, position - 1)
    const end = Math.min(lyrics.length, position + 2)
    return lyrics.slice(start, end).join(' ')
  }

  // Apply filters
  const applyFilters = useCallback(() => {
    if (!searchQuery.trim()) return
    
    const filteredResults = searchResults.filter(result => {
      if (searchFilters.type.length > 0 && !searchFilters.type.includes(result.type)) {
        return false
      }
      
      if (searchFilters.genre.length > 0) {
        const resultGenre = result.metadata.genre?.toLowerCase()
        if (!resultGenre || !searchFilters.genre.some(g => g.toLowerCase() === resultGenre)) {
          return false
        }
      }
      
      if (searchFilters.mood.length > 0) {
        const resultMood = result.metadata.mood?.toLowerCase()
        if (!resultMood || !searchFilters.mood.some(m => m.toLowerCase() === resultMood)) {
          return false
        }
      }
      
      if (result.metadata.duration) {
        const duration = result.metadata.duration
        if (duration < searchFilters.duration.min || duration > searchFilters.duration.max) {
          return false
        }
      }
      
      if (result.metadata.year) {
        const year = result.metadata.year
        if (year < searchFilters.year.min || year > searchFilters.year.max) {
          return false
        }
      }
      
      if (result.metadata.bpm) {
        const bpm = result.metadata.bpm
        if (bpm < searchFilters.bpm.min || bpm > searchFilters.bpm.max) {
          return false
        }
      }
      
      return true
    })
    
    setSearchResults(filteredResults)
  }, [searchQuery, searchResults, searchFilters])

  // Sort results
  const sortResults = useCallback(() => {
    const sorted = [...searchResults].sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'relevance':
          comparison = b.relevance - a.relevance
          break
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'artist':
          comparison = a.subtitle.localeCompare(b.subtitle)
          break
        case 'year':
          comparison = (b.metadata.year || 0) - (a.metadata.year || 0)
          break
        case 'popularity':
          comparison = (b.metadata.popularity || 0) - (a.metadata.popularity || 0)
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })
    
    setSearchResults(sorted)
  }, [searchResults, sortBy, sortOrder])

  // Voice search simulation
  const startVoiceSearch = () => {
    setVoiceSearch(true)
    // Simulate voice recognition
    setTimeout(() => {
      const voiceQueries = [
        'play some jazz music',
        'find upbeat songs',
        'show me classical music',
        'search for rock bands'
      ]
      const randomQuery = voiceQueries[Math.floor(Math.random() * voiceQueries.length)]
      setSearchQuery(randomQuery)
      setVoiceSearch(false)
      handleSearch(randomQuery)
    }, 2000)
  }

  // Format duration
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(searchQuery)
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
  }

  // Get result icon
  const getResultIcon = (type: string) => {
    switch (type) {
      case 'song': return <Music className="w-5 h-5" />
      case 'artist': return <Star className="w-5 h-5" />
      case 'album': return <Bookmark className="w-5 h-5" />
      case 'playlist': return <List className="w-5 h-5" />
      case 'genre': return <TrendingUp className="w-5 h-5" />
      default: return <Music className="w-5 h-5" />
    }
  }

  // Get result color
  const getResultColor = (type: string) => {
    switch (type) {
      case 'song': return 'from-blue-500 to-purple-600'
      case 'artist': return 'from-yellow-500 to-orange-600'
      case 'album': return 'from-green-500 to-blue-600'
      case 'playlist': return 'from-purple-500 to-pink-600'
      case 'genre': return 'from-red-500 to-pink-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-3xl">
              <Brain className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Smart Search
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            AI-powered music discovery with natural language search, intelligent filters, and personalized recommendations
          </p>
        </div>

        {/* Search Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-800 rounded-lg p-1 border border-gray-700">
            <button
              onClick={() => setSearchMode('general')}
              className={`px-6 py-3 rounded-md transition-all duration-200 ${
                searchMode === 'general'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4" />
                <span>General Search</span>
              </div>
            </button>
            <button
              onClick={() => setSearchMode('lyrics')}
              className={`px-6 py-3 rounded-md transition-all duration-200 ${
                searchMode === 'lyrics'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Quote className="w-4 h-4" />
                <span>Lyric Search</span>
              </div>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={
                  searchMode === 'lyrics' 
                    ? "Search for songs by typing lyrics... (e.g., 'Yesterday all my troubles')"
                    : "Search for songs, artists, albums, or describe what you want to hear..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-20 py-4 bg-gray-800 text-white placeholder-gray-400 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={startVoiceSearch}
                  className={`p-2 rounded-lg transition-colors ${
                    voiceSearch 
                      ? 'bg-red-600 text-white animate-pulse' 
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white'
                  }`}
                  disabled={voiceSearch}
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 rounded-lg transition-colors ${
                    showFilters 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                </button>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="p-2 bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            
            <button
              type="submit"
              disabled={!searchQuery.trim() || isSearching}
              className="mt-4 w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 font-medium text-lg"
            >
              {isSearching ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Searching...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>
                    {searchMode === 'lyrics' ? 'Search Lyrics' : 'Search with AI'}
                  </span>
                </div>
              )}
            </button>
          </form>
        </div>

        {/* AI Suggestions */}
        {!searchQuery && !searchResults.length && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              <span>AI Suggestions</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aiSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchQuery(suggestion)
                    handleSearch(suggestion)
                  }}
                  className="p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-purple-500 transition-all duration-200 text-left group"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-medium group-hover:text-purple-400 transition-colors">
                      {suggestion}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">AI-powered music discovery</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recent Searches */}
        {!searchQuery && !searchResults.length && recentSearches.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <History className="w-5 h-5 text-blue-400" />
              <span>Recent Searches</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchQuery(search)
                    handleSearch(search)
                  }}
                  className="px-4 py-2 bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors border border-gray-700 hover:border-blue-500"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        {showFilters && (
          <SlideIn className="mb-8">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-purple-400" />
                <span>Advanced Filters</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                  <div className="space-y-2">
                    {['song', 'artist', 'album', 'playlist', 'genre'].map((type) => (
                      <label key={type} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={searchFilters.type.includes(type)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSearchFilters(prev => ({
                                ...prev,
                                type: [...prev.type, type]
                              }))
                            } else {
                              setSearchFilters(prev => ({
                                ...prev,
                                type: prev.type.filter(t => t !== type)
                              }))
                            }
                          }}
                          className="text-purple-500 focus:ring-purple-500 rounded"
                        />
                        <span className="text-gray-300 capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Genre Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
                  <div className="space-y-2">
                    {['Rock', 'Jazz', 'Electronic', 'Classical', 'Hip Hop', 'Pop'].map((genre) => (
                      <label key={genre} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={searchFilters.genre.includes(genre)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSearchFilters(prev => ({
                                ...prev,
                                genre: [...prev.genre, genre]
                              }))
                            } else {
                              setSearchFilters(prev => ({
                                ...prev,
                                genre: prev.genre.filter(g => g !== genre)
                              }))
                            }
                          }}
                          className="text-purple-500 focus:ring-purple-500 rounded"
                        />
                        <span className="text-gray-300">{genre}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Duration Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Duration (seconds)</label>
                  <div className="space-y-2">
                    <div>
                      <input
                        type="range"
                        min="0"
                        max="600"
                        value={searchFilters.duration.max}
                        onChange={(e) => setSearchFilters(prev => ({
                          ...prev,
                          duration: { ...prev.duration, max: parseInt(e.target.value) }
                        }))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="text-xs text-gray-400 text-center">
                        Max: {searchFilters.duration.max}s
                      </div>
                    </div>
                  </div>
                </div>

                {/* Year Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Year Range</label>
                  <div className="space-y-2">
                    <div>
                      <input
                        type="range"
                        min="1900"
                        max="2024"
                        value={searchFilters.year.max}
                        onChange={(e) => setSearchFilters(prev => ({
                          ...prev,
                          year: { ...prev.year, max: parseInt(e.target.value) }
                        }))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="text-xs text-gray-400 text-center">
                        Up to: {searchFilters.year.max}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-4 mt-6">
                <button
                  onClick={applyFilters}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                >
                  Apply Filters
                </button>
                <button
                  onClick={() => setSearchFilters({
                    type: [],
                    genre: [],
                    mood: [],
                    duration: { min: 0, max: 600 },
                    year: { min: 1900, max: 2024 },
                    bpm: { min: 60, max: 200 },
                    key: []
                  })}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </SlideIn>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h3 className="text-xl font-semibold text-white">
                  {searchResults.length} results for &quot;{searchQuery}&quot;
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'relevance' | 'title' | 'artist' | 'year' | 'popularity')}
                  className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="title">Title</option>
                  <option value="artist">Artist</option>
                  <option value="year">Year</option>
                  <option value="popularity">Popularity</option>
                </select>
                
                <button
                  onClick={() => {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                    sortResults()
                  }}
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Results Grid/List */}
            <StaggeredList staggerDelay={0.1}>
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {searchResults.map((result) => (
                  <StaggeredItem key={result.id}>
                    <div className={`bg-gray-800 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-200 overflow-hidden ${
                      viewMode === 'list' ? 'flex items-center space-x-4 p-4' : 'p-6'
                    }`}>
                      {/* Result Icon */}
                      <div className={`w-16 h-16 bg-gradient-to-r ${getResultColor(result.type)} rounded-xl flex items-center justify-center text-2xl ${
                        viewMode === 'list' ? 'flex-shrink-0' : 'mx-auto mb-4'
                      }`}>
                        {getResultIcon(result.type)}
                      </div>

                      {/* Result Content */}
                      <div className={viewMode === 'list' ? 'flex-1' : 'text-center'}>
                        <h4 className="text-lg font-semibold text-white mb-2">{result.title}</h4>
                        <p className="text-gray-400 mb-2">{result.subtitle}</p>
                        <p className="text-gray-500 text-sm mb-4">{result.description}</p>

                        {/* Lyric Match Display */}
                        {result.lyricMatch && (
                          <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-3 mb-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <Quote className="w-4 h-4 text-blue-400" />
                              <span className="text-blue-400 text-sm font-medium">Lyric Match</span>
                            </div>
                            <p className="text-white text-sm mb-2">{result.lyricMatch.text}</p>
                            <p className="text-gray-300 text-xs">{result.lyricMatch.context}</p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-center space-x-2">
                          {result.actions.includes('play') && (
                            <button
                              onClick={() => result.type === 'song' && onSongSelect(result.metadata as Song)}
                              className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                              title="Play"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                          )}
                          
                          {result.actions.includes('add_to_playlist') && (
                            <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors" title="Add to Playlist">
                              <Plus className="w-4 h-4" />
                            </button>
                          )}
                          
                          {result.actions.includes('like') && (
                            <button className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors" title="Like">
                              <Heart className="w-4 h-4" />
                            </button>
                          )}
                          
                          {result.actions.includes('share') && (
                            <button className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors" title="Share">
                              <Share2 className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors" title="More">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </StaggeredItem>
                ))}
              </div>
            </StaggeredList>
          </div>
        )}

        {/* No Results */}
        {searchQuery && searchResults.length === 0 && !isSearching && (
          <FadeIn className="text-center py-16">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No results found</h3>
            <p className="text-gray-500 mb-6">
              {searchMode === 'lyrics' 
                ? 'Try different lyrics or check your spelling'
                : 'Try adjusting your search terms or filters'
              }
            </p>
            <button
              onClick={clearSearch}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              Start New Search
            </button>
          </FadeIn>
        )}
      </div>
    </div>
  )
}
