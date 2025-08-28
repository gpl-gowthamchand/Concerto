'use client'

import { useEffect, useState } from 'react'
import { 
  WifiOff, 
  Music, 
  RefreshCw, 
  Home,
  Play,
  Heart,
  List,
  Settings
} from 'lucide-react'
import { SlideIn } from '../../components/PageTransition'

interface OfflineContent {
  title?: string
  artist?: string
  id?: string
}

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false)
  const [offlineContent, setOfflineContent] = useState<OfflineContent[]>([])

  useEffect(() => {
    checkOnlineStatus()
    loadOfflineContent()
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const checkOnlineStatus = () => {
    setIsOnline(navigator.onLine)
  }

  const handleOnline = () => {
    setIsOnline(true)
  }

  const handleOffline = () => {
    setIsOnline(false)
  }

  const loadOfflineContent = async () => {
    try {
      // Load cached content from IndexedDB or localStorage
      const cachedSongs = localStorage.getItem('concerto_cached_songs')
      
      if (cachedSongs) {
        const songs = JSON.parse(cachedSongs)
        setOfflineContent(songs.slice(0, 10)) // Show first 10 cached songs
      }
    } catch (error) {
      console.error('Error loading offline content:', error)
    }
  }

  const retryConnection = () => {
    window.location.reload()
  }

  const goHome = () => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl flex items-center justify-center text-3xl">
              <WifiOff className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
              You&apos;re Offline
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Don&apos;t worry! You can still enjoy your cached music and use many Concerto features offline
          </p>
        </div>

        {/* Connection Status */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${isOnline ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-lg font-medium">
                {isOnline ? 'Connection restored!' : 'No internet connection'}
              </span>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={retryConnection}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry</span>
              </button>
              
              <button
                onClick={goHome}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Go Home</span>
              </button>
            </div>
          </div>
        </div>

        {/* Offline Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <Music className="w-5 h-5 text-green-400" />
              <span>Available Offline</span>
            </h3>
            
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>Previously played music</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>Your playlists</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>Music production tools</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>App interface</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span>Settings and preferences</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
              <WifiOff className="w-5 h-5 text-red-400" />
              <span>Requires Internet</span>
            </h3>
            
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-400 rounded-full" />
                <span>New music discovery</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-400 rounded-full" />
                <span>Social features</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-400 rounded-full" />
                <span>Cloud sync</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-400 rounded-full" />
                <span>Live streaming</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-400 rounded-full" />
                <span>AI recommendations</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Offline Content */}
        {offlineContent.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Your Offline Music</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {offlineContent.map((item, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Music className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium truncate">{item.title || 'Unknown Song'}</h4>
                      <p className="text-gray-400 text-sm truncate">{item.artist || 'Unknown Artist'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2 mt-3">
                    <button className="p-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
                      <Play className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center space-x-3 p-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              <Play className="w-5 h-5" />
              <span>Continue Playing</span>
            </button>
            
            <button className="flex items-center justify-center space-x-3 p-4 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
              <List className="w-5 h-5" />
              <span>View Playlists</span>
            </button>
            
            <button className="flex items-center justify-center space-x-3 p-4 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
              <span>App Settings</span>
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">💡 Pro Tips</h3>
          
          <div className="space-y-3 text-gray-300">
            <p>• <strong>Cache your favorite music</strong> while online to enjoy it offline later</p>
            <p>• <strong>Create offline playlists</strong> before going on trips or to areas with poor connectivity</p>
            <p>• <strong>Use music production tools</strong> - they work perfectly offline!</p>
            <p>• <strong>Check your connection</strong> - Concerto will automatically sync when you&apos;re back online</p>
          </div>
        </div>

        {/* Auto-refresh when online */}
        {isOnline && (
          <SlideIn className="mt-8">
            <div className="bg-green-600/20 border border-green-500/30 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center space-x-3 mb-3">
                <div className="w-6 h-6 bg-green-400 rounded-full" />
                <span className="text-green-400 font-medium text-lg">Connection Restored!</span>
              </div>
              <p className="text-green-300 mb-4">
                You&apos;re back online! Concerto will automatically refresh in a few seconds to sync your latest music.
              </p>
              <button
                onClick={retryConnection}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-white"
              >
                Refresh Now
              </button>
            </div>
          </SlideIn>
        )}
      </div>
    </div>
  )
}
