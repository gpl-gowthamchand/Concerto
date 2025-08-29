import React, { useState } from 'react';
import { Settings as SettingsIcon, Palette, Music, Bell, Shield, Download, Globe, Database, Info } from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'audio' | 'notifications' | 'privacy' | 'storage' | 'about'>('general');

  const renderGeneral = () => (
    <div className="space-y-6">
      <div className="bg-dark-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
          <Palette className="w-5 h-5" />
          <span>Appearance</span>
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
            <select className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white">
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
            <select className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Time Format</label>
            <select className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white">
              <option value="12">12-hour</option>
              <option value="24">24-hour</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-dark-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
          <Globe className="w-5 h-5" />
          <span>Regional</span>
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Country/Region</label>
            <select className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white">
              <option value="us">United States</option>
              <option value="uk">United Kingdom</option>
              <option value="ca">Canada</option>
              <option value="au">Australia</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
            <select className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white">
              <option value="usd">USD ($)</option>
              <option value="eur">EUR (€)</option>
              <option value="gbp">GBP (£)</option>
              <option value="cad">CAD (C$)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAudio = () => (
    <div className="space-y-6">
      <div className="bg-dark-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
          <Music className="w-5 h-5" />
          <span>Playback</span>
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Audio Quality</label>
            <select className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white">
              <option value="low">Low (96 kbps)</option>
              <option value="medium">Medium (192 kbps)</option>
              <option value="high">High (320 kbps)</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-blue-600 bg-dark-700 border-dark-600 rounded focus:ring-blue-500"
              />
              <span className="text-white">Autoplay next track</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-dark-700 border-dark-600 rounded focus:ring-blue-500"
              />
              <span className="text-white">Crossfade between tracks</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-blue-600 bg-dark-700 border-dark-600 rounded focus:ring-blue-500"
              />
              <span className="text-white">Gapless playback</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-dark-700 border-dark-600 rounded focus:ring-blue-500"
              />
              <span className="text-white">Normalize volume</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-dark-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Equalizer</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white">Bass</span>
            <input
              type="range"
              min="-12"
              max="12"
              defaultValue="0"
              className="w-32 h-2 bg-dark-600 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-white w-8 text-center">0</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-white">Treble</span>
            <input
              type="range"
              min="-12"
              max="12"
              defaultValue="0"
              className="w-32 h-2 bg-dark-600 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-white w-8 text-center">0</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-white">Balance</span>
            <input
              type="range"
              min="-20"
              max="20"
              defaultValue="0"
              className="w-32 h-2 bg-dark-600 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-white w-8 text-center">0</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="bg-dark-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
          <Bell className="w-5 h-5" />
          <span>Push Notifications</span>
        </h3>
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-blue-600 bg-dark-700 border-dark-600 rounded focus:ring-blue-500"
              />
              <span className="text-white">New releases from followed artists</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-blue-600 bg-dark-700 border-dark-600 rounded focus:ring-blue-500"
              />
              <span className="text-white">Playlist updates</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-blue-600 bg-dark-700 border-dark-600 rounded focus:ring-blue-500"
              />
              <span className="text-white">Friend activity</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-blue-600 bg-dark-700 border-dark-600 rounded focus:ring-blue-500"
              />
              <span className="text-white">Personalized recommendations</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-dark-700 border-dark-600 rounded focus:ring-blue-500"
              />
              <span className="text-white">Marketing and promotions</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-dark-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Email Notifications</h3>
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-blue-600 bg-dark-700 border-dark-600 rounded focus:ring-blue-500"
            />
            <span className="text-white">Weekly digest</span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 text-blue-600 bg-dark-700 border-dark-600 rounded focus:ring-blue-500"
            />
            <span className="text-white">Account updates</span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-dark-700 border-dark-600 rounded focus:ring-blue-500"
            />
            <span className="text-white">Newsletter</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="space-y-6">
      <div className="bg-dark-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
          <Shield className="w-5 h-5" />
          <span>Privacy Settings</span>
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Profile Visibility</label>
            <select className="w-full bg-dark-700 border border-dark-600 rounded-lg px-3 py-2 text-white">
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-blue-600 bg-dark-700 border-dark-600 rounded focus:ring-blue-500"
              />
              <span className="text-white">Show listening history</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-blue-600 bg-dark-700 border-dark-600 rounded focus:ring-blue-500"
              />
              <span className="text-white">Show current track</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-blue-600 bg-dark-700 border-dark-600 rounded focus:ring-blue-500"
              />
              <span className="text-white">Allow friend requests</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-dark-700 border-dark-600 rounded focus:ring-blue-500"
              />
              <span className="text-white">Share listening data for recommendations</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-dark-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Data & Privacy</h3>
        <div className="space-y-4">
          <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            Download My Data
          </button>
          <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );

  const renderStorage = () => (
    <div className="space-y-6">
      <div className="bg-dark-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
          <Download className="w-5 h-5" />
          <span>Offline Storage</span>
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white">Storage Used</span>
            <span className="text-gray-400">2.4 GB / 5 GB</span>
          </div>
          
          <div className="w-full bg-dark-700 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '48%' }}></div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 text-blue-600 bg-dark-700 border-dark-600 rounded focus:ring-blue-500"
              />
              <span className="text-white">Auto-download new releases</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-dark-700 border-dark-600 rounded focus:ring-blue-500"
              />
              <span className="text-white">Download over Wi-Fi only</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-dark-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
          <Database className="w-5 h-5" />
          <span>Cache Management</span>
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white">Cache Size</span>
            <span className="text-gray-400">156 MB</span>
          </div>
          
          <button className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
            Clear Cache
          </button>
        </div>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="space-y-6">
      <div className="bg-dark-800 rounded-xl p-6 text-center">
        <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Music className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Concerto Music App</h3>
        <p className="text-gray-400 mb-4">Version 1.0.0</p>
        <p className="text-gray-300">A comprehensive music streaming application with AI-powered features</p>
      </div>

      <div className="bg-dark-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
          <Info className="w-5 h-5" />
          <span>App Information</span>
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Version</span>
            <span className="text-white">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Build</span>
            <span className="text-white">2024.1.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Release Date</span>
            <span className="text-white">January 2024</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">License</span>
            <span className="text-white">MIT</span>
          </div>
        </div>
      </div>

      <div className="bg-dark-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Support & Feedback</h3>
        <div className="space-y-3">
          <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            Contact Support
          </button>
          <button className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
            Send Feedback
          </button>
          <button className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
            Rate App
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Settings</h1>
        <p className="text-gray-400">Customize your app experience and preferences</p>
      </div>

      <div className="flex space-x-1 bg-dark-800 rounded-lg p-1">
        {[
          { id: 'general', label: 'General', icon: SettingsIcon },
          { id: 'audio', label: 'Audio', icon: Music },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'privacy', label: 'Privacy', icon: Shield },
          { id: 'storage', label: 'Storage', icon: Download },
          { id: 'about', label: 'About', icon: Info }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
              activeTab === id
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-dark-700'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'general' && renderGeneral()}
      {activeTab === 'audio' && renderAudio()}
      {activeTab === 'notifications' && renderNotifications()}
      {activeTab === 'privacy' && renderPrivacy()}
      {activeTab === 'storage' && renderStorage()}
      {activeTab === 'about' && renderAbout()}
    </div>
  );
};

export default Settings;
