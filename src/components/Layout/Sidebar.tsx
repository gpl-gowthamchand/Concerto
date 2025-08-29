import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  Library, 
  User, 
  Settings, 
  BarChart3, 
  Users, 
  Download,
  Music,
  Heart,
  Clock,
  Plus
} from 'lucide-react';
import { useUserStore } from '../../stores/userStore';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useUserStore();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Search', href: '/search', icon: Search },
    { name: 'Library', href: '/library', icon: Library },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Social', href: '/social', icon: Users },
    { name: 'Offline', href: '/offline', icon: Download },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const quickActions = [
    { name: 'Create Playlist', href: '/library', icon: Plus, action: 'create-playlist' },
    { name: 'Liked Songs', href: '/library', icon: Heart, action: 'liked-songs' },
    { name: 'Recently Played', href: '/library', icon: Clock, action: 'recent' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="w-64 bg-dark-800 border-r border-dark-700 flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-2xl font-bold gradient-text">Concerto</h1>
        <p className="text-dark-400 text-sm">Your Music, Your Way</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        <div className="mb-6">
          <h3 className="text-dark-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Navigation
          </h3>
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'bg-primary-600 text-white'
                    : 'text-dark-300 hover:bg-dark-700 hover:text-dark-100'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="text-dark-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          {quickActions.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                className="flex items-center w-full px-3 py-2 text-sm font-medium text-dark-300 hover:bg-dark-700 hover:text-dark-100 rounded-lg transition-colors duration-200"
                onClick={() => {
                  // Handle quick actions
                  if (item.action === 'create-playlist') {
                    // Open create playlist modal
                    console.log('Create playlist');
                  }
                }}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </button>
            );
          })}
        </div>

        {/* User Info */}
        {user && (
          <div className="border-t border-dark-700 pt-4">
            <div className="flex items-center px-3 py-2">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-dark-100">{user.username}</p>
                <p className="text-xs text-dark-400">{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
