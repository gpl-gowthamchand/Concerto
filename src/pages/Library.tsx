import React, { useState, useEffect } from 'react';
import { Plus, Heart, Clock, Sparkles, Music, Folder, Users, Download, Star, Play } from 'lucide-react';
import { useAudioStore } from '../stores/audioStore';
import { Track, Playlist } from '../types';

const Library: React.FC = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [favoriteTracks, setFavoriteTracks] = useState<Track[]>([]);
  const [recentTracks, setRecentTracks] = useState<Track[]>([]);
  const [downloadedTracks, setDownloadedTracks] = useState<Track[]>([]);
  const [activeTab, setActiveTab] = useState<'playlists' | 'favorites' | 'recent' | 'downloaded'>('playlists');
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');

  const { addToQueue, setQueue } = useAudioStore();

  useEffect(() => {
    // Load mock data - replace with actual API calls
    loadLibraryData();
  }, []);

  const loadLibraryData = () => {
    // Mock playlists
    const mockPlaylists: Playlist[] = [
      {
        id: '1',
        name: 'Chill Vibes',
        description: 'Perfect for relaxing evenings',
        tracks: [],
        artwork: 'https://via.placeholder.com/300x300/4F46E5/FFFFFF?text=Chill',
        isPublic: true,
        isCollaborative: false,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
        totalDuration: 3600,
        trackCount: 20,
        mood: 'calm',
        genre: 'ambient'
      },
      {
        id: '2',
        name: 'Workout Mix',
        description: 'High-energy tracks to keep you motivated',
        tracks: [],
        artwork: 'https://via.placeholder.com/300x300/DC2626/FFFFFF?text=Workout',
        isPublic: true,
        isCollaborative: false,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date(),
        totalDuration: 4200,
        trackCount: 25,
        mood: 'energetic',
        genre: 'electronic'
      },
      {
        id: '3',
        name: 'Jazz Classics',
        description: 'Timeless jazz masterpieces',
        tracks: [],
        artwork: 'https://via.placeholder.com/300x300/059669/FFFFFF?text=Jazz',
        isPublic: true,
        isCollaborative: true,
        collaborators: ['user1', 'user2'],
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date(),
        totalDuration: 5400,
        trackCount: 30,
        mood: 'sophisticated',
        genre: 'jazz'
      }
    ];

    // Mock favorite tracks
    const mockFavoriteTracks: Track[] = [
      {
        id: '1',
        title: 'Midnight Jazz',
        artist: 'Jazz Ensemble',
        album: 'Night Sessions',
        duration: 240,
        url: 'https://example.com/track1.mp3',
        artwork: 'https://via.placeholder.com/60x60',
        genre: 'Jazz',
        mood: 'Calm',
        source: 'youtube',
        playCount: 150,
        addedAt: new Date()
      },
      {
        id: '2',
        title: 'Electronic Dreams',
        artist: 'Synth Master',
        album: 'Digital World',
        duration: 320,
        url: 'https://example.com/track2.mp3',
        artwork: 'https://via.placeholder.com/60x60',
        genre: 'Electronic',
        mood: 'Energetic',
        source: 'soundcloud',
        playCount: 89,
        addedAt: new Date()
      }
    ];

    // Mock recent tracks
    const mockRecentTracks: Track[] = [
      {
        id: '3',
        title: 'Acoustic Morning',
        artist: 'Folk Singer',
        album: 'Sunrise Sessions',
        duration: 180,
        url: 'https://example.com/track3.mp3',
        artwork: 'https://via.placeholder.com/60x60',
        genre: 'Folk',
        mood: 'Peaceful',
        source: 'deezer',
        playCount: 45,
        addedAt: new Date()
      }
    ];

    // Mock downloaded tracks
    const mockDownloadedTracks: Track[] = [
      {
        id: '4',
        title: 'Offline Beat',
        artist: 'Local Artist',
        album: 'Underground',
        duration: 200,
        url: 'https://example.com/track4.mp3',
        artwork: 'https://via.placeholder.com/60x60',
        genre: 'Hip Hop',
        mood: 'Confident',
        source: 'jiosaavn',
        playCount: 67,
        addedAt: new Date(),
        isDownloaded: true
      }
    ];

    setPlaylists(mockPlaylists);
    setFavoriteTracks(mockFavoriteTracks);
    setRecentTracks(mockRecentTracks);
    setDownloadedTracks(mockDownloadedTracks);
  };

  const createPlaylist = () => {
    if (!newPlaylistName.trim()) return;

    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name: newPlaylistName,
      description: newPlaylistDescription,
      tracks: [],
      isPublic: false,
      isCollaborative: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      totalDuration: 0,
      trackCount: 0
    };

    setPlaylists([newPlaylist, ...playlists]);
    setNewPlaylistName('');
    setNewPlaylistDescription('');
    setShowCreatePlaylist(false);
  };

  const playPlaylist = (playlist: Playlist) => {
    if (playlist.tracks.length > 0) {
      setQueue(playlist.tracks, 'playlist');
    }
  };

  const playTrack = (track: Track) => {
    addToQueue(track);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderPlaylists = () => (
    <div className="space-y-6">
      {/* Create Playlist Section */}
      <div className="bg-dark-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Your Playlists</h3>
          <button
            onClick={() => setShowCreatePlaylist(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create Playlist</span>
          </button>
        </div>

        {/* Create Playlist Modal */}
        {showCreatePlaylist && (
          <div className="bg-dark-700 rounded-lg p-4 mb-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Playlist Name</label>
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="Enter playlist name..."
                  className="w-full bg-dark-600 border border-dark-500 rounded-lg px-3 py-2 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description (Optional)</label>
                <textarea
                  value={newPlaylistDescription}
                  onChange={(e) => setNewPlaylistDescription(e.target.value)}
                  placeholder="Describe your playlist..."
                  rows={3}
                  className="w-full bg-dark-600 border border-dark-500 rounded-lg px-3 py-2 text-white placeholder-gray-400 resize-none"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={createPlaylist}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowCreatePlaylist(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Playlists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="bg-dark-700 rounded-lg overflow-hidden hover:bg-dark-600 transition-colors cursor-pointer group"
              onClick={() => playPlaylist(playlist)}
            >
              <div className="relative">
                <img
                  src={playlist.artwork || 'https://via.placeholder.com/300x300/374151/FFFFFF?text=Playlist'}
                  alt={playlist.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                </div>
                {playlist.isCollaborative && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                    <Users className="w-3 h-3 inline mr-1" />
                    Collab
                  </div>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-medium text-white mb-1 truncate">{playlist.name}</h4>
                <p className="text-gray-400 text-sm mb-2 line-clamp-2">{playlist.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{playlist.trackCount} tracks</span>
                  <span>{formatDuration(playlist.totalDuration)}</span>
                </div>
                {playlist.mood && (
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 bg-dark-600 text-gray-300 text-xs rounded-full">
                      {playlist.mood}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI-Generated Playlists */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-6 h-6 text-purple-300" />
          <h3 className="text-xl font-semibold text-white">AI-Generated Collections</h3>
        </div>
        <p className="text-gray-300 mb-4">
          Discover personalized playlists created just for you based on your listening patterns
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-dark-800 bg-opacity-50 rounded-lg p-4 cursor-pointer hover:bg-opacity-70 transition-all">
            <h4 className="font-medium text-white mb-2">Morning Motivation</h4>
            <p className="text-sm text-gray-400">Start your day with energy</p>
            <div className="mt-2 text-xs text-gray-500">15 tracks • 45 min</div>
          </div>
          <div className="bg-dark-800 bg-opacity-50 rounded-lg p-4 cursor-pointer hover:bg-opacity-70 transition-all">
            <h4 className="font-medium text-white mb-2">Focus Flow</h4>
            <p className="text-sm text-gray-400">Concentration-enhancing music</p>
            <div className="mt-2 text-xs text-gray-500">12 tracks • 38 min</div>
          </div>
          <div className="bg-dark-800 bg-opacity-50 rounded-lg p-4 cursor-pointer hover:bg-opacity-70 transition-all">
            <h4 className="font-medium text-white mb-2">Late Night Vibes</h4>
            <p className="text-sm text-gray-400">Chill music for the evening</p>
            <div className="mt-2 text-xs text-gray-500">18 tracks • 52 min</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFavorites = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
        <Heart className="w-6 h-6 text-red-500" />
        <span>Favorite Tracks</span>
      </h3>
      {favoriteTracks.map((track) => (
        <div
          key={track.id}
          className="flex items-center space-x-4 p-4 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors"
        >
          <img
            src={track.artwork || 'https://via.placeholder.com/60x60'}
            alt={track.title}
            className="w-15 h-15 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h4 className="font-medium text-white">{track.title}</h4>
            <p className="text-gray-400">{track.artist}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{track.genre}</span>
              <span>{track.mood}</span>
              <span>{formatDuration(track.duration)}</span>
            </div>
          </div>
          <button
            onClick={() => playTrack(track)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Play
          </button>
        </div>
      ))}
    </div>
  );

  const renderRecent = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
        <Clock className="w-6 h-6 text-blue-500" />
        <span>Recently Played</span>
      </h3>
      {recentTracks.map((track) => (
        <div
          key={track.id}
          className="flex items-center space-x-4 p-4 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors"
        >
          <img
            src={track.artwork || 'https://via.placeholder.com/60x60'}
            alt={track.title}
            className="w-15 h-15 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h4 className="font-medium text-white">{track.title}</h4>
            <p className="text-gray-400">{track.artist}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{track.genre}</span>
              <span>{track.mood}</span>
              <span>{formatDuration(track.duration)}</span>
            </div>
          </div>
          <button
            onClick={() => playTrack(track)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Play
          </button>
        </div>
      ))}
    </div>
  );

  const renderDownloaded = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
        <Download className="w-6 h-6 text-green-500" />
        <span>Downloaded Tracks</span>
      </h3>
      {downloadedTracks.map((track) => (
        <div
          key={track.id}
          className="flex items-center space-x-4 p-4 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors"
        >
          <img
            src={track.artwork || 'https://via.placeholder.com/60x60'}
            alt={track.title}
            className="w-15 h-15 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h4 className="font-medium text-white">{track.title}</h4>
            <p className="text-gray-400">{track.artist}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{track.genre}</span>
              <span>{track.mood}</span>
              <span>{formatDuration(track.duration)}</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => playTrack(track)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Play
            </button>
            <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Your Library</h1>
        <p className="text-gray-400">Manage your playlists, favorites, and downloaded music</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-dark-800 rounded-lg p-1">
        {[
          { id: 'playlists', label: 'Playlists', icon: Music },
          { id: 'favorites', label: 'Favorites', icon: Heart },
          { id: 'recent', label: 'Recent', icon: Clock },
          { id: 'downloaded', label: 'Downloaded', icon: Download }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
              activeTab === id
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-dark-700'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'playlists' && renderPlaylists()}
      {activeTab === 'favorites' && renderFavorites()}
      {activeTab === 'recent' && renderRecent()}
      {activeTab === 'downloaded' && renderDownloaded()}
    </div>
  );
};

export default Library;
