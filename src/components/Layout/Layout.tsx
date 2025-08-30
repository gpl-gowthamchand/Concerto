import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import RealAudioPlayer from './RealAudioPlayer';
import { useAudioStore } from '../../stores/audioStore';

const Layout: React.FC = () => {
  const { currentTrack } = useAudioStore();

  return (
    <div className="flex h-screen bg-dark-900">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
        
        {/* Audio Player */}
        <RealAudioPlayer 
          track={currentTrack || undefined}
          onTrackEnd={() => {
            // Handle track end - this will be handled by the audio store
          }}
        />
      </div>
    </div>
  );
};

export default Layout;
