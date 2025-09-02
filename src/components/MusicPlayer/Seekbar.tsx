import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setCurrentTime } from '../../redux/features/playerSlice';

const Seekbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentTime, duration } = useAppSelector((state) => state.player);
  const [seekTime, setSeekTime] = useState(0);
  const [appTime, setAppTime] = useState(0);

  useEffect(() => {
    setAppTime(currentTime);
  }, [currentTime]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setSeekTime(value);
  };

  const handleSeekEnd = () => {
    dispatch(setCurrentTime(seekTime));
  };

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
};

export default Seekbar;
