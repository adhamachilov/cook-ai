import { Recipe } from '../types';
import { generateUUID } from '../utils/uuid';

// Store a newly generated recipe in Supabase
export const storeGeneratedRecipe = async (recipe: Recipe): Promise<boolean> => {
  // Add detailed debugging
  console.log('STORAGE: Storing recipe in database...', {
    id: recipe.id,
    title: recipe.title,
    likes: recipe.likes || 0
  });
  try {
    // First check if a similar recipe already exists in the database
    console.log('Checking for duplicate recipes before saving...');
    
    // Check for recipes with the same title
    const checkResponse = await fetch(`https://jcswgbrzelleyxfeckhr.supabase.co/rest/v1/recipes?title=ilike.${encodeURIComponent(recipe.title.trim().replace(/\s+/g, '%20'))}`, {
      method: 'GET',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjc3dnYnJ6ZWxsZXl4ZmVja2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNzE3NDQsImV4cCI6MjA2Mzc0Nzc0NH0.EnBiPpGWrWKumER7eeFV3LAIyGQ0jzWEUq9KXzUCLA0',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjc3dnYnJ6ZWxsZXl4ZmVja2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNzE3NDQsImV4cCI6MjA2Mzc0Nzc0NH0.EnBiPpGWrWKumER7eeFV3LAIyGQ0jzWEUq9KXzUCLA0'
      }
    });
    
    const existingRecipes = await checkResponse.json();
    
    if (existingRecipes && existingRecipes.length > 0) {
      // We found a similar recipe - don't add a duplicate
      console.log(`DUPLICATE FOUND: Recipe "${recipe.title}" already exists in the database!`);
      console.log('Existing recipe:', existingRecipes[0]);
      return true; // Return true to indicate "success" (we avoided a duplicate)
    }
    
    console.log('No duplicates found, storing recipe in Supabase:', recipe.id, recipe.title);
    
    // Direct API call to Supabase to store the recipe
    const response = await fetch('https://jcswgbrzelleyxfeckhr.supabase.co/rest/v1/recipes', {
      method: 'POST',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjc3dnYnJ6ZWxsZXl4ZmVja2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNzE3NDQsImV4cCI6MjA2Mzc0Nzc0NH0.EnBiPpGWrWKumER7eeFV3LAIyGQ0jzWEUq9KXzUCLA0',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjc3dnYnJ6ZWxsZXl4ZmVja2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNzE3NDQsImV4cCI6MjA2Mzc0Nzc0NH0.EnBiPpGWrWKumER7eeFV3LAIyGQ0jzWEUq9KXzUCLA0',
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        // Always use proper UUID format for Supabase
        id: recipe.id && recipe.id.includes('-') ? recipe.id : generateUUID(),
        title: recipe.title || 'Untitled Recipe',
        description: recipe.description || '',
        imageUrl: recipe.imageUrl || '',
        // Convert camelCase fields to snake_case for database compatibility
        cooking_time: recipe.cookingTime || 0,
        servings: recipe.servings || 0,
        calories: recipe.calories || 0,
        ingredients: typeof recipe.ingredients === 'string' ? recipe.ingredients : JSON.stringify(recipe.ingredients || []),
        instructions: typeof recipe.instructions === 'string' ? recipe.instructions : JSON.stringify(recipe.instructions || []),
        tags: typeof recipe.tags === 'string' ? recipe.tags : JSON.stringify(recipe.tags || []),
        cuisine_type: recipe.cuisineType || '',
        dietary_info: typeof recipe.dietaryInfo === 'object' ? JSON.stringify(recipe.dietaryInfo || {}) : recipe.dietaryInfo,
        likes: recipe.likes || 0, // Start with 0 likes as requested
        created_at: new Date().toISOString()
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error storing recipe:', errorText);
      return false;
    }
    
    console.log('Recipe stored successfully:', recipe.id);
    return true;
  } catch (error) {
    console.error('Exception storing recipe:', error);
    return false;
  }
};

// Store multiple recipes at once
export const storeGeneratedRecipes = async (recipes: Recipe[]): Promise<number> => {
  let successCount = 0;
  
  // Store each recipe one by one
  for (const recipe of recipes) {
    try {
      const success = await storeGeneratedRecipe(recipe);
      if (success) {
        successCount++;
      }
    } catch (error) {
      console.error(`Error storing recipe ${recipe.id}:`, error);
    }
  }
  
  console.log(`Successfully stored ${successCount} of ${recipes.length} recipes`);
  return successCount;
};
