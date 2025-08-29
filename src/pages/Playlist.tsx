import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Shuffle, Repeat, Heart, Share2, MoreVertical, Plus, Clock, Users } from 'lucide-react';
import { useAudioStore } from '../stores/audioStore';
import { Track, Playlist as PlaylistType } from '../types';

const PlaylistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [playlist, setPlaylist] = useState<PlaylistType | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const { setQueue, addToQueue } = useAudioStore();

  useEffect(() => {
    if (id) {
      loadPlaylist(id);
    }
  }, [id]);

  const loadPlaylist = (playlistId: string) => {
    // Mock playlist data - replace with actual API call
    const mockPlaylist: PlaylistType = {
      id: playlistId,
      name: 'Chill Vibes',
      description: 'Perfect for relaxing evenings and unwinding after a long day. A carefully curated collection of ambient, jazz, and acoustic tracks.',
      tracks: [
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
        },
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
      ],
      artwork: 'https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=Chill',
      isPublic: true,
      isCollaborative: false,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date(),
      totalDuration: 740,
      trackCount: 3,
      mood: 'calm',
      genre: 'ambient'
    };

    setPlaylist(mockPlaylist);
  };

  const playPlaylist = () => {
    if (playlist && playlist.tracks.length > 0) {
      setQueue(playlist.tracks, 'playlist');
      setIsPlaying(true);
      setCurrentTrackIndex(0);
    }
  };

  const playTrack = (track: Track, index: number) => {
    if (playlist) {
      setQueue(playlist.tracks.slice(index), 'playlist');
      setIsPlaying(true);
      setCurrentTrackIndex(index);
    }
  };

  const addTrackToQueue = (track: Track) => {
    addToQueue(track);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!playlist) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-400">Loading playlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Playlist Header */}
      <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-xl p-8">
        <div className="flex items-start space-x-6">
          <img
            src={playlist.artwork || 'https://via.placeholder.com/200x200'}
            alt={playlist.name}
            className="w-48 h-48 rounded-xl object-cover shadow-2xl"
          />
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{playlist.name}</h1>
              <p className="text-gray-300 text-lg">{playlist.description}</p>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Created by MusicLover</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{playlist.trackCount} tracks • {formatDuration(playlist.totalDuration)}</span>
              </div>
              {playlist.mood && (
                <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-white">
                  {playlist.mood}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={playPlaylist}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition-colors flex items-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Play</span>
              </button>
              
              <button className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full transition-colors">
                <Shuffle className="w-5 h-5" />
              </button>
              
              <button className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full transition-colors">
                <Repeat className="w-5 h-5" />
              </button>
              
              <button className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              
              <button className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              
              <button className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tracks */}
      <div className="bg-dark-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Tracks</h2>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Tracks</span>
          </button>
        </div>

        {playlist.tracks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400 text-lg">No tracks in this playlist</p>
            <p className="text-gray-500">Add some tracks to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {playlist.tracks.map((track, index) => (
              <div
                key={track.id}
                className={`flex items-center space-x-4 p-4 rounded-lg transition-colors ${
                  currentTrackIndex === index && isPlaying
                    ? 'bg-blue-600 bg-opacity-20 border border-blue-600'
                    : 'hover:bg-dark-700'
                }`}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <span className="text-gray-400 text-sm w-8 text-center">{index + 1}</span>
                  
                  <img
                    src={track.artwork || 'https://via.placeholder.com/50x50'}
                    alt={track.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{track.title}</h4>
                    <p className="text-gray-400 text-sm">{track.artist}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-gray-400 text-sm">{track.album}</span>
                  <span className="text-gray-400 text-sm">{formatDuration(track.duration)}</span>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => playTrack(track, index)}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => addTrackToQueue(track)}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    
                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Playlist Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-dark-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">About This Playlist</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Created</span>
              <span className="text-white">{playlist.createdAt.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Last Updated</span>
              <span className="text-white">{playlist.updatedAt.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Duration</span>
              <span className="text-white">{formatDuration(playlist.totalDuration)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Track Count</span>
              <span className="text-white">{playlist.trackCount}</span>
            </div>
            {playlist.genre && (
              <div className="flex justify-between">
                <span className="text-gray-400">Genre</span>
                <span className="text-white">{playlist.genre}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-dark-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Actions</h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Edit Playlist
            </button>
            <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
              Download Playlist
            </button>
            <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
              Share Playlist
            </button>
            <button className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
              Delete Playlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistPage;
