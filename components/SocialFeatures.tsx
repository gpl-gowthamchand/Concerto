'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { 
  Share2, 
  Heart, 
  MessageCircle, 
  Send,
  UserPlus,
  UserMinus,
  Music,
  Play
} from 'lucide-react'

interface User {
  id: string
  username: string
  avatar: string
  isFollowing: boolean
  followers: number
  following: number
  lastActive: string
  currentSong?: string
}

interface Post {
  id: string
  userId: string
  username: string
  avatar: string
  content: string
  songId?: string
  songTitle?: string
  songArtist?: string
  timestamp: string
  likes: number
  comments: number
  shares: number
  isLiked: boolean
  isShared: boolean
}

export default function SocialFeatures() {
  const { user } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [selectedTab, setSelectedTab] = useState<'feed' | 'discover' | 'following'>('feed')
  const [newPost, setNewPost] = useState('')
  const [selectedSong, setSelectedSong] = useState<string>('')

  // Mock data generation
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: 'user1',
        username: 'musiclover42',
        avatar: '🎵',
        isFollowing: true,
        followers: 1247,
        following: 89,
        lastActive: '2 hours ago',
        currentSong: 'Bohemian Rhapsody - Queen'
      },
      {
        id: 'user2',
        username: 'jazzfanatic',
        avatar: '🎷',
        isFollowing: false,
        followers: 892,
        following: 156,
        lastActive: '1 hour ago',
        currentSong: 'Take Five - Dave Brubeck'
      },
      {
        id: 'user3',
        username: 'rockstar99',
        avatar: '🎸',
        isFollowing: true,
        followers: 2156,
        following: 234,
        lastActive: '30 minutes ago',
        currentSong: 'Stairway to Heaven - Led Zeppelin'
      }
    ]

    const mockPosts: Post[] = [
      {
        id: 'post1',
        userId: 'user1',
        username: 'musiclover42',
        avatar: '🎵',
        content: 'Just discovered this amazing song! Can\'t stop listening to it. What do you think?',
        songId: 'song1',
        songTitle: 'Bohemian Rhapsody',
        songArtist: 'Queen',
        timestamp: '2 hours ago',
        likes: 24,
        comments: 8,
        shares: 3,
        isLiked: true,
        isShared: false
      },
      {
        id: 'post2',
        userId: 'user2',
        username: 'jazzfanatic',
        avatar: '🎷',
        content: 'Perfect evening for some smooth jazz. This track is pure magic!',
        songId: 'song2',
        songTitle: 'Take Five',
        songArtist: 'Dave Brubeck',
        timestamp: '4 hours ago',
        likes: 18,
        comments: 5,
        shares: 2,
        isLiked: false,
        isShared: false
      },
      {
        id: 'post3',
        userId: 'user3',
        username: 'rockstar99',
        avatar: '🎸',
        content: 'Classic rock never gets old! This is what real music sounds like.',
        songId: 'song3',
        songTitle: 'Stairway to Heaven',
        songArtist: 'Led Zeppelin',
        timestamp: '6 hours ago',
        likes: 31,
        comments: 12,
        shares: 7,
        isLiked: true,
        isShared: true
      }
    ]

    setUsers(mockUsers)
    setPosts(mockPosts)
  }, [])

  const handleFollow = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, isFollowing: !user.isFollowing }
        : user
    ))
  }

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ))
  }

  const handleShare = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isShared: !post.isShared, shares: post.isShared ? post.shares - 1 : post.shares + 1 }
        : post
    ))
  }

  const handleCreatePost = () => {
    if (!newPost.trim()) return

    const newPostObj: Post = {
      id: `post${Date.now()}`,
      userId: user?.id || 'user',
      username: user?.username || 'Anonymous',
      avatar: '🎵',
      content: newPost,
      songId: selectedSong || undefined,
      songTitle: selectedSong ? 'Selected Song' : undefined,
      songArtist: selectedSong ? 'Artist' : undefined,
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      isShared: false
    }

    setPosts(prev => [newPostObj, ...prev])
    setNewPost('')
    setSelectedSong('')
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Music Community</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Share your music journey</span>
        </div>
      </div>

      {/* Create Post */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">🎵</span>
          </div>
          <div className="flex-1">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="What are you listening to? Share your thoughts..."
              className="w-full bg-dark-700 border border-dark-600 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              rows={3}
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-3">
                <select
                  value={selectedSong}
                  onChange={(e) => setSelectedSong(e.target.value)}
                  className="px-3 py-1 bg-dark-700 border border-dark-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">No song selected</option>
                  <option value="song1">Bohemian Rhapsody - Queen</option>
                  <option value="song2">Hotel California - Eagles</option>
                  <option value="song3">Imagine - John Lennon</option>
                </select>
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <Music className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleCreatePost}
                disabled={!newPost.trim()}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Post</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-dark-700 rounded-lg p-1">
        {[
          { id: 'feed', label: 'Feed', count: posts.length },
          { id: 'discover', label: 'Discover', count: users.length },
          { id: 'following', label: 'Following', count: users.filter(u => u.isFollowing).length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as 'feed' | 'discover' | 'following')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedTab === tab.id
                ? 'bg-primary-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-dark-600'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Content */}
      {selectedTab === 'feed' && (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-dark-800 rounded-lg p-6 border border-dark-700">
              {/* Post Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{post.avatar}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-white">{post.username}</span>
                    <span className="text-gray-400 text-sm">{post.timestamp}</span>
                  </div>
                  {post.songId && (
                    <div className="flex items-center space-x-2 mt-1">
                      <Play className="w-3 h-3 text-primary-400" />
                      <span className="text-sm text-primary-400">
                        {post.songTitle} - {post.songArtist}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Post Content */}
              <p className="text-gray-300 mb-4">{post.content}</p>

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-dark-600">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-2 transition-colors ${
                      post.isLiked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                    <span className="text-sm">{formatNumber(post.likes)}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">{formatNumber(post.comments)}</span>
                  </button>
                  
                  <button
                    onClick={() => handleShare(post.id)}
                    className={`flex items-center space-x-2 transition-colors ${
                      post.isShared ? 'text-primary-400' : 'text-gray-400 hover:text-primary-400'
                    }`}
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm">{formatNumber(post.shares)}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTab === 'discover' && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div key={user.id} className="bg-dark-800 rounded-lg p-4 border border-dark-700">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white font-bold text-lg">{user.avatar}</span>
                </div>
                <div>
                  <h4 className="font-medium text-white">{user.username}</h4>
                  <p className="text-gray-400 text-sm">{formatNumber(user.followers)} followers</p>
                  <p className="text-gray-500 text-xs">{user.lastActive}</p>
                </div>
                {user.currentSong && (
                  <div className="text-xs text-primary-400 bg-primary-500/20 px-2 py-1 rounded-full">
                    🎵 {user.currentSong}
                  </div>
                )}
                <button
                  onClick={() => handleFollow(user.id)}
                  className={`w-full px-4 py-2 rounded-lg transition-colors ${
                    user.isFollowing
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-primary-600 hover:bg-primary-700 text-white'
                  }`}
                >
                  {user.isFollowing ? (
                    <>
                      <UserMinus className="w-4 h-4 inline mr-2" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 inline mr-2" />
                      Follow
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTab === 'following' && (
        <div className="space-y-4">
          {users.filter(u => u.isFollowing).map((user) => (
            <div key={user.id} className="bg-dark-800 rounded-lg p-4 border border-dark-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{user.avatar}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{user.username}</h4>
                    <p className="text-gray-400 text-sm">{formatNumber(user.followers)} followers</p>
                    {user.currentSong && (
                      <p className="text-primary-400 text-sm">🎵 {user.currentSong}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
