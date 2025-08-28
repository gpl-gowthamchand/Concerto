'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Search,
  TrendingUp,
  Music,
  Heart,
  Play,
  Plus,
  Share2,
  Clock,
  Eye,
  ThumbsUp,
  Grid3X3,
  List
} from 'lucide-react'
import { YouTubeMusicTrack, youtubeMusicService } from '../lib/youtubeMusicService'
import { StaggeredList, StaggeredItem } from './PageTransition'

interface RealMusicDiscoveryProps {
  onTrackSelect: (track: YouTubeMusicTrack) => void
  onPlaylistCreate: (name: string, tracks: YouTubeMusicTrack[]) => void
}

export default function RealMusicDiscovery({
  onTrackSelect,
  onPlaylistCreate
}: RealMusicDiscoveryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<YouTubeMusicTrack[]>([])
  const [trendingMusic, setTrendingMusic] = useState<YouTubeMusicTrack[]>([])
  const [genreMusic, setGenreMusic] = useState<YouTubeMusicTrack[]>([])
  const [moodMusic, setMoodMusic] = useState<YouTubeMusicTrack[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [activeTab, setActiveTab] = useState<'trending' | 'genres' | 'moods' | 'search'>('trending')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [selectedMood, setSelectedMood] = useState('')
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set())

  // Load initial data
  useEffect(() => {
    loadTrendingMusic()
    loadGenreMusic()
    loadMoodMusic()
  }, [])

  // Load trending music
  const loadTrendingMusic = async () => {
    try {
      const tracks = await youtubeMusicService.getTrendingMusic(20)
      setTrendingMusic(tracks)
    } catch (error) {
      console.error('Error loading trending music:', error)
    }
  }

  // Load genre music
  const loadGenreMusic = async () => {
    try {
      const tracks = await youtubeMusicService.getMusicByGenre('pop', 20)
      setGenreMusic(tracks)
    } catch (error) {
      console.error('Error loading genre music:', error)
    }
  }

  // Load mood music
  const loadMoodMusic = async () => {
    try {
      const tracks = await youtubeMusicService.getMusicByMood('energetic', 20)
      setMoodMusic(tracks)
    } catch (error) {
      console.error('Error loading mood music:', error)
    }
  }

  // Search music
  const handleSearch = async (query: string) => {
    if (!query.trim()) return
    
    setIsSearching(true)
    setActiveTab('search')
    
    try {
      const result = await youtubeMusicService.searchMusic(query, 30)
      setSearchResults(result.tracks)
    } catch (error) {
      console.error('Error searching music:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(searchQuery)
  }

  // Load music by genre
  const loadMusicByGenre = async (genre: string) => {
    setSelectedGenre(genre)
    setActiveTab('genres')
    
    try {
      const tracks = await youtubeMusicService.getMusicByGenre(genre, 20)
      setGenreMusic(tracks)
    } catch (error) {
      console.error('Error loading genre music:', error)
    }
  }

  // Load music by mood
  const loadMusicByMood = async (mood: string) => {
    setSelectedMood(mood)
    setActiveTab('moods')
    
    try {
      const tracks = await youtubeMusicService.getMusicByMood(mood, 20)
      setMoodMusic(tracks)
    } catch (error) {
      console.error('Error loading mood music:', error)
    }
  }

  // Toggle like track
  const toggleLike = (track: YouTubeMusicTrack) => {
    const newLikedTracks = new Set(likedTracks)
    if (newLikedTracks.has(track.id)) {
      newLikedTracks.delete(track.id)
    } else {
      newLikedTracks.add(track.id)
    }
    setLikedTracks(newLikedTracks)
  }

  // Add track to playlist
  const addToPlaylist = (track: YouTubeMusicTrack) => {
    const playlistName = prompt('Enter playlist name:')
    if (playlistName) {
      onPlaylistCreate(playlistName, [track])
    }
  }

  // Share track
  const shareTrack = (track: YouTubeMusicTrack) => {
    if (navigator.share) {
      navigator.share({
        title: track.title,
        text: `Check out ${track.title} by ${track.artist}`,
        url: track.videoUrl
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${track.title} by ${track.artist} - ${track.videoUrl}`)
      alert('Link copied to clipboard!')
    }
  }

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Format views
  const formatViews = (views: number) => {
    if (views >= 1000000000) {
      return `${(views / 1000000000).toFixed(1)}B`
    } else if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }

  // Get current tracks based on active tab
  const getCurrentTracks = () => {
    switch (activeTab) {
      case 'trending': return trendingMusic
      case 'genres': return genreMusic
      case 'moods': return moodMusic
      case 'search': return searchResults
      default: return []
    }
  }

  const currentTracks = getCurrentTracks()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center text-3xl">
              <Music className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Real Music Discovery
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover millions of real songs from YouTube Music - Every genre, every mood, every era
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for any song, artist, or album..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-20 py-4 bg-gray-800 text-white placeholder-gray-400 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
              />
              <button
                type="submit"
                disabled={!searchQuery.trim() || isSearching}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200 font-medium"
              >
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </form>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1 border border-gray-700">
            <button
              onClick={() => setActiveTab('trending')}
              className={`px-6 py-3 rounded-md transition-all duration-200 ${
                activeTab === 'trending'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4" />
                <span>Trending</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('genres')}
              className={`px-6 py-3 rounded-md transition-all duration-200 ${
                activeTab === 'genres'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Music className="w-4 h-4" />
                <span>Genres</span>
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab('moods')}
              className={`px-6 py-3 rounded-md transition-all duration-200 ${
                activeTab === 'moods'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4" />
                <span>Moods</span>
              </div>
            </button>
          </div>
        </div>

        {/* Genre Quick Access */}
        {activeTab === 'genres' && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Popular Genres</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {['Pop', 'Rock', 'Hip Hop', 'Electronic', 'Jazz', 'Classical', 'Country', 'R&B', 'Latin', 'K-Pop', 'Indie', 'Folk'].map((genre) => (
                <button
                  key={genre}
                  onClick={() => loadMusicByGenre(genre)}
                  className={`p-3 rounded-lg border transition-all duration-200 ${
                    selectedGenre === genre
                      ? 'bg-green-600 border-green-500 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-green-500'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mood Quick Access */}
        {activeTab === 'moods' && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Music by Mood</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {['Happy', 'Sad', 'Energetic', 'Relaxing', 'Romantic', 'Party', 'Focus', 'Sleep'].map((mood) => (
                <button
                  key={mood}
                  onClick={() => loadMusicByMood(mood)}
                  className={`p-3 rounded-lg border transition-all duration-200 ${
                    selectedMood === mood
                      ? 'bg-green-600 border-green-500 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-green-500'
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* View Mode Toggle */}
        <div className="flex justify-end mb-6">
          <div className="bg-gray-800 rounded-lg p-1 border border-gray-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Music Results */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold text-white">
              {activeTab === 'trending' && 'Trending Now'}
              {activeTab === 'genres' && `${selectedGenre || 'All Genres'} Music`}
              {activeTab === 'moods' && `${selectedMood || 'All Moods'} Music`}
              {activeTab === 'search' && `Search Results for "${searchQuery}"`}
            </h3>
            
            <div className="flex items-center space-x-2 text-gray-400">
              <span>{currentTracks.length} tracks</span>
              <button
                onClick={() => {
                  if (currentTracks.length > 0) {
                    onPlaylistCreate('New Playlist', currentTracks)
                  }
                }}
                className="flex items-center space-x-2 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-white text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Save All</span>
              </button>
            </div>
          </div>

          {currentTracks.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Music className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No music found</h3>
              <p className="text-gray-500">
                {activeTab === 'search' 
                  ? 'Try a different search term'
                  : 'Check back later for new music'
                }
              </p>
            </div>
          ) : (
            <StaggeredList staggerDelay={0.1}>
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-3'}>
                {currentTracks.map((track) => (
                  <StaggeredItem key={track.id}>
                    <div className={`bg-gray-800 rounded-xl border border-gray-700 hover:border-green-500 transition-all duration-200 overflow-hidden ${
                      viewMode === 'list' ? 'flex items-center space-x-4 p-4' : 'p-4'
                    }`}>
                      
                      {/* Track Thumbnail */}
                      <div className={`${viewMode === 'list' ? 'w-16 h-16' : 'w-full h-48'} rounded-lg overflow-hidden flex-shrink-0`}>
                        <Image
                          src={track.thumbnail}
                          alt={track.title}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        />
                      </div>

                      {/* Track Info */}
                      <div className={viewMode === 'list' ? 'flex-1 min-w-0' : 'mt-4'}>
                        <h4 className="text-lg font-semibold text-white truncate mb-2">{track.title}</h4>
                        <p className="text-gray-400 mb-1 truncate">{track.artist}</p>
                        {track.album && (
                          <p className="text-gray-500 text-sm mb-2 truncate">{track.album}</p>
                        )}
                        
                        {/* Track Stats */}
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDuration(track.duration)}</span>
                          </span>
                          {track.views && (
                            <span className="flex items-center space-x-1">
                              <Eye className="w-3 h-3" />
                              <span>{formatViews(track.views)}</span>
                            </span>
                          )}
                          {track.likes && (
                            <span className="flex items-center space-x-1">
                              <ThumbsUp className="w-3 h-3" />
                              <span>{formatViews(track.likes)}</span>
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onTrackSelect(track)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                          >
                            <Play className="w-4 h-4" />
                            <span>Play</span>
                          </button>
                          
                          <button
                            onClick={() => toggleLike(track)}
                            className={`p-2 rounded-lg transition-colors ${
                              likedTracks.has(track.id)
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                            title="Like"
                          >
                            <Heart className="w-4 h-4" fill={likedTracks.has(track.id) ? 'currentColor' : 'none'} />
                          </button>
                          
                          <button
                            onClick={() => addToPlaylist(track)}
                            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            title="Add to Playlist"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={() => shareTrack(track)}
                            className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                            title="Share"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </StaggeredItem>
                ))}
              </div>
            </StaggeredList>
          )}
        </div>
      </div>
    </div>
  )
}
