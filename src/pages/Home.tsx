import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Utensils, Heart, Camera } from 'lucide-react';
import RecipeCard from '../components/ui/RecipeCard';
import { useRecipes } from '../context/RecipeContext';
import { motion } from 'framer-motion';
import PageTransition from '../components/ui/PageTransition';

const Home: React.FC = () => {
  const { popularRecipes } = useRecipes();

  return (
    <PageTransition>
      {/* Hero Section with clearly separated subtitle and COOK AI title */}
      <section className="min-h-[90vh] flex flex-col relative overflow-hidden">
        {/* Top subtitle section - positioned closer to title */}
        <div className="pt-12 pb-4">
          <div className="container mx-auto px-4 text-center">
            <motion.p 
              className="text-amber-400 max-w-2xl mx-auto font-medium text-xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Finding recipes is easy with our three simple steps
            </motion.p>
          </div>
        </div>
        
        {/* Balanced spacer between subtitle and title */}
        <div className="h-10"></div>
        
        {/* COOK AI title section - positioned much lower */}
        <div className="flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            {/* Main Title with 3D pizza models as 'O's */}
            <div className="mb-4">
              {/* Large text version for all screen sizes */}
              <h1 className="text-9xl md:text-[15rem] font-extrabold tracking-tighter text-white">
                {/* On small devices, show only the text */}
                <div className="md:hidden">
                  COOK AI
                </div>
                {/* On medium and larger devices, show text with 3D models */}
                <div className="hidden md:flex items-center justify-center" style={{ gap: '0' }}>
                  <motion.span 
                    style={{ transform: 'translateY(-160px)', display: 'inline-block', color: '#FFFFFF' }}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
                  >
                    C
                  </motion.span>
                  
                  {/* First pizza 'O' */}
                  <motion.div 
                    style={{ 
                      width: '250px', 
                      height: '140px',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: 'translateY(-160px)' // User's preferred higher position
                    }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 100 }}
                  >
                    <iframe 
                      src="/simple-pizza.html" 
                      style={{ 
                        width: '520px', 
                        height: '400px', 
                        border: 'none', 
                        overflow: 'hidden'
                      }}
                      title="Pizza 3D Model 1" 
                      allow="autoplay" 
                    />
                  </motion.div>
                  
                  {/* Second pizza 'O' */}
                  <motion.div 
                    style={{ 
                      width: '250px', 
                      height: '140px',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: 'translateY(-160px)' // User's preferred higher position
                    }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4, type: 'spring', stiffness: 100 }}
                  >
                    <iframe 
                      src="/simple-pizza.html" 
                      style={{ 
                        width: '520px', 
                        height: '400px', 
                        border: 'none', 
                        overflow: 'hidden'
                      }}
                      title="Pizza 3D Model 2" 
                      allow="autoplay" 
                    />
                  </motion.div>
                  
                  <motion.span 
                    style={{ transform: 'translateY(-160px)', display: 'inline-block', color: '#FFE0B2' }}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, type: 'spring', stiffness: 100 }}
                  >
                    K AI
                  </motion.span>
                </div>
              </h1>
            </div>
            
            {/* Action Buttons - Smaller and positioned higher */}
            <motion.div 
              className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 max-w-xl mx-auto mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <div className="flex-1">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/search" className="bg-amber-500 hover:bg-amber-600 text-white rounded-full py-3 px-6 font-medium text-base flex items-center justify-center space-x-2 shadow-md transition-all duration-300 w-full">
                    <Search className="h-5 w-5" />
                    <span>Find Recipes</span>
                  </Link>
                </motion.div>
              </div>
              <div className="flex-1">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/popular" className="bg-amber-500 hover:bg-amber-600 text-white rounded-full py-3 px-6 font-medium text-base flex items-center justify-center space-x-2 shadow-md transition-all duration-300 w-full">
                    <Utensils className="h-5 w-5" />
                    <span>Browse</span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Food Pattern Background */}
        <div className="absolute inset-0 z-0 opacity-5 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-repeat animate-pulse" style={{ backgroundImage: 'url(/patterns/food-pattern.svg)', animation: 'pulse 8s infinite ease-in-out' }}></div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 -left-16 w-32 h-32 bg-amber-400 rounded-full opacity-30 blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-16 w-32 h-32 bg-amber-400 rounded-full opacity-30 blur-3xl"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-transparent">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="mx-auto mb-12 max-w-3xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl text-white">How CookAI Works</h2>
            <p className="text-white/70">
              Turn your available ingredients into delicious recipes with our AI-powered system.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="p-6 border border-white/20 rounded-xl bg-white/10 backdrop-blur-md text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="mb-4 mx-auto w-12 h-12 bg-amber-400/20 text-amber-400 flex items-center justify-center rounded-full">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white">Take a Photo</h3>
              <p className="text-white/70">
                Snap a picture of your ingredients and let our AI identify them for you
              </p>
            </motion.div>
            <motion.div 
              className="p-6 border border-white/20 rounded-xl bg-white/10 backdrop-blur-md text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="mb-4 mx-auto w-12 h-12 bg-amber-400/20 text-amber-400 flex items-center justify-center rounded-full">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white">Get Matched</h3>
              <p className="text-white/70">
                Our AI matches your ingredients with thousands of delicious recipes
              </p>
            </motion.div>
            <motion.div 
              className="p-6 border border-white/20 rounded-xl bg-white/10 backdrop-blur-md text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="mb-4 mx-auto w-12 h-12 bg-amber-400/20 text-amber-400 flex items-center justify-center rounded-full">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white">Start Cooking</h3>
              <p className="text-white/70">
                Follow step-by-step instructions and enjoy your homemade meal
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Recipes Section */}
      <section className="py-16 bg-transparent">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white mb-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Explore Popular Recipes
            </motion.h2>
            <p className="max-w-2xl mx-auto text-white/70">
              Discover what other people are cooking with ingredients similar to yours
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {popularRecipes.slice(0, 3).map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
              >
                <RecipeCard recipe={recipe} />
              </motion.div>
            ))}
          </motion.div>
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/recipes" className="bg-amber-500 hover:bg-amber-600 text-white rounded-full py-3 px-8 inline-flex items-center font-medium">
                <span>View All Recipes</span>
                <motion.svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 ml-2" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                  initial={{ x: -3, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.3 }}
                  whileHover={{ x: 3 }}
                >
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </motion.svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Home;
