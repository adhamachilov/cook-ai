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
  const { recipes, popularRecipes, addToFavorites, removeFromFavorites, isFavorite } = useRecipes();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState<boolean>(false);

  // Set initial favorite status
  useEffect(() => {
    if (recipe) {
      setLiked(isFavorite(recipe.id));
    }
  }, [recipe, isFavorite]);

  useEffect(() => {
    if (id) {
      // Check in all possible recipe sources: search results and popular recipes
      const foundRecipe = 
        recipes.find(r => r.id === id) || 
        popularRecipes.find(r => r.id === id);
      
      setRecipe(foundRecipe || null);
    }
    setLoading(false);
  }, [id, recipes, popularRecipes]);

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

  const handleLikeClick = () => {
    if (!recipe) return;
    
    if (liked) {
      removeFromFavorites(recipe.id);
    } else {
      addToFavorites(recipe);
    }
    
    setLiked(!liked);
  };

  const dietaryBadges = [];
  if (recipe.dietaryInfo.isVegetarian) dietaryBadges.push('Vegetarian');
  if (recipe.dietaryInfo.isVegan) dietaryBadges.push('Vegan');
  if (recipe.dietaryInfo.isGlutenFree) dietaryBadges.push('Gluten-Free');
  if (recipe.dietaryInfo.isDairyFree) dietaryBadges.push('Dairy-Free');

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900/90 to-amber-950/90 text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Back button */}
        <div className="max-w-5xl mx-auto px-2 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-amber-300 hover:text-amber-200 transition-colors group"
          >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to recipes
          </button>
        </div>

        {/* Recipe content wrapper */}
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Recipe Header Card */}
          <div className="bg-gradient-to-br from-amber-800/70 to-amber-900/70 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl border border-amber-500/30">
            {/* Header with title and favorite button */}
            <div className="p-6 border-b border-amber-700/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-amber-100">
                  {recipe.title}
                </h1>
                <button
                  onClick={handleLikeClick}
                  className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                    liked
                      ? 'bg-amber-600/90 text-amber-100'
                      : 'bg-amber-800/70 text-amber-200/80 hover:bg-amber-700/80'
                  } transition-colors whitespace-nowrap`}
                  aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart size={18} className={liked ? 'fill-current' : ''} />
                  {liked ? 'Saved' : 'Save Recipe'}
                </button>
              </div>
              
              {/* Cuisine and dietary tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="secondary">{recipe.cuisineType}</Badge>
                {dietaryBadges.map((badge) => (
                  <Badge key={badge} variant="primary">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Recipe stats */}
            <div className="p-6 border-b border-amber-700/50">
              <div className="grid grid-cols-3 gap-4 bg-gradient-to-br from-amber-800/50 to-amber-900/50 p-4 rounded-xl border border-amber-500/30">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-amber-700/80 p-2 rounded-full mb-2">
                    <Clock className="text-amber-200" size={20} />
                  </div>
                  <p className="text-amber-200 font-medium text-sm">Cooking Time</p>
                  <span className="text-white text-lg">{recipe.cookingTime} min</span>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="bg-amber-700/80 p-2 rounded-full mb-2">
                    <Users className="text-amber-200" size={20} />
                  </div>
                  <p className="text-amber-200 font-medium text-sm">Servings</p>
                  <span className="text-white text-lg">{recipe.servings}</span>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="bg-amber-700/80 p-2 rounded-full mb-2">
                    <Flame className="text-amber-200" size={20} />
                  </div>
                  <p className="text-amber-200 font-medium text-sm">Calories</p>
                  <span className="text-white text-lg">{recipe.calories}</span>
                </div>
              </div>
            </div>
            
            {/* Recipe Description */}
            <div className="p-6">
              <p className="text-white mb-6">{recipe.description}</p>
            </div>
            
            {/* Action Buttons */}
            <div className="px-6 pb-6">
              <div className="flex space-x-4">
                <Button 
                  onClick={handleLikeClick}
                  variant={liked ? 'primary' : 'outline'}
                  className="flex-1 flex items-center justify-center transition-transform hover:scale-105"
                >
                  <Heart className="mr-2" size={18} />
                  {liked ? 'Saved' : 'Save Recipe'}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 flex items-center justify-center transition-transform hover:scale-105"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: recipe.title,
                        text: `Check out this delicious ${recipe.title} recipe from CookAI!`,
                        url: window.location.href
                      })
                      .catch(error => console.log('Error sharing:', error));
                    } else {
                      // Fallback for browsers that don't support the Web Share API
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                  Share
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main Content Container */}
          <div className="bg-gradient-to-br from-amber-800/70 to-amber-900/70 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl border border-amber-500/30">
            <div className="p-6 space-y-6">
              {/* Ingredients Section */}
              <div className="bg-amber-900/90 p-6 rounded-xl">
                <h2 className="text-xl font-semibold text-amber-200 mb-4 border-b border-amber-700/50 pb-2">Ingredients</h2>
                <ul className="space-y-2 text-white">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Instructions Section */}
              <div className="bg-amber-900/90 p-6 rounded-xl">
                <h2 className="text-xl font-semibold text-amber-200 mb-4 border-b border-amber-700/50 pb-2">Instructions</h2>
                <ol className="space-y-4 text-white">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-700 text-amber-100 text-sm mt-0.5">
                        {index + 1}
                      </span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            
              {/* Dietary Info */}
              {dietaryBadges.length > 0 && (
                <div className="bg-amber-900/90 p-6 rounded-xl">
                  <h3 className="text-lg font-medium text-amber-200 mb-3">Dietary Information</h3>
                  <div className="flex flex-wrap gap-2">
                    {dietaryBadges.map((badge) => (
                      <Badge key={badge} variant="primary">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Cooking Tips */}
              <div className="bg-amber-900/90 p-6 rounded-xl">
                <h3 className="text-lg font-medium text-amber-200 mb-3">Cooking Tips</h3>
                <ul className="space-y-2">
                  <li className="flex items-start text-white">
                    <span className="mr-2 mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                    <span>Cook over medium heat for best results</span>
                  </li>
                  <li className="flex items-start text-white">
                    <span className="mr-2 mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                    <span>Stir occasionally to prevent sticking</span>
                  </li>
                  <li className="flex items-start text-white">
                    <span className="mr-2 mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                    <span>Allow to rest before serving</span>
                  </li>
                </ul>
              </div>
              
              {/* Interesting Facts */}
              <div className="bg-amber-900/90 p-6 rounded-xl">
                <div className="flex items-center mb-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-700 mr-2">
                    <span className="text-amber-200 text-sm">i</span>
                  </span>
                  <h3 className="text-lg font-medium text-amber-200">Interesting Facts</h3>
                </div>
                <ul className="space-y-2 text-white text-sm">
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
                <div className="bg-amber-900/90 p-6 rounded-xl">
                  <h3 className="text-lg font-medium text-amber-200 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Additional Info */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-amber-200 mb-4">Additional Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Preparation Time */}
                  <div className="bg-amber-900/90 p-6 rounded-xl">
                    <p className="text-amber-300 font-medium mb-3 text-center">Preparation Time</p>
                    <div className="space-y-3">
                      <div className="flex items-center text-white">
                        <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                        <span>Prep Time: 15 minutes</span>
                      </div>
                      <div className="flex items-center text-white">
                        <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                        <span>Cook Time: {recipe.cookingTime - 15} minutes</span>
                      </div>
                      <div className="flex items-center text-white">
                        <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                        <span>Difficulty: Medium</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Equipment Needed */}
                  <div className="bg-amber-900/90 p-6 rounded-xl">
                    <p className="text-amber-300 font-medium mb-3 text-center">Equipment Needed</p>
                    <div className="space-y-3">
                      <div className="flex items-center text-white">
                        <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                        <span>Medium sized pan</span>
                      </div>
                      <div className="flex items-center text-white">
                        <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                        <span>Mixing bowl</span>
                      </div>
                      <div className="flex items-center text-white">
                        <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                        <span>Measuring cups</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Storage Tips */}
                  <div className="bg-amber-900/90 p-6 rounded-xl">
                    <p className="text-amber-300 font-medium mb-3 text-center">Storage Tips</p>
                    <div className="space-y-3">
                      <div className="flex items-center text-white">
                        <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                        <span>Store in refrigerator for up to 3 days</span>
                      </div>
                      <div className="flex items-center text-white">
                        <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                        <span>Freezable for up to 1 month</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
