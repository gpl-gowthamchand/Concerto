'use client'

import { useState, useEffect } from 'react'
import { 
  X, 
  Plus, 
  Users, 
  Globe, 
  Lock, 
  Save,
  Settings
} from 'lucide-react'
import { Song, mockSongs } from '../lib/musicData'
import { SlideIn } from './PageTransition'

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
  tags: string[]
  mood?: string
  genre?: string
}

interface CreatePlaylistModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (playlist: Playlist) => void
  editingPlaylist?: Playlist
}

export default function CreatePlaylistModal({
  isOpen,
  onClose,
  onSave,
  editingPlaylist
}: CreatePlaylistModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [isCollaborative, setIsCollaborative] = useState(false)
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [mood, setMood] = useState('')
  const [genre, setGenre] = useState('')
  const [coverEmoji, setCoverEmoji] = useState('🎵')
  const [searchQuery, setSearchQuery] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Initialize form when editing
  useEffect(() => {
    if (editingPlaylist) {
      setName(editingPlaylist.name)
      setDescription(editingPlaylist.description)
      setIsPublic(editingPlaylist.isPublic)
      setIsCollaborative(editingPlaylist.isCollaborative)
      setSelectedSongs(editingPlaylist.songs || [])
      setTags(editingPlaylist.tags || [])
      setMood(editingPlaylist.mood || '')
      setGenre(editingPlaylist.genre || '')
      setCoverEmoji(editingPlaylist.cover || '🎵')
    } else {
      // Reset form for new playlist
      setName('')
      setDescription('')
      setIsPublic(true)
      setIsCollaborative(false)
      setSelectedSongs([])
      setTags([])
      setMood('')
      setGenre('')
      setCoverEmoji('🎵')
    }
  }, [editingPlaylist, isOpen])

  // Filter songs based on search
  const filteredSongs = mockSongs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.album.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Add tag
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  // Toggle song selection
  const toggleSong = (song: Song) => {
    if (selectedSongs.find(s => s.id === song.id)) {
      setSelectedSongs(selectedSongs.filter(s => s.id !== song.id))
    } else {
      setSelectedSongs([...selectedSongs, song])
    }
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) return

    const playlist: Playlist = {
      id: editingPlaylist?.id || `playlist-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      cover: coverEmoji,
      songs: selectedSongs,
      createdBy: 'user1', // In real app, get from auth context
      isPublic,
      isCollaborative,
      collaborators: [],
      createdAt: editingPlaylist?.createdAt || new Date(),
      updatedAt: new Date(),
      totalDuration: selectedSongs.reduce((acc, song) => acc + song.duration, 0),
      playCount: editingPlaylist?.playCount || 0,
      tags,
      mood,
      genre
    }

    onSave(playlist)
    onClose()
  }

  // Emoji options for cover
  const emojiOptions = [
    '🎵', '🎶', '🎸', '🎹', '🥁', '🎺', '🎻', '🎤', '🎧', '📻',
    '💿', '🎼', '🎭', '🎪', '🎨', '🌟', '✨', '💫', '🔥', '💧',
    '🌙', '☀️', '🌈', '🌸', '🍀', '💎', '💖', '💙', '💚', '💛',
    '💜', '🧡', '🖤', '🤍', '💯', '💪', '🎯', '🚀', '⚡', '💥'
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <SlideIn className="relative w-full max-w-4xl max-h-[90vh] bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">
            {editingPlaylist ? 'Edit Playlist' : 'Create New Playlist'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Playlist Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter playlist name"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your playlist..."
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* Cover Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cover Emoji
                  </label>
                  <div className="grid grid-cols-10 gap-2">
                    {emojiOptions.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setCoverEmoji(emoji)}
                        className={`w-10 h-10 text-xl rounded-lg transition-all duration-200 ${
                          coverEmoji === emoji 
                            ? 'bg-blue-500 scale-110' 
                            : 'bg-gray-800 hover:bg-gray-700'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Visibility
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={isPublic}
                        onChange={() => setIsPublic(true)}
                        className="text-blue-500 focus:ring-blue-500"
                      />
                      <Globe className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">Public</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={!isPublic}
                        onChange={() => setIsPublic(false)}
                        className="text-blue-500 focus:ring-blue-500"
                      />
                      <Lock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">Private</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isCollaborative}
                      onChange={(e) => setIsCollaborative(e.target.checked)}
                      className="text-blue-500 focus:ring-blue-500 rounded"
                    />
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">Allow collaboration</span>
                  </label>
                </div>

                {/* Advanced Options */}
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Advanced Options</span>
                </button>

                {showAdvanced && (
                  <div className="space-y-4 pt-4 border-t border-gray-700">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Mood
                      </label>
                      <select
                        value={mood}
                        onChange={(e) => setMood(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select mood</option>
                        <option value="energetic">Energetic</option>
                        <option value="calm">Calm</option>
                        <option value="happy">Happy</option>
                        <option value="melancholic">Melancholic</option>
                        <option value="focused">Focused</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Genre
                      </label>
                      <select
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select genre</option>
                        <option value="Rock">Rock</option>
                        <option value="Pop">Pop</option>
                        <option value="Jazz">Jazz</option>
                        <option value="Classical">Classical</option>
                        <option value="Electronic">Electronic</option>
                        <option value="Hip Hop">Hip Hop</option>
                        <option value="Country">Country</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags
              </label>
              <div className="flex items-center space-x-2 mb-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-full text-sm"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-200 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Song Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Songs ({selectedSongs.length} selected)
              </label>
              <div className="relative mb-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search songs to add..."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {filteredSongs.map((song) => {
                  const isSelected = selectedSongs.find(s => s.id === song.id)
                  return (
                    <div
                      key={song.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-600/20 border border-blue-500' : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                      onClick={() => toggleSong(song)}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSong(song)}
                        className="text-blue-500 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="text-white font-medium">{song.title}</div>
                        <div className="text-gray-400 text-sm">{song.artist} • {song.album}</div>
                      </div>
                      <div className="text-gray-500 text-sm">
                        {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-700 bg-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{editingPlaylist ? 'Update Playlist' : 'Create Playlist'}</span>
            </button>
          </div>
        </form>
      </SlideIn>
    </div>
  )
}
