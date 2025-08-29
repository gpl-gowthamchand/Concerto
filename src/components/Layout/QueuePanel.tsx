import React from 'react';
import { X, Play, MoreVertical, Heart, Download, Share2 } from 'lucide-react';
import { QueueItem, Track } from '../../types';
import { useAudioStore } from '../../stores/audioStore';
import { useUserStore } from '../../stores/userStore';

interface QueuePanelProps {
  queue: QueueItem[];
  currentTrack: Track;
  onClose: () => void;
}

const QueuePanel: React.FC<QueuePanelProps> = ({ queue, currentTrack, onClose }) => {
  const { play, removeFromQueue, clearQueue } = useAudioStore();
  const { user, addFavoriteTrack, removeFavoriteTrack } = useUserStore();

  const handlePlayTrack = (track: Track) => {
    play(track);
  };

  const handleRemoveFromQueue = (index: number) => {
    removeFromQueue(index);
  };

  const handleLikeTrack = (track: Track) => {
    if (user?.favoriteTracks.includes(track.id)) {
      removeFavoriteTrack(track.id);
    } else {
      addFavoriteTrack(track);
    }
  };

  const isLiked = (trackId: string) => {
    return user?.favoriteTracks.includes(trackId) || false;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTotalDuration = () => {
    return queue.reduce((total, item) => total + item.track.duration, 0);
  };

  return (
    <div className="fixed bottom-20 right-4 w-96 bg-dark-800 border border-dark-700 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-dark-700">
        <div>
          <h3 className="text-dark-100 font-medium">Queue</h3>
          <p className="text-dark-400 text-sm">
            {queue.length} tracks • {formatDuration(getTotalDuration())}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={clearQueue}
            className="px-3 py-1 text-xs text-red-400 hover:bg-red-400/10 rounded transition-colors"
          >
            Clear
          </button>
          <button
            onClick={onClose}
            className="p-1 text-dark-400 hover:text-dark-100 hover:bg-dark-700 rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Current Track */}
      <div className="p-4 border-b border-dark-700">
        <div className="flex items-center space-x-3">
          <img
            src={currentTrack.artwork || '/default-artwork.png'}
            alt={currentTrack.title}
            className="w-12 h-12 rounded-md object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-dark-100 font-medium truncate">Now Playing</p>
            <p className="text-dark-300 text-sm truncate">{currentTrack.title}</p>
            <p className="text-dark-400 text-xs truncate">{currentTrack.artist}</p>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleLikeTrack(currentTrack)}
              className={`p-1 rounded transition-colors ${
                isLiked(currentTrack.id)
                  ? 'text-red-400 hover:text-red-300'
                  : 'text-dark-400 hover:text-dark-300'
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked(currentTrack.id) ? 'fill-current' : ''}`} />
            </button>
            <button className="p-1 text-dark-400 hover:text-dark-300 rounded transition-colors">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Queue List */}
      <div className="overflow-y-auto max-h-64">
        {queue.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-dark-400 text-sm">No tracks in queue</p>
            <p className="text-dark-500 text-xs mt-1">Add tracks to start building your queue</p>
          </div>
        ) : (
          <div className="divide-y divide-dark-700">
            {queue.map((item, index) => (
              <div key={`${item.track.id}-${index}`} className="p-3 hover:bg-dark-700 transition-colors">
                <div className="flex items-center space-x-3">
                  <img
                    src={item.track.artwork || '/default-artwork.png'}
                    alt={item.track.title}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-dark-100 text-sm font-medium truncate">
                      {item.track.title}
                    </p>
                    <p className="text-dark-400 text-xs truncate">
                      {item.track.artist}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-dark-500 text-xs">
                        {formatDuration(item.track.duration)}
                      </span>
                      <span className="text-dark-500 text-xs">•</span>
                      <span className="text-dark-500 text-xs capitalize">
                        {item.source}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handlePlayTrack(item.track)}
                      className="p-1 text-dark-400 hover:text-primary-400 rounded transition-colors"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleLikeTrack(item.track)}
                      className={`p-1 rounded transition-colors ${
                        isLiked(item.track.id)
                          ? 'text-red-400 hover:text-red-300'
                          : 'text-dark-400 hover:text-dark-300'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${isLiked(item.track.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleRemoveFromQueue(index)}
                      className="p-1 text-dark-400 hover:text-red-400 rounded transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {queue.length > 0 && (
        <div className="p-3 border-t border-dark-700 bg-dark-900">
          <div className="flex items-center justify-between text-xs text-dark-400">
            <span>Total: {formatDuration(getTotalDuration())}</span>
            <span>{queue.length} tracks remaining</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QueuePanel;
