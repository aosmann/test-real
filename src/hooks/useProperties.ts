import { useState, useEffect } from 'react';
import { Property } from '../types';

const initialProperties: Property[] = [
  {
    id: 1,
    title: "Modern Waterfront Villa",
    price: "$1,250,000",
    description: "Stunning waterfront villa with panoramic ocean views. This modern masterpiece features an open floor plan, high-end finishes, and direct beach access.",
    thumbnailImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80"
    ],
    beds: 4,
    baths: 3,
    sqft: 3200,
    location: "Miami Beach, FL",
    parking: true,
    beachfront: true,
    type: "Home"
  },
  {
    id: 2,
    title: "Luxury Downtown Penthouse",
    price: "$2,800,000",
    description: "Spectacular penthouse in the heart of the city. Floor-to-ceiling windows offer breathtaking city views. Features include a gourmet kitchen, private elevator, and wraparound terrace.",
    thumbnailImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80"
    ],
    beds: 3,
    baths: 2.5,
    sqft: 2800,
    location: "Manhattan, NY",
    parking: true,
    beachfront: false,
    type: "Home"
  }
];

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('properties');
    return saved ? JSON.parse(saved) : initialProperties;
  });

  useEffect(() => {
    localStorage.setItem('properties', JSON.stringify(properties));
  }, [properties]);

  const addProperty = (property: Property) => {
    setProperties(prev => [...prev, property]);
  };

  const updateProperty = (updatedProperty: Property) => {
    setProperties(prev =>
      prev.map(property =>
        property.id === updatedProperty.id ? updatedProperty : property
      )
    );
  };

  const deleteProperty = (id: number) => {
    setProperties(prev => prev.filter(property => property.id !== id));
  };

  return {
    properties,
    addProperty,
    updateProperty,
    deleteProperty
  };
}