import React from 'react';
import { useAppDispatch } from '../redux/hooks';
import { setActiveSong, setPlaylist } from '../redux/features/playerSlice';
import { musicApi, OnlineSong } from '../services/enhancedMusicApi';
import SongCard from '../components/SongCard';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const [songs, setSongs] = React.useState<OnlineSong[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    loadMusic();
  }, []);

  const loadMusic = () => {
    try {
      setLoading(true);
      setError(null);
      // Use synchronous function since it's just sample data
      const tracks = musicApi.getPopularTracks();
      setSongs(tracks);
    } catch (err) {
      console.error('Failed to load music:', err);
      setError('Failed to load music');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAll = () => {
    if (songs.length > 0) {
      dispatch(setPlaylist(songs));
      dispatch(setActiveSong({ song: songs[0], data: songs, i: 0 }));
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-gray-50 p-6">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading music...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Browse Music</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-6 mt-4">
          <button className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg">
            Popular
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg">
            Trending
          </button>
          <button
            onClick={handlePlayAll}
            className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Play All
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Music Grid */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tracks</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {songs.map((song, index) => (
              <SongCard key={song.id} song={song} data={songs} i={index} />
            ))}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
