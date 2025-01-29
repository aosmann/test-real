export type PropertyType = 'Home' | 'Land';

export interface Property {
  id: number;
  title: string;
  price: string;
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
}