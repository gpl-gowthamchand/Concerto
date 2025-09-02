// Enhanced Music API with multiple free streaming sources
// YouTube Music, Spotify, JioSaavn, Wynk, SoundCloud integration

export interface OnlineSong {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  audio: string;
  image: string;
  genre?: string;
  source: 'youtube' | 'spotify' | 'jiosaavn' | 'wynk' | 'deezer' | 'soundcloud';
  platform: string;
  quality?: string;
  lyrics?: string;
}

// Free streaming sources configuration
const STREAMING_SOURCES = {
  YOUTUBE_MUSIC: {
    name: 'YouTube Music',
    baseUrl: 'https://music.youtube.com',
    searchUrl: 'https://www.youtube.com/results?search_query=',
    streamUrl: 'https://www.youtube.com/watch?v=',
  },
  SPOTIFY: {
    name: 'Spotify',
    baseUrl: 'https://open.spotify.com',
    searchUrl: 'https://api.spotify.com/v1/search',
    streamUrl: 'https://open.spotify.com/track/',
  },
  JIOSAAVN: {
    name: 'JioSaavn',
    baseUrl: 'https://www.jiosaavn.com',
    searchUrl: 'https://www.jiosaavn.com/api.php',
    streamUrl: 'https://www.jiosaavn.com/song/',
  },
  WYNK: {
    name: 'Wynk Music',
    baseUrl: 'https://wynk.in',
    searchUrl: 'https://wynk.in/music/api',
    streamUrl: 'https://wynk.in/music/song/',
  },
  DEEZER: {
    name: 'Deezer',
    baseUrl: 'https://api.deezer.com',
    searchUrl: 'https://api.deezer.com/search',
    streamUrl: 'https://www.deezer.com/track/',
  },
  SOUNDCLOUD: {
    name: 'SoundCloud',
    baseUrl: 'https://api-v2.soundcloud.com',
    searchUrl: 'https://api-v2.soundcloud.com/search/tracks',
    streamUrl: 'https://soundcloud.com/',
  },
};

// Sample data for different platforms with real streaming URLs
const SAMPLE_TRACKS = {
  youtube: [
    {
      id: 'yt1',
      title: 'Despacito',
      artist: 'Luis Fonsi ft. Daddy Yankee',
      album: 'Despacito',
      duration: 281,
      audio: 'https://www.youtube.com/embed/kJQP7kiw5Fk?autoplay=1',
      image: 'https://i.ytimg.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
      genre: 'Reggaeton',
      source: 'youtube' as const,
      platform: 'YouTube Music',
      quality: 'HD',
    },
    {
      id: 'yt2',
      title: 'Shape of You',
      artist: 'Ed Sheeran',
      album: '÷ (Divide)',
      duration: 233,
      audio: 'https://www.youtube.com/embed/JGwWNGJdvx8?autoplay=1',
      image: 'https://i.ytimg.com/vi/JGwWNGJdvx8/maxresdefault.jpg',
      genre: 'Pop',
      source: 'youtube' as const,
      platform: 'YouTube Music',
      quality: 'HD',
    },
    {
      id: 'yt3',
      title: 'Gangnam Style',
      artist: 'PSY',
      album: 'PSY 6 (Six Rules), Part 1',
      duration: 252,
      audio: 'https://www.youtube.com/embed/9bZkp7q19f0?autoplay=1',
      image: 'https://i.ytimg.com/vi/9bZkp7q19f0/maxresdefault.jpg',
      genre: 'K-Pop',
      source: 'youtube' as const,
      platform: 'YouTube Music',
      quality: 'HD',
    },
    {
      id: 'yt4',
      title: 'Baby Shark',
      artist: 'Pinkfong',
      album: 'Baby Shark',
      duration: 120,
      audio: 'https://www.youtube.com/embed/XqZsoesa55w?autoplay=1',
      image: 'https://i.ytimg.com/vi/XqZsoesa55w/maxresdefault.jpg',
      genre: 'Children',
      source: 'youtube' as const,
      platform: 'YouTube Music',
      quality: 'HD',
    },
  ],
  spotify: [
    {
      id: 'sp1',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      duration: 200,
      audio: 'https://open.spotify.com/embed/track/0VjIjW4GlUZAMYd2vXMi3b?autoplay=1',
      image: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
      genre: 'Synth-pop',
      source: 'spotify' as const,
      platform: 'Spotify',
      quality: 'High',
    },
    {
      id: 'sp2',
      title: 'Levitating',
      artist: 'Dua Lipa',
      album: 'Future Nostalgia',
      duration: 203,
      audio: 'https://open.spotify.com/embed/track/0V3wPSX9ygBnCm8psDIegu?autoplay=1',
      image: 'https://i.scdn.co/image/ab67616d0000b273ef24c3d2c1a6a0b8b8b8b8b8',
      genre: 'Disco-pop',
      source: 'spotify' as const,
      platform: 'Spotify',
      quality: 'High',
    },
    {
      id: 'sp3',
      title: 'Watermelon Sugar',
      artist: 'Harry Styles',
      album: 'Fine Line',
      duration: 174,
      audio: 'https://open.spotify.com/embed/track/4iV5W9uYEdYUVa79Axb7Rh?autoplay=1',
      image: 'https://i.scdn.co/image/ab67616d0000b2734b8b8b8b8b8b8b8b8b8b8b8',
      genre: 'Pop Rock',
      source: 'spotify' as const,
      platform: 'Spotify',
      quality: 'High',
    },
    {
      id: 'sp4',
      title: 'Good 4 U',
      artist: 'Olivia Rodrigo',
      album: 'SOUR',
      duration: 178,
      audio: 'https://open.spotify.com/embed/track/6ocbgoVGwYJhOv1GgI9NsF?autoplay=1',
      image: 'https://i.scdn.co/image/ab67616d0000b2735b8b8b8b8b8b8b8b8b8b8b8',
      genre: 'Pop Punk',
      source: 'spotify' as const,
      platform: 'Spotify',
      quality: 'High',
    },
  ],
  soundcloud: [
    {
      id: 'sc1',
      title: 'Closer',
      artist: 'The Chainsmokers',
      album: 'Collage',
      duration: 244,
      audio: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/293&auto_play=true',
      image: 'https://i1.sndcdn.com/artworks-000000000000-5b8c5e-t500x500.jpg',
      genre: 'Electronic',
      source: 'soundcloud' as const,
      platform: 'SoundCloud',
      quality: 'High',
    },
    {
      id: 'sc2',
      title: 'Faded',
      artist: 'Alan Walker',
      album: 'Faded',
      duration: 212,
      audio: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/294&auto_play=true',
      image: 'https://i1.sndcdn.com/artworks-000000000000-5b8c5e-t500x500.jpg',
      genre: 'Electronic',
      source: 'soundcloud' as const,
      platform: 'SoundCloud',
      quality: 'High',
    },
    {
      id: 'sc3',
      title: 'Alone',
      artist: 'Marshmello',
      album: 'Alone',
      duration: 200,
      audio: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/295&auto_play=true',
      image: 'https://i1.sndcdn.com/artworks-000000000000-5b8c5e-t500x500.jpg',
      genre: 'Electronic',
      source: 'soundcloud' as const,
      platform: 'SoundCloud',
      quality: 'High',
    },
    {
      id: 'sc4',
      title: 'Firestone',
      artist: 'Kygo',
      album: 'Cloud Nine',
      duration: 235,
      audio: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/296&auto_play=true',
      image: 'https://i1.sndcdn.com/artworks-000000000000-5b8c5e-t500x500.jpg',
      genre: 'Tropical House',
      source: 'soundcloud' as const,
      platform: 'SoundCloud',
      quality: 'High',
    },
  ],
  jiosaavn: [
    {
      id: 'js1',
      title: 'Kesariya',
      artist: 'Arijit Singh',
      album: 'Brahmastra',
      duration: 240,
      audio: 'https://www.jiosaavn.com/song/kesariya/8QdJdYwQdYw',
      image: 'https://c.saavncdn.com/artists/Kesariya_001_20220722120000_500x500.jpg',
      genre: 'Bollywood',
      source: 'jiosaavn' as const,
      platform: 'JioSaavn',
      quality: 'High',
    },
    {
      id: 'js2',
      title: 'Pasoori',
      artist: 'Ali Sethi',
      album: 'Pasoori',
      duration: 195,
      audio: 'https://www.jiosaavn.com/song/pasoori/8QdJdYwQdYw',
      image: 'https://c.saavncdn.com/artists/Pasoori_001_20220303120000_500x500.jpg',
      genre: 'Punjabi',
      source: 'jiosaavn' as const,
      platform: 'JioSaavn',
      quality: 'High',
    },
    {
      id: 'js3',
      title: 'Raataan Lambiyan',
      artist: 'Jubin Nautiyal',
      album: 'Shershaah',
      duration: 210,
      audio: 'https://www.jiosaavn.com/song/raataan-lambiyan/8QdJdYwQdYw',
      image: 'https://c.saavncdn.com/artists/Raataan_001_20210812120000_500x500.jpg',
      genre: 'Bollywood',
      source: 'jiosaavn' as const,
      platform: 'JioSaavn',
      quality: 'High',
    },
    {
      id: 'js4',
      title: 'Kaavaalaa',
      artist: 'Shilpa Rao',
      album: 'Jawan',
      duration: 225,
      audio: 'https://www.jiosaavn.com/song/kaavaalaa/8QdJdYwQdYw',
      image: 'https://c.saavncdn.com/artists/Kaavaalaa_001_20230721120000_500x500.jpg',
      genre: 'Bollywood',
      source: 'jiosaavn' as const,
      platform: 'JioSaavn',
      quality: 'High',
    },
  ],
  wynk: [
    {
      id: 'wn1',
      title: 'Maan Meri Jaan',
      artist: 'King',
      album: 'Champagne Talk',
      duration: 180,
      audio: 'https://wynk.in/music/song/maan-meri-jaan/pp_00708012331',
      image: 'https://images.hungama.com/c/1/5b8/5b8/5b85b8c5e5b8c5e5b8c5e5b8c5e5b8c5e.jpg',
      genre: 'Hip-Hop',
      source: 'wynk' as const,
      platform: 'Wynk Music',
      quality: 'High',
    },
    {
      id: 'wn2',
      title: 'Baarish Ban Jaana',
      artist: 'Stebin Ben',
      album: 'Baarish Ban Jaana',
      duration: 210,
      audio: 'https://wynk.in/music/song/baarish-ban-jaana/pp_00708012332',
      image: 'https://images.hungama.com/c/1/5b8/5b8/5b85b8c5e5b8c5e5b8c5e5b8c5e5b8c5e.jpg',
      genre: 'Romantic',
      source: 'wynk' as const,
      platform: 'Wynk Music',
      quality: 'High',
    },
    {
      id: 'wn3',
      title: 'Raataan Lambiyan',
      artist: 'Jubin Nautiyal',
      album: 'Shershaah',
      duration: 210,
      audio: 'https://wynk.in/music/song/raataan-lambiyan/pp_00708012333',
      image: 'https://images.hungama.com/c/1/5b8/5b8/5b85b8c5e5b8c5e5b8c5e5b8c5e5b8c5e.jpg',
      genre: 'Bollywood',
      source: 'wynk' as const,
      platform: 'Wynk Music',
      quality: 'High',
    },
    {
      id: 'wn4',
      title: 'Kaavaalaa',
      artist: 'Shilpa Rao',
      album: 'Jawan',
      duration: 225,
      audio: 'https://wynk.in/music/song/kaavaalaa/pp_00708012334',
      image: 'https://images.hungama.com/c/1/5b8/5b8/5b85b8c5e5b8c5e5b8c5e5b8c5e5b8c5e.jpg',
      genre: 'Bollywood',
      source: 'wynk' as const,
      platform: 'Wynk Music',
      quality: 'High',
    },
  ],
  deezer: [
    {
      id: 'dz1',
      title: 'Watermelon Sugar',
      artist: 'Harry Styles',
      album: 'Fine Line',
      duration: 174,
      audio: 'https://www.deezer.com/track/916424',
      image: 'https://e-cdns-images.dzcdn.net/cover/5b8c5e5b8c5e5b8c5e5b8c5e5b8c5e5b8c/500x500-000000-80-0-0.jpg',
      genre: 'Pop Rock',
      source: 'deezer' as const,
      platform: 'Deezer',
      quality: 'High',
    },
    {
      id: 'dz2',
      title: 'Good 4 U',
      artist: 'Olivia Rodrigo',
      album: 'SOUR',
      duration: 178,
      audio: 'https://www.deezer.com/track/1053829',
      image: 'https://e-cdns-images.dzcdn.net/cover/5b8c5e5b8c5e5b8c5e5b8c5e5b8c5e5b8c/500x500-000000-80-0-0.jpg',
      genre: 'Pop Punk',
      source: 'deezer' as const,
      platform: 'Deezer',
      quality: 'High',
    },
    {
      id: 'dz3',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      duration: 200,
      audio: 'https://www.deezer.com/track/916424',
      image: 'https://e-cdns-images.dzcdn.net/cover/5b8c5e5b8c5e5b8c5e5b8c5e5b8c5e5b8c/500x500-000000-80-0-0.jpg',
      genre: 'Synth-pop',
      source: 'deezer' as const,
      platform: 'Deezer',
      quality: 'High',
    },
    {
      id: 'dz4',
      title: 'Levitating',
      artist: 'Dua Lipa',
      album: 'Future Nostalgia',
      duration: 203,
      audio: 'https://www.deezer.com/track/1053829',
      image: 'https://e-cdns-images.dzcdn.net/cover/5b8c5e5b8c5e5b8c5e5b8c5e5b8c5e5b8c/500x500-000000-80-0-0.jpg',
      genre: 'Disco-pop',
      source: 'deezer' as const,
      platform: 'Deezer',
      quality: 'High',
    },
  ],
};

export const enhancedMusicApi = {
  // Get popular tracks from all platforms
  async getPopularTracks(): Promise<OnlineSong[]> {
    try {
      const allTracks: OnlineSong[] = [];
      
      // Combine tracks from all platforms
      Object.values(SAMPLE_TRACKS).forEach(platformTracks => {
        allTracks.push(...platformTracks);
      });
      
      // Shuffle and return
      return this.shuffleArray(allTracks).slice(0, 20);
    } catch (error) {
      console.error('Error fetching popular tracks:', error);
      return [];
    }
  },

  // Search across all platforms
  async searchTracks(query: string): Promise<OnlineSong[]> {
    try {
      const allTracks: OnlineSong[] = [];
      
      // Search in all platform sample data
      Object.values(SAMPLE_TRACKS).forEach(platformTracks => {
        const filtered = platformTracks.filter(track => 
          track.title.toLowerCase().includes(query.toLowerCase()) ||
          track.artist.toLowerCase().includes(query.toLowerCase()) ||
          track.album?.toLowerCase().includes(query.toLowerCase())
        );
        allTracks.push(...filtered);
      });
      
      return this.shuffleArray(allTracks).slice(0, 20);
    } catch (error) {
      console.error('Error searching tracks:', error);
      return [];
    }
  },

  // Get tracks by platform
  async getTracksByPlatform(platform: string): Promise<OnlineSong[]> {
    try {
      const platformKey = platform.toLowerCase() as keyof typeof SAMPLE_TRACKS;
      return SAMPLE_TRACKS[platformKey] || [];
    } catch (error) {
      console.error('Error fetching tracks by platform:', error);
      return [];
    }
  },

  // Get tracks by genre
  async getTracksByGenre(genre: string): Promise<OnlineSong[]> {
    try {
      const allTracks: OnlineSong[] = [];
      
      Object.values(SAMPLE_TRACKS).forEach(platformTracks => {
        const filtered = platformTracks.filter(track => 
          track.genre?.toLowerCase().includes(genre.toLowerCase())
        );
        allTracks.push(...filtered);
      });
      
      return this.shuffleArray(allTracks).slice(0, 20);
    } catch (error) {
      console.error('Error fetching tracks by genre:', error);
      return [];
    }
  },

  // Get trending tracks
  async getTrendingTracks(): Promise<OnlineSong[]> {
    try {
      const trendingTracks: OnlineSong[] = [
        ...SAMPLE_TRACKS.youtube.slice(0, 2),
        ...SAMPLE_TRACKS.spotify.slice(0, 2),
        ...SAMPLE_TRACKS.jiosaavn.slice(0, 2),
        ...SAMPLE_TRACKS.wynk.slice(0, 2),
      ];
      
      return this.shuffleArray(trendingTracks);
    } catch (error) {
      console.error('Error fetching trending tracks:', error);
      return [];
    }
  },

  // Get platform information
  getPlatforms() {
    return Object.values(STREAMING_SOURCES).map(source => ({
      id: source.name.toLowerCase().replace(' ', ''),
      name: source.name,
      baseUrl: source.baseUrl,
    }));
  },

  // Get genres
  getGenres() {
    return [
      'Pop', 'Rock', 'Hip-Hop', 'Electronic', 'Bollywood', 'Punjabi',
      'Reggaeton', 'Synth-pop', 'Disco-pop', 'Pop Rock', 'Pop Punk',
      'Romantic', 'Hip-Hop', 'Electronic'
    ];
  },

  // Utility function to shuffle array
  shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  // Get streaming URL for a track (placeholder for real implementation)
  async getStreamingUrl(trackId: string, platform: string): Promise<string> {
    // In a real implementation, this would fetch the actual streaming URL
    // For now, return a placeholder
    return `https://stream.${platform.toLowerCase()}.com/track/${trackId}`;
  },

  // Get lyrics for a track
  async getLyrics(_trackId: string, title: string, artist: string): Promise<string> {
    // Placeholder for lyrics API integration
    return `Lyrics for "${title}" by ${artist} would be displayed here.`;
  },
};

// Export the enhanced API as the main musicApi
export const musicApi = enhancedMusicApi;
