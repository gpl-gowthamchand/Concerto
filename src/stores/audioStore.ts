import { create } from 'zustand';
import { MusicSearchResult } from '../services/musicApi';

interface AudioState {
  // Current track
  currentTrack: MusicSearchResult | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  
  // Playback modes
  repeat: 'none' | 'one' | 'all';
  shuffle: boolean;
  
  // Queue
  queue: MusicSearchResult[];
  queueIndex: number;
  
  // History
  history: MusicSearchResult[];
  
  // Actions
  play: (track: MusicSearchResult) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  next: () => void;
  previous: () => void;
  addToQueue: (track: MusicSearchResult) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  playQueue: (tracks: MusicSearchResult[], startIndex?: number) => void;
  addToHistory: (track: MusicSearchResult) => void;
  clearHistory: () => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  // Initial state
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  repeat: 'none',
  shuffle: false,
  queue: [],
  queueIndex: -1,
  history: [],

  // Actions
  play: (track: MusicSearchResult) => {
    set({
      currentTrack: track,
      isPlaying: true,
      currentTime: 0,
      duration: track.duration || 0
    });
    get().addToHistory(track);
  },

  pause: () => {
    set({ isPlaying: false });
  },

  resume: () => {
    set({ isPlaying: true });
  },

  stop: () => {
    set({
      isPlaying: false,
      currentTime: 0,
      currentTrack: null
    });
  },

  seek: (time: number) => {
    set({ currentTime: Math.max(0, Math.min(time, get().duration)) });
  },

  setVolume: (volume: number) => {
    set({ volume: Math.max(0, Math.min(1, volume)) });
  },

  toggleMute: () => {
    set({ isMuted: !get().isMuted });
  },

  toggleRepeat: () => {
    const { repeat } = get();
    const newRepeat = repeat === 'none' ? 'all' : repeat === 'all' ? 'one' : 'none';
    set({ repeat: newRepeat });
  },

  toggleShuffle: () => {
    set({ shuffle: !get().shuffle });
  },

  next: () => {
    const { queue, queueIndex, repeat, currentTrack } = get();
    
    if (repeat === 'one' && currentTrack) {
      // Repeat current track
      set({ currentTime: 0 });
      return;
    }

    if (queue.length === 0) {
      // No queue, stop playback
      set({ isPlaying: false, currentTrack: null });
      return;
    }

    let nextIndex = queueIndex + 1;
    
    if (nextIndex >= queue.length) {
      if (repeat === 'all') {
        // Loop back to start
        nextIndex = 0;
      } else {
        // Stop playback
        set({ isPlaying: false, currentTrack: null });
        return;
      }
    }

    const nextTrack = queue[nextIndex];
    set({
      currentTrack: nextTrack,
      queueIndex: nextIndex,
      currentTime: 0,
      duration: nextTrack.duration || 0
    });
    get().addToHistory(nextTrack);
  },

  previous: () => {
    const { queue, queueIndex, currentTrack } = get();
    
    if (queue.length === 0) {
      // No queue, restart current track
      if (currentTrack) {
        set({ currentTime: 0 });
      }
      return;
    }

    let prevIndex = queueIndex - 1;
    
    if (prevIndex < 0) {
      // Go to last track
      prevIndex = queue.length - 1;
    }

    const prevTrack = queue[prevIndex];
    set({
      currentTrack: prevTrack,
      queueIndex: prevIndex,
      currentTime: 0,
      duration: prevTrack.duration || 0
    });
    get().addToHistory(prevTrack);
  },

  addToQueue: (track: MusicSearchResult) => {
    const { queue } = get();
    set({ queue: [...queue, track] });
  },

  removeFromQueue: (index: number) => {
    const { queue, queueIndex } = get();
    const newQueue = queue.filter((_, i) => i !== index);
    let newQueueIndex = queueIndex;
    
    if (index <= queueIndex && queueIndex > 0) {
      newQueueIndex--;
    }
    
    set({ queue: newQueue, queueIndex: newQueueIndex });
  },

  clearQueue: () => {
    set({ queue: [], queueIndex: -1 });
  },

  playQueue: (tracks: MusicSearchResult[], startIndex: number = 0) => {
    if (tracks.length === 0) return;
    
    const startTrack = tracks[startIndex];
    set({
      queue: tracks,
      queueIndex: startIndex,
      currentTrack: startTrack,
      isPlaying: true,
      currentTime: 0,
      duration: startTrack.duration || 0
    });
    get().addToHistory(startTrack);
  },

  addToHistory: (track: MusicSearchResult) => {
    const { history } = get();
    const newHistory = [track, ...history.filter(t => t.id !== track.id)].slice(0, 50);
    set({ history: newHistory });
  },

  clearHistory: () => {
    set({ history: [] });
  }
}));
