import React, { useRef, useEffect } from 'react';
import { useAppSelector } from '../../redux/hooks';

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

  useEffect(() => {
    if (ref.current) {
      if (isPlaying) {
        ref.current.play();
      } else {
        ref.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (ref.current) {
      ref.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (ref.current) {
      ref.current.currentTime = seekTime;
    }
  }, [seekTime]);

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
