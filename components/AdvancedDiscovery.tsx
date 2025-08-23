'use client'

import { useState, useEffect, useCallback } from 'react'
import { 
  Brain, 
  Sparkles, 
  Music, 
  Headphones, 
  Mic, 
  Radio,
  Disc3,
  ListMusic,
  Search,
  Heart,
  Share2,
  Download,
  Star,
  TrendingUp,
  Users,
  Clock,
  Calendar,
  BarChart3,
  Palette,
  Smartphone,
  Monitor,
  Tablet,
  Zap,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Shuffle,
  Repeat,
  Settings,
  Target,
  Lightbulb,
  Cpu,
  Database,
  Globe,
  Shield,
  Filter,
  Sliders,
  Activity,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  RefreshCw,
  GitBranch,
  Code,
  Package,
  Rocket,
  Terminal,
  Layers,
  GitPullRequest,
  GitCommit,
  GitMerge
} from 'lucide-react'

interface DiscoveryFeature {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  status: 'active' | 'beta' | 'experimental'
  demo: React.ReactNode
}

export default function AdvancedDiscovery() {
  const [activeFeature, setActiveFeature] = useState('ai-recommendations')
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentMood, setCurrentMood] = useState('energetic')
  const [aiConfidence, setAiConfidence] = useState(94)
  const [processingTime, setProcessingTime] = useState(0)

  const discoveryFeatures: DiscoveryFeature[] = [
    {
      id: 'ai-recommendations',
      name: 'AI Music Recommendations',
      description: 'Advanced machine learning algorithms analyze your listening patterns',
      icon: <Brain className="w-8 h-8" />,
      status: 'active',
      demo: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-semibold text-white">AI Analysis</h4>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-100 text-sm">Active</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">{aiConfidence}%</div>
                <div className="text-purple-100 text-sm">Confidence</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">{processingTime}ms</div>
                <div className="text-purple-100 text-sm">Response</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h5 className="font-semibold text-lg">Recent Discoveries</h5>
            <div className="space-y-3">
              {[
                { title: 'Midnight City', artist: 'M83', confidence: 98, genre: 'Electronic' },
                { title: 'Take Me Out', artist: 'Franz Ferdinand', confidence: 95, genre: 'Indie Rock' },
                { title: 'Feel Good Inc.', artist: 'Gorillaz', confidence: 92, genre: 'Alternative' }
              ].map((song, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Music className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">{song.title}</div>
                      <div className="text-sm text-gray-400">{song.artist} • {song.genre}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-400">{song.confidence}%</div>
                    <div className="text-xs text-gray-500">AI Match</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'mood-detection',
      name: 'Real-time Mood Detection',
      description: 'AI analyzes your current mood and suggests perfect music',
      icon: <Target className="w-8 h-8" />,
      status: 'beta',
      demo: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-pink-600 to-red-600 p-6 rounded-xl">
            <div className="text-center">
              <h4 className="text-2xl font-bold text-white mb-2 capitalize">{currentMood}</h4>
              <div className="w-24 h-24 bg-white/20 rounded-full mx-auto flex items-center justify-center">
                <Target className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h5 className="font-semibold text-lg">Mood-Based Suggestions</h5>
            <div className="grid grid-cols-2 gap-3">
              {['energetic', 'calm', 'focused', 'romantic'].map((mood) => (
                <button
                  key={mood}
                  onClick={() => setCurrentMood(mood)}
                  className={`p-3 rounded-lg transition-all duration-200 ${
                    currentMood === mood
                      ? 'bg-blue-600 text-white'
                      : 'bg-dark-700 hover:bg-dark-600 text-gray-300'
                  }`}
                >
                  <div className="capitalize">{mood}</div>
                </button>
              ))}
            </div>
            
            <div className="bg-dark-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Mood Confidence</span>
                <span className="text-sm text-blue-400">87%</span>
              </div>
              <div className="w-full bg-dark-600 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'voice-control',
      name: 'Voice-Controlled Music',
      description: 'Control your music with natural voice commands',
      icon: <Mic className="w-8 h-8" />,
      status: 'experimental',
      demo: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-xl">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/20 rounded-full mx-auto flex items-center justify-center mb-4">
                <Mic className="w-10 h-10 text-white" />
              </div>
              <button
                onClick={() => setIsProcessing(!isProcessing)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  isProcessing
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-white hover:bg-gray-100 text-green-600'
                }`}
              >
                {isProcessing ? 'Stop Listening' : 'Start Voice Control'}
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            <h5 className="font-semibold text-lg">Voice Commands</h5>
            <div className="space-y-2">
              {[
                'Play my favorite songs',
                'Skip to next track',
                'Turn up the volume',
                'Create a workout playlist',
                'What song is this?'
              ].map((command, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-dark-700 rounded-lg">
                  <Mic className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-300">{command}</span>
                </div>
              ))}
            </div>
            
            {isProcessing && (
              <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-400 text-sm">Listening for voice commands...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      id: 'collaborative-filtering',
      name: 'Collaborative Filtering',
      description: 'Learn from millions of users to find your perfect music',
      icon: <Users className="w-8 h-8" />,
      status: 'active',
      demo: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-600 to-yellow-600 p-6 rounded-xl">
            <div className="text-center">
              <h4 className="text-xl font-bold text-white mb-2">Community Insights</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">2.4M</div>
                  <div className="text-orange-100 text-sm">Users</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">15.7M</div>
                  <div className="text-orange-100 text-sm">Songs</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">89%</div>
                  <div className="text-orange-100 text-sm">Accuracy</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h5 className="font-semibold text-lg">Similar Users</h5>
            <div className="space-y-3">
              {[
                { name: 'MusicLover42', similarity: 94, shared: 47 },
                { name: 'RockFan2024', similarity: 89, shared: 32 },
                { name: 'JazzEnthusiast', similarity: 87, shared: 28 }
              ].map((user, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-400">{user.shared} shared songs</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-orange-400">{user.similarity}%</div>
                    <div className="text-xs text-gray-500">Similar</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }
  ]

  // Simulate AI processing
  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setProcessingTime(prev => prev + 50)
      }, 50)
      return () => clearInterval(interval)
    } else {
      setProcessingTime(0)
    }
  }, [isProcessing])

  return (
    <div className="min-h-screen bg-dark-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-4">
            Day 6: Advanced Music Discovery Engine
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Cutting-edge artificial intelligence powers your music experience
          </p>
        </div>

        {/* Feature Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-dark-800 rounded-lg p-1">
            {discoveryFeatures.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className={`px-6 py-3 rounded-md transition-all duration-200 ${
                  activeFeature === feature.id
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-dark-700'
                }`}
              >
                {feature.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Feature Demo */}
          <div className="space-y-6">
            <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
              <h2 className="text-2xl font-bold mb-4">Feature Demo</h2>
              {discoveryFeatures.find(f => f.id === activeFeature)?.demo}
            </div>
          </div>

          {/* Feature Details */}
          <div className="space-y-6">
            <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
              <h2 className="text-2xl font-bold mb-4">Feature Details</h2>
              {(() => {
                const feature = discoveryFeatures.find(f => f.id === activeFeature)
                if (!feature) return null
                
                return (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-green-400">{feature.icon}</div>
                      <div>
                        <h3 className="text-xl font-semibold">{feature.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          feature.status === 'active' ? 'bg-green-600 text-white' :
                          feature.status === 'beta' ? 'bg-yellow-600 text-white' :
                          'bg-blue-600 text-white'
                        }`}>
                          {feature.status === 'active' ? 'Production Ready' :
                           feature.status === 'beta' ? 'Beta Testing' : 'Experimental'}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-400">{feature.description}</p>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold">How it works:</h4>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li>• Advanced machine learning algorithms</li>
                        <li>• Real-time data processing</li>
                        <li>• Continuous learning and improvement</li>
                        <li>• Privacy-focused user data handling</li>
                      </ul>
                    </div>
                    
                    <div className="pt-4 border-t border-dark-700">
                      <button className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors font-medium">
                        Try {feature.name}
                      </button>
                    </div>
                  </div>
                )
              })()}
            </div>

            {/* AI Stats */}
            <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
              <h3 className="text-xl font-semibold mb-4">AI Performance Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-dark-700 rounded-lg">
                  <div className="text-2xl font-bold text-green-400 mb-1">99.2%</div>
                  <div className="text-gray-400 text-sm">Accuracy</div>
                </div>
                <div className="text-center p-4 bg-dark-700 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400 mb-1">47ms</div>
                  <div className="text-gray-400 text-sm">Avg Response</div>
                </div>
                <div className="text-center p-4 bg-dark-700 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400 mb-1">2.1M</div>
                  <div className="text-gray-400 text-sm">Models Trained</div>
                </div>
                <div className="text-center p-4 bg-dark-700 rounded-lg">
                  <div className="text-2xl font-bold text-orange-400 mb-1">24/7</div>
                  <div className="text-gray-400 text-sm">Learning</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-12 bg-dark-800 rounded-xl p-6 border border-dark-700">
          <h3 className="text-xl font-semibold mb-6 text-center">AI Music Revolution</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">15M+</div>
              <div className="text-gray-400">Songs Analyzed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">2.4M+</div>
              <div className="text-gray-400">Happy Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">99.9%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-400 mb-2">24/7</div>
              <div className="text-gray-400">AI Learning</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
