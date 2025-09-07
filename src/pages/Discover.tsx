import React, { useState } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { setActiveSong, setPlaylist } from '../redux/features/playerSlice';
import { musicApi, OnlineSong } from '../services/enhancedMusicApi';
import SongCard from '../components/SongCard';

const Discover: React.FC = () => {
  const dispatch = useAppDispatch();
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [songs, setSongs] = useState<OnlineSong[]>([]);

  React.useEffect(() => {
    loadSongs();
  }, [selectedGenre]);

  const loadSongs = () => {
    try {
      let tracks: OnlineSong[];
      if (selectedGenre === 'all') {
        tracks = musicApi.getPopularTracks();
      } else {
        tracks = musicApi.getTracksByGenre(selectedGenre);
      }
      setSongs(tracks);
    } catch (error) {
      console.error('Failed to load songs:', error);
      setSongs([]);
    }
  };

  const handlePlayAll = () => {
    if (songs.length > 0) {
      dispatch(setPlaylist(songs));
      dispatch(setActiveSong({ song: songs[0], data: songs, i: 0 }));
    }
  };

  const genres = [
    { value: 'all', title: 'All Genres' },
    { value: 'pop', title: 'Pop' },
    { value: 'rock', title: 'Rock' },
    { value: 'electronic', title: 'Electronic' },
    { value: 'bollywood', title: 'Bollywood' },
    { value: 'reggaeton', title: 'Reggaeton' },
  ];

  const genreTitle = genres.find(({ value }) => value === selectedGenre)?.title;

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Discover {genreTitle}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <select
              onChange={(e) => setSelectedGenre(e.target.value)}
              value={selectedGenre}
              className="bg-white border border-gray-300 text-gray-900 p-3 text-sm rounded-lg outline-none focus:border-gray-900"
            >
              {genres.map((genre) => (
                <option key={genre.value} value={genre.value}>
                  {genre.title}
                </option>
              ))}
            </select>
            
            <button
              onClick={handlePlayAll}
              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              <span>Play All</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {songs.map((song, i) => (
            <SongCard key={song.id} song={song} data={songs} i={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Discover;
