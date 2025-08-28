'use client'

import { useState } from 'react'
import { 
  Server, 
  Database, 
  Shield, 
  Code,
  Package,
  Rocket,
  GitPullRequest,
  GitCommit,
  Eye,
  Globe,
  HardDrive,
  Activity,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  RefreshCw
} from 'lucide-react'

interface DeploymentStage {
  id: string
  name: string
  status: 'pending' | 'running' | 'success' | 'failed'
  duration: number
  icon: React.ReactNode
}

interface ServiceStatus {
  name: string
  status: 'healthy' | 'warning' | 'error' | 'offline'
  uptime: string
  responseTime: number
  lastCheck: string
}

export default function ProfessionalDevOps() {
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'deploying' | 'success' | 'failed'>('idle')
  const [currentStage, setCurrentStage] = useState(0)
  const [deploymentProgress, setDeploymentProgress] = useState(0)
  const [activeTab, setActiveTab] = useState('deployment')

  const deploymentStages: DeploymentStage[] = [
    {
      id: 'build',
      name: 'Build & Compile',
      status: 'pending',
      duration: 45,
      icon: <Code className="w-6 h-6" />
    },
    {
      id: 'test',
      name: 'Run Tests',
      status: 'pending',
      duration: 23,
      icon: <CheckCircle className="w-6 h-6" />
    },
    {
      id: 'security',
      name: 'Security Scan',
      status: 'pending',
      duration: 67,
      icon: <Shield className="w-6 h-6" />
    },
    {
      id: 'deploy',
      name: 'Deploy to Production',
      status: 'pending',
      duration: 89,
      icon: <Rocket className="w-6 h-6" />
    },
    {
      id: 'health',
      name: 'Health Check',
      status: 'pending',
      duration: 12,
      icon: <Activity className="w-6 h-6" />
    }
  ]

  const serviceStatuses: ServiceStatus[] = [
    {
      name: 'Web Application',
      status: 'healthy',
      uptime: '99.9%',
      responseTime: 45,
      lastCheck: '2 minutes ago'
    },
    {
      name: 'API Gateway',
      status: 'healthy',
      uptime: '99.8%',
      responseTime: 23,
      lastCheck: '1 minute ago'
    },
    {
      name: 'Database Cluster',
      status: 'healthy',
      uptime: '99.9%',
      responseTime: 12,
      lastCheck: '30 seconds ago'
    },
    {
      name: 'CDN Network',
      status: 'healthy',
      uptime: '99.9%',
      responseTime: 8,
      lastCheck: '1 minute ago'
    },
    {
      name: 'Redis Cache',
      status: 'warning',
      uptime: '98.5%',
      responseTime: 156,
      lastCheck: '5 minutes ago'
    }
  ]

  const startDeployment = () => {
    setDeploymentStatus('deploying')
    setCurrentStage(0)
    setDeploymentProgress(0)
    
    deploymentStages.forEach((stage, index) => {
      setTimeout(() => {
        setCurrentStage(index)
        setDeploymentProgress((index + 1) * 20)
        
        // Simulate stage completion
        setTimeout(() => {
          if (index === deploymentStages.length - 1) {
            setDeploymentStatus('success')
          }
        }, stage.duration * 100)
      }, index * 2000)
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400'
      case 'warning': return 'text-yellow-400'
      case 'error': return 'text-red-400'
      case 'offline': return 'text-gray-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />
      case 'error': return <XCircle className="w-5 h-5 text-red-400" />
      case 'offline': return <XCircle className="w-5 h-5 text-gray-400" />
      default: return <Info className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-4">
            Day 6: Professional DevOps & Production Deployment
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Enterprise-grade deployment pipeline and infrastructure management
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-dark-800 rounded-lg p-1">
            {['deployment', 'monitoring', 'infrastructure', 'ci-cd'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-md transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-dark-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'deployment' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Automated Deployment Pipeline</h2>
              <p className="text-gray-400">CI/CD pipeline with automated testing and deployment</p>
            </div>
            
            {/* Deployment Control */}
            <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Deployment Control</h3>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    deploymentStatus === 'idle' ? 'bg-gray-600 text-gray-300' :
                    deploymentStatus === 'deploying' ? 'bg-blue-600 text-white' :
                    deploymentStatus === 'success' ? 'bg-green-600 text-white' :
                    'bg-red-600 text-white'
                  }`}>
                    {deploymentStatus === 'idle' ? 'Ready' :
                     deploymentStatus === 'deploying' ? 'Deploying...' :
                     deploymentStatus === 'success' ? 'Success' : 'Failed'}
                  </span>
                  <button
                    onClick={startDeployment}
                    disabled={deploymentStatus === 'deploying'}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                      deploymentStatus === 'deploying'
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-orange-600 hover:bg-orange-700 text-white'
                    }`}
                  >
                    {deploymentStatus === 'deploying' ? 'Deploying...' : 'Start Deployment'}
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Progress</span>
                  <span>{deploymentProgress}%</span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${deploymentProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Deployment Stages */}
              <div className="space-y-4">
                {deploymentStages.map((stage, index) => (
                  <div
                    key={stage.id}
                    className={`flex items-center space-x-4 p-4 rounded-lg border transition-all duration-300 ${
                      index === currentStage && deploymentStatus === 'deploying'
                        ? 'border-orange-500 bg-orange-500/10'
                        : index < currentStage
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-dark-600 bg-dark-700'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index === currentStage && deploymentStatus === 'deploying'
                        ? 'bg-orange-500 text-white'
                        : index < currentStage
                        ? 'bg-green-500 text-white'
                        : 'bg-dark-600 text-gray-400'
                    }`}>
                      {index === currentStage && deploymentStatus === 'deploying' ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        stage.icon
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{stage.name}</h4>
                      <p className="text-sm text-gray-400">Duration: {stage.duration}s</p>
                    </div>
                    <div className="text-right">
                      {index === currentStage && deploymentStatus === 'deploying' ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                          <span className="text-sm text-orange-400">Running</span>
                        </div>
                      ) : index < currentStage ? (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          <span className="text-sm text-green-400">Complete</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Pending</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'monitoring' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Real-time System Monitoring</h2>
              <p className="text-gray-400">Comprehensive monitoring and alerting system</p>
            </div>
            
            {/* Service Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
                <h3 className="text-xl font-semibold mb-4">Service Health</h3>
                <div className="space-y-4">
                  {serviceStatuses.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(service.status)}
                        <div>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-sm text-gray-400">Uptime: {service.uptime}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${getStatusColor(service.status)}`}>
                          {service.responseTime}ms
                        </div>
                        <div className="text-xs text-gray-500">{service.lastCheck}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
                <h3 className="text-xl font-semibold mb-4">System Metrics</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>CPU Usage</span>
                      <span className="text-green-400">23%</span>
                    </div>
                    <div className="w-full bg-dark-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '23%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Memory Usage</span>
                      <span className="text-blue-400">67%</span>
                    </div>
                    <div className="w-full bg-dark-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Disk Usage</span>
                      <span className="text-yellow-400">45%</span>
                    </div>
                    <div className="w-full bg-dark-700 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Network I/O</span>
                      <span className="text-purple-400">89%</span>
                    </div>
                    <div className="w-full bg-dark-700 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '89%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'infrastructure' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Infrastructure Overview</h2>
              <p className="text-gray-400">Cloud infrastructure and resource management</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Load Balancers', count: 3, status: 'healthy', icon: <Globe className="w-8 h-8" /> },
                { name: 'Application Servers', count: 12, status: 'healthy', icon: <Server className="w-8 h-8" /> },
                { name: 'Database Nodes', count: 5, status: 'healthy', icon: <Database className="w-8 h-8" /> },
                { name: 'Cache Servers', count: 8, status: 'warning', icon: <HardDrive className="w-8 h-8" /> }
              ].map((service, index) => (
                <div key={index} className="bg-dark-800 rounded-xl p-6 text-center border border-dark-700">
                  <div className="text-blue-400 mx-auto mb-4">{service.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
                  <div className="text-3xl font-bold text-white mb-2">{service.count}</div>
                  <div className={`flex items-center justify-center space-x-2 ${
                    service.status === 'healthy' ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      service.status === 'healthy' ? 'bg-green-400' : 'bg-yellow-400'
                    }`}></div>
                    <span className="text-sm font-medium capitalize">{service.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ci-cd' && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">CI/CD Pipeline</h2>
              <p className="text-gray-400">Continuous Integration and Continuous Deployment</p>
            </div>
            
            <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
              <h3 className="text-xl font-semibold mb-6">Pipeline Stages</h3>
              <div className="space-y-4">
                {[
                  { name: 'Code Commit', icon: <GitCommit className="w-6 h-6" />, status: 'success' },
                  { name: 'Pull Request', icon: <GitPullRequest className="w-6 h-6" />, status: 'success' },
                  { name: 'Code Review', icon: <Eye className="w-6 h-6" />, status: 'success' },
                  { name: 'Build & Test', icon: <Package className="w-6 h-6" />, status: 'success' },
                  { name: 'Security Scan', icon: <Shield className="w-6 h-6" />, status: 'success' },
                  { name: 'Deploy to Staging', icon: <Rocket className="w-6 h-6" />, status: 'success' },
                  { name: 'Integration Tests', icon: <CheckCircle className="w-6 h-6" />, status: 'success' },
                  { name: 'Deploy to Production', icon: <Rocket className="w-6 h-6" />, status: 'pending' }
                ].map((stage, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      stage.status === 'success' ? 'bg-green-500' : 'bg-gray-600'
                    }`}>
                      {stage.status === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : (
                        stage.icon
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{stage.name}</div>
                      <div className="text-sm text-gray-400">
                        {stage.status === 'success' ? 'Completed successfully' : 'Waiting...'}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs ${
                      stage.status === 'success' ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                    }`}>
                      {stage.status === 'success' ? 'Success' : 'Pending'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
