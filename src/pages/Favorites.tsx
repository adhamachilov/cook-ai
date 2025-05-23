import React from 'react';
import { useRecipes } from '../context/RecipeContext';
import RecipeCard from '../components/ui/RecipeCard';
/* Recipe types are handled by RecipeCard */
import { Heart } from 'lucide-react';

const Favorites: React.FC = () => {
  const { favoriteRecipes } = useRecipes();
  // Recipe cards now navigate directly to recipe detail pages

  return (
    <div className="pb-20 pt-24 relative">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl text-amber-100">Your Favorite Recipes</h1>
          <p className="mx-auto max-w-2xl text-lg text-amber-200/90">
            All your saved recipes in one place
          </p>
        </div>

        {/* Favorites Content */}
        {favoriteRecipes.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                className="animate-fadeIn"
              />
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-12 max-w-md rounded-lg bg-gradient-to-br from-amber-800/70 to-amber-900/70 backdrop-blur-md border border-amber-500/30 p-8 text-center shadow-md">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-amber-400 mx-auto">
              <Heart size={32} />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-white">No Favorites Yet</h2>
            <p className="text-white/80">
              You haven't saved any recipes to your favorites yet. Explore recipes and click the heart icon to save them for later.
            </p>
          </div>
        )}

        {/* No modal needed - using individual recipe pages now */}
      </div>
    </div>
  );
};

export default Favorites;