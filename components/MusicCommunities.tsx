'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Plus, 
  Search, 
  Star,
  Globe,
  Lock
} from 'lucide-react'
import { FadeIn, StaggeredList, StaggeredItem } from './PageTransition'

interface Community {
  id: string
  name: string
  description: string
  cover: string
  genre: string
  memberCount: number
  isPublic: boolean
  isJoined: boolean
  isModerator: boolean
  createdAt: Date
  lastActivity: Date
  rules: string[]
  featuredPlaylists: Playlist[]
  recentDiscussions: Discussion[]
  moderators: string[]
  tags: string[]
}

interface Playlist {
  id: string
  name: string
  cover: string
  songCount: number
  duration: number
  createdBy: string
  likes: number
}

interface Discussion {
  id: string
  title: string
  content: string
  author: string
  authorAvatar: string
  timestamp: Date
  replies: number
  likes: number
  isPinned: boolean
  tags: string[]
}

interface MusicCommunitiesProps {
  onCommunitySelect: (community: Community) => void
  onPlaylistSelect: (playlist: Playlist) => void
  onDiscussionSelect: (discussion: Discussion) => void
}

export default function MusicCommunities({
  onCommunitySelect,
  onPlaylistSelect,
  onDiscussionSelect
}: MusicCommunitiesProps) {
  const [communities, setCommunities] = useState<Community[]>([])
  const [selectedGenre, setSelectedGenre] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'popular' | 'recent' | 'name'>('popular')
  const [isLoading, setIsLoading] = useState(true)

  // Generate mock communities
  useEffect(() => {
    const generateCommunities = () => {
      const mockCommunities: Community[] = [
        {
          id: '1',
          name: 'Jazz Enthusiasts',
          description: 'A community for jazz lovers to discuss, discover, and share the best jazz music from all eras.',
          cover: '🎷',
          genre: 'Jazz',
          memberCount: 1247,
          isPublic: true,
          isJoined: true,
          isModerator: false,
          createdAt: new Date('2023-03-15'),
          lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
          rules: ['Be respectful', 'No spam', 'Stay on topic'],
          featuredPlaylists: generateFeaturedPlaylists('Jazz'),
          recentDiscussions: generateRecentDiscussions('Jazz'),
          moderators: ['admin1', 'jazzmaster'],
          tags: ['jazz', 'improvisation', 'swing', 'bebop']
        },
        {
          id: '2',
          name: 'Rock Legends',
          description: 'Celebrating the greatest rock bands and discussing classic rock music from the 60s to today.',
          cover: '🎸',
          genre: 'Rock',
          memberCount: 2156,
          isPublic: true,
          isJoined: false,
          isModerator: false,
          createdAt: new Date('2023-01-20'),
          lastActivity: new Date(Date.now() - 1 * 60 * 60 * 1000),
          rules: ['Respect all rock subgenres', 'No trolling', 'Share your favorites'],
          featuredPlaylists: generateFeaturedPlaylists('Rock'),
          recentDiscussions: generateRecentDiscussions('Rock'),
          moderators: ['admin1', 'rockfan'],
          tags: ['rock', 'classic', 'guitar', 'drums']
        },
        {
          id: '3',
          name: 'Electronic Beats',
          description: 'Exploring electronic music, from ambient to techno, house to dubstep.',
          cover: '⚡',
          genre: 'Electronic',
          memberCount: 892,
          isPublic: true,
          isJoined: true,
          isModerator: true,
          createdAt: new Date('2023-05-10'),
          lastActivity: new Date(Date.now() - 30 * 60 * 1000),
          rules: ['Innovation welcome', 'Share your tracks', 'Be constructive'],
          featuredPlaylists: generateFeaturedPlaylists('Electronic'),
          recentDiscussions: generateRecentDiscussions('Electronic'),
          moderators: ['admin1', 'electrohead'],
          tags: ['electronic', 'synth', 'beats', 'ambient']
        },
        {
          id: '4',
          name: 'Classical Masters',
          description: 'Dedicated to classical music appreciation, from Baroque to Contemporary.',
          cover: '🎻',
          genre: 'Classical',
          memberCount: 567,
          isPublic: true,
          isJoined: false,
          isModerator: false,
          createdAt: new Date('2023-02-28'),
          lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000),
          rules: ['Respect all periods', 'Share knowledge', 'No elitism'],
          featuredPlaylists: generateFeaturedPlaylists('Classical'),
          recentDiscussions: generateRecentDiscussions('Classical'),
          moderators: ['admin1', 'classicalfan'],
          tags: ['classical', 'orchestra', 'symphony', 'chamber']
        },
        {
          id: '5',
          name: 'Hip Hop Culture',
          description: 'Celebrating hip hop music, culture, and the art of the MC.',
          cover: '🎤',
          genre: 'Hip Hop',
          memberCount: 1345,
          isPublic: true,
          isJoined: false,
          isModerator: false,
          createdAt: new Date('2023-04-05'),
          lastActivity: new Date(Date.now() - 3 * 60 * 60 * 1000),
          rules: ['Respect the culture', 'No hate speech', 'Share your flow'],
          featuredPlaylists: generateFeaturedPlaylists('Hip Hop'),
          recentDiscussions: generateRecentDiscussions('Hip Hop'),
          moderators: ['admin1', 'hiphophead'],
          tags: ['hiphop', 'rap', 'beats', 'culture']
        }
      ]
      
      setCommunities(mockCommunities)
      setIsLoading(false)
    }

    generateCommunities()
  }, [])

  const generateFeaturedPlaylists = (genre: string): Playlist[] => {
    const genreSongs = mockSongs.filter(song => song.genre === genre)
    return [
      {
        id: `playlist-${genre}-1`,
        name: `Best of ${genre}`,
        cover: '🎵',
        songCount: genreSongs.length,
        duration: genreSongs.reduce((acc, song) => acc + song.duration, 0),
        createdBy: 'community',
        likes: Math.floor(Math.random() * 100) + 50
      },
      {
        id: `playlist-${genre}-2`,
        name: `${genre} Essentials`,
        cover: '⭐',
        songCount: Math.min(genreSongs.length, 20),
        duration: genreSongs.slice(0, 20).reduce((acc, song) => acc + song.duration, 0),
        createdBy: 'moderator',
        likes: Math.floor(Math.random() * 100) + 30
      }
    ]
  }

  const generateRecentDiscussions = (genre: string): Discussion[] => {
    const discussions: Discussion[] = [
      {
        id: `discussion-${genre}-1`,
        title: `What's your favorite ${genre} album of all time?`,
        content: `I'm curious to hear what everyone considers the definitive ${genre} album. Share your thoughts and maybe we'll discover some hidden gems!`,
        author: `${genre}Fan2024`,
        authorAvatar: '👤',
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        replies: Math.floor(Math.random() * 50) + 10,
        likes: Math.floor(Math.random() * 100) + 20,
        isPinned: false,
        tags: [genre.toLowerCase(), 'discussion', 'albums']
      },
      {
        id: `discussion-${genre}-2`,
        title: `New ${genre} releases this week`,
        content: `Let's discuss the latest ${genre} releases and share our first impressions. What's caught your ear?`,
        author: `${genre}News`,
        authorAvatar: '📰',
        timestamp: new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000),
        replies: Math.floor(Math.random() * 30) + 5,
        likes: Math.floor(Math.random() * 80) + 15,
        isPinned: true,
        tags: [genre.toLowerCase(), 'new-releases', 'discussion']
      }
    ]
    
    return discussions
  }

  // Filter and sort communities
  const filteredCommunities = communities
    .filter(community => {
      if (selectedGenre !== 'all' && community.genre !== selectedGenre) return false
      if (searchQuery && !community.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
          !community.description.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.memberCount - a.memberCount
        case 'recent':
          return b.lastActivity.getTime() - a.lastActivity.getTime()
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  // Handle community join/leave
  const handleCommunityToggle = (communityId: string) => {
    setCommunities(prev => prev.map(community => 
      community.id === communityId 
        ? { ...community, isJoined: !community.isJoined }
        : community
    ))
  }

  // Format member count
  const formatMemberCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  // Format relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Users className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-300 mb-2">Loading communities...</h2>
            <p className="text-gray-500">Discovering music communities and discussions</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center text-3xl">
              <Users className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Music Communities
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Join music communities, share your passion, and discover new sounds with fellow music lovers
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
                placeholder="Search communities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-800 text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Genres</option>
              <option value="Jazz">Jazz</option>
              <option value="Rock">Rock</option>
              <option value="Electronic">Electronic</option>
              <option value="Classical">Classical</option>
              <option value="Hip Hop">Hip Hop</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'popular' | 'recent' | 'name')}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="popular">Most Popular</option>
              <option value="recent">Most Recent</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Community</span>
            </button>
          </div>
        </div>

        {/* Communities Grid */}
        <StaggeredList staggerDelay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCommunities.map((community) => (
              <StaggeredItem key={community.id}>
                <div className="bg-gray-800 rounded-xl border border-gray-700 hover:border-green-500 transition-all duration-200 overflow-hidden">
                  {/* Header */}
                  <div className="p-6 border-b border-gray-700">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center text-3xl">
                          {community.cover}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-xl font-semibold text-white">{community.name}</h3>
                            {community.isPublic ? (
                              <Globe className="w-4 h-4 text-green-400" />
                            ) : (
                              <Lock className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <p className="text-gray-400 text-sm">{community.genre}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-yellow-400 mb-1">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium">{formatMemberCount(community.memberCount)}</span>
                        </div>
                        <div className="text-xs text-gray-500">members</div>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-4">{community.description}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {community.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>Created {community.createdAt.toLocaleDateString()}</span>
                      <span>Last active {formatRelativeTime(community.lastActivity)}</span>
                    </div>
                  </div>

                  {/* Featured Content */}
                  <div className="p-6">
                    {/* Featured Playlists */}
                    <div className="mb-6">
                      <h4 className="text-lg font-medium text-white mb-3">Featured Playlists</h4>
                      <div className="space-y-2">
                        {community.featuredPlaylists.map((playlist) => (
                          <div
                            key={playlist.id}
                            className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                            onClick={() => onPlaylistSelect(playlist)}
                          >
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              {playlist.cover}
                            </div>
                            <div className="flex-1">
                              <div className="text-white font-medium">{playlist.name}</div>
                              <div className="text-gray-400 text-sm">{playlist.songCount} songs</div>
                            </div>
                            <div className="text-right">
                              <div className="text-white text-sm">{playlist.likes} ❤️</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Discussions */}
                    <div className="mb-6">
                      <h4 className="text-lg font-medium text-white mb-3">Recent Discussions</h4>
                      <div className="space-y-2">
                        {community.recentDiscussions.map((discussion) => (
                          <div
                            key={discussion.id}
                            className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                            onClick={() => onDiscussionSelect(discussion)}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm">
                                {discussion.authorAvatar}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h5 className="text-white font-medium truncate">{discussion.title}</h5>
                                  {discussion.isPinned && (
                                    <span className="px-2 py-1 bg-yellow-600/20 text-yellow-400 text-xs rounded-full">
                                      Pinned
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-400 text-sm line-clamp-2">{discussion.content}</p>
                                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                  <span>by {discussion.author}</span>
                                  <span>{discussion.replies} replies</span>
                                  <span>{discussion.likes} likes</span>
                                  <span>{formatRelativeTime(discussion.timestamp)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {community.isModerator && (
                          <span className="px-3 py-1 bg-purple-600/20 text-purple-400 text-sm rounded-full border border-purple-500/30">
                            Moderator
                          </span>
                        )}
                        {community.isJoined && (
                          <span className="px-3 py-1 bg-green-600/20 text-green-400 text-sm rounded-full border border-green-500/30">
                            Member
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleCommunityToggle(community.id)}
                          className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                            community.isJoined
                              ? 'bg-gray-700 hover:bg-gray-600 text-white'
                              : 'bg-green-600 hover:bg-green-700 text-white'
                          }`}
                        >
                          {community.isJoined ? 'Leave' : 'Join'}
                        </button>
                        
                        <button
                          onClick={() => onCommunitySelect(community)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </StaggeredItem>
            ))}
          </div>
        </StaggeredList>

        {/* Empty State */}
        {filteredCommunities.length === 0 && (
          <FadeIn className="text-center py-16">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No communities found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or create a new community</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              Create Your First Community
            </button>
          </FadeIn>
        )}
      </div>
    </div>
  )
}
