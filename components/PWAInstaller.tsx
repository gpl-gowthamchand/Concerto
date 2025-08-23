'use client'

import { useState, useEffect } from 'react'
import { Download, Check, X } from 'lucide-react'

// Type for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      setDeferredPrompt(promptEvent)
      setShowInstallPrompt(true)
    }

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }

    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const dismissPrompt = () => {
    setShowInstallPrompt(false)
    setDeferredPrompt(null)
  }

  if (isInstalled || !showInstallPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-dark-800 border border-dark-700 rounded-lg shadow-xl p-4 z-50">
      <div className="flex items-start space-x-3">
        <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-lg">🎵</span>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold mb-1">Install Concerto</h3>
          <p className="text-gray-400 text-sm mb-3">
            Install Concerto on your device for the best music experience. Access your music offline and get app-like performance.
          </p>
          
          <div className="flex space-x-2">
            <button
              onClick={handleInstall}
              className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              <span>Install</span>
            </button>
            
            <button
              onClick={dismissPrompt}
              className="flex items-center space-x-2 bg-dark-700 hover:bg-dark-600 text-gray-300 px-4 py-2 rounded-lg transition-colors text-sm"
            >
              <X className="w-4 h-4" />
              <span>Not Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
