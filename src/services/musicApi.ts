// Music API service for online music streaming
// Using a free music API for demo purposes

export interface OnlineSong {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number;
  audio: string;
  image: string;
  genre?: string;
  source: 'online';
}

// Free music API endpoints (using Jamendo API as example)
// const JAMENDO_API_BASE = 'https://api.jamendo.com/v3.0';
// const JAMENDO_CLIENT_ID = 'your_jamendo_client_id'; // You'll need to get this from Jamendo

// Alternative: Using a free music streaming service
const FREE_MUSIC_API = 'https://api.deezer.com';

export const musicApi = {
  // Get popular tracks
  async getPopularTracks(): Promise<OnlineSong[]> {
    try {
      // Using Deezer API (free, no auth required for basic usage)
      const response = await fetch(`${FREE_MUSIC_API}/chart/0/tracks`);
      const data = await response.json();
      
      return data.data?.slice(0, 20).map((track: any) => ({
        id: track.id.toString(),
        title: track.title,
        artist: track.artist.name,
        album: track.album.title,
        duration: track.duration,
        audio: track.preview, // 30-second preview
        image: track.album.cover_medium,
        genre: track.artist.name, // Using artist as genre for demo
        source: 'online' as const,
      })) || [];
    } catch (error) {
      console.error('Error fetching popular tracks:', error);
      return [];
    }
  },

  // Search for tracks
  async searchTracks(query: string): Promise<OnlineSong[]> {
    try {
      const response = await fetch(`${FREE_MUSIC_API}/search/track?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      return data.data?.slice(0, 20).map((track: any) => ({
        id: track.id.toString(),
        title: track.title,
        artist: track.artist.name,
        album: track.album.title,
        duration: track.duration,
        audio: track.preview,
        image: track.album.cover_medium,
        genre: track.artist.name,
        source: 'online' as const,
      })) || [];
    } catch (error) {
      console.error('Error searching tracks:', error);
      return [];
    }
  },

  // Get tracks by genre
  async getTracksByGenre(genre: string): Promise<OnlineSong[]> {
    try {
      const response = await fetch(`${FREE_MUSIC_API}/search/track?q=genre:${encodeURIComponent(genre)}`);
      const data = await response.json();
      
      return data.data?.slice(0, 20).map((track: any) => ({
        id: track.id.toString(),
        title: track.title,
        artist: track.artist.name,
        album: track.album.title,
        duration: track.duration,
        audio: track.preview,
        image: track.album.cover_medium,
        genre: genre,
        source: 'online' as const,
      })) || [];
    } catch (error) {
      console.error('Error fetching tracks by genre:', error);
      return [];
    }
  },

  // Get artist tracks
  async getArtistTracks(artistId: string): Promise<OnlineSong[]> {
    try {
      const response = await fetch(`${FREE_MUSIC_API}/artist/${artistId}/top`);
      const data = await response.json();
      
      return data.data?.slice(0, 20).map((track: any) => ({
        id: track.id.toString(),
        title: track.title,
        artist: track.artist.name,
        album: track.album.title,
        duration: track.duration,
        audio: track.preview,
        image: track.album.cover_medium,
        genre: track.artist.name,
        source: 'online' as const,
      })) || [];
    } catch (error) {
      console.error('Error fetching artist tracks:', error);
      return [];
    }
  },
};

// Fallback sample data for when API is not available
export const fallbackSongs: OnlineSong[] = [
  {
    id: 'online1',
    title: 'Online Song 1',
    artist: 'Online Artist 1',
    album: 'Online Album 1',
    duration: 180,
    audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    image: 'https://via.placeholder.com/300x300/1f2937/ffffff?text=Online+1',
    genre: 'Pop',
    source: 'online',
  },
  {
    id: 'online2',
    title: 'Online Song 2',
    artist: 'Online Artist 2',
    album: 'Online Album 2',
    duration: 200,
    audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    image: 'https://via.placeholder.com/300x300/374151/ffffff?text=Online+2',
    genre: 'Rock',
    source: 'online',
  },
  {
    id: 'online3',
    title: 'Online Song 3',
    artist: 'Online Artist 3',
    album: 'Online Album 3',
    duration: 160,
    audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    image: 'https://via.placeholder.com/300x300/4b5563/ffffff?text=Online+3',
    genre: 'Jazz',
    source: 'online',
  },
  {
    id: 'online4',
    title: 'Online Song 4',
    artist: 'Online Artist 4',
    album: 'Online Album 4',
    duration: 220,
    audio: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    image: 'https://via.placeholder.com/300x300/6b7280/ffffff?text=Online+4',
    genre: 'Electronic',
    source: 'online',
  },
];
