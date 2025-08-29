import React, { useState, useEffect } from 'react';
import { User, Settings, Heart, Clock, Music, Download, Bell, Shield, Palette, Globe } from 'lucide-react';
import { useUserStore } from '../stores/userStore';
import { User as UserType, UserPreferences } from '../types';

const Profile: React.FC = () => {
  const { user, updateProfile } = useUserStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'privacy' | 'notifications'>('profile');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    theme: 'dark' as 'light' | 'dark' | 'auto',
    language: 'en',
    audioQuality: 'high' as 'low' | 'medium' | 'high',
    autoplay: true,
    crossfade: false,
    gaplessPlayback: true
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        bio: user.bio || '',
        theme: user.preferences.theme,
        language: user.preferences.language,
        audioQuality: user.preferences.audioQuality,
        autoplay: user.preferences.autoplay,
        crossfade: user.preferences.crossfade,
        gaplessPlayback: user.preferences.gaplessPlayback
      });
    }
  }, [user]);

  const handleSave = () => {
    if (user) {
      const updatedUser: UserType = {
        ...user,
        username: formData.username,
        bio: formData.bio,
        preferences: {
          theme: user.preferences.theme,
          language: user.preferences.language,
          audioQuality: user.preferences.audioQuality,
          autoplay: user.preferences.autoplay,
          crossfade: user.preferences.crossfade
        }
      };
              updateProfile(updatedUser);
      setEditing(false);
    }
  };

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="bg-dark-800 rounded-xl p-8 text-center">
        <img
          src={user?.avatar || 'https://via.placeholder.com/150x150'}
          alt={user?.username}
          className="w-32 h-32 rounded-full mx-auto mb-6"
        />
        
        {editing ? (
          <div className="space-y-4 max-w-md mx-auto">
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white text-center text-xl font-bold"
            />
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              rows={3}
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 text-white text-center resize-none"
            />
            <div className="flex space-x-3">
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">{user?.username}</h2>
            <p className="text-gray-400 mb-4">{user?.bio || 'No bio yet'}</p>
            <button
              onClick={() => setEditing(true)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-dark-800 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Listening</p>
              <p className="text-2xl font-bold text-white">
                {Math.floor((user?.stats.totalListeningTime || 0) / 60)}h
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
              <p className="text-gray-400 text-sm">Tracks Liked</p>
              <p className="text-2xl font-bold text-white">{user?.stats.totalTracks || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-800 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Playlists</p>
              <p className="text-2xl font-bold text-white">{user?.stats.totalPlaylists || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-800 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Downloads</p>
              <p className="text-2xl font-bold text-white">12</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-6">
      <div className="bg-dark-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
          <Palette className="w-5 h-5" />
          <span>Appearance</span>
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
            <select
              value={formData.theme}
              onChange={(e) => setFormData({ ...formData, theme: e.target.value as any })}
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
            <select
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-dark-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
          <Music className="w-5 h-5" />
          <span>Audio Settings</span>
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Audio Quality</label>
            <select
              value={formData.audioQuality}
              onChange={(e) => setFormData({ ...formData, audioQuality: e.target.value as any })}
              className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="low">Low (96 kbps)</option>
              <option value="medium">Medium (192 kbps)</option>
              <option value="high">High (320 kbps)</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.autoplay}
                onChange={(e) => setFormData({ ...formData, autoplay: e.target.checked })}
                className="w-4 h-4 text-blue-600 bg-dark-700 border-dark-600 rounded focus:ring-blue-500"
              />
              <span className="text-white">Autoplay next track</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.crossfade}
                onChange={(e) => setFormData({ ...formData, crossfade: e.target.checked })}
                className="w-4 h-4 text-blue-600 bg-dark-700 border-dark-600 rounded focus:ring-blue-500"
              />
              <span className="text-white">Crossfade between tracks</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.gaplessPlayback}
                onChange={(e) => setFormData({ ...formData, gaplessPlayback: e.target.checked })}
                className="w-4 h-4 text-blue-600 bg-dark-700 border-dark-600 rounded focus:ring-blue-500"
              />
              <span className="text-white">Gapless playback</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="space-y-6">
      <div className="bg-dark-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
          <Shield className="w-5 h-5" />
          <span>Privacy Settings</span>
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Profile Visibility</label>
            <select className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white">
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-blue-600 bg-dark-700 border-dark-600 rounded focus:ring-blue-500"
              />
              <span className="text-white">Show listening history</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-blue-600 bg-dark-700 border-dark-600 rounded focus:ring-blue-500"
              />
              <span className="text-white">Show current track</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-blue-600 bg-dark-700 border-dark-600 rounded focus:ring-blue-500"
              />
              <span className="text-white">Allow friend requests</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="bg-dark-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
          <Bell className="w-5 h-5" />
          <span>Notification Preferences</span>
        </h3>
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-blue-600 bg-dark-700 border-dark-600 rounded focus:ring-blue-500"
              />
              <span className="text-white">New releases from followed artists</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-blue-600 bg-dark-700 border-dark-600 rounded focus:ring-blue-500"
              />
              <span className="text-white">Playlist updates</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-blue-600 bg-dark-700 border-dark-600 rounded focus:ring-blue-500"
              />
              <span className="text-white">Friend activity</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-blue-600 bg-dark-700 border-dark-600 rounded focus:ring-blue-500"
              />
              <span className="text-white">Personalized recommendations</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-blue-600 bg-dark-700 border-dark-600 rounded focus:ring-blue-500"
              />
              <span className="text-white">Push notifications</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Profile & Settings</h1>
        <p className="text-gray-400">Manage your account and customize your experience</p>
      </div>

      <div className="flex space-x-1 bg-dark-800 rounded-lg p-1">
        {[
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'preferences', label: 'Preferences', icon: Settings },
          { id: 'privacy', label: 'Privacy', icon: Shield },
          { id: 'notifications', label: 'Notifications', icon: Bell }
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

      {activeTab === 'profile' && renderProfile()}
      {activeTab === 'preferences' && renderPreferences()}
      {activeTab === 'privacy' && renderPrivacy()}
      {activeTab === 'notifications' && renderNotifications()}
    </div>
  );
};

export default Profile;
