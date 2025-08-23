'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Smartphone, 
  Hand, 
  Move, 
  ZoomIn, 
  RotateCcw, 
  Zap,
  Wifi,
  Battery,
  Signal,
  Volume2,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Heart,
  Share2,
  Download,
  MoreHorizontal
} from 'lucide-react'

interface TouchGesture {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  demo: React.ReactNode
}

export default function MobileOptimizations() {
  const [isMobile, setIsMobile] = useState(false)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)
  const [swipeDirection, setSwipeDirection] = useState<string>('')
  const [pinchScale, setPinchScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [shakeCount, setShakeCount] = useState(0)
  const [batteryLevel, setBatteryLevel] = useState(85)
  const [signalStrength, setSignalStrength] = useState(4)
  const [wifiStrength, setWifiStrength] = useState(3)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Touch gesture handling
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return
    
    const currentTouch = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    }
    
    setTouchEnd(currentTouch)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distanceX = touchStart.x - touchEnd.x
    const distanceY = touchStart.y - touchEnd.y
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY)
    const minSwipeDistance = 50

    if (isHorizontalSwipe && Math.abs(distanceX) > minSwipeDistance) {
      if (distanceX > 0) {
        setSwipeDirection('Left')
      } else {
        setSwipeDirection('Right')
      }
    } else if (!isHorizontalSwipe && Math.abs(distanceY) > minSwipeDistance) {
      if (distanceY > 0) {
        setSwipeDirection('Up')
      } else {
        setSwipeDirection('Down')
      }
    }

    // Reset after showing direction
    setTimeout(() => setSwipeDirection(''), 1000)
    setTouchStart(null)
    setTouchEnd(null)
  }

  // Pinch to zoom simulation
  const handlePinch = (direction: 'in' | 'out') => {
    if (direction === 'in') {
      setPinchScale(prev => Math.min(prev + 0.1, 2))
    } else {
      setPinchScale(prev => Math.max(prev - 0.1, 0.5))
    }
  }

  // Rotation simulation
  const handleRotate = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setRotation(prev => prev - 15)
    } else {
      setRotation(prev => prev + 15)
    }
  }

  // Shake detection simulation
  const handleShake = () => {
    setShakeCount(prev => prev + 1)
  }

  // Battery and signal simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel(prev => Math.max(prev - 0.1, 0))
      setSignalStrength(prev => Math.random() > 0.7 ? Math.max(prev - 1, 1) : prev)
      setWifiStrength(prev => Math.random() > 0.8 ? Math.max(prev - 1, 1) : prev)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const touchGestures: TouchGesture[] = [
    {
      id: 'swipe',
      name: 'Swipe Navigation',
      description: 'Swipe left/right to change songs, up/down for volume',
              icon: <Move className="w-8 h-8" />,
      demo: (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">Swipe in any direction</p>
            {swipeDirection && (
              <div className="text-primary-400 font-semibold animate-pulse">
                Swiped {swipeDirection}!
              </div>
            )}
          </div>
          <div 
            className="w-32 h-32 bg-gradient-to-br from-primary-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto cursor-pointer select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Hand className="w-12 h-12 text-white" />
          </div>
        </div>
      )
    },
    {
      id: 'pinch',
      name: 'Pinch to Zoom',
      description: 'Pinch in/out to adjust album art size and zoom levels',
              icon: <ZoomIn className="w-8 h-8" />,
      demo: (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">Scale: {pinchScale.toFixed(1)}x</p>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => handlePinch('out')}
              className="p-3 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
            >
                              <ZoomIn className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={() => handlePinch('in')}
              className="p-3 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
            >
                              <ZoomIn className="w-6 h-6 text-white rotate-180" />
            </button>
          </div>
          <div 
            className="w-32 h-32 bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto transition-transform duration-300"
            style={{ transform: `scale(${pinchScale})` }}
          >
            <span className="text-white font-bold text-2xl">🎵</span>
          </div>
        </div>
      )
    },
    {
      id: 'rotate',
      name: 'Rotate Gesture',
      description: 'Rotate to adjust equalizer settings and audio effects',
              icon: <RotateCcw className="w-8 h-8" />,
      demo: (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">Rotation: {rotation}°</p>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => handleRotate('left')}
              className="p-3 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
            >
                              <RotateCcw className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={() => handleRotate('right')}
              className="p-3 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
            >
                              <RotateCcw className="w-6 h-6 text-white scale-x-[-1]" />
            </button>
          </div>
          <div 
            className="w-32 h-32 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl flex items-center justify-center mx-auto transition-transform duration-300"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <span className="text-white font-bold text-2xl">🎛️</span>
          </div>
        </div>
      )
    },
    {
      id: 'shake',
      name: 'Shake to Shuffle',
      description: 'Shake your device to shuffle the current playlist',
              icon: <Zap className="w-8 h-8" />,
      demo: (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">Shakes detected: {shakeCount}</p>
          </div>
          <button
            onClick={handleShake}
            className="w-32 h-32 bg-gradient-to-br from-red-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto transition-transform duration-200 hover:scale-105 active:scale-95"
          >
                            <Zap className="w-12 h-12 text-white" />
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Mobile Optimizations
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Touch gestures, responsive design, and mobile-specific features that make Concerto feel native on every device.
        </p>
      </div>

      {/* Device Status Bar */}
      <div className="bg-dark-800 rounded-xl border border-dark-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Signal className="w-4 h-4 text-green-400" />
              <span className="text-white text-sm">{signalStrength}/5</span>
            </div>
            <div className="flex items-center space-x-2">
              <Wifi className="w-4 h-4 text-blue-400" />
              <span className="text-white text-sm">{wifiStrength}/4</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Battery className="w-4 h-4 text-green-400" />
              <span className="text-white text-sm">{batteryLevel.toFixed(0)}%</span>
            </div>
            <div className="text-white text-sm">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>

      {/* Touch Gestures Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {touchGestures.map((gesture) => (
          <div key={gesture.id} className="bg-dark-800 rounded-xl border border-dark-700 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center">
                {gesture.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{gesture.name}</h3>
                <p className="text-gray-400 text-sm">{gesture.description}</p>
              </div>
            </div>
            
            <div className="bg-dark-700 rounded-lg p-4">
              {gesture.demo}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Music Player */}
      <div className="bg-dark-800 rounded-xl border border-dark-700 p-8">
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Mobile Music Player</h3>
        
        <div className="max-w-sm mx-auto space-y-6">
          {/* Album Art with Touch */}
          <div className="relative group">
            <div className="w-48 h-48 mx-auto bg-gradient-to-br from-primary-600 to-purple-600 rounded-3xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-2xl">
              <span className="text-white font-bold text-4xl">🎵</span>
            </div>
            
            {/* Touch Indicators */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
              <div className="absolute bottom-4 left-4 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
          </div>
          
          {/* Song Info */}
          <div className="text-center space-y-2">
            <h4 className="text-xl font-semibold text-white">Touch to Play</h4>
            <p className="text-gray-400">Swipe for controls • Pinch to zoom</p>
          </div>
          
          {/* Touch Controls */}
          <div className="grid grid-cols-3 gap-4">
            <button className="p-4 bg-dark-700 hover:bg-dark-600 rounded-2xl transition-all duration-200 active:scale-95">
              <SkipBack className="w-6 h-6 text-white mx-auto" />
            </button>
            
            <button className="p-4 bg-gradient-to-r from-primary-500 to-purple-500 rounded-2xl transition-all duration-200 active:scale-95 shadow-lg">
              <Play className="w-8 h-8 text-white mx-auto ml-1" />
            </button>
            
            <button className="p-4 bg-dark-700 hover:bg-dark-600 rounded-2xl transition-all duration-200 active:scale-95">
              <SkipForward className="w-6 h-6 text-white mx-auto" />
            </button>
          </div>
          
          {/* Quick Actions */}
          <div className="flex justify-center space-x-4">
            <button className="p-3 bg-dark-700 hover:bg-dark-600 rounded-xl transition-all duration-200 active:scale-95">
              <Heart className="w-5 h-5 text-red-400" />
            </button>
            <button className="p-3 bg-dark-700 hover:bg-dark-600 rounded-xl transition-all duration-200 active:scale-95">
              <Share2 className="w-5 h-5 text-blue-400" />
            </button>
            <button className="p-3 bg-dark-700 hover:bg-dark-600 rounded-xl transition-all duration-200 active:scale-95">
              <Download className="w-5 h-5 text-green-400" />
            </button>
            <button className="p-3 bg-dark-700 hover:bg-dark-600 rounded-xl transition-all duration-200 active:scale-95">
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: <Smartphone className="w-8 h-8" />,
            title: 'Responsive Design',
            description: 'Adapts perfectly to any screen size and orientation'
          },
          {
            icon: <Hand className="w-8 h-8" />,
            title: 'Touch Optimized',
            description: 'Large touch targets and intuitive gesture controls'
          },
          {
            icon: <Wifi className="w-8 h-8" />,
            title: 'Offline Support',
            description: 'Download music for offline listening anywhere'
          }
        ].map((feature, index) => (
          <div
            key={feature.title}
            className="bg-dark-800 rounded-xl border border-dark-700 p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="text-white">
                {feature.icon}
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-gray-400 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Mobile Tips */}
      <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">💡 Mobile Tips</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-400">
          <div className="space-y-2">
            <p>• <strong>Double tap</strong> to like a song</p>
            <p>• <strong>Long press</strong> for song options</p>
            <p>• <strong>Two finger swipe</strong> to adjust volume</p>
          </div>
          <div className="space-y-2">
            <p>• <strong>Shake device</strong> to shuffle playlist</p>
            <p>• <strong>Pinch album art</strong> to zoom in/out</p>
            <p>• <strong>Rotate device</strong> for landscape mode</p>
          </div>
        </div>
      </div>
    </div>
  )
}
