import React, { useState, useEffect } from 'react';
import { Plus, X, Pencil, ImagePlus, GripVertical, Check } from 'lucide-react';
import { Property, PropertyTypeItem } from '../types';
import { useProperties } from '../hooks/useProperties';
import { usePropertyTypes } from '../hooks/usePropertyTypes';
import MapPicker from '../components/MapPicker';
import Auth from '../components/Auth';
import { supabase } from '../lib/supabase';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortablePropertyCard({ property, onEdit, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: property.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-white p-6 border-b border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex space-x-6">
          <div {...attributes} {...listeners} className="cursor-grab">
            <GripVertical className="h-6 w-6 text-gray-400" />
          </div>
          <img
            src={property.thumbnail_image}
            alt={property.title}
            className="w-32 h-32 object-cover rounded-lg"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
            <p className="text-gray-600">{property.location}</p>
            <p className="text-primary font-semibold mt-1">${property.price.toLocaleString()}</p>
            <div className="mt-2 space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {property.type}
              </span>
              {property.beachfront && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Beachfront
                </span>
              )}
              {property.parking && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Parking
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(property)}
            className="p-2 text-gray-600 hover:text-primary"
          >
            <Pencil className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(property.id)}
            className="p-2 text-gray-600 hover:text-red-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function StudioPage() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const { properties, addProperty, updateProperty, deleteProperty, reorderProperties } = useProperties();
  const { types, addType, updateType, deleteType, reorderTypes } = usePropertyTypes();
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [showTypeForm, setShowTypeForm] = useState(false);
  const [editingType, setEditingType] = useState<{ id: string; name: string } | null>(null);
  const [newTypeName, setNewTypeName] = useState('');
  const [newImages, setNewImages] = useState<string>('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show auth form
  if (!session) {
    return <Auth />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Keep your existing JSX for the studio page */}
    </div>
  );
}

export default StudioPage;