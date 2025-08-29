import React, { useState, useEffect } from 'react';
import { Users, Heart, Share2, MessageCircle, UserPlus, Music, Activity, Globe, Lock, Settings, Clock } from 'lucide-react';
import { Track, User, SocialActivity } from '../types';

const Social: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [friends, setFriends] = useState<User[]>([]);
  const [socialFeed, setSocialFeed] = useState<SocialActivity[]>([]);
  const [activeTab, setActiveTab] = useState<'feed' | 'friends' | 'profile'>('feed');

  useEffect(() => {
    loadSocialData();
  }, []);

  const loadSocialData = () => {
    // Mock data
    const mockUser: User = {
      id: 'user-1',
      username: 'musiclover',
      email: 'user@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=musiclover',
      bio: 'Passionate about discovering new music and sharing great finds with friends.',
      preferences: {
        theme: 'dark',
        language: 'en',
        audioQuality: 'high',
        autoplay: true,
        crossfade: true,
        equalizer: {
          enabled: false,
          presets: [],
          custom: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          currentPreset: ''
        },
        notifications: {
          newReleases: true,
          playlistUpdates: true,
          friendActivity: true,
          recommendations: true,
          pushNotifications: true
        },
        privacy: {
          profileVisibility: 'public',
          showListeningHistory: true,
          showCurrentTrack: true,
          allowFriendRequests: true
        }
      },
      stats: {
        totalListeningTime: 2847,
        totalTracks: 1247,
        totalPlaylists: 23,
        favoriteGenres: ['Pop', 'Rock', 'Electronic', 'Jazz'],
        topArtists: ['The Weeknd', 'Drake', 'Taylor Swift'],
        listeningStreak: 15,
        lastActive: new Date()
      },
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date()
    };

    setCurrentUser(mockUser);
    setFriends([]);
    setSocialFeed([]);
  };

  const renderSocialFeed = () => (
    <div className="space-y-6">
      <div className="bg-dark-800 rounded-xl p-6 text-center">
        <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Social Feed</h3>
        <p className="text-gray-400">Connect with friends to see their music activity</p>
      </div>
    </div>
  );

  const renderFriends = () => (
    <div className="space-y-6">
      <div className="bg-dark-800 rounded-xl p-6 text-center">
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Friends</h3>
        <p className="text-gray-400">Find and connect with other music lovers</p>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      {currentUser && (
        <>
          <div className="bg-dark-800 rounded-xl p-8 text-center">
            <img
              src={currentUser.avatar || 'https://via.placeholder.com/150x150'}
              alt={currentUser.username}
              className="w-32 h-32 rounded-full mx-auto mb-6"
            />
            <h2 className="text-3xl font-bold text-white mb-2">{currentUser.username}</h2>
            <p className="text-gray-400 mb-4">{currentUser.bio}</p>
            
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div>
                <p className="text-2xl font-bold text-white">{currentUser.stats.totalPlaylists}</p>
                <span className="text-gray-400">Playlists</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{currentUser.stats.totalTracks}</p>
                <span className="text-gray-400">Tracks</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{currentUser.stats.listeningStreak}</p>
                <span className="text-gray-400">Day Streak</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-dark-800 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Listening</p>
                  <p className="text-xl font-bold text-white">
                    {Math.floor(currentUser.stats.totalListeningTime / 60)}h
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-dark-800 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Top Artists</p>
                  <p className="text-xl font-bold text-white">{currentUser.stats.topArtists.length}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Social Music</h1>
        <p className="text-gray-400">Connect with friends and share your music journey</p>
      </div>

      <div className="flex space-x-1 bg-dark-800 rounded-lg p-1">
        {[
          { id: 'feed', label: 'Social Feed', icon: Activity },
          { id: 'friends', label: 'Friends', icon: Users },
          { id: 'profile', label: 'Profile', icon: Settings }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
              activeTab === id
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-dark-700'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'feed' && renderSocialFeed()}
      {activeTab === 'friends' && renderFriends()}
      {activeTab === 'profile' && renderProfile()}
    </div>
  );
};

export default Social;
