// Advanced Music API with Metrolist-inspired features
// Enhanced backend services with offline support, caching, and advanced features

import { OnlineSong } from './enhancedMusicApi';

export interface AdvancedSong extends OnlineSong {
  // Enhanced fields for advanced features
  isDownloaded?: boolean;
  downloadPath?: string;
  lyrics?: string;
  lyricsTimestamp?: number[];
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
  songs: AdvancedSong[];
  isPublic: boolean;
  isCollaborative: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  playCount: number;
  followers: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: UserPreferences;
  playlists: Playlist[];
  favorites: AdvancedSong[];
  recentlyPlayed: AdvancedSong[];
  downloadedSongs: AdvancedSong[];
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

// Enhanced caching system
class CacheManager {
  private cache = new Map<string, any>();
  private maxSize = 1000;

  set(key: string, value: any, ttl: number = 300000): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }
}

// Offline storage manager
class OfflineManager {
  private dbName = 'ConcertoOfflineDB';
  private version = 1;

  async initDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Songs store
        if (!db.objectStoreNames.contains('songs')) {
          const songsStore = db.createObjectStore('songs', { keyPath: 'id' });
          songsStore.createIndex('title', 'title', { unique: false });
          songsStore.createIndex('artist', 'artist', { unique: false });
          songsStore.createIndex('isDownloaded', 'isDownloaded', { unique: false });
        }
        
        // Playlists store
        if (!db.objectStoreNames.contains('playlists')) {
          const playlistsStore = db.createObjectStore('playlists', { keyPath: 'id' });
          playlistsStore.createIndex('name', 'name', { unique: false });
          playlistsStore.createIndex('isPublic', 'isPublic', { unique: false });
        }
        
        // User data store
        if (!db.objectStoreNames.contains('userData')) {
          db.createObjectStore('userData', { keyPath: 'id' });
        }
      };
    });
  }

  async saveSong(song: AdvancedSong): Promise<void> {
    const db = await this.initDB();
    const transaction = db.transaction(['songs'], 'readwrite');
    const store = transaction.objectStore('songs');
    await store.put(song);
  }

  async getSong(id: string): Promise<AdvancedSong | null> {
    const db = await this.initDB();
    const transaction = db.transaction(['songs'], 'readonly');
    const store = transaction.objectStore('songs');
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllSongs(): Promise<AdvancedSong[]> {
    const db = await this.initDB();
    const transaction = db.transaction(['songs'], 'readonly');
    const store = transaction.objectStore('songs');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async getDownloadedSongs(): Promise<AdvancedSong[]> {
    const allSongs = await this.getAllSongs();
    return allSongs.filter(song => song.isDownloaded);
  }

  async deleteSong(id: string): Promise<void> {
    const db = await this.initDB();
    const transaction = db.transaction(['songs'], 'readwrite');
    const store = transaction.objectStore('songs');
    await store.delete(id);
  }
}

// Lyrics service
class LyricsService {
  private cache = new Map<string, string>();

  async getLyrics(song: AdvancedSong): Promise<string> {
    const cacheKey = `${song.id}-lyrics`;
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      return cached || 'Lyrics not available';
    }

    try {
      // Simulate lyrics API call
      const lyrics = await this.fetchLyricsFromAPI(song.title, song.artist);
      this.cache.set(cacheKey, lyrics);
      return lyrics;
    } catch (error) {
      console.error('Error fetching lyrics:', error);
      return `Lyrics for "${song.title}" by ${song.artist} are not available.`;
    }
  }

  private async fetchLyricsFromAPI(title: string, artist: string): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock lyrics data
    const mockLyrics = {
      'Despacito': `Despacito
Quiero respirar tu cuello despacito
Deja que te diga cosas al oído
Para que te acuerdes si no estás conmigo
Despacito
Quiero desnudarte a besos despacito
Firmar las paredes de tu laberinto
Y hacer de tu cuerpo todo un manuscrito`,
      'Shape of You': `The club isn't the best place to find a lover
So the bar is where I go
Me and my friends at the table doing shots
Drinking fast and then we talk slow
And you come over and start up a conversation with just me
And trust me I'll give it a chance now`,
      'Gangnam Style': `Oppa Gangnam Style
Gangnam Style
A girl who is warm and humanly during the day
A classy girl who know how to enjoy the freedom of a cup of coffee
A girl whose heart gets hotter when night comes
A girl with that kind of twist`,
      'Baby Shark': `Baby shark, doo doo doo doo doo doo
Baby shark, doo doo doo doo doo doo
Baby shark, doo doo doo doo doo doo
Baby shark!
Mommy shark, doo doo doo doo doo doo
Mommy shark, doo doo doo doo doo doo
Mommy shark, doo doo doo doo doo doo
Mommy shark!`
    };

    return mockLyrics[title as keyof typeof mockLyrics] || 
           `Lyrics for "${title}" by ${artist} would be displayed here.\n\nThis is a placeholder for the actual lyrics that would be fetched from a lyrics API service.`;
  }
}

// Audio processing service
class AudioProcessor {
  private audioContext: AudioContext | null = null;

  async initAudioContext(): Promise<AudioContext> {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  async normalizeAudio(audioBuffer: AudioBuffer): Promise<AudioBuffer> {
    const context = await this.initAudioContext();
    const normalizedBuffer = context.createBuffer(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const inputData = audioBuffer.getChannelData(channel);
      const outputData = normalizedBuffer.getChannelData(channel);
      
      // Find peak amplitude
      let peak = 0;
      for (let i = 0; i < inputData.length; i++) {
        peak = Math.max(peak, Math.abs(inputData[i]));
      }
      
      // Normalize to 0.95 to avoid clipping
      const normalizationFactor = peak > 0 ? 0.95 / peak : 1;
      
      for (let i = 0; i < inputData.length; i++) {
        outputData[i] = inputData[i] * normalizationFactor;
      }
    }

    return normalizedBuffer;
  }

  async adjustTempo(audioBuffer: AudioBuffer, tempo: number): Promise<AudioBuffer> {
    // Simple tempo adjustment (in a real implementation, you'd use more sophisticated algorithms)
    const context = await this.initAudioContext();
    const newLength = Math.floor(audioBuffer.length / tempo);
    
    const adjustedBuffer = context.createBuffer(
      audioBuffer.numberOfChannels,
      newLength,
      audioBuffer.sampleRate
    );

    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const inputData = audioBuffer.getChannelData(channel);
      const outputData = adjustedBuffer.getChannelData(channel);
      
      for (let i = 0; i < newLength; i++) {
        const sourceIndex = Math.floor(i * tempo);
        outputData[i] = inputData[sourceIndex] || 0;
      }
    }

    return adjustedBuffer;
  }

  async adjustPitch(audioBuffer: AudioBuffer, pitch: number): Promise<AudioBuffer> {
    // Simple pitch adjustment (in a real implementation, you'd use more sophisticated algorithms)
    const context = await this.initAudioContext();
    const pitchFactor = Math.pow(2, pitch / 12); // Convert semitones to frequency ratio
    
    const adjustedBuffer = context.createBuffer(
      audioBuffer.numberOfChannels,
      Math.floor(audioBuffer.length / pitchFactor),
      audioBuffer.sampleRate
    );

    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const inputData = audioBuffer.getChannelData(channel);
      const outputData = adjustedBuffer.getChannelData(channel);
      
      for (let i = 0; i < outputData.length; i++) {
        const sourceIndex = Math.floor(i * pitchFactor);
        outputData[i] = inputData[sourceIndex] || 0;
      }
    }

    return adjustedBuffer;
  }
}

// Enhanced Music API with Metrolist-inspired features
export const advancedMusicApi = {
  cache: new CacheManager(),
  offline: new OfflineManager(),
  lyrics: new LyricsService(),
  audioProcessor: new AudioProcessor(),

  // Enhanced search with better caching and filtering
  async searchTracks(query: string, filters?: {
    genre?: string;
    year?: number;
    duration?: { min: number; max: number };
    explicit?: boolean;
  }): Promise<AdvancedSong[]> {
    const cacheKey = `search-${query}-${JSON.stringify(filters)}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Simulate API call with enhanced filtering
      const results = await this.performAdvancedSearch(query, filters);
      this.cache.set(cacheKey, results, 300000); // 5 minutes cache
      return results;
    } catch (error) {
      console.error('Error in advanced search:', error);
      return [];
    }
  },

  // Get personalized recommendations
  async getPersonalizedRecommendations(userId: string): Promise<AdvancedSong[]> {
    const cacheKey = `recommendations-${userId}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const user = await this.getUser(userId);
      const recommendations = await this.generateRecommendations(user);
      this.cache.set(cacheKey, recommendations, 600000); // 10 minutes cache
      return recommendations;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  },

  // Download song for offline playback
  async downloadSong(song: AdvancedSong): Promise<AdvancedSong> {
    try {
      // Simulate download process
      const downloadedSong = {
        ...song,
        isDownloaded: true,
        downloadPath: `offline/${song.id}.mp3`,
        downloadedAt: new Date()
      };

      await this.offline.saveSong(downloadedSong);
      return downloadedSong;
    } catch (error) {
      console.error('Error downloading song:', error);
      throw error;
    }
  },

  // Get offline songs
  async getOfflineSongs(): Promise<AdvancedSong[]> {
    try {
      return await this.offline.getDownloadedSongs();
    } catch (error) {
      console.error('Error getting offline songs:', error);
      return [];
    }
  },

  // Create playlist
  async createPlaylist(name: string, description?: string, isPublic: boolean = false): Promise<Playlist> {
    const playlist: Playlist = {
      id: `playlist-${Date.now()}`,
      name,
      description,
      songs: [],
      isPublic,
      isCollaborative: false,
      createdBy: 'current-user',
      createdAt: new Date(),
      updatedAt: new Date(),
      playCount: 0,
      followers: 0
    };

    // Save to offline storage
    const db = await this.offline.initDB();
    const transaction = db.transaction(['playlists'], 'readwrite');
    const store = transaction.objectStore('playlists');
    await store.put(playlist);

    return playlist;
  },

  // Add song to playlist
  async addToPlaylist(playlistId: string, song: AdvancedSong): Promise<void> {
    try {
      const db = await this.offline.initDB();
      const transaction = db.transaction(['playlists'], 'readwrite');
      const store = transaction.objectStore('playlists');
      
      const playlist = await new Promise<Playlist>((resolve, reject) => {
        const request = store.get(playlistId);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });

      if (playlist) {
        playlist.songs.push(song);
        playlist.updatedAt = new Date();
        await store.put(playlist);
      }
    } catch (error) {
      console.error('Error adding to playlist:', error);
      throw error;
    }
  },

  // Get user data
  async getUser(userId: string): Promise<User> {
    try {
      const db = await this.offline.initDB();
      const transaction = db.transaction(['userData'], 'readonly');
      const store = transaction.objectStore('userData');
      
      return new Promise((resolve, reject) => {
        const request = store.get(userId);
        request.onsuccess = () => {
          if (request.result) {
            resolve(request.result);
          } else {
            // Create default user
            const defaultUser: User = {
              id: userId,
              name: 'User',
              email: 'user@example.com',
              preferences: {
                theme: 'auto',
                audioQuality: 'high',
                autoDownload: false,
                skipSilence: false,
                audioNormalization: true,
                crossfade: false,
                gaplessPlayback: true,
                sleepTimer: 0,
                language: 'en',
                region: 'US'
              },
              playlists: [],
              favorites: [],
              recentlyPlayed: [],
              downloadedSongs: []
            };
            resolve(defaultUser);
          }
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  // Update user preferences
  async updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<void> {
    try {
      const user = await this.getUser(userId);
      user.preferences = { ...user.preferences, ...preferences };
      
      const db = await this.offline.initDB();
      const transaction = db.transaction(['userData'], 'readwrite');
      const store = transaction.objectStore('userData');
      await store.put(user);
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  },

  // Get lyrics for song
  async getLyrics(song: AdvancedSong): Promise<string> {
    return await this.lyrics.getLyrics(song);
  },

  // Audio processing methods
  async normalizeAudio(audioBuffer: AudioBuffer): Promise<AudioBuffer> {
    return await this.audioProcessor.normalizeAudio(audioBuffer);
  },

  async adjustTempo(audioBuffer: AudioBuffer, tempo: number): Promise<AudioBuffer> {
    return await this.audioProcessor.adjustTempo(audioBuffer, tempo);
  },

  async adjustPitch(audioBuffer: AudioBuffer, pitch: number): Promise<AudioBuffer> {
    return await this.audioProcessor.adjustPitch(audioBuffer, pitch);
  },

  // Private helper methods
  async performAdvancedSearch(_query: string, _filters?: any): Promise<AdvancedSong[]> {
    // Simulate advanced search with filtering
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // This would integrate with real APIs in production
    return [];
  },

  async generateRecommendations(_user: User): Promise<AdvancedSong[]> {
    // Simulate recommendation algorithm
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // This would use machine learning algorithms in production
    return [];
  }
};

// Export the enhanced API
export default advancedMusicApi;
