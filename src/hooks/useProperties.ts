import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Property } from '../types';

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('order');

      if (error) throw error;
      setProperties(data || []);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function addProperty(property: Omit<Property, 'id' | 'order' | 'created_at'>) {
    try {
      const { data: maxOrderResult } = await supabase
        .from('properties')
        .select('order')
        .order('order', { ascending: false })
        .limit(1);

      const newOrder = maxOrderResult?.[0]?.order + 1 || 0;

      // Convert camelCase to snake_case for database
      const propertyData = {
        ...property,
        thumbnail_image: property.thumbnail_image,
        map_location: property.map_location,
        order: newOrder
      };

      const { data, error } = await supabase
        .from('properties')
        .insert([propertyData])
        .select()
        .single();

      if (error) throw error;
      setProperties(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error adding property:', err);
      setError(err.message);
      throw err;
    }
  }

  async function updateProperty(updatedProperty: Property) {
    try {
      // Convert camelCase to snake_case for database
      const propertyData = {
        ...updatedProperty,
        thumbnail_image: updatedProperty.thumbnail_image,
        map_location: updatedProperty.map_location
      };

      const { error } = await supabase
        .from('properties')
        .update(propertyData)
        .eq('id', updatedProperty.id);

      if (error) throw error;
      setProperties(prev =>
        prev.map(property =>
          property.id === updatedProperty.id ? updatedProperty : property
        )
      );
    } catch (err) {
      console.error('Error updating property:', err);
      setError(err.message);
      throw err;
    }
  }

  async function deleteProperty(id: string) {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProperties(prev => prev.filter(property => property.id !== id));
    } catch (err) {
      console.error('Error deleting property:', err);
      setError(err.message);
      throw err;
    }
  }

  async function reorderProperties(startIndex: number, endIndex: number) {
    const reordered = Array.from(properties);
    const [removed] = reordered.splice(startIndex, 1);
    reordered.splice(endIndex, 0, removed);
    
    const updates = reordered.map((property, index) => ({
      id: property.id,
      order: index,
    }));

    try {
      for (const update of updates) {
        const { error } = await supabase
          .from('properties')
          .update({ order: update.order })
          .eq('id', update.id);

        if (error) throw error;
      }
      
      setProperties(reordered);
    } catch (err) {
      console.error('Error reordering properties:', err);
      setError(err.message);
      throw err;
    }
  }

  return {
    properties,
    loading,
    error,
    addProperty,
    updateProperty,
    deleteProperty,
    reorderProperties,
  };
}