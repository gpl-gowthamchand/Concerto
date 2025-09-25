import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import {
  playPause,
  setVolume,
  setCurrentTime,
  setDuration,
  nextSong,
  prevSong,
  setMuted,
  setPlaybackRate,
  setCrossfade,
  setGaplessPlayback,
  setSleepTimer,
  setSleepTimerActive,
  setAudioNormalization,
  setSkipSilence,
  setTempo,
  setPitch,
  addToFavorites,
  removeFromFavorites,
  addToRecentlyPlayed,
  toggleLyrics,
  toggleQueue,
} from '../../redux/features/playerSlice';
import { advancedMusicApi } from '../../services/advancedMusicApi';
import Controls from './Controls';
import Seekbar from './Seekbar';
import VolumeBar from './VolumeBar';
import LyricsDisplay from './LyricsDisplay';
import QueueDisplay from './QueueDisplay';
import AudioProcessor from './AudioProcessor';
import SleepTimer from './SleepTimer';

const AdvancedPlayer: React.FC = () => {
  const dispatch = useDispatch();
  const {
    activeSong,
    isPlaying,
    volume,
    currentTime,
    duration,
    isMuted,
    playbackRate,
    crossfade,
    gaplessPlayback,
    sleepTimer,
    sleepTimerActive,
    audioNormalization,
    skipSilence,
    tempo,
    pitch,
    showLyrics,
    showQueue,
    favorites,
    recentlyPlayed,
  } = useSelector((state: RootState) => state.player);

  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lyrics, setLyrics] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sleepTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio context and setup
  useEffect(() => {
    const initAudio = async () => {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        
        if (!gainNodeRef.current) {
          gainNodeRef.current = audioContextRef.current.createGain();
          gainNodeRef.current.connect(audioContextRef.current.destination);
        }
      } catch (error) {
        console.error('Error initializing audio context:', error);
        setError('Failed to initialize audio system');
      }
    };

    initAudio();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Handle sleep timer
  useEffect(() => {
    if (sleepTimerActive && sleepTimer > 0) {
      sleepTimerRef.current = setTimeout(() => {
        dispatch(playPause(false));
        dispatch(setSleepTimerActive(false));
      }, sleepTimer * 1000);
    } else if (sleepTimerRef.current) {
      clearTimeout(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }

    return () => {
      if (sleepTimerRef.current) {
        clearTimeout(sleepTimerRef.current);
      }
    };
  }, [sleepTimerActive, sleepTimer, dispatch]);

  // Handle audio element setup
  useEffect(() => {
    if (activeSong && audioRef.current) {
      const audio = audioRef.current;
      
      // Set audio properties
      audio.src = activeSong.audio;
      audio.volume = isMuted ? 0 : volume;
      audio.playbackRate = playbackRate;
      
      // Audio event listeners
      const handleLoadStart = () => setIsLoading(true);
      const handleCanPlay = () => setIsLoading(false);
      const handleError = () => {
        setError('Failed to load audio');
        setIsLoading(false);
      };
      const handleTimeUpdate = () => {
        dispatch(setCurrentTime(audio.currentTime));
      };
      const handleDurationChange = () => {
        dispatch(setDuration(audio.duration));
      };
      const handleEnded = () => {
        // Handle gapless playback or next song
        if (gaplessPlayback) {
          // Implement gapless playback logic
        }
      };

      audio.addEventListener('loadstart', handleLoadStart);
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('error', handleError);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('durationchange', handleDurationChange);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('loadstart', handleLoadStart);
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('durationchange', handleDurationChange);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [activeSong, volume, isMuted, playbackRate, gaplessPlayback, dispatch]);

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          setError('Failed to play audio');
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle playback rate changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Load lyrics when song changes
  useEffect(() => {
    if (activeSong) {
      const loadLyrics = async () => {
        try {
          const lyricsText = await advancedMusicApi.getLyrics(activeSong);
          setLyrics(lyricsText);
        } catch (error) {
          console.error('Error loading lyrics:', error);
          setLyrics('Lyrics not available');
        }
      };
      loadLyrics();
    }
  }, [activeSong]);

  // Add to recently played when song changes
  useEffect(() => {
    if (activeSong) {
      dispatch(addToRecentlyPlayed(activeSong));
    }
  }, [activeSong, dispatch]);

  // Audio processing
  const handleAudioProcessing = async () => {
    if (!activeSong || !audioContextRef.current) return;

    setIsProcessing(true);
    try {
      // Load audio buffer
      const response = await fetch(activeSong.audio);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);

      let processedBuffer = audioBuffer;

      // Apply audio normalization
      if (audioNormalization) {
        processedBuffer = await advancedMusicApi.normalizeAudio(audioBuffer);
      }

      // Apply tempo adjustment
      if (tempo !== 1.0) {
        processedBuffer = await advancedMusicApi.adjustTempo(processedBuffer, tempo);
      }

      // Apply pitch adjustment
      if (pitch !== 0) {
        processedBuffer = await advancedMusicApi.adjustPitch(processedBuffer, pitch);
      }

      // Create new audio source with processed buffer
      if (sourceNodeRef.current) {
        sourceNodeRef.current.disconnect();
      }

      sourceNodeRef.current = audioContextRef.current.createBufferSource();
      sourceNodeRef.current.buffer = processedBuffer;
      sourceNodeRef.current.connect(gainNodeRef.current!);
      sourceNodeRef.current.start();

    } catch (error) {
      console.error('Error processing audio:', error);
      setError('Failed to process audio');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle favorite toggle
  const handleFavoriteToggle = () => {
    if (activeSong) {
      const isFavorite = favorites.some(fav => fav.id === activeSong.id);
      if (isFavorite) {
        dispatch(removeFromFavorites(activeSong.id));
      } else {
        dispatch(addToFavorites(activeSong));
      }
    }
  };

  // Handle sleep timer
  const handleSleepTimer = (minutes: number) => {
    dispatch(setSleepTimer(minutes));
    dispatch(setSleepTimerActive(minutes > 0));
  };

  if (!activeSong) {
    return (
      <div className="flex items-center justify-center h-20 bg-gray-800 text-white">
        <div className="text-center">
          <p className="text-lg font-medium">No song selected</p>
          <p className="text-sm text-gray-400">Choose a song to start playing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-50">
      {/* Main Player Bar */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Song Info */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
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
          <div className="min-w-0 flex-1">
            <h3 className="text-white font-medium truncate">{activeSong.title}</h3>
            <p className="text-gray-400 text-sm truncate">{activeSong.artist}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-4">
          <Controls
            isPlaying={isPlaying}
            onPlayPause={() => dispatch(playPause(!isPlaying))}
            onPrevious={() => dispatch(prevSong(0))}
            onNext={() => dispatch(nextSong(0))}
            onShuffle={() => {}}
            onRepeat={() => {}}
            isLoading={isLoading}
          />
        </div>

        {/* Volume and Additional Controls */}
        <div className="flex items-center space-x-4">
          <VolumeBar
            volume={volume}
            onVolumeChange={(vol) => dispatch(setVolume(vol))}
            isMuted={isMuted}
            onMuteToggle={() => dispatch(setMuted(!isMuted))}
          />
          
          <button
            onClick={handleFavoriteToggle}
            className={`p-2 rounded-full transition-colors ${
              favorites.some(fav => fav.id === activeSong.id)
                ? 'text-red-500 hover:text-red-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </button>

          <button
            onClick={() => dispatch(toggleLyrics())}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>

          <button
            onClick={() => dispatch(toggleQueue())}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <Seekbar
        currentTime={currentTime}
        duration={duration}
        onSeek={(time) => {
          if (audioRef.current) {
            audioRef.current.currentTime = time;
            dispatch(setCurrentTime(time));
          }
        }}
      />

      {/* Advanced Controls Panel */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Audio Processing */}
          <AudioProcessor
            audioNormalization={audioNormalization}
            skipSilence={skipSilence}
            tempo={tempo}
            pitch={pitch}
            onAudioNormalizationChange={(enabled) => dispatch(setAudioNormalization(enabled))}
            onSkipSilenceChange={(enabled) => dispatch(setSkipSilence(enabled))}
            onTempoChange={(tempo) => dispatch(setTempo(tempo))}
            onPitchChange={(pitch) => dispatch(setPitch(pitch))}
            onProcess={handleAudioProcessing}
            isProcessing={isProcessing}
          />

          {/* Sleep Timer */}
          <SleepTimer
            sleepTimer={sleepTimer}
            sleepTimerActive={sleepTimerActive}
            onSleepTimerChange={handleSleepTimer}
            onSleepTimerToggle={(active) => dispatch(setSleepTimerActive(active))}
          />

          {/* Playback Settings */}
          <div className="space-y-3">
            <h4 className="text-white font-medium">Playback Settings</h4>
            
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={crossfade}
                  onChange={(e) => dispatch(setCrossfade(e.target.checked))}
                  className="rounded"
                />
                <span className="text-gray-300 text-sm">Crossfade</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={gaplessPlayback}
                  onChange={(e) => dispatch(setGaplessPlayback(e.target.checked))}
                  className="rounded"
                />
                <span className="text-gray-300 text-sm">Gapless Playback</span>
              </label>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-300 text-sm">Playback Rate</label>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={playbackRate}
                onChange={(e) => dispatch(setPlaybackRate(parseFloat(e.target.value)))}
                className="w-full"
              />
              <div className="text-gray-400 text-xs text-center">{playbackRate}x</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lyrics Display */}
      {showLyrics && (
        <LyricsDisplay
          lyrics={lyrics}
          currentTime={currentTime}
          onClose={() => dispatch(toggleLyrics())}
        />
      )}

      {/* Queue Display */}
      {showQueue && (
        <QueueDisplay
          onClose={() => dispatch(toggleQueue())}
        />
      )}

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        preload="metadata"
        crossOrigin="anonymous"
      />

      {/* Error Display */}
      {error && (
        <div className="bg-red-600 text-white p-2 text-center">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};

export default AdvancedPlayer;
