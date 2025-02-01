/*
  # Initial Schema Setup for Real Estate Application

  1. New Tables
    - `property_types`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `order` (integer)
      - `created_at` (timestamp)

    - `properties`
      - `id` (uuid, primary key)
      - `title` (text)
      - `price` (numeric)
      - `description` (text)
      - `thumbnail_image` (text)
      - `images` (text array)
      - `beds` (integer)
      - `baths` (numeric)
      - `sqft` (numeric)
      - `location` (text)
      - `parking` (boolean)
      - `beachfront` (boolean)
      - `type` (text, references property_types)
      - `features` (text array)
      - `map_location` (jsonb)
      - `order` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read all properties
    - Add policies for studio users to manage properties
*/

-- Create property_types table
CREATE TABLE IF NOT EXISTS property_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  price numeric NOT NULL,
  description text,
  thumbnail_image text NOT NULL,
  images text[] DEFAULT '{}',
  beds integer NOT NULL,
  baths numeric NOT NULL,
  sqft numeric NOT NULL,
  location text NOT NULL,
  parking boolean DEFAULT false,
  beachfront boolean DEFAULT false,
  type text REFERENCES property_types(name) ON UPDATE CASCADE,
  features text[] DEFAULT '{}',
  map_location jsonb,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE property_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Policies for property_types
CREATE POLICY "Anyone can read property types"
  ON property_types
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Studio users can manage property types"
  ON property_types
  USING (auth.role() = 'authenticated');

-- Policies for properties
CREATE POLICY "Anyone can read properties"
  ON properties
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Studio users can manage properties"
  ON properties
  USING (auth.role() = 'authenticated');

-- Insert initial property types
INSERT INTO property_types (name, "order") VALUES
  ('Home', 0),
  ('Land', 1)
ON CONFLICT (name) DO NOTHING;