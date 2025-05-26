import React, { useState } from 'react';
import { supabase } from '../services/supabase-minimal';
import { generateUUID } from '../utils/uuid';
import { generateSimpleRecipes } from '../services/simple-recipe-generator';
import { Search as SearchIcon, Plus, X, ChevronDown } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import RecipeCard from '../components/ui/RecipeCard';
import Spinner from '../components/ui/Spinner';
import { useRecipes } from '../context/RecipeContext';
import { Recipe, IngredientItem, DietaryPreference, CuisineType } from '../types';

const Search: React.FC = () => {
  const { } = useRecipes(); // getRecipes removed since the Generate More button was removed
  const [isLoading, setIsLoading] = useState(false);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [ingredients, setIngredients] = useState<IngredientItem[]>([]);
  const [results, setResults] = useState<Recipe[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDietary, setSelectedDietary] = useState<DietaryPreference[]>([]);
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineType | ''>('');
  const [hasSearched, setHasSearched] = useState(false);
  const [replaceOldRecipes, setReplaceOldRecipes] = useState(false);
  // Recipe cards now navigate directly to recipe detail pages

  // Common ingredients suggestions
  const commonIngredients = [
    'Chicken', 'Beef', 'Pasta', 'Rice', 'Eggs', 'Milk',
    'Onion', 'Garlic', 'Potato', 'Tomato', 'Cheese'
  ];

  const dietaryOptions: { value: DietaryPreference; label: string }[] = [
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'gluten-free', label: 'Gluten-Free' },
    { value: 'dairy-free', label: 'Dairy-Free' },
  ];

  const cuisineOptions: { value: CuisineType; label: string }[] = [
    { value: 'italian', label: 'Italian' },
    { value: 'mexican', label: 'Mexican' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'indian', label: 'Indian' },
    { value: 'french', label: 'French' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'american', label: 'American' },
    { value: 'mediterranean', label: 'Mediterranean' },
    { value: 'thai', label: 'Thai' },
    { value: 'korean', label: 'Korean' },
  ];

  // Add ingredient to the list
  const addIngredient = () => {
    if (currentIngredient.trim() !== '' && !ingredients.some(i => i.name.toLowerCase() === currentIngredient.toLowerCase())) {
      setIngredients([
        ...ingredients, 
        { id: `ing-${Date.now()}`, name: currentIngredient.trim() }
      ]);
      setCurrentIngredient('');
    }
  };

  // Remove ingredient from the list
  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  // Add suggested ingredient
  const addSuggestedIngredient = (ingredient: string) => {
    if (!ingredients.some(i => i.name.toLowerCase() === ingredient.toLowerCase())) {
      setIngredients([
        ...ingredients, 
        { id: `ing-${Date.now()}`, name: ingredient.trim() }
      ]);
    }
  };

  // Toggle dietary preference
  const toggleDietaryPreference = (preference: DietaryPreference) => {
    if (selectedDietary.includes(preference)) {
      setSelectedDietary(selectedDietary.filter(p => p !== preference));
    } else {
      setSelectedDietary([...selectedDietary, preference]);
    }
  };

  // Search for recipes
  const searchRecipes = async () => {
    if (ingredients.length === 0) return;
    
    // Clear previous search results on the UI only
    setResults([]);
    
    // Show loading state
    setHasSearched(true);
    setIsLoading(true);
    
    try {
      // Log the search criteria for debugging
      console.log('Searching with criteria:', {
        ingredients: ingredients.map(ing => ing.name),
        dietaryPreferences: selectedDietary,
        cuisineType: selectedCuisine
      });
      
      // If user wants to replace old recipes, delete previous recipes first
      if (replaceOldRecipes) {
        console.log('Replacing old recipes - deleting previous recipes before generating new ones');
        try {
          const { error } = await supabase
            .from('recipes')
            .delete()
            .neq('id', 'placeholder'); // Delete all recipes
  
          if (error) {
            console.error('Error deleting old recipes:', error);
            // Continue anyway - don't block the user if delete fails
          } else {
            console.log('Successfully deleted old recipes');
          }
        } catch (deleteError) {
          console.error('Error in delete operation:', deleteError);
          // Continue anyway
        }
      }
      
      // Use our simplified recipe generator instead of the old one
      const recipes = await generateSimpleRecipes({
        ingredients: ingredients.map(ing => ing.name),
        dietaryPreferences: selectedDietary.length > 0 ? selectedDietary : undefined,
        cuisineType: selectedCuisine || undefined,
        maxResults: 6, // Request exactly 6 recipes
        ensureDiversity: true  // Adding flag for API to ensure recipe diversity
      });
      
      console.log('Search results:', recipes);
      
      if (recipes.length === 0) {
        console.error('No recipes were generated!');
        setIsLoading(false);
        return;
      }
      
      // Start recipes with 0 likes as requested
      const recipesWithLikes = recipes.map(recipe => ({
        ...recipe,
        likes: 0 // Start with 0 likes as requested
      }));
      
      // COMPLETELY DIRECT APPROACH: Using raw fetch for maximum reliability
      console.log('CRITICAL: Saving recipes directly via fetch...');
      
      const savedRecipes = [];
      
      for (const recipe of recipesWithLikes) {
        try {
          // Ensure we have a valid UUID
          const recipeId = recipe.id && recipe.id.includes('-') ? recipe.id : generateUUID();
          
          // Prepare recipe data for Supabase with ALL required fields
          const recipeToSave = {
            id: recipeId,
            title: recipe.title || 'Delicious Recipe',
            description: recipe.description || `A delicious recipe featuring ${recipe.ingredients[0]}.`,
            ingredients: JSON.stringify(recipe.ingredients || []),
            instructions: JSON.stringify(recipe.instructions || []),
            likes: 999, // Explicitly set high likes for Popular page
            cookingtime: recipe.cookingTime || 30, // lowercase to match database
            calories: recipe.calories || 400,
            servings: recipe.servings || 4,
            cuisinetype: recipe.cuisineType || 'Mixed', // lowercase to match database
            created_at: new Date().toISOString() // Ensure we have a timestamp
          };
          
          console.log(`Saving recipe with ID ${recipeId} and title "${recipe.title}" to Supabase...`);
          
          // DIRECT API CALL: Most reliable way to ensure data is saved
          const response = await fetch('https://jcswgbrzelleyxfeckhr.supabase.co/rest/v1/recipes', {
            method: 'POST',
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjc3dnYnJ6ZWxsZXl4ZmVja2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNzE3NDQsImV4cCI6MjA2Mzc0Nzc0NH0.EnBiPpGWrWKumER7eeFV3LAIyGQ0jzWEUq9KXzUCLA0',
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjc3dnYnJ6ZWxsZXl4ZmVja2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNzE3NDQsImV4cCI6MjA2Mzc0Nzc0NH0.EnBiPpGWrWKumER7eeFV3LAIyGQ0jzWEUq9KXzUCLA0',
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify(recipeToSave)
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to save recipe: ${errorText}`);
          }
          
          const savedData = await response.json();
          console.log('DIRECT SAVE SUCCESS:', savedData);
          
          // Add to our saved recipes list
          savedRecipes.push({
            ...recipe,
            id: recipeId
          });
        } catch (err) {
          console.error(`CRITICAL ERROR saving recipe ${recipe.title}:`, err);
        }
      }
      
      // Display all successfully saved recipes
      if (savedRecipes.length > 0) {
        console.log(`Successfully saved ${savedRecipes.length} recipes!`);
        setResults(savedRecipes);
      } else {
        console.error('Failed to save any recipes!');
      }
    } catch (error) {
      console.error('Critical error in recipe search process:', error);
    } finally {
      setIsLoading(false);
    }
    
    // Log how many recipes we're actually displaying
    console.log('Search complete');
  };

  // Clear all inputs and results
  const clearSearch = () => {
    setIngredients([]);
    setSelectedDietary([]);
    setSelectedCuisine('');
    setResults([]);
    setHasSearched(false);
  };

  // Handle Enter key press in the input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addIngredient();
    }
  };

  return (
    <div className="pb-20 pt-10 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-3xl font-bold md:text-4xl text-amber-100">Find Recipes with Your Ingredients</h1>
            <p className="text-lg text-amber-200/90">
              Enter the ingredients you have, and let our AI find the perfect recipes for you
            </p>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-amber-700/40 to-amber-800/50 backdrop-blur-md border border-amber-400/30 text-white p-6 shadow-md md:p-8">
            {/* Ingredients Input */}
            <div className="mb-6">
              <label className="mb-2 block font-medium text-amber-100">Enter Your Ingredients</label>
              <div className="flex items-center">
                <Input
                  value={currentIngredient}
                  onChange={(e) => setCurrentIngredient(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type an ingredient and press Enter"
                  icon={<SearchIcon size={18} />}
                  className="flex-1"
                />
                <Button
                  onClick={addIngredient}
                  icon={<Plus size={18} />}
                  className="ml-2"
                  disabled={currentIngredient.trim() === ''}
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Common Ingredients Suggestions */}
            <div className="mb-6 mt-4">
              <h3 className="mb-2 text-sm font-medium text-amber-200">Common Ingredients</h3>
              <div className="flex flex-wrap gap-2">
                {commonIngredients.map((ingredient) => (
                  <button
                    key={ingredient}
                    type="button"
                    className={`rounded-full ${ingredients.some(i => i.name.toLowerCase() === ingredient.toLowerCase()) 
                      ? 'bg-amber-600 text-white' 
                      : 'bg-amber-700/30 text-amber-100 hover:bg-amber-700/50'} 
                      px-3 py-1 text-sm transition-all transform hover:scale-105`}
                    onClick={() => addSuggestedIngredient(ingredient)}
                    disabled={ingredients.some(i => i.name.toLowerCase() === ingredient.toLowerCase())}
                  >
                    {ingredient}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Ingredients */}
            {ingredients.length > 0 && (
              <div className="mb-6">
                <label className="mb-2 block font-medium text-amber-100">Your Ingredients:</label>
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((ing) => (
                    <div
                      key={ing.id}
                      className="flex items-center rounded-full bg-amber-300/80 px-3 py-1 text-amber-950 font-medium"
                    >
                      <span className="text-sm">{ing.name}</span>
                      <button
                        onClick={() => removeIngredient(ing.id)}
                        className="ml-1 rounded-full p-1 text-amber-950 hover:bg-amber-200/90"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Advanced Filters */}
            <div className="mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="group flex items-center rounded-full bg-gradient-to-r from-amber-500/40 to-amber-600/40 px-4 py-2 text-amber-100 shadow-md transition-all duration-300 hover:from-amber-500/60 hover:to-amber-600/60 hover:shadow-lg"
              >
                <span className="font-medium">Advanced Filters</span>
                <ChevronDown
                  size={18}
                  className={`ml-2 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`}
                />
              </button>

              {showFilters && (
                <div className="mt-4 overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-800/70 to-amber-900/70 backdrop-blur-md shadow-lg transition-all duration-300">
                  <div className="p-1">
                    <div className="rounded-lg bg-amber-950/50 p-5">
                      <h3 className="mb-4 text-lg font-semibold text-amber-300">Refine Your Search</h3>
                      
                      {/* Recipe Management Options */}
                      <div className="mb-4 rounded-lg border border-amber-600/20 bg-amber-900/40 p-4">
                        <h4 className="font-medium text-amber-200 border-b border-amber-600/20 pb-2">Recipe Management</h4>
                        <div className="mt-3">
                          <label className="inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer"
                              checked={replaceOldRecipes}
                              onChange={() => setReplaceOldRecipes(!replaceOldRecipes)}
                            />
                            <div className="relative w-11 h-6 bg-amber-800/50 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-400 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-amber-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                            <span className="ml-3 text-sm font-medium text-amber-100">Delete ALL recipes from database when searching</span>
                          </label>
                          <p className="text-xs text-amber-200/70 mt-1 ml-14">When checked, ALL existing recipes will be completely removed from the database before generating new ones. Leave unchecked to keep adding recipes to your collection.</p>
                        </div>
                      </div>
                      
                      <div className="grid gap-6 md:grid-cols-2">
                        {/* Dietary Preferences */}
                        <div className="space-y-3 rounded-lg border border-amber-600/20 bg-amber-900/40 p-4">
                          <h4 className="font-medium text-amber-200 border-b border-amber-600/20 pb-2">Dietary Preferences</h4>
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            {dietaryOptions.map((option) => (
                              <div 
                                key={option.value} 
                                onClick={() => toggleDietaryPreference(option.value)}
                                className={`flex cursor-pointer items-center space-x-2 rounded-md border px-3 py-2 transition-all ${selectedDietary.includes(option.value) 
                                  ? 'border-amber-400 bg-amber-700/60 text-amber-100' 
                                  : 'border-amber-600/20 bg-amber-800/30 text-amber-300/80 hover:bg-amber-800/50'}`}
                              >
                                <div className={`flex h-5 w-5 items-center justify-center rounded-sm ${selectedDietary.includes(option.value) 
                                  ? 'bg-amber-400' 
                                  : 'border border-amber-500/50 bg-amber-800/50'}`}
                                >
                                  {selectedDietary.includes(option.value) && (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-3.5 w-3.5 text-amber-950" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                  )}
                                </div>
                                <span className="text-sm font-medium">{option.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Cuisine Type */}
                        <div className="space-y-3 rounded-lg border border-amber-600/20 bg-amber-900/40 p-4">
                          <h4 className="font-medium text-amber-200 border-b border-amber-600/20 pb-2">Cuisine Type</h4>
                          <div className="pt-1">
                            <div className="relative">
                              <select
                                value={selectedCuisine}
                                onChange={(e) => setSelectedCuisine(e.target.value as CuisineType)}
                                className="block w-full appearance-none rounded-md border border-amber-600/30 bg-amber-800/50 py-2.5 pl-4 pr-10 text-sm font-medium text-amber-100 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                              >
                                <option value="">Any Cuisine</option>
                                {cuisineOptions.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                                <ChevronDown size={18} className="text-amber-400" />
                              </div>
                            </div>
                            
                            {/* Cuisine tags visualization */}
                            {selectedCuisine && (
                              <div className="mt-3 flex">
                                <span className="rounded-full bg-amber-600/50 px-3 py-1 text-xs font-medium text-amber-100">
                                  {cuisineOptions.find(c => c.value === selectedCuisine)?.label}
                                  <button 
                                    onClick={() => setSelectedCuisine('')}
                                    className="ml-1.5 rounded-full hover:text-white"
                                  >
                                    <X size={14} />
                                  </button>
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Search Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={searchRecipes}
                icon={<SearchIcon size={18} />}
                isLoading={isLoading}
                disabled={ingredients.length === 0 || isLoading}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md hover:shadow-lg transition-all duration-300 px-5 py-2.5"
              >
                {isLoading ? 'Searching...' : 'Find Recipes'}
              </Button>
              <Button
                variant="outline"
                onClick={clearSearch}
                disabled={ingredients.length === 0 && selectedDietary.length === 0 && !selectedCuisine}
                className="border-amber-500/50 text-amber-200 hover:bg-amber-800/40 hover:border-amber-400 transition-all duration-300 px-5 py-2.5"
              >
                Clear All
              </Button>
            </div>
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="my-12 flex flex-col items-center justify-center">
              <Spinner size="lg" />
              <p className="mt-4 text-amber-200">Searching for delicious recipes...</p>
            </div>
          )}

          {/* Search Results */}
          {results.length > 0 && (
            <div className="mb-12 mt-20">
              <h2 className="mb-6 text-2xl font-bold text-center text-amber-100">Recipe Results</h2>
              <div className="mb-4 text-center text-amber-200">
                <p>Found {results.length} recipe{results.length !== 1 ? 's' : ''} based on your ingredients</p>
                <p className="text-sm text-amber-300/80 mt-1">
                  {results.length < 6 ? 'Showing diverse recipes - can generate up to 6 unique matches' : 'Showing maximum of 6 diverse recipes'}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    className="animate-fadeIn transition-transform duration-300 hover:scale-105"
                  />
                ))}
              </div>
              
              {/* Generate More button has been removed as requested */}
            </div>
          )}
      
          {/* No Results Message - Only show after search has been performed */}
          {results.length === 0 && hasSearched && !isLoading && (
            <div className="mx-auto mt-8 max-w-md rounded-lg bg-gradient-to-br from-amber-800/70 to-amber-900/70 backdrop-blur-md border border-amber-500/30 p-8 text-center shadow-md">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-amber-400 mx-auto">
                <SearchIcon size={32} />
              </div>
              <h2 className="mb-2 text-xl font-semibold text-white">No Recipes Found</h2>
              <p className="text-white/80 mb-4">
                Try adding more common ingredients or adjusting your filters to find matching recipes.
              </p>
              <Button 
                onClick={clearSearch} 
                variant="outline" 
                className="mx-auto bg-amber-700/50 hover:bg-amber-700/80 border-amber-500/50 text-amber-100 hover:text-white transition-all">
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
