import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { supabase } from '../services/supabase-minimal';
import { normalizeIngredientMeasurements } from '../utils/recipe-normalizer';

const FixRecipes: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fixAllRecipes = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setResults([]);
    setError(null);
    
    try {
      // Step 1: Get all recipes from the database
      setResults(prev => [...prev, "Fetching all recipes from database..."]);
      const { data: recipes, error: fetchError } = await supabase
        .from('recipes')
        .select('*');
        
      if (fetchError) {
        throw new Error(`Error fetching recipes: ${fetchError.message}`);
      }
      
      if (!recipes || recipes.length === 0) {
        setResults(prev => [...prev, "No recipes found in database."]);
        setIsProcessing(false);
        return;
      }
      
      setResults(prev => [...prev, `Found ${recipes.length} recipes to process.`]);
      
      // Step 2: Process each recipe
      let successCount = 0;
      let errorCount = 0;
      
      for (const recipe of recipes) {
        try {
          // Parse the ingredients from JSON string
          const ingredients = typeof recipe.ingredients === 'string' 
            ? JSON.parse(recipe.ingredients) 
            : [];
            
          if (!Array.isArray(ingredients) || ingredients.length === 0) {
            setResults(prev => [...prev, `Recipe ${recipe.id}: No ingredients to fix.`]);
            continue;
          }
          
          // Normalize the ingredients
          const normalizedIngredients = normalizeIngredientMeasurements(ingredients);
          
          // Update the recipe in the database
          const { error: updateError } = await supabase
            .from('recipes')
            .update({
              ingredients: JSON.stringify(normalizedIngredients)
            })
            .eq('id', recipe.id);
            
          if (updateError) {
            throw new Error(`Error updating recipe ${recipe.id}: ${updateError.message}`);
          }
          
          setResults(prev => [...prev, `✅ Recipe ${recipe.id}: Fixed ${ingredients.length} ingredients.`]);
          successCount++;
        } catch (recipeError) {
          errorCount++;
          setResults(prev => [...prev, `❌ Error processing recipe ${recipe.id}: ${recipeError instanceof Error ? recipeError.message : 'Unknown error'}`]);
        }
      }
      
      setResults(prev => [...prev, `Completed processing. Successfully fixed ${successCount} recipes. Failed: ${errorCount}`]);
      
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error occurred');
      setResults(prev => [...prev, `❌ Fatal error: ${e instanceof Error ? e.message : 'Unknown error'}`]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 pt-10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-10 text-center">
          <h1 className="relative inline-block text-4xl font-bold text-white mb-3">
            Fix Recipe Measurements
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded"></span>
          </h1>
          <p className="text-white text-lg max-w-2xl mx-auto">
            This utility fixes unrealistic measurements in existing recipes
          </p>
        </div>
        
        <div className="bg-amber-800/30 p-6 rounded-lg mb-8 max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold text-white mb-4">Recipe Fixer</h2>
          
          <p className="text-amber-100 mb-6">
            This tool will scan all recipes in the database and fix any unrealistic measurements. For example:
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>"1 cup chicken" → "8 oz chicken"</li>
              <li>"1/4 cup oregano" → "2 tbsp oregano"</li>
              <li>"a pinch of cheese" → "1 oz cheese"</li>
              <li>"3 tablespoons carrots" → "1/4 cup carrots"</li>
            </ul>
          </p>
          
          <Button 
            onClick={fixAllRecipes} 
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Spinner size="sm" /> 
                Processing Recipes...
              </>
            ) : 'Fix All Recipes'}
          </Button>
          
          {error && (
            <div className="mt-4 p-3 bg-red-900/50 text-red-100 rounded">
              {error}
            </div>
          )}
          
          {results.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-white mb-2">Processing Results:</h3>
              <div className="bg-amber-900/50 p-4 rounded max-h-96 overflow-y-auto font-mono text-sm">
                {results.map((result, i) => (
                  <div key={i} className="mb-1 text-amber-100">{result}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FixRecipes;
