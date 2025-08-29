import React, { useState, useEffect } from 'react';
import { Download, Wifi, WifiOff, Music, HardDrive, Trash2, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Track } from '../types';

const Offline: React.FC = () => {
  const [downloadedTracks, setDownloadedTracks] = useState<Track[]>([]);
  const [storageInfo, setStorageInfo] = useState({
    used: 2.4,
    total: 5.0,
    available: 2.6
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    loadOfflineData();
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadOfflineData = () => {
    // Mock downloaded tracks
    const mockTracks: Track[] = [
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
        addedAt: new Date(),
        isDownloaded: true
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
        addedAt: new Date(),
        isDownloaded: true
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
        addedAt: new Date(),
        isDownloaded: true
      }
    ];

    setDownloadedTracks(mockTracks);
  };

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const removeTrack = (trackId: string) => {
    setDownloadedTracks(downloadedTracks.filter(track => track.id !== trackId));
    if (currentTrack?.id === trackId) {
      setCurrentTrack(null);
      setIsPlaying(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          {isOnline ? (
            <Wifi className="w-8 h-8 text-green-500" />
          ) : (
            <WifiOff className="w-8 h-8 text-red-500" />
          )}
          <h1 className="text-4xl font-bold text-white">Offline Music</h1>
        </div>
        <p className="text-gray-400">
          {isOnline 
            ? 'You\'re online! Your offline music is ready to play.' 
            : 'You\'re offline. Enjoy your downloaded music!'
          }
        </p>
      </div>

      {/* Storage Info */}
      <div className="bg-dark-800 rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-4">
          <HardDrive className="w-6 h-6 text-blue-500" />
          <h3 className="text-xl font-semibold text-white">Storage</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Storage Used</span>
            <span className="text-white font-medium">{storageInfo.used} GB / {storageInfo.total} GB</span>
          </div>
          
          <div className="w-full bg-dark-700 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
              style={{ width: `${(storageInfo.used / storageInfo.total) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Available: {storageInfo.available} GB</span>
            <span className="text-gray-400">{Math.round((storageInfo.used / storageInfo.total) * 100)}% used</span>
          </div>
        </div>
      </div>

      {/* Current Track Player */}
      {currentTrack && (
        <div className="bg-dark-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Now Playing</h3>
          <div className="flex items-center space-x-4">
            <img
              src={currentTrack.artwork || 'https://via.placeholder.com/80x80'}
              alt={currentTrack.title}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h4 className="font-medium text-white text-lg">{currentTrack.title}</h4>
              <p className="text-gray-400">{currentTrack.artist}</p>
              <p className="text-gray-500 text-sm">{currentTrack.album}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <SkipBack className="w-6 h-6" />
              </button>
              <button
                onClick={togglePlayPause}
                className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white" />
                )}
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <SkipForward className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Downloaded Tracks */}
      <div className="bg-dark-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Download className="w-6 h-6 text-green-500" />
            <h3 className="text-xl font-semibold text-white">Downloaded Tracks</h3>
          </div>
          <span className="text-gray-400 text-sm">{downloadedTracks.length} tracks</span>
        </div>

        {downloadedTracks.length === 0 ? (
          <div className="text-center py-12">
            <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No offline tracks yet</p>
            <p className="text-gray-500">Download some music to listen offline</p>
          </div>
        ) : (
          <div className="space-y-3">
            {downloadedTracks.map((track) => (
              <div
                key={track.id}
                className={`flex items-center space-x-4 p-4 rounded-lg transition-colors ${
                  currentTrack?.id === track.id 
                    ? 'bg-blue-600 bg-opacity-20 border border-blue-600' 
                    : 'bg-dark-700 hover:bg-dark-600'
                }`}
              >
                <img
                  src={track.artwork || 'https://via.placeholder.com/50x50'}
                  alt={track.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-white">{track.title}</h4>
                  <p className="text-gray-400 text-sm">{track.artist}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                    <span>{track.genre}</span>
                    <span>{track.mood}</span>
                    <span>{formatDuration(track.duration)}</span>
                    <span>{formatFileSize(track.duration * 32000)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => playTrack(track)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Play className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => removeTrack(track.id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Offline Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-dark-800 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-white">Offline Playlists</h4>
              <p className="text-gray-400 text-sm">Create playlists for offline use</p>
            </div>
          </div>
          <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
            Create Offline Playlist
          </button>
        </div>

        <div className="bg-dark-800 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Download className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-white">Auto-Download</h4>
              <p className="text-gray-400 text-sm">Automatically download new releases</p>
            </div>
          </div>
          <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            Configure Auto-Download
          </button>
        </div>
      </div>

      {/* Offline Tips */}
      <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Offline Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p className="text-gray-300">• Download music when connected to Wi-Fi to save data</p>
            <p className="text-gray-300">• Create mood-based offline playlists for different activities</p>
          </div>
          <div className="space-y-2">
            <p className="text-gray-300">• Use high-quality downloads for the best offline experience</p>
            <p className="text-gray-300">• Regularly sync your offline library when online</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offline;
