import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Heart, 
  Queue, 
  BarChart3, 
  Repeat, 
  Shuffle,
  MoreHorizontal
} from 'lucide-react';
import { useAudioStore } from '../../stores/audioStore';
import { useUserStore } from '../../stores/userStore';
import ProgressBar from './ProgressBar';
import QueuePanel from './QueuePanel';
import AudioVisualizer from './AudioVisualizer';

const Player: React.FC = () => {
  const {
    isPlaying,
    currentTrack,
    currentTime,
    duration,
    volume,
    isMuted,
    repeat,
    shuffle,
    queue,
    play,
    pause,
    next,
    previous,
    seek,
    setVolume,
    toggleMute,
    toggleRepeat,
    toggleShuffle,
  } = useAudioStore();

  const { user } = useUserStore();
  const [showQueue, setShowQueue] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Check if current track is liked
  useEffect(() => {
    if (currentTrack && user) {
      // Check if track is liked (this would need to be implemented with actual storage)
      setIsLiked(false);
    }
  }, [currentTrack, user]);

  // Handle play/pause
  const handlePlayPause = () => {
    if (currentTrack) {
      if (isPlaying) {
        pause();
      } else {
        play();
      }
    }
  };

  // Handle seek
  const handleSeek = (time: number) => {
    seek(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  // Handle volume change
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Handle like/unlike
  const handleLike = () => {
    if (currentTrack) {
      // This would need to be implemented with actual favorite tracks storage
      setIsLiked(!isLiked);
    }
  };

  // Format time
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark-800 border-t border-dark-700 z-50">
      {/* Audio element for actual playback */}
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={(e) => {
          // Update store with current time when needed
        }}
        onLoadedMetadata={(e) => {
          const audio = e.target as HTMLAudioElement;
          // Update store with duration
        }}
        onEnded={() => {
          if (repeat === 'one') {
            // Repeat current track
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play();
            }
          } else if (repeat === 'all' || queue.length > 0) {
            next();
          }
        }}
      />

      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Track info */}
          <div className="flex items-center space-x-4 flex-1">
            <img
              src={currentTrack.artwork || '/default-artwork.png'}
              alt={currentTrack.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-dark-100 font-medium truncate">
                {currentTrack.title}
              </h3>
              <p className="text-dark-400 text-sm truncate">
                {currentTrack.artist}
              </p>
              {currentTrack.album && (
                <p className="text-dark-500 text-xs truncate">
                  {currentTrack.album}
                </p>
              )}
            </div>
          </div>

          {/* Center - Playback controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleShuffle}
              className={`p-2 rounded-full transition-colors duration-200 ${
                shuffle ? 'text-primary-400 bg-primary-400/20' : 'text-dark-400 hover:text-dark-100'
              }`}
            >
              <Shuffle className="h-5 w-5" />
            </button>
            
            <button
              onClick={previous}
              disabled={queue.length === 0}
              className="p-2 text-dark-400 hover:text-dark-100 disabled:text-dark-600 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <SkipBack className="h-6 w-6" />
            </button>
            
            <button
              onClick={handlePlayPause}
              className="p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors duration-200"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </button>
            
            <button
              onClick={next}
              disabled={queue.length === 0}
              className="p-2 text-dark-400 hover:text-dark-100 disabled:text-dark-600 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <SkipForward className="h-6 w-6" />
            </button>
            
            <button
              onClick={toggleRepeat}
              className={`p-2 rounded-full transition-colors duration-200 ${
                repeat !== 'none' ? 'text-primary-400 bg-primary-400/20' : 'text-dark-400 hover:text-dark-100'
              }`}
            >
              <Repeat className="h-5 w-5" />
              {repeat === 'one' && (
                <span className="absolute -top-1 -right-1 text-xs bg-primary-400 text-white rounded-full w-4 h-4 flex items-center justify-center">
                  1
                </span>
              )}
            </button>
          </div>

          {/* Right side - Additional controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLike}
              className={`p-2 rounded-full transition-colors duration-200 ${
                isLiked ? 'text-red-400' : 'text-dark-400 hover:text-dark-100'
              }`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            
            <button
              onClick={() => setShowVisualizer(!showVisualizer)}
              className={`p-2 rounded-full transition-colors duration-200 ${
                showVisualizer ? 'text-primary-400 bg-primary-400/20' : 'text-dark-400 hover:text-dark-100'
              }`}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </button>
            
            <button className="p-2 text-dark-400 hover:text-dark-100 transition-colors duration-200">
              <Download className="h-5 w-5" />
            </button>
            
            <button className="p-2 text-dark-400 hover:text-dark-100 transition-colors duration-200">
              <Share2 className="h-5 w-5" />
            </button>
            
            <button
              onClick={() => setShowQueue(!showQueue)}
              className={`p-2 rounded-full transition-colors duration-200 ${
                showQueue ? 'text-primary-400 bg-primary-400/20' : 'text-dark-400 hover:text-dark-100'
              }`}
            >
              <List className="h-5 w-5" />
            </button>
            
            <button className="p-2 text-dark-400 hover:text-dark-100 transition-colors duration-200">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
          />
          <div className="flex justify-between text-xs text-dark-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume control */}
        <div className="flex items-center space-x-2 mt-3">
          <button
            onClick={() => toggleMute()}
            className="p-1 text-dark-400 hover:text-dark-100 transition-colors duration-200"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-20 h-1 bg-dark-600 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      {/* Audio Visualizer */}
      {showVisualizer && (
        <AudioVisualizer isPlaying={isPlaying} />
      )}

      {/* Queue Panel */}
      {showQueue && (
        <QueuePanel
          queue={queue}
          currentTrack={currentTrack}
          onClose={() => setShowQueue(false)}
        />
      )}
    </div>
  );
};

export default Player;
