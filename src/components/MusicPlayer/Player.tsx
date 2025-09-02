import React, { useRef, useEffect } from 'react';
import { useAppSelector } from '../../redux/hooks';
import StreamingPlayer from '../StreamingPlayer';

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
  const ref = useRef<HTMLAudioElement>(null);
  const { activeSong, isPlaying, volume, repeat } = useAppSelector((state) => state.player);

  // Check if this is an online streaming track
  const isOnlineTrack = activeSong && typeof activeSong === 'object' && 'source' in activeSong && 
    (activeSong.source === 'youtube' || activeSong.source === 'spotify' || 
     activeSong.source === 'jiosaavn' || activeSong.source === 'wynk' || 
     activeSong.source === 'deezer' || activeSong.source === 'soundcloud');

  useEffect(() => {
    if (ref.current && !isOnlineTrack) {
      if (isPlaying) {
        ref.current.play();
      } else {
        ref.current.pause();
      }
    }
  }, [isPlaying, activeSong, isOnlineTrack]);

  useEffect(() => {
    if (ref.current && !isOnlineTrack) {
      ref.current.volume = volume;
    }
  }, [volume, isOnlineTrack]);

  useEffect(() => {
    if (ref.current && !isOnlineTrack) {
      ref.current.currentTime = seekTime;
    }
  }, [seekTime, isOnlineTrack]);

  // If it's an online track, use the StreamingPlayer
  if (isOnlineTrack && activeSong) {
    return (
      <div className="w-full">
        <StreamingPlayer
          song={activeSong as any}
          isPlaying={isPlaying}
          onEnded={onEnded}
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
