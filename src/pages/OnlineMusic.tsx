import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { setActiveSong, setPlaylist } from '../redux/features/playerSlice';
import SongCard from '../components/SongCard';
import { HiPlay, HiRefresh, HiSearch } from 'react-icons/hi';
import { musicApi, OnlineSong } from '../services/enhancedMusicApi';

const OnlineMusic: React.FC = () => {
  const dispatch = useAppDispatch();
  // const { isPlaying } = useAppSelector((state) => state.player);
  const [songs, setSongs] = useState<OnlineSong[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('pop');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [activeTab, setActiveTab] = useState('popular');

  const genres = musicApi.getGenres().map(genre => ({ value: genre.toLowerCase(), title: genre }));
  const platforms = [
    { value: 'all', title: 'All Platforms' },
    ...musicApi.getPlatforms().map(platform => ({ value: platform.id, title: platform.name }))
  ];

  const loadPopularTracks = async () => {
    setLoading(true);
    try {
      const tracks = await musicApi.getPopularTracks();
      setSongs(tracks);
    } catch (error) {
      console.error('Error loading tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchTracks = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const tracks = await musicApi.searchTracks(searchQuery);
      setSongs(tracks);
    } catch (error) {
      console.error('Error searching tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTracksByGenre = async (genre: string) => {
    setLoading(true);
    try {
      const tracks = await musicApi.getTracksByGenre(genre);
      setSongs(tracks);
    } catch (error) {
      console.error('Error loading tracks by genre:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTracksByPlatform = async (platform: string) => {
    setLoading(true);
    try {
      const tracks = await musicApi.getTracksByPlatform(platform);
      setSongs(tracks);
    } catch (error) {
      console.error('Error loading tracks by platform:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTrendingTracks = async () => {
    setLoading(true);
    try {
      const tracks = await musicApi.getTrendingTracks();
      setSongs(tracks);
    } catch (error) {
      console.error('Error loading trending tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPopularTracks();
  }, []);

  const handlePlayAll = () => {
    if (songs.length > 0) {
      dispatch(setPlaylist(songs));
      dispatch(setActiveSong({ song: songs[0], data: songs, i: 0 }));
    }
  };

  const handleGenreChange = (genre: string) => {
    setSelectedGenre(genre);
    loadTracksByGenre(genre);
  };

  return (
    <div className="flex flex-col">
      <div className="w-full flex justify-between items-center sm:flex-row flex-col mt-4 mb-10">
        <h2 className="font-bold text-3xl text-white text-left">🎵 Multi-Platform Music</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={loadPopularTracks}
            className="bg-secondary-500 hover:bg-secondary-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <HiRefresh className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={handlePlayAll}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <HiPlay className="w-5 h-5" />
            <span>Play All</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        {[
          { id: 'popular', label: 'Popular', action: loadPopularTracks },
          { id: 'trending', label: 'Trending', action: loadTrendingTracks },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              tab.action();
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-primary-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-dark-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchTracks()}
              placeholder="Search for songs, artists, albums..."
              className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <button
            onClick={searchTracks}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Platform Filter */}
      <div className="mb-4">
        <h3 className="text-white font-semibold mb-3">🎧 Streaming Platforms</h3>
        <div className="flex flex-wrap gap-2">
          {platforms.map((platform) => (
            <button
              key={platform.value}
              onClick={() => {
                setSelectedPlatform(platform.value);
                if (platform.value === 'all') {
                  loadPopularTracks();
                } else {
                  loadTracksByPlatform(platform.value);
                }
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedPlatform === platform.value
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-800 text-gray-400 hover:text-white hover:bg-dark-700'
              }`}
            >
              {platform.title}
            </button>
          ))}
        </div>
      </div>

      {/* Genre Filter */}
      <div className="mb-6">
        <h3 className="text-white font-semibold mb-3">🎵 Genres</h3>
        <div className="flex flex-wrap gap-2">
          {genres.slice(0, 8).map((genre) => (
            <button
              key={genre.value}
              onClick={() => handleGenreChange(genre.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedGenre === genre.value
                  ? 'bg-secondary-500 text-white'
                  : 'bg-dark-800 text-gray-400 hover:text-white hover:bg-dark-700'
              }`}
            >
              {genre.title}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      )}

      {/* Songs Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {songs.map((song, i) => (
            <SongCard key={song.id} song={song} data={songs} i={i} />
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && songs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No songs found. Try a different search or refresh.</p>
        </div>
      )}

      {/* Info Banner */}
      <div className="mt-8 p-4 bg-gradient-to-r from-primary-900 to-secondary-900 rounded-lg border border-primary-700">
        <h3 className="text-white font-semibold mb-2">🎵 Multi-Platform Music Streaming</h3>
        <p className="text-gray-300 text-sm mb-3">
          Stream music from multiple popular platforms including YouTube Music, Spotify, JioSaavn, Wynk Music, Deezer, and SoundCloud.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-primary-600 text-white text-xs rounded">YouTube Music</span>
          <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">Spotify</span>
          <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded">JioSaavn</span>
          <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded">Wynk</span>
          <span className="px-2 py-1 bg-orange-600 text-white text-xs rounded">Deezer</span>
          <span className="px-2 py-1 bg-red-600 text-white text-xs rounded">SoundCloud</span>
        </div>
      </div>
    </div>
  );
};

export default OnlineMusic;
