'use client'

import { useState } from 'react'
import { Grid3X3, List, Filter, SortAsc, SortDesc } from 'lucide-react'
import SongCard from './SongCard'

interface Song {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  cover: string
  isLiked?: boolean
  genre?: string
  year?: number
}

interface MusicLibraryProps {
  songs: Song[]
  currentSongId?: string
  isPlaying?: boolean
  onPlay?: (song: Song) => void
  onPause?: () => void
  onLike?: (songId: string) => void
  onAddToPlaylist?: (song: Song) => void
}

type ViewMode = 'grid' | 'list'
type SortField = 'title' | 'artist' | 'album' | 'duration' | 'year'
type SortOrder = 'asc' | 'desc'

export default function MusicLibrary({
  songs,
  currentSongId,
  isPlaying,
  onPlay,
  onPause,
  onLike,
  onAddToPlaylist
}: MusicLibraryProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [sortField, setSortField] = useState<SortField>('title')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  // Get unique genres from songs
  const genres = Array.from(new Set(songs.map(song => song.genre).filter((genre): genre is string => Boolean(genre))))

  // Filter and sort songs
  const filteredAndSortedSongs = songs
    .filter(song => {
      const matchesSearch = !searchQuery || 
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.album.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesGenre = selectedGenres.length === 0 || 
        (song.genre && selectedGenres.includes(song.genre))
      
      return matchesSearch && matchesGenre
    })
    .sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]
      
      if (sortField === 'duration') {
        aValue = aValue || 0
        bValue = bValue || 0
      } else if (sortField === 'year') {
        aValue = aValue || 0
        bValue = bValue || 0
      } else {
        aValue = (aValue || '').toString().toLowerCase()
        bValue = (bValue || '').toString().toLowerCase()
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    )
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
        sortField === field 
          ? 'bg-primary-600 text-white' 
          : 'text-gray-400 hover:text-white hover:bg-dark-600'
      }`}
    >
      <span>{children}</span>
      {sortField === field && (
        sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
      )}
    </button>
  )

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search and Filters */}
        <div className="flex-1 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search in library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 bg-dark-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          
          {/* Genre Filters */}
          <div className="flex flex-wrap gap-2">
            {genres.map(genre => (
              <button
                key={genre}
                onClick={() => handleGenreToggle(genre)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedGenres.includes(genre)
                    ? 'bg-primary-600 text-white'
                    : 'bg-dark-700 text-gray-300 hover:bg-dark-600 hover:text-white'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* View and Sort Controls */}
        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="flex bg-dark-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-1">
            <SortButton field="title">Title</SortButton>
            <SortButton field="artist">Artist</SortButton>
            <SortButton field="album">Album</SortButton>
            <SortButton field="duration">Duration</SortButton>
            <SortButton field="year">Year</SortButton>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="text-sm text-gray-400">
        Showing {filteredAndSortedSongs.length} of {songs.length} songs
        {selectedGenres.length > 0 && ` • Filtered by ${selectedGenres.join(', ')}`}
        {searchQuery && ` • Search: "${searchQuery}"`}
      </div>

      {/* Songs Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAndSortedSongs.map(song => (
            <div key={song.id} className="bg-dark-800 rounded-lg p-4 border border-dark-700 hover:border-dark-600 transition-colors">
              <div className="text-center space-y-3">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">🎵</span>
                </div>
                <div>
                  <h4 className="font-medium text-white truncate">{song.title}</h4>
                  <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                  <p className="text-gray-500 text-xs truncate">{song.album}</p>
                </div>
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => onPlay?.(song)}
                    className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors"
                  >
                    <span className="text-sm">▶</span>
                  </button>
                  <button
                    onClick={() => onLike?.(song.id)}
                    className={`p-2 rounded-full transition-colors ${
                      song.isLiked 
                        ? 'text-red-500 hover:text-red-400' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="text-sm">❤</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredAndSortedSongs.map(song => (
            <SongCard
              key={song.id}
              song={song}
              isPlaying={isPlaying && currentSongId === song.id}
              isCurrentSong={currentSongId === song.id}
              onPlay={onPlay}
              onPause={onPause}
              onLike={onLike}
              onAddToPlaylist={onAddToPlaylist}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredAndSortedSongs.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎵</span>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No songs found</h3>
          <p className="text-gray-400">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  )
}
