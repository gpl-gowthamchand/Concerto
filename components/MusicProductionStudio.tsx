'use client'

import { useState, useEffect } from 'react'
import { 
  Music, 
  Mic, 
  Users, 
  Zap,
  Sliders,
  CheckCircle
} from 'lucide-react'

interface ProductionFeature {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  status: 'active' | 'beta' | 'experimental'
  demo: React.ReactNode
}

export default function MusicProductionStudio() {
  const [activeFeature, setActiveFeature] = useState('recording')
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)


  const productionFeatures: ProductionFeature[] = [
    {
      id: 'recording',
      name: 'Multi-Track Recording',
      description: 'Professional-grade multi-track recording with real-time effects',
      icon: <Mic className="w-8 h-8" />,
      status: 'active',
      demo: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-semibold text-white">Recording Studio</h4>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-400 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-blue-100 text-sm">{isRecording ? 'Recording' : 'Ready'}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-blue-100 text-sm">Duration</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">4</div>
                <div className="text-blue-100 text-sm">Tracks</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h5 className="font-semibold text-lg">Track Controls</h5>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`p-3 rounded-lg transition-all duration-200 ${
                  isRecording
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isRecording ? 'Stop' : 'Record'}
              </button>
              <button className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-white">
                Add Track
              </button>
            </div>
            
            <div className="space-y-2">
              {['Vocals', 'Guitar', 'Bass', 'Drums'].map((track, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Music className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">{track}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-4 h-4 text-gray-400" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="80"
                      className="w-20 h-2 bg-dark-600 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'mixing',
      name: 'Advanced Mixing Console',
      description: 'Professional mixing tools with EQ, compression, and effects',
      icon: <Sliders className="w-8 h-8" />,
      status: 'active',
      demo: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-xl">
            <div className="text-center">
              <h4 className="text-xl font-bold text-white mb-2">Mixing Console</h4>
              <div className="w-24 h-24 bg-white/20 rounded-full mx-auto flex items-center justify-center">
                <Sliders className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h5 className="font-semibold text-lg">Channel Strips</h5>
            <div className="space-y-3">
              {[
                { name: 'Vocals', eq: 'High Shelf', comp: '2:1', reverb: 'Hall' },
                { name: 'Guitar', eq: 'Low Cut', comp: '4:1', reverb: 'Room' },
                { name: 'Bass', eq: 'Low Boost', comp: '3:1', reverb: 'None' },
                { name: 'Drums', eq: 'Presence', comp: '6:1', reverb: 'Plate' }
              ].map((channel, index) => (
                <div key={index} className="p-3 bg-dark-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{channel.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-blue-600 px-2 py-1 rounded">EQ: {channel.eq}</span>
                      <span className="text-xs bg-green-600 px-2 py-1 rounded">Comp: {channel.comp}</span>
                      <span className="text-xs bg-purple-600 px-2 py-1 rounded">Reverb: {channel.reverb}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <div className="text-sm text-gray-400">Gain</div>
                      <input
                        type="range"
                        min="-20"
                        max="20"
                        defaultValue="0"
                        className="w-full h-2 bg-dark-600 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-400">Pan</div>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        defaultValue="0"
                        className="w-full h-2 bg-dark-600 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-400">Fader</div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        defaultValue="80"
                        className="w-full h-2 bg-dark-600 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'mastering',
      name: 'AI-Powered Mastering',
      description: 'Automatic mastering with professional quality standards',
      icon: <Zap className="w-8 h-8" />,
      status: 'beta',
      demo: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-xl">
            <div className="text-center">
              <h4 className="text-xl font-bold text-white mb-2">AI Mastering</h4>
              <div className="w-24 h-24 bg-white/20 rounded-full mx-auto flex items-center justify-center">
                <Zap className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h5 className="font-semibold text-lg">Mastering Presets</h5>
            <div className="grid grid-cols-2 gap-3">
              {['Pop', 'Rock', 'Jazz', 'Electronic', 'Classical', 'Hip-Hop'].map((genre) => (
                <button
                  key={genre}
                  className="p-3 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors text-center"
                >
                  <div className="font-medium">{genre}</div>
                  <div className="text-xs text-gray-400">Optimized</div>
                </button>
              ))}
            </div>
            
            <div className="bg-dark-700 rounded-lg p-4">
              <h6 className="font-medium mb-3">Mastering Chain</h6>
              <div className="space-y-2">
                {[
                  'Multiband Compression',
                  'Stereo Enhancement',
                  'Loudness Maximization',
                  'Final Limiting'
                ].map((step, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'collaboration',
      name: 'Real-time Collaboration',
      description: 'Collaborate with other musicians in real-time',
      icon: <Users className="w-8 h-8" />,
      status: 'experimental',
      demo: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 rounded-xl">
            <div className="text-center">
              <h4 className="text-xl font-bold text-white mb-2">Live Collaboration</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">3</div>
                  <div className="text-orange-100 text-sm">Online</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">120ms</div>
                  <div className="text-orange-100 text-sm">Latency</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">HD</div>
                  <div className="text-orange-100 text-sm">Quality</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h5 className="font-semibold text-lg">Active Sessions</h5>
            <div className="space-y-3">
              {[
                { name: 'John (Guitar)', status: 'recording', instrument: 'Electric Guitar' },
                { name: 'Sarah (Vocals)', status: 'mixing', instrument: 'Lead Vocals' },
                { name: 'Mike (Drums)', status: 'listening', instrument: 'Drum Kit' }
              ].map((user, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-400">{user.instrument}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.status === 'recording' ? 'bg-red-600 text-white' :
                      user.status === 'mixing' ? 'bg-blue-600 text-white' :
                      'bg-green-600 text-white'
                    }`}>
                      {user.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full py-3 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors font-medium">
              Join Session
            </button>
          </div>
        </div>
      )
    }
  ]

  // Simulate recording timer
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isRecording])

  // Simulate metronome
  useEffect(() => {
    if (metronomeActive) {
      const interval = setInterval(() => {
        // In a real app, this would play a metronome sound
        console.log('Tick')
      }, (60 / currentBPM) * 1000)
      return () => clearInterval(interval)
    }
  }, [metronomeActive, currentBPM])

  return (
    <div className="min-h-screen bg-dark-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-4">
            Day 6: Professional Music Production Studio
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Industry-standard recording, mixing, and mastering tools
          </p>
        </div>

        {/* Feature Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-dark-800 rounded-lg p-1">
            {productionFeatures.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className={`px-6 py-3 rounded-md transition-all duration-200 ${
                  activeFeature === feature.id
                    ? 'bg-purple-600 text-white shadow-lg'
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
              <h2 className="text-2xl font-bold mb-4">Studio Interface</h2>
              {productionFeatures.find(f => f.id === activeFeature)?.demo}
            </div>
          </div>

          {/* Feature Details */}
          <div className="space-y-6">
            <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
              <h2 className="text-2xl font-bold mb-4">Feature Details</h2>
              {(() => {
                const feature = productionFeatures.find(f => f.id === activeFeature)
                if (!feature) return null
                
                return (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-purple-400">{feature.icon}</div>
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
                      <h4 className="font-semibold">Key Features:</h4>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li>• Professional audio quality (24-bit/96kHz)</li>
                        <li>• Real-time processing and effects</li>
                        <li>• Industry-standard plugins and tools</li>
                        <li>• Cloud-based collaboration</li>
                      </ul>
                    </div>
                    
                    <div className="pt-4 border-t border-dark-700">
                      <button className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors font-medium">
                        Open {feature.name}
                      </button>
                    </div>
                  </div>
                )
              })()}
            </div>

            {/* Studio Stats */}
            <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
              <h3 className="text-xl font-semibold mb-4">Studio Performance</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-dark-700 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400 mb-1">24/96</div>
                  <div className="text-gray-400 text-sm">Audio Quality</div>
                </div>
                <div className="text-center p-4 bg-dark-700 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400 mb-1">2ms</div>
                  <div className="text-gray-400 text-sm">Latency</div>
                </div>
                <div className="text-center p-4 bg-dark-700 rounded-lg">
                  <div className="text-2xl font-bold text-green-400 mb-1">∞</div>
                  <div className="text-gray-400 text-sm">Tracks</div>
                </div>
                <div className="text-center p-4 bg-dark-700 rounded-lg">
                  <div className="text-2xl font-bold text-orange-400 mb-1">50+</div>
                  <div className="text-gray-400 text-sm">Effects</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-12 bg-dark-800 rounded-xl p-6 border border-dark-700">
          <h3 className="text-xl font-semibold mb-6 text-center">Professional Studio Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">24-bit</div>
              <div className="text-gray-400">Audio Quality</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">96kHz</div>
              <div className="text-gray-400">Sample Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">∞</div>
              <div className="text-gray-400">Unlimited Tracks</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-400 mb-2">Real-time</div>
              <div className="text-gray-400">Processing</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
