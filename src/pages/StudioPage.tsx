import React, { useState, useEffect } from 'react';
import { Plus, X, Pencil, ImagePlus, GripVertical, Check, LogOut } from 'lucide-react';
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
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    thumbnail_image: '',
    beds: '',
    baths: '',
    sqft: '',
    location: '',
    parking: false,
    beachfront: false,
    type: '',
    map_location: null
  });
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

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const images = newImages.split('\n').filter(url => url.trim() !== '');
      
      const propertyData = {
        ...formData,
        images,
        features: selectedFeatures,
        price: Number(formData.price),
        beds: Number(formData.beds),
        baths: Number(formData.baths),
        sqft: Number(formData.sqft)
      };
      
      if (editingProperty) {
        await updateProperty({ ...propertyData, id: editingProperty.id });
      } else {
        await addProperty(propertyData);
      }
      
      setShowForm(false);
      setEditingProperty(null);
      setFormData({
        title: '',
        price: '',
        description: '',
        thumbnail_image: '',
        beds: '',
        baths: '',
        sqft: '',
        location: '',
        parking: false,
        beachfront: false,
        type: types[0]?.name || '',
        map_location: null
      });
      setNewImages('');
      setSelectedFeatures([]);
    } catch (error) {
      console.error('Error saving property:', error);
      alert('Failed to save property. Please try again.');
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = properties.findIndex(p => p.id === active.id);
      const newIndex = properties.findIndex(p => p.id === over.id);
      
      try {
        await reorderProperties(oldIndex, newIndex);
      } catch (error) {
        console.error('Error reordering properties:', error);
        alert('Failed to reorder properties. Please try again.');
      }
    }
  };

  const handleAddType = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addType(newTypeName);
      setNewTypeName('');
      setShowTypeForm(false);
    } catch (error) {
      console.error('Error adding property type:', error);
      alert('Failed to add property type. Please try again.');
    }
  };

  const handleUpdateType = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingType) {
        await updateType(editingType.id, newTypeName);
        setEditingType(null);
      }
      setNewTypeName('');
      setShowTypeForm(false);
    } catch (error) {
      console.error('Error updating property type:', error);
      alert('Failed to update property type. Please try again.');
    }
  };

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

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Sign Out */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Property Management Studio</h1>
              <p className="text-sm text-gray-600">Signed in as: {session.user.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Property Types Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Property Types</h2>
            <button
              onClick={() => {
                setShowTypeForm(true);
                setEditingType(null);
                setNewTypeName('');
              }}
              className="flex items-center px-3 py-1.5 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Type
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {types.map((type) => (
              <div key={type.id} className="flex items-center justify-between p-4 border-b border-gray-200 last:border-0">
                <span className="text-gray-900">{type.name}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingType(type);
                      setNewTypeName(type.name);
                      setShowTypeForm(true);
                    }}
                    className="p-1 text-gray-600 hover:text-primary"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteType(type.id)}
                    className="p-1 text-gray-600 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {types.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No property types yet. Add your first type to get started.
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-sm text-gray-500">Manage your property listings and types</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </button>
        </div>

        {/* Property List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={properties.map(p => p.id)}
              strategy={verticalListSortingStrategy}
            >
              {properties.map((property) => (
                <SortablePropertyCard
                  key={property.id}
                  property={property}
                  onEdit={setEditingProperty}
                  onDelete={deleteProperty}
                />
              ))}
            </SortableContext>
          </DndContext>

          {properties.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-500">No properties yet. Add your first property to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Property Type Form Modal */}
      {showTypeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingType ? 'Edit Property Type' : 'Add Property Type'}
                </h3>
                <button
                  onClick={() => {
                    setShowTypeForm(false);
                    setEditingType(null);
                    setNewTypeName('');
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={editingType ? handleUpdateType : handleAddType}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newTypeName}
                    onChange={(e) => setNewTypeName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    placeholder="Enter property type"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowTypeForm(false);
                      setEditingType(null);
                      setNewTypeName('');
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
                  >
                    {editingType ? 'Update Type' : 'Add Type'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Property Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingProperty ? 'Edit Property' : 'Add New Property'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingProperty(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form fields */}
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price</label>
                      <input
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Type</label>
                      <select
                        required
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      >
                        <option value="">Select type</option>
                        {types.map((type) => (
                          <option key={type.id} value={type.name}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Thumbnail Image URL</label>
                    <input
                      type="url"
                      required
                      value={formData.thumbnail_image}
                      onChange={(e) => setFormData({ ...formData, thumbnail_image: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Additional Images URLs</label>
                    <p className="text-sm text-gray-500 mb-2">One URL per line</p>
                    <textarea
                      value={newImages}
                      onChange={(e) => setNewImages(e.target.value)}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Beds</label>
                      <input
                        type="number"
                        required
                        value={formData.beds}
                        onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Baths</label>
                      <input
                        type="number"
                        required
                        value={formData.baths}
                        onChange={(e) => setFormData({ ...formData, baths: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Square Feet</label>
                      <input
                        type="number"
                        required
                        value={formData.sqft}
                        onChange={(e) => setFormData({ ...formData, sqft: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.parking}
                          onChange={(e) => setFormData({ ...formData, parking: e.target.checked })}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="ml-2 text-sm text-gray-700">Parking Available</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.beachfront}
                          onChange={(e) => setFormData({ ...formData, beachfront: e.target.checked })}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="ml-2 text-sm text-gray-700">Beachfront Property</span>
                      </label>
                    </div>
                  </div>

                  {/* Optional Map Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Map Location (Optional)
                    </label>
                    <MapPicker
                      location={formData.map_location}
                      onChange={(location) => setFormData({ ...formData, map_location: location })}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingProperty(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
                  >
                    {editingProperty ? 'Save Changes' : 'Add Property'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudioPage;