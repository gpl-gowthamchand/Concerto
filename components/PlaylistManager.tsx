'use client'

import { useState, useRef } from 'react'
import { 
  Plus, 
  Music, 
  Users, 
  Share2, 
  Edit3, 
  Zap, 
  Star, 
  Clock, 
  TrendingUp, 
  Search, 
  Grid3X3, 
  List
} from 'lucide-react'
import { Song, mockSongs } from '../lib/musicData'
import { FadeIn, StaggeredList, StaggeredItem } from './PageTransition'

interface Playlist {
  id: string
  name: string
  description: string
  cover: string
  songs: Song[]
  createdBy: string
  isPublic: boolean
  isCollaborative: boolean
  collaborators: string[]
  createdAt: Date
  updatedAt: Date
  totalDuration: number
  playCount: number
  lastPlayed?: Date
  tags: string[]
  mood?: string
  genre?: string
}

interface PlaylistManagerProps {
  onPlaylistSelect: (playlist: Playlist) => void
}

export default function PlaylistManager({ 
  onPlaylistSelect
}: PlaylistManagerProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterMood, setFilterMood] = useState<string>('')
  const [filterGenre, setFilterGenre] = useState<string>('')
  const [showSmartPlaylists, setShowSmartPlaylists] = useState(false)
  
  const dragItem = useRef<Song | null>(null)

  // Initialize with mock playlists
  useState(() => {
    const mockPlaylists: Playlist[] = [
      {
        id: '1',
        name: 'Chill Vibes',
        description: 'Perfect for relaxing and unwinding',
        cover: '🌙',
        songs: mockSongs.filter(s => s.genre === 'Pop' || s.genre === 'Soul'),
        createdBy: 'user1',
        isPublic: true,
        isCollaborative: false,
        collaborators: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15'),
        totalDuration: 1200,
        playCount: 45,
        lastPlayed: new Date('2024-01-20'),
        tags: ['chill', 'relaxing', 'evening'],
        mood: 'calm',
        genre: 'Pop'
      },
      {
        id: '2',
        name: 'Workout Energy',
        description: 'High energy music to keep you motivated',
        cover: '💪',
        songs: mockSongs.filter(s => s.genre === 'Rock'),
        createdBy: 'user1',
        isPublic: true,
        isCollaborative: true,
        collaborators: ['user2', 'user3'],
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-18'),
        totalDuration: 1800,
        playCount: 78,
        lastPlayed: new Date('2024-01-19'),
        tags: ['workout', 'energy', 'motivation'],
        mood: 'energetic',
        genre: 'Rock'
      }
    ]
    setPlaylists(mockPlaylists)
  })

  // Smart playlist generation - TODO: Implement when needed
  // const generateSmartPlaylists = useCallback(() => {
  //   // Implementation for smart playlist generation
  // }, [])

  const getMoodIcon = (mood: string) => {
    const icons: Record<string, string> = {
      energetic: '⚡',
      calm: '🌙',
      happy: '☀️',
      melancholic: '☁️',
      focused: '🎯'
    }
    return icons[mood] || '🎵'
  }

  // Drag and drop handlers - TODO: Implement when needed
  // const handleDragStart = (e: React.DragEvent, song: Song) => {
  //   dragItem.current = song
  // }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetPlaylist: Playlist) => {
    e.preventDefault()
    if (!dragItem.current) return

    const updatedPlaylists = playlists.map(playlist => {
      if (playlist.id === targetPlaylist.id) {
        // Add song if not already present
        if (!playlist.songs.find(s => s.id === dragItem.current!.id)) {
          return {
            ...playlist,
            songs: [...playlist.songs, dragItem.current!],
            totalDuration: playlist.totalDuration + dragItem.current!.duration,
            updatedAt: new Date()
          }
        }
      }
      return playlist
    })

    setPlaylists(updatedPlaylists)
    dragItem.current = null
  }

  // Filter and search
  const filteredPlaylists = playlists.filter(playlist => {
    const matchesSearch = playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         playlist.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesMood = !filterMood || playlist.mood === filterMood
    const matchesGenre = !filterGenre || playlist.genre === filterGenre
    
    return matchesSearch && matchesMood && matchesGenre
  })

  // Calculate total duration
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
            Playlist Manager
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Create, organize, and discover the perfect playlists for every moment
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row items-center justify-between mb-8 space-y-4 lg:space-y-0">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search playlists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-800 text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <select
              value={filterMood}
              onChange={(e) => setFilterMood(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Moods</option>
              <option value="energetic">Energetic</option>
              <option value="calm">Calm</option>
              <option value="happy">Happy</option>
              <option value="melancholic">Melancholic</option>
              <option value="focused">Focused</option>
            </select>
            
            <select
              value={filterGenre}
              onChange={(e) => setFilterGenre(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Genres</option>
              <option value="Rock">Rock</option>
              <option value="Pop">Pop</option>
              <option value="Jazz">Jazz</option>
              <option value="Classical">Classical</option>
              <option value="Electronic">Electronic</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowSmartPlaylists(!showSmartPlaylists)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              <Zap className="w-4 h-4" />
              <span>Smart Playlists</span>
            </button>
            
            <button
              onClick={() => {/* TODO: Implement playlist creation */}}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Playlist</span>
            </button>
            
            <div className="flex items-center space-x-1 bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Playlists Grid/List */}
        <StaggeredList staggerDelay={0.1}>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPlaylists.map((playlist) => (
                <StaggeredItem key={playlist.id}>
                  <div 
                    className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-all duration-200 cursor-pointer group border border-gray-700 hover:border-blue-500"
                    onClick={() => onPlaylistSelect(playlist)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, playlist)}
                  >
                    {/* Playlist Cover */}
                    <div className="text-center mb-4">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-200">
                        {playlist.cover}
                      </div>
                    </div>
                    
                    {/* Playlist Info */}
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {playlist.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {playlist.description}
                      </p>
                      
                      {/* Stats */}
                      <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 mb-3">
                        <span className="flex items-center space-x-1">
                          <Music className="w-3 h-3" />
                          <span>{playlist.songs.length} songs</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDuration(playlist.totalDuration)}</span>
                        </span>
                      </div>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap justify-center gap-1 mb-3">
                        {playlist.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center justify-center space-x-2">
                        {playlist.isCollaborative && (
                          <span className="p-1 bg-green-600 text-white rounded-full">
                            <Users className="w-3 h-3" />
                          </span>
                        )}
                        {playlist.mood && (
                          <span className="p-1 bg-blue-600 text-white rounded-full">
                            {getMoodIcon(playlist.mood)}
                          </span>
                        )}
                        <span className="p-1 bg-purple-600 text-white rounded-full">
                          <Star className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </StaggeredItem>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPlaylists.map((playlist) => (
                <StaggeredItem key={playlist.id}>
                  <div 
                    className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-all duration-200 cursor-pointer border border-gray-700 hover:border-blue-500"
                    onClick={() => onPlaylistSelect(playlist)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, playlist)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                        {playlist.cover}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
                          {playlist.name}
                        </h3>
                        <p className="text-gray-400 text-sm mb-2 line-clamp-1">
                          {playlist.description}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Music className="w-3 h-3" />
                            <span>{playlist.songs.length} songs</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDuration(playlist.totalDuration)}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <TrendingUp className="w-3 h-3" />
                            <span>{playlist.playCount} plays</span>
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {playlist.isCollaborative && (
                          <span className="p-2 bg-green-600 text-white rounded-full">
                            <Users className="w-4 h-4" />
                          </span>
                        )}
                        <button className="p-2 text-gray-400 hover:text-white transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-white transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </StaggeredItem>
              ))}
            </div>
          )}
        </StaggeredList>

        {/* Empty State */}
        {filteredPlaylists.length === 0 && (
          <FadeIn className="text-center py-16">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Music className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No playlists found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or create a new playlist</p>
            <button
              onClick={() => {/* TODO: Implement playlist creation */}}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Create Your First Playlist
            </button>
          </FadeIn>
        )}
      </div>
    </div>
  )
}
