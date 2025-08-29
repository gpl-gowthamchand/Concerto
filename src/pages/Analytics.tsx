import React, { useState, useEffect } from 'react';
import { Clock, Music, Heart, TrendingUp, Headphones, Star, Activity } from 'lucide-react';
import { useUserStore } from '../stores/userStore';

interface AnalyticsData {
  listeningTime: number;
  totalTracks: number;
  totalPlaylists: number;
  favoriteGenres: Record<string, number>;
  moodAnalysis: Record<string, number>;
  topArtists: Array<{ name: string; plays: number }>;
  topTracks: Array<{ title: string; artist: string; plays: number }>;
  listeningTrends: Array<{ date: string; minutes: number }>;
}

const Analytics: React.FC = () => {
  const { user } = useUserStore();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    // Load mock analytics data
    const mockData: AnalyticsData = {
      listeningTime: 2847,
      totalTracks: 1247,
      totalPlaylists: 23,
      favoriteGenres: {
        'Pop': 35,
        'Rock': 28,
        'Hip Hop': 22,
        'Electronic': 15
      },
      moodAnalysis: {
        'Happy': 40,
        'Chill': 25,
        'Energetic': 20,
        'Sad': 15
      },
      topArtists: [
        { name: 'The Weeknd', plays: 156 },
        { name: 'Drake', plays: 142 },
        { name: 'Taylor Swift', plays: 128 },
        { name: 'Post Malone', plays: 98 },
        { name: 'Ariana Grande', plays: 87 }
      ],
      topTracks: [
        { title: 'Blinding Lights', artist: 'The Weeknd', plays: 89 },
        { title: 'God\'s Plan', artist: 'Drake', plays: 76 },
        { title: 'Shape of You', artist: 'Ed Sheeran', plays: 65 },
        { title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', plays: 58 },
        { title: 'Despacito', artist: 'Luis Fonsi & Daddy Yankee', plays: 52 }
      ],
      listeningTrends: [
        { date: 'Mon', minutes: 120 },
        { date: 'Tue', minutes: 95 },
        { date: 'Wed', minutes: 140 },
        { date: 'Thu', minutes: 110 },
        { date: 'Fri', minutes: 180 },
        { date: 'Sat', minutes: 200 },
        { date: 'Sun', minutes: 160 }
      ]
    };
    
    setAnalyticsData(mockData);
  }, []);

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const renderBarChart = (data: Record<string, number>, title: string) => {
    const maxValue = Math.max(...Object.values(data));
    
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">{key}</span>
              <span className="text-gray-400">{value}%</span>
            </div>
            <div className="w-full bg-dark-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTrendChart = (data: Array<{ date: string; minutes: number }>) => {
    const maxValue = Math.max(...data.map(d => d.minutes));
    
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Listening Trends</h3>
        <div className="flex items-end justify-between h-32 space-x-2">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div 
                className="w-8 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t transition-all duration-300"
                style={{ height: `${(item.minutes / maxValue) * 100}%` }}
              />
              <span className="text-xs text-gray-400">{item.date}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Music Analytics</h1>
          <p className="text-gray-400">Your listening insights and statistics</p>
        </div>
        
        <div className="flex space-x-2 bg-dark-800 rounded-lg p-1">
          {[
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
            { value: 'year', label: 'Year' }
          ].map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value as 'week' | 'month' | 'year')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                timeRange === range.value
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-dark-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-500 bg-opacity-20 rounded-lg">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Listening</p>
              <p className="text-2xl font-bold text-white">{formatTime(analyticsData.listeningTime)}</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-500 bg-opacity-20 rounded-lg">
              <Music className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Tracks</p>
              <p className="text-2xl font-bold text-white">{analyticsData.totalTracks.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-500 bg-opacity-20 rounded-lg">
              <Heart className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Playlists</p>
              <p className="text-2xl font-bold text-white">{analyticsData.totalPlaylists}</p>
            </div>
          </div>
        </div>

        <div className="bg-dark-800 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-orange-500 bg-opacity-20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">This Month</p>
              <p className="text-2xl font-bold text-white">+12%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Genre Distribution */}
        <div className="bg-dark-800 rounded-lg p-6">
          {renderBarChart(analyticsData.favoriteGenres, 'Favorite Genres')}
        </div>

        {/* Mood Analysis */}
        <div className="bg-dark-800 rounded-lg p-6">
          {renderBarChart(analyticsData.moodAnalysis, 'Mood Analysis')}
        </div>

        {/* Listening Trends */}
        <div className="bg-dark-800 rounded-lg p-6">
          {renderTrendChart(analyticsData.listeningTrends)}
        </div>

        {/* Top Artists */}
        <div className="bg-dark-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Artists</h3>
          <div className="space-y-3">
            {analyticsData.topArtists.map((artist, index) => (
              <div key={artist.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-dark-700 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-400">{index + 1}</span>
                  </div>
                  <span className="text-gray-300">{artist.name}</span>
                </div>
                <span className="text-gray-400">{artist.plays} plays</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Tracks */}
      <div className="bg-dark-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Top Tracks</h3>
        <div className="space-y-3">
          {analyticsData.topTracks.map((track, index) => (
            <div key={`${track.title}-${track.artist}`} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-dark-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-400">{index + 1}</span>
                </div>
                <div>
                  <p className="text-white font-medium">{track.title}</p>
                  <p className="text-gray-400 text-sm">{track.artist}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Headphones className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">{track.plays}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
