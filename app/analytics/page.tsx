'use client'

import { useState } from 'react'
import Header from '../../components/Header'
import MusicPlayer from '../../components/MusicPlayer'
import AudioVisualizer from '../../components/AudioVisualizer'
import Equalizer from '../../components/Equalizer'
import MusicAnalytics from '../../components/MusicAnalytics'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AnalyticsPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [currentSong, setCurrentSong] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  const handlePlay = (song: any) => {
    setCurrentSong(song)
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleNext = () => {
    // Mock next song
    console.log('Next song')
  }

  const handlePrevious = () => {
    // Mock previous song
    console.log('Previous song')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">🎵</span>
          </div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pb-32">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Music Studio</h1>
          <p className="text-gray-400">
            Advanced music controls, analytics, and audio visualization tools.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Audio Visualizer Demo */}
          <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
            <h2 className="text-xl font-semibold text-white mb-4">Audio Visualizer</h2>
            <p className="text-gray-400 mb-4">
              Real-time audio visualization with multiple display modes.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Visualization Type</label>
                <div className="flex space-x-2">
                  {['bars', 'waveform', 'spectrum'].map((type) => (
                    <button
                      key={type}
                      className="px-3 py-1 bg-dark-700 hover:bg-dark-600 text-gray-300 rounded transition-colors capitalize"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="h-32 bg-dark-700 rounded-lg p-4">
                <AudioVisualizer 
                  type="bars" 
                  height={80} 
                  color="#0ea5e9"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Equalizer */}
          <div>
            <Equalizer />
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="mb-8">
          <MusicAnalytics />
        </div>

        {/* Advanced Controls */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Crossfade Settings */}
          <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
            <h3 className="text-lg font-semibold text-white mb-4">Crossfade Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Crossfade Duration: <span className="text-primary-400">3.5s</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="0.5"
                  defaultValue="3.5"
                  className="w-full slider"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Fade In/Out: <span className="text-primary-400">Enabled</span>
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 text-primary-600 bg-dark-700 border-dark-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-gray-300">Fade In</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-4 h-4 text-primary-600 bg-dark-700 border-dark-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-gray-300">Fade Out</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Audio Quality Settings */}
          <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
            <h3 className="text-lg font-semibold text-white mb-4">Audio Quality</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sample Rate: <span className="text-primary-400">44.1 kHz</span>
                </label>
                <select className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="44.1">44.1 kHz</option>
                  <option value="48">48 kHz</option>
                  <option value="96">96 kHz</option>
                  <option value="192">192 kHz</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bit Depth: <span className="text-primary-400">24-bit</span>
                </label>
                <select className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="16">16-bit</option>
                  <option value="24">24-bit</option>
                  <option value="32">32-bit</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Audio Format: <span className="text-primary-400">Lossless</span>
                </label>
                <div className="flex space-x-2">
                  {['Lossy', 'Lossless', 'Hi-Res'].map((format) => (
                    <button
                      key={format}
                      className={`px-3 py-1 rounded transition-colors ${
                        format === 'Lossless' 
                          ? 'bg-primary-600 text-white' 
                          : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                      }`}
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Music Player */}
      <MusicPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying(!isPlaying)}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </div>
  )
}
