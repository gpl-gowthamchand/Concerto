import React, { useState } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { setActiveSong, setPlaylist } from '../redux/features/playerSlice';
import SongCard from '../components/SongCard';
import { HiPlay } from 'react-icons/hi';

// Sample data with different genres
const genreSongs = {
  pop: [
    {
      id: 'pop1',
      title: 'Pop Hit 1',
      artist: 'Pop Artist 1',
      album: 'Pop Album 1',
      duration: 180,
      audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      image: 'https://via.placeholder.com/300x300/ec4899/ffffff?text=Pop+1',
      genre: 'Pop'
    },
    {
      id: 'pop2',
      title: 'Pop Hit 2',
      artist: 'Pop Artist 2',
      album: 'Pop Album 2',
      duration: 200,
      audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      image: 'https://via.placeholder.com/300x300/f472b6/ffffff?text=Pop+2',
      genre: 'Pop'
    },
  ],
  rock: [
    {
      id: 'rock1',
      title: 'Rock Anthem 1',
      artist: 'Rock Band 1',
      album: 'Rock Album 1',
      duration: 240,
      audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      image: 'https://via.placeholder.com/300x300/dc2626/ffffff?text=Rock+1',
      genre: 'Rock'
    },
    {
      id: 'rock2',
      title: 'Rock Anthem 2',
      artist: 'Rock Band 2',
      album: 'Rock Album 2',
      duration: 220,
      audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      image: 'https://via.placeholder.com/300x300/ef4444/ffffff?text=Rock+2',
      genre: 'Rock'
    },
  ],
  jazz: [
    {
      id: 'jazz1',
      title: 'Jazz Standard 1',
      artist: 'Jazz Musician 1',
      album: 'Jazz Album 1',
      duration: 300,
      audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      image: 'https://via.placeholder.com/300x300/059669/ffffff?text=Jazz+1',
      genre: 'Jazz'
    },
    {
      id: 'jazz2',
      title: 'Jazz Standard 2',
      artist: 'Jazz Musician 2',
      album: 'Jazz Album 2',
      duration: 280,
      audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      image: 'https://via.placeholder.com/300x300/10b981/ffffff?text=Jazz+2',
      genre: 'Jazz'
    },
  ],
  electronic: [
    {
      id: 'electronic1',
      title: 'Electronic Beat 1',
      artist: 'Electronic Artist 1',
      album: 'Electronic Album 1',
      duration: 320,
      audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      image: 'https://via.placeholder.com/300x300/7c3aed/ffffff?text=Electronic+1',
      genre: 'Electronic'
    },
    {
      id: 'electronic2',
      title: 'Electronic Beat 2',
      artist: 'Electronic Artist 2',
      album: 'Electronic Album 2',
      duration: 290,
      audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      image: 'https://via.placeholder.com/300x300/8b5cf6/ffffff?text=Electronic+2',
      genre: 'Electronic'
    },
  ],
};

const genres = [
  { value: 'pop', title: 'Pop' },
  { value: 'rock', title: 'Rock' },
  { value: 'jazz', title: 'Jazz' },
  { value: 'electronic', title: 'Electronic' },
];

const Discover: React.FC = () => {
  const dispatch = useAppDispatch();
  const [selectedGenre, setSelectedGenre] = useState('pop');
  // const { isPlaying } = useAppSelector((state) => state.player);

  const currentSongs = genreSongs[selectedGenre as keyof typeof genreSongs] || [];

  const handlePlayAll = () => {
    if (currentSongs.length > 0) {
      dispatch(setPlaylist(currentSongs));
      dispatch(setActiveSong({ song: currentSongs[0], data: currentSongs, i: 0 }));
    }
  };

  const genreTitle = genres.find(({ value }) => value === selectedGenre)?.title;

  return (
    <div className="flex flex-col">
      <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10">
        <h2 className="font-bold text-3xl text-white text-left">Discover {genreTitle}</h2>
        
        <div className="flex items-center space-x-4">
          <select
            onChange={(e) => setSelectedGenre(e.target.value)}
            value={selectedGenre}
            className="bg-dark-800 text-white p-3 text-sm rounded-lg outline-none border border-dark-700 focus:border-primary-500"
          >
            {genres.map((genre) => (
              <option key={genre.value} value={genre.value}>
                {genre.title}
              </option>
            ))}
          </select>
          
          <button
            onClick={handlePlayAll}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <HiPlay className="w-5 h-5" />
            <span>Play All</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentSongs.map((song, i) => (
          <SongCard key={song.id} song={song} data={currentSongs} i={i} />
        ))}
      </div>
    </div>
  );
};

export default Discover;
