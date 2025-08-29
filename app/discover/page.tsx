'use client'

import { useState, useEffect } from 'react'
import { 
  Music, 
  Heart, 
  Play, 
  Plus, 
  Clock, 
  Users, 
  TrendingUp,
  Filter,
  Search,
  Grid,
  List
} from 'lucide-react'
import { realMusicService, RealSong, RealPlaylist, SearchFilters } from '../../lib/realMusicService'
import WorkingMusicPlayer from '../../components/WorkingMusicPlayer'

interface DiscoverPageProps {
  searchParams?: { q?: string; genre?: string; mood?: string }
}

export default function DiscoverPage({ searchParams }: DiscoverPageProps) {
  const [currentSong, setCurrentSong] = useState<RealSong | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchParams?.q || '')
  const [selectedGenre, setSelectedGenre] = useState(searchParams?.genre || '')
  const [selectedMood, setSelectedMood] = useState(searchParams?.mood || '')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isLoading, setIsLoading] = useState(false)
  
  const [trendingSongs, setTrendingSongs] = useState<RealSong[]>([])
  const [genreSongs, setGenreSongs] = useState<RealSong[]>([])
  const [moodSongs, setMoodSongs] = useState<RealSong[]>([])
  const [searchResults, setSearchResults] = useState<RealSong[]>([])
  const [featuredPlaylists, setFeaturedPlaylists] = useState<RealPlaylist[]>([])

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true)
        const [trending, playlists] = await Promise.all([
          realMusicService.getTrendingMusic(20),
          realMusicService.getFeaturedPlaylists(10)
        ])
        setTrendingSongs(trending)
        setFeaturedPlaylists(playlists)
      } catch (error) {
        console.error('Error loading initial data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialData()
  }, [])

  // Load genre-specific music
  useEffect(() => {
    if (selectedGenre) {
      const loadGenreMusic = async () => {
        try {
          setIsLoading(true)
          const songs = await realMusicService.getMusicByGenre(selectedGenre, 20)
          setGenreSongs(songs)
        } catch (error) {
          console.error('Error loading genre music:', error)
        } finally {
          setIsLoading(false)
        }
      }
      loadGenreMusic()
    }
  }, [selectedGenre])

  // Load mood-specific music
  useEffect(() => {
    if (selectedMood) {
      const loadMoodMusic = async () => {
        try {
          setIsLoading(true)
          const songs = await realMusicService.getMusicByMood(selectedMood, 20)
          setMoodSongs(songs)
        } catch (error) {
          console.error('Error loading mood music:', error)
        } finally {
          setIsLoading(false)
        }
      }
      loadMoodMusic()
    }
  }, [selectedMood])

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    try {
      setIsLoading(true)
      const filters: SearchFilters = {
        songs: true,
        artists: true,
        albums: true
      }
      
      const results = await realMusicService.searchMusic(searchQuery, filters)
      const songs = results
        .filter(result => result.type === 'song')
        .map(result => result.data as RealSong)
      
      setSearchResults(songs)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle song selection
  const handleSongSelect = (song: RealSong) => {
    setCurrentSong(song)
    setIsPlaying(true)
  }

  // Handle play/pause
  const handlePlayPause = () => {
    if (currentSong) {
      setIsPlaying(!isPlaying)
    }
  }

  // Handle next/previous
  const handleNext = () => {
    if (currentSong) {
      const allSongs = [...trendingSongs, ...genreSongs, ...moodSongs, ...searchResults]
      const currentIndex = allSongs.findIndex(song => song.id === currentSong.id)
      const nextIndex = (currentIndex + 1) % allSongs.length
      const nextSong = allSongs[nextIndex]
      setCurrentSong(nextSong)
    }
  }

  const handlePrevious = () => {
    if (currentSong) {
      const allSongs = [...trendingSongs, ...genreSongs, ...moodSongs, ...searchResults]
      const currentIndex = allSongs.findIndex(song => song.id === currentSong.id)
      const prevIndex = currentIndex === 0 ? allSongs.length - 1 : currentIndex - 1
      const prevSong = allSongs[prevIndex]
      setCurrentSong(prevSong)
    }
  }

  // Available genres and moods
  const genres = ['Pop', 'Rock', 'Electronic', 'Hip-Hop', 'Jazz', 'Classical', 'Country', 'R&B', 'Indie', 'Acoustic']
  const moods = ['Happy', 'Sad', 'Energetic', 'Relaxed', 'Creative', 'Romantic', 'Motivational', 'Chill']

  // Format duration
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Render song grid
  const renderSongGrid = (songs: RealSong[]) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {songs.map((song) => (
        <div
          key={song.id}
          onClick={() => handleSongSelect(song)}
          className="bg-dark-800 rounded-lg p-4 border border-dark-700 hover:border-primary-500 transition-colors cursor-pointer group"
        >
          <div className="text-center space-y-3">
            <div className="w-full aspect-square bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
              {song.cover.startsWith('http') ? (
                <img 
                  src={song.cover} 
                  alt={song.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-2xl">{song.cover}</span>
              )}
            </div>
            
            <div className="min-w-0">
              <h4 className="font-medium text-white text-sm truncate group-hover:text-primary-400 transition-colors">
                {song.title}
              </h4>
              <p className="text-gray-400 text-xs truncate">{song.artist}</p>
              <p className="text-gray-500 text-xs truncate">{song.album}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-gray-500 text-xs">{formatDuration(song.duration)}</span>
                <span className="text-primary-400 text-xs capitalize">{song.genre}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  // Render song list
  const renderSongList = (songs: RealSong[]) => (
    <div className="space-y-2">
      {songs.map((song) => (
        <div
          key={song.id}
          onClick={() => handleSongSelect(song)}
          className="flex items-center space-x-4 p-4 bg-dark-800 rounded-lg border border-dark-700 hover:border-primary-500 transition-colors cursor-pointer group"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
            {song.cover.startsWith('http') ? (
              <img 
                src={song.cover} 
                alt={song.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-bold text-lg">{song.cover}</span>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-white group-hover:text-primary-400 transition-colors">
              {song.title}
            </h4>
            <p className="text-gray-400 text-sm">{song.artist}</p>
            <p className="text-gray-500 text-xs">{song.album}</p>
          </div>
          
          <div className="flex items-center space-x-4 text-gray-400">
            <span className="text-sm">{formatDuration(song.duration)}</span>
            <span className="text-xs capitalize bg-primary-500/20 text-primary-400 px-2 py-1 rounded">
              {song.genre}
            </span>
            <button className="p-2 hover:text-primary-400 transition-colors">
              <Heart className="w-4 h-4" />
            </button>
            <button className="p-2 hover:text-primary-400 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )

  if (isLoading && !trendingSongs.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Discovering amazing music...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900">
      {/* Header */}
      <header className="bg-dark-800/80 backdrop-blur-md border-b border-dark-700 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Discover Music</h1>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 pb-32">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search for songs, artists, albums..."
                  className="w-full pl-10 pr-4 py-3 bg-dark-700 text-white rounded-lg border border-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              Search
            </button>
          </div>

          {/* Genre and Mood Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-gray-400 text-sm">Genres:</span>
            </div>
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(selectedGenre === genre ? '' : genre)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedGenre === genre
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">Moods:</span>
            </div>
            {moods.map((mood) => (
              <button
                key={mood}
                onClick={() => setSelectedMood(selectedMood === mood ? '' : mood)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedMood === mood
                    ? 'bg-purple-500 text-white'
                    : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                }`}
              >
                {mood}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Search Results for &quot;{searchQuery}&quot;
              </h2>
              <span className="text-gray-400">{searchResults.length} songs found</span>
            </div>
            {viewMode === 'grid' ? renderSongGrid(searchResults) : renderSongList(searchResults)}
          </div>
        )}

        {/* Genre-specific Music */}
        {selectedGenre && genreSongs.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">{selectedGenre} Music</h2>
              <span className="text-gray-400">{genreSongs.length} songs</span>
            </div>
            {viewMode === 'grid' ? renderSongGrid(genreSongs) : renderSongList(genreSongs)}
          </div>
        )}

        {/* Mood-specific Music */}
        {selectedMood && moodSongs.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">{selectedMood} Vibes</h2>
              <span className="text-gray-400">{moodSongs.length} songs</span>
            </div>
            {viewMode === 'grid' ? renderSongGrid(moodSongs) : renderSongList(moodSongs)}
          </div>
        )}

        {/* Featured Playlists */}
        {!searchQuery && !selectedGenre && !selectedMood && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Featured Playlists</h2>
              <button className="text-primary-400 hover:text-primary-300 transition-colors">
                View All
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPlaylists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="bg-dark-800 rounded-lg p-6 border border-dark-700 hover:border-primary-500 transition-colors cursor-pointer group"
                >
                  <div className="text-center space-y-4">
                    <div className="w-32 h-32 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto group-hover:scale-105 transition-transform overflow-hidden">
                      {playlist.cover.startsWith('http') ? (
                        <img 
                          src={playlist.cover} 
                          alt={playlist.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-4xl">{playlist.cover}</span>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-white text-lg mb-2 group-hover:text-primary-400 transition-colors">
                        {playlist.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3">
                        {playlist.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{playlist.songCount} songs</span>
                        <span className="capitalize">{playlist.mood}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trending Music */}
        {!searchQuery && !selectedGenre && !selectedMood && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <TrendingUp className="w-6 h-6 text-primary-400" />
                Trending Now
              </h2>
              <button className="text-primary-400 hover:text-primary-300 transition-colors">
                View All
              </button>
            </div>
            {viewMode === 'grid' ? renderSongGrid(trendingSongs) : renderSongList(trendingSongs)}
          </div>
        )}
      </main>

      {/* Working Music Player */}
      {currentSong && (
        <WorkingMusicPlayer
          currentSong={currentSong}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onNext={handleNext}
          onPrevious={handlePrevious}
          queue={[...trendingSongs, ...genreSongs, ...moodSongs, ...searchResults]}
        />
      )}
    </div>
  )
}
