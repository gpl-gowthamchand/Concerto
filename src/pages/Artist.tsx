import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Shuffle, Heart, Share2, MoreVertical, Users } from 'lucide-react';
import { useAudioStore } from '../stores/audioStore';
import { Track, Artist as ArtistType } from '../types';

interface Album {
  id: string;
  name: string;
  artwork?: string;
  year: number;
  trackCount: number;
}

const ArtistPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { playTrack, addToQueue } = useAudioStore();
  const [artist, setArtist] = useState<ArtistType | null>(null);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (id) {
      loadArtist(id);
    }
  }, [id]);

  const loadArtist = (artistId: string) => {
    // Mock artist data - replace with actual API call
    const mockArtist: ArtistType = {
      id: artistId,
      name: 'The Beatles',
      bio: 'The Beatles were an English rock band formed in Liverpool in 1960. With a line-up comprising John Lennon, Paul McCartney, George Harrison and Ringo Starr, they are regarded as the most influential band of all time.',
      avatar: 'https://via.placeholder.com/300x300/EF4444/FFFFFF?text=Beatles',
      genres: ['Rock', 'Pop', 'Psychedelic Rock'],
      monthlyListeners: 45000000,
      topTracks: ['track1', 'track2', 'track3'],
      albums: ['album1', 'album2', 'album3'],
      similarArtists: ['Rolling Stones', 'Pink Floyd', 'Led Zeppelin']
    };

    const mockTopTracks: Track[] = [
      {
        id: '1',
        title: 'Hey Jude',
        artist: 'The Beatles',
        album: 'The Beatles 1967-1970',
        duration: 431,
        url: 'https://example.com/track1.mp3',
        artwork: 'https://via.placeholder.com/60x60',
        genre: 'Rock',
        mood: 'Happy',
        source: 'youtube',
        playCount: 1500000,
        addedAt: new Date()
      },
      {
        id: '2',
        title: 'Let It Be',
        artist: 'The Beatles',
        album: 'Let It Be',
        duration: 243,
        url: 'https://example.com/track2.mp3',
        artwork: 'https://via.placeholder.com/60x60',
        genre: 'Rock',
        mood: 'Peaceful',
        source: 'youtube',
        playCount: 1200000,
        addedAt: new Date()
      }
    ];

    const mockAlbums: Album[] = [
      {
        id: 'album1',
        title: 'Abbey Road',
        artist: 'The Beatles',
        artwork: 'https://via.placeholder.com/200x200/10B981/FFFFFF?text=Abbey',
        tracks: [],
        genre: 'Rock',
        year: 1969,
        totalDuration: 2847,
        trackCount: 17
      },
      {
        id: 'album2',
        title: 'Sgt. Pepper\'s Lonely Hearts Club Band',
        artist: 'The Beatles',
        artwork: 'https://via.placeholder.com/200x200/8B5CF6/FFFFFF?text=Pepper',
        tracks: [],
        genre: 'Rock',
        year: 1967,
        totalDuration: 2392,
        trackCount: 13
      }
    ];

    setArtist(mockArtist);
    setTopTracks(mockTopTracks);
    setAlbums(mockAlbums);
  };

  const playArtistTopTracks = () => {
    if (topTracks.length > 0) {
      // setQueue(topTracks, 'artist'); // This line was removed as per the new_code
      setIsPlaying(true);
    }
  };



  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (!artist) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-400">Loading artist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Artist Header */}
      <div className="bg-gradient-to-br from-red-900 to-pink-900 rounded-xl p-8">
        <div className="flex items-start space-x-6">
          <img
            src={artist.avatar || 'https://via.placeholder.com/200x200'}
            alt={artist.name}
            className="w-48 h-48 rounded-xl object-cover shadow-2xl"
          />
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{artist.name}</h1>
              <p className="text-gray-300 text-lg">{artist.bio}</p>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>{formatNumber(artist.monthlyListeners)} monthly listeners</span>
              </div>
                              <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-white bg-opacity-20 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">A</span>
                  </div>
                  <span>{artist.albums.length} albums</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {artist.genres.map((genre) => (
                <span key={genre} className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-white text-sm">
                  {genre}
                </span>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={playArtistTopTracks}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition-colors flex items-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Play Top Tracks</span>
              </button>
              
              <button className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full transition-colors">
                <Shuffle className="w-5 h-5" />
              </button>
              
              <button className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              
              <button className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              
              <button className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Top Tracks */}
      <div className="bg-dark-800 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Popular Tracks</h2>
        <div className="space-y-2">
          {topTracks.map((track, index) => (
            <div
              key={track.id}
              className="flex items-center space-x-4 p-4 rounded-lg hover:bg-dark-700 transition-colors"
            >
              <div className="flex items-center space-x-4 flex-1">
                <span className="text-gray-400 text-sm w-8 text-center">{index + 1}</span>
                
                <img
                  src={track.artwork || 'https://via.placeholder.com/50x50'}
                  alt={track.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                
                <div className="flex-1">
                  <h4 className="font-medium text-white">{track.title}</h4>
                  <p className="text-gray-400 text-sm">{track.album}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-gray-400 text-sm">{formatDuration(track.duration)}</span>
                <span className="text-gray-400 text-sm">{formatNumber(track.playCount)} plays</span>
                
                <button
                  onClick={() => playTrack(track)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Play className="w-4 h-4" />
                </button>
                
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Albums */}
      <div className="bg-dark-800 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Albums</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {albums.map((album) => (
            <div
              key={album.id}
              className="bg-dark-700 rounded-lg overflow-hidden hover:bg-dark-600 transition-colors cursor-pointer group"
            >
              <div className="relative">
                <img
                  src={album.artwork || 'https://via.placeholder.com/300x300'}
                  alt={album.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-medium text-white mb-1 truncate">{album.title}</h4>
                <p className="text-gray-400 text-sm mb-2">{album.year}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{album.trackCount} tracks</span>
                  <span>{formatDuration(album.totalDuration)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Similar Artists */}
      <div className="bg-dark-800 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Similar Artists</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {artist.similarArtists.map((similarArtist) => (
            <div
              key={similarArtist}
              className="bg-dark-700 rounded-lg p-4 hover:bg-dark-600 transition-colors cursor-pointer"
            >
              <div className="w-16 h-16 bg-gray-600 rounded-full mx-auto mb-3"></div>
              <h4 className="font-medium text-white text-center">{similarArtist}</h4>
            </div>
          ))}
        </div>
      </div>

      {/* Artist Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-dark-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">About {artist.name}</h3>
          <p className="text-gray-300 leading-relaxed">{artist.bio}</p>
        </div>

        <div className="bg-dark-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Quick Stats</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Monthly Listeners</span>
              <span className="text-white">{formatNumber(artist.monthlyListeners)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Albums</span>
              <span className="text-white">{artist.albums.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Top Tracks</span>
              <span className="text-white">{artist.topTracks.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Genres</span>
              <span className="text-white">{artist.genres.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistPage;
