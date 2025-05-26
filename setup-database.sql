-- Create recipes table (if it doesn't exist yet)
CREATE TABLE IF NOT EXISTS public.recipes (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (safe to run multiple times)
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- Check if policies exist and create only if they don't
DO $$
BEGIN
    -- Check if read policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'recipes' AND policyname = 'Allow anonymous read access'
    ) THEN
        -- Create read policy
        EXECUTE 'CREATE POLICY "Allow anonymous read access" ON public.recipes FOR SELECT USING (true)';
    END IF;
    
    -- Check if insert policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'recipes' AND policyname = 'Allow anonymous insert access'
    ) THEN
        -- Create insert policy
        EXECUTE 'CREATE POLICY "Allow anonymous insert access" ON public.recipes FOR INSERT WITH CHECK (true)';
    END IF;
    
    -- Check if update policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'recipes' AND policyname = 'Allow anonymous update access'
    ) THEN
        -- Create update policy
        EXECUTE 'CREATE POLICY "Allow anonymous update access" ON public.recipes FOR UPDATE USING (true) WITH CHECK (true)';
    END IF;
END;
$$;

-- Create indices (safe to run multiple times)
CREATE INDEX IF NOT EXISTS recipes_likes_idx ON public.recipes (likes DESC);
CREATE INDEX IF NOT EXISTS recipes_created_at_idx ON public.recipes (created_at DESC);
