import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import Social from './pages/Social';
import Offline from './pages/Offline';
import PlaylistPage from './pages/Playlist';
import ArtistPage from './pages/Artist';
import AlbumPage from './pages/Album';
import Register from './pages/Auth/Register';
import NotFound from './pages/NotFound';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="library" element={<Library />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="social" element={<Social />} />
            <Route path="offline" element={<Offline />} />
            <Route path="playlist/:id" element={<PlaylistPage />} />
            <Route path="artist/:id" element={<ArtistPage />} />
            <Route path="album/:id" element={<AlbumPage />} />
            <Route path="register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
