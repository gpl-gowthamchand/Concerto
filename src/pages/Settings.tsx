import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import {
  setAudioNormalization,
  setSkipSilence,
  setCrossfade,
  setGaplessPlayback,
  setSleepTimer,
  setPlaybackRate,
  setTempo,
  setPitch,
} from '../redux/features/playerSlice';
import OfflineManager from '../components/OfflineManager/OfflineManager';

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const {
    audioNormalization,
    skipSilence,
    crossfade,
    gaplessPlayback,
    sleepTimer,
    playbackRate,
    tempo,
    pitch,
    downloadedSongs,
  } = useSelector((state: RootState) => state.player);

  const [showOfflineManager, setShowOfflineManager] = useState(false);
  const [activeTab, setActiveTab] = useState<'audio' | 'playback' | 'offline' | 'about'>('audio');

  const handleAudioNormalizationChange = (enabled: boolean) => {
    dispatch(setAudioNormalization(enabled));
  };

  const handleSkipSilenceChange = (enabled: boolean) => {
    dispatch(setSkipSilence(enabled));
  };

  const handleCrossfadeChange = (enabled: boolean) => {
    dispatch(setCrossfade(enabled));
  };

  const handleGaplessPlaybackChange = (enabled: boolean) => {
    dispatch(setGaplessPlayback(enabled));
  };

  const handlePlaybackRateChange = (rate: number) => {
    dispatch(setPlaybackRate(rate));
  };

  const handleTempoChange = (tempo: number) => {
    dispatch(setTempo(tempo));
  };

  const handlePitchChange = (pitch: number) => {
    dispatch(setPitch(pitch));
  };

  const resetAudioSettings = () => {
    dispatch(setAudioNormalization(true));
    dispatch(setSkipSilence(false));
    dispatch(setCrossfade(false));
    dispatch(setGaplessPlayback(true));
    dispatch(setPlaybackRate(1.0));
    dispatch(setTempo(1.0));
    dispatch(setPitch(0));
  };

  const tabs = [
    { id: 'audio', label: 'Audio', icon: '🔊' },
    { id: 'playback', label: 'Playback', icon: '▶️' },
    { id: 'offline', label: 'Offline', icon: '📱' },
    { id: 'about', label: 'About', icon: 'ℹ️' },
  ];

  return (
    <div className="flex-1 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <div className="text-sm text-gray-500">Configure your music experience</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'audio' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Audio Settings</h2>
                
                {/* Audio Processing */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Audio Processing</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Audio Normalization</label>
                        <p className="text-sm text-gray-500">Automatically adjust volume levels for consistent playback</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={audioNormalization}
                          onChange={(e) => handleAudioNormalizationChange(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Skip Silence</label>
                        <p className="text-sm text-gray-500">Automatically skip silent parts in songs</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={skipSilence}
                          onChange={(e) => handleSkipSilenceChange(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Audio Quality */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Audio Quality</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Audio Quality</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="low">Low (128 kbps)</option>
                        <option value="medium">Medium (256 kbps)</option>
                        <option value="high" selected>High (320 kbps)</option>
                        <option value="lossless">Lossless (FLAC)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'playback' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Playback Settings</h2>
                
                {/* Playback Controls */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Playback Controls</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Crossfade</label>
                        <p className="text-sm text-gray-500">Smooth transition between songs</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={crossfade}
                          onChange={(e) => handleCrossfadeChange(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Gapless Playback</label>
                        <p className="text-sm text-gray-500">Play songs without gaps between tracks</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={gaplessPlayback}
                          onChange={(e) => handleGaplessPlaybackChange(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Audio Processing */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Audio Processing</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Playback Rate: {playbackRate.toFixed(1)}x
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="2.0"
                        step="0.1"
                        value={playbackRate}
                        onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0.5x</span>
                        <span>1.0x</span>
                        <span>2.0x</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tempo: {tempo.toFixed(1)}x
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="2.0"
                        step="0.1"
                        value={tempo}
                        onChange={(e) => handleTempoChange(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0.5x</span>
                        <span>1.0x</span>
                        <span>2.0x</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pitch: {pitch > 0 ? '+' : ''}{pitch.toFixed(1)} semitones
                      </label>
                      <input
                        type="range"
                        min="-12"
                        max="12"
                        step="1"
                        value={pitch}
                        onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>-12</span>
                        <span>0</span>
                        <span>+12</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reset Button */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Reset Settings</h3>
                      <p className="text-sm text-gray-500">Reset all audio and playback settings to default</p>
                    </div>
                    <button
                      onClick={resetAudioSettings}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'offline' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Offline Settings</h2>
                
                {/* Offline Manager */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Downloaded Songs</h3>
                      <p className="text-sm text-gray-500">
                        {downloadedSongs.length} songs downloaded for offline playback
                      </p>
                    </div>
                    <button
                      onClick={() => setShowOfflineManager(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Manage Downloads
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="font-medium text-gray-900">Downloaded</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">{downloadedSongs.length}</p>
                      <p className="text-sm text-gray-500">songs</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium text-gray-900">Offline Ready</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">Yes</p>
                      <p className="text-sm text-gray-500">available</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                        </svg>
                        <span className="font-medium text-gray-900">Storage</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-600">~{Math.round(downloadedSongs.length * 4.5)}MB</p>
                      <p className="text-sm text-gray-500">estimated</p>
                    </div>
                  </div>
                </div>

                {/* Auto Download Settings */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Auto Download</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Auto Download Favorites</label>
                        <p className="text-sm text-gray-500">Automatically download songs you add to favorites</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Download on WiFi Only</label>
                        <p className="text-sm text-gray-500">Only download songs when connected to WiFi</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">About Concerto</h2>
                
                {/* App Info */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl">🎵</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Concerto</h3>
                    <p className="text-gray-600 mb-4">Advanced Music Player</p>
                    <p className="text-sm text-gray-500">Version 2.0.0</p>
                  </div>
                </div>

                {/* Features */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Features</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-700">Multi-platform streaming</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-700">Offline playback</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-700">Live lyrics</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-700">Audio processing</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-700">Sleep timer</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-700">Playlist management</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-700">Crossfade & gapless</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-700">Material 3 design</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Credits */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Credits</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-700">
                        <strong>Inspired by:</strong> Metrolist - YouTube Music client for Android
                      </p>
                      <p className="text-xs text-gray-500">
                        Enhanced with advanced features and modern web technologies
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-700">
                        <strong>Built with:</strong> React, TypeScript, Redux Toolkit, Tailwind CSS
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-700">
                        <strong>Audio Processing:</strong> Web Audio API, IndexedDB for offline storage
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Offline Manager Modal */}
      <OfflineManager
        isOpen={showOfflineManager}
        onClose={() => setShowOfflineManager(false)}
      />
    </div>
  );
};

export default Settings;
