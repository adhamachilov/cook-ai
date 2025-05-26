-- Schema for CookAI application in Supabase

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  imageUrl TEXT,
  cookingTime INTEGER NOT NULL,
  servings INTEGER NOT NULL,
  calories INTEGER,
  ingredients JSONB NOT NULL, -- Store as JSON array
  instructions JSONB NOT NULL, -- Store as JSON array
  tags JSONB, -- Store as JSON array
  cuisineType TEXT,
  dietaryInfo JSONB, -- Store as JSON object with isVegetarian, isVegan, etc.
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_recipes_updated_at
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add an index on likes for better performance on popular recipes queries
CREATE INDEX IF NOT EXISTS idx_recipes_likes ON recipes (likes DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous read access
CREATE POLICY "Allow anonymous read access"
  ON recipes
  FOR SELECT
  TO anon
  USING (true);

-- Create policy to allow authenticated users to insert recipes
CREATE POLICY "Allow authenticated insert"
  ON recipes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policy to allow authenticated users to update recipes
CREATE POLICY "Allow authenticated update"
  ON recipes
  FOR UPDATE
  TO authenticated
  USING (true);

-- Optional: Create a view for popular recipes
CREATE OR REPLACE VIEW popular_recipes AS
  SELECT *
  FROM recipes
  ORDER BY likes DESC
  LIMIT 20;
