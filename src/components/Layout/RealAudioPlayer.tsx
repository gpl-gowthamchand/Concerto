import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  Share2,
  Download,
  List,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useAudioStore } from '../../stores/audioStore';
import { MusicSearchResult } from '../../services/musicApi';
import AudioVisualizer from './AudioVisualizer';

interface RealAudioPlayerProps {
  track?: MusicSearchResult;
  onTrackEnd?: () => void;
}

const RealAudioPlayer: React.FC<RealAudioPlayerProps> = ({ track, onTrackEnd }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  
  const { 
    isPlaying, 
    currentTime, 
    duration, 
    volume, 
    isMuted, 
    repeat, 
    shuffle,
    play, 
    pause, 
    seek, 
    setVolume, 
    toggleMute, 
    toggleRepeat, 
    toggleShuffle,
    next,
    previous
  } = useAudioStore();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [audioData, setAudioData] = useState<Uint8Array | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Initialize Web Audio API
  useEffect(() => {
    if (typeof window !== 'undefined' && window.AudioContext) {
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Handle track changes and get playable audio URL
  useEffect(() => {
    if (track) {
      setIsLoading(true);
      setError(null);
      
      // Get playable audio URL based on source
      getPlayableAudioUrl(track).then(url => {
        if (url) {
          setAudioUrl(url);
          if (audioRef.current) {
            audioRef.current.src = url;
            audioRef.current.load();
          }
        } else {
          setError('Audio not available for this track');
          setIsLoading(false);
        }
      }).catch(err => {
        console.error('Failed to get audio URL:', err);
        setError('Failed to load audio');
        setIsLoading(false);
      });
    }
  }, [track]);

  // Get playable audio URL from different sources
  const getPlayableAudioUrl = async (track: MusicSearchResult): Promise<string | null> => {
    try {
      switch (track.source) {
        case 'youtube':
          // For YouTube, we need to use a proxy or extract audio URL
          // For now, use a simple fallback
          return await getYouTubeAudioUrl(track.url);
        
        case 'deezer':
          // Deezer provides direct preview URLs
          return track.url;
        
        case 'soundcloud':
          // SoundCloud URLs need client ID
          return await getSoundCloudAudioUrl(track.url);
        
        case 'jiosaavn':
          // JioSaavn URLs are usually direct
          return track.url;
        
        case 'fma':
        case 'ia':
          // Free Music Archive and Internet Archive provide direct URLs
          return track.url;
        
        default:
          return track.url;
      }
    } catch (error) {
      console.error('Error getting audio URL:', error);
      return null;
    }
  };

  // Get YouTube audio URL (simplified - in production you'd use yt-dlp or similar)
  const getYouTubeAudioUrl = async (youtubeUrl: string): Promise<string | null> => {
    try {
      // Extract video ID
      const videoId = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
      if (!videoId) return null;

      // For demo purposes, return a sample audio URL
      // In production, you'd use a service like yt-dlp or a proxy
      return `https://sample-audio-files.com/audio/mp3/wave.mp3`;
    } catch (error) {
      console.error('Error extracting YouTube audio:', error);
      return null;
    }
  };

  // Get SoundCloud audio URL
  const getSoundCloudAudioUrl = async (soundcloudUrl: string): Promise<string | null> => {
    try {
      // SoundCloud URLs need a client ID
      // For demo purposes, return a sample URL
      return `https://sample-audio-files.com/audio/mp3/wave.mp3`;
    } catch (error) {
      console.error('Error getting SoundCloud audio:', error);
      return null;
    }
  };

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Playback error:', err);
          setError('Failed to play audio');
          setIsLoading(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, audioUrl]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Update current time
  useEffect(() => {
    if (audioRef.current && Math.abs(audioRef.current.currentTime - currentTime) > 1) {
      audioRef.current.currentTime = currentTime;
    }
  }, [currentTime]);

  // Audio event handlers
  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      seek(audioRef.current.currentTime);
    }
  }, [seek]);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setIsLoading(false);
      setError(null);
    }
  }, []);

  const handleEnded = useCallback(() => {
    if (onTrackEnd) {
      onTrackEnd();
    } else {
      next();
    }
  }, [onTrackEnd, next]);

  const handleError = useCallback((e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    console.error('Audio error:', e);
    setError('Failed to load audio');
    setIsLoading(false);
  }, []);

  // Animation frame for audio visualization
  useEffect(() => {
    if (!analyserRef.current || !showVisualizer) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const updateVisualizer = () => {
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);
        setAudioData(dataArray);
      }
      requestAnimationFrame(updateVisualizer);
    };

    updateVisualizer();
  }, [showVisualizer]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (isPlaying) {
            pause();
          } else if (track) {
            play(track);
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          seek(Math.max(0, currentTime - 10));
          break;
        case 'ArrowRight':
          e.preventDefault();
          seek(Math.min(duration, currentTime + 10));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(Math.min(1, volume + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(Math.max(0, volume - 0.1));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, currentTime, duration, volume, play, pause, seek, setVolume, track]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    seek(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else if (track) {
      play(track);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Add to favorites logic here
  };

  const handleShare = () => {
    if (track) {
      navigator.share?.({
        title: track.title,
        text: `${track.title} by ${track.artist}`,
        url: track.url
      }).catch(() => {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(`${track.title} by ${track.artist} - ${track.url}`);
      });
    }
  };

  const handleDownload = () => {
    if (track && audioUrl) {
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `${track.title} - ${track.artist}.mp3`;
      link.click();
    }
  };

  if (!track) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-dark-800 border-t border-dark-700 p-4">
        <div className="flex items-center justify-center text-dark-400">
          <p>No track selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark-800 border-t border-dark-700">
      {/* Audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleError}
        preload="metadata"
        crossOrigin="anonymous"
      />

      {/* Visualizer */}
      {showVisualizer && (
        <div className="h-16 bg-dark-900">
          <AudioVisualizer 
            width={window.innerWidth} 
            height={64} 
            type="bars"
            audioData={audioData}
          />
        </div>
      )}

      {/* Player controls */}
      <div className="flex items-center justify-between p-4">
        {/* Track info */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <img
            src={track.artwork}
            alt={track.title}
            className="w-12 h-12 rounded-lg object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/48x48/374151/FFFFFF?text=🎵';
            }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium truncate">{track.title}</p>
            <p className="text-dark-400 text-sm truncate">{track.artist}</p>
            {error && (
              <p className="text-red-400 text-xs">{error}</p>
            )}
          </div>
        </div>

        {/* Main controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleShuffle}
            className={`p-2 rounded-lg transition-colors ${
              shuffle ? 'text-primary-400' : 'text-dark-400 hover:text-dark-300'
            }`}
          >
            <Shuffle className="w-5 h-5" />
          </button>

          <button
            onClick={previous}
            className="p-2 text-dark-400 hover:text-dark-300 rounded-lg transition-colors"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={togglePlayPause}
            disabled={isLoading || !audioUrl}
            className="p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>

          <button
            onClick={next}
            className="p-2 text-dark-400 hover:text-dark-300 rounded-lg transition-colors"
          >
            <SkipForward className="w-5 h-5" />
          </button>

          <button
            onClick={toggleRepeat}
            className={`p-2 rounded-lg transition-colors ${
              repeat !== 'none' ? 'text-primary-400' : 'text-dark-400 hover:text-dark-300'
            }`}
          >
            {repeat === 'one' ? (
              <Repeat1 className="w-5 h-5" />
            ) : (
              <Repeat className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex-1 mx-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-dark-400 w-10">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 bg-dark-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-xs text-dark-400 w-10">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume and additional controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleMute}
            className="p-2 text-dark-400 hover:text-dark-300 rounded-lg transition-colors"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 bg-dark-700 rounded-lg appearance-none cursor-pointer slider"
          />

          <button
            onClick={handleLike}
            className={`p-2 rounded-lg transition-colors ${
              isLiked ? 'text-red-400' : 'text-dark-400 hover:text-dark-300'
            }`}
          >
            <Heart className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} />
          </button>

          <button
            onClick={handleShare}
            className="p-2 text-dark-400 hover:text-dark-300 rounded-lg transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>

          <button
            onClick={handleDownload}
            disabled={!audioUrl}
            className="p-2 text-dark-400 hover:text-dark-300 rounded-lg transition-colors disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowVisualizer(!showVisualizer)}
            className="p-2 text-dark-400 hover:text-dark-300 rounded-lg transition-colors"
          >
            <List className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-dark-400 hover:text-dark-300 rounded-lg transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RealAudioPlayer;
