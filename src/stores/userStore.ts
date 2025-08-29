import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserPreferences, UserStats, Track, Playlist } from '../types';

interface UserStore {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  addFavoriteTrack: (track: Track) => void;
  removeFavoriteTrack: (trackId: string) => void;
  addFavoriteArtist: (artistId: string) => void;
  removeFavoriteArtist: (artistId: string) => void;
  createPlaylist: (playlist: Omit<Playlist, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePlaylist: (playlistId: string, updates: Partial<Playlist>) => void;
  deletePlaylist: (playlistId: string) => void;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

const defaultUser: User = {
  id: 'default-user',
  username: 'Guest',
  email: 'guest@concerto.app',
  avatar: '/default-avatar.png',
  bio: 'Welcome to Concerto!',
  followers: [],
  following: [],
  playlists: [],
  favoriteTracks: [],
  favoriteArtists: [],
  preferences: {
    theme: 'dark',
    language: 'en',
    audioQuality: 'high',
    autoplay: true,
    crossfade: false,
    gaplessPlayback: true,
    equalizer: {
      enabled: false,
      presets: [
        { name: 'Flat', values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], description: 'Neutral sound' },
        { name: 'Bass Boost', values: [6, 4, 2, 0, 0, 0, 0, 0, 0, 0], description: 'Enhanced bass' },
        { name: 'Treble Boost', values: [0, 0, 0, 0, 0, 0, 0, 2, 4, 6], description: 'Enhanced treble' },
        { name: 'Rock', values: [4, 2, 0, -2, -2, 0, 2, 4, 4, 2], description: 'Rock music optimized' },
        { name: 'Jazz', values: [2, 0, -2, -4, -2, 0, 2, 4, 2, 0], description: 'Jazz music optimized' },
        { name: 'Classical', values: [0, 0, 0, 0, 0, 0, -2, -2, -2, -2], description: 'Classical music optimized' },
      ],
      custom: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      currentPreset: 'Flat',
    },
    notifications: {
      newReleases: true,
      playlistUpdates: true,
      friendActivity: true,
      recommendations: true,
      pushNotifications: false,
    },
    privacy: {
      profileVisibility: 'public',
      showListeningHistory: true,
      showCurrentTrack: true,
      allowFriendRequests: true,
    },
  },
  stats: {
    totalListeningTime: 0,
    favoriteGenres: [],
    favoriteMoods: [],
    topArtists: [],
    topTracks: [],
    playlistsCreated: 0,
    tracksLiked: 0,
    monthlyListeningTime: new Array(12).fill(0),
  },
  createdAt: new Date(),
  lastActive: new Date(),
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // For demo purposes, create a mock user
          const mockUser = {
            ...defaultUser,
            id: `user-${Date.now()}`,
            email,
            username: email.split('@')[0],
          };
          
          set({ 
            user: mockUser, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: 'Login failed. Please try again.', 
            isLoading: false 
          });
        }
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false, 
          error: null 
        });
      },

      register: async (username: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newUser = {
            ...defaultUser,
            id: `user-${Date.now()}`,
            username,
            email,
            createdAt: new Date(),
          };
          
          set({ 
            user: newUser, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: 'Registration failed. Please try again.', 
            isLoading: false 
          });
        }
      },

      updateProfile: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ 
            user: { ...user, ...updates, updatedAt: new Date() } 
          });
        }
      },

      updatePreferences: (preferences: Partial<UserPreferences>) => {
        const { user } = get();
        if (user) {
          set({ 
            user: { 
              ...user, 
              preferences: { ...user.preferences, ...preferences },
              updatedAt: new Date()
            } 
          });
        }
      },

      addFavoriteTrack: (track: Track) => {
        const { user } = get();
        if (user && !user.favoriteTracks.includes(track.id)) {
          set({ 
            user: { 
              ...user, 
              favoriteTracks: [...user.favoriteTracks, track.id],
              updatedAt: new Date()
            } 
          });
        }
      },

      removeFavoriteTrack: (trackId: string) => {
        const { user } = get();
        if (user) {
          set({ 
            user: { 
              ...user, 
              favoriteTracks: user.favoriteTracks.filter(id => id !== trackId),
              updatedAt: new Date()
            } 
          });
        }
      },

      addFavoriteArtist: (artistId: string) => {
        const { user } = get();
        if (user && !user.favoriteArtists.includes(artistId)) {
          set({ 
            user: { 
              ...user, 
              favoriteArtists: [...user.favoriteArtists, artistId],
              updatedAt: new Date()
            } 
          });
        }
      },

      removeFavoriteArtist: (artistId: string) => {
        const { user } = get();
        if (user) {
          set({ 
            user: { 
              ...user, 
              favoriteArtists: user.favoriteArtists.filter(id => id !== artistId),
              updatedAt: new Date()
            } 
          });
        }
      },

      createPlaylist: (playlist: Omit<Playlist, 'id' | 'createdAt' | 'updatedAt'>) => {
        const { user } = get();
        if (user) {
          const newPlaylist: Playlist = {
            ...playlist,
            id: `playlist-${Date.now()}`,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          set({ 
            user: { 
              ...user, 
              playlists: [...user.playlists, newPlaylist.id],
              stats: {
                ...user.stats,
                playlistsCreated: user.stats.playlistsCreated + 1,
              },
              updatedAt: new Date()
            } 
          });
        }
      },

      updatePlaylist: (playlistId: string, updates: Partial<Playlist>) => {
        // This would typically update a playlist in a separate store
        // For now, we'll just update the user's last active time
        const { user } = get();
        if (user) {
          set({ 
            user: { ...user, lastActive: new Date() } 
          });
        }
      },

      deletePlaylist: (playlistId: string) => {
        const { user } = get();
        if (user) {
          set({ 
            user: { 
              ...user, 
              playlists: user.playlists.filter(id => id !== playlistId),
              stats: {
                ...user.stats,
                playlistsCreated: Math.max(0, user.stats.playlistsCreated - 1),
              },
              updatedAt: new Date()
            } 
          });
        }
      },

      followUser: (userId: string) => {
        const { user } = get();
        if (user && !user.following.includes(userId)) {
          set({ 
            user: { 
              ...user, 
              following: [...user.following, userId],
              updatedAt: new Date()
            } 
          });
        }
      },

      unfollowUser: (userId: string) => {
        const { user } = get();
        if (user) {
          set({ 
            user: { 
              ...user, 
              following: user.following.filter(id => id !== userId),
              updatedAt: new Date()
            } 
          });
        }
      },

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      setError: (error: string | null) => set({ error }),

      clearError: () => set({ error: null }),

      reset: () => set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false, 
        error: null 
      }),
    }),
    {
      name: 'concerto-user-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
