import React, { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { playPause, nextSong, prevSong, setRepeat, setShuffle } from '../../redux/features/playerSlice';

interface ControlsProps {
  isPlaying: boolean;
}

const Controls: React.FC<ControlsProps> = React.memo(({ isPlaying }) => {
  const dispatch = useAppDispatch();
  const { currentSongs, currentIndex, repeat, shuffle } = useAppSelector((state) => state.player);

  const handlePlayPause = useCallback(() => {
    if (!currentSongs.length) return;
    dispatch(playPause(!isPlaying));
  }, [dispatch, isPlaying, currentSongs.length]);

  const handleNextSong = useCallback(() => {
    if (!currentSongs.length) return;
    dispatch(playPause(false));

    if (!shuffle) {
      dispatch(nextSong((currentIndex + 1) % currentSongs.length));
    } else {
      dispatch(nextSong(Math.floor(Math.random() * currentSongs.length)));
    }
  }, [dispatch, currentSongs.length, shuffle, currentIndex]);

  const handlePrevSong = useCallback(() => {
    if (!currentSongs.length) return;
    if (currentIndex === 0) {
      dispatch(prevSong(currentSongs.length - 1));
    } else if (shuffle) {
      dispatch(prevSong(Math.floor(Math.random() * currentSongs.length)));
    } else {
      dispatch(prevSong(currentIndex - 1));
    }
  }, [dispatch, currentSongs.length, currentIndex, shuffle]);

  const handleShuffle = useCallback(() => {
    dispatch(setShuffle(!shuffle));
  }, [dispatch, shuffle]);

  const handleRepeat = useCallback(() => {
    dispatch(setRepeat(!repeat));
  }, [dispatch, repeat]);

  return (
    <div className="flex items-center space-x-4">
      {/* Shuffle */}
      <button
        onClick={handleShuffle}
        className={`p-2 rounded-full transition-colors ${
          shuffle ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Previous */}
      <button
        onClick={handlePrevSong}
        className="p-2 text-gray-700 hover:text-gray-900 transition-colors"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 9H17a1 1 0 110 2h-5.586l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Play/Pause */}
      <button
        onClick={handlePlayPause}
        className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
      >
        {isPlaying ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* Next */}
      <button
        onClick={handleNextSong}
        className="p-2 text-gray-700 hover:text-gray-900 transition-colors"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Repeat */}
      <button
        onClick={handleRepeat}
        className={`p-2 rounded-full transition-colors ${
          repeat ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
});

Controls.displayName = 'Controls';

export default Controls;
