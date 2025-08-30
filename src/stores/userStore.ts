import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserPreferences, Playlist } from '../types';

interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // User actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;

  // Playlist actions
  createPlaylist: (name: string, description?: string) => void;
  updatePlaylist: (playlistId: string, updates: Partial<Playlist>) => void;
  deletePlaylist: (playlistId: string) => void;

  // Social actions
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
}

const defaultUser: User = {
  id: '1',
  username: 'pradeep',
  email: 'user@example.com',
  avatar: 'https://via.placeholder.com/150/374151/FFFFFF?text=P',
  bio: 'Music enthusiast and playlist curator',
  preferences: {
    theme: 'dark',
    language: 'en',
    audioQuality: 'high',
    autoplay: true,
    crossfade: true,
    equalizer: {
      enabled: false,
      presets: ['flat', 'bass', 'treble', 'rock', 'jazz', 'classical'],
      customBands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    notifications: {
      email: true,
      push: true,
      newReleases: true,
      recommendations: true
    },
    privacy: {
      profileVisibility: 'public',
      showListeningActivity: true,
      allowDataCollection: true
    }
  },
  stats: {
    totalTracks: 156,
    totalPlaylists: 12,
    listeningStreak: 7,
    lastActive: new Date()
  },
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date()
};

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: defaultUser,
      isAuthenticated: true,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        set({ 
          isAuthenticated: true, 
          isLoading: false,
          user: defaultUser
        });
        
        return true;
      },

      register: async (username: string, email: string, password: string): Promise<boolean> => {
        set({ isLoading: true, error: null });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newUser: User = {
          ...defaultUser,
          id: Date.now().toString(),
          username,
          email,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        set({ 
          isAuthenticated: true, 
          isLoading: false,
          user: newUser
        });
        
        return true;
      },

      logout: () => {
        set({ 
          isAuthenticated: false, 
          user: null,
          error: null 
        });
      },

      updateProfile: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              ...updates,
              updatedAt: new Date()
            }
          });
        }
      },

      updatePreferences: (preferences: Partial<UserPreferences>) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              preferences: {
                ...user.preferences,
                ...preferences
              },
              updatedAt: new Date()
            }
          });
        }
      },

      createPlaylist: (name: string, description?: string) => {
        const { user } = get();
        if (user) {
          const newPlaylist: Playlist = {
            id: Date.now().toString(),
            name,
            description,
            tracks: [],
            isPublic: true,
            isCollaborative: false,
            createdBy: user.id,
            createdAt: new Date(),
            updatedAt: new Date(),
            totalDuration: 0,
            trackCount: 0
          };

          // In a real app, you'd save this to the backend
          console.log('Created playlist:', newPlaylist);
        }
      },

      updatePlaylist: (playlistId: string, updates: Partial<Playlist>) => {
        // In a real app, you'd update this on the backend
        console.log('Updated playlist:', playlistId, updates);
      },

      deletePlaylist: (playlistId: string) => {
        // In a real app, you'd delete this from the backend
        console.log('Deleted playlist:', playlistId);
      },

      followUser: (userId: string) => {
        // In a real app, you'd follow the user on the backend
        console.log('Followed user:', userId);
      },

      unfollowUser: (userId: string) => {
        // In a real app, you'd unfollow the user on the backend
        console.log('Unfollowed user:', userId);
      }
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
