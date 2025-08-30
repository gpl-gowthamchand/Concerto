import React, { useState, useEffect, useCallback } from 'react';
import { Search as SearchIcon, Mic, Filter, History, TrendingUp, Play, Heart, Plus, MoreVertical } from 'lucide-react';
import { useAudioStore } from '../stores/audioStore';
import { useUserStore } from '../stores/userStore';
import { musicApiService, MusicSearchResult, SearchFilters } from '../services/musicApi';
import VoiceSearch from '../components/Search/VoiceSearch';
import toast from 'react-hot-toast';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MusicSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({ query: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'tracks' | 'artists' | 'albums' | 'playlists'>('tracks');

  const { user } = useUserStore();
  const { play, addToQueue } = useAudioStore();

  // Load search history and trending searches
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }

    // Set trending searches
    setTrendingSearches([
      'The Weeknd',
      'Drake',
      'Billie Eilish',
      'Ed Sheeran',
      'Queen',
      'Led Zeppelin',
      'Bob Marley',
      'Radiohead',
      'Jazz',
      'Classical'
    ]);
  }, []);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.trim().length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const searchResults = await musicApiService.searchMusic(searchQuery, {
          ...filters,
          query: searchQuery,
          source: selectedSource === 'all' ? undefined : [selectedSource]
        });

        setResults(searchResults);
        
        // Add to search history
        if (searchQuery.trim() && !searchHistory.includes(searchQuery.trim())) {
          const newHistory = [searchQuery.trim(), ...searchHistory.slice(0, 9)];
          setSearchHistory(newHistory);
          localStorage.setItem('searchHistory', JSON.stringify(newHistory));
        }

        toast.success(`Found ${searchResults.length} results for "${searchQuery}"`);
      } catch (error) {
        console.error('Search error:', error);
        toast.error('Search failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, 500),
    [filters, selectedSource]
  );

  // Handle search input
  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  // Handle voice search
  const handleVoiceSearch = (transcript: string) => {
    setQuery(transcript);
  };

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    debouncedSearch(query);
  };

  // Handle track actions
  const handlePlayTrack = (track: MusicSearchResult) => {
    play(track);
    toast.success(`Now playing: ${track.title}`);
  };

  const handleAddToQueue = (track: MusicSearchResult) => {
    addToQueue(track);
    toast.success(`Added ${track.title} to queue`);
  };

  const handleLikeTrack = (track: MusicSearchResult) => {
    // Add to favorites logic here
    toast.success(`Added ${track.title} to favorites`);
  };

  // Handle search history click
  const handleHistoryClick = (historyItem: string) => {
    setQuery(historyItem);
  };

  // Handle trending search click
  const handleTrendingClick = (trendingItem: string) => {
    setQuery(trendingItem);
  };

  // Clear search results
  const clearResults = () => {
    setResults([]);
    setQuery('');
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({ query: '' });
    setSelectedSource('all');
  };

  // Format duration
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Get source icon
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
      case 'fma':
        return '🎼';
      case 'ia':
        return '📚';
      default:
        return '🎵';
    }
  };

  // Get source name
  const getSourceName = (source: string) => {
    const sourceInfo = musicApiService.getSourceInfo(source);
    return sourceInfo.name;
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
      <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dark-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for songs, artists, albums, or playlists..."
            className="w-full pl-12 pr-20 py-4 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
            <VoiceSearch onTranscript={handleVoiceSearch} />
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-dark-400 hover:text-dark-300 rounded-lg transition-colors"
            >
              <Filter className="w-5 h-5" />
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </form>

      {/* Filters */}
      {showFilters && (
        <div className="max-w-2xl mx-auto card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Music Source</label>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Sources</option>
                <option value="youtube">YouTube Music</option>
                <option value="jiosaavn">JioSaavn</option>
                <option value="deezer">Deezer</option>
                <option value="soundcloud">SoundCloud</option>
                <option value="fma">Free Music Archive</option>
                <option value="ia">Internet Archive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Genre</label>
              <input
                type="text"
                placeholder="e.g., Rock, Pop, Jazz"
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Quality</label>
              <select className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="all">All Qualities</option>
                <option value="high">High (320kbps)</option>
                <option value="medium">Medium (192kbps)</option>
                <option value="low">Low (128kbps)</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-dark-400 hover:text-dark-300 transition-colors"
            >
              Clear Filters
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
              onClick={clearResults}
              className="text-primary-400 hover:text-primary-300 text-sm transition-colors"
            >
              Clear Results
            </button>
          </div>

          {/* Results Tabs */}
          <div className="flex space-x-4 border-b border-dark-700">
            {(['tracks', 'artists', 'albums', 'playlists'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-primary-400 border-b-2 border-primary-400'
                    : 'text-dark-400 hover:text-dark-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tracks Results */}
          {activeTab === 'tracks' && (
            <div className="space-y-3">
              {results.map((track) => (
                <div
                  key={`${track.id}-${track.source}`}
                  className="flex items-center space-x-4 p-4 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors group"
                >
                  <img
                    src={track.artwork}
                    alt={track.title}
                    className="w-12 h-12 rounded-lg object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/48x48/374151/FFFFFF?text=🎵';
                    }}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">{track.title}</h3>
                    <p className="text-dark-400 text-sm truncate">
                      {track.artist} • {track.album} • {track.genre}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-dark-500">{formatDuration(track.duration)}</span>
                      <span className="text-xs text-dark-500">•</span>
                      <span className="text-xs text-dark-500">{getSourceName(track.source)}</span>
                      <span className="text-xs text-dark-500">•</span>
                      <span className="text-xs text-dark-500">{track.quality}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handlePlayTrack(track)}
                      className="p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors"
                      title="Play"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleAddToQueue(track)}
                      className="p-2 bg-dark-600 hover:bg-dark-500 text-white rounded-full transition-colors"
                      title="Add to Queue"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleLikeTrack(track)}
                      className="p-2 bg-dark-600 hover:bg-dark-500 text-white rounded-full transition-colors"
                      title="Like"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-dark-600 hover:bg-dark-500 text-white rounded-full transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Other tabs would show different content */}
          {activeTab !== 'tracks' && (
            <div className="text-center py-8">
              <p className="text-dark-400">Coming soon: {activeTab} search results</p>
            </div>
          )}
        </div>
      )}

      {/* Search History */}
      {!results.length && searchHistory.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <History className="w-5 h-5" />
            <span>Recent Searches</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((item, index) => (
              <button
                key={index}
                onClick={() => handleHistoryClick(item)}
                className="px-3 py-1 bg-dark-700 hover:bg-dark-600 text-white rounded-full text-sm transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Trending Searches */}
      {!results.length && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Trending Searches</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {trendingSearches.map((item, index) => (
              <button
                key={index}
                onClick={() => handleTrendingClick(item)}
                className="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded-full text-sm transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
          <p className="text-dark-400 mt-2">Searching...</p>
        </div>
      )}
    </div>
  );
};

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default Search;
