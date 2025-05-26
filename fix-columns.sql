-- Fix the table structure to ensure consistent column naming
-- This script makes sure all needed columns exist with the correct names

-- First, drop any inconsistent columns if they exist (only if they're empty)
ALTER TABLE public.recipes DROP COLUMN IF EXISTS cookTime;

-- Now add the columns with the correct names that match the Recipe interface
ALTER TABLE public.recipes ADD COLUMN IF NOT EXISTS cookingTime INTEGER;
ALTER TABLE public.recipes ADD COLUMN IF NOT EXISTS calories INTEGER;
ALTER TABLE public.recipes ADD COLUMN IF NOT EXISTS servings INTEGER;
ALTER TABLE public.recipes ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.recipes ADD COLUMN IF NOT EXISTS cuisineType TEXT;
ALTER TABLE public.recipes ADD COLUMN IF NOT EXISTS tags TEXT;
ALTER TABLE public.recipes ADD COLUMN IF NOT EXISTS dietaryInfo TEXT;

-- Make sure the RLS policy exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'recipes' AND policyname = 'Allow full access'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow full access" ON public.recipes USING (true) WITH CHECK (true)';
  END IF;
END $$;
