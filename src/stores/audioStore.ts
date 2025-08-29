import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Track, AudioState, QueueItem } from '../types';

interface AudioStore extends AudioState {
  // Actions
  play: (track?: Track) => void;
  pause: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  addToQueue: (track: Track, source?: string) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  setQueue: (tracks: Track[], source?: string) => void;
  updateCurrentTrack: (track: Track) => void;
  addToHistory: (track: Track) => void;
  clearHistory: () => void;
  reset: () => void;
}

const initialState: AudioState = {
  isPlaying: false,
  currentTrack: null,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  playbackRate: 1,
  repeat: 'none',
  shuffle: false,
  queue: [],
  history: [],
};

export const useAudioStore = create<AudioStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      play: (track?: Track) => {
        if (track) {
          set({ currentTrack: track, isPlaying: true, currentTime: 0 });
        } else {
          set({ isPlaying: true });
        }
      },

      pause: () => set({ isPlaying: false }),

      stop: () => set({ isPlaying: false, currentTime: 0 }),

      next: () => {
        const { queue, currentTrack, repeat, shuffle } = get();
        if (queue.length === 0) return;

        let nextIndex = 0;
        if (currentTrack) {
          const currentIndex = queue.findIndex(item => item.track.id === currentTrack.id);
          if (currentIndex !== -1 && currentIndex < queue.length - 1) {
            nextIndex = currentIndex + 1;
          }
        }

        const nextItem = queue[nextIndex];
        if (nextItem) {
          set({ 
            currentTrack: nextItem.track, 
            isPlaying: true, 
            currentTime: 0 
          });
        }
      },

      previous: () => {
        const { queue, currentTrack, repeat, shuffle } = get();
        if (queue.length === 0) return;

        let prevIndex = 0;
        if (currentTrack) {
          const currentIndex = queue.findIndex(item => item.track.id === currentTrack.id);
          if (currentIndex > 0) {
            prevIndex = currentIndex - 1;
          }
        }

        const prevItem = queue[prevIndex];
        if (prevItem) {
          set({ 
            currentTrack: prevItem.track, 
            isPlaying: true, 
            currentTime: 0 
          });
        }
      },

      seek: (time: number) => set({ currentTime: Math.max(0, Math.min(time, get().duration)) }),

      setVolume: (volume: number) => set({ volume: Math.max(0, Math.min(1, volume)) }),

      toggleMute: () => set(state => ({ isMuted: !state.isMuted })),

      setPlaybackRate: (rate: number) => set({ playbackRate: rate }),

      toggleRepeat: () => {
        const { repeat } = get();
        const nextRepeat = repeat === 'none' ? 'all' : repeat === 'all' ? 'one' : 'none';
        set({ repeat: nextRepeat });
      },

      toggleShuffle: () => set(state => ({ shuffle: !state.shuffle })),

      addToQueue: (track: Track, source = 'user') => {
        const queueItem: QueueItem = {
          track,
          addedAt: new Date(),
          addedBy: 'user',
          source: source as any,
        };
        set(state => ({ queue: [...state.queue, queueItem] }));
      },

      removeFromQueue: (index: number) => {
        set(state => ({
          queue: state.queue.filter((_, i) => i !== index)
        }));
      },

      clearQueue: () => set({ queue: [] }),

      setQueue: (tracks: Track[], source = 'playlist') => {
        const queueItems: QueueItem[] = tracks.map(track => ({
          track,
          addedAt: new Date(),
          addedBy: 'user',
          source: source as any,
        }));
        set({ queue: queueItems });
      },

      updateCurrentTrack: (track: Track) => set({ currentTrack: track }),

      addToHistory: (track: Track) => {
        set(state => ({
          history: [track, ...state.history.filter(t => t.id !== track.id)].slice(0, 100)
        }));
      },

      clearHistory: () => set({ history: [] }),

      reset: () => set(initialState),
    }),
    {
      name: 'concerto-audio-store',
      partialize: (state) => ({
        volume: state.volume,
        isMuted: state.isMuted,
        playbackRate: state.playbackRate,
        repeat: state.repeat,
        shuffle: state.shuffle,
        queue: state.queue,
        history: state.history,
      }),
    }
  )
);
