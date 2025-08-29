import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Play, Heart, Plus, MoreVertical, TrendingUp, Clock, Star } from 'lucide-react';
import { useAudioStore } from '../stores/audioStore';
import { useUserStore } from '../stores/userStore';
import { Track, Playlist } from '../types';

const Home: React.FC = () => {
  const { play, addToQueue } = useAudioStore();
  const { user } = useUserStore();
  const [featuredTracks, setFeaturedTracks] = useState<Track[]>([]);
  const [recentPlaylists, setRecentPlaylists] = useState<Playlist[]>([]);
  const [trendingTracks, setTrendingTracks] = useState<Track[]>([]);
  const [moodPlaylists, setMoodPlaylists] = useState<Playlist[]>([]);

  // Mock data for demonstration
  useEffect(() => {
    const mockTracks: Track[] = [
      {
        id: '1',
        title: 'Bohemian Rhapsody',
        artist: 'Queen',
        album: 'A Night at the Opera',
        duration: 354,
        url: 'https://example.com/bohemian-rhapsody.mp3',
        artwork: 'https://via.placeholder.com/300x300/1e293b/ffffff?text=Queen',
        genre: 'Rock',
        mood: 'Epic',
        bpm: 72,
        key: 'C',
        year: 1975,
        source: 'youtube',
        playCount: 1000000,
        addedAt: new Date(),
      },
      {
        id: '2',
        title: 'Hotel California',
        artist: 'Eagles',
        album: 'Hotel California',
        duration: 391,
        url: 'https://example.com/hotel-california.mp3',
        artwork: 'https://via.placeholder.com/300x300/1e293b/ffffff?text=Eagles',
        genre: 'Rock',
        mood: 'Mysterious',
        bpm: 75,
        key: 'Bm',
        year: 1976,
        source: 'youtube',
        playCount: 850000,
        addedAt: new Date(),
      },
      {
        id: '3',
        title: 'Imagine',
        artist: 'John Lennon',
        album: 'Imagine',
        duration: 183,
        url: 'https://example.com/imagine.mp3',
        artwork: 'https://via.placeholder.com/300x300/1e293b/ffffff?text=John+Lennon',
        genre: 'Pop',
        mood: 'Peaceful',
        bpm: 76,
        key: 'C',
        year: 1971,
        source: 'youtube',
        playCount: 750000,
        addedAt: new Date(),
      },
    ];

    const mockPlaylists: Playlist[] = [
      {
        id: '1',
        name: 'Chill Vibes',
        description: 'Relaxing tunes for your downtime',
        tracks: mockTracks.slice(0, 2),
        artwork: 'https://via.placeholder.com/300x300/0ea5e9/ffffff?text=Chill',
        isPublic: true,
        isCollaborative: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        totalDuration: 745,
        trackCount: 2,
        mood: 'Chill',
        genre: 'Various',
      },
      {
        id: '2',
        name: 'Rock Classics',
        description: 'Timeless rock anthems',
        tracks: mockTracks.slice(0, 2),
        artwork: 'https://via.placeholder.com/300x300/d946ef/ffffff?text=Rock',
        isPublic: true,
        isCollaborative: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        totalDuration: 745,
        trackCount: 2,
        mood: 'Energetic',
        genre: 'Rock',
      },
    ];

    setFeaturedTracks(mockTracks);
    setRecentPlaylists(mockPlaylists);
    setTrendingTracks(mockTracks.slice(0, 2));
    setMoodPlaylists(mockPlaylists);
  }, []);

  const handlePlayTrack = (track: Track) => {
    play(track);
  };

  const handleAddToQueue = (track: Track) => {
    addToQueue(track);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Helmet>
        <title>Concerto - Your Music, Your Way</title>
        <meta name="description" content="Discover, stream, and enjoy music with Concerto's AI-powered music streaming platform" />
      </Helmet>

      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-dark-100 mb-4">
            Welcome back, <span className="gradient-text">{user?.username || 'Music Lover'}</span>!
          </h1>
          <p className="text-dark-400 text-lg">
            Discover new music, revisit your favorites, and let AI guide your musical journey
          </p>
        </div>

        {/* Featured Tracks */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-dark-100">Featured Tracks</h2>
            <button className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors">
              View All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTracks.map((track) => (
              <div key={track.id} className="card group hover:bg-dark-700 transition-colors">
                <div className="relative">
                  <img
                    src={track.artwork || '/default-artwork.png'}
                    alt={track.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePlayTrack(track)}
                        className="p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors"
                      >
                        <Play className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleAddToQueue(track)}
                        className="p-3 bg-dark-700 hover:bg-dark-600 text-white rounded-full transition-colors"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-dark-100 font-semibold truncate">{track.title}</h3>
                  <p className="text-dark-400 text-sm truncate">{track.artist}</p>
                  <div className="flex items-center justify-between text-xs text-dark-500">
                    <span>{track.album}</span>
                    <span>{formatDuration(track.duration)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-primary-500/20 text-primary-400 text-xs rounded-full">
                      {track.genre}
                    </span>
                    <span className="px-2 py-1 bg-secondary-500/20 text-secondary-400 text-xs rounded-full">
                      {track.mood}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Playlists */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-dark-100">Recent Playlists</h2>
            <button className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors">
              View All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentPlaylists.map((playlist) => (
              <div key={playlist.id} className="card group hover:bg-dark-700 transition-colors cursor-pointer">
                <div className="relative">
                  <img
                    src={playlist.artwork || '/default-artwork.png'}
                    alt={playlist.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                    <button className="p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors">
                      <Play className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-dark-100 font-medium truncate mb-1">{playlist.name}</h3>
                  <p className="text-dark-400 text-sm truncate mb-2">{playlist.description}</p>
                  <div className="flex items-center justify-between text-xs text-dark-500">
                    <span>{playlist.trackCount} tracks</span>
                    <span>{formatDuration(playlist.totalDuration)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trending & Mood Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trending Tracks */}
          <section>
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="h-6 w-6 text-primary-400" />
              <h2 className="text-2xl font-bold text-dark-100">Trending Now</h2>
            </div>
            
            <div className="space-y-3">
              {trendingTracks.map((track, index) => (
                <div key={track.id} className="flex items-center space-x-3 p-3 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors group">
                  <span className="text-2xl font-bold text-primary-400 w-8">#{index + 1}</span>
                  <img
                    src={track.artwork || '/default-artwork.png'}
                    alt={track.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-dark-100 font-medium truncate">{track.title}</h3>
                    <p className="text-dark-400 text-sm truncate">{track.artist}</p>
                  </div>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handlePlayTrack(track)}
                      className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                    <button className="p-2 bg-dark-600 hover:bg-dark-500 text-dark-300 rounded-full transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Mood Playlists */}
          <section>
            <div className="flex items-center space-x-2 mb-6">
              <Star className="h-6 w-6 text-secondary-400" />
              <h2 className="text-2xl font-bold text-dark-100">Mood Playlists</h2>
            </div>
            
            <div className="space-y-3">
              {moodPlaylists.map((playlist) => (
                <div key={playlist.id} className="flex items-center space-x-3 p-3 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors cursor-pointer group">
                  <img
                    src={playlist.artwork || '/default-artwork.png'}
                    alt={playlist.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-dark-100 font-medium truncate">{playlist.name}</h3>
                    <p className="text-dark-400 text-sm truncate">{playlist.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="px-2 py-1 bg-primary-500/20 text-primary-400 text-xs rounded-full">
                        {playlist.mood}
                      </span>
                      <span className="text-dark-500 text-xs">{playlist.trackCount} tracks</span>
                    </div>
                  </div>
                  <button className="p-2 bg-secondary-600 hover:bg-secondary-700 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100">
                    <Play className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Quick Actions */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-dark-100 mb-6">Quick Actions</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="btn-primary flex items-center space-x-2">
              <Play className="h-5 w-5" />
              <span>Start Radio</span>
            </button>
            <button className="btn-secondary flex items-center space-x-2">
              <Heart className="h-5 w-5" />
              <span>Liked Songs</span>
            </button>
            <button className="btn-secondary flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Recently Played</span>
            </button>
            <button className="btn-secondary flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Create Playlist</span>
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
