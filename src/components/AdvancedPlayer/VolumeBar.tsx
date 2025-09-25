import React, { useState, useRef } from 'react';

interface VolumeBarProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  isMuted: boolean;
  onMuteToggle: () => void;
}

const VolumeBar: React.FC<VolumeBarProps> = ({
  volume,
  onVolumeChange,
  isMuted,
  onMuteToggle,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState(0);
  const volumeBarRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeBarRef.current) return;
    
    setIsDragging(true);
    const rect = volumeBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newVolume = percentage;
    
    setDragValue(newVolume);
    onVolumeChange(newVolume);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !volumeBarRef.current) return;
    
    const rect = volumeBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newVolume = percentage;
    
    setDragValue(newVolume);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      onVolumeChange(dragValue);
      setIsDragging(false);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!volumeBarRef.current) return;
    
    setIsDragging(true);
    const rect = volumeBarRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const clickX = touch.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newVolume = percentage;
    
    setDragValue(newVolume);
    onVolumeChange(newVolume);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !volumeBarRef.current) return;
    
    e.preventDefault();
    const rect = volumeBarRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const clickX = touch.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    const newVolume = percentage;
    
    setDragValue(newVolume);
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      onVolumeChange(dragValue);
      setIsDragging(false);
    }
  };

  // Add global mouse/touch event listeners when dragging
  React.useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (!volumeBarRef.current) return;
        
        const rect = volumeBarRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, clickX / rect.width));
        const newVolume = percentage;
        
        setDragValue(newVolume);
      };

      const handleGlobalMouseUp = () => {
        onVolumeChange(dragValue);
        setIsDragging(false);
      };

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, dragValue, onVolumeChange]);

  const progress = isDragging ? dragValue * 100 : volume * 100;
  const displayVolume = isDragging ? dragValue : volume;

  const getVolumeIcon = () => {
    if (isMuted || displayVolume === 0) {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L5.5 13H2a1 1 0 01-1-1V8a1 1 0 011-1h3.5l2.883-3.793a1 1 0 011.617.793zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      );
    } else if (displayVolume < 0.5) {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L5.5 13H2a1 1 0 01-1-1V8a1 1 0 011-1h3.5l2.883-3.793a1 1 0 011.617.793z" clipRule="evenodd" />
        </svg>
      );
    } else if (displayVolume < 0.8) {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L5.5 13H2a1 1 0 01-1-1V8a1 1 0 011-1h3.5l2.883-3.793a1 1 0 011.617.793zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      );
    } else {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L5.5 13H2a1 1 0 01-1-1V8a1 1 0 011-1h3.5l2.883-3.793a1 1 0 011.617.793zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      );
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Mute Button */}
      <button
        onClick={onMuteToggle}
        className="p-1 text-gray-400 hover:text-white transition-colors"
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {getVolumeIcon()}
      </button>

      {/* Volume Bar */}
      <div
        ref={volumeBarRef}
        className="w-20 h-1 bg-gray-700 rounded-full cursor-pointer relative group"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Volume Fill */}
        <div
          className="h-full bg-white rounded-full transition-all duration-100"
          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        />
        
        {/* Volume Handle */}
        <div
          className="absolute top-1/2 w-3 h-3 bg-white rounded-full transform -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ left: `${Math.max(0, Math.min(100, progress))}%` }}
        />
      </div>

      {/* Volume Percentage */}
      <span className="text-gray-400 text-xs min-w-[30px]">
        {Math.round(displayVolume * 100)}%
      </span>
    </div>
  );
};

export default VolumeBar;
