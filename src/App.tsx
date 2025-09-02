import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Sidebar from './components/Sidebar';
import MusicPlayer from './components/MusicPlayer';
import OnlineMusic from './pages/OnlineMusic';
import Library from './pages/Library';
import Favorites from './pages/Favorites';
import Recent from './pages/Recent';
import './index.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="flex h-screen bg-gray-900">
          {/* Left Sidebar */}
          <Sidebar />
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Top Navigation */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h1 className="text-2xl font-bold text-gray-900">Concerto</h1>
                  <div className="text-sm text-gray-500">Music Player</div>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="p-2 text-gray-500 hover:text-gray-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
              <Routes>
                <Route path="/" element={<OnlineMusic />} />
                <Route path="/online" element={<OnlineMusic />} />
                <Route path="/library" element={<Library />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/recent" element={<Recent />} />
              </Routes>
            </div>
          </div>

          {/* Right Sidebar - Now Playing */}
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <h2 className="text-lg font-semibold text-gray-900">Now Playing</h2>
              </div>
            </div>
            
            <div className="flex-1 p-4">
              {/* Current Track */}
              <div className="mb-6">
                <div className="w-full h-48 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-4 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">No Track Playing</h3>
                <p className="text-gray-500">Select a track to start listening</p>
              </div>

              {/* Queue */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Queue</h3>
                <div className="space-y-2">
                  <div className="text-sm text-gray-500 text-center py-4">
                    No tracks in queue
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Player Bar */}
        <MusicPlayer />
      </Router>
    </Provider>
  );
}

export default App;
