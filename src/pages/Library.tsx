import React, { useState } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { setActiveSong, setPlaylist } from '../redux/features/playerSlice';
import SongCard from '../components/SongCard';
import { HiPlay } from 'react-icons/hi';

// Sample library data
const librarySongs = [
  {
    id: 'lib1',
    title: 'My Favorite Song',
    artist: 'Favorite Artist',
    album: 'My Collection',
    duration: 195,
    audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    image: 'https://via.placeholder.com/300x300/1f2937/ffffff?text=Library+1',
    genre: 'Pop'
  },
  {
    id: 'lib2',
    title: 'Chill Vibes',
    artist: 'Chill Artist',
    album: 'Relaxation',
    duration: 210,
    audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    image: 'https://via.placeholder.com/300x300/374151/ffffff?text=Library+2',
    genre: 'Chill'
  },
  {
    id: 'lib3',
    title: 'Workout Beat',
    artist: 'Energy Artist',
    album: 'Fitness',
    duration: 180,
    audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    image: 'https://via.placeholder.com/300x300/4b5563/ffffff?text=Library+3',
    genre: 'Electronic'
  },
  {
    id: 'lib4',
    title: 'Study Music',
    artist: 'Focus Artist',
    album: 'Concentration',
    duration: 240,
    audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    image: 'https://via.placeholder.com/300x300/6b7280/ffffff?text=Library+4',
    genre: 'Ambient'
  },
];

const Library: React.FC = () => {
  const dispatch = useAppDispatch();
  // const { isPlaying } = useAppSelector((state) => state.player);
  const [activeTab, setActiveTab] = useState('songs');

  const handlePlayAll = () => {
    dispatch(setPlaylist(librarySongs));
    dispatch(setActiveSong({ song: librarySongs[0], data: librarySongs, i: 0 }));
  };

  const tabs = [
    { id: 'songs', label: 'Songs', count: librarySongs.length },
    { id: 'playlists', label: 'Playlists', count: 3 },
    { id: 'albums', label: 'Albums', count: 5 },
  ];

  return (
    <div className="flex flex-col">
      <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10">
        <h2 className="font-bold text-3xl text-white text-left">Your Library</h2>
        <button
          onClick={handlePlayAll}
          className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <HiPlay className="w-5 h-5" />
          <span>Play All</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-primary-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-dark-800'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Content based on active tab */}
      {activeTab === 'songs' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {librarySongs.map((song, i) => (
            <SongCard key={song.id} song={song} data={librarySongs} i={i} />
          ))}
        </div>
      )}

      {activeTab === 'playlists' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[
            { id: 'pl1', name: 'My Favorites', count: 12, image: 'https://via.placeholder.com/300x300/ec4899/ffffff?text=Favorites' },
            { id: 'pl2', name: 'Chill Vibes', count: 8, image: 'https://via.placeholder.com/300x300/10b981/ffffff?text=Chill' },
            { id: 'pl3', name: 'Workout Mix', count: 15, image: 'https://via.placeholder.com/300x300/dc2626/ffffff?text=Workout' },
          ].map((playlist) => (
            <div
              key={playlist.id}
              className="group relative p-4 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors cursor-pointer"
            >
              <div className="relative">
                <img
                  src={playlist.image}
                  alt={playlist.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg flex items-center justify-center transition-all">
                  <button className="opacity-0 group-hover:opacity-100 bg-primary-500 hover:bg-primary-600 text-white rounded-full p-3 transition-all">
                    <HiPlay className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-white font-medium truncate">{playlist.name}</h3>
                <p className="text-gray-400 text-sm">{playlist.count} songs</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'albums' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[
            { id: 'alb1', name: 'Greatest Hits', artist: 'Various Artists', count: 20, image: 'https://via.placeholder.com/300x300/7c3aed/ffffff?text=Greatest+Hits' },
            { id: 'alb2', name: 'Summer Vibes', artist: 'Summer Artist', count: 12, image: 'https://via.placeholder.com/300x300/f59e0b/ffffff?text=Summer+Vibes' },
            { id: 'alb3', name: 'Classic Rock', artist: 'Rock Legends', count: 15, image: 'https://via.placeholder.com/300x300/dc2626/ffffff?text=Classic+Rock' },
            { id: 'alb4', name: 'Jazz Collection', artist: 'Jazz Masters', count: 18, image: 'https://via.placeholder.com/300x300/059669/ffffff?text=Jazz+Collection' },
            { id: 'alb5', name: 'Electronic Dreams', artist: 'EDM Artist', count: 14, image: 'https://via.placeholder.com/300x300/8b5cf6/ffffff?text=Electronic+Dreams' },
          ].map((album) => (
            <div
              key={album.id}
              className="group relative p-4 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors cursor-pointer"
            >
              <div className="relative">
                <img
                  src={album.image}
                  alt={album.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg flex items-center justify-center transition-all">
                  <button className="opacity-0 group-hover:opacity-100 bg-primary-500 hover:bg-primary-600 text-white rounded-full p-3 transition-all">
                    <HiPlay className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-white font-medium truncate">{album.name}</h3>
                <p className="text-gray-400 text-sm truncate">{album.artist}</p>
                <p className="text-gray-500 text-xs">{album.count} songs</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Library;
