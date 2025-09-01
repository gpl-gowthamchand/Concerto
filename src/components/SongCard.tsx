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
      </div>
    </div>
  );
};

export default SongCard;
