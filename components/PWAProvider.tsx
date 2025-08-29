'use client'

import { useEffect, useState } from 'react'

interface PWAProviderProps {
  children: React.ReactNode
}

export function PWAProvider({ children }: React.ReactNode) {
  const [isOnline, setIsOnline] = useState(true)
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    if (typeof window !== 'undefined') {
      registerServiceWorker()
      checkOnlineStatus()
      
      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)
      
      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
      }
    }
  }, [])

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js')
        console.log('Service Worker registered successfully:', registration)
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true)
              }
            })
          }
        })
        
        // Listen for controller change (update applied)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          setUpdateAvailable(false)
          window.location.reload()
        })
        
      } catch (error) {
        console.error('Service Worker registration failed:', error)
      }
    }
  }

  const checkOnlineStatus = () => {
    setIsOnline(navigator.onLine)
  }

  const handleOnline = () => {
    setIsOnline(true)
  }

  const handleOffline = () => {
    setIsOnline(false)
  }

  const applyUpdate = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.controller?.postMessage({ type: 'SKIP_WAITING' })
    }
  }

  // Prevent hydration mismatch by not rendering PWA features until mounted
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <>
      {children}
      
      {/* Update Available Banner */}
      {updateAvailable && (
        <div className="fixed bottom-0 left-0 right-0 bg-blue-600 text-white p-4 z-50">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-bold">!</span>
              </div>
              <span>New version available. Refresh to update.</span>
            </div>
            <button
              onClick={applyUpdate}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Update Now
            </button>
          </div>
        </div>
      )}
      
      {/* Offline Indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-2 text-center z-50">
          <span className="text-sm">You&apos;re offline. Some features may not work.</span>
        </div>
      )}
    </>
  )
}
