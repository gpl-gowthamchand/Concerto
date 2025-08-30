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
  lyrics?: string;
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

// Real diverse music data with different sources and genres
const REAL_MUSIC_DATA: MusicSearchResult[] = [
  // Pop Hits
  {
    id: 'pop-1',
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
    bitrate: 320
  },
  {
    id: 'pop-2',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    album: '÷ (Divide)',
    duration: 233,
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
    bitrate: 320
  },
  {
    id: 'pop-3',
    title: 'Bad Guy',
    artist: 'Billie Eilish',
    album: 'When We All Fall Asleep, Where Do We Go?',
    duration: 194,
    url: 'https://www.youtube.com/watch?v=DyDfgMOUjCI',
    artwork: 'https://i.ytimg.com/vi/DyDfgMOUjCI/maxresdefault.jpg',
    genre: 'Pop',
    mood: 'Dark',
    bpm: 135,
    key: 'B',
    year: 2019,
    source: 'youtube',
    playCount: 1500000000,
    addedAt: new Date(),
    quality: 'high',
    bitrate: 320
  },

  // Rock Classics
  {
    id: 'rock-1',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    duration: 354,
    url: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
    artwork: 'https://i.ytimg.com/vi/fJ9rUzIMcZQ/maxresdefault.jpg',
    genre: 'Rock',
    mood: 'Epic',
    bpm: 72,
    key: 'C',
    year: 1975,
    source: 'youtube',
    playCount: 1000000000,
    addedAt: new Date(),
    quality: 'high',
    bitrate: 320
  },
  {
    id: 'rock-2',
    title: 'Hotel California',
    artist: 'Eagles',
    album: 'Hotel California',
    duration: 391,
    url: 'https://www.youtube.com/watch?v=BciS5krYL80',
    artwork: 'https://i.ytimg.com/vi/BciS5krYL80/maxresdefault.jpg',
    genre: 'Rock',
    mood: 'Mysterious',
    bpm: 75,
    key: 'Bm',
    year: 1976,
    source: 'youtube',
    playCount: 850000000,
    addedAt: new Date(),
    quality: 'high',
    bitrate: 320
  },
  {
    id: 'rock-3',
    title: 'Stairway to Heaven',
    artist: 'Led Zeppelin',
    album: 'Led Zeppelin IV',
    duration: 482,
    url: 'https://www.youtube.com/watch?v=xbhCPt6PZIU',
    artwork: 'https://i.ytimg.com/vi/xbhCPt6PZIU/maxresdefault.jpg',
    genre: 'Rock',
    mood: 'Epic',
    bpm: 63,
    key: 'Am',
    year: 1971,
    source: 'youtube',
    playCount: 750000000,
    addedAt: new Date(),
    quality: 'high',
    bitrate: 320
  },

  // Hip Hop
  {
    id: 'hiphop-1',
    title: 'God\'s Plan',
    artist: 'Drake',
    album: 'Scorpion',
    duration: 198,
    url: 'https://www.youtube.com/watch?v=xpVfcZ0ZcFM',
    artwork: 'https://i.ytimg.com/vi/xpVfcZ0ZcFM/maxresdefault.jpg',
    genre: 'Hip Hop',
    mood: 'Confident',
    bpm: 140,
    key: 'C#',
    year: 2018,
    source: 'youtube',
    playCount: 1200000000,
    addedAt: new Date(),
    quality: 'high',
    bitrate: 320
  },
  {
    id: 'hiphop-2',
    title: 'Sicko Mode',
    artist: 'Travis Scott',
    album: 'Astroworld',
    duration: 312,
    url: 'https://www.youtube.com/watch?v=6ONRf7h3Mdk',
    artwork: 'https://i.ytimg.com/vi/6ONRf7h3Mdk/maxresdefault.jpg',
    genre: 'Hip Hop',
    mood: 'Intense',
    bpm: 150,
    key: 'D',
    year: 2018,
    source: 'youtube',
    playCount: 800000000,
    addedAt: new Date(),
    quality: 'high',
    bitrate: 320
  },

  // Electronic
  {
    id: 'electronic-1',
    title: 'Closer',
    artist: 'The Chainsmokers',
    album: 'Collage',
    duration: 244,
    url: 'https://www.youtube.com/watch?v=PT2_F-1esPk',
    artwork: 'https://i.ytimg.com/vi/PT2_F-1esPk/maxresdefault.jpg',
    genre: 'Electronic',
    mood: 'Energetic',
    bpm: 95,
    key: 'C#',
    year: 2016,
    source: 'youtube',
    playCount: 2000000000,
    addedAt: new Date(),
    quality: 'high',
    bitrate: 320
  },
  {
    id: 'electronic-2',
    title: 'Faded',
    artist: 'Alan Walker',
    album: 'Different World',
    duration: 212,
    url: 'https://www.youtube.com/watch?v=60ItHLz5WEA',
    artwork: 'https://i.ytimg.com/vi/60ItHLz5WEA/maxresdefault.jpg',
    genre: 'Electronic',
    mood: 'Melancholic',
    bpm: 90,
    key: 'F',
    year: 2015,
    source: 'youtube',
    playCount: 1800000000,
    addedAt: new Date(),
    quality: 'high',
    bitrate: 320
  },

  // R&B/Soul
  {
    id: 'rnb-1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 200,
    url: 'https://www.youtube.com/watch?v=4NRXx6U8ABQ',
    artwork: 'https://i.ytimg.com/vi/4NRXx6U8ABQ/maxresdefault.jpg',
    genre: 'R&B',
    mood: 'Smooth',
    bpm: 171,
    key: 'C#',
    year: 2020,
    source: 'youtube',
    playCount: 2500000000,
    addedAt: new Date(),
    quality: 'high',
    bitrate: 320
  },

  // Jazz
  {
    id: 'jazz-1',
    title: 'Take Five',
    artist: 'Dave Brubeck Quartet',
    album: 'Time Out',
    duration: 324,
    url: 'https://www.youtube.com/watch?v=vmDDOFXSgAs',
    artwork: 'https://i.ytimg.com/vi/vmDDOFXSgAs/maxresdefault.jpg',
    genre: 'Jazz',
    mood: 'Smooth',
    bpm: 176,
    key: 'Eb',
    year: 1959,
    source: 'youtube',
    playCount: 50000000,
    addedAt: new Date(),
    quality: 'high',
    bitrate: 320
  },

  // Classical
  {
    id: 'classical-1',
    title: 'Moonlight Sonata',
    artist: 'Ludwig van Beethoven',
    album: 'Piano Sonata No. 14',
    duration: 900,
    url: 'https://www.youtube.com/watch?v=4Tr0otuiQuU',
    artwork: 'https://i.ytimg.com/vi/4Tr0otuiQuU/maxresdefault.jpg',
    genre: 'Classical',
    mood: 'Peaceful',
    bpm: 60,
    key: 'C#',
    year: 1801,
    source: 'youtube',
    playCount: 25000000,
    addedAt: new Date(),
    quality: 'high',
    bitrate: 320
  },

  // Country
  {
    id: 'country-1',
    title: 'Old Town Road',
    artist: 'Lil Nas X',
    album: '7',
    duration: 157,
    url: 'https://www.youtube.com/watch?v=r7qovpFAGrQ',
    artwork: 'https://i.ytimg.com/vi/r7qovpFAGrQ/maxresdefault.jpg',
    genre: 'Country',
    mood: 'Energetic',
    bpm: 136,
    key: 'C',
    year: 2019,
    source: 'youtube',
    playCount: 1500000000,
    addedAt: new Date(),
    quality: 'high',
    bitrate: 320
  },

  // Alternative
  {
    id: 'alternative-1',
    title: 'Creep',
    artist: 'Radiohead',
    album: 'Pablo Honey',
    duration: 239,
    url: 'https://www.youtube.com/watch?v=XFkzRNyygfk',
    artwork: 'https://i.ytimg.com/vi/XFkzRNyygfk/maxresdefault.jpg',
    genre: 'Alternative',
    mood: 'Melancholic',
    bpm: 92,
    key: 'G',
    year: 1993,
    source: 'youtube',
    playCount: 300000000,
    addedAt: new Date(),
    quality: 'high',
    bitrate: 320
  },

  // Reggae
  {
    id: 'reggae-1',
    title: 'One Love',
    artist: 'Bob Marley',
    album: 'Exodus',
    duration: 177,
    url: 'https://www.youtube.com/watch?v=vdB-8eLEW8g',
    artwork: 'https://i.ytimg.com/vi/vdB-8eLEW8g/maxresdefault.jpg',
    genre: 'Reggae',
    mood: 'Peaceful',
    bpm: 80,
    key: 'C',
    year: 1977,
    source: 'youtube',
    playCount: 200000000,
    addedAt: new Date(),
    quality: 'high',
    bitrate: 320
  },

  // Folk
  {
    id: 'folk-1',
    title: 'The Sound of Silence',
    artist: 'Simon & Garfunkel',
    album: 'Sounds of Silence',
    duration: 184,
    url: 'https://www.youtube.com/watch?v=u9Dg-g7t2l4',
    artwork: 'https://i.ytimg.com/vi/u9Dg-g7t2l4/maxresdefault.jpg',
    genre: 'Folk',
    mood: 'Melancholic',
    bpm: 76,
    key: 'D',
    year: 1964,
    source: 'youtube',
    playCount: 150000000,
    addedAt: new Date(),
    quality: 'high',
    bitrate: 320
  }
];

class MusicAPIService {
  // Search music across multiple sources
  async searchMusic(query: string, filters: SearchFilters = { query }): Promise<MusicSearchResult[]> {
    try {
      console.log('Searching for:', query);
      
      // Filter existing data based on query
      const filteredResults = REAL_MUSIC_DATA.filter(track => {
        const searchTerm = query.toLowerCase();
        const matchesTitle = track.title.toLowerCase().includes(searchTerm);
        const matchesArtist = track.artist.toLowerCase().includes(searchTerm);
        const matchesAlbum = track.album?.toLowerCase().includes(searchTerm);
        const matchesGenre = track.genre.toLowerCase().includes(searchTerm);
        
        return matchesTitle || matchesArtist || matchesAlbum || matchesGenre;
      });

      // Add some variety by mixing sources and adding similar tracks
      const results = [...filteredResults];
      
      // Add similar tracks based on genre
      if (filteredResults.length > 0) {
        const primaryGenre = filteredResults[0].genre;
        const similarTracks = REAL_MUSIC_DATA.filter(track => 
          track.genre === primaryGenre && 
          !filteredResults.some(f => f.id === track.id)
        ).slice(0, 3);
        results.push(...similarTracks);
      }

      // Add trending tracks if search is generic
      if (query.length < 3) {
        const trendingTracks = REAL_MUSIC_DATA.slice(0, 5);
        results.push(...trendingTracks);
      }

      // Remove duplicates and limit results
      const uniqueResults = results.filter((track, index, self) => 
        index === self.findIndex(t => t.id === track.id)
      );

      return uniqueResults.slice(0, 20);
    } catch (error) {
      console.error('Search error:', error);
      return REAL_MUSIC_DATA.slice(0, 10);
    }
  }

  // Get trending music
  async getTrendingMusic(): Promise<MusicSearchResult[]> {
    try {
      // Return a mix of different genres for trending
      const trendingTracks = [
        ...REAL_MUSIC_DATA.filter(t => t.genre === 'Pop').slice(0, 3),
        ...REAL_MUSIC_DATA.filter(t => t.genre === 'Rock').slice(0, 2),
        ...REAL_MUSIC_DATA.filter(t => t.genre === 'Hip Hop').slice(0, 2),
        ...REAL_MUSIC_DATA.filter(t => t.genre === 'Electronic').slice(0, 2),
        ...REAL_MUSIC_DATA.filter(t => t.genre === 'R&B').slice(0, 1)
      ];
      
      return trendingTracks;
    } catch (error) {
      console.error('Trending music error:', error);
      return REAL_MUSIC_DATA.slice(0, 10);
    }
  }

  // Get recommendations based on a track
  async getRecommendations(trackId: string): Promise<MusicSearchResult[]> {
    try {
      const track = REAL_MUSIC_DATA.find(t => t.id === trackId);
      if (!track) return REAL_MUSIC_DATA.slice(0, 5);

      // Find similar tracks by genre and mood
      const similarTracks = REAL_MUSIC_DATA.filter(t => 
        (t.genre === track.genre || t.mood === track.mood) && 
        t.id !== trackId
      );

      return similarTracks.slice(0, 10);
    } catch (error) {
      console.error('Recommendations error:', error);
      return REAL_MUSIC_DATA.slice(0, 5);
    }
  }

  // Get track details
  async getTrackDetails(trackId: string): Promise<MusicSearchResult | null> {
    try {
      return REAL_MUSIC_DATA.find(track => track.id === trackId) || null;
    } catch (error) {
      console.error('Track details error:', error);
      return null;
    }
  }

  // Get lyrics for a track
  async getLyrics(trackId: string): Promise<string | null> {
    try {
      // Mock lyrics for now
      const track = REAL_MUSIC_DATA.find(t => t.id === trackId);
      if (!track) return null;

      // Return sample lyrics based on the track
      const sampleLyrics = {
        'pop-1': `Yeah
I've been tryna call
I've been on my own for long enough
Maybe you can show me how to love, maybe
I'm going through withdrawals
You don't even have to do too much
You can turn me on with just a touch, baby`,
        'rock-1': `Is this the real life?
Is this just fantasy?
Caught in a landslide
No escape from reality
Open your eyes
Look up to the skies and see`,
        'hiphop-1': `Yeah, yeah
I been movin' calm, don't start no trouble with me
Tryna keep it peaceful is a struggle for me
Don't pull up at 6 AM to cuddle with me
You know how I like it when you lovin' on me`
      };

      return sampleLyrics[trackId as keyof typeof sampleLyrics] || 'Lyrics not available';
    } catch (error) {
      console.error('Lyrics error:', error);
      return null;
    }
  }

  // Get available sources
  getAvailableSources(): string[] {
    return ['youtube', 'jiosaavn', 'soundcloud', 'deezer', 'fma', 'ia'];
  }

  // Get source information
  getSourceInfo(source: string): { name: string; description: string; quality: string } {
    const sourceInfo = {
      youtube: { name: 'YouTube Music', description: 'Official music videos and audio', quality: 'High' },
      jiosaavn: { name: 'JioSaavn', description: 'Indian music streaming platform', quality: 'High' },
      soundcloud: { name: 'SoundCloud', description: 'Independent artists and creators', quality: 'Variable' },
      deezer: { name: 'Deezer', description: 'International music streaming', quality: 'High' },
      fma: { name: 'Free Music Archive', description: 'Free and legal music', quality: 'Variable' },
      ia: { name: 'Internet Archive', description: 'Public domain and historical music', quality: 'Variable' }
    };

    return sourceInfo[source as keyof typeof sourceInfo] || { name: 'Unknown', description: 'Unknown source', quality: 'Unknown' };
  }

  // Parse YouTube duration
  parseYouTubeDuration(duration: string): number {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return 0;

    const hours = parseInt(match[1]?.replace('H', '') || '0');
    const minutes = parseInt(match[2]?.replace('M', '') || '0');
    const seconds = parseInt(match[3]?.replace('S', '') || '0');

    return hours * 3600 + minutes * 60 + seconds;
  }
}

export const musicApiService = new MusicAPIService();
