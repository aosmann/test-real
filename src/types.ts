export type PropertyType = string;

export interface Property {
  id: string;  // Changed from number to string (UUID)
  title: string;
  price: number;
  description: string;
  thumbnail_image: string;  // Changed from camelCase to snake_case
  images: string[];
  beds: number;
  baths: number;
  sqft: number;
  location: string;
  parking: boolean;
  beachfront: boolean;
  type: PropertyType;
  features: string[];
  map_location: {  // Changed from camelCase to snake_case
    lat: number;
    lng: number;
    address: string;
  } | null;
  order: number;
  created_at?: string;  // Added to match database
}

export interface PropertyTypeItem {
  id: string;  // Changed from number to string (UUID)
  name: string;
  order: number;
  created_at?: string;  // Added to match database
}