-- Add missing columns to recipes table with ALL recipe details
ALTER TABLE public.recipes ADD COLUMN IF NOT EXISTS cookingTime INTEGER;
ALTER TABLE public.recipes ADD COLUMN IF NOT EXISTS calories INTEGER;
ALTER TABLE public.recipes ADD COLUMN IF NOT EXISTS servings INTEGER;
ALTER TABLE public.recipes ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.recipes ADD COLUMN IF NOT EXISTS cuisineType TEXT;
ALTER TABLE public.recipes ADD COLUMN IF NOT EXISTS tags TEXT;
ALTER TABLE public.recipes ADD COLUMN IF NOT EXISTS dietaryInfo TEXT;
