export interface Song {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  cover: string
  isLiked?: boolean
  genre?: string
  year?: number
  url?: string
  audioUrl?: string
  lyrics?: string
  plays?: number
  addedDate?: string
}

export interface Artist {
  id: string
  name: string
  bio?: string
  image: string
  followers: number
  genres: string[]
}

export interface Album {
  id: string
  title: string
  artist: string
  year: number
  cover: string
  songs: string[] // Song IDs
  genre: string
}

export interface Playlist {
  id: string
  name: string
  description?: string
  cover: string
  songs: string[] // Song IDs
  createdBy: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

// Mock data for development
export const mockSongs: Song[] = [
  {
    id: '1',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    duration: 355,
    cover: '🎵',
    genre: 'Rock',
    year: 1975,
    isLiked: true,
    audioUrl: '/demo-audio/song1.mp3'
  },
  {
    id: '2',
    title: 'Hotel California',
    artist: 'Eagles',
    album: 'Hotel California',
    duration: 391,
    cover: '🎵',
    genre: 'Rock',
    year: 1976,
    isLiked: false,
    audioUrl: '/demo-audio/song2.mp3'
  },
  {
    id: '3',
    title: 'Imagine',
    artist: 'John Lennon',
    album: 'Imagine',
    duration: 183,
    cover: '🎵',
    genre: 'Pop',
    year: 1971,
    isLiked: true,
    audioUrl: '/demo-audio/song3.mp3'
  },
  {
    id: '4',
    title: 'Stairway to Heaven',
    artist: 'Led Zeppelin',
    album: 'Led Zeppelin IV',
    duration: 482,
    cover: '🎵',
    genre: 'Rock',
    year: 1971,
    isLiked: false,
    audioUrl: '/demo-audio/song4.mp3'
  },
  {
    id: '5',
    title: 'Billie Jean',
    artist: 'Michael Jackson',
    album: 'Thriller',
    duration: 294,
    cover: '🎵',
    genre: 'Pop',
    year: 1982,
    isLiked: true,
    audioUrl: '/demo-audio/song5.mp3'
  },
  {
    id: '6',
    title: 'Sweet Child O\' Mine',
    artist: 'Guns N\' Roses',
    album: 'Appetite for Destruction',
    duration: 356,
    cover: '🎵',
    genre: 'Rock',
    year: 1987,
    isLiked: false,
    audioUrl: '/demo-audio/song6.mp3'
  },
  {
    id: '7',
    title: 'Smells Like Teen Spirit',
    artist: 'Nirvana',
    album: 'Nevermind',
    duration: 301,
    cover: '🎵',
    genre: 'Grunge',
    year: 1991,
    isLiked: true,
    audioUrl: '/demo-audio/song7.mp3'
  },
  {
    id: '8',
    title: 'Wonderwall',
    artist: 'Oasis',
    album: '(What\'s the Story) Morning Glory?',
    duration: 259,
    cover: '🎵',
    genre: 'Britpop',
    year: 1995,
    isLiked: false,
    audioUrl: '/demo-audio/song8.mp3'
  },
  {
    id: '9',
    title: 'Creep',
    artist: 'Radiohead',
    album: 'Pablo Honey',
    duration: 239,
    cover: '🎵',
    genre: 'Alternative',
    year: 1993,
    isLiked: true,
    audioUrl: '/demo-audio/song9.mp3'
  },
  {
    id: '10',
    title: 'Losing My Religion',
    artist: 'R.E.M.',
    album: 'Out of Time',
    duration: 269,
    cover: '🎵',
    genre: 'Alternative',
    year: 1991,
    isLiked: false,
    audioUrl: '/demo-audio/song10.mp3'
  }
]

export const mockArtists: Artist[] = [
  {
    id: '1',
    name: 'Queen',
    bio: 'British rock band formed in London in 1970',
    image: '👑',
    followers: 25000000,
    genres: ['Rock', 'Progressive Rock']
  },
  {
    id: '2',
    name: 'Eagles',
    bio: 'American rock band formed in Los Angeles in 1971',
    image: '🦅',
    followers: 20000000,
    genres: ['Rock', 'Country Rock']
  },
  {
    id: '3',
    name: 'Michael Jackson',
    bio: 'American singer, songwriter, and dancer',
    image: '🌙',
    followers: 35000000,
    genres: ['Pop', 'R&B', 'Soul']
  },
  {
    id: '4',
    name: 'Nirvana',
    bio: 'American rock band formed in Aberdeen, Washington',
    image: '⚡',
    followers: 18000000,
    genres: ['Grunge', 'Alternative Rock']
  },
  {
    id: '5',
    name: 'Oasis',
    bio: 'English rock band formed in Manchester in 1991',
    image: '☀️',
    followers: 15000000,
    genres: ['Britpop', 'Rock']
  }
]

export const mockAlbums: Album[] = [
  {
    id: '1',
    title: 'A Night at the Opera',
    artist: 'Queen',
    year: 1975,
    cover: '🎭',
    songs: ['1'],
    genre: 'Rock'
  },
  {
    id: '2',
    title: 'Hotel California',
    artist: 'Eagles',
    year: 1976,
    cover: '🏨',
    songs: ['2'],
    genre: 'Rock'
  },
  {
    id: '3',
    title: 'Thriller',
    artist: 'Michael Jackson',
    year: 1982,
    cover: '🧟',
    songs: ['5'],
    genre: 'Pop'
  },
  {
    id: '4',
    title: 'Nevermind',
    artist: 'Nirvana',
    year: 1991,
    cover: '👶',
    songs: ['7'],
    genre: 'Grunge'
  },
  {
    id: '5',
    title: '(What\'s the Story) Morning Glory?',
    artist: 'Oasis',
    year: 1995,
    cover: '🌅',
    songs: ['8'],
    genre: 'Britpop'
  }
]

export const mockPlaylists: Playlist[] = [
  {
    id: '1',
    name: 'Rock Classics',
    description: 'The greatest rock songs of all time',
    cover: '🤘',
    songs: ['1', '2', '4', '6'],
    createdBy: 'system',
    isPublic: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: '90s Alternative',
    description: 'Alternative rock from the 1990s',
    cover: '🎸',
    songs: ['7', '8', '9', '10'],
    createdBy: 'system',
    isPublic: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '3',
    name: 'Pop Hits',
    description: 'Popular pop songs through the decades',
    cover: '🎵',
    songs: ['3', '5'],
    createdBy: 'system',
    isPublic: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '4',
    name: 'My Favorites',
    description: 'Personal collection of favorite songs',
    cover: '❤️',
    songs: ['1', '3', '5', '7', '9'],
    createdBy: 'user',
    isPublic: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-25')
  }
]

// Utility functions
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export function sortSongs(songs: Song[], sortBy: 'title' | 'artist' | 'album' | 'duration' | 'year'): Song[] {
  return [...songs].sort((a, b) => {
    const aValue = a[sortBy] as string | number
    const bValue = b[sortBy] as string | number
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue)
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return aValue - bValue
    }
    
    return 0
  })
}

export function filterSongs(songs: Song[], filters: { genre?: string; year?: number; artist?: string }): Song[] {
  return songs.filter(song => {
    if (filters.genre && song.genre !== filters.genre) return false
    if (filters.year && song.year !== filters.year) return false
    if (filters.artist && song.artist !== filters.artist) return false
    return true
  })
}

export function searchSongs(songs: Song[], query: string): Song[] {
  const lowerQuery = query.toLowerCase()
  return songs.filter(song => 
    song.title.toLowerCase().includes(lowerQuery) ||
    song.artist.toLowerCase().includes(lowerQuery) ||
    song.album.toLowerCase().includes(lowerQuery) ||
    song.genre?.toLowerCase().includes(lowerQuery)
  )
}
