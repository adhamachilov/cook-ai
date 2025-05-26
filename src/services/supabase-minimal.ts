import { createClient } from '@supabase/supabase-js';
import { generateUUID } from '../utils/uuid';

// New Cook-AI project configuration
const supabaseUrl = 'https://jcswgbrzelleyxfeckhr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjc3dnYnJ6ZWxsZXl4ZmVja2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNzE3NDQsImV4cCI6MjA2Mzc0Nzc0NH0.EnBiPpGWrWKumER7eeFV3LAIyGQ0jzWEUq9KXzUCLA0';

// Create the most minimal Supabase client possible
export const supabase = createClient(supabaseUrl, supabaseKey);

// Insert a test recipe directly to verify database connection
export const insertTestRecipe = async () => {
  try {
    // Create a test recipe with a proper UUID format for Supabase
    const testId = generateUUID();
    const testRecipe = {
      id: testId,
      title: `Test Recipe ${new Date().toLocaleTimeString()}`,
      ingredients: JSON.stringify(['Test ingredient 1', 'Test ingredient 2']),
      instructions: JSON.stringify(['Step 1: Mix ingredients', 'Step 2: Cook until done']),
      likes: 999, // Very high to make sure it shows up
      cookTime: 25, // 25 minutes to cook
      calories: 350, // 350 calories per serving
      servings: 4 // Serves 4 people
    };
    
    console.log('Attempting to insert test recipe:', testRecipe);
    
    const { data, error } = await supabase
      .from('recipes')
      .insert([testRecipe])
      .select();
      
    if (error) {
      console.error('Error inserting test recipe:', error);
      return { success: false, error };
    }
    
    console.log('Successfully inserted test recipe:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error inserting test recipe:', error);
    return { success: false, error };
  }
};

// Simple functions for working with recipes
export const getRecipes = async () => {
  try {
    // Use console logging to debug the query
    console.log('Fetching recipes from Supabase...');
    
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false }) // Sort by newest first
      .limit(100); // Get up to 100 recipes to make sure we don't miss any
      
    console.log('Supabase query results (raw):', data);
      
    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }
    
    // SIMPLE APPROACH: Just return whatever we get from the database
    // We'll handle display in the UI components
    if (!data || data.length === 0) {
      console.log('No recipes found in database');
      return [];
    }
    
    // Create minimal recipe objects with required fields for the UI
    const simplifiedRecipes = data.map(recipe => {
      // Make sure the recipe has the minimum fields needed for RecipeCard
      return {
        id: recipe.id,
        title: recipe.title || 'Untitled Recipe',
        likes: recipe.likes || 0,
        ingredients: recipe.ingredients ? 
          (typeof recipe.ingredients === 'string' ? JSON.parse(recipe.ingredients) : recipe.ingredients) : 
          [],
        instructions: recipe.instructions ? 
          (typeof recipe.instructions === 'string' ? JSON.parse(recipe.instructions) : recipe.instructions) : 
          [],
        // Default values for fields that might be missing
        cookingTime: recipe.cookingTime || 30,
        calories: recipe.calories || 400,
        servings: recipe.servings || 4,
        description: recipe.description || '',
        imageUrl: '',
        tags: [],
        cuisineType: '',
        dietaryInfo: {
          isVegetarian: false,
          isVegan: false,
          isGlutenFree: false,
          isDairyFree: false
        }
      };
    });
    
    console.log('Simplified recipes for UI:', simplifiedRecipes);
    return simplifiedRecipes;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
};

export const saveRecipe = async (recipe: any) => {
  try {
    // Enhanced recipe format with all card details
    const formattedRecipe = {
      id: recipe.id || generateUUID(), // Ensure we have a valid UUID
      title: recipe.title || 'Untitled Recipe',
      ingredients: typeof recipe.ingredients === 'string' ? recipe.ingredients : JSON.stringify(recipe.ingredients || []),
      instructions: typeof recipe.instructions === 'string' ? recipe.instructions : JSON.stringify(recipe.instructions || []),
      likes: 999, // High likes to ensure visibility
      cookingTime: recipe.cookingTime || 30, // Default 30 minutes if not specified
      calories: recipe.calories || 400, // Default 400 calories if not specified
      servings: recipe.servings || 4 // Default 4 servings if not specified
    };
    
    const { error } = await supabase
      .from('recipes')
      .upsert([formattedRecipe]);
      
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error saving recipe:', error);
    return false;
  }
};
