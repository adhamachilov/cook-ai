/**
 * This file contains a direct test to insert and retrieve data from Supabase
 * It bypasses all the regular app code to test if the database is set up correctly
 */

// Function to directly insert a test recipe into Supabase
export const insertTestRecipe = async () => {
  try {
    console.log('TEST: Inserting test recipe directly into Supabase');
    
    // Generate a random ID with hyphens to simulate UUID format
    const testId = `test-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    
    // Create a test recipe
    const testRecipe = {
      id: testId,
      title: 'Test Recipe ' + new Date().toLocaleTimeString(),
      description: 'This is a test recipe created directly',
      cookingTime: 30,
      servings: 4,
      calories: 500,
      ingredients: ['Test Ingredient 1', 'Test Ingredient 2'],
      instructions: ['Step 1: Test', 'Step 2: Test Again'],
      tags: ['test', 'direct-insert'],
      cuisineType: 'Test Cuisine',
      dietaryInfo: {
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: true,
        isDairyFree: false
      },
      likes: 5, // Start with 5 likes for testing
      created_at: new Date().toISOString()
    };
    
    // Direct API call to Supabase
    const response = await fetch('https://ymbmwarbczwbnthhmhfu.supabase.co/rest/v1/recipes', {
      method: 'POST',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltYm13YXJiY3p3Ym50aGhtaGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNTMwMjksImV4cCI6MjA2MzcyOTAyOX0.MaLlsNQbRkAzJlEcvFBt1ALezgbD7DlQs0oWQcQ9LuQ',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltYm13YXJiY3p3Ym50aGhtaGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNTMwMjksImV4cCI6MjA2MzcyOTAyOX0.MaLlsNQbRkAzJlEcvFBt1ALezgbD7DlQs0oWQcQ9LuQ',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(testRecipe)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('TEST FAILED: Error inserting test recipe:', errorText);
      return { success: false, error: errorText };
    }
    
    const result = await response.json();
    console.log('TEST SUCCESS: Test recipe inserted:', result);
    return { success: true, recipe: result };
    
  } catch (error) {
    console.error('TEST FAILED: Exception inserting test recipe:', error);
    return { success: false, error };
  }
};

// Function to fetch all recipes from Supabase
export const fetchAllRecipes = async () => {
  try {
    console.log('TEST: Fetching all recipes from Supabase');
    
    const response = await fetch('https://ymbmwarbczwbnthhmhfu.supabase.co/rest/v1/recipes?order=created_at.desc', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltYm13YXJiY3p3Ym50aGhtaGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNTMwMjksImV4cCI6MjA2MzcyOTAyOX0.MaLlsNQbRkAzJlEcvFBt1ALezgbD7DlQs0oWQcQ9LuQ',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltYm13YXJiY3p3Ym50aGhtaGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNTMwMjksImV4cCI6MjA2MzcyOTAyOX0.MaLlsNQbRkAzJlEcvFBt1ALezgbD7DlQs0oWQcQ9LuQ'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('TEST FAILED: Error fetching recipes:', errorText);
      return { success: false, error: errorText };
    }
    
    const recipes = await response.json();
    console.log('TEST SUCCESS: Found', recipes.length, 'recipes:', recipes);
    return { success: true, recipes };
    
  } catch (error) {
    console.error('TEST FAILED: Exception fetching recipes:', error);
    return { success: false, error };
  }
};
