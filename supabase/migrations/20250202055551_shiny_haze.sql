/*
  # Fix Row Level Security Policies

  1. Changes
    - Update RLS policies for properties table to allow proper access
    - Update RLS policies for property_types table
    - Add proper authentication checks

  2. Security
    - Enable RLS on both tables
    - Allow public read access
    - Allow authenticated users to manage properties and types
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read properties" ON properties;
DROP POLICY IF EXISTS "Studio users can manage properties" ON properties;
DROP POLICY IF EXISTS "Anyone can read property types" ON property_types;
DROP POLICY IF EXISTS "Studio users can manage property types" ON property_types;

-- Properties policies
CREATE POLICY "Enable read access for all users"
  ON properties
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON properties
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
  ON properties
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users"
  ON properties
  FOR DELETE
  TO authenticated
  USING (true);

-- Property types policies
CREATE POLICY "Enable read access for all users"
  ON property_types
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON property_types
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
  ON property_types
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users"
  ON property_types
  FOR DELETE
  TO authenticated
  USING (true);