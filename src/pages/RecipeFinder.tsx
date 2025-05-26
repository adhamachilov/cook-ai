import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search as SearchIcon, 
  Plus, 
  X, 
  ChevronDown, 
  ChevronUp,
  Clock, 
  Users, 
  Flame, 
  Heart, 
  Utensils
} from 'lucide-react';

import { Recipe, IngredientItem, DietaryPreference, CuisineType } from '../types';
import { generateUniqueRecipes } from '../services/recipe-generator';
import Spinner from '../components/ui/Spinner';

const RecipeFinder: React.FC = () => {
  const navigate = useNavigate();
  
  // State management
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [ingredients, setIngredients] = useState<IngredientItem[]>([]);
  const [results, setResults] = useState<Recipe[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDietary, setSelectedDietary] = useState<DietaryPreference[]>([]);
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineType | ''>('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Common ingredients suggestions
  const commonIngredients = [
    'Chicken', 'Beef', 'Pasta', 'Rice', 'Eggs', 'Onion', 
    'Garlic', 'Potato', 'Tomato', 'Cheese', 'Broccoli',
    'Spinach', 'Mushrooms', 'Bell Pepper', 'Carrots'
  ];

  const dietaryOptions: { value: DietaryPreference; label: string }[] = [
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'gluten-free', label: 'Gluten-Free' },
    { value: 'dairy-free', label: 'Dairy-Free' },
    { value: 'nut-free', label: 'Nut-Free' },
    { value: 'low-carb', label: 'Low Carb' },
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

  // Add a new ingredient to the list
  const addIngredient = () => {
    if (!currentIngredient.trim()) return;
    
    // Check for duplicates
    if (ingredients.some(ing => ing.name.toLowerCase() === currentIngredient.toLowerCase())) {
      return;
    }
    
    setIngredients([
      ...ingredients, 
      { id: Date.now().toString(), name: currentIngredient.trim() }
    ]);
    setCurrentIngredient('');
  };
  
  // Add a suggested ingredient
  const addSuggestedIngredient = (ingredient: string) => {
    if (ingredients.some(ing => ing.name.toLowerCase() === ingredient.toLowerCase())) {
      return;
    }
    
    setIngredients([
      ...ingredients, 
      { id: Date.now().toString(), name: ingredient }
    ]);
  };

  // Remove an ingredient from the list
  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  // Toggle a dietary preference
  const toggleDietary = (value: DietaryPreference) => {
    if (selectedDietary.includes(value)) {
      setSelectedDietary(selectedDietary.filter(item => item !== value));
    } else {
      setSelectedDietary([...selectedDietary, value]);
    }
  };

  // Handle Enter key press in the input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addIngredient();
    }
  };

  // Clear all inputs and results
  const clearSearch = () => {
    setIngredients([]);
    setSelectedDietary([]);
    setSelectedCuisine('');
    setResults([]);
    setHasSearched(false);
  };

  // Search for recipes
  const searchRecipes = async () => {
    if (ingredients.length === 0) return;
    
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      console.log('Searching with criteria:', {
        ingredients: ingredients.map(ing => ing.name),
        dietaryPreferences: selectedDietary,
        cuisineType: selectedCuisine
      });
      
      const request = {
        ingredients: ingredients.map(ing => ing.name),
        dietaryPreferences: selectedDietary.length > 0 ? selectedDietary : undefined,
        cuisineType: selectedCuisine || undefined
      };
      
      // Get exactly 3 recipes
      const recipes = await generateUniqueRecipes(request);
      console.log('Search results:', recipes);
      
      setResults(recipes);
    } catch (error) {
      console.error('Error searching recipes:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load more recipes
  const loadMoreRecipes = async () => {
    if (ingredients.length === 0) return;
    
    setIsLoadingMore(true);
    
    try {
      const request = {
        ingredients: ingredients.map(ing => ing.name),
        dietaryPreferences: selectedDietary.length > 0 ? selectedDietary : undefined,
        cuisineType: selectedCuisine || undefined
      };
      
      // Calculate offset based on current results
      const offset = results.length;
      
      // Get exactly 3 more recipes
      const newRecipes = await generateUniqueRecipes(request, offset);
      console.log(`Generated ${newRecipes.length} additional recipes`);
      
      // Add the new recipes to existing ones (don't replace)
      setResults([...results, ...newRecipes]);
    } catch (error) {
      console.error('Error loading more recipes:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };
  
  // Navigate to recipe details
  const viewRecipeDetails = (recipe: Recipe) => {
    navigate(`/recipe/${recipe.id}`, { state: { recipe } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-950 to-amber-900 text-amber-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-center text-4xl font-bold text-amber-100">Find Recipes by Ingredients</h1>
        <p className="mb-12 text-center text-lg text-amber-200">Enter the ingredients you have on hand and discover delicious recipes you can make</p>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Search Panel */}
          <div className="lg:col-span-2 space-y-6 bg-gradient-to-br from-amber-900/90 to-amber-800/90 rounded-2xl border border-amber-500/30 p-6 shadow-xl backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-amber-100 mb-4">Your Ingredients</h2>
            
            {/* Ingredient Input */}
            <div className="mb-4">
              <label htmlFor="ingredient" className="mb-2 block font-medium text-amber-200">
                Add Ingredient
              </label>
              <div className="flex">
                <input
                  id="ingredient"
                  type="text"
                  value={currentIngredient}
                  onChange={(e) => setCurrentIngredient(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., Chicken, Rice, Tomatoes..."
                  className="w-full rounded-l-lg border border-amber-600/50 bg-amber-950/30 px-4 py-2 text-amber-100 placeholder-amber-400/70 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
                <button
                  onClick={addIngredient}
                  disabled={!currentIngredient.trim()}
                  className={`rounded-r-lg border border-l-0 border-amber-600 px-4 py-2 font-medium transition-all 
                    ${!currentIngredient.trim() 
                      ? 'bg-amber-800/30 text-amber-400/50 cursor-not-allowed' 
                      : 'bg-amber-600 text-white hover:bg-amber-700'}`}
                >
                  Add
                </button>
              </div>
            </div>

            {/* Common Ingredients Suggestions */}
            <div className="mb-6">
              <h3 className="mb-2 text-sm font-medium text-amber-200">Common Ingredients</h3>
              <div className="flex flex-wrap gap-2">
                {commonIngredients.map((ingredient) => (
                  <button
                    key={ingredient}
                    type="button"
                    className={`rounded-full ${ingredients.some(i => i.name.toLowerCase() === ingredient.toLowerCase()) 
                      ? 'bg-amber-600 text-white' 
                      : 'bg-amber-700/30 text-amber-100 hover:bg-amber-700/50'} 
                      px-3 py-1 text-sm transition-all transform hover:scale-105 duration-200`}
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
                      className="flex items-center rounded-full bg-amber-300/80 px-3 py-1 text-amber-950 font-medium shadow-sm"
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
                className="flex w-full items-center justify-between rounded-lg border border-amber-600/40 bg-amber-800/40 px-4 py-2 text-amber-100 hover:bg-amber-800/60 transition-all duration-200"
              >
                <span className="font-medium">Advanced Filters</span>
                {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {showFilters && (
                <div className="mt-4 space-y-4 rounded-lg border border-amber-600/30 bg-amber-900/50 p-4 shadow-inner">
                  {/* Dietary Preferences */}
                  <div>
                    <label className="mb-2 block font-medium text-amber-200">Dietary Preferences</label>
                    <div className="grid grid-cols-2 gap-2">
                      {dietaryOptions.map((option) => (
                        <div key={option.value} className="flex items-center">
                          <input
                            id={`dietary-${option.value}`}
                            type="checkbox"
                            checked={selectedDietary.includes(option.value)}
                            onChange={() => toggleDietary(option.value)}
                            className="h-4 w-4 rounded border-amber-600 bg-amber-950 text-amber-600 focus:ring-1 focus:ring-amber-500 focus:ring-offset-0"
                          />
                          <label
                            htmlFor={`dietary-${option.value}`}
                            className="ml-2 text-sm text-amber-100"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cuisine Type */}
                  <div>
                    <label htmlFor="cuisine" className="mb-2 block font-medium text-amber-200">
                      Cuisine Type
                    </label>
                    <select
                      id="cuisine"
                      value={selectedCuisine}
                      onChange={(e) => setSelectedCuisine(e.target.value as CuisineType | '')}
                      className="w-full rounded-lg border border-amber-600/50 bg-amber-950/40 px-4 py-2 text-amber-100 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    >
                      <option value="">Any Cuisine</option>
                      {cuisineOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Search Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={searchRecipes}
                disabled={ingredients.length === 0 || isLoading}
                className={`flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 font-medium shadow-md transition-all duration-300
                  ${ingredients.length === 0 || isLoading
                    ? 'bg-amber-700/40 text-amber-300/50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white hover:shadow-lg'}`}
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" /> Searching...
                  </>
                ) : (
                  <>
                    <SearchIcon size={18} /> Find Recipes
                  </>
                )}
              </button>
              <button
                onClick={clearSearch}
                disabled={ingredients.length === 0 && selectedDietary.length === 0 && !selectedCuisine}
                className={`rounded-lg border px-5 py-2.5 font-medium transition-all duration-300
                  ${ingredients.length === 0 && selectedDietary.length === 0 && !selectedCuisine
                    ? 'border-amber-700/30 text-amber-500/40 cursor-not-allowed'
                    : 'border-amber-500/50 text-amber-200 hover:bg-amber-800/40 hover:border-amber-400'}`}
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-3">
            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex h-64 flex-col items-center justify-center">
                <Spinner size="lg" className="text-amber-500" />
                <p className="mt-4 text-amber-200">Searching for delicious recipes...</p>
              </div>
            )}

            {/* No Results Message */}
            {results.length === 0 && hasSearched && !isLoading && (
              <div className="mx-auto rounded-xl bg-gradient-to-br from-amber-800/70 to-amber-900/70 border border-amber-500/30 p-8 text-center shadow-md backdrop-blur-sm">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-700/40 text-amber-400 mx-auto">
                  <SearchIcon size={32} />
                </div>
                <h2 className="mb-2 text-xl font-semibold text-white">No Recipes Found</h2>
                <p className="text-amber-200">
                  Try adding different ingredients or adjusting your filters to find more recipes.
                </p>
                <div className="mt-6">
                  <button
                    onClick={clearSearch}
                    className="rounded-lg border border-amber-500/50 bg-amber-800/40 px-4 py-2 text-amber-100 hover:bg-amber-800/60 transition-all duration-200"
                  >
                    Clear Search
                  </button>
                </div>
              </div>
            )}

            {/* Results Grid */}
            {results.length > 0 && (
              <div>
                <h2 className="mb-6 text-2xl font-bold text-amber-100">Recipe Results</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  {results.map((recipe) => (
                    <div 
                      key={recipe.id} 
                      className="group overflow-hidden rounded-xl bg-gradient-to-br from-amber-800/70 to-amber-900/70 border border-amber-500/30 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-amber-500/50 backdrop-blur-sm"
                      onClick={() => viewRecipeDetails(recipe)}
                    >
                      <div className="relative h-48 overflow-hidden">
                        {recipe.imageUrl ? (
                          <img
                            src={recipe.imageUrl}
                            alt={recipe.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-amber-700/40">
                            <Utensils size={48} className="text-amber-300/70" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-amber-950/90 to-transparent"></div>
                        <h3 className="absolute bottom-4 left-4 right-4 text-xl font-bold text-white">
                          {recipe.title}
                        </h3>
                      </div>
                      
                      <div className="p-4">
                        <p className="mb-4 text-amber-200 line-clamp-2">{recipe.description}</p>
                        
                        {/* Recipe Stats */}
                        <div className="mb-4 grid grid-cols-3 gap-2">
                          <div className="flex items-center text-amber-300">
                            <Clock size={16} className="mr-1" />
                            <span className="text-sm">{recipe.cookingTime} min</span>
                          </div>
                          <div className="flex items-center text-amber-300">
                            <Users size={16} className="mr-1" />
                            <span className="text-sm">{recipe.servings} servings</span>
                          </div>
                          <div className="flex items-center text-amber-300">
                            <Flame size={16} className="mr-1" />
                            <span className="text-sm">{recipe.calories} cal</span>
                          </div>
                        </div>
                        
                        {/* Dietary Info */}
                        <div className="mb-4 flex flex-wrap gap-2">
                          {recipe.dietaryInfo.isVegetarian && (
                            <span className="rounded-full bg-green-800/60 px-2 py-0.5 text-xs font-medium text-green-100">
                              Vegetarian
                            </span>
                          )}
                          {recipe.dietaryInfo.isVegan && (
                            <span className="rounded-full bg-green-700/60 px-2 py-0.5 text-xs font-medium text-green-100">
                              Vegan
                            </span>
                          )}
                          {recipe.dietaryInfo.isGlutenFree && (
                            <span className="rounded-full bg-yellow-700/60 px-2 py-0.5 text-xs font-medium text-yellow-100">
                              Gluten-Free
                            </span>
                          )}
                          {recipe.dietaryInfo.isDairyFree && (
                            <span className="rounded-full bg-blue-800/60 px-2 py-0.5 text-xs font-medium text-blue-100">
                              Dairy-Free
                            </span>
                          )}
                        </div>
                        
                        {/* Ingredients Preview */}
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-amber-200">Key Ingredients:</h4>
                          <p className="text-amber-100 text-sm line-clamp-1">
                            {recipe.ingredients.slice(0, 3).join(', ')}
                            {recipe.ingredients.length > 3 && ' and more...'}
                          </p>
                        </div>
                        
                        {/* View Details Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            viewRecipeDetails(recipe);
                          }}
                          className="w-full rounded-lg bg-amber-600/80 py-2 text-center font-medium text-white transition-all hover:bg-amber-600"
                        >
                          View Recipe
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Load More Button */}
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={loadMoreRecipes}
                    disabled={isLoadingMore}
                    className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-700 to-amber-800 px-6 py-3 font-medium text-white shadow-md hover:from-amber-600 hover:to-amber-700 transition-all duration-300"
                  >
                    {isLoadingMore ? (
                      <>
                        <Spinner size="sm" /> Loading More...
                      </>
                    ) : (
                      <>
                        <Plus size={18} /> Generate 3 More Recipes
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeFinder;
