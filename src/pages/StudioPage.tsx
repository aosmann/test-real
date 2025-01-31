import React, { useState } from 'react';
import { Plus, X, Pencil, ImagePlus, GripVertical } from 'lucide-react';
import { Property, PropertyType } from '../types';
import { useProperties } from '../hooks/useProperties';
import { usePropertyTypes } from '../hooks/usePropertyTypes';
import MapPicker from '../components/MapPicker';
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
            src={property.thumbnailImage}
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
  const { properties, addProperty, updateProperty, deleteProperty, reorderProperties } = useProperties();
  const { types, addType, updateType, deleteType, reorderTypes } = usePropertyTypes();
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [showTypeForm, setShowTypeForm] = useState(false);
  const [editingType, setEditingType] = useState<{ id: number; name: string } | null>(null);
  const [newTypeName, setNewTypeName] = useState('');
  const [newImages, setNewImages] = useState<string>('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const initialPropertyState = {
    id: 0,
    title: '',
    price: 0,
    thumbnailImage: '',
    images: [],
    beds: 0,
    baths: 0,
    sqft: 0,
    location: '',
    parking: false,
    beachfront: false,
    type: types[0]?.name || 'Home',
    features: [],
    mapLocation: null,
    order: 0
  };

  const [formData, setFormData] = useState<Property>(initialPropertyState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewImages(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const images = newImages.split('\n').filter(url => url.trim() !== '');
    
    const propertyData = {
      ...formData,
      images,
      features: selectedFeatures
    };
    
    if (editingProperty) {
      updateProperty(propertyData);
    } else {
      addProperty(propertyData);
    }
    
    setShowForm(false);
    setEditingProperty(null);
    setFormData(initialPropertyState);
    setNewImages('');
    setSelectedFeatures([]);
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData(property);
    setNewImages(property.images.join('\n'));
    setSelectedFeatures(property.features || []);
    setShowForm(true);
  };

  const handleTypeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingType) {
      updateType(editingType.id, newTypeName);
    } else {
      addType(newTypeName);
    }
    setShowTypeForm(false);
    setEditingType(null);
    setNewTypeName('');
  };

  const handleAddFeature = () => {
    if (newFeature && !selectedFeatures.includes(newFeature)) {
      setSelectedFeatures(prev => [...prev, newFeature]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (feature: string) => {
    setSelectedFeatures(prev => prev.filter(f => f !== feature));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = properties.findIndex(p => p.id === active.id);
      const newIndex = properties.findIndex(p => p.id === over.id);
      reorderProperties(oldIndex, newIndex);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Property Management</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your property listings and types</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </button>
      </div>

      <div className="grid grid-cols-4 gap-8">
        {/* Property Types Sidebar */}
        <div className="col-span-1">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Property Types</h2>
              <button
                onClick={() => setShowTypeForm(true)}
                className="p-1 text-primary hover:text-primary/80"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 space-y-2">
              {types.map(type => (
                <div key={type.id} className="flex items-center justify-between py-2">
                  <span>{type.name}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingType(type);
                        setNewTypeName(type.name);
                        setShowTypeForm(true);
                      }}
                      className="text-gray-600 hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteType(type.id)}
                      className="text-gray-600 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Properties List */}
        <div className="col-span-3">
          <div className="bg-white rounded-lg shadow">
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
                    onEdit={handleEdit}
                    onDelete={deleteProperty}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </div>

      {/* Add/Edit Property Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingProperty ? 'Edit Property' : 'Add New Property'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingProperty(null);
                  setFormData(initialPropertyState);
                  setNewImages('');
                  setSelectedFeatures([]);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    {types.map(type => (
                      <option key={type.id} value={type.name}>{type.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Image URL</label>
                  <input
                    type="url"
                    name="thumbnailImage"
                    value={formData.thumbnailImage}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Square Feet</label>
                  <input
                    type="number"
                    name="sqft"
                    value={formData.sqft}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    name="beds"
                    value={formData.beds}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                  <input
                    type="number"
                    name="baths"
                    value={formData.baths}
                    onChange={handleInputChange}
                    step="0.5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="parking"
                    checked={formData.parking}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                  />
                  <span className="ml-2 text-sm text-gray-700">Parking Available</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="beachfront"
                    checked={formData.beachfront}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                  />
                  <span className="ml-2 text-sm text-gray-700">Beachfront Property</span>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Images (one URL per line)
                </label>
                <textarea
                  value={newImages}
                  onChange={handleImagesChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary h-32"
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Add a feature (e.g., Pool, Ocean View)"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedFeatures.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(feature)}
                        className="ml-2 text-gray-500 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location on Map</label>
                <MapPicker
                  location={formData.mapLocation}
                  onChange={(location) => setFormData(prev => ({ ...prev, mapLocation: location }))}
                />
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProperty(null);
                    setFormData(initialPropertyState);
                    setNewImages('');
                    setSelectedFeatures([]);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
                >
                  {editingProperty ? 'Update Property' : 'Add Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Property Type Modal */}
      {showTypeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingType ? 'Edit Property Type' : 'Add New Property Type'}
              </h3>
              <button
                onClick={() => {
                  setShowTypeForm(false);
                  setEditingType(null);
                  setNewTypeName('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleTypeSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type Name
                </label>
                <input
                  type="text"
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowTypeForm(false);
                    setEditingType(null);
                    setNewTypeName('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
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
      )}
    </div>
  );
}

export default StudioPage;