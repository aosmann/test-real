import { useState, useEffect } from 'react';
import { Property } from '../types';

const initialProperties: Property[] = [
  {
    id: 1,
    title: "Modern Waterfront Villa",
    price: 1250000,
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
    type: "Home",
    features: ["Ocean View", "Pool", "Modern Kitchen"],
    mapLocation: null,
    order: 0
  },
  {
    id: 2,
    title: "Luxury Downtown Penthouse",
    price: 2800000,
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
    type: "Home",
    features: ["City View", "Private Elevator", "Terrace"],
    mapLocation: null,
    order: 1
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

  const addProperty = (property: Omit<Property, 'id' | 'order'>) => {
    const newProperty = {
      ...property,
      id: Date.now(),
      order: -1 // Will be placed at the top
    };
    
    setProperties(prev => {
      const reordered = prev.map(p => ({
        ...p,
        order: p.order + 1
      }));
      return [newProperty, ...reordered].sort((a, b) => a.order - b.order);
    });
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

  const reorderProperties = (startIndex: number, endIndex: number) => {
    const result = Array.from(properties);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    
    const reordered = result.map((item, index) => ({
      ...item,
      order: index
    }));
    
    setProperties(reordered);
  };

  return {
    properties: properties.sort((a, b) => a.order - b.order),
    addProperty,
    updateProperty,
    deleteProperty,
    reorderProperties
  };
}