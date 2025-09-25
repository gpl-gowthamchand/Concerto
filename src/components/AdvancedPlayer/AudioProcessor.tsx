import React from 'react';

interface AudioProcessorProps {
  audioNormalization: boolean;
  skipSilence: boolean;
  tempo: number;
  pitch: number;
  onAudioNormalizationChange: (enabled: boolean) => void;
  onSkipSilenceChange: (enabled: boolean) => void;
  onTempoChange: (tempo: number) => void;
  onPitchChange: (pitch: number) => void;
  onProcess: () => void;
  isProcessing: boolean;
}

const AudioProcessor: React.FC<AudioProcessorProps> = ({
  audioNormalization,
  skipSilence,
  tempo,
  pitch,
  onAudioNormalizationChange,
  onSkipSilenceChange,
  onTempoChange,
  onPitchChange,
  onProcess,
  isProcessing,
}) => {
  const handleTempoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    onTempoChange(value);
  };

  const handlePitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    onPitchChange(value);
  };

  const resetTempo = () => onTempoChange(1.0);
  const resetPitch = () => onPitchChange(0);

  return (
    <div className="space-y-4">
      <h4 className="text-white font-medium">Audio Processing</h4>
      
      {/* Audio Normalization */}
      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={audioNormalization}
            onChange={(e) => onAudioNormalizationChange(e.target.checked)}
            className="rounded"
          />
          <span className="text-gray-300 text-sm">Audio Normalization</span>
        </label>
        <p className="text-gray-500 text-xs">
          Automatically adjust volume levels for consistent playback
        </p>
      </div>

      {/* Skip Silence */}
      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={skipSilence}
            onChange={(e) => onSkipSilenceChange(e.target.checked)}
            className="rounded"
          />
          <span className="text-gray-300 text-sm">Skip Silence</span>
        </label>
        <p className="text-gray-500 text-xs">
          Automatically skip silent parts in songs
        </p>
      </div>

      {/* Tempo Control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-gray-300 text-sm">Tempo</label>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-xs">{tempo.toFixed(1)}x</span>
            <button
              onClick={resetTempo}
              className="text-gray-400 hover:text-white text-xs transition-colors"
              title="Reset tempo"
            >
              Reset
            </button>
          </div>
        </div>
        <input
          type="range"
          min="0.5"
          max="2.0"
          step="0.1"
          value={tempo}
          onChange={handleTempoChange}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-gray-500 text-xs">
          <span>0.5x</span>
          <span>1.0x</span>
          <span>2.0x</span>
        </div>
      </div>

      {/* Pitch Control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-gray-300 text-sm">Pitch</label>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-xs">
              {pitch > 0 ? '+' : ''}{pitch.toFixed(1)} semitones
            </span>
            <button
              onClick={resetPitch}
              className="text-gray-400 hover:text-white text-xs transition-colors"
              title="Reset pitch"
            >
              Reset
            </button>
          </div>
        </div>
        <input
          type="range"
          min="-12"
          max="12"
          step="1"
          value={pitch}
          onChange={handlePitchChange}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-gray-500 text-xs">
          <span>-12</span>
          <span>0</span>
          <span>+12</span>
        </div>
      </div>

      {/* Process Button */}
      <button
        onClick={onProcess}
        disabled={isProcessing}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isProcessing ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Processing...</span>
          </div>
        ) : (
          'Apply Audio Processing'
        )}
      </button>

      {/* Processing Info */}
      <div className="text-gray-500 text-xs">
        <p>• Audio processing may take a few seconds</p>
        <p>• Changes apply to the current song</p>
        <p>• Processing is done in real-time</p>
      </div>
    </div>
  );
};

export default AudioProcessor;
