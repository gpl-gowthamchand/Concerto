import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  audio: string;
  image: string;
  genre?: string;
  source?: 'local' | 'online' | 'youtube' | 'spotify' | 'jiosaavn' | 'wynk' | 'deezer' | 'soundcloud';
  platform?: string;
  quality?: string;
}

export interface PlayerState {
  currentSongs: Song[];
  currentIndex: number;
  isActive: boolean;
  isPlaying: boolean;
  activeSong: Song | null;
  volume: number;
  repeat: boolean;
  shuffle: boolean;
  currentTime: number;
  duration: number;
}

const initialState: PlayerState = {
  currentSongs: [],
  currentIndex: 0,
  isActive: false,
  isPlaying: false,
  activeSong: null,
  volume: 0.5,
  repeat: false,
  shuffle: false,
  currentTime: 0,
  duration: 0,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setActiveSong: (state, action: PayloadAction<{ song: Song; data: Song[]; i: number }>) => {
      state.activeSong = action.payload.song;
      state.currentSongs = action.payload.data;
      state.currentIndex = action.payload.i;
      state.isActive = true;
    },

    nextSong: (state, action: PayloadAction<number>) => {
      state.activeSong = state.currentSongs[action.payload];
      state.currentIndex = action.payload;
      state.isActive = true;
    },

    prevSong: (state, action: PayloadAction<number>) => {
      state.activeSong = state.currentSongs[action.payload];
      state.currentIndex = action.payload;
      state.isActive = true;
    },

    playPause: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },

    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },

    setRepeat: (state, action: PayloadAction<boolean>) => {
      state.repeat = action.payload;
    },

    setShuffle: (state, action: PayloadAction<boolean>) => {
      state.shuffle = action.payload;
    },

    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },

    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },

    setPlaylist: (state, action: PayloadAction<Song[]>) => {
      state.currentSongs = action.payload;
    },
  },
});

export const {
  setActiveSong,
  nextSong,
  prevSong,
  playPause,
  setVolume,
  setRepeat,
  setShuffle,
  setCurrentTime,
  setDuration,
  setPlaylist,
} = playerSlice.actions;

export default playerSlice.reducer;
