import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Bath, BedDouble, Ruler, Heart, Search, MapPin } from 'lucide-react';
import { useProperties } from '../hooks/useProperties';
import { formatPrice } from '../utils/formatters';

function HomePage() {
  const { properties } = useProperties();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[80vh] flex items-center">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80"
            alt="Luxury Home"
            style={{ objectPosition: 'center center' }}
          />
          <div className="absolute inset-0 bg-gray-900 bg-opacity-70 mix-blend-multiply" />
        </div>
        <div className="relative w-full max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
            Discover Your Dream Home
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mb-10">
            Explore our curated collection of luxury properties in the most sought-after locations worldwide. Your perfect home awaits.
          </p>
          <div className="max-w-3xl bg-white p-4 rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-3 h-6 w-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter location"
                  className="w-full pl-12 pr-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-6 w-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="Property type, price range..."
                  className="w-full pl-12 pr-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <button className="bg-primary text-white px-8 py-3 rounded-md hover:bg-primary/90 transition-colors duration-200">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="my-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Properties</h2>
          <p className="text-gray-600">Discover our handpicked selection of luxury properties</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <Link 
              key={property.id} 
              to={`/property/${property.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
            >
              <div className="relative h-64">
                <img
                  src={property.thumbnailImage}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <button 
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                  onClick={(e) => {
                    e.preventDefault();
                    // Handle wishlist
                  }}
                >
                  <Heart className="h-5 w-5 text-gray-600" />
                </button>
                <div className="absolute bottom-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm">
                  {property.type}
                </div>
                {property.beachfront && (
                  <div className="absolute bottom-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                    Beachfront
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{property.title}</h3>
                    <p className="text-gray-600">{property.location}</p>
                  </div>
                  <p className="text-xl font-bold text-primary">{formatPrice(property.price)}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center text-gray-600">
                    <BedDouble className="h-5 w-5 mr-2" />
                    <span>{property.beds} beds</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Bath className="h-5 w-5 mr-2" />
                    <span>{property.baths} baths</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Ruler className="h-5 w-5 mr-2" />
                    <span>{property.sqft} sqft</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Home className="h-6 w-6 text-primary" />
                <span className="ml-2 text-xl font-bold">LuxuryEstates</span>
              </div>
              <p className="text-gray-400">Your trusted partner in finding the perfect luxury property.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-primary">About Us</a></li>
                <li><a href="#" className="hover:text-primary">Our Services</a></li>
                <li><a href="#" className="hover:text-primary">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Properties</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-primary">Buy Property</a></li>
                <li><a href="#" className="hover:text-primary">Sell Property</a></li>
                <li><a href="#" className="hover:text-primary">Rent Property</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
              <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates.</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 rounded-l-md w-full focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
                />
                <button className="bg-primary px-4 py-2 rounded-r-md hover:bg-primary/90">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;