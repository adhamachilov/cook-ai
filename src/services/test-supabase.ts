import { supabase } from './supabase';

// Function to directly test Supabase connection and save a test recipe
export const testSupabaseConnection = async () => {
  console.log('Testing Supabase connection...');
  
  try {
    // 1. Check if we can connect and if the recipes table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('recipes')
      .select('count');
      
    if (tableError) {
      console.error('Error checking recipes table:', tableError);
      if (tableError.code === '42P01') { // Table doesn't exist error
        console.error('The recipes table does not exist. Please run the SQL setup script in Supabase.');
      }
      return false;
    }
    
    console.log('Successfully connected to Supabase!', tableCheck);
    
    // 2. Try to insert a test recipe
    const testRecipe = {
      id: `test-${Date.now()}`,
      title: 'Test Recipe',
      ingredients: JSON.stringify(['Test ingredient 1', 'Test ingredient 2']),
      instructions: JSON.stringify(['Step 1', 'Step 2']),
      likes: 999
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('recipes')
      .insert([testRecipe])
      .select();
      
    if (insertError) {
      console.error('Error inserting test recipe:', insertError);
      return false;
    }
    
    console.log('Successfully inserted test recipe:', insertData);
    
    // 3. Check if we can retrieve the recipes
    const { data: recipes, error: fetchError } = await supabase
      .from('recipes')
      .select('*')
      .order('likes', { ascending: false })
      .limit(5);
      
    if (fetchError) {
      console.error('Error fetching recipes:', fetchError);
      return false;
    }
    
    console.log('Successfully fetched recipes:', recipes);
    return true;
  } catch (error) {
    console.error('Unexpected error testing Supabase:', error);
    return false;
  }
};
