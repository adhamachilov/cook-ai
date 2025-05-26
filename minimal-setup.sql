-- Minimal setup for Cook-AI Supabase project
-- Just creates the recipes table and enables basic access

-- Create recipes table with all needed fields
CREATE TABLE IF NOT EXISTS public.recipes (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    cookTime INTEGER,
    calories INTEGER,
    servings INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- Simple policies - allow everything
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'recipes' AND policyname = 'Allow full access'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow full access" ON public.recipes USING (true) WITH CHECK (true)';
  END IF;
END $$;

-- Create index for popular recipes
CREATE INDEX IF NOT EXISTS recipes_likes_idx ON public.recipes (likes DESC);
