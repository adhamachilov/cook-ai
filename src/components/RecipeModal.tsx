import React from 'react';
import { X, Clock, Users, Flame } from 'lucide-react';
import { Recipe } from '../types';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { useRecipes } from '../context/RecipeContext';

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onClose }) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useRecipes();
  const favorite = isFavorite(recipe.id);

  const handleFavoriteClick = () => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-gradient-to-br from-amber-900/95 to-amber-950/95 shadow-xl border border-amber-500/30">
        {/* Close button */}
        <button 
          onClick={onClose} 
          className="absolute right-4 top-4 z-10 rounded-full bg-amber-700/80 p-2 text-amber-200 shadow-md transition-colors hover:bg-amber-600/80 hover:text-amber-100"
        >
          <X size={24} />
        </button>

        <div className="md:flex">
          {/* Recipe Image */}
          <div className="h-64 overflow-hidden md:h-auto md:w-1/2">
            <img 
              src={recipe.imageUrl} 
              alt={recipe.title} 
              className="h-full w-full object-cover md:h-full"
            />
          </div>

          {/* Recipe Content */}
          <div className="p-6 md:w-1/2">
            <h2 className="mb-2 text-2xl font-bold text-amber-200">{recipe.title}</h2>
            <p className="mb-4 text-white">{recipe.description}</p>

            {/* Recipe Info */}
            <div className="mb-6 grid grid-cols-3 gap-4 rounded-lg bg-amber-800/50 p-4 border border-amber-600/30">
              <div className="flex flex-col items-center text-center">
                <Clock size={20} className="mb-1 text-amber-500" />
                <span className="text-sm text-amber-300">Time</span>
                <span className="font-medium text-white">{recipe.cookingTime} min</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Users size={20} className="mb-1 text-amber-500" />
                <span className="text-sm text-amber-300">Servings</span>
                <span className="font-medium text-white">{recipe.servings}</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Flame size={20} className="mb-1 text-amber-500" />
                <span className="text-sm text-amber-300">Calories</span>
                <span className="font-medium text-white">{recipe.calories} cal</span>
              </div>
            </div>

            {/* Dietary Badges */}
            {dietaryBadges.length > 0 && (
              <div className="mb-4">
                <h3 className="mb-2 text-sm font-medium text-amber-200">Dietary Info:</h3>
                <div className="flex flex-wrap gap-2">
                  {dietaryBadges.map((badge) => (
                    <Badge key={badge} variant="primary">
                      {badge}
                    </Badge>
                  ))}
                  <Badge variant="secondary">{recipe.cuisineType}</Badge>
                </div>
              </div>
            )}

            {/* Ingredients */}
            <div className="mb-6">
              <h3 className="mb-3 text-lg font-semibold text-amber-200">Ingredients</h3>
              <ul className="list-inside list-disc space-y-1 text-white">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div className="mb-6">
              <h3 className="mb-3 text-lg font-semibold text-amber-200">Instructions</h3>
              <ol className="list-inside list-decimal space-y-3 text-white">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="ml-6">
                    <span className="ml-[-1.5rem]">{index + 1}.</span> {instruction}
                  </li>
                ))}
              </ol>
            </div>

            {/* Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-2 text-sm font-medium text-amber-200">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <Button 
                onClick={handleFavoriteClick}
                variant={favorite ? 'primary' : 'outline'}
              >
                {favorite ? 'Remove from Favorites' : 'Save to Favorites'}
              </Button>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;