import React from 'react';
import { useRecipes } from '../context/RecipeContext';
import RecipeCard from '../components/ui/RecipeCard';
import { Recipe } from '../types';

const Popular: React.FC = () => {
  const { popularRecipes } = useRecipes();
  // Recipe cards now navigate directly to recipe detail pages

  return (
    <div className="pb-20 pt-24 relative">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold md:text-4xl text-amber-100">Popular Recipes</h1>
          <p className="mx-auto max-w-2xl text-lg text-amber-200/90">
            Discover our most loved recipes that have been enjoyed by thousands of home cooks
          </p>
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {popularRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              className="animate-fadeIn"
            />
          ))}
        </div>

        {/* No modal needed - using individual recipe pages now */}
      </div>
    </div>
  );
};

export default Popular;