import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Clock, Flame, Users, ThumbsUp } from 'lucide-react';
import { Recipe } from '../../types';
import Badge from './Badge';
import { cn } from '../../lib/utils';
import { useRecipes } from '../../context/RecipeContext';
import { motion } from 'framer-motion';

interface RecipeCardProps {
  recipe: Recipe;
  className?: string;
  onClick?: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, className, onClick }) => {
  const navigate = useNavigate();
  const { isFavorite, addToFavorites, removeFromFavorites, likeRecipe, getLikes } = useRecipes();
  const favorite = isFavorite(recipe.id);
  
  // Make sure likes always has a value (for recipes created before likes were added)
  const initialLikes = recipe.likes || 0;
  const [likeCount, setLikeCount] = useState(initialLikes);
  
  // Update like count when recipe changes - force likes to be visible
  useEffect(() => {
    // Always use the recipe likes count from the database if available
    // Otherwise fallback to local storage
    const newLikeCount = recipe.likes || getLikes(recipe.id) || 0;
    setLikeCount(newLikeCount);
  }, [recipe, getLikes]);
  
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/recipe/${recipe.id}`);
    }
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Toggle favorite status
    if (favorite) {
      removeFromFavorites(recipe.id);
    } else {
      addToFavorites(recipe);
    }
    
    // ALSO increment like count - this is what the user wants
    console.log('Liking recipe with heart button:', recipe.id);
    
    // Immediately update UI for better user experience
    setLikeCount(prevCount => prevCount + 1);
    
    try {
      // Direct API call to Supabase to update likes
      console.log('Updating likes for recipe ID:', recipe.id);
      const result = await fetch(`https://jcswgbrzelleyxfeckhr.supabase.co/rest/v1/recipes?id=eq.${recipe.id}`, {
        method: 'PATCH',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjc3dnYnJ6ZWxsZXl4ZmVja2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNzE3NDQsImV4cCI6MjA2Mzc0Nzc0NH0.EnBiPpGWrWKumER7eeFV3LAIyGQ0jzWEUq9KXzUCLA0',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjc3dnYnJ6ZWxsZXl4ZmVja2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNzE3NDQsImV4cCI6MjA2Mzc0Nzc0NH0.EnBiPpGWrWKumER7eeFV3LAIyGQ0jzWEUq9KXzUCLA0',
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ likes: likeCount + 1 })
      });
      
      if (!result.ok) {
        console.log('Recipe not found in database, creating it');
        // If update fails, create the recipe
        await fetch('https://jcswgbrzelleyxfeckhr.supabase.co/rest/v1/recipes', {
          method: 'POST',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjc3dnYnJ6ZWxsZXl4ZmVja2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNzE3NDQsImV4cCI6MjA2Mzc0Nzc0NH0.EnBiPpGWrWKumER7eeFV3LAIyGQ0jzWEUq9KXzUCLA0',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjc3dnYnJ6ZWxsZXl4ZmVja2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNzE3NDQsImV4cCI6MjA2Mzc0Nzc0NH0.EnBiPpGWrWKumER7eeFV3LAIyGQ0jzWEUq9KXzUCLA0',
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify({
            // Using snake_case for database columns
            id: recipe.id,
            title: recipe.title,
            description: recipe.description || '',
            // Convert camelCase to snake_case for these fields
            cooking_time: recipe.cookingTime || 0,
            servings: recipe.servings || 0,
            calories: recipe.calories || 0,
            ingredients: typeof recipe.ingredients === 'string' ? recipe.ingredients : JSON.stringify(recipe.ingredients || []),
            instructions: typeof recipe.instructions === 'string' ? recipe.instructions : JSON.stringify(recipe.instructions || []),
            tags: typeof recipe.tags === 'string' ? recipe.tags : JSON.stringify(recipe.tags || []),
            cuisine_type: recipe.cuisineType || '',
            dietary_info: typeof recipe.dietaryInfo === 'object' ? JSON.stringify(recipe.dietaryInfo || {}) : recipe.dietaryInfo,
            likes: 1
          })
        });
      }
      
      // Update likes in context too
      likeRecipe(recipe.id);
    } catch (error) {
      console.error('Error liking recipe:', error);
    }
  };

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Like button clicked for recipe:', recipe.id);
    
    // Immediately update UI for better user experience
    setLikeCount(prevCount => prevCount + 1);
    
    try {
      // Update likes in context (localStorage)
      likeRecipe(recipe.id);
      
      // First check if the recipe exists in the database
      const checkResponse = await fetch(`https://jcswgbrzelleyxfeckhr.supabase.co/rest/v1/recipes?id=eq.${recipe.id}&select=id,likes`, {
        method: 'GET',
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjc3dnYnJ6ZWxsZXl4ZmVja2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNzE3NDQsImV4cCI6MjA2Mzc0Nzc0NH0.EnBiPpGWrWKumER7eeFV3LAIyGQ0jzWEUq9KXzUCLA0',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjc3dnYnJ6ZWxsZXl4ZmVja2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNzE3NDQsImV4cCI6MjA2Mzc0Nzc0NH0.EnBiPpGWrWKumER7eeFV3LAIyGQ0jzWEUq9KXzUCLA0'
        }
      });
      
      const existingRecipes = await checkResponse.json();
      
      if (existingRecipes && existingRecipes.length > 0) {
        // Recipe exists, get the current likes and increment
        const currentLikes = existingRecipes[0].likes || 0;
        const newLikes = currentLikes + 1;
        console.log(`Recipe exists in DB with ${currentLikes} likes, updating to ${newLikes}`);
        
        // Update the likes count
        await fetch(`https://jcswgbrzelleyxfeckhr.supabase.co/rest/v1/recipes?id=eq.${recipe.id}`, {
          method: 'PATCH',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjc3dnYnJ6ZWxsZXl4ZmVja2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNzE3NDQsImV4cCI6MjA2Mzc0Nzc0NH0.EnBiPpGWrWKumER7eeFV3LAIyGQ0jzWEUq9KXzUCLA0',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjc3dnYnJ6ZWxsZXl4ZmVja2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNzE3NDQsImV4cCI6MjA2Mzc0Nzc0NH0.EnBiPpGWrWKumER7eeFV3LAIyGQ0jzWEUq9KXzUCLA0',
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({ likes: newLikes })
        });
      } else {
        // Recipe doesn't exist in database, create it with 1 like
        console.log('Recipe not found in database, creating it with 1 like');
        await fetch('https://jcswgbrzelleyxfeckhr.supabase.co/rest/v1/recipes', {
          method: 'POST',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjc3dnYnJ6ZWxsZXl4ZmVja2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNzE3NDQsImV4cCI6MjA2Mzc0Nzc0NH0.EnBiPpGWrWKumER7eeFV3LAIyGQ0jzWEUq9KXzUCLA0',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjc3dnYnJ6ZWxsZXl4ZmVja2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNzE3NDQsImV4cCI6MjA2Mzc0Nzc0NH0.EnBiPpGWrWKumER7eeFV3LAIyGQ0jzWEUq9KXzUCLA0',
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify({
            // Using snake_case for database columns
            id: recipe.id,
            title: recipe.title,
            description: recipe.description,
            // Convert camelCase to snake_case for these fields
            cooking_time: recipe.cookingTime,
            servings: recipe.servings,
            calories: recipe.calories,
            ingredients: typeof recipe.ingredients === 'string' ? recipe.ingredients : JSON.stringify(recipe.ingredients),
            instructions: typeof recipe.instructions === 'string' ? recipe.instructions : JSON.stringify(recipe.instructions),
            tags: typeof recipe.tags === 'string' ? recipe.tags : JSON.stringify(recipe.tags || []),
            cuisine_type: recipe.cuisineType,
            dietary_info: typeof recipe.dietaryInfo === 'object' ? JSON.stringify(recipe.dietaryInfo) : recipe.dietaryInfo,
            likes: 1
          })
        });
      }
    } catch (error) {
      console.error('Error liking recipe:', error);
      // Keep the incremented count since we already updated the UI
    }
  };

  const dietaryBadges = [];
  if (recipe.dietaryInfo && recipe.dietaryInfo.isVegetarian) dietaryBadges.push('Vegetarian');
  if (recipe.dietaryInfo && recipe.dietaryInfo.isVegan) dietaryBadges.push('Vegan');
  if (recipe.dietaryInfo && recipe.dietaryInfo.isGlutenFree) dietaryBadges.push('Gluten-Free');
  if (recipe.dietaryInfo && recipe.dietaryInfo.isDairyFree) dietaryBadges.push('Dairy-Free');

  return (
    <motion.div 
      className={cn(
        'card group cursor-pointer overflow-hidden bg-gradient-to-br from-amber-800/70 to-amber-900/70 backdrop-blur-md border border-amber-500/30 rounded-xl shadow-md h-full flex flex-col',
        className
      )}
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-amber-100 line-clamp-2">{recipe.title}</h3>
          <motion.button
            onClick={handleFavoriteClick}
            className="ml-2 flex-shrink-0 p-1.5 rounded-full bg-amber-900/50 hover:bg-amber-800/70 transition-colors"
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
          >
            <Heart 
              size={18} 
              className={cn(
                'transition-colors',
                favorite ? 'fill-amber-300 text-amber-300' : 'text-amber-200/70'
              )} 
            />
          </motion.button>
        </div>
        
        {recipe.description && (
          <p className="mb-4 text-amber-100/90 line-clamp-3 text-sm">
            {recipe.description}
          </p>
        )}
        
        <div className="mt-auto">
          <div className="mb-3 flex flex-wrap gap-1.5">
            {dietaryBadges.map((badge) => (
              <Badge key={badge} variant="primary" className="text-xs">
                {badge}
              </Badge>
            ))}
            <Badge variant="secondary" className="text-xs">
              {recipe.cuisineType}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm text-amber-300/90 border-t border-amber-700/50 pt-3">
            <div className="flex items-center gap-1.5">
              <Clock size={16} className="text-amber-300" />
              <span>{recipe.cookingTime} min</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Flame size={16} className="text-amber-300" />
              <span>{recipe.calories} cal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users size={16} className="text-amber-300" />
              <span>{recipe.servings} {recipe.servings === 1 ? 'serving' : 'servings'}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-end mt-2">
            <motion.button
              onClick={handleLikeClick}
              className="flex items-center gap-1 text-sm text-amber-300/90 hover:text-amber-300 transition-colors py-1 px-2 rounded-md hover:bg-amber-800/30"
              aria-label="Like this recipe"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                whileTap={{ rotate: [0, -20, 20, -20, 20, 0], transition: { duration: 0.5 } }}
              >
                <ThumbsUp size={16} className="text-amber-300" />
              </motion.div>
              <span>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RecipeCard;