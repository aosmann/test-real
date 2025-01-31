export type PropertyType = string;

export interface Property {
  id: number;
  title: string;
  price: number;
  description: string;
  thumbnailImage: string;
  images: string[];
  beds: number;
  baths: number;
  sqft: number;
  location: string;
  parking: boolean;
  beachfront: boolean;
  type: PropertyType;
  features: string[];
  mapLocation: {
    lat: number;
    lng: number;
    address: string;
  } | null;
  order: number;
}

export interface PropertyTypeItem {
  id: number;
  name: string;
  order: number;
}