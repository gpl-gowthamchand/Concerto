import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<div className="min-h-screen bg-dark-900 flex items-center justify-center">
          <div className="text-white text-2xl">Welcome to Concerto!</div>
        </div>} />
      </Routes>
    </Router>
  );
}

export default App;
