import React from 'react';

interface TrackProps {
  isPlaying: boolean;
  isActive: boolean;
  activeSong: any;
}

const Track: React.FC<TrackProps> = ({ isPlaying, isActive, activeSong }) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <img
          src={activeSong?.image || '/placeholder-album.jpg'}
          alt={activeSong?.title || 'Track'}
          className={`w-16 h-16 rounded-lg object-cover ${
            isPlaying && isActive ? 'animate-pulse-slow' : ''
          }`}
        />
        {isPlaying && isActive && (
          <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-medium truncate">
          {activeSong?.title || 'No song selected'}
        </h3>
        <p className="text-gray-400 text-sm truncate">
          {activeSong?.artist || 'Unknown artist'}
        </p>
      </div>
    </div>
  );
};

export default Track;
