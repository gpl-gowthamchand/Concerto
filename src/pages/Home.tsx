import React from 'react';
import { useAppDispatch } from '../redux/hooks';
import { setActiveSong, setPlaylist } from '../redux/features/playerSlice';
import SongCard from '../components/SongCard';
import { HiPlay } from 'react-icons/hi';

// Sample data - in a real app, this would come from an API
const sampleSongs = [
  {
    id: '1',
    title: 'Sample Song 1',
    artist: 'Artist 1',
    album: 'Album 1',
    duration: 180,
    audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    image: 'https://via.placeholder.com/300x300/1f2937/ffffff?text=Album+1',
    genre: 'Pop'
  },
  {
    id: '2',
    title: 'Sample Song 2',
    artist: 'Artist 2',
    album: 'Album 2',
    duration: 200,
    audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    image: 'https://via.placeholder.com/300x300/374151/ffffff?text=Album+2',
    genre: 'Rock'
  },
  {
    id: '3',
    title: 'Sample Song 3',
    artist: 'Artist 3',
    album: 'Album 3',
    duration: 160,
    audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    image: 'https://via.placeholder.com/300x300/4b5563/ffffff?text=Album+3',
    genre: 'Jazz'
  },
  {
    id: '4',
    title: 'Sample Song 4',
    artist: 'Artist 4',
    album: 'Album 4',
    duration: 220,
    audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    image: 'https://via.placeholder.com/300x300/6b7280/ffffff?text=Album+4',
    genre: 'Electronic'
  },
];

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  // const { isPlaying } = useAppSelector((state) => state.player);

  const handlePlayAll = () => {
    dispatch(setPlaylist(sampleSongs));
    dispatch(setActiveSong({ song: sampleSongs[0], data: sampleSongs, i: 0 }));
  };

  return (
    <div className="flex flex-col">
      <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10">
        <h2 className="font-bold text-3xl text-white text-left">Welcome to Concerto</h2>
        <button
          onClick={handlePlayAll}
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <HiPlay className="w-5 h-5" />
          <span>Play All</span>
        </button>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Featured Songs</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sampleSongs.map((song, i) => (
            <SongCard key={song.id} song={song} data={sampleSongs} i={i} />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-4">Recently Played</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sampleSongs.slice(0, 4).map((song, i) => (
            <SongCard key={`recent-${song.id}`} song={song} data={sampleSongs} i={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
