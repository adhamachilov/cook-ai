import { createClient } from '@supabase/supabase-js';

// New Supabase Cook-AI project configuration (confirmed working)
const supabaseUrl = 'https://jcswgbrzelleyxfeckhr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjc3dnYnJ6ZWxsZXl4ZmVja2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNzE3NDQsImV4cCI6MjA2Mzc0Nzc0NH0.EnBiPpGWrWKumER7eeFV3LAIyGQ0jzWEUq9KXzUCLA0';

// Create Supabase client with additional options for better compatibility
const options = {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  }
};

// Export supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, options);

// Test connection and log result
try {
  // Run this code asynchronously to test the connection
  (async () => {
    try {
      const { data, error } = await supabase.from('recipes').select('count', { count: 'exact' });
      
      if (error) {
        console.error('Supabase connection test failed:', error);
      } else {
        console.log('Supabase connection test successful:', data);
      }
    } catch (err) {
      console.error('Supabase connection test error:', err);
    }
  })();
} catch (err) {
  console.error('Error setting up Supabase test:', err);
}

// Helper function to store a recipe in Supabase
export const storeRecipe = async (recipe: any) => {
  try {
    console.log('Storing recipe:', recipe);
    
    // Format the recipe to match our simplified Supabase schema
    const formattedRecipe = {
      id: recipe.id,
      title: recipe.title || 'Untitled Recipe',
      // Convert arrays to JSON strings for storage
      ingredients: Array.isArray(recipe.ingredients) ? JSON.stringify(recipe.ingredients) : recipe.ingredients,
      instructions: Array.isArray(recipe.instructions) ? JSON.stringify(recipe.instructions) : recipe.instructions,
      likes: recipe.likes || 999 // Use very high likes to ensure visibility in Popular page
    };
    
    console.log('Formatted recipe for storage:', formattedRecipe);

    // Use upsert to handle both new recipes and updates
    const { data: updatedData, error: updateError } = await supabase
      .from('recipes')
      .upsert([formattedRecipe], { onConflict: 'id' })
      .select();
    
    if (updateError) {
      console.error('Supabase upsert error:', updateError);
      // Try direct insert as fallback
      const { data, error } = await supabase
        .from('recipes')
        .insert([formattedRecipe])
        .select();
      
      if (error) {
        console.error('Supabase insert error:', error);
        return null;
      }
      
      // Format the returned data for our application
      if (data && data[0]) {
        return {
          ...data[0],
          ingredients: typeof data[0].ingredients === 'string' ? JSON.parse(data[0].ingredients) : data[0].ingredients,
          instructions: typeof data[0].instructions === 'string' ? JSON.parse(data[0].instructions) : data[0].instructions
        };
      }
      return null;
    }
    
    // Format the returned data for our application
    if (updatedData && updatedData[0]) {
      return {
        ...updatedData[0],
        ingredients: typeof updatedData[0].ingredients === 'string' ? JSON.parse(updatedData[0].ingredients) : updatedData[0].ingredients,
        instructions: typeof updatedData[0].instructions === 'string' ? JSON.parse(updatedData[0].instructions) : updatedData[0].instructions
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error storing recipe:', error);
    return null;
  }
};

// Helper function to get popular recipes
export const getPopularRecipes = async () => {
  try {
    console.log('Fetching popular recipes from Supabase');
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .order('likes', { ascending: false })
      .limit(20);
    
    if (error) {
      console.error('Error in Supabase query:', error);
      throw error;
    }
    
    // Parse the stored JSON strings back to arrays
    const formattedRecipes = data?.map(recipe => ({
      ...recipe,
      // Parse JSON strings back to arrays
      ingredients: typeof recipe.ingredients === 'string' ? JSON.parse(recipe.ingredients) : recipe.ingredients,
      instructions: typeof recipe.instructions === 'string' ? JSON.parse(recipe.instructions) : recipe.instructions
    })) || [];
    
    console.log(`Found ${formattedRecipes.length} popular recipes`, formattedRecipes);
    return formattedRecipes;
  } catch (error) {
    console.error('Error fetching popular recipes:', error);
    return [];
  }
};

// Helper function to like a recipe
export const likeRecipe = async (recipeId: string) => {
  try {
    console.log('Liking recipe with ID:', recipeId);
    
    // Get the current recipe data
    const { data: recipe, error: fetchError } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', recipeId)
      .single();
      
    // If recipe not found, we'll try to create it
    if (fetchError) {
      console.error('Error fetching recipe for like:', fetchError);
      
      // If the recipe doesn't exist in Supabase yet, create it with 1 like
      if (fetchError.code === 'PGRST116') { // Record not found error
        console.log('Recipe not found in database, creating it');
        
        // Get the recipe from local storage if available
        const localFavorites = localStorage.getItem('favoriteRecipes');
        const favoriteRecipes = localFavorites ? JSON.parse(localFavorites) : [];
        const foundRecipe = favoriteRecipes.find((r: any) => r.id === recipeId);
        
        if (foundRecipe) {
          // Store the recipe with 1 like
          await storeRecipe({...foundRecipe, likes: 1});
          return {...foundRecipe, likes: 1};
        }
        
        // Create a minimal recipe entry if we can't find the full recipe
        const { data, error } = await supabase
          .from('recipes')
          .insert([{ id: recipeId, likes: 1, title: 'Unknown Recipe' }])
          .select();
          
        if (error) throw error;
        return data?.[0];
      }
      
      throw fetchError;
    }
    
    // Recipe found - directly update the likes count
    const newLikes = (recipe?.likes || 0) + 1;
    console.log(`Updating recipe ${recipeId} likes from ${recipe?.likes} to ${newLikes}`);
    
    const { data, error } = await supabase
      .from('recipes')
      .update({ likes: newLikes })
      .eq('id', recipeId)
      .select();
    
    if (error) {
      console.error('Error updating recipe likes:', error);
      throw error;
    }
    
    // If the update was successful, return the updated data
    if (data && data[0]) {
      console.log('Recipe liked successfully:', data[0]);
      return data[0];
    }
    
    // If we didn't get data back but no error, fetch the latest
    const { data: updatedRecipe, error: refetchError } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', recipeId)
      .single();
    
    if (refetchError) {
      console.error('Error fetching updated recipe:', refetchError);
      return recipe; // Return the original recipe as fallback
    }
    
    console.log('Recipe liked successfully (fetched):', updatedRecipe);
    return updatedRecipe;
  } catch (error) {
    console.error('Error liking recipe:', error);
    return null;
  }
};

// Helper function to get a recipe by ID
export const getRecipeById = async (recipeId: string) => {
  try {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', recipeId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
};
