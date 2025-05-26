import React, { useState, useEffect } from 'react';
import Button from '../components/ui/Button';
import { supabase, saveRecipe } from '../services/supabase-minimal';
import { generateUUID } from '../utils/uuid';

const DiagnosePage: React.FC = () => {
  const [results, setResults] = useState<string>('');
  const [recipes, setRecipes] = useState<any[]>([]);

  const fetchAllData = async () => {
    setResults('Fetching data directly from Supabase...');
    
    try {
      // Direct query to get all tables and recipes
      const { data: tablesData, error: tablesError } = await supabase
        .rpc('get_tables');
      
      if (tablesError) throw tablesError;
      
      // Get all recipes directly
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (recipesError) throw recipesError;
      
      setRecipes(recipesData || []);
      
      // Format results
      const resultText = `
Database inspection results:

Tables: ${JSON.stringify(tablesData || [])}

Found ${recipesData?.length || 0} recipes in the database.
      `;
      
      setResults(resultText);
      
    } catch (error) {
      setResults(`Error: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
    }
  };

  const insertTestRecipeManually = async () => {
    setResults('Inserting test recipe directly...');
    
    try {
      const testId = generateUUID();
      const testRecipe = {
        id: testId,
        title: `Manual Test Recipe ${new Date().toLocaleTimeString()}`,
        ingredients: JSON.stringify(['Ingredient 1', 'Ingredient 2']),
        instructions: JSON.stringify(['Step 1', 'Step 2']),
        likes: 999,
        cookTime: 45,
        calories: 500,
        servings: 6
      };
      
      // Insert directly with the raw SQL query
      const { data, error } = await supabase
        .from('recipes')
        .insert([testRecipe]);
        
      if (error) throw error;
      
      setResults(`Successfully inserted test recipe with ID: ${testId}`);
      
      // Refresh recipes list
      fetchAllData();
      
    } catch (error) {
      setResults(`Error: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Database Diagnostics</h1>
      
      <div className="space-y-6">
        <div className="flex space-x-4">
          <Button onClick={fetchAllData}>
            Inspect Database
          </Button>
          
          <Button onClick={insertTestRecipeManually}>
            Insert Test Recipe Directly
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60">
            {results || 'No results yet'}
          </pre>
        </div>
        
        {recipes.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Recipes ({recipes.length})</h2>
            
            <div className="space-y-4">
              {recipes.map(recipe => (
                <div key={recipe.id} className="border p-4 rounded">
                  <h3 className="font-bold">{recipe.title}</h3>
                  <p className="text-sm text-gray-500">ID: {recipe.id}</p>
                  <p className="text-sm text-gray-500">Created: {new Date(recipe.created_at).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Likes: {recipe.likes}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosePage;
