'use client'

import { useState, useRef, useEffect } from 'react'
import { Settings, RotateCcw, Volume2 } from 'lucide-react'

interface EqualizerBand {
  frequency: number
  gain: number
  q: number
}

interface EqualizerPreset {
  name: string
  bands: EqualizerBand[]
}

export default function Equalizer() {
  const [bands, setBands] = useState<EqualizerBand[]>([
    { frequency: 60, gain: 0, q: 1 },      // Bass
    { frequency: 170, gain: 0, q: 1 },     // Low Mid
    { frequency: 310, gain: 0, q: 1 },     // Mid
    { frequency: 600, gain: 0, q: 1 },     // High Mid
    { frequency: 1000, gain: 0, q: 1 },   // Presence
    { frequency: 3000, gain: 0, q: 1 },   // Brilliance
    { frequency: 6000, gain: 0, q: 1 },   // High
    { frequency: 12000, gain: 0, q: 1 },  // Very High
    { frequency: 14000, gain: 0, q: 1 },  // Ultra High
    { frequency: 16000, gain: 0, q: 1 }   // Air
  ])

  const [isEnabled, setIsEnabled] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<string>('Custom')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const presets: EqualizerPreset[] = [
    {
      name: 'Flat',
      bands: bands.map(band => ({ ...band, gain: 0 }))
    },
    {
      name: 'Bass Boost',
      bands: bands.map(band => {
        if (band.frequency <= 170) return { ...band, gain: 6 }
        if (band.frequency <= 310) return { ...band, gain: 3 }
        return { ...band, gain: 0 }
      })
    },
    {
      name: 'Treble Boost',
      bands: bands.map(band => {
        if (band.frequency >= 3000) return { ...band, gain: 6 }
        if (band.frequency >= 1000) return { ...band, gain: 3 }
        return { ...band, gain: 0 }
      })
    },
    {
      name: 'Rock',
      bands: bands.map(band => {
        if (band.frequency <= 170) return { ...band, gain: 4 }
        if (band.frequency <= 310) return { ...band, gain: 2 }
        if (band.frequency >= 3000) return { ...band, gain: 4 }
        if (band.frequency >= 1000) return { ...band, gain: 2 }
        return { ...band, gain: -1 }
      })
    },
    {
      name: 'Jazz',
      bands: bands.map(band => {
        if (band.frequency <= 170) return { ...band, gain: 3 }
        if (band.frequency <= 600) return { ...band, gain: 2 }
        if (band.frequency >= 3000) return { ...band, gain: 3 }
        return { ...band, gain: 0 }
      })
    },
    {
      name: 'Classical',
      bands: bands.map(band => {
        if (band.frequency <= 170) return { ...band, gain: 2 }
        if (band.frequency <= 600) return { ...band, gain: 1 }
        if (band.frequency >= 3000) return { ...band, gain: 2 }
        return { ...band, gain: 0 }
      })
    },
    {
      name: 'Pop',
      bands: bands.map(band => {
        if (band.frequency <= 170) return { ...band, gain: 3 }
        if (band.frequency <= 310) return { ...band, gain: 1 }
        if (band.frequency >= 3000) return { ...band, gain: 3 }
        if (band.frequency >= 1000) return { ...band, gain: 1 }
        return { ...band, gain: 0 }
      })
    }
  ]

  const handleBandChange = (index: number, gain: number) => {
    const newBands = [...bands]
    newBands[index].gain = gain
    setBands(newBands)
    setSelectedPreset('Custom')
  }

  const handlePresetChange = (presetName: string) => {
    const preset = presets.find(p => p.name === presetName)
    if (preset) {
      setBands(preset.bands)
      setSelectedPreset(presetName)
    }
  }

  const resetToFlat = () => {
    const flatBands = bands.map(band => ({ ...band, gain: 0 }))
    setBands(flatBands)
    setSelectedPreset('Flat')
  }

  const formatFrequency = (freq: number) => {
    if (freq >= 1000) {
      return `${(freq / 1000).toFixed(1)}k`
    }
    return freq.toString()
  }

  const getGainColor = (gain: number) => {
    if (gain > 0) return 'text-green-400'
    if (gain < 0) return 'text-red-400'
    return 'text-gray-400'
  }

  return (
    <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Volume2 className="w-6 h-6 text-primary-400" />
          <h3 className="text-xl font-semibold text-white">Equalizer</h3>
        </div>
        
        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={(e) => setIsEnabled(e.target.checked)}
              className="w-4 h-4 text-primary-600 bg-dark-700 border-dark-600 rounded focus:ring-primary-500"
            />
            <span className="text-gray-300 text-sm">Enable</span>
          </label>
          
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Preset
        </label>
        <select
          value={selectedPreset}
          onChange={(e) => handlePresetChange(e.target.value)}
          className="w-full px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {presets.map(preset => (
            <option key={preset.name} value={preset.name}>
              {preset.name}
            </option>
          ))}
        </select>
      </div>

      {/* Equalizer Bands */}
      <div className="grid grid-cols-10 gap-2 mb-6">
        {bands.map((band, index) => (
          <div key={index} className="flex flex-col items-center space-y-2">
            {/* Frequency Label */}
            <span className="text-xs text-gray-400 text-center">
              {formatFrequency(band.frequency)}
            </span>
            
            {/* Vertical Slider */}
            <div className="relative h-32 w-8">
              <input
                type="range"
                min="-12"
                max="12"
                step="0.5"
                value={band.gain}
                onChange={(e) => handleBandChange(index, parseFloat(e.target.value))}
                className="slider-vertical w-8 h-32 appearance-none bg-dark-600 rounded-lg cursor-pointer"
                style={{
                  writingMode: 'vertical-rl' as 'vertical-rl',
                  WebkitAppearance: 'slider-vertical'
                }}
              />
              
              {/* Gain Value */}
              <span className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium ${getGainColor(band.gain)}`}>
                {band.gain > 0 ? '+' : ''}{band.gain}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={resetToFlat}
          className="flex items-center space-x-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-gray-300 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
        
        <div className="text-sm text-gray-400">
          {isEnabled ? 'Equalizer Active' : 'Equalizer Disabled'}
        </div>
      </div>

      {/* Advanced Settings */}
      {showAdvanced && (
        <div className="mt-6 pt-6 border-t border-dark-600">
          <h4 className="text-lg font-medium text-white mb-4">Advanced Settings</h4>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Preamp Gain
              </label>
              <input
                type="range"
                min="-20"
                max="20"
                step="1"
                defaultValue="0"
                className="w-full slider"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Q Factor
              </label>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                defaultValue="1"
                className="w-full slider"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
