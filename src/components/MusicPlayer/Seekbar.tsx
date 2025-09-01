import React from 'react';

interface SeekbarProps {
  value: number;
  min: number;
  max: number;
  onInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setSeekTime: (time: number) => void;
  appTime: number;
}

const Seekbar: React.FC<SeekbarProps> = ({ 
  value, 
  min, 
  max, 
  onInput, 
  setSeekTime, 
  appTime 
}) => {
  const getTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center space-x-2 w-full">
      <span className="text-sm text-gray-400 w-12 text-right">
        {getTime(appTime)}
      </span>
      <input
        type="range"
        step="any"
        value={value}
        min={min}
        max={max}
        onInput={onInput}
        onChange={(e) => setSeekTime(Number(e.target.value))}
        className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
      />
      <span className="text-sm text-gray-400 w-12">
        {getTime(max)}
      </span>
    </div>
  );
};

export default Seekbar;
