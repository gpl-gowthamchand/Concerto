import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User, LogOut, Settings, Moon, Sun } from 'lucide-react';
import { useUserStore } from '../../stores/userStore';
import { useAudioStore } from '../../stores/audioStore';
import VoiceSearch from '../Search/VoiceSearch';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useUserStore();
  const { currentTrack } = useAudioStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    // Toggle theme logic would go here
    console.log('Toggle theme');
  };

  return (
    <header className="bg-dark-800 border-b border-dark-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Search */}
        <div className="flex-1 max-w-2xl">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for songs, artists, albums, or playlists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowVoiceSearch(!showVoiceSearch)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-400 hover:text-primary-400 transition-colors duration-200"
                title="Voice Search"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </form>
          
          {/* Voice Search Modal */}
          {showVoiceSearch && (
            <VoiceSearch onClose={() => setShowVoiceSearch(false)} />
          )}
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-4">
          {/* Current Track Info */}
          {currentTrack && (
            <div className="hidden md:flex items-center space-x-3 px-4 py-2 bg-dark-700 rounded-lg">
              <img
                src={currentTrack.artwork || '/default-artwork.png'}
                alt={currentTrack.title}
                className="w-8 h-8 rounded-md object-cover"
              />
              <div className="text-sm">
                <p className="text-dark-100 font-medium truncate max-w-32">
                  {currentTrack.title}
                </p>
                <p className="text-dark-400 truncate max-w-32">
                  {currentTrack.artist}
                </p>
              </div>
            </div>
          )}

          {/* Notifications */}
          <button className="p-2 text-dark-400 hover:text-dark-100 hover:bg-dark-700 rounded-lg transition-colors duration-200">
            <Bell className="h-5 w-5" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-dark-400 hover:text-dark-100 hover:bg-dark-700 rounded-lg transition-colors duration-200"
            title="Toggle Theme"
          >
            <Moon className="h-5 w-5" />
          </button>

          {/* User Menu */}
          <div className="relative group">
            <button className="flex items-center space-x-2 p-2 text-dark-400 hover:text-dark-100 hover:bg-dark-700 rounded-lg transition-colors duration-200">
              <User className="h-5 w-5" />
              <span className="hidden md:block text-sm font-medium">
                {user?.username || 'User'}
              </span>
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-dark-800 border border-dark-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-2">
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center w-full px-4 py-2 text-sm text-dark-300 hover:bg-dark-700 hover:text-dark-100 transition-colors duration-200"
                >
                  <User className="mr-3 h-4 w-4" />
                  Profile
                </button>
                <button
                  onClick={() => navigate('/settings')}
                  className="flex items-center w-full px-4 py-2 text-sm text-dark-300 hover:bg-dark-700 hover:text-dark-100 transition-colors duration-200"
                >
                  <Settings className="mr-3 h-4 w-4" />
                  Settings
                </button>
                <hr className="border-dark-700 my-2" />
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-dark-700 hover:text-red-300 transition-colors duration-200"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
