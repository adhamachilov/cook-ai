import React, { useState, useEffect } from 'react';
import RecipeCard from '../components/ui/RecipeCard';
import Spinner from '../components/ui/Spinner';
import { getRecipes } from '../services/supabase-minimal';
import { Recipe } from '../types';

const Popular: React.FC = () => {
  const [popularRecipes, setPopularRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to automatically remove duplicate recipes
  const removeDuplicateRecipes = async (): Promise<void> => {
    try {
      console.log('Automatically checking for duplicate recipes...');
      
      // First get all recipes
      const response = await fetch('https://jcswgbrzelleyxfeckhr.supabase.co/rest/v1/recipes?select=id,title', {
        method: 'GET',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjc3dnYnJ6ZWxsZXl4ZmVja2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNzE3NDQsImV4cCI6MjA2Mzc0Nzc0NH0.EnBiPpGWrWKumER7eeFV3LAIyGQ0jzWEUq9KXzUCLA0',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjc3dnYnJ6ZWxsZXl4ZmVja2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNzE3NDQsImV4cCI6MjA2Mzc0Nzc0NH0.EnBiPpGWrWKumER7eeFV3LAIyGQ0jzWEUq9KXzUCLA0'
        }
      });
      
      const recipes = await response.json();
      
      // Find duplicates by title
      const titleMap = new Map<string, string>();
      const duplicates: string[] = [];
      
      recipes.forEach((recipe: {id: string, title: string}) => {
        if (!titleMap.has(recipe.title)) {
          titleMap.set(recipe.title, recipe.id);
        } else {
          // This is a duplicate
          duplicates.push(recipe.id);
        }
      });
      
      console.log(`Found ${duplicates.length} duplicate recipes to remove`);
      
      // Delete each duplicate
      for (const id of duplicates) {
        await fetch(`https://jcswgbrzelleyxfeckhr.supabase.co/rest/v1/recipes?id=eq.${id}`, {
          method: 'DELETE',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjc3dnYnJ6ZWxsZXl4ZmVja2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNzE3NDQsImV4cCI6MjA2Mzc0Nzc0NH0.EnBiPpGWrWKumER7eeFV3LAIyGQ0jzWEUq9KXzUCLA0',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjc3dnYnJ6ZWxsZXl4ZmVja2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNzE3NDQsImV4cCI6MjA2Mzc0Nzc0NH0.EnBiPpGWrWKumER7eeFV3LAIyGQ0jzWEUq9KXzUCLA0'
          }
        });
      }
      
      console.log(`Removed ${duplicates.length} duplicate recipes from database`);
    } catch (error) {
      console.error('Error removing duplicates:', error);
    }
  };
  
  // Function to reset any recipes with 999 likes to 0
  const resetLegacyLikes = async (): Promise<void> => {
    try {
      console.log('Checking for recipes with 999 likes to reset...');
      
      // Find all recipes with 999 likes
      const response = await fetch('https://jcswgbrzelleyxfeckhr.supabase.co/rest/v1/recipes?likes=eq.999', {
        method: 'GET',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjc3dnYnJ6ZWxsZXl4ZmVja2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNzE3NDQsImV4cCI6MjA2Mzc0Nzc0NH0.EnBiPpGWrWKumER7eeFV3LAIyGQ0jzWEUq9KXzUCLA0',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjc3dnYnJ6ZWxsZXl4ZmVja2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNzE3NDQsImV4cCI6MjA2Mzc0Nzc0NH0.EnBiPpGWrWKumER7eeFV3LAIyGQ0jzWEUq9KXzUCLA0'
        }
      });
      
      const recipes = await response.json();
      console.log(`Found ${recipes.length} recipes with 999 likes to reset`);
      
      // Reset each recipe's likes to 0
      for (const recipe of recipes) {
        await fetch(`https://jcswgbrzelleyxfeckhr.supabase.co/rest/v1/recipes?id=eq.${recipe.id}`, {
          method: 'PATCH',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjc3dnYnJ6ZWxsZXl4ZmVja2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNzE3NDQsImV4cCI6MjA2Mzc0Nzc0NH0.EnBiPpGWrWKumER7eeFV3LAIyGQ0jzWEUq9KXzUCLA0',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjc3dnYnJ6ZWxsZXl4ZmVja2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNzE3NDQsImV4cCI6MjA2Mzc0Nzc0NH0.EnBiPpGWrWKumER7eeFV3LAIyGQ0jzWEUq9KXzUCLA0',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ likes: 0 })
        });
      }
      
      console.log(`Reset ${recipes.length} recipes from 999 likes to 0 likes`);
    } catch (error) {
      console.error('Error resetting recipe likes:', error);
    }
  };
  
  // Main function to load recipes
  const loadRecipes = async () => {
    setIsLoading(true);
    try {
      // First automatically remove any duplicates
      await removeDuplicateRecipes();
      
      // Reset any recipes with 999 likes to 0
      await resetLegacyLikes();
      
      // Then get all recipes through our normal function
      const recipes = await getRecipes();
      setPopularRecipes(recipes);
      console.log('Successfully loaded recipes:', recipes.length);
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Note: Recipe liking is now handled directly in the RecipeCard component

  // Load recipes on initial render
  useEffect(() => {
    loadRecipes();
  }, []);

  return (
    <div className="min-h-screen pb-20 pt-10">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header with animated gradient underline - centered */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold relative inline-block">
            Popular Recipes
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-300"></div>
          </h1>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" />
          </div>
        ) : popularRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {popularRecipes.map(recipe => {
              // Simply use the actual description from the recipe
              // No generation logic, no templates - just use what's already in the database
              const enhancedRecipe = {
                ...recipe,
                // Keep the description exactly as it is in the database
                description: recipe.description || ''
              };
              return (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={enhancedRecipe}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl">No popular recipes found yet.</p>
            <p className="mt-2">Try generating some new recipes!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Popular;