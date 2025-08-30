import React, { useState, useEffect } from 'react';
import { Play, Plus, Heart, Clock, TrendingUp, Sparkles } from 'lucide-react';
import { useAudioStore } from '../stores/audioStore';
import { useUserStore } from '../stores/userStore';
import { musicApiService } from '../services/musicApi';
import { MusicSearchResult } from '../services/musicApi';
import toast from 'react-hot-toast';

const Home: React.FC = () => {
  const [featuredTracks, setFeaturedTracks] = useState<MusicSearchResult[]>([]);
  const [recentPlaylists, setRecentPlaylists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUserStore();
  const { play, addToQueue } = useAudioStore();

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setIsLoading(true);
      
      // Load featured tracks (trending music)
      const trendingMusic = await musicApiService.getTrendingMusic();
      setFeaturedTracks(trendingMusic.slice(0, 6));

      // Load recent playlists (mock for now)
      setRecentPlaylists([
        { id: '1', name: 'Chill Vibes', trackCount: 24, image: 'https://via.placeholder.com/200x200/374151/FFFFFF?text=🎵' },
        { id: '2', name: 'Rock Classics', trackCount: 18, image: 'https://via.placeholder.com/200x200/374151/FFFFFF?text=🎵' },
        { id: '3', name: 'Workout Mix', trackCount: 32, image: 'https://via.placeholder.com/200x200/374151/FFFFFF?text=🎵' },
        { id: '4', name: 'Study Focus', trackCount: 15, image: 'https://via.placeholder.com/200x200/374151/FFFFFF?text=🎵' }
      ]);
    } catch (error) {
      console.error('Error loading home data:', error);
      toast.error('Failed to load home data');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayTrack = async (track: MusicSearchResult) => {
    try {
      play(track);
      toast.success(`Now playing: ${track.title}`);
    } catch (error) {
      console.error('Playback error:', error);
      toast.error('Failed to play track');
    }
  };

  const handleAddToQueue = (track: MusicSearchResult) => {
    addToQueue(track);
    toast.success(`Added ${track.title} to queue`);
  };

  const handleLikeTrack = (track: MusicSearchResult) => {
    // Add to favorites logic here
    toast.success(`Added ${track.title} to favorites`);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'youtube':
        return '🎵';
      case 'jiosaavn':
        return '🎶';
      case 'deezer':
        return '🎧';
      case 'soundcloud':
        return '☁️';
      case 'fma':
        return '🎼';
      case 'ia':
        return '📚';
      default:
        return '🎵';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome back, {user?.username || 'User'}!</h1>
          <p className="text-dark-400 text-lg">
            Discover new music, revisit your favorites, and let AI guide your musical journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-square bg-dark-700 rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-dark-700 rounded w-3/4"></div>
                <div className="h-3 bg-dark-700 rounded w-1/2"></div>
                <div className="h-3 bg-dark-700 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome back, <span className="text-primary-400">{user?.username || 'User'}</span>!
        </h1>
        <p className="text-dark-400 text-lg">
          Discover new music, revisit your favorites, and let AI guide your musical journey
        </p>
      </div>

      {/* Featured Tracks */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-primary-400" />
            <span>Featured Tracks</span>
          </h2>
          <button className="text-primary-400 hover:text-primary-300 text-sm transition-colors">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTracks.map((track) => (
            <div key={`${track.id}-${track.source}`} className="card group hover:bg-dark-700 transition-all duration-300">
              <div className="relative aspect-square mb-4">
                <img
                  src={track.artwork}
                  alt={track.title}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x300/374151/FFFFFF?text=🎵';
                  }}
                />
                
                {/* Overlay with controls */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-lg flex items-center justify-center">
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => handlePlayTrack(track)}
                      className="p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors"
                      title="Play"
                    >
                      <Play className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleAddToQueue(track)}
                      className="p-3 bg-dark-600 hover:bg-dark-500 text-white rounded-full transition-colors"
                      title="Add to Queue"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleLikeTrack(track)}
                      className="p-3 bg-dark-600 hover:bg-dark-500 text-white rounded-full transition-colors"
                      title="Like"
                    >
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-white font-semibold truncate">{track.title}</h3>
                <p className="text-dark-400 text-sm truncate">{track.artist}</p>
                <div className="flex items-center justify-between text-xs text-dark-500">
                  <div className="flex items-center space-x-2">
                    <span>{track.album}</span>
                    <span>•</span>
                    <span>{track.genre}</span>
                    {track.mood && (
                      <>
                        <span>•</span>
                        <span>{track.mood}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>{getSourceIcon(track.source)}</span>
                    <span>{formatDuration(track.duration)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Playlists */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Clock className="w-6 h-6 text-primary-400" />
            <span>Recent Playlists</span>
          </h2>
          <button className="text-primary-400 hover:text-primary-300 text-sm transition-colors">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentPlaylists.map((playlist) => (
            <div key={playlist.id} className="card group hover:bg-dark-700 transition-all duration-300 cursor-pointer">
              <div className="relative aspect-square mb-4">
                <img
                  src={playlist.image}
                  alt={playlist.name}
                  className="w-full h-full object-cover rounded-lg"
                />
                
                {/* Overlay with play button */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-lg flex items-center justify-center">
                  <button className="p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100">
                    <Play className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-white font-semibold truncate">{playlist.name}</h3>
                <p className="text-dark-400 text-sm">{playlist.trackCount} tracks</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <Sparkles className="w-6 h-6 text-primary-400" />
          <span>Quick Actions</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card hover:bg-dark-700 transition-colors cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-600 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Discover New Music</h3>
                <p className="text-dark-400 text-sm">Find trending tracks and artists</p>
              </div>
            </div>
          </div>

          <div className="card hover:bg-dark-700 transition-colors cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-600 rounded-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Your Favorites</h3>
                <p className="text-dark-400 text-sm">Listen to your liked songs</p>
              </div>
            </div>
          </div>

          <div className="card hover:bg-dark-700 transition-colors cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary-600 rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Recently Played</h3>
                <p className="text-dark-400 text-sm">Continue where you left off</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
