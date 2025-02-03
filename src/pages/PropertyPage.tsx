import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Home, Bath, BedDouble, Ruler, Car, Waves, X, Plus, ArrowLeft, Share2, Heart, Check } from 'lucide-react';
import { useProperties } from '../hooks/useProperties';
import { formatPrice } from '../utils/formatters';
import ImageViewer from '../components/ImageViewer';

function PropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { properties } = useProperties();
  const property = properties.find(p => p.id === id);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <Link to="/" className="text-primary hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  const mainImage = property.images[0] || property.thumbnailImage;
  const additionalImages = property.images.slice(1);
  const hasMoreImages = property.images.length > 5;

  const handleShare = async () => {
    try {
      await navigator.share({
        title: property.title,
        text: `Check out this property: ${property.title}`,
        url: window.location.href
      });
    } catch (error) {
      console.log('Sharing failed', error);
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    alert('Thank you for your interest! We will contact you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button and Title */}
      <div className="space-y-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-primary"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-xl text-gray-600">
            {property.type} for Sale in {property.location}
          </h1>
          <div className="flex items-center space-x-4">
            <button
              className="flex items-center text-gray-600 hover:text-primary"
              onClick={() => console.log('Added to favorites')}
            >
              <Heart className="h-5 w-5 mr-2" />
              Save
            </button>
            <button
              className="flex items-center text-gray-600 hover:text-primary"
              onClick={handleShare}
            >
              <Share2 className="h-5 w-5 mr-2" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div 
          className="relative h-[400px] cursor-pointer"
          onClick={() => setSelectedImageIndex(0)}
        >
          <img
            src={mainImage}
            alt={property.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {additionalImages.slice(0, 4).map((image, index) => (
            <div 
              key={index}
              className="relative h-[190px] cursor-pointer"
              onClick={() => setSelectedImageIndex(index + 1)}
            >
              <img
                src={image}
                alt={`${property.title} ${index + 2}`}
                className="w-full h-full object-cover rounded-lg"
              />
              {index === 3 && hasMoreImages && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                  <div className="text-white text-center">
                    <Plus className="h-8 w-8 mx-auto mb-2" />
                    <span className="text-lg font-semibold">
                      {property.images.length - 5} more
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Property Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                <p className="text-xl text-primary font-semibold">{formatPrice(property.price)}</p>
                <p className="text-gray-600">{property.location}</p>
              </div>
              <div className="flex space-x-2">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  {property.type}
                </span>
                {property.beachfront && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Beachfront
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 py-6 border-y border-gray-200">
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
              {property.parking && (
                <div className="flex items-center text-gray-600">
                  <Car className="h-5 w-5 mr-2" />
                  <span>Parking</span>
                </div>
              )}
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed">{property.description}</p>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
              <ul className="grid grid-cols-2 gap-4">
                {property.parking && (
                  <li className="flex items-center text-gray-600">
                    <Car className="h-5 w-5 mr-2" />
                    <span>Parking Available</span>
                  </li>
                )}
                {property.beachfront && (
                  <li className="flex items-center text-gray-600">
                    <Waves className="h-5 w-5 mr-2" />
                    <span>Beachfront Property</span>
                  </li>
                )}
                {property.features?.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <Check className="h-5 w-5 mr-2 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Interested in this property?</h2>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
              >
                Contact Agent
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Image Viewer Modal */}
      {selectedImageIndex !== null && (
        <ImageViewer
          images={property.images}
          initialIndex={selectedImageIndex}
          onClose={() => setSelectedImageIndex(null)}
        />
      )}
    </div>
  );
}

export default PropertyPage;