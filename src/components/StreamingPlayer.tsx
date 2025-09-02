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
        audioRef.current.play();
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
          allow="autoplay; encrypted-media"
          title={`${song.title} - ${song.artist}`}
          className="w-full h-full"
        />
      </div>
    );
  }

  if (playerType === 'external') {
    return (
      <div className="w-full p-4 bg-dark-800 rounded-lg">
        <div className="text-center">
          <p className="text-white mb-2">🎵 {song.title} - {song.artist}</p>
          <p className="text-gray-400 text-sm mb-4">This track will open in {song.platform}</p>
          <button
            onClick={handleExternalPlay}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            🎧 Play on {song.platform}
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
