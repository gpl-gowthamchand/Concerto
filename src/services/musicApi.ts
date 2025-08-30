import axios from 'axios';

// Free Music API Endpoints
const API_ENDPOINTS = {
  // YouTube Music (via yt-dlp)
  YOUTUBE_SEARCH: 'https://www.googleapis.com/youtube/v3/search',
  YOUTUBE_VIDEO: 'https://www.googleapis.com/youtube/v3/videos',
  
  // JioSaavn (unofficial API)
  JIOSAAVN_SEARCH: 'https://saavn.me/api/search',
  JIOSAAVN_SONG: 'https://saavn.me/api/songs',
  
  // SoundCloud (via unofficial API)
  SOUNDCLOUD_SEARCH: 'https://api-v2.soundcloud.com/search',
  
  // Deezer (free API)
  DEEZER_SEARCH: 'https://api.deezer.com/search',
  DEEZER_TRACK: 'https://api.deezer.com/track',
  
  // MusicBrainz (metadata)
  MUSICBRAINZ_SEARCH: 'https://musicbrainz.org/ws/2',
  
  // Last.fm (metadata)
  LASTFM_SEARCH: 'http://ws.audioscrobbler.com/2.0',
  
  // Genius (lyrics)
  GENIUS_SEARCH: 'https://api.genius.com/search',
  
  // Musixmatch (lyrics)
  MUSIXMATCH_SEARCH: 'https://api.musixmatch.com/ws/1.1/matcher.lyrics.get'
};

// API Keys (you'll need to get these)
const API_KEYS = {
  YOUTUBE: process.env.REACT_APP_YOUTUBE_API_KEY || 'YOUR_YOUTUBE_API_KEY',
  LASTFM: process.env.REACT_APP_LASTFM_API_KEY || 'YOUR_LASTFM_API_KEY',
  GENIUS: process.env.REACT_APP_GENIUS_ACCESS_TOKEN || 'YOUR_GENIUS_ACCESS_TOKEN',
  MUSIXMATCH: process.env.REACT_APP_MUSIXMATCH_API_KEY || 'YOUR_MUSIXMATCH_API_KEY'
};

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
  source: 'youtube' | 'jiosaavn' | 'soundcloud' | 'deezer';
  playCount?: number;
  addedAt: Date;
}

export interface SearchFilters {
  query: string;
  genre?: string;
  mood?: string;
  duration?: { min: number; max: number };
  year?: { min: number; max: number };
  bpm?: { min: number; max: number };
  key?: string;
  source?: string[];
}

class MusicAPIService {
  private async searchYouTube(query: string, maxResults: number = 10): Promise<MusicSearchResult[]> {
    try {
      const response = await axios.get(API_ENDPOINTS.YOUTUBE_SEARCH, {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          videoCategoryId: '10', // Music category
          maxResults,
          key: API_KEYS.YOUTUBE
        }
      });

      return response.data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title.replace(/\(Official Music Video\)|\(Official Video\)|\(Official\)/gi, '').trim(),
        artist: item.snippet.channelTitle,
        album: 'YouTube Music',
        duration: 0, // Will be fetched separately
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        artwork: item.snippet.thumbnails.high.url,
        genre: 'Various',
        source: 'youtube' as const,
        addedAt: new Date()
      }));
    } catch (error) {
      console.error('YouTube search error:', error);
      return [];
    }
  }

  private async searchJioSaavn(query: string, maxResults: number = 10): Promise<MusicSearchResult[]> {
    try {
      const response = await axios.get(API_ENDPOINTS.JIOSAAVN_SEARCH, {
        params: {
          query,
          type: 'song',
          limit: maxResults
        }
      });

      return response.data.results.map((item: any) => ({
        id: item.id,
        title: item.name,
        artist: item.primaryArtists,
        album: item.album?.name || 'Unknown Album',
        duration: parseInt(item.duration),
        url: item.downloadUrl?.[4]?.link || item.downloadUrl?.[0]?.link,
        artwork: item.image?.[2]?.link || item.image?.[0]?.link,
        genre: item.language || 'Various',
        source: 'jiosaavn' as const,
        addedAt: new Date()
      }));
    } catch (error) {
      console.error('JioSaavn search error:', error);
      return [];
    }
  }

  private async searchDeezer(query: string, maxResults: number = 10): Promise<MusicSearchResult[]> {
    try {
      const response = await axios.get(API_ENDPOINTS.DEEZER_SEARCH, {
        params: {
          q: query,
          limit: maxResults
        }
      });

      return response.data.data.map((item: any) => ({
        id: item.id.toString(),
        title: item.title,
        artist: item.artist.name,
        album: item.album.title,
        duration: item.duration,
        url: item.preview, // 30-second preview
        artwork: item.album.cover_medium,
        genre: item.genre_id ? 'Various' : 'Unknown',
        source: 'deezer' as const,
        addedAt: new Date()
      }));
    } catch (error) {
      console.error('Deezer search error:', error);
      return [];
    }
  }

  private async searchSoundCloud(query: string, maxResults: number = 10): Promise<MusicSearchResult[]> {
    try {
      const response = await axios.get(API_ENDPOINTS.SOUNDCLOUD_SEARCH, {
        params: {
          q: query,
          limit: maxResults,
          type: 'tracks'
        }
      });

      return response.data.collection.map((item: any) => ({
        id: item.id.toString(),
        title: item.title,
        artist: item.user.username,
        album: 'SoundCloud',
        duration: Math.floor(item.duration / 1000),
        url: item.stream_url,
        artwork: item.artwork_url || item.user.avatar_url,
        genre: 'Various',
        source: 'soundcloud' as const,
        addedAt: new Date()
      }));
    } catch (error) {
      console.error('SoundCloud search error:', error);
      return [];
    }
  }

  async searchMusic(query: string, filters?: SearchFilters): Promise<MusicSearchResult[]> {
    const results: MusicSearchResult[] = [];
    
    // Search across multiple sources
    const sources = filters?.source || ['youtube', 'jiosaavn', 'deezer'];
    
    const searchPromises = sources.map(async (source) => {
      switch (source) {
        case 'youtube':
          return await this.searchYouTube(query, 5);
        case 'jiosaavn':
          return await this.searchJioSaavn(query, 5);
        case 'deezer':
          return await this.searchDeezer(query, 5);
        case 'soundcloud':
          return await this.searchSoundCloud(query, 5);
        default:
          return [];
      }
    });

    const searchResults = await Promise.all(searchPromises);
    searchResults.forEach(result => results.push(...result));

    // Apply filters
    let filteredResults = results;
    
    if (filters?.genre) {
      filteredResults = filteredResults.filter(item => 
        item.genre.toLowerCase().includes(filters.genre!.toLowerCase())
      );
    }

    if (filters?.duration) {
      filteredResults = filteredResults.filter(item => 
        item.duration >= filters.duration!.min && item.duration <= filters.duration!.max
      );
    }

    if (filters?.year) {
      filteredResults = filteredResults.filter(item => 
        item.year && item.year >= filters.year!.min && item.year <= filters.year!.max
      );
    }

    return filteredResults.slice(0, 20); // Limit total results
  }

  async getTrackDetails(trackId: string, source: string): Promise<MusicSearchResult | null> {
    try {
      switch (source) {
        case 'youtube':
          const ytResponse = await axios.get(API_ENDPOINTS.YOUTUBE_VIDEO, {
            params: {
              part: 'snippet,contentDetails',
              id: trackId,
              key: API_KEYS.YOUTUBE
            }
          });
          
          if (ytResponse.data.items.length > 0) {
            const item = ytResponse.data.items[0];
            return {
              id: item.id,
              title: item.snippet.title,
              artist: item.snippet.channelTitle,
              album: 'YouTube Music',
              duration: this.parseYouTubeDuration(item.contentDetails.duration),
              url: `https://www.youtube.com/watch?v=${item.id}`,
              artwork: item.snippet.thumbnails.high.url,
              genre: 'Various',
              source: 'youtube' as const,
              addedAt: new Date()
            };
          }
          break;

        case 'deezer':
          const dzResponse = await axios.get(`${API_ENDPOINTS.DEEZER_TRACK}/${trackId}`);
          const track = dzResponse.data;
          return {
            id: track.id.toString(),
            title: track.title,
            artist: track.artist.name,
            album: track.album.title,
            duration: track.duration,
            url: track.preview,
            artwork: track.album.cover_medium,
            genre: 'Various',
            source: 'deezer' as const,
            addedAt: new Date()
          };

        default:
          return null;
      }
    } catch (error) {
      console.error('Get track details error:', error);
      return null;
    }

    return null;
  }

  async getLyrics(artist: string, title: string): Promise<string | null> {
    try {
      // Try Musixmatch first
      const mxmResponse = await axios.get(API_ENDPOINTS.MUSIXMATCH_SEARCH, {
        params: {
          q_track: title,
          q_artist: artist,
          apikey: API_KEYS.MUSIXMATCH
        }
      });

      if (mxmResponse.data.message.body.lyrics) {
        return mxmResponse.data.message.body.lyrics.lyrics_body;
      }

      // Fallback to Genius
      const geniusResponse = await axios.get(API_ENDPOINTS.GENIUS_SEARCH, {
        headers: {
          'Authorization': `Bearer ${API_KEYS.GENIUS}`
        },
        params: {
          q: `${title} ${artist}`
        }
      });

      if (geniusResponse.data.response.hits.length > 0) {
        // Would need to fetch the actual lyrics page
        return 'Lyrics available on Genius';
      }

      return null;
    } catch (error) {
      console.error('Get lyrics error:', error);
      return null;
    }
  }

  private parseYouTubeDuration(duration: string): number {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return 0;

    const hours = parseInt(match[1]?.replace('H', '') || '0');
    const minutes = parseInt(match[2]?.replace('M', '') || '0');
    const seconds = parseInt(match[3]?.replace('S', '') || '0');

    return hours * 3600 + minutes * 60 + seconds;
  }

  // Get trending music
  async getTrendingMusic(): Promise<MusicSearchResult[]> {
    const trendingQueries = [
      'top hits 2024',
      'viral songs',
      'trending music',
      'popular songs',
      'chart toppers'
    ];

    const randomQuery = trendingQueries[Math.floor(Math.random() * trendingQueries.length)];
    return await this.searchMusic(randomQuery);
  }

  // Get recommendations based on a track
  async getRecommendations(trackId: string, source: string): Promise<MusicSearchResult[]> {
    try {
      const track = await this.getTrackDetails(trackId, source);
      if (!track) return [];

      // Search for similar tracks
      const similarQuery = `${track.artist} ${track.genre}`;
      return await this.searchMusic(similarQuery);
    } catch (error) {
      console.error('Get recommendations error:', error);
      return [];
    }
  }
}

export const musicApiService = new MusicAPIService();
