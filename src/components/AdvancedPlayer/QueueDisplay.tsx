import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { removeFromQueue, clearQueue, setActiveSong } from '../../redux/features/playerSlice';

interface QueueDisplayProps {
  onClose: () => void;
}

const QueueDisplay: React.FC<QueueDisplayProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const { queue, currentSongs, currentIndex, activeSong } = useSelector((state: RootState) => state.player);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'history'>('all');

  const handleRemoveFromQueue = (songId: string) => {
    dispatch(removeFromQueue(songId));
  };

  const handleClearQueue = () => {
    dispatch(clearQueue());
  };

  const handlePlaySong = (song: any, index: number) => {
    dispatch(setActiveSong({ song, data: currentSongs, i: index }));
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getFilteredSongs = () => {
    switch (filter) {
      case 'upcoming':
        return queue;
      case 'history':
        return currentSongs.slice(0, currentIndex).reverse();
      default:
        return [...currentSongs.slice(currentIndex + 1), ...queue];
    }
  };

  const filteredSongs = getFilteredSongs();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-white text-lg font-semibold">Queue</h3>
          <div className="flex items-center space-x-4">
            {/* Filter Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  filter === 'all' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('upcoming')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  filter === 'upcoming' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setFilter('history')}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  filter === 'history' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                History
              </button>
            </div>

            {/* Clear Queue Button */}
            {filter === 'upcoming' && queue.length > 0 && (
              <button
                onClick={handleClearQueue}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
              >
                Clear Queue
              </button>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Current Song */}
        {activeSong && (
          <div className="p-4 border-b border-gray-700 bg-gray-800">
            <div className="flex items-center space-x-4">
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
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-sm font-medium">Now Playing</span>
                </div>
                <h4 className="text-white font-medium truncate">{activeSong.title}</h4>
                <p className="text-gray-400 text-sm truncate">{activeSong.artist}</p>
              </div>
              <div className="text-gray-400 text-sm">
                {formatDuration(activeSong.duration)}
              </div>
            </div>
          </div>
        )}

        {/* Queue Content */}
        <div className="flex-1 overflow-y-auto">
          {filteredSongs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <svg className="w-16 h-16 mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
              <p className="text-lg">No songs in queue</p>
              <p className="text-sm mt-2">Add songs to your queue to see them here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {filteredSongs.map((song, index) => (
                <div
                  key={`${song.id}-${index}`}
                  className="flex items-center space-x-4 p-4 hover:bg-gray-800 transition-colors group"
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
                    <h4 className="text-white font-medium truncate">{song.title}</h4>
                    <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                    {song.album && (
                      <p className="text-gray-500 text-xs truncate">{song.album}</p>
                    )}
                  </div>

                  {/* Duration */}
                  <div className="text-gray-400 text-sm">
                    {formatDuration(song.duration)}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handlePlaySong(song, index)}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                      title="Play this song"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </button>

                    {filter === 'upcoming' && (
                      <button
                        onClick={() => handleRemoveFromQueue(song.id)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                        title="Remove from queue"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 text-center text-gray-400 text-sm">
          {filteredSongs.length} song{filteredSongs.length !== 1 ? 's' : ''} in queue
        </div>
      </div>
    </div>
  );
};

export default QueueDisplay;
