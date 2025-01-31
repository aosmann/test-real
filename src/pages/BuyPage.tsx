import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Bath, BedDouble, Ruler, Heart, Search, MapPin, SlidersHorizontal } from 'lucide-react';
import { useProperties } from '../hooks/useProperties';
import { formatPrice } from '../utils/formatters';

function BuyPage() {
  const { properties } = useProperties();
  const [filters, setFilters] = React.useState({
    minPrice: '',
    maxPrice: '',
    beds: '',
    baths: '',
    propertyType: ''
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-3 h-6 w-6 text-gray-400" />
              <input
                type="text"
                placeholder="Enter location"
                className="w-full pl-12 pr-4 py-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 rounded-md hover:bg-gray-200">
              <SlidersHorizontal className="h-5 w-5" />
              Filters
            </button>
            <button className="bg-primary text-white px-8 py-3 rounded-md hover:bg-primary/90">
              Search
            </button>
          </div>
          
          {/* Filter Tags */}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">For Sale</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">All Property Types</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">Any Price</span>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {properties.length} Properties for Sale
          </h2>
        </div>

        {/* Property Grid */}
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
      </div>
    </div>
  );
}

export default BuyPage;