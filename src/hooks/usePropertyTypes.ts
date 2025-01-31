import { useState, useEffect } from 'react';
import { PropertyTypeItem } from '../types';

export function usePropertyTypes() {
  const [types, setTypes] = useState<PropertyTypeItem[]>(() => {
    const saved = localStorage.getItem('propertyTypes');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Home', order: 0 },
      { id: 2, name: 'Land', order: 1 }
    ];
  });

  useEffect(() => {
    localStorage.setItem('propertyTypes', JSON.stringify(types));
  }, [types]);

  const addType = (name: string) => {
    const newType = {
      id: Date.now(),
      name,
      order: types.length
    };
    setTypes(prev => [...prev, newType]);
  };

  const updateType = (id: number, name: string) => {
    setTypes(prev =>
      prev.map(type =>
        type.id === id ? { ...type, name } : type
      )
    );
  };

  const deleteType = (id: number) => {
    setTypes(prev => prev.filter(type => type.id !== id));
  };

  const reorderTypes = (startIndex: number, endIndex: number) => {
    const result = Array.from(types);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    
    const reordered = result.map((item, index) => ({
      ...item,
      order: index
    }));
    
    setTypes(reordered);
  };

  return {
    types: types.sort((a, b) => a.order - b.order),
    addType,
    updateType,
    deleteType,
    reorderTypes
  };
}