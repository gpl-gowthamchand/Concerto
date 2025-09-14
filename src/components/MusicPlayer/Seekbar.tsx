import React, { useState, useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setCurrentTime } from '../../redux/features/playerSlice';

interface SeekbarProps {
  onSeek: (time: number) => void;
}

const Seekbar: React.FC<SeekbarProps> = React.memo(({ onSeek }) => {
  const dispatch = useAppDispatch();
  const { currentTime, duration } = useAppSelector((state) => state.player);
  const [seekTime, setSeekTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Only update appTime when not dragging to prevent flickering
  const appTime = useMemo(() => {
    return isDragging ? seekTime : currentTime;
  }, [isDragging, seekTime, currentTime]);

  const formatTime = useCallback((time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const handleSeek = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setSeekTime(value);
    setIsDragging(true);
  }, []);

  const handleSeekEnd = useCallback(() => {
    setIsDragging(false);
    dispatch(setCurrentTime(seekTime));
    onSeek(seekTime);
  }, [dispatch, seekTime, onSeek]);

  const handleSeekStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  return (
    <div className="flex items-center space-x-2 w-full max-w-md">
      <span className="text-xs text-gray-500 w-8 text-right">
        {formatTime(appTime)}
      </span>
      <input
        type="range"
        value={appTime}
        min={0}
        max={duration || 0}
        onInput={handleSeek}
        onChange={handleSeekEnd}
        onMouseDown={handleSeekStart}
        onTouchStart={handleSeekStart}
        className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        style={{
          background: `linear-gradient(to right, #1f2937 0%, #1f2937 ${(appTime / (duration || 1)) * 100}%, #e5e7eb ${(appTime / (duration || 1)) * 100}%, #e5e7eb 100%)`
        }}
      />
      <span className="text-xs text-gray-500 w-8 text-left">
        {formatTime(duration)}
      </span>
    </div>
  );
});

Seekbar.displayName = 'Seekbar';

export default Seekbar;
