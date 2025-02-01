import React from 'react';
import { MapPin } from 'lucide-react';

interface MapPickerProps {
  location: { lat: number; lng: number; address: string } | null;
  onChange: (location: { lat: number; lng: number; address: string } | null) => void;
}

function MapPicker({ location, onChange }: MapPickerProps) {
  const [address, setAddress] = React.useState(location?.address || '');

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const data = await response.json();
      if (data && data[0]) {
        onChange({
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          address: data[0].display_name,
        });
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter property address"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Set Location
        </button>
      </div>
      
      {location && (
        <div className="aspect-video relative rounded-lg overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lng-0.01},${location.lat-0.01},${location.lng+0.01},${location.lat+0.01}&layer=mapnik&marker=${location.lat},${location.lng}`}
          />
        </div>
      )}
    </div>
  );
}

export default MapPicker;