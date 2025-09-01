import React from 'react';
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi';

interface VolumeBarProps {
  value: number;
  min: number;
  max: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setVolume: (volume: number) => void;
}

const VolumeBar: React.FC<VolumeBarProps> = ({ 
  value, 
  min, 
  max, 
  onChange, 
  setVolume 
}) => {
  return (
    <div className="flex items-center space-x-2 w-32">
      <button
        onClick={() => setVolume(value === 0 ? 0.5 : 0)}
        className="text-white hover:text-primary-400 transition-colors"
      >
        {value === 0 ? (
          <HiVolumeOff className="w-5 h-5" />
        ) : (
          <HiVolumeUp className="w-5 h-5" />
        )}
      </button>
      <input
        type="range"
        step="any"
        value={value}
        min={min}
        max={max}
        onChange={onChange}
        className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
      />
    </div>
  );
};

export default VolumeBar;
