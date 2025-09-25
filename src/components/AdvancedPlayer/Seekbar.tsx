import React, { useState, useRef } from 'react';

interface SeekbarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

const Seekbar: React.FC<SeekbarProps> = ({ currentTime, duration, onSeek }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState(0);
  const seekbarRef = useRef<HTMLDivElement>(null);

  const formatTime = (time: number): string => {
    if (isNaN(time) || !isFinite(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!seekbarRef.current) return;
    
    setIsDragging(true);
    const rect = seekbarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    setDragValue(newTime);
    onSeek(newTime);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !seekbarRef.current) return;
    
    const rect = seekbarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percentage * duration;
    
    setDragValue(newTime);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      onSeek(dragValue);
      setIsDragging(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!seekbarRef.current) return;
    
    setIsDragging(true);
    const rect = seekbarRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const clickX = touch.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    setDragValue(newTime);
    onSeek(newTime);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !seekbarRef.current) return;
    
    e.preventDefault();
    const rect = seekbarRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const clickX = touch.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = percentage * duration;
    
    setDragValue(newTime);
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      onSeek(dragValue);
      setIsDragging(false);
    }
  };

  // Add global mouse/touch event listeners when dragging
  React.useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (!seekbarRef.current) return;
        
        const rect = seekbarRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, clickX / rect.width));
        const newTime = percentage * duration;
        
        setDragValue(newTime);
      };

      const handleGlobalMouseUp = () => {
        onSeek(dragValue);
        setIsDragging(false);
      };

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, dragValue, duration, onSeek]);

  const progress = isDragging ? (dragValue / duration) * 100 : (currentTime / duration) * 100;
  const displayTime = isDragging ? dragValue : currentTime;

  return (
    <div className="px-4 py-2">
      <div className="flex items-center space-x-3">
        {/* Current Time */}
        <span className="text-gray-400 text-sm font-mono min-w-[40px]">
          {formatTime(displayTime)}
        </span>

        {/* Progress Bar */}
        <div
          ref={seekbarRef}
          className="flex-1 h-1 bg-gray-700 rounded-full cursor-pointer relative group"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Progress Fill */}
          <div
            className="h-full bg-white rounded-full transition-all duration-100"
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
          
          {/* Progress Handle */}
          <div
            className="absolute top-1/2 w-4 h-4 bg-white rounded-full transform -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ left: `${Math.max(0, Math.min(100, progress))}%` }}
          />
          
          {/* Hover Handle */}
          <div
            className="absolute top-1/2 w-4 h-4 bg-white rounded-full transform -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ left: `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>

        {/* Duration */}
        <span className="text-gray-400 text-sm font-mono min-w-[40px]">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
};

export default Seekbar;
