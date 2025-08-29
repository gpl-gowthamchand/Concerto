import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Mic, Filter, Sparkles, History, TrendingUp } from 'lucide-react';
import { useAudioStore } from '../stores/audioStore';
import VoiceSearch from '../components/Search/VoiceSearch';
import { Track, SearchFilters, SearchResult } from '../types';

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
    source: []
  });
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);
  const [showVoiceSearch, setShowVoiceSearch] = useState(false);

  const { addToQueue } = useAudioStore();

  useEffect(() => {
    // Load search history from localStorage
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }

    // Load trending searches
    setTrendingSearches([
      'Chill Vibes', 'Workout Mix', 'Jazz Classics', 'Rock Anthems',
      'Electronic Beats', 'Acoustic Sessions', 'Hip Hop Hits', 'Classical Masterpieces'
    ]);
  }, []);

  const handleSearch = async (searchQuery?: string) => {
    const searchTerm = searchQuery || query;
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    
    // Add to search history
    const newHistory = [searchTerm, ...searchHistory.filter(h => h !== searchTerm)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));

    try {
      // Simulate API call - replace with actual free API endpoints
      const mockResults: SearchResult = {
        tracks: [
          {
            id: '1',
            title: 'Sample Track 1',
            artist: 'Sample Artist',
            album: 'Sample Album',
            duration: 180,
            url: 'https://example.com/track1.mp3',
            artwork: 'https://via.placeholder.com/300x300',
            genre: 'Pop',
            mood: 'Happy',
            bpm: 120,
            key: 'C',
            year: 2023,
            source: 'youtube',
            playCount: 1000,
            addedAt: new Date()
          },
          // Add more mock tracks...
        ],
        artists: [],
        albums: [],
        playlists: [],
        totalResults: 1
      };

      setResults(mockResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleVoiceSearch = (transcript: string) => {
    setQuery(transcript);
    handleSearch(transcript);
    setShowVoiceSearch(false);
  };

  const applyFilters = () => {
    handleSearch();
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
      source: []
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Discover Music</h1>
        <p className="text-gray-400">Find your next favorite song with AI-powered search</p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search for songs, artists, albums, or lyrics..."
            className="w-full pl-12 pr-20 py-4 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
            <button
              onClick={() => setShowVoiceSearch(true)}
              className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              title="Voice Search"
            >
              <Mic className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors ${
                showFilters ? 'bg-blue-600 text-white' : 'bg-dark-700 text-gray-400 hover:bg-dark-600'
              }`}
              title="Advanced Filters"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="bg-dark-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Advanced Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
              <select
                value={filters.genre}
                onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="">All Genres</option>
                <option value="pop">Pop</option>
                <option value="rock">Rock</option>
                <option value="jazz">Jazz</option>
                <option value="classical">Classical</option>
                <option value="electronic">Electronic</option>
                <option value="hip-hop">Hip Hop</option>
                <option value="country">Country</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mood</label>
              <select
                value={filters.mood}
                onChange={(e) => setFilters({ ...filters, mood: e.target.value })}
                className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="">All Moods</option>
                <option value="happy">Happy</option>
                <option value="sad">Sad</option>
                <option value="energetic">Energetic</option>
                <option value="calm">Calm</option>
                <option value="romantic">Romantic</option>
                <option value="melancholic">Melancholic</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Year Range</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={filters.year?.min}
                  onChange={(e) => setFilters({ ...filters, year: { ...filters.year!, min: parseInt(e.target.value) } })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={filters.year?.max}
                  onChange={(e) => setFilters({ ...filters, year: { ...filters.year!, max: parseInt(e.target.value) } })}
                  className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>

          <button
            onClick={applyFilters}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Apply Filters
          </button>
        </div>
      )}

      {/* Search History & Trending */}
      {!results && (
        <div className="space-y-6">
          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="bg-dark-800 rounded-xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <History className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-white">Recent Searches</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(term)}
                    className="px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-full text-gray-300 hover:text-white transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          <div className="bg-dark-800 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-5 h-5 text-gray-400" />
              <h3 className="text-lg font-semibold text-white">Trending Now</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((term, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(term)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full text-white transition-all transform hover:scale-105"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-300" />
              <h3 className="text-lg font-semibold text-white">AI-Powered Suggestions</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Based on your listening history, we think you might like:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-dark-800 bg-opacity-50 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">Chill Evening Vibes</h4>
                <p className="text-sm text-gray-400">Perfect for relaxing after a long day</p>
              </div>
              <div className="bg-dark-800 bg-opacity-50 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">Workout Energy Boost</h4>
                <p className="text-sm text-gray-400">High-energy tracks to keep you motivated</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Results */}
      {results && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              Search Results ({results.totalResults})
            </h2>
            <button
              onClick={() => setResults(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Clear Results
            </button>
          </div>

          {/* Tracks */}
          {results.tracks.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Tracks</h3>
              {results.tracks.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center space-x-4 p-4 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors"
                >
                  <img
                    src={track.artwork || 'https://via.placeholder.com/60x60'}
                    alt={track.title}
                    className="w-15 h-15 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{track.title}</h4>
                    <p className="text-gray-400">{track.artist}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{track.genre}</span>
                      <span>{track.mood}</span>
                      <span>{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => addToQueue(track)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Add to Queue
                  </button>
                </div>
              ))}
            </div>
          )}

          {results.tracks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No results found for "{query}"</p>
              <p className="text-gray-500">Try adjusting your search terms or filters</p>
            </div>
          )}
        </div>
      )}

      {/* Voice Search Modal */}
      {showVoiceSearch && (
        <VoiceSearch
          onTranscript={handleVoiceSearch}
          onClose={() => setShowVoiceSearch(false)}
        />
      )}
    </div>
  );
};

export default Search;
