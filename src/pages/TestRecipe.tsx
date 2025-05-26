import React, { useState } from 'react';
import Button from '../components/ui/Button';
import { insertTestRecipe, getRecipes } from '../services/supabase-minimal';

const TestRecipe: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [recipes, setRecipes] = useState<any[]>([]);

  const handleInsertTestRecipe = async () => {
    setMessage('Inserting test recipe...');
    
    try {
      const result = await insertTestRecipe();
      
      if (result.success) {
        setMessage('✅ Successfully inserted test recipe! Check the console for details.');
      } else {
        const errorMsg = result.error ? 
          (typeof result.error === 'object' && result.error !== null && 'message' in result.error ? 
            result.error.message : 
            JSON.stringify(result.error)) : 
          'Unknown error';
        setMessage(`❌ Failed to insert test recipe: ${errorMsg}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleGetRecipes = async () => {
    setMessage('Fetching recipes...');
    
    try {
      const fetchedRecipes = await getRecipes();
      setRecipes(fetchedRecipes);
      setMessage(`✅ Found ${fetchedRecipes.length} recipes. Check below for details.`);
    } catch (error) {
      setMessage(`❌ Error fetching recipes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Recipe Testing Tool</h1>
      
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Functions</h2>
          
          <div className="flex space-x-4">
            <Button onClick={handleInsertTestRecipe}>
              Insert Test Recipe
            </Button>
            
            <Button onClick={handleGetRecipes}>
              Get Recipes
            </Button>
          </div>
          
          {message && (
            <div className={`mt-4 p-4 rounded-lg ${message.includes('✅') ? 'bg-green-100' : 'bg-red-100'}`}>
              <p>{message}</p>
            </div>
          )}
        </div>
        
        {recipes.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recipes in Database ({recipes.length})</h2>
            
            <div className="space-y-4">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="border p-4 rounded-lg">
                  <h3 className="font-bold text-lg">{recipe.title}</h3>
                  <p className="text-sm text-gray-500">ID: {recipe.id}</p>
                  <p className="text-sm text-gray-500">Likes: {recipe.likes}</p>
                  <p className="mt-2 font-medium">Ingredients:</p>
                  <pre className="bg-gray-100 p-2 rounded text-sm mt-1 overflow-auto">
                    {recipe.ingredients}
                  </pre>
                  <p className="mt-2 font-medium">Instructions:</p>
                  <pre className="bg-gray-100 p-2 rounded text-sm mt-1 overflow-auto">
                    {recipe.instructions}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestRecipe;
