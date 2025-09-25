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
  // New fields for better streaming
  streamUrl?: string;
  previewUrl?: string;
  fullTrackUrl?: string;
  // Enhanced fields for advanced features
  isDownloaded?: boolean;
  downloadPath?: string;
  lyrics?: string;
  isFavorite?: boolean;
  playCount?: number;
  lastPlayed?: Date;
  rating?: number;
  // Audio processing
  audioNormalization?: boolean;
  tempo?: number;
  pitch?: number;
  // Metadata
  year?: number;
  language?: string;
  explicit?: boolean;
  // Social features
  isLiked?: boolean;
  isDisliked?: boolean;
  shareCount?: number;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  image?: string;
  songs: Song[];
  isPublic: boolean;
  isCollaborative: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  playCount: number;
  followers: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  audioQuality: 'low' | 'medium' | 'high' | 'lossless';
  autoDownload: boolean;
  skipSilence: boolean;
  audioNormalization: boolean;
  crossfade: boolean;
  gaplessPlayback: boolean;
  sleepTimer: number;
  language: string;
  region: string;
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
  // Enhanced player features
  isMuted: boolean;
  playbackRate: number;
  crossfade: boolean;
  gaplessPlayback: boolean;
  sleepTimer: number;
  sleepTimerActive: boolean;
  // Audio processing
  audioNormalization: boolean;
  skipSilence: boolean;
  tempo: number;
  pitch: number;
  // Queue management
  queue: Song[];
  history: Song[];
  // User data
  favorites: Song[];
  playlists: Playlist[];
  recentlyPlayed: Song[];
  downloadedSongs: Song[];
  // UI state
  showLyrics: boolean;
  showQueue: boolean;
  showPlaylists: boolean;
  // Audio context
  audioContext: AudioContext | null;
  audioBuffer: AudioBuffer | null;
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
  // Enhanced player features
  isMuted: false,
  playbackRate: 1.0,
  crossfade: false,
  gaplessPlayback: true,
  sleepTimer: 0,
  sleepTimerActive: false,
  // Audio processing
  audioNormalization: true,
  skipSilence: false,
  tempo: 1.0,
  pitch: 0,
  // Queue management
  queue: [],
  history: [],
  // User data
  favorites: [],
  playlists: [],
  recentlyPlayed: [],
  downloadedSongs: [],
  // UI state
  showLyrics: false,
  showQueue: false,
  showPlaylists: false,
  // Audio context
  audioContext: null,
  audioBuffer: null,
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

    // Enhanced player controls
    setMuted: (state, action: PayloadAction<boolean>) => {
      state.isMuted = action.payload;
    },

    setPlaybackRate: (state, action: PayloadAction<number>) => {
      state.playbackRate = action.payload;
    },

    setCrossfade: (state, action: PayloadAction<boolean>) => {
      state.crossfade = action.payload;
    },

    setGaplessPlayback: (state, action: PayloadAction<boolean>) => {
      state.gaplessPlayback = action.payload;
    },

    setSleepTimer: (state, action: PayloadAction<number>) => {
      state.sleepTimer = action.payload;
    },

    setSleepTimerActive: (state, action: PayloadAction<boolean>) => {
      state.sleepTimerActive = action.payload;
    },

    // Audio processing
    setAudioNormalization: (state, action: PayloadAction<boolean>) => {
      state.audioNormalization = action.payload;
    },

    setSkipSilence: (state, action: PayloadAction<boolean>) => {
      state.skipSilence = action.payload;
    },

    setTempo: (state, action: PayloadAction<number>) => {
      state.tempo = action.payload;
    },

    setPitch: (state, action: PayloadAction<number>) => {
      state.pitch = action.payload;
    },

    // Queue management
    addToQueue: (state, action: PayloadAction<Song>) => {
      state.queue.push(action.payload);
    },

    removeFromQueue: (state, action: PayloadAction<string>) => {
      state.queue = state.queue.filter(song => song.id !== action.payload);
    },

    clearQueue: (state) => {
      state.queue = [];
    },

    addToHistory: (state, action: PayloadAction<Song>) => {
      state.history.unshift(action.payload);
      if (state.history.length > 50) {
        state.history = state.history.slice(0, 50);
      }
    },

    // User data management
    addToFavorites: (state, action: PayloadAction<Song>) => {
      const song = action.payload;
      if (!state.favorites.find(fav => fav.id === song.id)) {
        state.favorites.push(song);
      }
    },

    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(song => song.id !== action.payload);
    },

    addToRecentlyPlayed: (state, action: PayloadAction<Song>) => {
      const song = action.payload;
      state.recentlyPlayed = state.recentlyPlayed.filter(s => s.id !== song.id);
      state.recentlyPlayed.unshift(song);
      if (state.recentlyPlayed.length > 100) {
        state.recentlyPlayed = state.recentlyPlayed.slice(0, 100);
      }
    },

    addToDownloaded: (state, action: PayloadAction<Song>) => {
      const song = action.payload;
      if (!state.downloadedSongs.find(dl => dl.id === song.id)) {
        state.downloadedSongs.push(song);
      }
    },

    removeFromDownloaded: (state, action: PayloadAction<string>) => {
      state.downloadedSongs = state.downloadedSongs.filter(song => song.id !== action.payload);
    },

    // Playlist management
    createPlaylist: (state, action: PayloadAction<Playlist>) => {
      state.playlists.push(action.payload);
    },

    updatePlaylist: (state, action: PayloadAction<Playlist>) => {
      const index = state.playlists.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.playlists[index] = action.payload;
      }
    },

    deletePlaylist: (state, action: PayloadAction<string>) => {
      state.playlists = state.playlists.filter(p => p.id !== action.payload);
    },

    // UI state
    toggleLyrics: (state) => {
      state.showLyrics = !state.showLyrics;
    },

    toggleQueue: (state) => {
      state.showQueue = !state.showQueue;
    },

    togglePlaylists: (state) => {
      state.showPlaylists = !state.showPlaylists;
    },

    // Audio context
    setAudioContext: (state, action: PayloadAction<AudioContext | null>) => {
      state.audioContext = action.payload;
    },

    setAudioBuffer: (state, action: PayloadAction<AudioBuffer | null>) => {
      state.audioBuffer = action.payload;
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
  // Enhanced player controls
  setMuted,
  setPlaybackRate,
  setCrossfade,
  setGaplessPlayback,
  setSleepTimer,
  setSleepTimerActive,
  // Audio processing
  setAudioNormalization,
  setSkipSilence,
  setTempo,
  setPitch,
  // Queue management
  addToQueue,
  removeFromQueue,
  clearQueue,
  addToHistory,
  // User data management
  addToFavorites,
  removeFromFavorites,
  addToRecentlyPlayed,
  addToDownloaded,
  removeFromDownloaded,
  // Playlist management
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  // UI state
  toggleLyrics,
  toggleQueue,
  togglePlaylists,
  // Audio context
  setAudioContext,
  setAudioBuffer,
} = playerSlice.actions;

export default playerSlice.reducer;
