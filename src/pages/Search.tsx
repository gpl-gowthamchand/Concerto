import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Mic, Filter, Sparkles, History, TrendingUp, Play, Heart, Plus, MoreVertical } from 'lucide-react';
import { useAudioStore } from '../stores/audioStore';
import { useUserStore } from '../stores/userStore';
import VoiceSearch from '../components/Search/VoiceSearch';
import { musicApiService, MusicSearchResult, SearchFilters } from '../services/musicApi';
import toast from 'react-hot-toast';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    genre: '',
    mood: '',
    duration: { min: 0, max: 600 },
    year: { min: 1900, max: 2024 },
    bpm: { min: 0, max: 200 },
    key: '',
    source: ['youtube', 'jiosaavn', 'deezer']
  });
  const [results, setResults] = useState<MusicSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string>('all');

  const { play, addToQueue } = useAudioStore();
  const { user } = useUserStore();

  useEffect(() => {
    // Load search history from localStorage
    const history = localStorage.getItem('concerto-search-history');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }

    // Load trending searches
    setTrendingSearches([
      'Shape of You', 'Blinding Lights', 'Dance Monkey', 'Bad Guy',
      'Old Town Road', 'Sunflower', 'Havana', 'Uptown Funk'
    ]);
  }, []);

  const handleSearch = async (searchQuery?: string) => {
    const searchTerm = searchQuery || query;
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    
    // Add to search history
    const newHistory = [searchTerm, ...searchHistory.filter(h => h !== searchTerm)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('concerto-search-history', JSON.stringify(newHistory));

    try {
      // Use real music API
      const searchFilters = {
        ...filters,
        query: searchTerm,
        source: selectedSource === 'all' ? ['youtube', 'jiosaavn', 'deezer'] : [selectedSource]
      };

      const searchResults = await musicApiService.searchMusic(searchTerm, searchFilters);
      setResults(searchResults);
      
      if (searchResults.length === 0) {
        toast.error('No results found. Try a different search term.');
      } else {
        toast.success(`Found ${searchResults.length} tracks`);
      }
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleVoiceSearch = (transcript: string) => {
    setQuery(transcript);
    handleSearch(transcript);
    setShowVoiceSearch(false);
  };

  const handlePlayTrack = async (track: MusicSearchResult) => {
    try {
      // Get full track details
      const trackDetails = await musicApiService.getTrackDetails(track.id, track.source);
      if (trackDetails) {
        play(trackDetails);
        toast.success(`Now playing: ${trackDetails.title}`);
      } else {
        play(track);
        toast.success(`Now playing: ${track.title}`);
      }
    } catch (error) {
      console.error('Playback error:', error);
      toast.error('Failed to play track');
    }
  };

  const handleAddToQueue = (track: MusicSearchResult) => {
    addToQueue(track);
    toast.success(`Added ${track.title} to queue`);
  };

  const handleLikeTrack = (track: MusicSearchResult) => {
    // Add to favorites logic here
    toast.success(`Added ${track.title} to favorites`);
  };

  const applyFilters = () => {
    handleSearch();
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      genre: '',
      mood: '',
      duration: { min: 0, max: 600 },
      year: { min: 1900, max: 2024 },
      bpm: { min: 0, max: 200 },
      key: '',
      source: ['youtube', 'jiosaavn', 'deezer']
    });
    setSelectedSource('all');
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'youtube':
        return '🎵';
      case 'jiosaavn':
        return '🎶';
      case 'deezer':
        return '🎧';
      case 'soundcloud':
        return '☁️';
      default:
        return '🎵';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Discover Music</h1>
        <p className="text-dark-400 text-lg">
          Find your next favorite song with AI-powered search
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search for songs, artists, albums, or playlists..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-12 pr-24 py-4 bg-dark-700 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            <button
              onClick={() => setShowVoiceSearch(!showVoiceSearch)}
              className="p-2 text-dark-400 hover:text-primary-400 transition-colors"
              title="Voice Search"
            >
              <Mic className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-dark-400 hover:text-primary-400 transition-colors"
              title="Advanced Filters"
            >
              <Filter className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleSearch()}
              disabled={isSearching}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isSearching ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <SearchIcon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Voice Search Modal */}
        {showVoiceSearch && (
          <VoiceSearch 
            onClose={() => setShowVoiceSearch(false)} 
            onTranscript={handleVoiceSearch}
          />
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="max-w-4xl mx-auto card">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Source Selection */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Music Source</label>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="all">All Sources</option>
                <option value="youtube">YouTube Music</option>
                <option value="jiosaavn">JioSaavn</option>
                <option value="deezer">Deezer</option>
                <option value="soundcloud">SoundCloud</option>
              </select>
            </div>

            {/* Genre Filter */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Genre</label>
              <input
                type="text"
                placeholder="e.g., Rock, Pop, Jazz"
                value={filters.genre}
                onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
              />
            </div>

            {/* Duration Filter */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Duration (minutes)</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.duration?.min || ''}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    duration: { 
                      ...filters.duration!, 
                      min: parseInt(e.target.value) || 0 
                    } 
                  })}
                  className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.duration?.max || ''}
                  onChange={(e) => setFilters({ 
                    ...filters, 
                    duration: { 
                      ...filters.duration!, 
                      max: parseInt(e.target.value) || 600 
                    } 
                  })}
                  className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-dark-700 text-dark-300 hover:bg-dark-600 rounded-lg transition-colors"
            >
              Clear
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              Search Results ({results.length})
            </h2>
            <button
              onClick={() => setResults([])}
              className="text-primary-400 hover:text-primary-300 text-sm"
            >
              Clear Results
            </button>
          </div>

          {/* Tracks */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">Tracks</h3>
            {results.map((track) => (
              <div key={`${track.id}-${track.source}`} className="card group hover:bg-dark-700 transition-colors">
                <div className="flex items-center space-x-4">
                  <img
                    src={track.artwork}
                    alt={track.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{track.title}</p>
                    <p className="text-dark-400 text-sm truncate">
                      {track.artist} • {track.album} • {track.genre}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-dark-500">{formatDuration(track.duration)}</span>
                      <span className="text-xs text-dark-500">{getSourceIcon(track.source)} {track.source}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handlePlayTrack(track)}
                      className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                      title="Play"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleAddToQueue(track)}
                      className="p-2 bg-dark-600 hover:bg-dark-500 text-white rounded-lg transition-colors"
                      title="Add to Queue"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleLikeTrack(track)}
                      className="p-2 bg-dark-600 hover:bg-dark-500 text-white rounded-lg transition-colors"
                      title="Like"
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                    <button className="p-2 bg-dark-600 hover:bg-dark-500 text-white rounded-lg transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search History */}
      {!results.length && searchHistory.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
            <History className="w-5 h-5" />
            <span>Recent Searches</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((term, index) => (
              <button
                key={index}
                onClick={() => {
                  setQuery(term);
                  handleSearch(term);
                }}
                className="px-3 py-1 bg-dark-700 text-dark-300 hover:bg-dark-600 rounded-lg transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Trending Searches */}
      {!results.length && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Trending Searches</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {trendingSearches.map((term, index) => (
              <button
                key={index}
                onClick={() => {
                  setQuery(term);
                  handleSearch(term);
                }}
                className="px-3 py-1 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
