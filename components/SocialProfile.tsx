'use client'

import { useState, useEffect } from 'react'
import { 
  User, 
  Music, 
  Heart, 
  Users, 
  Calendar, 
  MapPin, 
  Globe, 
  Edit3, 
  Plus,
  MessageCircle,
  Clock,
  Award,
  Check,
  MoreHorizontal
} from 'lucide-react'
import { StaggeredList, StaggeredItem } from './PageTransition'

interface UserProfile {
  id: string
  username: string
  displayName: string
  bio: string
  avatar: string
  coverImage: string
  location: string
  website: string
  joinedDate: Date
  followers: number
  following: number
  totalPlays: number
  totalListeningTime: number
  favoriteGenres: string[]
  topArtists: string[]
  recentActivity: Activity[]
  playlists: Playlist[]
  isFollowing: boolean
  isVerified: boolean
  isOnline: boolean
}

interface Activity {
  id: string
  type: 'playlist_created' | 'song_liked' | 'followed_user' | 'joined_community' | 'achievement_earned'
  title: string
  description: string
  timestamp: Date
  metadata?: Record<string, unknown>
}

interface Playlist {
  id: string
  name: string
  cover: string
  songCount: number
  duration: number
  isPublic: boolean
  isCollaborative: boolean
  collaborators: string[]
}

interface SocialProfileProps {
  userId: string
  currentUserId?: string
  onPlaylistSelect: (playlist: Playlist) => void
  onFollowToggle: (userId: string, isFollowing: boolean) => void
}

export default function SocialProfile({
  userId,
  currentUserId,
  onPlaylistSelect,
  onFollowToggle
}: SocialProfileProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'playlists' | 'activity' | 'friends'>('overview')

  // Generate mock profile data
  useEffect(() => {
    const generateProfile = () => {
      const mockProfile: UserProfile = {
        id: userId,
        username: 'musiclover2024',
        displayName: 'Alex Music Explorer',
        bio: 'Passionate music enthusiast exploring sounds from around the world. Love discovering new artists and sharing musical moments with friends.',
        avatar: '🎵',
        coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
        location: 'San Francisco, CA',
        website: 'https://musicblog.alex.com',
        joinedDate: new Date('2023-01-15'),
        followers: 1247,
        following: 892,
        totalPlays: 15420,
        totalListeningTime: 864000, // 10 days in seconds
        favoriteGenres: ['Rock', 'Jazz', 'Electronic', 'Classical', 'World'],
        topArtists: ['Pink Floyd', 'Miles Davis', 'Daft Punk', 'Beethoven', 'Fela Kuti'],
        recentActivity: generateRecentActivity(),
        playlists: generateUserPlaylists(),
        isFollowing: false,
        isVerified: true,
        isOnline: true
      }
      
      setProfile(mockProfile)
      setIsLoading(false)
    }

    generateProfile()
  }, [userId])

  const generateRecentActivity = (): Activity[] => {
    const activities: Activity[] = [
      {
        id: '1',
        type: 'playlist_created',
        title: 'Created "Late Night Jazz Vibes"',
        description: 'A new playlist with 23 songs',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        id: '2',
        type: 'song_liked',
        title: 'Liked "So What" by Miles Davis',
        description: 'Added to favorites',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
      },
      {
        id: '3',
        type: 'followed_user',
        title: 'Started following @jazzcollector',
        description: 'New connection made',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
      },
      {
        id: '4',
        type: 'joined_community',
        title: 'Joined "Jazz Enthusiasts" community',
        description: 'Now part of 1.2k members',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        id: '5',
        type: 'achievement_earned',
        title: 'Earned "Jazz Master" badge',
        description: 'Listened to 100+ jazz tracks',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      }
    ]
    
    return activities
  }

  const generateUserPlaylists = (): Playlist[] => {
    return [
      {
        id: '1',
        name: 'Late Night Jazz Vibes',
        cover: '🌙',
        songCount: 23,
        duration: 5400,
        isPublic: true,
        isCollaborative: false,
        collaborators: []
      },
      {
        id: '2',
        name: 'Rock Classics',
        cover: '🎸',
        songCount: 45,
        duration: 10800,
        isPublic: true,
        isCollaborative: true,
        collaborators: ['user2', 'user3']
      },
      {
        id: '3',
        name: 'Electronic Dreams',
        cover: '⚡',
        songCount: 18,
        duration: 7200,
        isPublic: true,
        isCollaborative: false,
        collaborators: []
      },
      {
        id: '4',
        name: 'Classical Masterpieces',
        cover: '🎻',
        songCount: 32,
        duration: 14400,
        isPublic: false,
        isCollaborative: false,
        collaborators: []
      }
    ]
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'playlist_created': return '🎵'
      case 'song_liked': return '❤️'
      case 'followed_user': return '👥'
      case 'joined_community': return '🏘️'
      case 'achievement_earned': return '🏆'
      default: return '📝'
    }
  }

  const handleFollowToggle = () => {
    if (!profile) return
    
    const newIsFollowing = !profile.isFollowing
    setProfile(prev => prev ? { ...prev, isFollowing: newIsFollowing } : null)
    onFollowToggle(userId, newIsFollowing)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <User className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-300 mb-2">Loading profile...</h2>
            <p className="text-gray-500">Gathering music insights and social data</p>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) return null

  const isOwnProfile = currentUserId === userId

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-purple-900/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-end space-x-6">
            {/* Avatar */}
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-4xl md:text-6xl border-4 border-white shadow-lg">
              {profile.avatar}
            </div>
            
            {/* Profile Info */}
            <div className="flex-1 text-white">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold">{profile.displayName}</h1>
                {profile.isVerified && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                {profile.isOnline && (
                  <div className="w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                )}
              </div>
              <p className="text-lg text-gray-200 mb-2">@{profile.username}</p>
              <p className="text-gray-300 max-w-2xl">{profile.bio}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Actions */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Joined {profile.joinedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
              </div>
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 hover:text-blue-400 transition-colors">
                  <Globe className="w-4 h-4" />
                  <span>Website</span>
                </a>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {!isOwnProfile && (
                <>
                  <button
                    onClick={() => setShowMessageModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Message</span>
                  </button>
                  <button
                    onClick={handleFollowToggle}
                    className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-colors ${
                      profile.isFollowing 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {profile.isFollowing ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                </>
              )}
              
              {isOwnProfile && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
              
              <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{profile.followers.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Followers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{profile.following.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Following</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{profile.totalPlays.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Total Plays</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{formatDuration(profile.totalListeningTime)}</div>
              <div className="text-sm text-gray-400">Listening Time</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'playlists', label: 'Playlists', icon: Music },
              { id: 'activity', label: 'Activity', icon: Award },
              { id: 'friends', label: 'Friends', icon: Users }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'overview' | 'playlists' | 'activity' | 'friends')}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Favorite Genres */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-400" />
                <span>Favorite Genres</span>
              </h3>
              <div className="flex flex-wrap gap-3">
                {profile.favoriteGenres.map((genre) => (
                  <span key={genre} className="px-4 py-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-full text-sm">
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Top Artists */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-400" />
                <span>Top Artists</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profile.topArtists.map((artist, index) => (
                  <div key={artist} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="text-white font-medium">{artist}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Preview */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Clock className="w-5 h-5 text-green-400" />
                <span>Recent Activity</span>
              </h3>
              <div className="space-y-3">
                {profile.recentActivity.slice(0, 3).map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                    <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{activity.title}</div>
                      <div className="text-gray-400 text-sm">{activity.description}</div>
                    </div>
                    <div className="text-gray-500 text-sm">{formatDate(activity.timestamp)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'playlists' && (
          <StaggeredList staggerDelay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.playlists.map((playlist) => (
                <StaggeredItem key={playlist.id}>
                  <div 
                    className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-200 cursor-pointer"
                    onClick={() => onPlaylistSelect(playlist)}
                  >
                    <div className="text-center mb-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3">
                        {playlist.cover}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{playlist.name}</h3>
                      <div className="flex items-center justify-center space-x-4 text-sm text-gray-400 mb-3">
                        <span>{playlist.songCount} songs</span>
                        <span>•</span>
                        <span>{formatDuration(playlist.duration)}</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        {playlist.isCollaborative && (
                          <span className="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded-full">
                            Collaborative
                          </span>
                        )}
                        {!playlist.isPublic && (
                          <span className="px-2 py-1 bg-gray-600/20 text-gray-400 text-xs rounded-full">
                            Private
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </StaggeredItem>
              ))}
            </div>
          </StaggeredList>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-4">
            {profile.recentActivity.map((activity) => (
              <div key={activity.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1">
                    <div className="text-white font-medium text-lg">{activity.title}</div>
                    <div className="text-gray-400 mb-2">{activity.description}</div>
                    <div className="text-gray-500 text-sm">{formatDate(activity.timestamp)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'friends' && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Friends Feature Coming Soon</h3>
            <p className="text-gray-500">Connect with other music lovers and discover new friends</p>
          </div>
        )}
      </div>
    </div>
  )
}
