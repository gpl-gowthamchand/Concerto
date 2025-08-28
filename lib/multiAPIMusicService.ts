// Multi-API Music Service for Concerto
// Combines multiple music APIs for complete coverage

export interface UnifiedTrack {
  id: string
  title: string
  artist: string
  album?: string
  duration: number
  thumbnail: string
  source: 'youtube' | 'spotify' | 'lastfm' | 'itunes' | 'deezer'
  sourceUrl: string
  genre?: string
  year?: number
  popularity?: number
  previewUrl?: string
  isrc?: string
}

export interface SearchResult {
  tracks: UnifiedTrack[]
  totalResults: number
  query: string
  sources: string[]
}

export interface APISource {
  name: string
  enabled: boolean
  priority: number
  search: (query: string, limit: number) => Promise<UnifiedTrack[]>
}

class MultiAPIMusicService {
  private sources: APISource[] = []
  private isInitialized = false

  constructor() {
    this.initializeSources()
  }

  private initializeSources() {
    // YouTube Music (already implemented)
    this.sources.push({
      name: 'YouTube Music',
      enabled: true,
      priority: 1,
      search: this.searchYouTubeMusic.bind(this)
    })

    // Spotify Web API
    this.sources.push({
      name: 'Spotify',
      enabled: true,
      priority: 2,
      search: this.searchSpotify.bind(this)
    })

    // Last.fm API
    this.sources.push({
      name: 'Last.fm',
      enabled: true,
      priority: 3,
      search: this.searchLastFM.bind(this)
    })

    // iTunes/Apple Music API
    this.sources.push({
      name: 'iTunes',
      enabled: true,
      priority: 4,
      search: this.searchiTunes.bind(this)
    })

    // Deezer API
    this.sources.push({
      name: 'Deezer',
      enabled: true,
      priority: 5,
      search: this.searchDeezer.bind(this)
    })

    this.isInitialized = true
  }

  // Search across all APIs
  async searchMusic(query: string, maxResults: number = 30): Promise<SearchResult> {
    if (!this.isInitialized) {
      throw new Error('Service not initialized')
    }

    const enabledSources = this.sources.filter(s => s.enabled)
    const results: UnifiedTrack[] = []
    const sources: string[] = []

    // Search each enabled source
    for (const source of enabledSources) {
      try {
        const tracks = await source.search(query, Math.ceil(maxResults / enabledSources.length))
        results.push(...tracks)
        sources.push(source.name)
      } catch (error) {
        console.error(`Error searching ${source.name}:`, error)
      }
    }

    // Remove duplicates and sort by relevance
    const uniqueResults = this.removeDuplicates(results)
    const sortedResults = this.sortByRelevance(uniqueResults, query)

    return {
      tracks: sortedResults.slice(0, maxResults),
      totalResults: sortedResults.length,
      query,
      sources
    }
  }

  // YouTube Music search (existing implementation)
  private async searchYouTubeMusic(query: string, limit: number): Promise<UnifiedTrack[]> {
    // Mock implementation - replace with real YouTube Music API
    const mockTracks: UnifiedTrack[] = [
      {
        id: `yt-${Date.now()}-1`,
        title: 'Never Gonna Give You Up',
        artist: 'Rick Astley',
        album: 'Whenever You Need Somebody',
        duration: 212,
        thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
        source: 'youtube',
        sourceUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        genre: 'Pop',
        year: 1987,
        popularity: 95
      }
    ]
    
    return mockTracks.filter(track => 
      track.title.toLowerCase().includes(query.toLowerCase()) ||
      track.artist.toLowerCase().includes(query.toLowerCase())
    ).slice(0, limit)
  }

  // Spotify search
  private async searchSpotify(query: string, limit: number): Promise<UnifiedTrack[]> {
    // Mock implementation - replace with real Spotify Web API
    const mockTracks: UnifiedTrack[] = [
      {
        id: `spotify-${Date.now()}-1`,
        title: 'Bohemian Rhapsody',
        artist: 'Queen',
        album: 'A Night at the Opera',
        duration: 354,
        thumbnail: 'https://i.scdn.co/image/ab67616d0000b273ce4f1737e8c475c56c354f9f',
        source: 'spotify',
        sourceUrl: 'https://open.spotify.com/track/3z8h0TU7ReDPLIbEnYhWZb',
        genre: 'Rock',
        year: 1975,
        popularity: 98,
        previewUrl: 'https://p.scdn.co/mp3-preview/ce4f1737e8c475c56c354f9f'
      }
    ]
    
    return mockTracks.filter(track => 
      track.title.toLowerCase().includes(query.toLowerCase()) ||
      track.artist.toLowerCase().includes(query.toLowerCase())
    ).slice(0, limit)
  }

  // Last.fm search
  private async searchLastFM(query: string, limit: number): Promise<UnifiedTrack[]> {
    // Mock implementation - replace with real Last.fm API
    const mockTracks: UnifiedTrack[] = [
      {
        id: `lastfm-${Date.now()}-1`,
        title: 'Imagine',
        artist: 'John Lennon',
        album: 'Imagine',
        duration: 183,
        thumbnail: 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png',
        source: 'lastfm',
        sourceUrl: 'https://www.last.fm/music/John+Lennon/_/Imagine',
        genre: 'Rock',
        year: 1971,
        popularity: 97
      }
    ]
    
    return mockTracks.filter(track => 
      track.title.toLowerCase().includes(query.toLowerCase()) ||
      track.artist.toLowerCase().includes(query.toLowerCase())
    ).slice(0, limit)
  }

  // iTunes search
  private async searchiTunes(query: string, limit: number): Promise<UnifiedTrack[]> {
    // Mock implementation - replace with real iTunes API
    const mockTracks: UnifiedTrack[] = [
      {
        id: `itunes-${Date.now()}-1`,
        title: 'Hotel California',
        artist: 'Eagles',
        album: 'Hotel California',
        duration: 391,
        thumbnail: 'https://is1-ssl.mzstatic.com/image/thumb/Music/6c/8f/9c/mzi.quxrqjol.jpg/300x300bb.jpg',
        source: 'itunes',
        sourceUrl: 'https://music.apple.com/us/album/hotel-california/1440816896',
        genre: 'Rock',
        year: 1976,
        popularity: 96
      }
    ]
    
    return mockTracks.filter(track => 
      track.title.toLowerCase().includes(query.toLowerCase()) ||
      track.artist.toLowerCase().includes(query.toLowerCase())
    ).slice(0, limit)
  }

  // Deezer search
  private async searchDeezer(query: string, limit: number): Promise<UnifiedTrack[]> {
    // Mock implementation - replace with real Deezer API
    const mockTracks: UnifiedTrack[] = [
      {
        id: `deezer-${Date.now()}-1`,
        title: 'Stairway to Heaven',
        artist: 'Led Zeppelin',
        album: 'Led Zeppelin IV',
        duration: 482,
        thumbnail: 'https://e-cdns-images.dzcdn.net/images/cover/5c4c3c3c3c3c3c3c3c3c3c3c3c3c3c3c/300x300-000000-80-0-0.jpg',
        source: 'deezer',
        sourceUrl: 'https://www.deezer.com/en/track/3135556',
        genre: 'Rock',
        year: 1971,
        popularity: 99
      }
    ]
    
    return mockTracks.filter(track => 
      track.title.toLowerCase().includes(query.toLowerCase()) ||
      track.artist.toLowerCase().includes(query.toLowerCase())
    ).slice(0, limit)
  }

  // Remove duplicate tracks based on title and artist
  private removeDuplicates(tracks: UnifiedTrack[]): UnifiedTrack[] {
    const seen = new Set<string>()
    return tracks.filter(track => {
      const key = `${track.title.toLowerCase()}-${track.artist.toLowerCase()}`
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }

  // Sort tracks by relevance to search query
  private sortByRelevance(tracks: UnifiedTrack[], query: string): UnifiedTrack[] {
    const queryLower = query.toLowerCase()
    
    return tracks.sort((a, b) => {
      let scoreA = 0
      let scoreB = 0

      // Title match (highest priority)
      if (a.title.toLowerCase().includes(queryLower)) scoreA += 10
      if (b.title.toLowerCase().includes(queryLower)) scoreB += 10

      // Artist match
      if (a.artist.toLowerCase().includes(queryLower)) scoreA += 8
      if (b.artist.toLowerCase().includes(queryLower)) scoreB += 8

      // Album match
      if (a.album?.toLowerCase().includes(queryLower)) scoreA += 6
      if (b.album?.toLowerCase().includes(queryLower)) scoreB += 6

      // Source priority
      scoreA += (6 - this.sources.find(s => s.name.toLowerCase().includes(a.source))?.priority || 0)
      scoreB += (6 - this.sources.find(s => s.name.toLowerCase().includes(b.source))?.priority || 0)

      // Popularity bonus
      scoreA += (a.popularity || 0) / 100
      scoreB += (b.popularity || 0) / 100

      return scoreB - scoreA
    })
  }

  // Get trending music from all sources
  async getTrendingMusic(limit: number = 20): Promise<UnifiedTrack[]> {
    const trendingQueries = [
      'top hits 2024',
      'popular songs',
      'trending music',
      'viral songs',
      'chart toppers'
    ]
    
    const randomQuery = trendingQueries[Math.floor(Math.random() * trendingQueries.length)]
    const result = await this.searchMusic(randomQuery, limit)
    return result.tracks
  }

  // Get music by genre from all sources
  async getMusicByGenre(genre: string, limit: number = 20): Promise<UnifiedTrack[]> {
    const result = await this.searchMusic(`${genre} music`, limit)
    return result.tracks
  }

  // Get music by mood from all sources
  async getMusicByMood(mood: string, limit: number = 20): Promise<UnifiedTrack[]> {
    const moodQueries: Record<string, string> = {
      'happy': 'upbeat happy music',
      'sad': 'sad emotional music',
      'energetic': 'energetic workout music',
      'relaxing': 'relaxing chill music',
      'romantic': 'romantic love songs',
      'party': 'party dance music',
      'focus': 'focus study music',
      'sleep': 'sleep lullaby music'
    }
    
    const query = moodQueries[mood] || `${mood} music`
    const result = await this.searchMusic(query, limit)
    return result.tracks
  }

  // Enable/disable specific API sources
  toggleSource(name: string, enabled: boolean) {
    const source = this.sources.find(s => s.name === name)
    if (source) {
      source.enabled = enabled
    }
  }

  // Get source status
  getSourceStatus() {
    return this.sources.map(source => ({
      name: source.name,
      enabled: source.enabled,
      priority: source.priority
    }))
  }

  // Get unified track by ID
  async getTrackById(_id: string): Promise<UnifiedTrack | null> {
    // This would need to be implemented based on the source
    // For now, return null
    return null
  }
}

// Export singleton instance
export const multiAPIMusicService = new MultiAPIMusicService()

// Export types
export type { UnifiedTrack, SearchResult, APISource }
