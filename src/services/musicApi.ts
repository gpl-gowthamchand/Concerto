import axios from 'axios';

// Multiple Music Sources (like BlackHole, ViMusic, etc.)
const API_ENDPOINTS = {
  // YouTube Music (primary source)
  YOUTUBE_SEARCH: 'https://www.googleapis.com/youtube/v3/search',
  YOUTUBE_VIDEO: 'https://www.googleapis.com/youtube/v3/videos',
  YOUTUBE_INVIDIOUS: 'https://invidious.snopyta.org/api/v1/search',
  
  // JioSaavn (Indian music)
  JIOSAAVN_SEARCH: 'https://saavn.me/api/search',
  JIOSAAVN_SONG: 'https://saavn.me/api/songs',
  
  // SoundCloud (independent artists)
  SOUNDCLOUD_SEARCH: 'https://api-v2.soundcloud.com/search',
  
  // Deezer (unofficial API)
  DEEZER_SEARCH: 'https://api.deezer.com/search',
  DEEZER_TRACK: 'https://api.deezer.com/track',
  DEEZER_ARTIST: 'https://api.deezer.com/artist',
  
  // Spotify (metadata only)
  SPOTIFY_SEARCH: 'https://api.spotify.com/v1/search',
  
  // MusicBrainz (metadata)
  MUSICBRAINZ_SEARCH: 'https://musicbrainz.org/ws/2',
  
  // Last.fm (metadata)
  LASTFM_SEARCH: 'http://ws.audioscrobbler.com/2.0',
  
  // Genius (lyrics)
  GENIUS_SEARCH: 'https://api.genius.com/search',
  
  // Musixmatch (lyrics)
  MUSIXMATCH_SEARCH: 'https://api.musixmatch.com/ws/1.1/matcher.lyrics.get',
  
  // Free Music Archive
  FMA_SEARCH: 'https://freemusicarchive.org/api/get/',
  
  // Internet Archive
  IA_SEARCH: 'https://archive.org/advancedsearch.php'
};

// API Keys
const API_KEYS = {
  YOUTUBE: process.env.REACT_APP_YOUTUBE_API_KEY || 'YOUR_YOUTUBE_API_KEY',
  LASTFM: process.env.REACT_APP_LASTFM_API_KEY || 'YOUR_LASTFM_API_KEY',
  GENIUS: process.env.REACT_APP_GENIUS_ACCESS_TOKEN || 'YOUR_GENIUS_ACCESS_TOKEN',
  MUSIXMATCH: process.env.REACT_APP_MUSIXMATCH_API_KEY || 'YOUR_MUSIXMATCH_API_KEY',
  SPOTIFY: process.env.REACT_APP_SPOTIFY_CLIENT_ID || 'YOUR_SPOTIFY_CLIENT_ID'
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
  source: 'youtube' | 'jiosaavn' | 'soundcloud' | 'deezer' | 'fma' | 'ia';
  playCount?: number;
  addedAt: Date;
  quality?: string;
  bitrate?: number;
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
  quality?: 'low' | 'medium' | 'high';
}

// Extended fallback data with more sources
const FALLBACK_MUSIC_DATA: MusicSearchResult[] = [
  // Popular songs with real YouTube URLs
  {
    id: '1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 200,
    url: 'https://www.youtube.com/watch?v=4NRXx6U8ABQ',
    artwork: 'https://i.ytimg.com/vi/4NRXx6U8ABQ/maxresdefault.jpg',
    genre: 'Pop',
    mood: 'Energetic',
    bpm: 171,
    key: 'C#',
    year: 2020,
    source: 'youtube',
    playCount: 2500000000,
    addedAt: new Date(),
    quality: 'high',
    bitrate: 256
  },
  {
    id: '2',
    title: 'Starboy',
    artist: 'The Weeknd',
    album: 'Starboy',
    duration: 230,
    url: 'https://www.youtube.com/watch?v=34Na4j8AVgA',
    artwork: 'https://i.ytimg.com/vi/34Na4j8AVgA/maxresdefault.jpg',
    genre: 'R&B',
    mood: 'Confident',
    bpm: 186,
    key: 'F#',
    year: 2016,
    source: 'youtube',
    playCount: 1500000000,
    addedAt: new Date(),
    quality: 'high',
    bitrate: 256
  },
  {
    id: '3',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    album: '÷ (Divide)',
    duration: 234,
    url: 'https://www.youtube.com/watch?v=JGwWNGJdvx8',
    artwork: 'https://i.ytimg.com/vi/JGwWNGJdvx8/maxresdefault.jpg',
    genre: 'Pop',
    mood: 'Romantic',
    bpm: 96,
    key: 'C#',
    year: 2017,
    source: 'youtube',
    playCount: 3000000000,
    addedAt: new Date(),
    quality: 'high',
    bitrate: 256
  },
  {
    id: '4',
    title: 'Dance Monkey',
    artist: 'Tones and I',
    album: 'The Kids Are Coming',
    duration: 209,
    url: 'https://www.youtube.com/watch?v=q0hyYWKXF0Q',
    artwork: 'https://i.ytimg.com/vi/q0hyYWKXF0Q/maxresdefault.jpg',
    genre: 'Pop',
    mood: 'Happy',
    bpm: 98,
    key: 'C',
    year: 2019,
    source: 'youtube',
    playCount: 2000000000,
    addedAt: new Date(),
    quality: 'high',
    bitrate: 256
  },
  {
    id: '5',
    title: 'Bad Guy',
    artist: 'Billie Eilish',
    album: 'When We All Fall Asleep, Where Do We Go?',
    duration: 194,
    url: 'https://www.youtube.com/watch?v=DyDfgMOUjCI',
    artwork: 'https://i.ytimg.com/vi/DyDfgMOUjCI/maxresdefault.jpg',
    genre: 'Pop',
    mood: 'Dark',
    bpm: 135,
    key: 'D',
    year: 2019,
    source: 'youtube',
    playCount: 1800000000,
    addedAt: new Date(),
    quality: 'high',
    bitrate: 256
  },
  // SoundCloud tracks (independent artists)
  {
    id: '6',
    title: 'Midnight City',
    artist: 'M83',
    album: 'Hurry Up, We\'re Dreaming',
    duration: 243,
    url: 'https://soundcloud.com/m83/midnight-city',
    artwork: 'https://i1.sndcdn.com/artworks-000031903199-6e0w1a-t500x500.jpg',
    genre: 'Electronic',
    mood: 'Atmospheric',
    bpm: 120,
    key: 'A',
    year: 2011,
    source: 'soundcloud',
    playCount: 50000000,
    addedAt: new Date(),
    quality: 'medium',
    bitrate: 128
  },
  // Deezer tracks
  {
    id: '7',
    title: 'Old Town Road',
    artist: 'Lil Nas X',
    album: '7',
    duration: 157,
    url: 'https://www.deezer.com/track/70033622',
    artwork: 'https://e-cdns-images.dzcdn.net/images/cover/70033622-264x264.jpg',
    genre: 'Country',
    mood: 'Fun',
    bpm: 136,
    key: 'C',
    year: 2019,
    source: 'deezer',
    playCount: 1200000000,
    addedAt: new Date(),
    quality: 'high',
    bitrate: 320
  },
  // Free Music Archive tracks
  {
    id: '8',
    title: 'Acoustic Breeze',
    artist: 'Benjamin Tissot',
    album: 'Bensound Collection',
    duration: 180,
    url: 'https://freemusicarchive.org/music/Benjamin_Tissot/Bensound_Collection/Acoustic_Breeze',
    artwork: 'https://freemusicarchive.org/file/images/albums/Benjamin_Tissot_-_Bensound_Collection_-_20150503123456564.jpg',
    genre: 'Acoustic',
    mood: 'Relaxing',
    bpm: 80,
    key: 'G',
    year: 2015,
    source: 'fma',
    playCount: 1000000,
    addedAt: new Date(),
    quality: 'medium',
    bitrate: 192
  },
  // Internet Archive tracks
  {
    id: '9',
    title: 'Jazz in the Night',
    artist: 'Various Artists',
    album: 'Jazz Collection',
    duration: 210,
    url: 'https://archive.org/details/jazz_collection_2020',
    artwork: 'https://archive.org/services/img/jazz_collection_2020',
    genre: 'Jazz',
    mood: 'Smooth',
    bpm: 90,
    key: 'F',
    year: 2020,
    source: 'ia',
    playCount: 500000,
    addedAt: new Date(),
    quality: 'medium',
    bitrate: 160
  },
  // More popular tracks
  {
    id: '10',
    title: 'Sunflower',
    artist: 'Post Malone & Swae Lee',
    album: 'Spider-Man: Into the Spider-Verse',
    duration: 162,
    url: 'https://www.youtube.com/watch?v=ApXoWvfEYVU',
    artwork: 'https://i.ytimg.com/vi/ApXoWvfEYVU/maxresdefault.jpg',
    genre: 'Hip Hop',
    mood: 'Chill',
    bpm: 90,
    key: 'F',
    year: 2018,
    source: 'youtube',
    playCount: 1600000000,
    addedAt: new Date(),
    quality: 'high',
    bitrate: 256
  }
];

class MusicAPIService {
  private async searchYouTube(query: string, maxResults: number = 10): Promise<MusicSearchResult[]> {
    try {
      // Try Invidious first (no API key needed)
      const invidiousResponse = await axios.get(API_ENDPOINTS.YOUTUBE_INVIDIOUS, {
        params: {
          q: query,
          type: 'video',
          sort_by: 'relevance',
          duration: 'medium'
        }
      });

      if (invidiousResponse.data && invidiousResponse.data.length > 0) {
        return invidiousResponse.data.slice(0, maxResults).map((item: any) => ({
          id: item.videoId,
          title: item.title.replace(/\(Official Music Video\)|\(Official Video\)|\(Official\)/gi, '').trim(),
          artist: item.author,
          album: 'YouTube Music',
          duration: item.lengthSeconds,
          url: `https://www.youtube.com/watch?v=${item.videoId}`,
          artwork: item.videoThumbnails?.[0]?.url || 'https://via.placeholder.com/300x300',
          genre: 'Various',
          source: 'youtube' as const,
          addedAt: new Date(),
          quality: 'high',
          bitrate: 256
        }));
      }

      // Fallback to YouTube API if key is available
      if (API_KEYS.YOUTUBE !== 'YOUR_YOUTUBE_API_KEY') {
        const response = await axios.get(API_ENDPOINTS.YOUTUBE_SEARCH, {
          params: {
            part: 'snippet',
            q: query,
            type: 'video',
            videoCategoryId: '10',
            maxResults,
            key: API_KEYS.YOUTUBE
          }
        });

        return response.data.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title.replace(/\(Official Music Video\)|\(Official Video\)|\(Official\)/gi, '').trim(),
          artist: item.snippet.channelTitle,
          album: 'YouTube Music',
          duration: 0,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          artwork: item.snippet.thumbnails.high.url,
          genre: 'Various',
          source: 'youtube' as const,
          addedAt: new Date(),
          quality: 'high',
          bitrate: 256
        }));
      }

      return this.getFallbackResults(query, 'youtube', maxResults);
    } catch (error) {
      console.error('YouTube search error:', error);
      return this.getFallbackResults(query, 'youtube', maxResults);
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
        addedAt: new Date(),
        quality: 'high',
        bitrate: 320
      }));
    } catch (error) {
      console.error('JioSaavn search error:', error);
      return this.getFallbackResults(query, 'jiosaavn', maxResults);
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
        url: item.preview,
        artwork: item.album.cover_medium,
        genre: item.genre_id ? 'Various' : 'Unknown',
        source: 'deezer' as const,
        addedAt: new Date(),
        quality: 'medium',
        bitrate: 128
      }));
    } catch (error) {
      console.error('Deezer search error:', error);
      return this.getFallbackResults(query, 'deezer', maxResults);
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
        addedAt: new Date(),
        quality: 'medium',
        bitrate: 128
      }));
    } catch (error) {
      console.error('SoundCloud search error:', error);
      return this.getFallbackResults(query, 'soundcloud', maxResults);
    }
  }

  private async searchFreeMusicArchive(query: string, maxResults: number = 10): Promise<MusicSearchResult[]> {
    try {
      const response = await axios.get(API_ENDPOINTS.FMA_SEARCH, {
        params: {
          q: query,
          limit: maxResults,
          type: 'tracks'
        }
      });

      return response.data.dataset.map((item: any) => ({
        id: item.track_id.toString(),
        title: item.track_title,
        artist: item.artist_name,
        album: item.album_title || 'Unknown Album',
        duration: parseInt(item.track_duration) || 180,
        url: item.track_url,
        artwork: item.track_image_file || 'https://via.placeholder.com/300x300',
        genre: item.genre_title || 'Various',
        source: 'fma' as const,
        addedAt: new Date(),
        quality: 'medium',
        bitrate: 192
      }));
    } catch (error) {
      console.error('FMA search error:', error);
      return this.getFallbackResults(query, 'fma', maxResults);
    }
  }

  // Get fallback results when APIs fail
  private getFallbackResults(query: string, source: string, maxResults: number): MusicSearchResult[] {
    const searchTerm = query.toLowerCase();
    const filteredResults = FALLBACK_MUSIC_DATA.filter(track => 
      track.title.toLowerCase().includes(searchTerm) ||
      track.artist.toLowerCase().includes(searchTerm) ||
      track.album?.toLowerCase().includes(searchTerm) ||
      track.genre.toLowerCase().includes(searchTerm)
    );

    return filteredResults
      .map(track => ({ ...track, source: source as any }))
      .slice(0, maxResults);
  }

  async searchMusic(query: string, filters?: SearchFilters): Promise<MusicSearchResult[]> {
    const results: MusicSearchResult[] = [];
    
    // Search across multiple sources (like BlackHole)
    const sources = filters?.source || ['youtube', 'jiosaavn', 'deezer', 'soundcloud', 'fma'];
    
    const searchPromises = sources.map(async (source) => {
      switch (source) {
        case 'youtube':
          return await this.searchYouTube(query, 4);
        case 'jiosaavn':
          return await this.searchJioSaavn(query, 4);
        case 'deezer':
          return await this.searchDeezer(query, 4);
        case 'soundcloud':
          return await this.searchSoundCloud(query, 4);
        case 'fma':
          return await this.searchFreeMusicArchive(query, 4);
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

    if (filters?.quality) {
      filteredResults = filteredResults.filter(item => {
        switch (filters.quality) {
          case 'high':
            return item.bitrate && item.bitrate >= 256;
          case 'medium':
            return item.bitrate && item.bitrate >= 128;
          case 'low':
            return true;
          default:
            return true;
        }
      });
    }

    // If no results found, return fallback data
    if (filteredResults.length === 0) {
      console.log('No results found, returning fallback data');
      return this.getFallbackResults(query, 'youtube', 10);
    }

    return filteredResults.slice(0, 20);
  }

  async getTrackDetails(trackId: string, source: string): Promise<MusicSearchResult | null> {
    try {
      switch (source) {
        case 'youtube':
          if (API_KEYS.YOUTUBE === 'YOUR_YOUTUBE_API_KEY') {
            return FALLBACK_MUSIC_DATA.find(track => track.id === trackId) || null;
          }

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
              addedAt: new Date(),
              quality: 'high',
              bitrate: 256
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
            addedAt: new Date(),
            quality: 'medium',
            bitrate: 128
          };

        default:
          return FALLBACK_MUSIC_DATA.find(track => track.id === trackId) || null;
      }
    } catch (error) {
      console.error('Get track details error:', error);
      return FALLBACK_MUSIC_DATA.find(track => track.id === trackId) || null;
    }

    return null;
  }

  async getLyrics(artist: string, title: string): Promise<string | null> {
    try {
      // Try Musixmatch first
      if (API_KEYS.MUSIXMATCH !== 'YOUR_MUSIXMATCH_API_KEY') {
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
      }

      // Fallback to Genius
      if (API_KEYS.GENIUS !== 'YOUR_GENIUS_ACCESS_TOKEN') {
        const geniusResponse = await axios.get(API_ENDPOINTS.GENIUS_SEARCH, {
          headers: {
            'Authorization': `Bearer ${API_KEYS.GENIUS}`
          },
          params: {
            q: `${title} ${artist}`
          }
        });

        if (geniusResponse.data.response.hits.length > 0) {
          return 'Lyrics available on Genius';
        }
      }

      return 'Lyrics not available';
    } catch (error) {
      console.error('Get lyrics error:', error);
      return 'Lyrics not available';
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
    return FALLBACK_MUSIC_DATA.slice(0, 10);
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
      return FALLBACK_MUSIC_DATA.slice(0, 5);
    }
  }

  // Get available sources
  getAvailableSources(): string[] {
    return ['youtube', 'jiosaavn', 'deezer', 'soundcloud', 'fma'];
  }

  // Get source info
  getSourceInfo(source: string): { name: string; quality: string; legal: boolean } {
    const sourceInfo = {
      youtube: { name: 'YouTube Music', quality: 'High (256kbps)', legal: false },
      jiosaavn: { name: 'JioSaavn', quality: 'High (320kbps)', legal: false },
      deezer: { name: 'Deezer', quality: 'Medium (128kbps)', legal: true },
      soundcloud: { name: 'SoundCloud', quality: 'Medium (128kbps)', legal: true },
      fma: { name: 'Free Music Archive', quality: 'Medium (192kbps)', legal: true }
    };
    return sourceInfo[source as keyof typeof sourceInfo] || { name: 'Unknown', quality: 'Unknown', legal: false };
  }
}

export const musicApiService = new MusicAPIService();
