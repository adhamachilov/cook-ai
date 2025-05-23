import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Clock, Flame, Users } from 'lucide-react';
import { Recipe } from '../../types';
import Badge from './Badge';
import { cn } from '../../lib/utils';
import { useRecipes } from '../../context/RecipeContext';

interface RecipeCardProps {
  recipe: Recipe;
  className?: string;
  onClick?: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, className, onClick }) => {
  const navigate = useNavigate();
  const { isFavorite, addToFavorites, removeFromFavorites } = useRecipes();
  const favorite = isFavorite(recipe.id);
  
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/recipe/${recipe.id}`);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorite) {
      removeFromFavorites(recipe.id);
    } else {
      addToFavorites(recipe);
    }
  };

  const dietaryBadges = [];
  if (recipe.dietaryInfo.isVegetarian) dietaryBadges.push('Vegetarian');
  if (recipe.dietaryInfo.isVegan) dietaryBadges.push('Vegan');
  if (recipe.dietaryInfo.isGlutenFree) dietaryBadges.push('Gluten-Free');
  if (recipe.dietaryInfo.isDairyFree) dietaryBadges.push('Dairy-Free');

  return (
    <div 
      className={cn(
        'card group cursor-pointer overflow-hidden bg-gradient-to-br from-amber-800/70 to-amber-900/70 backdrop-blur-md border border-amber-500/30 rounded-xl shadow-md transition-all hover:-translate-y-1 h-full flex flex-col',
        className
      )}
      onClick={handleCardClick}
    >
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-amber-100 line-clamp-2">{recipe.title}</h3>
          <button
            onClick={handleFavoriteClick}
            className="ml-2 flex-shrink-0 p-1.5 rounded-full bg-amber-900/50 hover:bg-amber-800/70 transition-colors"
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart 
              size={18} 
              className={cn(
                'transition-colors',
                favorite ? 'fill-amber-300 text-amber-300' : 'text-amber-200/70'
              )} 
            />
          </button>
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
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;