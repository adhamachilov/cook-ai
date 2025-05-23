import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Users, Flame, ArrowLeft, Heart } from 'lucide-react';
import { useRecipes } from '../context/RecipeContext';
import { Recipe } from '../types';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const RecipeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { recipes, isFavorite, addToFavorites, removeFromFavorites } = useRecipes();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && recipes) {
      const foundRecipe = recipes.find(r => r.id === id);
      setRecipe(foundRecipe || null);
    }
    setLoading(false);
  }, [id, recipes]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <h2 className="mb-4 text-2xl font-bold text-amber-200">Recipe Not Found</h2>
        <p className="mb-6 text-white">The recipe you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

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
    <div className="flex min-h-screen items-center justify-center pb-20 pt-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative mx-auto max-w-2xl rounded-xl bg-amber-900/90 shadow-xl overflow-hidden">
          {/* Back Button - Outside the card */}
          <div className="absolute left-4 top-4 z-10">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)} 
              className="flex items-center text-amber-200"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back
            </Button>
          </div>
          
          {/* Recipe Image - Similar to plant image */}
          <div className="relative h-[280px] w-full">
            <img 
              src={recipe.imageUrl} 
              alt={recipe.title} 
              className="h-full w-full object-cover"
            />
            <button
              onClick={handleFavoriteClick}
              className="absolute right-4 top-4 rounded-full bg-amber-700/80 p-3 text-amber-200 shadow-md transition-colors hover:bg-amber-600/80"
              aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart 
                size={24} 
                className={favorite ? 'fill-amber-300 text-amber-300' : 'text-amber-200/70'} 
              />
            </button>
          </div>
          
          {/* Main Content */}
          <div className="p-6">
            {/* Recipe Title and Cuisine - Like plant name and scientific name */}
            <div className="border-b border-amber-700/50 pb-4 mb-5">
              <h1 className="text-3xl font-bold text-amber-200">{recipe.title}</h1>
              <p className="text-amber-400/80 text-sm italic">{recipe.cuisineType} Cuisine</p>
            </div>
            
            {/* Recipe Description */}
            <p className="text-white mb-6">{recipe.description}</p>
            
            {/* Recipe Stats - Similar to water/sunlight/temperature in plant card */}
            <div className="space-y-4 mb-6 border-b border-amber-700/50 pb-6">
              <div className="space-y-1">
                <p className="text-amber-300 font-medium">Cooking Time</p>
                <div className="flex items-center">
                  <Clock className="text-amber-500 mr-3" size={18} />
                  <div className="w-full bg-amber-950/50 h-2 rounded-full">
                    <div 
                      className="bg-amber-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, (recipe.cookingTime / 120) * 100)}%` }}
                    ></div>
                  </div>
                  <span className="ml-3 text-white min-w-[60px] text-right">{recipe.cookingTime} min</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-amber-300 font-medium">Servings</p>
                <div className="flex items-center">
                  <Users className="text-amber-500 mr-3" size={18} />
                  <div className="w-full flex">
                    {[...Array(Math.min(5, recipe.servings))].map((_, i) => (
                      <div key={i} className="h-2 w-2 bg-amber-500 rounded-full mr-1"></div>
                    ))}
                    {recipe.servings > 5 && <span className="text-amber-400 text-xs ml-1">+{recipe.servings - 5}</span>}
                  </div>
                  <span className="ml-3 text-white min-w-[60px] text-right">{recipe.servings}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-amber-300 font-medium">Calories</p>
                <div className="flex items-center">
                  <Flame className="text-amber-500 mr-3" size={18} />
                  <div className="w-full bg-amber-950/50 h-2 rounded-full">
                    <div 
                      className="bg-amber-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(100, (recipe.calories / 1000) * 100)}%` }}
                    ></div>
                  </div>
                  <span className="ml-3 text-white min-w-[60px] text-right">{recipe.calories} cal</span>
                </div>
              </div>
            </div>
            
            {/* Care Instructions (Dietary & Ingredients) - Like the Care Instructions in plant card */}
            <div className="mb-6 border-b border-amber-700/50 pb-6">
              <h2 className="text-xl font-semibold text-amber-200 mb-4">Preparation Information</h2>
              
              {/* Dietary Info */}
              {dietaryBadges.length > 0 && (
                <div className="mb-4">
                  <p className="text-amber-300 font-medium mb-2">Dietary Information</p>
                  <div className="flex flex-wrap gap-2">
                    {dietaryBadges.map((badge) => (
                      <Badge key={badge} variant="primary">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Ingredients */}
              <div className="mb-4">
                <p className="text-amber-300 font-medium mb-2">Ingredients</p>
                <ul className="space-y-2 text-white">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Instructions - Like the Care Instructions in plant card */}
            <div className="mb-6 border-b border-amber-700/50 pb-6">
              <h2 className="text-xl font-semibold text-amber-200 mb-4">Cooking Instructions</h2>
              <ol className="space-y-3 text-white">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-700 text-amber-100 text-xs">
                      {index + 1}
                    </span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
            
            {/* Interesting Facts - Like the Interesting Facts in plant card */}
            <div className="mb-6 border-b border-amber-700/50 pb-6">
              <div className="flex items-center mb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-700 mr-2">
                  <span className="text-amber-200 text-sm">i</span>
                </span>
                <h2 className="text-xl font-semibold text-amber-200">Interesting Facts</h2>
              </div>
              <ul className="space-y-2 text-white">
                <li className="flex items-start">
                  <span className="mr-2 mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                  <span>Best served fresh with family and friends</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                  <span>Pairs well with a side of fresh green salad</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                  <span>This dish originated from traditional {recipe.cuisineType} cooking</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                  <span>Can be prepared ahead and reheated when needed</span>
                </li>
              </ul>
            </div>
            
            {/* Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="mb-6">
                <p className="text-amber-300 font-medium mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Action Buttons - Like Save/Share in the plant card */}
            <div className="flex space-x-4">
              <Button 
                onClick={handleFavoriteClick}
                variant={favorite ? 'primary' : 'outline'}
                className="flex-1 flex items-center justify-center"
              >
                <Heart className="mr-2" size={18} />
                {favorite ? 'Saved' : 'Save'}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
