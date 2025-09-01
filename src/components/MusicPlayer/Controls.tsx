import React from 'react';
import { 
  HiPlay, 
  HiPause, 
  HiChevronLeft, 
  HiChevronRight,
  HiRefresh,
  HiSwitchHorizontal
} from 'react-icons/hi';

interface ControlsProps {
  isPlaying: boolean;
  repeat: boolean;
  setRepeat: (repeat: boolean) => void;
  shuffle: boolean;
  setShuffle: (shuffle: boolean) => void;
  currentSongs: any[];
  handlePlayPause: () => void;
  handlePrevSong: () => void;
  handleNextSong: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  repeat,
  setRepeat,
  shuffle,
  setShuffle,
  currentSongs,
  handlePlayPause,
  handlePrevSong,
  handleNextSong,
}) => {
  return (
    <div className="flex items-center justify-center space-x-6">
      <button
        onClick={() => setRepeat(!repeat)}
        className={`transition-colors ${repeat ? 'text-primary-400' : 'text-gray-400 hover:text-white'}`}
      >
        <HiRefresh className="w-5 h-5" />
      </button>

      {currentSongs?.length > 0 && (
        <button
          onClick={handlePrevSong}
          className="text-white hover:text-primary-400 transition-colors"
        >
          <HiChevronLeft className="w-6 h-6" />
        </button>
      )}

      <button
        onClick={handlePlayPause}
        className="bg-primary-500 hover:bg-primary-600 text-white rounded-full p-3 transition-colors"
      >
        {isPlaying ? (
          <HiPause className="w-6 h-6" />
        ) : (
          <HiPlay className="w-6 h-6" />
        )}
      </button>

      {currentSongs?.length > 0 && (
        <button
          onClick={handleNextSong}
          className="text-white hover:text-primary-400 transition-colors"
        >
          <HiChevronRight className="w-6 h-6" />
        </button>
      )}

      <button
        onClick={() => setShuffle(!shuffle)}
        className={`transition-colors ${shuffle ? 'text-primary-400' : 'text-gray-400 hover:text-white'}`}
      >
        <HiSwitchHorizontal className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Controls;
