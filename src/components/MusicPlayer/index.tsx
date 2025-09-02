import React from 'react';
import { useAppSelector } from '../../redux/hooks';
import Controls from './Controls';
import Seekbar from './Seekbar';
import VolumeBar from './VolumeBar';
import Track from './Track';
import Player from './Player';

const MusicPlayer: React.FC = () => {
  const { activeSong, isActive, isPlaying } = useAppSelector((state) => state.player);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-200 flex items-center px-4 z-50">
      <div className="flex items-center justify-between w-full">
        {/* Left - Track Info */}
        <div className="flex items-center flex-1 min-w-0">
          {activeSong?.title ? (
            <Track isActive={isActive} isPlaying={isPlaying} song={activeSong} />
          ) : (
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">No track playing</p>
                <p className="text-xs text-gray-500">Select a track to start listening</p>
              </div>
            </div>
          )}
        </div>

        {/* Center - Controls */}
        <div className="flex flex-col items-center flex-1 max-w-md">
          <Controls isPlaying={isPlaying} />
          <Seekbar />
        </div>

        {/* Right - Volume */}
        <div className="flex items-center justify-end flex-1 min-w-0">
          <VolumeBar />
        </div>
      </div>

      {/* Hidden Audio Player */}
      <Player 
        seekTime={0}
        onEnded={() => {}}
        onTimeUpdate={() => {}}
        onLoadedData={() => {}}
      />
    </div>
  );
};

export default MusicPlayer;
