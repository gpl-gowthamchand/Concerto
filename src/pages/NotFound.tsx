import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Home, Search, Music } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found - Concerto</title>
        <meta name="description" content="The page you're looking for doesn't exist" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          {/* 404 Icon */}
          <div className="mx-auto w-32 h-32 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mb-8">
            <Music className="h-16 w-16 text-white" />
          </div>

          {/* 404 Text */}
          <h1 className="text-8xl font-bold gradient-text mb-4">404</h1>
          <h2 className="text-2xl font-bold text-dark-100 mb-4">Page Not Found</h2>
          <p className="text-dark-400 text-lg mb-8">
            Oops! The page you're looking for seems to have wandered off into the music void.
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              to="/"
              className="btn-primary flex items-center justify-center space-x-2 w-full"
            >
              <Home className="h-5 w-5" />
              <span>Go Home</span>
            </Link>
            
            <Link
              to="/search"
              className="btn-secondary flex items-center justify-center space-x-2 w-full"
            >
              <Search className="h-5 w-5" />
              <span>Search Music</span>
            </Link>
          </div>

          {/* Fun Message */}
          <div className="mt-8 p-4 bg-dark-800 rounded-lg border border-dark-700">
            <p className="text-dark-300 text-sm">
              💡 Pro tip: While you're here, why not discover some new music? 
              The best songs are often found when you least expect them!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
