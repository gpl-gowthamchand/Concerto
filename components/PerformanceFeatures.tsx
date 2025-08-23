'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { 
  Zap, 
  Database, 
  HardDrive, 
  Network, 
  Cpu, 
  Memory,
  Clock,
  TrendingUp,
  Download,
  Upload,
  RefreshCw,
  Settings,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Shuffle,
  Repeat,
  Heart,
  Share2,
  Battery
} from 'lucide-react'

interface PerformanceMetric {
  name: string
  value: number
  unit: string
  status: 'excellent' | 'good' | 'warning' | 'critical'
  trend: 'up' | 'down' | 'stable'
}

interface CacheItem {
  id: string
  name: string
  size: string
  lastAccessed: string
  hitRate: number
  type: 'audio' | 'image' | 'data' | 'api'
}

export default function PerformanceFeatures() {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationProgress, setOptimizationProgress] = useState(0)
  const [cacheItems, setCacheItems] = useState<CacheItem[]>([])
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([])
  const [isLazyLoading, setIsLazyLoading] = useState(false)
  const [lazyLoadProgress, setLazyLoadProgress] = useState(0)
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline' | 'slow'>('online')
  const [batteryOptimization, setBatteryOptimization] = useState(true)
  const [dataSaver, setDataSaver] = useState(false)
  const [autoQuality, setAutoQuality] = useState(true)

  // Performance metrics simulation
  useEffect(() => {
    const generateMetrics = () => {
      const metrics: PerformanceMetric[] = [
        {
          name: 'CPU Usage',
          value: Math.floor(Math.random() * 30) + 10,
          unit: '%',
          status: 'excellent',
          trend: 'stable'
        },
        {
          name: 'Memory Usage',
          value: Math.floor(Math.random() * 20) + 15,
          unit: 'MB',
          status: 'good',
          trend: 'stable'
        },
        {
          name: 'Network Latency',
          value: Math.floor(Math.random() * 50) + 20,
          unit: 'ms',
          status: 'good',
          trend: 'down'
        },
        {
          name: 'Cache Hit Rate',
          value: Math.floor(Math.random() * 20) + 80,
          unit: '%',
          status: 'excellent',
          trend: 'up'
        },
        {
          name: 'Disk I/O',
          value: Math.floor(Math.random() * 100) + 50,
          unit: 'MB/s',
          status: 'good',
          trend: 'stable'
        },
        {
          name: 'GPU Usage',
          value: Math.floor(Math.random() * 15) + 5,
          unit: '%',
          status: 'excellent',
          trend: 'stable'
        }
      ]
      setPerformanceMetrics(metrics)
    }

    generateMetrics()
    const interval = setInterval(generateMetrics, 3000)
    return () => clearInterval(interval)
  }, [])

  // Cache items simulation
  useEffect(() => {
    const mockCacheItems: CacheItem[] = [
      {
        id: '1',
        name: 'Audio Cache',
        size: '2.4 GB',
        lastAccessed: '2 minutes ago',
        hitRate: 94,
        type: 'audio'
      },
      {
        id: '2',
        name: 'Image Cache',
        size: '156 MB',
        lastAccessed: '5 minutes ago',
        hitRate: 87,
        type: 'image'
      },
      {
        id: '3',
        name: 'API Response Cache',
        size: '23 MB',
        lastAccessed: '1 minute ago',
        hitRate: 91,
        type: 'api'
      },
      {
        id: '4',
        name: 'User Data Cache',
        size: '45 MB',
        lastAccessed: '3 minutes ago',
        hitRate: 89,
        type: 'data'
      }
    ]
    setCacheItems(mockCacheItems)
  }, [])

  // Network status simulation
  useEffect(() => {
    const simulateNetwork = () => {
      const random = Math.random()
      if (random < 0.7) {
        setNetworkStatus('online')
      } else if (random < 0.9) {
        setNetworkStatus('slow')
      } else {
        setNetworkStatus('offline')
      }
    }

    simulateNetwork()
    const interval = setInterval(simulateNetwork, 5000)
    return () => clearInterval(interval)
  }, [])

  // Performance optimization simulation
  const runOptimization = useCallback(async () => {
    setIsOptimizing(true)
    setOptimizationProgress(0)

    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setOptimizationProgress(i)
    }

    setIsOptimizing(false)
    setOptimizationProgress(100)
  }, [])

  // Lazy loading simulation
  const simulateLazyLoading = useCallback(async () => {
    setIsLazyLoading(true)
    setLazyLoadProgress(0)

    for (let i = 0; i <= 100; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 100))
      setLazyLoadProgress(i)
    }

    setIsLazyLoading(false)
    setLazyLoadProgress(100)
  }, [])

  // Memoized performance calculations
  const overallPerformance = useMemo(() => {
    const avgHitRate = performanceMetrics.reduce((sum, metric) => 
      metric.name === 'Cache Hit Rate' ? sum + metric.value : sum, 0
    )
    const avgLatency = performanceMetrics.reduce((sum, metric) => 
      metric.name === 'Network Latency' ? sum + metric.value : sum, 0
    )
    
    let score = 100
    if (avgHitRate < 80) score -= 20
    if (avgLatency > 100) score -= 15
    if (networkStatus === 'offline') score -= 30
    
    return Math.max(score, 0)
  }, [performanceMetrics, networkStatus])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-400'
      case 'good': return 'text-blue-400'
      case 'warning': return 'text-yellow-400'
      case 'critical': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />
      case 'down': return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
      default: return <Clock className="w-4 h-4 text-blue-400" />
    }
  }

  const getNetworkIcon = () => {
    switch (networkStatus) {
      case 'online': return <Network className="w-5 h-5 text-green-400" />
      case 'slow': return <Network className="w-5 h-5 text-yellow-400" />
      case 'offline': return <Network className="w-5 h-5 text-red-400" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Performance & Optimization
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Advanced performance monitoring, intelligent caching, and optimization features that keep Concerto running smoothly.
        </p>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-800 rounded-xl border border-dark-700 p-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">{overallPerformance}</h3>
          <p className="text-gray-400">Performance Score</p>
          <div className="mt-4">
            <div className="w-full bg-dark-600 rounded-full h-2">
              <div 
                className="h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${overallPerformance}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-dark-800 rounded-xl border border-dark-700 p-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">2.6 GB</h3>
          <p className="text-gray-400">Cache Size</p>
          <div className="mt-4">
            <div className="w-full bg-dark-600 rounded-full h-2">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: '65%' }} />
            </div>
          </div>
        </div>

        <div className="bg-dark-800 rounded-xl border border-dark-700 p-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Cpu className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">24%</h3>
          <p className="text-gray-400">CPU Usage</p>
          <div className="mt-4">
            <div className="w-full bg-dark-600 rounded-full h-2">
              <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: '24%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
        <h3 className="text-xl font-bold text-white mb-6">Real-time Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {performanceMetrics.map((metric) => (
            <div key={metric.name} className="bg-dark-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">{metric.name}</span>
                {getTrendIcon(metric.trend)}
              </div>
              <div className="flex items-baseline space-x-2">
                <span className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                  {metric.value}
                </span>
                <span className="text-gray-400">{metric.unit}</span>
              </div>
              <div className="mt-2">
                <div className="w-full bg-dark-600 rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full transition-all duration-500 ${
                      metric.status === 'excellent' ? 'bg-green-500' :
                      metric.status === 'good' ? 'bg-blue-500' :
                      metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(metric.value * 2, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cache Management */}
      <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Cache Management</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={runOptimization}
              disabled={isOptimizing}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${isOptimizing ? 'animate-spin' : ''}`} />
              <span>{isOptimizing ? 'Optimizing...' : 'Optimize Cache'}</span>
            </button>
          </div>
        </div>

        {isOptimizing && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Optimization Progress</span>
              <span className="text-primary-400">{optimizationProgress}%</span>
            </div>
            <div className="w-full bg-dark-600 rounded-full h-2">
              <div 
                className="h-2 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${optimizationProgress}%` }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cacheItems.map((item) => (
            <div key={item.id} className="bg-dark-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    item.type === 'audio' ? 'bg-blue-500' :
                    item.type === 'image' ? 'bg-green-500' :
                    item.type === 'api' ? 'bg-purple-500' : 'bg-orange-500'
                  }`}>
                    <HardDrive className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{item.name}</h4>
                    <p className="text-gray-400 text-sm">{item.size}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Hit Rate</div>
                  <div className="text-lg font-semibold text-green-400">{item.hitRate}%</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">Last accessed: {item.lastAccessed}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Network & Battery Optimization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
          <h3 className="text-xl font-bold text-white mb-6">Network & Battery</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getNetworkIcon()}
                <span className="text-white">Network Status</span>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                networkStatus === 'online' ? 'bg-green-500/20 text-green-400' :
                networkStatus === 'slow' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {networkStatus.charAt(0).toUpperCase() + networkStatus.slice(1)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Battery className="w-5 h-5 text-green-400" />
                <span className="text-white">Battery Optimization</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={batteryOptimization}
                  onChange={(e) => setBatteryOptimization(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Download className="w-5 h-5 text-blue-400" />
                <span className="text-white">Data Saver</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={dataSaver}
                  onChange={(e) => setDataSaver(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5 text-purple-400" />
                <span className="text-white">Auto Quality</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoQuality}
                  onChange={(e) => setAutoQuality(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
          <h3 className="text-xl font-bold text-white mb-6">Lazy Loading & Performance</h3>
          
          <div className="space-y-4">
            <button
              onClick={simulateLazyLoading}
              disabled={isLazyLoading}
              className="w-full px-4 py-3 bg-gradient-to-r from-primary-500 to-purple-500 hover:from-primary-600 hover:to-purple-600 disabled:opacity-50 text-white rounded-lg transition-all flex items-center justify-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLazyLoading ? 'animate-spin' : ''}`} />
              <span>{isLazyLoading ? 'Loading...' : 'Simulate Lazy Loading'}</span>
            </button>

            {isLazyLoading && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Loading Progress</span>
                  <span className="text-primary-400">{lazyLoadProgress}%</span>
                </div>
                <div className="w-full bg-dark-600 rounded-full h-2">
                  <div 
                    className="h-2 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-300"
                    style={{ width: `${lazyLoadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Image Optimization</span>
                <span className="text-green-400">Active</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Code Splitting</span>
                <span className="text-green-400">Enabled</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Service Worker</span>
                <span className="text-green-400">Running</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">CDN Usage</span>
                <span className="text-green-400">Optimized</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Tips */}
      <div className="bg-dark-800 rounded-xl border border-dark-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">🚀 Performance Tips</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-400">
          <div className="space-y-2">
            <p>• <strong>Enable battery optimization</strong> for longer listening sessions</p>
            <p>• <strong>Use data saver</strong> when on limited connections</p>
            <p>• <strong>Clear cache regularly</strong> to free up storage</p>
          </div>
          <div className="space-y-2">
            <p>• <strong>Auto quality</strong> adapts to your network speed</p>
            <p>• <strong>Lazy loading</strong> improves initial load times</p>
            <p>• <strong>Service worker</strong> enables offline playback</p>
          </div>
        </div>
      </div>
    </div>
  )
}
