import React, { useState } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { setActiveSong, setPlaylist } from '../redux/features/playerSlice';
import { musicApi, OnlineSong } from '../services/enhancedMusicApi';
import SongCard from '../components/SongCard';

const Library: React.FC = () => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState('songs');
  const [songs, setSongs] = useState<OnlineSong[]>([]);

  React.useEffect(() => {
    loadSongs();
  }, []);

  const loadSongs = () => {
    try {
      const tracks = musicApi.getPopularTracks();
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

  const tabs = [
    { id: 'songs', label: 'Songs', count: songs.length },
    { id: 'playlists', label: 'Playlists', count: 3 },
    { id: 'albums', label: 'Albums', count: 5 },
  ];

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Your Library</h1>
          </div>
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

        {/* Tabs */}
        <div className="flex space-x-1 mt-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Content based on active tab */}
        {activeTab === 'songs' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {songs.map((song, i) => (
              <SongCard key={song.id} song={song} data={songs} i={i} />
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
                className="group relative p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-sm"
              >
                <div className="relative">
                  <img
                    src={playlist.image}
                    alt={playlist.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg flex items-center justify-center transition-all">
                    <button className="opacity-0 group-hover:opacity-100 bg-gray-900 hover:bg-gray-800 text-white rounded-full p-3 transition-all">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-gray-900 font-medium truncate">{playlist.name}</h3>
                  <p className="text-gray-600 text-sm">{playlist.count} songs</p>
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
                className="group relative p-4 bg-white rounded-lg hover:bg-gray-50 transition-colors cursor-pointer shadow-sm"
              >
                <div className="relative">
                  <img
                    src={album.image}
                    alt={album.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg flex items-center justify-center transition-all">
                    <button className="opacity-0 group-hover:opacity-100 bg-gray-900 hover:bg-gray-800 text-white rounded-full p-3 transition-all">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-gray-900 font-medium truncate">{album.name}</h3>
                  <p className="text-gray-600 text-sm truncate">{album.artist}</p>
                  <p className="text-gray-500 text-xs">{album.count} songs</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
