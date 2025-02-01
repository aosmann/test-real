import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { PropertyTypeItem } from '../types';

export function usePropertyTypes() {
  const [types, setTypes] = useState<PropertyTypeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTypes();
  }, []);

  async function fetchTypes() {
    try {
      const { data, error } = await supabase
        .from('property_types')
        .select('*')
        .order('order');

      if (error) throw error;
      setTypes(data || []);
    } catch (err) {
      console.error('Error fetching property types:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function addType(name: string) {
    try {
      const { data: maxOrderResult } = await supabase
        .from('property_types')
        .select('order')
        .order('order', { ascending: false })
        .limit(1);

      const newOrder = maxOrderResult?.[0]?.order + 1 || 0;

      const { data, error } = await supabase
        .from('property_types')
        .insert([{ name, order: newOrder }])
        .select()
        .single();

      if (error) throw error;
      setTypes(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error adding property type:', err);
      setError(err.message);
      throw err;
    }
  }

  async function updateType(id: string, name: string) {
    try {
      const { error } = await supabase
        .from('property_types')
        .update({ name })
        .eq('id', id);

      if (error) throw error;
      setTypes(prev =>
        prev.map(type =>
          type.id === id ? { ...type, name } : type
        )
      );
    } catch (err) {
      console.error('Error updating property type:', err);
      setError(err.message);
      throw err;
    }
  }

  async function deleteType(id: string) {
    try {
      const { error } = await supabase
        .from('property_types')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTypes(prev => prev.filter(type => type.id !== id));
    } catch (err) {
      console.error('Error deleting property type:', err);
      setError(err.message);
      throw err;
    }
  }

  async function reorderTypes(startIndex: number, endIndex: number) {
    const reordered = Array.from(types);
    const [removed] = reordered.splice(startIndex, 1);
    reordered.splice(endIndex, 0, removed);
    
    const updates = reordered.map((type, index) => ({
      id: type.id,
      order: index,
    }));

    try {
      for (const update of updates) {
        const { error } = await supabase
          .from('property_types')
          .update({ order: update.order })
          .eq('id', update.id);

        if (error) throw error;
      }
      
      setTypes(reordered);
    } catch (err) {
      console.error('Error reordering property types:', err);
      setError(err.message);
      throw err;
    }
  }

  return {
    types,
    loading,
    error,
    addType,
    updateType,
    deleteType,
    reorderTypes,
  };
}