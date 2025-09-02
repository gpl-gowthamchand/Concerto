import React, { useState, useEffect, useRef } from 'react';
import { Song } from '../redux/features/playerSlice';

interface UnifiedPlayerProps {
  song: Song;
  isPlaying: boolean;
  onEnded: () => void;
  onTimeUpdate?: (time: number) => void;
  onDurationChange?: (duration: number) => void;
}

const UnifiedPlayer: React.FC<UnifiedPlayerProps> = ({ 
  song, 
  isPlaying, 
  onEnded, 
  onTimeUpdate, 
  onDurationChange 
}) => {
  const [playerType, setPlayerType] = useState<'embedded' | 'external' | 'audio'>('audio');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Determine player type based on platform
  useEffect(() => {
    if (song.source === 'youtube' || song.source === 'spotify' || song.source === 'soundcloud') {
      setPlayerType('embedded');
    } else if (song.source === 'jiosaavn' || song.source === 'wynk' || song.source === 'deezer') {
      setPlayerType('external');
    } else {
      setPlayerType('audio');
    }
  }, [song.source]);

  // Handle play/pause for embedded players
  useEffect(() => {
    if (playerType === 'embedded' && iframeRef.current) {
      // For embedded players, we can't control play/pause directly
      // The iframe will handle its own state
      console.log('Embedded player:', song.title, 'isPlaying:', isPlaying);
    }
  }, [isPlaying, playerType, song.title]);

  // Handle play/pause for audio players
  useEffect(() => {
    if (playerType === 'audio' && audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Audio playback failed:', error);
          setPlayerType('external');
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, playerType]);

  // Handle time updates for audio players
  const handleTimeUpdate = (event: React.SyntheticEvent<HTMLAudioElement>) => {
    if (onTimeUpdate) {
      onTimeUpdate(event.currentTarget.currentTime);
    }
  };

  // Handle duration changes for audio players
  const handleLoadedMetadata = (event: React.SyntheticEvent<HTMLAudioElement>) => {
    if (onDurationChange) {
      onDurationChange(event.currentTarget.duration);
    }
  };

  // Handle external platform playback
  const handleExternalPlay = () => {
    const url = song.fullTrackUrl || song.previewUrl || song.audio;
    window.open(url, '_blank');
  };

  // Handle preview for external platforms
  const handlePreview = () => {
    const url = song.previewUrl || song.audio;
    window.open(url, '_blank');
  };

  // Render embedded player (YouTube, Spotify, SoundCloud)
  if (playerType === 'embedded') {
    return (
      <div className="w-full">
        <div className="bg-dark-800 rounded-lg overflow-hidden">
          <iframe
            ref={iframeRef}
            src={song.streamUrl || song.audio}
            width="100%"
            height="200"
            frameBorder="0"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            title={`${song.title} - ${song.artist}`}
            className="w-full"
            onLoad={() => {
              console.log('Embedded player loaded:', song.title);
            }}
            onError={() => {
              console.error('Embedded player failed:', song.title);
              setPlayerType('external');
            }}
          />
        </div>
        <div className="mt-2 text-center">
          <p className="text-gray-400 text-sm">
            🎵 {song.title} - {song.artist} • {song.platform}
          </p>
        </div>
      </div>
    );
  }

  // Render external platform modal
  if (playerType === 'external') {
    return (
      <div className="w-full">
        <div className="bg-dark-800 rounded-lg p-6 border border-primary-700">
          <div className="flex items-center justify-center mb-4">
            <img 
              src={song.image} 
              alt={song.title}
              className="w-20 h-20 rounded-lg mr-4"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/80x80/6366f1/ffffff?text=🎵';
              }}
            />
            <div className="text-left">
              <h3 className="text-white font-semibold text-lg">{song.title}</h3>
              <p className="text-gray-400">{song.artist}</p>
              <span className={`px-3 py-1 text-sm rounded-full ${
                song.source === 'jiosaavn' ? 'bg-blue-600 text-white' :
                song.source === 'wynk' ? 'bg-purple-600 text-white' :
                song.source === 'deezer' ? 'bg-orange-600 text-white' :
                'bg-gray-600 text-white'
              }`}>
                {song.platform}
              </span>
            </div>
          </div>
          
          <div className="text-center mb-4">
            <p className="text-gray-300 text-sm mb-2">
              This track is available on {song.platform}
            </p>
            <p className="text-gray-400 text-xs">
              Click below to open in {song.platform} for the best experience
            </p>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={handlePreview}
              className="bg-secondary-500 hover:bg-secondary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <span className="mr-2">👁️</span>
              Preview
            </button>
            <button
              onClick={handleExternalPlay}
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center"
            >
              <span className="mr-2">🎧</span>
              Play Full Track
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render audio player (fallback)
  return (
    <div className="w-full">
      <audio
        ref={audioRef}
        src={song.audio}
        onEnded={onEnded}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onError={(e) => {
          console.error('Audio playback error:', e);
          setPlayerType('external');
        }}
        className="hidden"
      />
      <div className="bg-dark-800 rounded-lg p-4 text-center">
        <p className="text-gray-400 text-sm">
          Audio player for {song.title} - {song.artist}
        </p>
      </div>
    </div>
  );
};

export default UnifiedPlayer;
