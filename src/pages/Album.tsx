import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Shuffle, Repeat, Heart, Share2, MoreVertical, Plus, Clock, Calendar } from 'lucide-react';
import { useAudioStore } from '../stores/audioStore';
import { Track, Album as AlbumType } from '../types';

const AlbumPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [album, setAlbum] = useState<AlbumType | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const { setQueue, addToQueue } = useAudioStore();

  useEffect(() => {
    if (id) {
      loadAlbum(id);
    }
  }, [id]);

  const loadAlbum = (albumId: string) => {
    // Mock album data - replace with actual API call
    const mockAlbum: AlbumType = {
      id: albumId,
      title: 'Abbey Road',
      artist: 'The Beatles',
      artwork: 'https://via.placeholder.com/400x400/10B981/FFFFFF?text=Abbey',
      tracks: [
        {
          id: '1',
          title: 'Come Together',
          artist: 'The Beatles',
          album: 'Abbey Road',
          duration: 259,
          url: 'https://example.com/track1.mp3',
          artwork: 'https://via.placeholder.com/60x60',
          genre: 'Rock',
          mood: 'Energetic',
          source: 'youtube',
          playCount: 2500000,
          addedAt: new Date()
        },
        {
          id: '2',
          title: 'Something',
          artist: 'The Beatles',
          album: 'Abbey Road',
          duration: 182,
          url: 'https://example.com/track2.mp3',
          artwork: 'https://via.placeholder.com/60x60',
          genre: 'Rock',
          mood: 'Romantic',
          source: 'youtube',
          playCount: 1800000,
          addedAt: new Date()
        },
        {
          id: '3',
          title: 'Maxwell\'s Silver Hammer',
          artist: 'The Beatles',
          album: 'Abbey Road',
          duration: 207,
          url: 'https://example.com/track3.mp3',
          artwork: 'https://via.placeholder.com/60x60',
          genre: 'Rock',
          mood: 'Playful',
          source: 'youtube',
          playCount: 1200000,
          addedAt: new Date()
        },
        {
          id: '4',
          title: 'Oh! Darling',
          artist: 'The Beatles',
          album: 'Abbey Road',
          duration: 194,
          url: 'https://example.com/track4.mp3',
          artwork: 'https://via.placeholder.com/60x60',
          genre: 'Rock',
          mood: 'Passionate',
          source: 'youtube',
          playCount: 1500000,
          addedAt: new Date()
        }
      ],
      genre: 'Rock',
      year: 1969,
      totalDuration: 842,
      trackCount: 4
    };

    setAlbum(mockAlbum);
  };

  const playAlbum = () => {
    if (album && album.tracks.length > 0) {
      setQueue(album.tracks, 'album');
      setIsPlaying(true);
      setCurrentTrackIndex(0);
    }
  };

  const playTrack = (track: Track, index: number) => {
    if (album) {
      setQueue(album.tracks.slice(index), 'album');
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

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (!album) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-400">Loading album...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Album Header */}
      <div className="bg-gradient-to-br from-green-900 to-blue-900 rounded-xl p-8">
        <div className="flex items-start space-x-6">
          <img
            src={album.artwork || 'https://via.placeholder.com/200x200'}
            alt={album.title}
            className="w-48 h-48 rounded-xl object-cover shadow-2xl"
          />
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{album.title}</h1>
              <p className="text-gray-300 text-xl">{album.artist}</p>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{album.year}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{album.trackCount} tracks • {formatDuration(album.totalDuration)}</span>
              </div>
              <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-white">
                {album.genre}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={playAlbum}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition-colors flex items-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Play Album</span>
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
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-sm">{formatDuration(album.totalDuration)}</span>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add All to Queue</span>
            </button>
          </div>
        </div>

        {album.tracks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400 text-lg">No tracks in this album</p>
          </div>
        ) : (
          <div className="space-y-2">
            {album.tracks.map((track, index) => (
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
                  <span className="text-gray-400 text-sm">{track.mood}</span>
                  <span className="text-gray-400 text-sm">{formatDuration(track.duration)}</span>
                  <span className="text-gray-400 text-sm">{formatNumber(track.playCount)} plays</span>
                  
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

      {/* Album Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-dark-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">About This Album</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Release Year</span>
              <span className="text-white">{album.year}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Genre</span>
              <span className="text-white">{album.genre}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Duration</span>
              <span className="text-white">{formatDuration(album.totalDuration)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Track Count</span>
              <span className="text-white">{album.trackCount}</span>
            </div>
          </div>
        </div>

        <div className="bg-dark-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Actions</h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Download Album
            </button>
            <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
              Add to Library
            </button>
            <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
              Share Album
            </button>
            <button className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
              View Artist
            </button>
          </div>
        </div>
      </div>

      {/* Album Stats */}
      <div className="bg-dark-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Album Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-3 flex items-center justify-center">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <p className="text-2xl font-bold text-white">{formatDuration(album.totalDuration)}</p>
            <p className="text-gray-400">Total Duration</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full mx-auto mb-3 flex items-center justify-center">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded flex items-center justify-center">
                <span className="text-white text-sm font-bold">M</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{album.trackCount}</p>
            <p className="text-gray-400">Tracks</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <p className="text-2xl font-bold text-white">{album.year}</p>
            <p className="text-gray-400">Release Year</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumPage;
