import React, { useState, useEffect, useRef } from 'react';
import { Song } from '../redux/features/playerSlice';

interface StreamingPlayerProps {
  song: Song;
  isPlaying: boolean;
  onEnded: () => void;
}

const StreamingPlayer: React.FC<StreamingPlayerProps> = ({ song, isPlaying, onEnded }) => {
  const [playerType, setPlayerType] = useState<'audio' | 'iframe' | 'external'>('audio');
  const [streamingUrl, setStreamingUrl] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Determine player type based on the audio URL
    if (song.audio.includes('youtube.com/embed')) {
      setPlayerType('iframe');
      setStreamingUrl(song.audio);
    } else if (song.audio.includes('spotify.com/embed')) {
      setPlayerType('iframe');
      setStreamingUrl(song.audio);
    } else if (song.audio.includes('soundcloud.com/player')) {
      setPlayerType('iframe');
      setStreamingUrl(song.audio);
    } else if (song.audio.includes('jiosaavn.com') || song.audio.includes('wynk.in') || song.audio.includes('deezer.com')) {
      setPlayerType('external');
      setStreamingUrl(song.audio);
    } else {
      setPlayerType('audio');
      setStreamingUrl(song.audio);
    }
  }, [song.audio]);

  useEffect(() => {
    if (playerType === 'audio' && audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Audio playback failed:', error);
          // Fallback to external player
          setPlayerType('external');
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, playerType]);

  const handleExternalPlay = () => {
    if (playerType === 'external') {
      window.open(streamingUrl, '_blank');
    }
  };

  if (playerType === 'iframe') {
    return (
      <div className="w-full h-64 bg-dark-800 rounded-lg overflow-hidden">
        <iframe
          ref={iframeRef}
          src={streamingUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          title={`${song.title} - ${song.artist}`}
          className="w-full h-full"
          onLoad={() => {
            console.log('Iframe loaded for:', song.title);
          }}
          onError={() => {
            console.error('Iframe failed to load for:', song.title);
            setPlayerType('external');
          }}
        />
      </div>
    );
  }

  if (playerType === 'external') {
    return (
      <div className="w-full p-4 bg-dark-800 rounded-lg border border-primary-700">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <img 
              src={song.image} 
              alt={song.title}
              className="w-16 h-16 rounded-lg mr-4"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/64x64/6366f1/ffffff?text=🎵';
              }}
            />
            <div className="text-left">
              <p className="text-white font-semibold">{song.title}</p>
              <p className="text-gray-400 text-sm">{song.artist}</p>
              <span className={`px-2 py-1 text-xs rounded ${
                song.source === 'jiosaavn' ? 'bg-blue-600 text-white' :
                song.source === 'wynk' ? 'bg-purple-600 text-white' :
                song.source === 'deezer' ? 'bg-orange-600 text-white' :
                'bg-gray-600 text-white'
              }`}>
                {song.platform}
              </span>
            </div>
          </div>
          <p className="text-gray-300 text-sm mb-4">
            This track will open in {song.platform} for the best listening experience.
          </p>
          <button
            onClick={handleExternalPlay}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center mx-auto"
          >
            <span className="mr-2">🎧</span>
            Play on {song.platform}
          </button>
        </div>
      </div>
    );
  }

  return (
    <audio
      ref={audioRef}
      src={streamingUrl}
      onEnded={onEnded}
      onError={(e) => {
        console.error('Audio playback error:', e);
        // Fallback to external player
        setPlayerType('external');
      }}
      className="hidden"
    />
  );
};

export default StreamingPlayer;
