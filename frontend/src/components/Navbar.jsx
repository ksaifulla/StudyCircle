import React from 'react';
import { useLocation } from 'react-router-dom';

const CustomNavbar = () => {
  const location = useLocation();

  const isHomeActive = location.pathname === '/' || location.pathname === '/home' || location.pathname === '';

  return (
    <nav className="bg-soft-800 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold text-white">Study Circle</span>
        <div className="flex space-x-8">
          <a
            href="/"
            className={`text-white no-underline ${
              isHomeActive ? 'font-bold text-yellow-400' : 'hover:underline'
            }`}
          >
            Home
          </a>
          <a
            href="/profile"
            className={`text-white no-underline ${
              location.pathname === '/profile'
                ? 'font-bold text-yellow-400'
                : 'hover:underline'
            }`}
          >
            Profile
          </a>
        </div>
      </div>
    </nav>
  );
};

export default CustomNavbar;