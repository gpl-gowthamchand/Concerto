import React, { useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { playPause } from '../../redux/features/playerSlice';
import UnifiedPlayer from '../UnifiedPlayer';

interface PlayerProps {
  seekTime: number;
  onEnded: () => void;
  onTimeUpdate: (event: React.SyntheticEvent<HTMLAudioElement>) => void;
  onLoadedData: (event: React.SyntheticEvent<HTMLAudioElement>) => void;
}

const Player: React.FC<PlayerProps> = ({ 
  seekTime, 
  onEnded, 
  onTimeUpdate, 
  onLoadedData 
}) => {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLAudioElement>(null);
  const { activeSong, isPlaying, volume, repeat } = useAppSelector((state) => state.player);

  // Check if this is an online streaming track (not local)
  const isOnlineTrack = activeSong && typeof activeSong === 'object' && 'source' in activeSong && 
    (activeSong.source === 'youtube' || activeSong.source === 'spotify' || 
     activeSong.source === 'jiosaavn' || activeSong.source === 'wynk' || 
     activeSong.source === 'deezer' || activeSong.source === 'soundcloud');


  useEffect(() => {
    if (ref.current && !isOnlineTrack) {
      if (isPlaying) {
        ref.current.play().catch(error => {
          console.error('Audio playback failed:', error);
          dispatch(playPause(false));
        });
      } else {
        ref.current.pause();
      }
    }
  }, [isPlaying, activeSong, isOnlineTrack, dispatch]);

  useEffect(() => {
    if (ref.current && !isOnlineTrack) {
      ref.current.volume = volume;
    }
  }, [volume, isOnlineTrack]);

  useEffect(() => {
    if (ref.current && !isOnlineTrack && seekTime > 0) {
      ref.current.currentTime = seekTime;
    }
  }, [seekTime, isOnlineTrack]);

  // If it's an online track, use the UnifiedPlayer
  if (isOnlineTrack && activeSong) {
    return (
      <div className="w-full">
        <UnifiedPlayer
          song={activeSong as any}
          isPlaying={isPlaying}
          onEnded={onEnded}
          onTimeUpdate={(time) => {
            // Handle time updates for online tracks
            console.log('Online track time update:', time);
          }}
          onDurationChange={(duration) => {
            // Handle duration changes for online tracks
            console.log('Online track duration:', duration);
          }}
        />
      </div>
    );
  }

  // For local tracks, use the regular audio element
  return (
    <audio
      src={activeSong?.audio}
      ref={ref}
      loop={repeat}
      onEnded={onEnded}
      onTimeUpdate={onTimeUpdate}
      onLoadedData={onLoadedData}
    />
  );
};

export default Player;
