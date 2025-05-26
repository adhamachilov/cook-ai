import React from 'react';
import { ChefHat, Clock, Star, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '../components/ui/PageTransition';
import '../styles/timeline-animations.css';

const About: React.FC = () => {
  // No state needed as all dots will pulse together
  return (
    <PageTransition>
      <div className="min-h-screen pb-20 pt-24 relative">
        {/* Header */}
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-amber-100 mb-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              About <motion.span 
                      className="text-amber-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      CookAI
                    </motion.span>
            </motion.h1>
            <motion.p 
              className="text-amber-200/90 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.7 }}
            >
              Connecting people with flavor through technology
            </motion.p>
          </motion.div>

          {/* Mission Section */}
          <div className="flex flex-col md:flex-row gap-6 sm:gap-8 md:gap-10 mb-12 sm:mb-16 md:mb-20 items-center">
            <div className="md:w-1/3 flex justify-center">
              <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-full bg-amber-200 flex items-center justify-center shadow-xl">
                <ChefHat className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-amber-700" />
              </div>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold text-amber-200 mb-3 md:mb-4 text-center md:text-left">Our Mission</h2>
              <p className="text-amber-100/90 mb-4">
                We believe in making culinary knowledge accessible to everyone, regardless of their expertise level. Our mission is to bridge the gap between technology and taste, helping people identify and learn about the dishes around them.
              </p>
              <p className="text-amber-100/90">
                Using advanced AI technology, we've created a platform that can identify dishes from a single image, providing accurate information about their ingredients, nutritional value, cooking methods, and cultural origins.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 sm:mb-16 md:mb-20">
            <div className="bg-gradient-to-br from-amber-800/80 to-amber-900/80 rounded-xl p-6 text-center shadow-md flex flex-col items-center border border-amber-500/30">
              <Star className="h-8 w-8 text-amber-400 mb-2" />
              <p className="text-lg font-semibold text-amber-200">High Accuracy</p>
              <p className="text-4xl font-bold text-amber-400 my-2">95%</p>
              <p className="text-amber-300 text-sm">Recognition Rate</p>
            </div>
            <div className="bg-gradient-to-br from-amber-800/80 to-amber-900/80 rounded-xl p-6 text-center shadow-md flex flex-col items-center border border-amber-500/30">
              <Clock className="h-8 w-8 text-amber-400 mb-2" />
              <p className="text-lg font-semibold text-amber-200">Fast Results</p>
              <p className="text-4xl font-bold text-amber-400 my-2">&lt; 5s</p>
              <p className="text-amber-300 text-sm">Recognition Time</p>
            </div>
            <div className="bg-gradient-to-br from-amber-800/80 to-amber-900/80 rounded-xl p-6 text-center shadow-md flex flex-col items-center border border-amber-500/30">
              <Utensils className="h-8 w-8 text-amber-400 mb-2" />
              <p className="text-lg font-semibold text-amber-200">Wide Coverage</p>
              <p className="text-4xl font-bold text-amber-400 my-2">8</p>
              <p className="text-amber-300 text-sm">Cuisine Types</p>
            </div>
          </div>

          {/* Our Journey Section */}
          <div className="mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold text-amber-100 mb-6 md:mb-8 text-center">Our Journey</h2>
            <div className="timeline-container py-6 px-4 sm:px-0 relative">
              {/* Vertical line - hidden on mobile, shown on tablet and desktop */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 bg-amber-700/50 z-0" style={{ top: '40px', bottom: '40px' }}></div>
              
              {/* Item 1 */}
              <div className="flex flex-col md:flex-row items-center mb-8 md:mb-0">
                <div className="md:w-1/2 md:pr-16 md:text-right mb-4 md:mb-0">
                  <h3 className="text-amber-300 font-bold text-center md:text-right">January 2025</h3>
                  <h4 className="text-lg sm:text-xl font-bold text-amber-200 mb-2 text-center md:text-right">The Idea Was Born</h4>
                  <p className="text-white text-center md:text-right">Inspired by the frustration of having ingredients but no recipe ideas, we imagined a tool that could suggest recipes based on what you already have.</p>
                </div>
                <div className="md:w-1/12 flex justify-center my-4 md:my-0">
                  <div className="w-8 h-8 rounded-full bg-amber-500 border-4 border-amber-900/50 z-10 timeline-dot"></div>
                </div>
                <div className="md:w-1/2 md:pl-16"></div>
              </div>

              {/* Item 2 */}
              <div className="flex flex-col md:flex-row items-center mb-8 md:mb-0">
                <div className="md:w-1/2 md:pr-16 block md:hidden">
                  <h3 className="text-amber-300 font-bold text-center">February 2025</h3>
                  <h4 className="text-lg sm:text-xl font-bold text-amber-200 mb-2 text-center">First Website Built</h4>
                  <p className="text-white text-center">Built my website, a user-friendly tool for home cooks to find recipes based on ingredients.</p>
                </div>
                <div className="md:w-1/2 md:pr-16 hidden md:block"></div>
                <div className="md:w-1/12 flex justify-center my-4 md:my-0">
                  <div className="w-8 h-8 rounded-full bg-amber-500 border-4 border-amber-900/50 z-10 timeline-dot"></div>
                </div>
                <div className="md:w-1/2 md:pl-16 md:text-left mb-4 md:mb-0 hidden md:block">
                  <h3 className="text-amber-300 font-bold">February 2025</h3>
                  <h4 className="text-lg sm:text-xl font-bold text-amber-200 mb-2">First Website Built</h4>
                  <p className="text-white">Built my website, a user-friendly tool for home cooks to find recipes based on ingredients.</p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex flex-col md:flex-row items-center mb-8 md:mb-0">
                <div className="md:w-1/2 md:pr-16 md:text-right mb-4 md:mb-0">
                  <h3 className="text-amber-300 font-bold text-center md:text-right">May 2024</h3>
                  <h4 className="text-lg sm:text-xl font-bold text-amber-200 mb-2 text-center md:text-right">Launched & Received First Feedback</h4>
                  <p className="text-white text-center md:text-right">After an official launch, early users tested the platform, praised its simplicity, and shared valuable feedback that sparked immediate improvements.</p>
                </div>
                <div className="md:w-1/12 flex justify-center my-4 md:my-0">
                  <div className="w-8 h-8 rounded-full bg-amber-500 border-4 border-amber-900/50 z-10 timeline-dot"></div>
                </div>
                <div className="md:w-1/2 md:pl-16"></div>
              </div>

              {/* Item 4 */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-16 block md:hidden">
                  <h3 className="text-amber-300 font-bold text-center">Now</h3>
                  <h4 className="text-lg sm:text-xl font-bold text-amber-200 mb-2 text-center">AI Upgrades & Community Building</h4>
                  <p className="text-white text-center">I'm now focused on enhancing Cook AI's ability to suggest accurate recipes based on the ingredients you have, using smarter AI models. I'm also building a community of home cooks and foodies who love discovering creative ways to cook with what's already in their kitchen.</p>
                </div>
                <div className="md:w-1/2 md:pr-16 hidden md:block"></div>
                <div className="md:w-1/12 flex justify-center my-4 md:my-0">
                  <div className="w-8 h-8 rounded-full bg-amber-500 border-4 border-amber-900/50 z-10 timeline-dot"></div>
                </div>
                <div className="md:w-1/2 md:pl-16 md:text-left mb-4 md:mb-0 hidden md:block">
                  <h3 className="text-amber-300 font-bold">Now</h3>
                  <h4 className="text-lg sm:text-xl font-bold text-amber-200 mb-2">AI Upgrades & Community Building</h4>
                  <p className="text-white">I'm now focused on enhancing Cook AI's ability to suggest accurate recipes based on the ingredients you have, using smarter AI models. I'm also building a community of home cooks and foodies who love discovering creative ways to cook with what's already in their kitchen.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold text-amber-100 mb-6 md:mb-8 text-center">Our Team</h2>
          <div className="flex justify-center mb-16">
            <div className="bg-gradient-to-br from-amber-800/70 to-amber-900/70 backdrop-blur-md rounded-xl p-8 shadow-xl border border-amber-500/30 max-w-md text-center">
              <div className="mx-auto rounded-full w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-amber-700/50 mb-4 flex items-center justify-center">
                <ChefHat className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-amber-300" />
              </div>
              <h3 className="text-xl font-bold text-amber-200 mb-1">Adham Abdiyev</h3>
              <p className="text-amber-300 mb-4">Founder & CEO</p>
              <p className="text-white">
                Self-taught Full-stack Developer with the intention of bringing real-world AI solutions to everyday users.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default About;
