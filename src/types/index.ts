// User related types
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  preferences: UserPreferences;
  stats: UserStats;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  audioQuality: 'low' | 'medium' | 'high';
  autoplay: boolean;
  crossfade: boolean;
  equalizer: {
    enabled: boolean;
    presets: string[];
    customBands: number[];
  };
  notifications: {
    email: boolean;
    push: boolean;
    newReleases: boolean;
    recommendations: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'friends';
    showListeningActivity: boolean;
    allowDataCollection: boolean;
  };
}

export interface UserStats {
  totalTracks: number;
  totalPlaylists: number;
  listeningStreak: number;
  lastActive: Date;
}

// Playlist related types
export interface Playlist {
  id: string;
  name: string;
  description?: string;
  tracks: MusicSearchResult[];
  artwork?: string;
  isPublic: boolean;
  isCollaborative: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  totalDuration: number;
  trackCount: number;
  mood?: string;
  genre?: string;
}

// Social related types
export interface SocialActivity {
  id: string;
  userId: string;
  type: 'like' | 'share' | 'follow' | 'playlist_create' | 'track_add';
  targetId: string;
  targetType: 'track' | 'playlist' | 'user';
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Audio related types
export interface AudioState {
  isPlaying: boolean;
  currentTrack: MusicSearchResult | null;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  repeat: 'none' | 'one' | 'all';
  shuffle: boolean;
  queue: MusicSearchResult[];
  queueIndex: number;
  history: MusicSearchResult[];
}

// Search related types
export interface SearchFilters {
  query: string;
  genre?: string;
  mood?: string;
  duration?: { min: number; max: number };
  year?: { min: number; max: number };
  bpm?: { min: number; max: number };
  key?: string;
  source?: string[];
  quality?: 'low' | 'medium' | 'high';
}

// Music result types (imported from musicApi service)
export interface MusicSearchResult {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  url: string;
  artwork: string;
  genre: string;
  mood?: string;
  bpm?: number;
  key?: string;
  year?: number;
  source: 'youtube' | 'jiosaavn' | 'soundcloud' | 'deezer' | 'fma' | 'ia';
  playCount?: number;
  addedAt: Date;
  quality?: string;
  bitrate?: number;
}

// Analytics related types
export interface AnalyticsData {
  totalListeningTime: number;
  tracksPlayed: number;
  playlistsCreated: number;
  listeningStreak: number;
  peakHours: { hour: number; plays: number }[];
  monthlyTrends: { month: string; plays: number }[];
  topGenres: { genre: string; plays: number }[];
  topArtists: { artist: string; plays: number }[];
}

// Offline related types
export interface OfflineTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  filePath: string;
  fileSize: number;
  downloadedAt: Date;
  artwork?: string;
}

export interface StorageInfo {
  used: number;
  total: number;
  available: number;
  percentageUsed: number;
}
