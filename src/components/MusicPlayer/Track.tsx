import React from 'react';
import { Song } from '../../redux/features/playerSlice';

interface TrackProps {
  isActive: boolean;
  isPlaying: boolean;
  song: Song;
}

const Track: React.FC<TrackProps> = React.memo(({ isActive, isPlaying, song }) => {
  return (
    <div className="flex items-center">
      <div className="relative w-12 h-12 mr-3">
        <img
          src={song.image}
          alt={song.title}
          className="w-full h-full object-cover rounded-lg"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/48x48/6366f1/ffffff?text=🎵';
          }}
        />
        {isActive && isPlaying && (
          <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
      
      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-medium text-gray-900 truncate">
          {song.title}
        </h4>
        <p className="text-xs text-gray-500 truncate">
          {song.artist}
        </p>
      </div>
    </div>
  );
});

Track.displayName = 'Track';

export default Track;
