'use client'

import { useState, useEffect } from 'react'
import { 
  Zap, 
  Coffee, 
  Heart, 
  Sun, 
  Moon, 
  Cloud, 
  Play, 
  Clock,
  Music,
  Sparkles,
  Shuffle,
  Plus
} from 'lucide-react'
import { mockSongs } from '../lib/musicData'

interface Song {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  genre: string
  energy: number
  tempo: number
}

interface Mood {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  description: string
  energy: number
  tempo: number
  genres: string[]
}

interface MoodPlaylist {
  id: string
  mood: string
  songs: Song[]
  duration: number
  energy: number
  createdAt: string
  isGenerated: boolean
}

export default function MoodPlaylists() {
  const [selectedMood, setSelectedMood] = useState<string>('')
  const [playlists, setPlaylists] = useState<MoodPlaylist[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentTime, setCurrentTime] = useState<string>('')

  // Update current time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hour = now.getHours()
      
      if (hour >= 6 && hour < 12) {
        setCurrentTime('morning')
      } else if (hour >= 12 && hour < 17) {
        setCurrentTime('afternoon')
      } else if (hour >= 17 && hour < 21) {
        setCurrentTime('evening')
      } else {
        setCurrentTime('night')
      }
    }

    updateTime()
    const interval = setInterval(updateTime, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  const moods: Mood[] = [
    {
      id: 'energetic',
      name: 'Energetic',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-yellow-400 to-orange-500',
      description: 'High-energy tracks to boost your mood',
      energy: 9,
      tempo: 140,
      genres: ['Rock', 'Pop', 'Electronic', 'Hip-Hop']
    },
    {
      id: 'chill',
      name: 'Chill',
      icon: <Coffee className="w-6 h-6" />,
      color: 'from-blue-400 to-purple-500',
      description: 'Relaxing tunes for unwinding',
      energy: 3,
      tempo: 80,
      genres: ['Jazz', 'Ambient', 'Folk', 'Lo-fi']
    },
    {
      id: 'romantic',
      name: 'Romantic',
      icon: <Heart className="w-6 h-6" />,
      color: 'from-pink-400 to-red-500',
      description: 'Love songs and intimate melodies',
      energy: 5,
      tempo: 90,
      genres: ['R&B', 'Soul', 'Pop', 'Jazz']
    },
    {
      id: 'focused',
      name: 'Focused',
      icon: <Sun className="w-6 h-6" />,
      color: 'from-green-400 to-blue-500',
      description: 'Concentration-enhancing music',
      energy: 4,
      tempo: 100,
      genres: ['Classical', 'Instrumental', 'Post-rock', 'Ambient']
    },
    {
      id: 'nostalgic',
      name: 'Nostalgic',
      icon: <Moon className="w-6 h-6" />,
      color: 'from-purple-400 to-indigo-500',
      description: 'Throwback hits and classic tunes',
      energy: 6,
      tempo: 110,
      genres: ['Classic Rock', 'Pop', 'Disco', 'Funk']
    },
    {
      id: 'adventurous',
      name: 'Adventurous',
      icon: <Cloud className="w-6 h-6" />,
      color: 'from-teal-400 to-green-500',
      description: 'Exploratory and experimental sounds',
      energy: 7,
      tempo: 120,
      genres: ['Alternative', 'Indie', 'World', 'Experimental']
    }
  ]

  // Generate mood-based playlist
  const generatePlaylist = async (mood: Mood) => {
    setIsGenerating(true)
    setSelectedMood(mood.id)

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Filter songs based on mood criteria
    const moodSongs = mockSongs.filter(song => {
      // Simple mood matching logic (in real app, this would be AI-powered)
      if (mood.genres.includes(song.genre || '')) {
        return true
      }
      
      // Energy level matching
      if (mood.energy >= 7 && song.duration > 300) return true // High energy = longer songs
      if (mood.energy <= 4 && song.duration < 240) return true // Low energy = shorter songs
      
      return false
    }).slice(0, 12) // Limit to 12 songs

    const totalDuration = moodSongs.reduce((sum, song) => sum + song.duration, 0)
    const avgEnergy = moodSongs.reduce((sum, song) => sum + (song.duration > 300 ? 8 : 5), 0) / moodSongs.length

    const newPlaylist: MoodPlaylist = {
      id: `playlist_${Date.now()}`,
      mood: mood.name,
      songs: moodSongs,
      duration: totalDuration,
      energy: Math.round(avgEnergy),
      createdAt: new Date().toLocaleDateString(),
      isGenerated: true
    }

    setPlaylists(prev => [newPlaylist, ...prev])
    setIsGenerating(false)
  }

  // Get time-based mood suggestion
  const getTimeBasedMood = () => {
    switch (currentTime) {
      case 'morning':
        return moods.find(m => m.id === 'energetic')
      case 'afternoon':
        return moods.find(m => m.id === 'focused')
      case 'evening':
        return moods.find(m => m.id === 'chill')
      case 'night':
        return moods.find(m => m.id === 'romantic')
      default:
        return moods.find(m => m.id === 'chill')
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const timeBasedMood = getTimeBasedMood()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Mood-Based Playlists</h2>
          <p className="text-gray-400">AI-powered playlists for every mood and moment</p>
        </div>
        
        {timeBasedMood && (
          <div className="text-right">
            <p className="text-sm text-gray-400">Perfect for now:</p>
            <button
              onClick={() => generatePlaylist(timeBasedMood)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-lg hover:from-primary-600 hover:to-purple-600 transition-all"
            >
              <Clock className="w-4 h-4" />
              <span>{timeBasedMood.name}</span>
            </button>
          </div>
        )}
      </div>

      {/* Mood Selection */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {moods.map((mood) => (
          <button
            key={mood.id}
            onClick={() => generatePlaylist(mood)}
            disabled={isGenerating}
            className={`p-4 rounded-lg border transition-all ${
              selectedMood === mood.id
                ? 'border-primary-500 bg-primary-500/20'
                : 'border-dark-600 hover:border-primary-500/50 hover:bg-dark-700'
            } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className={`w-12 h-12 bg-gradient-to-r ${mood.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
              {mood.icon}
            </div>
            <h3 className="font-medium text-white text-sm mb-1">{mood.name}</h3>
            <p className="text-xs text-gray-400 text-center leading-tight">{mood.description}</p>
          </button>
        ))}
      </div>

      {/* Generation Status */}
      {isGenerating && (
        <div className="bg-dark-800 rounded-lg p-6 border border-dark-700 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Generating Your Playlist</h3>
          <p className="text-gray-400">AI is analyzing your mood and creating the perfect music selection...</p>
        </div>
      )}

      {/* Generated Playlists */}
      {playlists.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Your Mood Playlists</h3>
          
          {playlists.map((playlist) => (
            <div key={playlist.id} className="bg-dark-800 rounded-lg p-6 border border-dark-700">
              {/* Playlist Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Music className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">{playlist.mood} Vibes</h4>
                    <p className="text-gray-400 text-sm">
                      {playlist.songs.length} songs • {formatDuration(playlist.duration)} • Energy: {playlist.energy}/10
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
                    <Play className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-dark-700 hover:bg-dark-600 text-gray-400 hover:text-white rounded-lg transition-colors">
                    <Shuffle className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-dark-700 hover:bg-dark-600 text-gray-400 hover:text-white rounded-lg transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Songs Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {playlist.songs.slice(0, 8).map((song, index) => (
                  <div key={song.id} className="bg-dark-700 rounded-lg p-3 hover:bg-dark-600 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-xs">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm truncate">{song.title}</p>
                        <p className="text-gray-400 text-xs truncate">{song.artist}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {playlist.songs.length > 8 && (
                  <div className="bg-dark-700 rounded-lg p-3 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">
                      +{playlist.songs.length - 8} more
                    </span>
                  </div>
                )}
              </div>

              {/* Playlist Footer */}
              <div className="mt-4 pt-4 border-t border-dark-600 flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span>Generated {playlist.createdAt}</span>
                  <span>•</span>
                  <span>AI-powered selection</span>
                </div>
                
                <button className="text-primary-400 hover:text-primary-300 text-sm transition-colors">
                  View all songs
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mood Insights */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <h3 className="text-lg font-semibold text-white mb-4">Mood Insights</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-white mb-2">Your Listening Patterns</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>• You prefer energetic music in the mornings</p>
              <p>• Chill vibes dominate your evening listening</p>
              <p>• Weekend playlists are more adventurous</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-white mb-2">AI Recommendations</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>• Try jazz for better focus during work</p>
              <p>• Rock music boosts your workout energy</p>
              <p>• Ambient sounds improve your sleep quality</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
