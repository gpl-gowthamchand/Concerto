import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import Profile from './pages/Profile';
import Analytics from './pages/Analytics';
import Social from './pages/Social';
import Offline from './pages/Offline';
import Settings from './pages/Settings';
import Album from './pages/Album';
import Artist from './pages/Artist';
import Playlist from './pages/Playlist';
import NotFound from './pages/NotFound';

function App() {
  return (
    <HelmetProvider>
      <div className="App">
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Main app routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="library" element={<Library />} />
            <Route path="profile" element={<Profile />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="social" element={<Social />} />
            <Route path="offline" element={<Offline />} />
            <Route path="settings" element={<Settings />} />
            <Route path="album/:id" element={<Album />} />
            <Route path="artist/:id" element={<Artist />} />
            <Route path="playlist/:id" element={<Playlist />} />
          </Route>
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </HelmetProvider>
  );
}

export default App;
