'use client'

import { useState, useEffect } from 'react'
import { 
  RotateCcw, 
  Sliders
} from 'lucide-react'

interface AudioEffect {
  id: string
  name: string
  type: 'equalizer' | 'reverb' | 'spatial' | 'compression' | 'distortion'
  enabled: boolean
  parameters: Record<string, number>
  presets: string[]
  currentPreset: string
}

interface AdvancedAudioEffectsProps {
  onEffectChange: (effect: AudioEffect) => void
  onPresetSave: (effect: AudioEffect, presetName: string) => void
  onPresetLoad: (effect: AudioEffect, presetName: string) => void
}

export default function AdvancedAudioEffects({
  onEffectChange
}: AdvancedAudioEffectsProps) {
  const [effects, setEffects] = useState<AudioEffect[]>([])
  const [selectedEffect, setSelectedEffect] = useState<string>('equalizer')

  // Initialize audio effects
  useEffect(() => {
    const initializeEffects = () => {
      const initialEffects: AudioEffect[] = [
        {
          id: 'equalizer',
          name: 'Equalizer',
          type: 'equalizer',
          enabled: true,
          parameters: {
            '32Hz': 0,
            '64Hz': 0,
            '125Hz': 0,
            '250Hz': 0,
            '500Hz': 0,
            '1kHz': 0,
            '2kHz': 0,
            '4kHz': 0,
            '8kHz': 0,
            '16kHz': 0
          },
          presets: ['Flat', 'Bass Boost', 'Treble Boost', 'Vocal Boost', 'Rock', 'Jazz', 'Classical'],
          currentPreset: 'Flat'
        },
        {
          id: 'reverb',
          name: 'Reverb',
          type: 'reverb',
          enabled: false,
          parameters: {
            'Room Size': 0.5,
            'Damping': 0.5,
            'Wet Level': 0.3,
            'Dry Level': 0.7,
            'Width': 0.5,
            'Freeze': 0
          },
          presets: ['None', 'Small Room', 'Large Hall', 'Cathedral', 'Plate', 'Spring'],
          currentPreset: 'None'
        }
      ]
      
      setEffects(initialEffects)
    }

    initializeEffects()
  }, [])

  // Handle parameter changes
  const handleParameterChange = (effectId: string, parameter: string, value: number) => {
    setEffects(prev => prev.map(effect => {
      if (effect.id === effectId) {
        const updatedEffect = {
          ...effect,
          parameters: {
            ...effect.parameters,
            [parameter]: value
          }
        }
        
        onEffectChange(updatedEffect)
        return updatedEffect
      }
      return effect
    }))
  }

  // Load preset
  const loadPreset = (effect: AudioEffect, presetName: string) => {
    const presetValues = getPresetValues(effect.type, presetName)
    if (presetValues) {
      setEffects(prev => prev.map(e => {
        if (e.id === effect.id) {
          const updatedEffect = {
            ...e,
            parameters: presetValues,
            currentPreset: presetName
          }
          onEffectChange(updatedEffect)
          return updatedEffect
        }
        return e
      }))
    }
  }

  // Get preset values
  const getPresetValues = (type: string, preset: string): Record<string, number> | null => {
    const presets: Record<string, Record<string, Record<string, number>>> = {
      equalizer: {
        'Flat': { '32Hz': 0, '64Hz': 0, '125Hz': 0, '250Hz': 0, '500Hz': 0, '1kHz': 0, '2kHz': 0, '4kHz': 0, '8kHz': 0, '16kHz': 0 },
        'Bass Boost': { '32Hz': 6, '64Hz': 4, '125Hz': 2, '250Hz': 0, '500Hz': 0, '1kHz': 0, '2kHz': 0, '4kHz': 0, '8kHz': 0, '16kHz': 0 },
        'Treble Boost': { '32Hz': 0, '64Hz': 0, '125Hz': 0, '250Hz': 0, '500Hz': 0, '1kHz': 0, '2kHz': 2, '4kHz': 4, '8kHz': 6, '16kHz': 8 }
      }
    }
    
    return presets[type]?.[preset] || null
  }

  // Toggle effect
  const toggleEffect = (effectId: string) => {
    setEffects(prev => prev.map(effect => {
      if (effect.id === effectId) {
        const updatedEffect = { ...effect, enabled: !effect.enabled }
        onEffectChange(updatedEffect)
        return updatedEffect
      }
      return effect
    }))
  }

  // Reset effect to default
  const resetEffect = (effectId: string) => {
    setEffects(prev => prev.map(effect => {
      if (effect.id === effectId) {
        const defaultValues = getPresetValues(effect.type, 'None') || effect.parameters
        const updatedEffect = {
          ...effect,
          parameters: defaultValues,
          currentPreset: 'None'
        }
        onEffectChange(updatedEffect)
        return updatedEffect
      }
      return effect
    }))
  }

  // Format parameter value
  const formatParameterValue = (parameter: string, value: number) => {
    if (parameter.includes('Hz') || parameter.includes('k')) {
      return `${value > 0 ? '+' : ''}${value}dB`
    }
    return value.toFixed(2)
  }

  const currentEffect = effects.find(e => e.id === selectedEffect)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-3xl">
              <Sliders className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Advanced Audio Effects
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Professional-grade audio processing with real-time effects and customizable presets
          </p>
        </div>

        {/* Effects Navigation */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          {effects.map((effect) => (
            <button
              key={effect.id}
              onClick={() => setSelectedEffect(effect.id)}
              className={`px-6 py-3 rounded-lg transition-all duration-200 ${
                selectedEffect === effect.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {effect.name}
            </button>
          ))}
        </div>

        {/* Selected Effect */}
        {currentEffect && (
          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-white mb-2">{currentEffect.name}</h3>
                <p className="text-gray-400">Customize your audio with professional-grade {currentEffect.name.toLowerCase()} controls</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentEffect.enabled}
                    onChange={() => toggleEffect(currentEffect.id)}
                    className="w-4 h-4 text-purple-500 focus:ring-purple-500 rounded"
                  />
                  <span className="text-white">Enable</span>
                </label>
                
                <button
                  onClick={() => resetEffect(currentEffect.id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Presets */}
            <div className="mb-8">
              <h4 className="text-lg font-medium text-white mb-4">Presets</h4>
              <div className="flex flex-wrap gap-2">
                {currentEffect.presets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => loadPreset(currentEffect, preset)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentEffect.currentPreset === preset
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Effect Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(currentEffect.parameters).map(([parameter, value]) => (
                <div key={parameter} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300">{parameter}</label>
                    <span className="text-sm text-gray-400 font-mono">
                      {formatParameterValue(parameter, value)}
                    </span>
                  </div>
                  
                  <input
                    type="range"
                    min={getParameterRange(parameter).min}
                    max={getParameterRange(parameter).max}
                    step={getParameterRange(parameter).step}
                    value={value}
                    onChange={(e) => handleParameterChange(currentEffect.id, parameter, parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{getParameterRange(parameter).min}</span>
                    <span>{getParameterRange(parameter).max}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Visual Representation */}
            {currentEffect.type === 'equalizer' && (
              <div className="mt-8">
                <h4 className="text-lg font-medium text-white mb-4">Frequency Response</h4>
                <div className="bg-gray-700 rounded-lg p-6">
                  <div className="flex items-end justify-between h-32 space-x-1">
                    {Object.entries(currentEffect.parameters).map(([freq, value]) => (
                      <div key={freq} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-gradient-to-b from-purple-500 to-pink-600 rounded-t transition-all duration-300"
                          style={{ 
                            height: `${((value + 12) / 24) * 100}%`,
                            minHeight: '4px'
                          }}
                        />
                        <span className="text-xs text-gray-400 mt-2">{freq}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Helper function to get parameter ranges
function getParameterRange(parameter: string): { min: number; max: number; step: number } {
  if (parameter.includes('Hz') || parameter.includes('k')) {
    return { min: -12, max: 12, step: 0.1 }
  }
  return { min: 0, max: 1, step: 0.01 }
}
