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
    cover: '/api/placeholder/300/300',
    genre: 'Rock',
    year: 1975,
    isLiked: true
  },
  {
    id: '2',
    title: 'Hotel California',
    artist: 'Eagles',
    album: 'Hotel California',
    duration: 391,
    cover: '/api/placeholder/300/300',
    genre: 'Rock',
    year: 1976,
    isLiked: false
  },
  {
    id: '3',
    title: 'Imagine',
    artist: 'John Lennon',
    album: 'Imagine',
    duration: 183,
    cover: '/api/placeholder/300/300',
    genre: 'Pop',
    year: 1971,
    isLiked: true
  },
  {
    id: '4',
    title: 'Stairway to Heaven',
    artist: 'Led Zeppelin',
    album: 'Led Zeppelin IV',
    duration: 482,
    cover: '/api/placeholder/300/300',
    genre: 'Rock',
    year: 1971,
    isLiked: false
  },
  {
    id: '5',
    title: 'Billie Jean',
    artist: 'Michael Jackson',
    album: 'Thriller',
    duration: 294,
    cover: '/api/placeholder/300/300',
    genre: 'Pop',
    year: 1982,
    isLiked: true
  },
  {
    id: '6',
    title: 'Smells Like Teen Spirit',
    artist: 'Nirvana',
    album: 'Nevermind',
    duration: 301,
    cover: '/api/placeholder/300/300',
    genre: 'Alternative',
    year: 1991,
    isLiked: false
  },
  {
    id: '7',
    title: 'Like a Rolling Stone',
    artist: 'Bob Dylan',
    album: 'Highway 61 Revisited',
    duration: 365,
    cover: '/api/placeholder/300/300',
    genre: 'Folk Rock',
    year: 1965,
    isLiked: true
  },
  {
    id: '8',
    title: 'Good Vibrations',
    artist: 'The Beach Boys',
    album: 'Smiley Smile',
    duration: 216,
    cover: '/api/placeholder/300/300',
    genre: 'Pop Rock',
    year: 1966,
    isLiked: false
  },
  {
    id: '9',
    title: 'Respect',
    artist: 'Aretha Franklin',
    album: 'I Never Loved a Man the Way I Love You',
    duration: 147,
    cover: '/api/placeholder/300/300',
    genre: 'Soul',
    year: 1967,
    isLiked: true
  },
  {
    id: '10',
    title: 'Johnny B. Goode',
    artist: 'Chuck Berry',
    album: 'Chuck Berry Is on Top',
    duration: 161,
    cover: '/api/placeholder/300/300',
    genre: 'Rock and Roll',
    year: 1958,
    isLiked: false
  }
]

export const mockArtists: Artist[] = [
  {
    id: '1',
    name: 'Queen',
    bio: 'British rock band formed in London in 1970',
    image: '/api/placeholder/300/300',
    followers: 25000000,
    genres: ['Rock', 'Hard Rock', 'Progressive Rock']
  },
  {
    id: '2',
    name: 'Eagles',
    bio: 'American rock band formed in Los Angeles in 1971',
    image: '/api/placeholder/300/300',
    followers: 18000000,
    genres: ['Rock', 'Country Rock', 'Soft Rock']
  },
  {
    id: '3',
    name: 'John Lennon',
    bio: 'English singer, songwriter and peace activist',
    image: '/api/placeholder/300/300',
    followers: 15000000,
    genres: ['Pop', 'Rock', 'Folk Rock']
  }
]

export const mockAlbums: Album[] = [
  {
    id: '1',
    title: 'A Night at the Opera',
    artist: 'Queen',
    year: 1975,
    cover: '/api/placeholder/300/300',
    songs: ['1'],
    genre: 'Rock'
  },
  {
    id: '2',
    title: 'Hotel California',
    artist: 'Eagles',
    year: 1976,
    cover: '/api/placeholder/300/300',
    songs: ['2'],
    genre: 'Rock'
  },
  {
    id: '3',
    title: 'Imagine',
    artist: 'John Lennon',
    year: 1971,
    cover: '/api/placeholder/300/300',
    songs: ['3'],
    genre: 'Pop'
  }
]

export const mockPlaylists: Playlist[] = [
  {
    id: '1',
    name: 'Classic Rock Hits',
    description: 'The best classic rock songs of all time',
    cover: '/api/placeholder/300/300',
    songs: ['1', '2', '4', '10'],
    createdBy: 'user1',
    isPublic: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Pop Classics',
    description: 'Timeless pop music that never gets old',
    cover: '/api/placeholder/300/300',
    songs: ['3', '5', '8'],
    createdBy: 'user1',
    isPublic: true,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-10')
  }
]

// Utility functions
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export const formatDurationLong = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export const searchSongs = (query: string, songs: Song[]): Song[] => {
  const lowercaseQuery = query.toLowerCase()
  return songs.filter(song => 
    song.title.toLowerCase().includes(lowercaseQuery) ||
    song.artist.toLowerCase().includes(lowercaseQuery) ||
    song.album.toLowerCase().includes(lowercaseQuery) ||
    song.genre?.toLowerCase().includes(lowercaseQuery)
  )
}

export const filterSongsByGenre = (songs: Song[], genres: string[]): Song[] => {
  if (genres.length === 0) return songs
  return songs.filter(song => song.genre && genres.includes(song.genre))
}

export const sortSongs = (songs: Song[], field: keyof Song, order: 'asc' | 'desc'): Song[] => {
  return [...songs].sort((a, b) => {
    let aValue: string | number = a[field] as string | number || ''
    let bValue: string | number = b[field] as string | number || ''
    
    if (field === 'duration' || field === 'year') {
      aValue = (aValue as number) || 0
      bValue = (bValue as number) || 0
    } else {
      aValue = (aValue || '').toString().toLowerCase()
      bValue = (bValue || '').toString().toLowerCase()
    }
    
    if (order === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })
}

export const getRandomSongs = (songs: Song[], count: number): Song[] => {
  const shuffled = [...songs].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

export const getLikedSongs = (songs: Song[]): Song[] => {
  return songs.filter(song => song.isLiked)
}

export const getSongsByArtist = (songs: Song[], artistName: string): Song[] => {
  return songs.filter(song => 
    song.artist.toLowerCase() === artistName.toLowerCase()
  )
}

export const getSongsByAlbum = (songs: Song[], albumName: string): Song[] => {
  return songs.filter(song => 
    song.album.toLowerCase() === albumName.toLowerCase()
  )
}
