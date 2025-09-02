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

  const loadPopularTracks = async () => {
    try {
      setLoading(true);
      const tracks = await musicApi.getPopularTracks();
      setSongs(tracks);
      setError(null);
    } catch (err) {
      setError('Failed to load popular tracks');
    } finally {
      setLoading(false);
    }
  };

  const loadTrendingTracks = async () => {
    try {
      setLoading(true);
      const tracks = await musicApi.getTrendingTracks();
      setSongs(tracks);
      setError(null);
    } catch (err) {
      setError('Failed to load trending tracks');
    } finally {
      setLoading(false);
    }
  };

  const loadTracksByPlatform = async (platform: string) => {
    try {
      setLoading(true);
      const tracks = await musicApi.getTracksByPlatform(platform);
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
            <h1 className="text-2xl font-bold text-gray-900">Artists &gt; Top 2023</h1>
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
            New Releases
          </button>
          <button
            onClick={() => handleTabChange('trending')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'trending'
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            New Feed
          </button>
          <button
            onClick={handlePlayAll}
            className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Shuffle Play
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Curated Playlist */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-6 text-white">
            <div className="flex items-center">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-lg mr-6 flex items-center justify-center">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium opacity-80">CURATED PLAYLIST</div>
                <h2 className="text-3xl font-bold mb-2">BLINDING LIGHT</h2>
                <p className="text-lg opacity-90 mb-4">
                  Enjoy vivid emotions with this stunning music album. Each track is a story.
                </p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">83,012 Likes</span>
                  </div>
                  <div className="text-sm">18 Songs, 39 min 43 sec</div>
                </div>
              </div>
            </div>
          </div>
        </div>

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

        {/* Popular Artists */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Popular Artists</h3>
            <button className="text-sm text-gray-600 hover:text-gray-900">See all</button>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {['The Creator', '21 Savage', '6ix9ine', 'Travis Scott', 'OBLADAET'].map((artist, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{artist.charAt(0)}</span>
                </div>
                <p className="text-sm font-medium text-gray-900">{artist}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Played */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recently Played</h3>
            <button className="text-sm text-gray-600 hover:text-gray-900">See all</button>
          </div>
          <div className="space-y-2">
            {songs.slice(0, 2).map((song) => (
              <div key={song.id} className="flex items-center p-3 bg-white rounded-lg hover:bg-gray-50">
                <img 
                  src={song.image} 
                  alt={song.title}
                  className="w-12 h-12 rounded-lg mr-4"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/48x48/6366f1/ffffff?text=🎵';
                  }}
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{song.title}</h4>
                  <p className="text-sm text-gray-600">{song.artist}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{Math.floor(song.duration / 60)}:{String(song.duration % 60).padStart(2, '0')}</span>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Music Grid */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">All Tracks</h3>
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
