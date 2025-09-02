import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { setActiveSong, setPlaylist } from '../redux/features/playerSlice';
import { musicApi, OnlineSong } from '../services/enhancedMusicApi';
import SongCard from '../components/SongCard';

const OnlineMusic: React.FC = () => {
  const dispatch = useAppDispatch();
  const [songs, setSongs] = useState<OnlineSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'popular' | 'trending'>('popular');

  useEffect(() => {
    loadPopularTracks();
  }, []);

  const loadPopularTracks = () => {
    try {
      setLoading(true);
      const tracks = musicApi.getPopularTracks();
      setSongs(tracks);
      setError(null);
    } catch (err) {
      setError('Failed to load popular tracks');
    } finally {
      setLoading(false);
    }
  };

  const loadTrendingTracks = () => {
    try {
      setLoading(true);
      const tracks = musicApi.getTrendingTracks();
      setSongs(tracks);
      setError(null);
    } catch (err) {
      setError('Failed to load trending tracks');
    } finally {
      setLoading(false);
    }
  };

  const loadTracksByPlatform = (platform: string) => {
    try {
      setLoading(true);
      const tracks = musicApi.getTracksByPlatform(platform);
      setSongs(tracks);
      setError(null);
    } catch (err) {
      setError(`Failed to load ${platform} tracks`);
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

  const handleTabChange = (tab: 'popular' | 'trending') => {
    setActiveTab(tab);
    if (tab === 'popular') {
      loadPopularTracks();
    } else {
      loadTrendingTracks();
    }
  };

  const handlePlatformFilter = (platform: string) => {
    setSelectedPlatform(platform);
    if (platform === 'all') {
      loadPopularTracks();
    } else {
      loadTracksByPlatform(platform);
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

  if (error) {
    return (
      <div className="flex-1 bg-gray-50 p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadPopularTracks}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Try Again
          </button>
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
            <h1 className="text-2xl font-bold text-gray-900">Online Music</h1>
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
          <button
            onClick={() => handleTabChange('popular')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'popular'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Popular
          </button>
          <button
            onClick={() => handleTabChange('trending')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'trending'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
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
        {/* Platform Filters */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Streaming Platforms</h3>
          <div className="flex flex-wrap gap-2">
            {['all', 'youtube', 'spotify', 'jiosaavn', 'wynk', 'deezer', 'soundcloud'].map((platform) => (
              <button
                key={platform}
                onClick={() => handlePlatformFilter(platform)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  selectedPlatform === platform
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {platform === 'all' ? 'All Platforms' : 
                 platform === 'youtube' ? 'YouTube Music' :
                 platform === 'jiosaavn' ? 'JioSaavn' :
                 platform === 'wynk' ? 'Wynk Music' :
                 platform.charAt(0).toUpperCase() + platform.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Music Grid */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {activeTab === 'popular' ? 'Popular Tracks' : 'Trending Tracks'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {songs.map((song, index) => (
              <SongCard key={song.id} song={song} data={songs} i={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineMusic;
