export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  url: string;
  artwork?: string;
  genre?: string;
  mood?: string;
  bpm?: number;
  key?: string;
  year?: number;
  lyrics?: string;
  source: 'youtube' | 'soundcloud' | 'deezer' | 'jiosaavn';
  streamUrl?: string;
  downloadUrl?: string;
  isDownloaded?: boolean;
  playCount: number;
  lastPlayed?: Date;
  addedAt: Date;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  tracks: Track[];
  artwork?: string;
  isPublic: boolean;
  isCollaborative: boolean;
  collaborators?: string[];
  createdAt: Date;
  updatedAt: Date;
  totalDuration: number;
  trackCount: number;
  mood?: string;
  genre?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  followers: string[];
  following: string[];
  playlists: string[];
  favoriteTracks: string[];
  favoriteArtists: string[];
  preferences: UserPreferences;
  stats: UserStats;
  createdAt: Date;
  lastActive: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  audioQuality: 'low' | 'medium' | 'high';
  autoplay: boolean;
  crossfade: boolean;
  gaplessPlayback: boolean;
  equalizer: EqualizerSettings;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export interface EqualizerSettings {
  enabled: boolean;
  presets: EqualizerPreset[];
  custom: number[];
  currentPreset: string;
}

export interface EqualizerPreset {
  name: string;
  values: number[];
  description?: string;
}

export interface NotificationSettings {
  newReleases: boolean;
  playlistUpdates: boolean;
  friendActivity: boolean;
  recommendations: boolean;
  pushNotifications: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showListeningHistory: boolean;
  showCurrentTrack: boolean;
  allowFriendRequests: boolean;
}

export interface UserStats {
  totalListeningTime: number;
  favoriteGenres: string[];
  favoriteMoods: string[];
  topArtists: string[];
  topTracks: string[];
  playlistsCreated: number;
  tracksLiked: number;
  monthlyListeningTime: number[];
}

export interface SearchResult {
  tracks: Track[];
  artists: Artist[];
  albums: Album[];
  playlists: Playlist[];
  totalResults: number;
}

export interface Artist {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  genres: string[];
  monthlyListeners: number;
  topTracks: string[];
  albums: string[];
  similarArtists: string[];
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artwork?: string;
  tracks: Track[];
  genre: string;
  year: number;
  totalDuration: number;
  trackCount: number;
}

export interface QueueItem {
  track: Track;
  addedAt: Date;
  addedBy: string;
  source: 'user' | 'playlist' | 'radio' | 'recommendation';
}

export interface AudioState {
  isPlaying: boolean;
  currentTrack: Track | null;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  repeat: 'none' | 'one' | 'all';
  shuffle: boolean;
  queue: QueueItem[];
  history: Track[];
}

export interface SearchFilters {
  query: string;
  genre?: string;
  mood?: string;
  duration?: {
    min: number;
    max: number;
  };
  year?: {
    min: number;
    max: number;
  };
  bpm?: {
    min: number;
    max: number;
  };
  key?: string;
  source?: string[];
}

export interface MoodAnalysis {
  mood: string;
  confidence: number;
  characteristics: string[];
  similarMoods: string[];
}

export interface RecommendationEngine {
  userPreferences: string[];
  listeningHistory: Track[];
  similarUsers: string[];
  trendingTracks: Track[];
  moodBasedSuggestions: Track[];
  genreBasedSuggestions: Track[];
}

export interface AnalyticsData {
  listeningTime: {
    daily: number[];
    weekly: number[];
    monthly: number[];
  };
  genreDistribution: Record<string, number>;
  moodDistribution: Record<string, number>;
  peakListeningHours: number[];
  topArtists: Array<{ name: string; count: number }>;
  topTracks: Array<{ title: string; count: number }>;
}

export interface SocialActivity {
  id: string;
  userId: string;
  type: 'track_played' | 'playlist_created' | 'track_liked' | 'followed_user';
  data: any;
  timestamp: Date;
  isPublic: boolean;
}

export interface VoiceCommand {
  command: string;
  action: string;
  parameters: Record<string, any>;
  confidence: number;
}

export interface OfflineData {
  downloadedTracks: Track[];
  cachedPlaylists: Playlist[];
  userData: User;
  lastSync: Date;
  storageUsed: number;
  maxStorage: number;
}
