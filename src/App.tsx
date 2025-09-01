import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAppSelector } from './redux/hooks';
import Sidebar from './components/Sidebar';
import MusicPlayer from './components/MusicPlayer';
import SearchBar from './components/SearchBar';
import Home from './pages/Home';
import Discover from './pages/Discover';
import OnlineMusic from './pages/OnlineMusic';
import Library from './pages/Library';

const App: React.FC = () => {
  const { activeSong } = useAppSelector((state) => state.player);

  return (
    <div className="relative flex h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <SearchBar onSearch={(query) => console.log('Search:', query)} />
        
        <div className="flex-1 overflow-y-auto px-6 pb-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/online" element={<OnlineMusic />} />
            <Route path="/library" element={<Library />} />
            <Route path="/favorites" element={<Library />} />
            <Route path="/recent" element={<Library />} />
          </Routes>
        </div>
      </div>

      {activeSong?.title && (
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-r from-dark-800 to-dark-900 border-t border-dark-700 backdrop-blur-lg">
          <MusicPlayer />
        </div>
      )}
    </div>
  );
};

export default App;
