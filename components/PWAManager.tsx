'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { 
  Download, 
  Smartphone, 
  Wifi, 
  WifiOff, 
  Bell, 
  BellOff,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react'
import { FadeIn } from './PageTransition'

interface PWAInstallPrompt {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface PWAManagerProps {
  onInstallComplete: () => void
  onNotificationPermission: (granted: boolean) => void
}

export default function PWAManager({
  onInstallComplete,
  onNotificationPermission
}: PWAManagerProps) {
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info')

  const deferredPrompt = useRef<PWAInstallPrompt | null>(null)

  // Check PWA installation status
  const checkInstallationStatus = useCallback(() => {
    if (window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as Record<string, unknown>).standalone === true) {
      setIsInstalled(true)
      setIsInstallable(false)
    }
  }, [])

  // Check online status
  const checkOnlineStatus = useCallback(() => {
    setIsOnline(navigator.onLine)
  }, [])

  // Check notification permission
  const checkNotificationPermission = useCallback(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission)
    }
  }, [])

  // Handle beforeinstallprompt event
  const handleBeforeInstallPrompt = useCallback((event: Event) => {
    event.preventDefault()
    deferredPrompt.current = event as PWAInstallPrompt
    setIsInstallable(true)
  }, [])

  // Handle appinstalled event
  const handleAppInstalled = useCallback(() => {
    setIsInstalled(true)
    setIsInstallable(false)
    deferredPrompt.current = null
    showMessage('Concerto installed successfully! 🎉', 'success')
    onInstallComplete()
  }, [onInstallComplete])

  // Handle online/offline events
  const handleOnline = useCallback(() => {
    setIsOnline(true)
    showMessage('Back online! Syncing your music...', 'success')
  }, [])

  const handleOffline = useCallback(() => {
    setIsOnline(false)
    showMessage('You\'re offline. Some features may be limited.', 'info')
  }, [])

  useEffect(() => {
    checkInstallationStatus()
    checkOnlineStatus()
    checkNotificationPermission()
    
    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    
    // Listen for appinstalled event
    window.addEventListener('appinstalled', handleAppInstalled)
    
    // Listen for online/offline events
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [checkInstallationStatus, checkOnlineStatus, checkNotificationPermission, handleBeforeInstallPrompt, handleAppInstalled, handleOnline, handleOffline])

  // Install PWA
  const installPWA = async () => {
    if (!deferredPrompt.current) return
    
    setIsLoading(true)
    
    try {
      await deferredPrompt.current.prompt()
      const { outcome } = await deferredPrompt.current.userChoice
      
      if (outcome === 'accepted') {
        showMessage('Installation started...', 'info')
      } else {
        showMessage('Installation cancelled', 'info')
      }
      
      deferredPrompt.current = null
      setIsInstallable(false)
    } catch (error) {
      console.error('Error installing PWA:', error)
      showMessage('Installation failed. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Request notification permission
  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      showMessage('Notifications not supported in this browser', 'error')
      return
    }

    try {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
      
      if (permission === 'granted') {
        showMessage('Notifications enabled! 🎉', 'success')
        onNotificationPermission(true)
      } else {
        showMessage('Notifications disabled', 'info')
        onNotificationPermission(false)
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      showMessage('Failed to enable notifications', 'error')
    }
  }

  // Show message
  const showMessage = (text: string, type: 'success' | 'error' | 'info') => {
    setMessage(text)
    setMessageType(type)
    
    setTimeout(() => {
      setMessage('')
    }, 5000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-3xl">
              <Smartphone className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              PWA Manager
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Install Concerto as a native app, manage offline features, and configure notifications
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Installation Status */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isInstalled ? 'bg-green-600' : 'bg-blue-600'
              }`}>
                {isInstalled ? <CheckCircle className="w-6 h-6" /> : <Download className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {isInstalled ? 'Installed' : 'Installable'}
                </h3>
                <p className="text-gray-400 text-sm">
                  {isInstalled ? 'App is installed' : 'Ready to install'}
                </p>
              </div>
            </div>
            
            {isInstallable && !isInstalled && (
              <button
                onClick={installPWA}
                disabled={isLoading}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors"
              >
                {isLoading ? 'Installing...' : 'Install App'}
              </button>
            )}
          </div>

          {/* Online Status */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                isOnline ? 'bg-green-600' : 'bg-red-600'
              }`}>
                {isOnline ? <Wifi className="w-6 h-6" /> : <WifiOff className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {isOnline ? 'Online' : 'Offline'}
                </h3>
                <p className="text-gray-400 text-sm">
                  {isOnline ? 'Connected to internet' : 'Working offline'}
                </p>
              </div>
            </div>
          </div>

          {/* Notification Status */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                notificationPermission === 'granted' ? 'bg-green-600' : 'bg-yellow-600'
              }`}>
                {notificationPermission === 'granted' ? <Bell className="w-6 h-6" /> : <BellOff className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {notificationPermission === 'granted' ? 'Enabled' : 'Disabled'}
                </h3>
                <p className="text-gray-400 text-sm">
                  {notificationPermission === 'granted' ? 'Notifications active' : 'Notifications off'}
                </p>
              </div>
            </div>
            
            {notificationPermission !== 'granted' && (
              <button
                onClick={requestNotificationPermission}
                className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                Enable Notifications
              </button>
            )}
          </div>
        </div>

        {/* PWA Features */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">PWA Features</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium text-white mb-3">Core Features</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Install as native app</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Offline music playback</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Push notifications</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Background sync</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-white mb-3">Advanced Features</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>App shortcuts</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>File handling</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Share target</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Protocol handlers</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <FadeIn className="fixed bottom-6 right-6 z-50">
            <div className={`px-6 py-3 rounded-lg shadow-lg ${
              messageType === 'success' ? 'bg-green-600' :
              messageType === 'error' ? 'bg-red-600' : 'bg-blue-600'
            }`}>
              <div className="flex items-center space-x-2">
                {messageType === 'success' ? <CheckCircle className="w-4 h-4" /> :
                 messageType === 'error' ? <XCircle className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                <span className="text-white">{message}</span>
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  )
}
