import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase-minimal';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import RecipeCard from '../components/ui/RecipeCard';

// This is a standalone page that directly accesses the database
// without any complex app logic that might be causing issues
const AllRecipes: React.FC = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Direct database query with simplified processing
  const loadRecipes = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Basic query - just get everything
      const { data, error } = await supabase
        .from('recipes')
        .select('*');
        
      if (error) throw error;
      
      console.log('Raw database recipes:', data);
      
      if (!data || data.length === 0) {
        setError('No recipes found in database');
        setRecipes([]);
        return;
      }
      
      // Transform to valid Recipe objects
      const validRecipes = data.map(item => {
        // Parse JSON strings to arrays
        let ingredients = [];
        let instructions = [];
        
        try {
          ingredients = typeof item.ingredients === 'string' 
            ? JSON.parse(item.ingredients) 
            : (item.ingredients || []);
        } catch (e) {
          console.error('Error parsing ingredients for recipe:', item.id);
        }
        
        try {
          instructions = typeof item.instructions === 'string'
            ? JSON.parse(item.instructions)
            : (item.instructions || []);
        } catch (e) {
          console.error('Error parsing instructions for recipe:', item.id);
        }
        
        // Return a complete Recipe object
        return {
          id: item.id || 'unknown-id',
          title: item.title || 'Untitled Recipe',
          description: item.description || `A delicious recipe featuring ${item.title || 'ingredients'}`,
          imageUrl: '',
          ingredients: ingredients,
          instructions: instructions,
          cookingTime: item.cookingTime || 30,
          servings: item.servings || 4,
          calories: item.calories || 400,
          tags: [],
          cuisineType: item.cuisineType || 'Mixed',
          likes: item.likes || 0,
          dietaryInfo: {
            isVegetarian: false,
            isVegan: false,
            isGlutenFree: false,
            isDairyFree: false
          }
        };
      });
      
      console.log('Processed recipes:', validRecipes);
      setRecipes(validRecipes);
    } catch (err) {
      console.error('Error loading recipes:', err);
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load recipes on initial render
  useEffect(() => {
    loadRecipes();
  }, []);
  
  return (
    <div className="min-h-screen pb-20 pt-10">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="relative inline-block text-4xl font-bold text-white mb-3">
            All Recipes (Direct Access)
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded"></span>
          </h1>
          <p className="text-white text-lg max-w-2xl mx-auto">
            This page shows recipes loaded directly from the database
          </p>
        </div>
        
        {/* Debug controls */}
        <div className="bg-amber-800/30 p-4 rounded-lg mb-8">
          <div className="flex justify-between items-center">
            <Button onClick={loadRecipes}>
              Reload Recipes
            </Button>
            <div className="text-white">
              {recipes.length} recipes found
            </div>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-500/20 rounded text-white">
              {error}
            </div>
          )}
        </div>
        
        {/* Recipe cards */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" />
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-fade-in">
            {recipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-white mb-4">No Recipes Found</h2>
            <p className="text-white text-lg">Try generating some recipes using the Search page!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllRecipes;
