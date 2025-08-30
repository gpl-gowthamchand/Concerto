import React, { useState, useRef, useEffect } from 'react';
import { Settings, Save, RotateCcw } from 'lucide-react';
import { useAudioStore } from '../../stores/audioStore';

interface EqualizerBand {
  frequency: number;
  gain: number;
  q: number;
}

interface EqualizerPreset {
  id: string;
  name: string;
  bands: EqualizerBand[];
}

const defaultPresets: EqualizerPreset[] = [
  {
    id: 'flat',
    name: 'Flat',
    bands: Array(10).fill(0).map((_, i) => ({
      frequency: [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000][i],
      gain: 0,
      q: 1
    }))
  },
  {
    id: 'bass-boost',
    name: 'Bass Boost',
    bands: [
      { frequency: 32, gain: 6, q: 1 },
      { frequency: 64, gain: 4, q: 1 },
      { frequency: 125, gain: 2, q: 1 },
      { frequency: 250, gain: 0, q: 1 },
      { frequency: 500, gain: 0, q: 1 },
      { frequency: 1000, gain: 0, q: 1 },
      { frequency: 2000, gain: 0, q: 1 },
      { frequency: 4000, gain: 0, q: 1 },
      { frequency: 8000, gain: 0, q: 1 },
      { frequency: 16000, gain: 0, q: 1 }
    ]
  },
  {
    id: 'treble-boost',
    name: 'Treble Boost',
    bands: [
      { frequency: 32, gain: 0, q: 1 },
      { frequency: 64, gain: 0, q: 1 },
      { frequency: 125, gain: 0, q: 1 },
      { frequency: 250, gain: 0, q: 1 },
      { frequency: 500, gain: 0, q: 1 },
      { frequency: 1000, gain: 0, q: 1 },
      { frequency: 2000, gain: 2, q: 1 },
      { frequency: 4000, gain: 4, q: 1 },
      { frequency: 8000, gain: 6, q: 1 },
      { frequency: 16000, gain: 8, q: 1 }
    ]
  },
  {
    id: 'rock',
    name: 'Rock',
    bands: [
      { frequency: 32, gain: 4, q: 1 },
      { frequency: 64, gain: 6, q: 1 },
      { frequency: 125, gain: 3, q: 1 },
      { frequency: 250, gain: 0, q: 1 },
      { frequency: 500, gain: -2, q: 1 },
      { frequency: 1000, gain: 0, q: 1 },
      { frequency: 2000, gain: 3, q: 1 },
      { frequency: 4000, gain: 5, q: 1 },
      { frequency: 8000, gain: 4, q: 1 },
      { frequency: 16000, gain: 2, q: 1 }
    ]
  },
  {
    id: 'jazz',
    name: 'Jazz',
    bands: [
      { frequency: 32, gain: 2, q: 1 },
      { frequency: 64, gain: 3, q: 1 },
      { frequency: 125, gain: 4, q: 1 },
      { frequency: 250, gain: 3, q: 1 },
      { frequency: 500, gain: 2, q: 1 },
      { frequency: 1000, gain: 1, q: 1 },
      { frequency: 2000, gain: 2, q: 1 },
      { frequency: 4000, gain: 3, q: 1 },
      { frequency: 8000, gain: 2, q: 1 },
      { frequency: 16000, gain: 1, q: 1 }
    ]
  },
  {
    id: 'classical',
    name: 'Classical',
    bands: [
      { frequency: 32, gain: 0, q: 1 },
      { frequency: 64, gain: 1, q: 1 },
      { frequency: 125, gain: 2, q: 1 },
      { frequency: 250, gain: 3, q: 1 },
      { frequency: 500, gain: 2, q: 1 },
      { frequency: 1000, gain: 1, q: 1 },
      { frequency: 2000, gain: 2, q: 1 },
      { frequency: 4000, gain: 3, q: 1 },
      { frequency: 8000, gain: 2, q: 1 },
      { frequency: 16000, gain: 1, q: 1 }
    ]
  }
];

const Equalizer: React.FC = () => {
  const [bands, setBands] = useState<EqualizerBand[]>(defaultPresets[0].bands);
  const [currentPreset, setCurrentPreset] = useState<string>('flat');
  const [isEnabled, setIsEnabled] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const filtersRef = useRef<BiquadFilterNode[]>([]);

  const frequencies = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

  useEffect(() => {
    // Initialize Web Audio API
    if (typeof window !== 'undefined' && window.AudioContext) {
      audioContextRef.current = new AudioContext();
      initializeFilters();
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const initializeFilters = () => {
    if (!audioContextRef.current) return;

    filtersRef.current = frequencies.map(freq => {
      const filter = audioContextRef.current!.createBiquadFilter();
      filter.type = 'peaking';
      filter.frequency.value = freq;
      filter.Q.value = 1;
      filter.gain.value = 0;
      return filter;
    });
  };

  const applyEqualizer = (newBands: EqualizerBand[]) => {
    if (!audioContextRef.current || !isEnabled) return;

    newBands.forEach((band, index) => {
      if (filtersRef.current[index]) {
        filtersRef.current[index].gain.value = band.gain;
      }
    });
  };

  const handleBandChange = (index: number, gain: number) => {
    const newBands = [...bands];
    newBands[index].gain = gain;
    setBands(newBands);
    applyEqualizer(newBands);
  };

  const applyPreset = (preset: EqualizerPreset) => {
    setBands(preset.bands);
    setCurrentPreset(preset.id);
    if (isEnabled) {
      applyEqualizer(preset.bands);
    }
  };

  const resetToFlat = () => {
    const flatPreset = defaultPresets.find(p => p.id === 'flat');
    if (flatPreset) {
      applyPreset(flatPreset);
    }
  };

  const saveCustomPreset = () => {
    const presetName = prompt('Enter preset name:');
    if (presetName) {
      const customPreset: EqualizerPreset = {
        id: `custom-${Date.now()}`,
        name: presetName,
        bands: [...bands]
      };
      // Save to localStorage
      const savedPresets = JSON.parse(localStorage.getItem('concerto-eq-presets') || '[]');
      savedPresets.push(customPreset);
      localStorage.setItem('concerto-eq-presets', JSON.stringify(savedPresets));
    }
  };

  const toggleEqualizer = () => {
    setIsEnabled(!isEnabled);
    if (!isEnabled) {
      applyEqualizer(bands);
    } else {
      // Reset all gains to 0
      filtersRef.current.forEach(filter => {
        filter.gain.value = 0;
      });
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Equalizer</span>
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleEqualizer}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              isEnabled 
                ? 'bg-primary-600 text-white' 
                : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
            }`}
          >
            {isEnabled ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="p-2 text-dark-400 hover:text-dark-100 hover:bg-dark-700 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Presets Panel */}
      {showPresets && (
        <div className="mb-6 p-4 bg-dark-700 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-dark-300">Presets</h4>
            <div className="flex space-x-2">
              <button
                onClick={saveCustomPreset}
                className="p-1 text-primary-400 hover:text-primary-300"
                title="Save Current Settings"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={resetToFlat}
                className="p-1 text-dark-400 hover:text-dark-300"
                title="Reset to Flat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {defaultPresets.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  currentPreset === preset.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-dark-600 text-dark-300 hover:bg-dark-500 hover:text-dark-100'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Equalizer Bands */}
      <div className="flex items-end justify-between h-48 space-x-1">
        {bands.map((band, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="text-xs text-dark-400 mb-2 text-center">
              {frequencies[index] >= 1000 
                ? `${frequencies[index] / 1000}k` 
                : frequencies[index]
              }
            </div>
            <div className="relative flex-1 w-full flex items-end justify-center">
              <input
                type="range"
                min="-12"
                max="12"
                step="0.1"
                value={band.gain}
                onChange={(e) => handleBandChange(index, parseFloat(e.target.value))}
                className="w-6 h-full appearance-none bg-transparent cursor-pointer"
                style={{
                  writingMode: 'bt-lr',
                  transform: 'rotate(180deg)'
                }}
              />
              <div 
                className="absolute bottom-0 w-2 bg-gradient-to-t from-primary-400 to-primary-600 rounded-t"
                style={{ 
                  height: `${((band.gain + 12) / 24) * 100}%`,
                  minHeight: '4px'
                }}
              />
            </div>
            <div className="text-xs text-dark-400 mt-2 text-center">
              {band.gain > 0 ? `+${band.gain.toFixed(1)}` : band.gain.toFixed(1)}
            </div>
          </div>
        ))}
      </div>

      {/* Frequency Labels */}
      <div className="flex justify-between mt-4 text-xs text-dark-400">
        <span>32Hz</span>
        <span>16kHz</span>
      </div>
    </div>
  );
};

export default Equalizer;
