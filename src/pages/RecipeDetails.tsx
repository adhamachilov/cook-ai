import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Clock, Users, Flame, ArrowLeft, Share2, Utensils, Tag } from 'lucide-react';
import { useRecipes } from '../context/RecipeContext';
import { Recipe } from '../types';
import Spinner from '../components/ui/Spinner';
import { supabase } from '../services/supabase-minimal';

const RecipeDetails: React.FC = () => {
  const { recipeId } = useParams<{ recipeId: string }>();
  const navigate = useNavigate();
  const { recipes, favoriteRecipes, addToFavorites, removeFromFavorites, isFavorite } = useRecipes();
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  // Find the recipe by ID - fetch directly from Supabase
  useEffect(() => {
    if (!recipeId) return;
    
    const fetchRecipe = async () => {
      setLoading(true);
      try {
        // Try to find the recipe in context first (for speed)
        let foundRecipe = recipes.find(r => r.id === recipeId) ||
                         favoriteRecipes.find(r => r.id === recipeId);
        
        if (foundRecipe) {
          setRecipe(foundRecipe);
        } else {
          // If not in context, fetch from the new Supabase project
          console.log('Fetching recipe from new Supabase:', recipeId);
          const { data, error } = await supabase
            .from('recipes')
            .select('*')
            .eq('id', recipeId);
          
          if (error) {
            throw new Error(`Failed to fetch from Supabase: ${error.message}`);
          }
          
          if (data && data.length > 0) {
            console.log('Found recipe in new Supabase:', data[0]);
            
            // Convert from database format (lowercase fields) to Recipe format (camelCase)
            const dbRecipe = data[0];
            
            // Parse JSON strings for ingredients and instructions
            const ingredients = typeof dbRecipe.ingredients === 'string' 
              ? JSON.parse(dbRecipe.ingredients) 
              : [];
              
            const instructions = typeof dbRecipe.instructions === 'string' 
              ? JSON.parse(dbRecipe.instructions) 
              : [];
            
            // Create a properly formatted Recipe object
            const formattedRecipe: Recipe = {
              id: dbRecipe.id,
              title: dbRecipe.title,
              ingredients: ingredients,
              instructions: instructions,
              description: dbRecipe.description || '',
              imageUrl: '',
              cookingTime: dbRecipe.cookingtime || 30, // note lowercase db field
              calories: dbRecipe.calories || 0,
              servings: dbRecipe.servings || 0,
              likes: dbRecipe.likes || 0,
              cuisineType: dbRecipe.cuisinetype || '', // note lowercase db field
              tags: [],
              dietaryInfo: {
                isVegetarian: false,
                isVegan: false,
                isGlutenFree: false,
                isDairyFree: false
              }
            };
            
            setRecipe(formattedRecipe);
          } else {
            console.error('Recipe not found in new Supabase');
            setError(true);
          }
        }
      } catch (error) {
        console.error('Error fetching recipe:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecipe();
  }, [recipeId, recipes, favoriteRecipes]);
  
  // Toggle favorite status
  const handleToggleFavorite = async () => {
    if (!recipe) return;
    
    if (isFavorite(recipe.id)) {
      removeFromFavorites(recipe.id);
    } else {
      addToFavorites(recipe);
    }
    
    // Calculate new likes count
    const newLikesCount = (recipe.likes || 0) + 1;
    
    // Also update likes in Supabase using our client
    try {
      const { data, error } = await supabase
        .from('recipes')
        .update({ likes: newLikesCount })
        .eq('id', recipe.id);
      
      if (error) {
        console.error('Error updating likes in Supabase:', error);
      } else {
        console.log('Successfully updated likes for recipe:', recipe.id, 'New count:', newLikesCount);
      }
    } catch (err) {
      console.error('Error updating likes:', err);
    }
  };
  
  // Share functionality
  const handleShare = () => {
    setShowShareDialog(true);
  };
  
  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setTimeout(() => setShowShareDialog(false), 1500);
  };

  return (
    <div className="min-h-screen bg-transparent text-white pb-8 relative">
      {/* Background pattern overlay - removed */}
      <div className="absolute inset-0 bg-transparent">
      </div>
      <div className="absolute inset-0 bg-transparent"></div>
      
      <div className="relative bg-transparent">
        {/* Loading spinner */}
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm z-50">
            <div className="text-center">
              <Spinner size="lg" className="text-white" />
              <p className="mt-2 text-amber-200">Loading recipe...</p>
            </div>
          </div>
        )}
        
        {/* Back button */}
        <div className="max-w-5xl mx-auto px-4 pt-6 bg-transparent">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 bg-transparent hover:bg-white/5 transition-colors rounded-full px-4 py-2 text-amber-200 border border-white/10"
          >
            <ArrowLeft size={18} />
            <span>Back to Recipes</span>
          </button>
        </div>
        
        {error ? (
          <div className="max-w-5xl mx-auto px-4 py-12 text-center">
            <div className="bg-gradient-to-b from-amber-800/70 to-amber-900/70 border border-amber-500/30 rounded-xl p-8 shadow-lg backdrop-blur-md max-w-md mx-auto">
              <Utensils size={48} className="mx-auto mb-4 text-amber-400" />
              <h2 className="mb-4 text-2xl font-bold text-amber-100">Recipe Not Found</h2>
              <p className="mb-6 text-amber-300">We couldn't find the recipe you're looking for.</p>
              <button
                onClick={() => navigate('/')}
                className="rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 px-5 py-2 font-medium text-white shadow-md hover:from-amber-500 hover:to-amber-600 transition-all"
              >
                Go Home
              </button>
            </div>
          </div>
        ) : recipe ? (
          <div className="max-w-5xl mx-auto px-4">
            {/* Single blurry container for all content */}
            <div className="bg-gradient-to-b from-amber-800/70 to-amber-900/70 border border-amber-500/30 rounded-xl shadow-lg backdrop-blur-md overflow-hidden mb-8 hover:bg-gradient-to-b hover:from-amber-800/80 hover:to-amber-900/80 transition-all duration-300">
              {/* Recipe header with hero image */}
              <div className="relative bg-transparent">
                {recipe.imageUrl ? (
                  <div className="relative h-[400px] bg-transparent">
                    <img 
                      src={recipe.imageUrl} 
                      alt={recipe.title} 
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                ) : (
                  <div className="h-[200px] bg-transparent flex items-center justify-center">
                    <Utensils size={80} className="text-amber-400/50" />
                  </div>
                )}
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-md">{recipe.title}</h1>
                      <p className="text-amber-300 text-lg">{recipe.cuisineType} Cuisine</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleShare}
                        className="flex items-center justify-center h-12 w-12 rounded-full bg-transparent backdrop-blur-sm text-white hover:bg-white/10 transition-all"
                        aria-label="Share recipe"
                      >
                        <Share2 size={20} />
                      </button>
                      <button
                        onClick={handleToggleFavorite}
                        className="flex items-center justify-center h-12 w-12 rounded-full bg-transparent backdrop-blur-sm text-white hover:bg-white/10 transition-all"
                        aria-label={isFavorite(recipe.id) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Heart size={20} className={isFavorite(recipe.id) ? 'fill-red-500 text-red-500' : ''} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Recipe content */}
              <div className="p-6 md:p-8">
                {/* Recipe quick stats */}
                <div className="flex justify-between border-b border-white/10 py-6 mb-10">
                  <div className="flex flex-col items-center">
                    <Clock size={24} className="text-amber-400 mb-1" />
                    <span className="text-lg font-medium text-amber-100">{recipe.cookingTime} mins</span>
                    <span className="text-xs text-amber-400">cooking time</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Users size={24} className="text-amber-400 mb-1" />
                    <span className="text-lg font-medium text-amber-100">{recipe.servings}</span>
                    <span className="text-xs text-amber-400">servings</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Flame size={24} className="text-amber-400 mb-1" />
                    <span className="text-lg font-medium text-amber-100">{recipe.calories}</span>
                    <span className="text-xs text-amber-400">calories</span>
                  </div>
                </div>
                
                {/* Recipe description */}
                <div className="mb-10">
                  <h2 className="text-xl font-semibold text-amber-100 mb-6 border-b border-white/10 pb-3">About This Recipe</h2>
                  <p className="text-amber-200 leading-relaxed">{recipe.description}</p>
                </div>
                
                {/* Dietary info */}
                <div className="mb-10">
                  <h2 className="text-xl font-semibold text-amber-100 mb-6 border-b border-white/10 pb-3">Dietary Information</h2>
                  <div className="flex flex-wrap gap-2">
                    {recipe.dietaryInfo && recipe.dietaryInfo.isVegetarian && (
                      <span className="rounded-full bg-green-900/60 border border-green-700/40 px-3 py-1 text-sm text-green-200">
                        Vegetarian
                      </span>
                    )}
                    {recipe.dietaryInfo && recipe.dietaryInfo.isVegan && (
                      <span className="rounded-full bg-green-900/60 border border-green-700/40 px-3 py-1 text-sm text-green-200">
                        Vegan
                      </span>
                    )}
                    {recipe.dietaryInfo && recipe.dietaryInfo.isGlutenFree && (
                      <span className="rounded-full bg-yellow-900/60 border border-yellow-700/40 px-3 py-1 text-sm text-yellow-200">
                        Gluten-Free
                      </span>
                    )}
                    {recipe.dietaryInfo && recipe.dietaryInfo.isDairyFree && (
                      <span className="rounded-full bg-blue-900/60 border border-blue-700/40 px-3 py-1 text-sm text-blue-200">
                        Dairy-Free
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Ingredients */}
                <div className="mb-10">
                  <h2 className="text-xl font-semibold text-amber-100 mb-6 border-b border-white/10 pb-3">Ingredients</h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start gap-2 text-amber-200">
                        <div className="h-5 w-5 mt-0.5 flex-shrink-0 rounded-full bg-amber-700/40 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-amber-300"></div>
                        </div>
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Instructions */}
                <div className="mb-10">
                  <h2 className="text-xl font-semibold text-amber-100 mb-6 border-b border-white/10 pb-3">Cooking Instructions</h2>
                  <ol className="space-y-4">
                    {recipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex gap-4">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-amber-700 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                          {index + 1}
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="text-amber-200">{instruction}</p>
                          {index < recipe.instructions.length - 1 && (
                            <div className="border-b border-white/5 mt-4"></div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
                
                {/* Tags */}
                {recipe.tags.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-3">
                      <Tag size={18} className="text-amber-400" />
                      <h2 className="text-xl font-semibold text-amber-100">Tags</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recipe.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="rounded-full bg-amber-800/40 border border-amber-600/30 px-3 py-1 text-sm text-amber-200 hover:bg-amber-700/40 transition-colors cursor-default"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
        
        {/* Share dialog */}
        {showShareDialog && (
          <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm z-50">
            <div className="bg-gradient-to-b from-amber-800/70 to-amber-900/70 rounded-xl p-6 w-full max-w-md mx-4 shadow-xl border border-amber-500/30 backdrop-blur-md">
              <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-3">Share This Recipe</h3>
              <div className="mb-4">
                <input 
                  type="text" 
                  value={window.location.href} 
                  readOnly 
                  className="w-full rounded-lg bg-black/20 px-4 py-3 text-amber-200 border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-500/50 backdrop-blur-sm"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowShareDialog(false)}
                  className="px-4 py-2 text-amber-300 hover:text-amber-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={copyShareLink}
                  className="rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 px-4 py-2 text-white hover:from-amber-500 hover:to-amber-600 transition-all shadow-md"
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeDetails;