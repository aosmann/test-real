export type PropertyType = string;

export interface Property {
  id: string;
  title: string;
  price: number;
  description: string;
  thumbnail_image: string;
  images: string[];
  beds: number;
  baths: number;
  sqft: number;
  location: string;
  parking: boolean;
  beachfront: boolean;
  type: PropertyType;
  features: string[];
  map_location: {
    lat: number;
    lng: number;
    address: string;
  } | null;
  order: number;
  created_at?: string;
}

export interface PropertyTypeItem {
  id: string;
  name: string;
  order: number;
  created_at?: string;
}