import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { nextSong, prevSong, playPause, setRepeat, setShuffle, setCurrentTime, setDuration, setVolume } from '../../redux/features/playerSlice';
import Controls from './Controls';
import Player from './Player';
import Seekbar from './Seekbar';
import Track from './Track';
import VolumeBar from './VolumeBar';

const MusicPlayer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { 
    activeSong, 
    currentSongs, 
    currentIndex, 
    isActive, 
    isPlaying, 
    volume, 
    repeat, 
    shuffle 
  } = useAppSelector((state) => state.player);

  const [seekTime, setSeekTime] = useState(0);
  const [appTime, setAppTime] = useState(0);
  const [duration, setDurationState] = useState(0);

  useEffect(() => {
    if (currentSongs.length) dispatch(playPause(true));
  }, [currentIndex, dispatch, currentSongs.length]);

  const handlePlayPause = () => {
    if (!isActive) return;
    dispatch(playPause(!isPlaying));
  };

  const handleNextSong = () => {
    dispatch(playPause(false));

    if (!shuffle) {
      dispatch(nextSong((currentIndex + 1) % currentSongs.length));
    } else {
      dispatch(nextSong(Math.floor(Math.random() * currentSongs.length)));
    }
  };

  const handlePrevSong = () => {
    if (currentIndex === 0) {
      dispatch(prevSong(currentSongs.length - 1));
    } else if (shuffle) {
      dispatch(prevSong(Math.floor(Math.random() * currentSongs.length)));
    } else {
      dispatch(prevSong(currentIndex - 1));
    }
  };

  const handleTimeUpdate = (event: React.SyntheticEvent<HTMLAudioElement>) => {
    setAppTime(event.currentTarget.currentTime);
    dispatch(setCurrentTime(event.currentTarget.currentTime));
  };

  const handleLoadedData = (event: React.SyntheticEvent<HTMLAudioElement>) => {
    setDurationState(event.currentTarget.duration);
    dispatch(setDuration(event.currentTarget.duration));
  };

  if (!activeSong?.title) return null;

  return (
    <div className="relative px-6 w-full flex items-center justify-between">
      <Track isPlaying={isPlaying} isActive={isActive} activeSong={activeSong} />
      
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-4">
        <Controls
          isPlaying={isPlaying}
          repeat={repeat}
          setRepeat={(repeat) => dispatch(setRepeat(repeat))}
          shuffle={shuffle}
          setShuffle={(shuffle) => dispatch(setShuffle(shuffle))}
          currentSongs={currentSongs}
          handlePlayPause={handlePlayPause}
          handlePrevSong={handlePrevSong}
          handleNextSong={handleNextSong}
        />
        <Seekbar
          value={appTime}
          min={0}
          max={duration}
          onInput={(event) => setSeekTime(Number(event.target.value))}
          setSeekTime={setSeekTime}
          appTime={appTime}
        />
        <Player
          seekTime={seekTime}
          onEnded={handleNextSong}
          onTimeUpdate={handleTimeUpdate}
          onLoadedData={handleLoadedData}
        />
      </div>

      <VolumeBar
        value={volume}
        min={0}
        max={1}
        onChange={(event) => dispatch(setVolume(Number(event.target.value)))}
        setVolume={(volume) => dispatch(setVolume(volume))}
      />
    </div>
  );
};

export default MusicPlayer;
