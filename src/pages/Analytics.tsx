import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Music, 
  Heart, 
  Users, 
  Calendar,
  Play,
  Headphones,
  Star,
  Activity,
  Target
} from 'lucide-react';
import { useUserStore } from '../stores/userStore';
import { useAudioStore } from '../stores/audioStore';

interface AnalyticsData {
  totalListeningTime: number;
  totalTracks: number;
  totalPlaylists: number;
  favoriteGenres: { genre: string; count: number; percentage: number }[];
  topArtists: { artist: string; plays: number; percentage: number }[];
  listeningStreak: number;
  peakListeningHours: { hour: number; count: number }[];
  monthlyStats: { month: string; time: number; tracks: number }[];
  moodAnalysis: { mood: string; count: number; percentage: number }[];
  recentActivity: { action: string; track: string; time: string }[];
}

const Analytics: React.FC = () => {
  const { user } = useUserStore();
  const { history } = useAudioStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'genres' | 'artists' | 'trends' | 'activity'>('overview');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year' | 'all'>('month');

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalListeningTime: 0,
    totalTracks: 0,
    totalPlaylists: 0,
    favoriteGenres: [],
    topArtists: [],
    listeningStreak: 0,
    peakListeningHours: [],
    monthlyStats: [],
    moodAnalysis: [],
    recentActivity: []
  });

  useEffect(() => {
    // Generate mock analytics data
    const mockData: AnalyticsData = {
      totalListeningTime: 2847, // minutes
      totalTracks: 156,
      totalPlaylists: 12,
      favoriteGenres: [
        { genre: 'Rock', count: 45, percentage: 28.8 },
        { genre: 'Pop', count: 38, percentage: 24.4 },
        { genre: 'Electronic', count: 25, percentage: 16.0 },
        { genre: 'Jazz', count: 18, percentage: 11.5 },
        { genre: 'Classical', count: 15, percentage: 9.6 },
        { genre: 'Hip Hop', count: 15, percentage: 9.6 }
      ],
      topArtists: [
        { artist: 'Queen', plays: 23, percentage: 14.7 },
        { artist: 'The Beatles', plays: 19, percentage: 12.2 },
        { artist: 'Pink Floyd', plays: 16, percentage: 10.3 },
        { artist: 'Led Zeppelin', plays: 14, percentage: 9.0 },
        { artist: 'David Bowie', plays: 12, percentage: 7.7 }
      ],
      listeningStreak: 7,
      peakListeningHours: [
        { hour: 9, count: 12 },
        { hour: 10, count: 18 },
        { hour: 11, count: 15 },
        { hour: 12, count: 8 },
        { hour: 13, count: 6 },
        { hour: 14, count: 10 },
        { hour: 15, count: 14 },
        { hour: 16, count: 16 },
        { hour: 17, count: 20 },
        { hour: 18, count: 22 },
        { hour: 19, count: 19 },
        { hour: 20, count: 15 }
      ],
      monthlyStats: [
        { month: 'Jan', time: 420, tracks: 45 },
        { month: 'Feb', time: 380, tracks: 42 },
        { month: 'Mar', time: 450, tracks: 48 },
        { month: 'Apr', time: 520, tracks: 52 },
        { month: 'May', time: 480, tracks: 49 },
        { month: 'Jun', time: 600, tracks: 58 }
      ],
      moodAnalysis: [
        { mood: 'Happy', count: 52, percentage: 33.3 },
        { mood: 'Chill', count: 38, percentage: 24.4 },
        { mood: 'Energetic', count: 31, percentage: 19.9 },
        { mood: 'Melancholic', count: 20, percentage: 12.8 },
        { mood: 'Focused', count: 15, percentage: 9.6 }
      ],
      recentActivity: [
        { action: 'Played', track: 'Bohemian Rhapsody - Queen', time: '2 minutes ago' },
        { action: 'Added to playlist', track: 'Hotel California - Eagles', time: '15 minutes ago' },
        { action: 'Liked', track: 'Imagine - John Lennon', time: '1 hour ago' },
        { action: 'Shared', track: 'Stairway to Heaven - Led Zeppelin', time: '2 hours ago' },
        { action: 'Played', track: 'Hey Jude - The Beatles', time: '3 hours ago' }
      ]
    };

    setAnalyticsData(mockData);
  }, []);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-primary-500/20 rounded-lg">
              <Headphones className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-dark-400">Total Listening Time</p>
              <p className="text-2xl font-bold text-white">{formatTime(analyticsData.totalListeningTime)}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-secondary-500/20 rounded-lg">
              <Music className="w-6 h-6 text-secondary-400" />
            </div>
            <div>
              <p className="text-sm text-dark-400">Tracks Played</p>
              <p className="text-2xl font-bold text-white">{analyticsData.totalTracks}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Heart className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-dark-400">Playlists Created</p>
              <p className="text-2xl font-bold text-white">{analyticsData.totalPlaylists}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Target className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-dark-400">Listening Streak</p>
              <p className="text-2xl font-bold text-white">{analyticsData.listeningStreak} days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Peak Listening Hours */}
      <div className="card">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>Peak Listening Hours</span>
        </h3>
        <div className="flex items-end justify-between h-32 space-x-1">
          {analyticsData.peakListeningHours.map((hour, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className="w-full bg-gradient-to-t from-primary-400 to-primary-600 rounded-t"
                style={{ 
                  height: `${(hour.count / 22) * 100}%`,
                  minHeight: '4px'
                }}
              />
              <div className="text-xs text-dark-400 mt-2">
                {hour.hour}:00
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="card">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5" />
          <span>Monthly Trends</span>
        </h3>
        <div className="flex items-end justify-between h-32 space-x-1">
          {analyticsData.monthlyStats.map((month, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className="w-full bg-gradient-to-t from-secondary-400 to-secondary-600 rounded-t"
                style={{ 
                  height: `${(month.time / 600) * 100}%`,
                  minHeight: '4px'
                }}
              />
              <div className="text-xs text-dark-400 mt-2">
                {month.month}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGenres = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-xl font-semibold text-white mb-4">Favorite Genres</h3>
        <div className="space-y-4">
          {analyticsData.favoriteGenres.map((genre, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: `hsl(${index * 60}, 70%, 60%)` }} />
                <span className="text-white font-medium">{genre.genre}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-dark-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full"
                    style={{ 
                      width: `${genre.percentage}%`,
                      backgroundColor: `hsl(${index * 60}, 70%, 60%)`
                    }}
                  />
                </div>
                <span className="text-sm text-dark-400 w-12 text-right">{genre.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-xl font-semibold text-white mb-4">Mood Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analyticsData.moodAnalysis.map((mood, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
              <span className="text-white font-medium">{mood.mood}</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-dark-600 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-primary-400"
                    style={{ width: `${mood.percentage}%` }}
                  />
                </div>
                <span className="text-sm text-dark-400">{mood.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderArtists = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-xl font-semibold text-white mb-4">Top Artists</h3>
        <div className="space-y-4">
          {analyticsData.topArtists.map((artist, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 bg-dark-700 rounded-lg">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{artist.artist}</p>
                <p className="text-sm text-dark-400">{artist.plays} plays</p>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">{artist.percentage}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTrends = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-xl font-semibold text-white mb-4">Listening Patterns</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Activity className="w-5 h-5 text-primary-400" />
              <span className="text-white">Most Active Day</span>
            </div>
            <span className="text-white font-medium">Wednesday</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-secondary-400" />
              <span className="text-white">Average Session</span>
            </div>
            <span className="text-white font-medium">47 minutes</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Play className="w-5 h-5 text-green-400" />
              <span className="text-white">Tracks per Session</span>
            </div>
            <span className="text-white font-medium">8.3 tracks</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActivity = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {analyticsData.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-dark-700 rounded-lg">
              <div className="w-2 h-2 bg-primary-400 rounded-full" />
              <div className="flex-1">
                <p className="text-white">
                  <span className="text-dark-400">{activity.action}</span> {activity.track}
                </p>
                <p className="text-sm text-dark-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Analytics - Concerto</title>
        <meta name="description" content="Your music listening analytics and insights" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Music Analytics</h1>
            <p className="text-dark-400 mt-2">Discover your listening patterns and insights</p>
          </div>
          <div className="flex space-x-2">
            {['week', 'month', 'year', 'all'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as any)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-primary-600 text-white'
                    : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-dark-800 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'genres', label: 'Genres', icon: Music },
            { id: 'artists', label: 'Artists', icon: Users },
            { id: 'trends', label: 'Trends', icon: TrendingUp },
            { id: 'activity', label: 'Activity', icon: Activity }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-600 text-white'
                  : 'text-dark-300 hover:text-dark-100 hover:bg-dark-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'genres' && renderGenres()}
        {activeTab === 'artists' && renderArtists()}
        {activeTab === 'trends' && renderTrends()}
        {activeTab === 'activity' && renderActivity()}
      </div>
    </>
  );
};

export default Analytics;
