import React from 'react';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { setActiveSong } from '../redux/features/playerSlice';
import { HiPlay, HiPause } from 'react-icons/hi';

interface SongCardProps {
  song: any;
  data: any[];
  i: number;
}

const SongCard: React.FC<SongCardProps> = ({ song, data, i }) => {
  const dispatch = useAppDispatch();
  const { activeSong, isPlaying } = useAppSelector((state) => state.player);

  const handlePlayClick = () => {
    dispatch(setActiveSong({ song, data, i }));
  };

  const isActive = activeSong?.id === song.id;

  return (
    <div
      className="group relative p-4 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors cursor-pointer"
      onClick={handlePlayClick}
    >
      <div className="relative">
        <img
          src={song.image || '/placeholder-album.jpg'}
          alt={song.title}
          className="w-full h-48 object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg flex items-center justify-center transition-all">
          <button className="opacity-0 group-hover:opacity-100 bg-primary-500 hover:bg-primary-600 text-white rounded-full p-3 transition-all">
            {isActive && isPlaying ? (
              <HiPause className="w-6 h-6" />
            ) : (
              <HiPlay className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
      <div className="mt-3">
        <h3 className="text-white font-medium truncate">{song.title}</h3>
        <p className="text-gray-400 text-sm truncate">{song.artist}</p>
        {song.platform && (
          <div className="flex items-center justify-between mt-2">
            <span className={`px-2 py-1 text-xs rounded ${
              song.source === 'youtube' ? 'bg-red-600 text-white' :
              song.source === 'spotify' ? 'bg-green-600 text-white' :
              song.source === 'jiosaavn' ? 'bg-blue-600 text-white' :
              song.source === 'wynk' ? 'bg-purple-600 text-white' :
              song.source === 'deezer' ? 'bg-orange-600 text-white' :
              song.source === 'soundcloud' ? 'bg-red-500 text-white' :
              'bg-gray-600 text-white'
            }`}>
              {song.platform}
            </span>
            {song.quality && (
              <span className="text-xs text-gray-500">{song.quality}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SongCard;
