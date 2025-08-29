import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserPreferences, Track, Playlist } from '../types';

interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  updateProfile: (updates: Partial<User>) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  toggleFavoriteTrack: (trackId: string) => void;
  toggleFavoriteArtist: (artistId: string) => void;
  createPlaylist: (name: string, description?: string) => void;
  updatePlaylist: (playlistId: string, updates: Partial<Playlist>) => void;
  deletePlaylist: (playlistId: string) => void;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
}

const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const defaultUser: User = {
  id: 'default-user',
  username: 'MusicLover',
  email: 'user@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MusicLover',
  bio: 'Passionate about discovering new music!',
  preferences: {
    theme: 'dark',
    language: 'en',
    audioQuality: 'high',
    autoplay: true,
    crossfade: true,
    equalizer: {
      enabled: false,
      presets: [],
      custom: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      currentPreset: ''
    },
    notifications: {
      newReleases: true,
      playlistUpdates: true,
      friendActivity: true,
      recommendations: true,
      pushNotifications: true
    },
    privacy: {
      profileVisibility: 'public',
      showListeningHistory: true,
      showCurrentTrack: true,
      allowFriendRequests: true
    }
  },
  stats: {
    totalListeningTime: 0,
    totalTracks: 0,
    totalPlaylists: 0,
    favoriteGenres: [],
    topArtists: [],
    listeningStreak: 0,
    lastActive: new Date()
  },
  createdAt: new Date(),
  updatedAt: new Date()
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
          
          set({ 
            user: defaultUser, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: 'Login failed. Please check your credentials.', 
            isLoading: false 
          });
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      register: async (username: string, email: string, password: string): Promise<boolean> => {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newUser: User = {
            id: generateId(),
            username,
            email,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
            bio: '',
            preferences: {
              theme: 'dark',
              language: 'en',
              audioQuality: 'high',
              autoplay: true,
              crossfade: true,
              equalizer: {
                enabled: false,
                presets: [],
                custom: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                currentPreset: ''
              },
              notifications: {
                newReleases: true,
                playlistUpdates: true,
                friendActivity: true,
                recommendations: true,
                pushNotifications: true
              },
              privacy: {
                profileVisibility: 'public',
                showListeningHistory: true,
                showCurrentTrack: true,
                allowFriendRequests: true
              }
            },
            stats: {
              totalListeningTime: 0,
              totalTracks: 0,
              totalPlaylists: 0,
              favoriteGenres: [],
              topArtists: [],
              listeningStreak: 0,
              lastActive: new Date()
            },
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          set({ user: newUser, isAuthenticated: true });
          return true;
        } catch (error) {
          console.error('Registration failed:', error);
          return false;
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

      toggleFavoriteTrack: (trackId: string) => {
        // This would need to be implemented with actual favorite tracks storage
        console.log('Toggle favorite track:', trackId);
      },

      toggleFavoriteArtist: (artistId: string) => {
        // This would need to be implemented with actual favorite artists storage
        console.log('Toggle favorite artist:', artistId);
      },

      createPlaylist: (name: string, description?: string) => {
        const { user } = get();
        if (user) {
          const newPlaylist: Playlist = {
            id: generateId(),
            name,
            description,
            tracks: [],
            isPublic: true,
            isCollaborative: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            totalDuration: 0,
            trackCount: 0
          };

          // In a real app, this would be stored in a separate playlists store
          console.log('Created playlist:', newPlaylist);
        }
      },

      updatePlaylist: (playlistId: string, updates: Partial<Playlist>) => {
        // This would need to be implemented with actual playlist storage
        console.log('Update playlist:', playlistId, updates);
      },

      deletePlaylist: (playlistId: string) => {
        // This would need to be implemented with actual playlist storage
        console.log('Delete playlist:', playlistId);
      },

      followUser: (userId: string) => {
        // This would need to be implemented with actual following storage
        console.log('Follow user:', userId);
      },

      unfollowUser: (userId: string) => {
        // This would need to be implemented with actual following storage
        console.log('Unfollow user:', userId);
      }
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
);
