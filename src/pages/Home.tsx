import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Utensils, Heart, Camera } from 'lucide-react';
import RecipeCard from '../components/ui/RecipeCard';
import { useRecipes } from '../context/RecipeContext';

const Home: React.FC = () => {
  const { popularRecipes } = useRecipes();

  return (
    <>
      {/* Hero Section with clearly separated subtitle and COOK AI title */}
      <section className="min-h-[100vh] flex flex-col relative overflow-hidden">
        {/* Top subtitle section - positioned closer to title */}
        <div className="pt-12 pb-4">
          <div className="container mx-auto px-4 text-center">
            <p className="text-amber-400 max-w-2xl mx-auto font-medium text-xl">
              Finding recipes is easy with our three simple steps
            </p>
          </div>
        </div>
        
        {/* Balanced spacer between subtitle and title */}
        <div className="h-24"></div>
        
        {/* COOK AI title section - positioned much lower */}
        <div className="flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            {/* Main Title with 3D pizza models as 'O's */}
            <div className="mb-4">
              <h1 className="text-9xl md:text-[15rem] font-extrabold tracking-tighter text-white">
                <div className="flex items-center justify-center" style={{ gap: '0' }}>
                  <span style={{ transform: 'translateY(-75px)', display: 'inline-block', color: '#FFFFFF' }}>C</span>
                  
                  {/* First pizza 'O' */}
                  <div style={{ 
                    width: '250px', 
                    height: '140px',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: 'translateY(-75px)' // User's preferred high position
                  }}>
                    <iframe 
                      src="/simple-pizza.html" 
                      style={{ 
                        width: '450px', 
                        height: '350px', 
                        border: 'none', 
                        overflow: 'hidden'
                      }}
                      title="Pizza 3D Model 1" 
                      allow="autoplay" 
                    />
                  </div>
                  
                  {/* Second pizza 'O' */}
                  <div style={{ 
                    width: '250px', 
                    height: '140px',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: 'translateY(-75px)' // User's preferred high position
                  }}>
                    <iframe 
                      src="/simple-pizza.html" 
                      style={{ 
                        width: '450px', 
                        height: '350px', 
                        border: 'none', 
                        overflow: 'hidden'
                      }}
                      title="Pizza 3D Model 2" 
                      allow="autoplay" 
                    />
                  </div>
                  
                  <span style={{ transform: 'translateY(-75px)', display: 'inline-block', color: '#FFE0B2' }}>K AI</span>
                </div>
              </h1>
            </div>
            
            {/* Action Buttons - Smaller and positioned higher */}
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 max-w-xl mx-auto -mt-8">
              <Link to="/upload" className="flex-1 bg-amber-500 hover:bg-amber-600 text-white rounded-full py-3 px-6 font-medium text-base flex items-center justify-center space-x-2 shadow-md transition-all duration-300 hover:scale-105">
                <Camera className="h-5 w-5" />
                <span>Upload Ingredients</span>
              </Link>
              <Link to="/search" className="flex-1 bg-amber-500 hover:bg-amber-600 text-white rounded-full py-3 px-6 font-medium text-base flex items-center justify-center space-x-2 shadow-md transition-all duration-300 hover:scale-105">
                <Search className="h-5 w-5" />
                <span>Search Recipes</span>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Food Pattern Background */}
        {/* Food Pattern Background with subtle animation */}
        <div className="absolute inset-0 z-0 opacity-5 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-repeat animate-pulse" style={{ backgroundImage: 'url(/patterns/food-pattern.svg)', animation: 'pulse 8s infinite ease-in-out' }}></div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 -left-16 w-32 h-32 bg-amber-400 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-16 w-32 h-32 bg-amber-400 rounded-full opacity-30 blur-3xl"></div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-transparent">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl text-white">How CookAI Works</h2>
            <p className="text-white/70">
              Turn your available ingredients into delicious recipes with our AI-powered system.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-6 border border-white/20 rounded-xl bg-white/10 backdrop-blur-md text-center">
              <div className="mb-4 mx-auto w-12 h-12 bg-amber-400/20 text-amber-400 flex items-center justify-center rounded-full">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white">Take a Photo</h3>
              <p className="text-white/70">
                Snap a picture of your ingredients and let our AI identify them for you
              </p>
            </div>
            <div className="p-6 border border-white/20 rounded-xl bg-white/10 backdrop-blur-md text-center">
              <div className="mb-4 mx-auto w-12 h-12 bg-amber-400/20 text-amber-400 flex items-center justify-center rounded-full">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white">Get Matched</h3>
              <p className="text-white/70">
                Our AI matches your ingredients with thousands of delicious recipes
              </p>
            </div>
            <div className="p-6 border border-white/20 rounded-xl bg-white/10 backdrop-blur-md text-center">
              <div className="mb-4 mx-auto w-12 h-12 bg-amber-400/20 text-amber-400 flex items-center justify-center rounded-full">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white">Start Cooking</h3>
              <p className="text-white/70">
                Follow step-by-step instructions and enjoy your homemade meal
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Recipes Section */}
      <section className="py-24 bg-transparent">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold md:text-4xl text-white">Popular Recipes</h2>
            <p className="mt-4 max-w-2xl mx-auto text-white/70">
              Discover what other people are cooking with ingredients similar to yours
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularRecipes.slice(0, 3).map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/recipes" className="bg-amber-500 hover:bg-amber-600 text-white rounded-full py-3 px-8 inline-flex items-center font-medium">
              <span>View All Recipes</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
