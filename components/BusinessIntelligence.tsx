'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Music, 
  Headphones, 
  Mic, 
  Radio,
  Disc3,
  ListMusic,
  Search,
  Heart,
  Share2,
  Download,
  Star,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Shuffle,
  Repeat,
  Settings,
  Target,
  Lightbulb,
  Cpu,
  Database,
  Globe,
  Shield,
  Filter,
  Sliders,
  Activity,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  RefreshCw,
  GitBranch,
  Code,
  Package,
  Rocket,
  Terminal,
  Layers,
  GitPullRequest,
  GitCommit,
  GitMerge,
  Calendar,
  Clock,
  DollarSign,
  PieChart,
  LineChart,
  BarChart,
  AreaChart,
  ScatterChart,
  MapPin,
  Globe2,
  Smartphone,
  Monitor,
  Tablet,
  Wifi,
  Battery,
  Signal,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Palette,
  User,
  Bell
} from 'lucide-react'

interface AnalyticsMetric {
  id: string
  name: string
  value: string
  change: number
  trend: 'up' | 'down' | 'stable'
  icon: React.ReactNode
}

interface ChartData {
  label: string
  value: number
  color: string
}

export default function BusinessIntelligence() {
  const [activeTab, setActiveTab] = useState('overview')
  const [timeRange, setTimeRange] = useState('7d')
  const [refreshInterval, setRefreshInterval] = useState(30)

  const analyticsMetrics: AnalyticsMetric[] = [
    {
      id: 'total-users',
      name: 'Total Users',
      value: '2.4M',
      change: 12.5,
      trend: 'up',
      icon: <Users className="w-6 h-6" />
    },
    {
      id: 'active-users',
      name: 'Active Users',
      value: '847K',
      change: 8.3,
      trend: 'up',
      icon: <Activity className="w-6 h-6" />
    },
    {
      id: 'revenue',
      name: 'Monthly Revenue',
      value: '$1.2M',
      change: 15.7,
      trend: 'up',
      icon: <DollarSign className="w-6 h-6" />
    },
    {
      id: 'songs-played',
      name: 'Songs Played',
      value: '15.7M',
      change: 23.1,
      trend: 'up',
      icon: <Music className="w-6 h-6" />
    },
    {
      id: 'playlists',
      name: 'Playlists Created',
      value: '892K',
      change: -2.1,
      trend: 'down',
      icon: <ListMusic className="w-6 h-6" />
    },
    {
      id: 'shares',
      name: 'Social Shares',
      value: '3.2M',
      change: 18.9,
      trend: 'up',
      icon: <Share2 className="w-6 h-6" />
    }
  ]

  const genreData: ChartData[] = [
    { label: 'Pop', value: 35, color: '#3B82F6' },
    { label: 'Rock', value: 25, color: '#EF4444' },
    { label: 'Hip-Hop', value: 20, color: '#10B981' },
    { label: 'Electronic', value: 15, color: '#8B5CF6' },
    { label: 'Jazz', value: 5, color: '#F59E0B' }
  ]

  const userGrowthData = [
    { month: 'Jan', users: 1800000, growth: 0 },
    { month: 'Feb', users: 1850000, growth: 2.8 },
    { month: 'Mar', users: 1920000, growth: 3.8 },
    { month: 'Apr', users: 2000000, growth: 4.2 },
    { month: 'May', users: 2100000, growth: 5.0 },
    { month: 'Jun', users: 2200000, growth: 4.8 },
    { month: 'Jul', users: 2300000, growth: 4.5 },
    { month: 'Aug', users: 2400000, growth: 4.3 }
  ]

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />
      case 'down': return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
      case 'stable': return <BarChart3 className="w-4 h-4 text-gray-400" />
    }
  }

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-400'
      case 'down': return 'text-red-400'
      case 'stable': return 'text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent mb-4">
            Day 6: Business Intelligence & Analytics
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Enterprise-grade analytics and business intelligence platform
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-dark-800 rounded-lg p-1">
            {['overview', 'users', 'revenue', 'content', 'geography'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-md transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-dark-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Business Overview</h2>
              <p className="text-gray-400">Key performance indicators and business metrics</p>
            </div>
            
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {analyticsMetrics.map((metric) => (
                <div key={metric.id} className="bg-dark-800 rounded-xl p-6 border border-dark-700">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-indigo-400">{metric.icon}</div>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(metric.trend)}
                      <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </span>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{metric.value}</div>
                  <div className="text-gray-400 text-sm">{metric.name}</div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Genre Distribution */}
              <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
                <h3 className="text-xl font-semibold mb-4">Music Genre Distribution</h3>
                <div className="space-y-3">
                  {genreData.map((genre, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: genre.color }}></div>
                      <span className="flex-1 text-sm">{genre.label}</span>
                      <span className="text-sm font-medium">{genre.value}%</span>
                      <div className="w-24 h-2 bg-dark-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full"
                          style={{ 
                            width: `${genre.value}%`, 
                            backgroundColor: genre.color 
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Growth */}
              <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
                <h3 className="text-xl font-semibold mb-4">User Growth Trend</h3>
                <div className="space-y-3">
                  {userGrowthData.slice(-6).map((data, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">{data.month}</span>
                      <span className="text-sm font-medium">{(data.users / 1000000).toFixed(1)}M</span>
                      <span className={`text-xs ${data.growth > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                        {data.growth > 0 ? '+' : ''}{data.growth}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">User Analytics</h2>
              <p className="text-gray-400">Deep insights into user behavior and engagement</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Demographics */}
              <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
                <h3 className="text-xl font-semibold mb-4">User Demographics</h3>
                <div className="space-y-4">
                  {[
                    { age: '13-17', percentage: 15, color: 'bg-blue-500' },
                    { age: '18-24', percentage: 35, color: 'bg-green-500' },
                    { age: '25-34', percentage: 28, color: 'bg-yellow-500' },
                    { age: '35-44', percentage: 15, color: 'bg-purple-500' },
                    { age: '45+', percentage: 7, color: 'bg-red-500' }
                  ].map((demo, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${demo.color}`}></div>
                      <span className="flex-1 text-sm">{demo.age}</span>
                      <span className="text-sm font-medium">{demo.percentage}%</span>
                      <div className="w-24 h-2 bg-dark-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${demo.color}`}
                          style={{ width: `${demo.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Engagement Metrics */}
              <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
                <h3 className="text-xl font-semibold mb-4">Engagement Metrics</h3>
                <div className="space-y-4">
                  {[
                    { metric: 'Daily Active Users', value: '847K', change: '+8.3%' },
                    { metric: 'Session Duration', value: '24.5 min', change: '+12.1%' },
                    { metric: 'Songs per Session', value: '8.7', change: '+5.2%' },
                    { metric: 'Retention Rate', value: '78.3%', change: '+2.1%' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                      <span className="text-sm">{item.metric}</span>
                      <div className="text-right">
                        <div className="font-medium">{item.value}</div>
                        <div className="text-xs text-green-400">{item.change}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'revenue' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Revenue Analytics</h2>
              <p className="text-gray-400">Financial performance and revenue optimization</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Sources */}
              <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
                <h3 className="text-xl font-semibold mb-4">Revenue Sources</h3>
                <div className="space-y-4">
                  {[
                    { source: 'Premium Subscriptions', amount: '$850K', percentage: 71 },
                    { source: 'Ad Revenue', amount: '$250K', percentage: 21 },
                    { source: 'Merchandise', amount: '$80K', percentage: 7 },
                    { source: 'Other', amount: '$20K', percentage: 1 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{item.source}</span>
                      <div className="text-right">
                        <div className="font-medium">{item.amount}</div>
                        <div className="text-xs text-gray-400">{item.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Growth Projections */}
              <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
                <h3 className="text-xl font-semibold mb-4">Growth Projections</h3>
                <div className="space-y-4">
                  {[
                    { quarter: 'Q1 2024', projected: '$1.2M', actual: '$1.2M', status: 'met' },
                    { quarter: 'Q2 2024', projected: '$1.4M', actual: '$1.3M', status: 'below' },
                    { quarter: 'Q3 2024', projected: '$1.6M', actual: '$1.5M', status: 'below' },
                    { quarter: 'Q4 2024', projected: '$1.8M', actual: 'TBD', status: 'pending' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                      <span className="text-sm">{item.quarter}</span>
                      <div className="text-right">
                        <div className="font-medium">{item.projected}</div>
                        <div className={`text-xs ${
                          item.status === 'met' ? 'text-green-400' :
                          item.status === 'below' ? 'text-yellow-400' :
                          'text-gray-400'
                        }`}>
                          {item.actual}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Content Analytics</h2>
              <p className="text-gray-400">Music performance and content insights</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Performing Content */}
              <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
                <h3 className="text-xl font-semibold mb-4">Top Performing Songs</h3>
                <div className="space-y-3">
                  {[
                    { title: 'Midnight City', artist: 'M83', plays: '2.4M', growth: '+15.2%' },
                    { title: 'Take Me Out', artist: 'Franz Ferdinand', plays: '1.8M', growth: '+8.7%' },
                    { title: 'Feel Good Inc.', artist: 'Gorillaz', plays: '1.6M', growth: '+12.3%' },
                    { title: 'Bohemian Rhapsody', artist: 'Queen', plays: '1.4M', growth: '+5.1%' }
                  ].map((song, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                      <div>
                        <div className="font-medium">{song.title}</div>
                        <div className="text-sm text-gray-400">{song.artist}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{song.plays}</div>
                        <div className="text-xs text-green-400">{song.growth}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Performance */}
              <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
                <h3 className="text-xl font-semibold mb-4">Content Performance</h3>
                <div className="space-y-4">
                  {[
                    { metric: 'Total Songs', value: '15.7M', change: '+23.1%' },
                    { metric: 'Playlists Created', value: '892K', change: '-2.1%' },
                    { metric: 'User Uploads', value: '156K', change: '+18.7%' },
                    { metric: 'Content Rating', value: '4.8/5', change: '+0.2' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                      <span className="text-sm">{item.metric}</span>
                      <div className="text-right">
                        <div className="font-medium">{item.value}</div>
                        <div className={`text-xs ${
                          item.change.startsWith('+') ? 'text-green-400' :
                          item.change.startsWith('-') ? 'text-red-400' :
                          'text-gray-400'
                        }`}>
                          {item.change}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'geography' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Geographic Analytics</h2>
              <p className="text-gray-400">Global reach and regional performance</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Markets */}
              <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
                <h3 className="text-xl font-semibold mb-4">Top Markets</h3>
                <div className="space-y-3">
                  {[
                    { country: 'United States', users: '850K', revenue: '$450K', growth: '+12.3%' },
                    { country: 'United Kingdom', users: '320K', revenue: '$180K', growth: '+8.7%' },
                    { country: 'Germany', users: '280K', revenue: '$160K', growth: '+15.2%' },
                    { country: 'Canada', users: '220K', revenue: '$120K', growth: '+9.1%' },
                    { country: 'Australia', users: '180K', revenue: '$95K', growth: '+11.4%' }
                  ].map((market, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                      <div>
                        <div className="font-medium">{market.country}</div>
                        <div className="text-sm text-gray-400">{market.users} users</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{market.revenue}</div>
                        <div className="text-xs text-green-400">{market.growth}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Regional Insights */}
              <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
                <h3 className="text-xl font-semibold mb-4">Regional Insights</h3>
                <div className="space-y-4">
                  {[
                    { region: 'North America', users: '1.2M', percentage: 50, color: 'bg-blue-500' },
                    { region: 'Europe', users: '680K', percentage: 28, color: 'bg-green-500' },
                    { region: 'Asia Pacific', users: '320K', percentage: 13, color: 'bg-yellow-500' },
                    { region: 'Latin America', users: '160K', percentage: 7, color: 'bg-purple-500' },
                    { region: 'Other', users: '80K', percentage: 2, color: 'bg-gray-500' }
                  ].map((region, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded ${region.color}`}></div>
                      <span className="flex-1 text-sm">{region.region}</span>
                      <span className="text-sm font-medium">{region.users}</span>
                      <span className="text-sm text-gray-400">{region.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Stats */}
        <div className="mt-12 bg-dark-800 rounded-xl p-6 border border-dark-700">
          <h3 className="text-xl font-semibold mb-6 text-center">Real-time Analytics Dashboard</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-indigo-400 mb-2">24/7</div>
              <div className="text-gray-400">Monitoring</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">99.9%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">50ms</div>
              <div className="text-gray-400">Response Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">10M+</div>
              <div className="text-gray-400">Data Points</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
