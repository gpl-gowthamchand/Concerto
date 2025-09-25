import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { addToDownloaded, removeFromDownloaded } from '../../redux/features/playerSlice';
import { advancedMusicApi } from '../../services/advancedMusicApi';

interface OfflineManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const OfflineManager: React.FC<OfflineManagerProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { downloadedSongs, activeSong } = useSelector((state: RootState) => state.player);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [storageInfo, setStorageInfo] = useState<{
    used: number;
    available: number;
    total: number;
  } | null>(null);

  // Get storage information
  useEffect(() => {
    const getStorageInfo = async () => {
      try {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
          const estimate = await navigator.storage.estimate();
          setStorageInfo({
            used: estimate.usage || 0,
            available: (estimate.quota || 0) - (estimate.usage || 0),
            total: estimate.quota || 0,
          });
        }
      } catch (error) {
        console.error('Error getting storage info:', error);
      }
    };

    getStorageInfo();
  }, []);

  const handleDownloadSong = async (song: any) => {
    if (!song) return;

    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadError(null);

    try {
      // Simulate download progress
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      // Download the song
      const downloadedSong = await advancedMusicApi.downloadSong(song);
      
      // Add to Redux store
      dispatch(addToDownloaded(downloadedSong));
      
      clearInterval(progressInterval);
      setDownloadProgress(100);
      
      // Reset after a short delay
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadProgress(0);
      }, 1000);

    } catch (error) {
      console.error('Error downloading song:', error);
      setDownloadError('Failed to download song. Please try again.');
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const handleRemoveDownload = (songId: string) => {
    dispatch(removeFromDownloaded(songId));
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTotalDownloadedSize = (): number => {
    return downloadedSongs.reduce((total, song) => {
      // Estimate size based on duration (rough estimate)
      const estimatedSize = song.duration * 100000; // ~100KB per minute
      return total + estimatedSize;
    }, 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-white text-lg font-semibold">Offline Manager</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Storage Info */}
        {storageInfo && (
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300 text-sm">Storage Usage</span>
              <span className="text-gray-400 text-sm">
                {formatBytes(storageInfo.used)} / {formatBytes(storageInfo.total)}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(storageInfo.used / storageInfo.total) * 100}%`
                }}
              />
            </div>
            <div className="flex justify-between text-gray-500 text-xs mt-1">
              <span>Used: {formatBytes(storageInfo.used)}</span>
              <span>Available: {formatBytes(storageInfo.available)}</span>
            </div>
          </div>
        )}

        {/* Download Progress */}
        {isDownloading && (
          <div className="p-4 border-b border-gray-700 bg-blue-900 bg-opacity-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-300 text-sm font-medium">Downloading...</span>
              <span className="text-blue-300 text-sm">{downloadProgress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Download Error */}
        {downloadError && (
          <div className="p-4 border-b border-gray-700 bg-red-900 bg-opacity-50">
            <div className="flex items-center justify-between">
              <span className="text-red-300 text-sm">{downloadError}</span>
              <button
                onClick={() => setDownloadError(null)}
                className="text-red-300 hover:text-red-200 text-sm"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Current Song Download */}
        {activeSong && !downloadedSongs.some(song => song.id === activeSong.id) && (
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <img
                    src={activeSong.image}
                    alt={activeSong.title}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48x48/6366f1/ffffff?text=🎵';
                    }}
                  />
                </div>
                <div>
                  <h4 className="text-white font-medium">{activeSong.title}</h4>
                  <p className="text-gray-400 text-sm">{activeSong.artist}</p>
                </div>
              </div>
              <button
                onClick={() => handleDownloadSong(activeSong)}
                disabled={isDownloading}
                className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isDownloading ? 'Downloading...' : 'Download'}
              </button>
            </div>
          </div>
        )}

        {/* Downloaded Songs */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-white font-medium">
                Downloaded Songs ({downloadedSongs.length})
              </h4>
              <div className="text-gray-400 text-sm">
                Total: {formatBytes(getTotalDownloadedSize())}
              </div>
            </div>

            {downloadedSongs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <svg className="w-16 h-16 mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg">No downloaded songs</p>
                <p className="text-sm mt-2">Download songs to listen offline</p>
              </div>
            ) : (
              <div className="space-y-2">
                {downloadedSongs.map((song) => (
                  <div
                    key={song.id}
                    className="flex items-center space-x-4 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group"
                  >
                    {/* Song Image */}
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <img
                        src={song.image}
                        alt={song.title}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48x48/6366f1/ffffff?text=🎵';
                        }}
                      />
                    </div>

                    {/* Song Info */}
                    <div className="flex-1 min-w-0">
                      <h5 className="text-white font-medium truncate">{song.title}</h5>
                      <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                      {song.album && (
                        <p className="text-gray-500 text-xs truncate">{song.album}</p>
                      )}
                    </div>

                    {/* Song Details */}
                    <div className="text-gray-400 text-sm">
                      <div>{formatDuration(song.duration)}</div>
                      <div className="text-xs">
                        {formatBytes(song.duration * 100000)}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleRemoveDownload(song.id)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        title="Remove download"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>Downloaded songs are stored locally and can be played offline</p>
          <p className="mt-1">Storage usage may vary based on audio quality</p>
        </div>
      </div>
    </div>
  );
};

export default OfflineManager;
