import React from 'react';
import { useAppDispatch } from '../redux/hooks';
import { setActiveSong, playPause } from '../redux/features/playerSlice';
import { Song } from '../redux/features/playerSlice';

interface SongCardProps {
  song: Song;
  data: Song[];
  i: number;
}

const SongCard: React.FC<SongCardProps> = ({ song, data, i }) => {
  const dispatch = useAppDispatch();

  const handlePlayPauseClick = () => {
    dispatch(setActiveSong({ song, data, i }));
    dispatch(playPause(true));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer group">
      <div className="relative mb-3">
        <img
          src={song.image}
          alt={song.title}
          className="w-full h-48 object-cover rounded-lg"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/300x200/6366f1/ffffff?text=🎵';
          }}
        />
        <button
          onClick={handlePlayPauseClick}
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 rounded-lg opacity-0 group-hover:opacity-100"
        >
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
        </button>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">{song.title}</h3>
        <p className="text-gray-600 text-xs mb-2 truncate">{song.artist}</p>
        
        {song.platform && (
          <div className="flex items-center justify-between">
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
              song.source === 'youtube' ? 'bg-red-100 text-red-800' :
              song.source === 'spotify' ? 'bg-green-100 text-green-800' :
              song.source === 'jiosaavn' ? 'bg-blue-100 text-blue-800' :
              song.source === 'wynk' ? 'bg-purple-100 text-purple-800' :
              song.source === 'deezer' ? 'bg-orange-100 text-orange-800' :
              song.source === 'soundcloud' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {song.platform}
            </span>
            {song.quality && (
              <span className="text-xs text-gray-500 font-medium">{song.quality}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SongCard;
