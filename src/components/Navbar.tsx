import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home } from 'lucide-react';

function Navbar() {
  const location = useLocation();
  const isStudio = location.pathname.includes('/studio');

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <Home className="h-8 w-8 text-primary" />
            <h1 className="ml-2 text-2xl font-bold text-gray-900">
              {isStudio ? 'LuxuryEstates Studio' : 'LuxuryEstates'}
            </h1>
          </Link>
          <div className="flex items-center space-x-8">
            {!isStudio && (
              <>
                <nav className="hidden md:flex space-x-8">
                  <Link to="/buy" className="text-gray-700 hover:text-primary">Buy</Link>
                  <a href="#" className="text-gray-700 hover:text-primary">Rent</a>
                  <a href="#" className="text-gray-700 hover:text-primary">Sell</a>
                  <a href="#" className="text-gray-700 hover:text-primary">Contact</a>
                </nav>
                <Link 
                  to="/studio"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
                >
                  Studio
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;