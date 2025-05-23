import React from 'react';
import { ChefHat, Sparkles, BarChart, Clock, Star, Utensils } from 'lucide-react';
import '../styles/timeline-animations.css';

const About: React.FC = () => {
  // No state needed as all dots will pulse together

  return (
    <div className="min-h-screen pb-20 pt-24 relative">
      {/* Header */}
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-100 mb-2">
            About <span className="text-amber-400">CookAI</span>
          </h1>
          <p className="text-amber-200/90 text-lg max-w-2xl mx-auto">
            Connecting people with flavor through technology
          </p>
        </div>

        {/* Mission Section */}
        <div className="flex flex-col md:flex-row gap-10 mb-20 items-center">
          <div className="md:w-1/3 flex justify-center">
            <div className="w-52 h-52 rounded-full bg-amber-200 flex items-center justify-center shadow-xl">
              <ChefHat className="w-24 h-24 text-amber-700" />
            </div>
          </div>
          <div className="md:w-2/3">
            <h2 className="text-3xl font-bold text-amber-200 mb-4">Our Mission</h2>
            <p className="text-amber-100/90 mb-4">
              We believe in making culinary knowledge accessible to everyone, regardless of their expertise level. Our mission is to bridge the gap between technology and taste, helping people identify and learn about the dishes around them.
            </p>
            <p className="text-amber-100/90">
              Using advanced AI technology, we've created a platform that can identify dishes from a single image, providing accurate information about their ingredients, nutritional value, cooking methods, and cultural origins.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20">
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
            <p className="text-lg font-semibold text-amber-200">Recipe Database</p>
            <p className="text-4xl font-bold text-amber-400 my-2">*To Be Updated*</p>
            <p className="text-amber-300 text-sm">Recipes Available</p>
          </div>
        </div>

        {/* Technology Section */}
        <h2 className="text-3xl font-bold text-amber-100 mb-8 text-center">Our Technology</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <div className="bg-gradient-to-br from-amber-800/70 to-amber-900/70 backdrop-blur-md rounded-xl p-6 shadow-md border border-amber-500/30">
            <div className="mb-4">
              <Sparkles className="h-10 w-10 p-2 bg-amber-700/50 text-amber-300 rounded-lg" />
            </div>
            <h3 className="text-xl font-bold text-amber-200 mb-2">AI Recognition</h3>
            <p className="text-white">
              Our advanced convolutional neural networks can identify thousands of dishes and cuisines with over 95% accuracy from just a single photo.
            </p>
          </div>
          <div className="bg-gradient-to-br from-amber-800/70 to-amber-900/70 backdrop-blur-md rounded-xl p-6 shadow-md border border-amber-500/30">
            <div className="mb-4">
              <BarChart className="h-10 w-10 p-2 bg-amber-700/50 text-amber-300 rounded-lg" />
            </div>
            <h3 className="text-xl font-bold text-amber-200 mb-2">Machine Learning</h3>
            <p className="text-white">
              Our models continuously improve through machine learning, analyzing millions of food images to enhance recipe recognition and ingredient identification capabilities.
            </p>
          </div>
          <div className="bg-gradient-to-br from-amber-800/70 to-amber-900/70 backdrop-blur-md rounded-xl p-6 shadow-md border border-amber-500/30">
            <div className="mb-4">
              <ChefHat className="h-10 w-10 p-2 bg-amber-700/50 text-amber-300 rounded-lg" />
            </div>
            <h3 className="text-xl font-bold text-amber-200 mb-2">Recipe Database</h3>
            <p className="text-white">
              Built in collaboration with chefs and food scientists, our database contains detailed information about ingredients, recipes, and cooking tips.
            </p>
          </div>
        </div>

        {/* Journey Section */}
        <h2 className="text-3xl font-bold text-amber-100 mb-8 text-center">Our Journey</h2>
        <div className="relative mb-20">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-amber-500/50"></div>
          
          {/* Timeline Items */}
          <div className="space-y-16 relative">
            {/* Item 1 */}
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-16 md:text-right mb-4 md:mb-0">
                <h3 className="text-amber-300 font-bold">January 2022</h3>
                <h4 className="text-xl font-bold text-amber-200 mb-2">The Recipe Began</h4>
                <p className="text-white">After years of exploring cooking and AI, Adham Allpjov began developing a solution to a simple but common problem—identifying dishes with a photo.</p>
              </div>
              <div className="md:w-1/12 flex justify-center">
                <div className="w-8 h-8 rounded-full bg-amber-500 border-4 border-amber-900/50 z-10 timeline-dot"></div>
              </div>
              <div className="md:w-1/2 md:pl-16"></div>
            </div>

            {/* Item 2 */}
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-16"></div>
              <div className="md:w-1/12 flex justify-center">
                <div className="w-8 h-8 rounded-full bg-amber-500 border-4 border-amber-900/50 z-10 timeline-dot"></div>
              </div>
              <div className="md:w-1/2 md:pl-16 md:text-left mb-4 md:mb-0">
                <h3 className="text-amber-300 font-bold">April 2023</h3>
                <h4 className="text-xl font-bold text-amber-200 mb-2">First Website Built</h4>
                <p className="text-white">Built our website, a user-friendly tool for home cooks to perform web-based food recognition that works in various browsers.</p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-16 md:text-right mb-4 md:mb-0">
                <h3 className="text-amber-300 font-bold">May 2024</h3>
                <h4 className="text-xl font-bold text-amber-200 mb-2">Launched & Received First Feedback</h4>
                <p className="text-white">After an official launch, early users tested the platform, praised its simplicity, and shared valuable feedback that sparked immediate improvements.</p>
              </div>
              <div className="md:w-1/12 flex justify-center">
                <div className="w-8 h-8 rounded-full bg-amber-500 border-4 border-amber-900/50 z-10 timeline-dot"></div>
              </div>
              <div className="md:w-1/2 md:pl-16"></div>
            </div>

            {/* Item 4 */}
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-16"></div>
              <div className="md:w-1/12 flex justify-center">
                <div className="w-8 h-8 rounded-full bg-amber-500 border-4 border-amber-900/50 z-10 timeline-dot"></div>
              </div>
              <div className="md:w-1/2 md:pl-16 md:text-left mb-4 md:mb-0">
                <h3 className="text-amber-300 font-bold">Now</h3>
                <h4 className="text-xl font-bold text-amber-200 mb-2">AI Upgrades & Community Building</h4>
                <p className="text-white">We're now focused on improving recognition accuracy with better AI models and building a community of food enthusiasts who are passionate about culinary discovery.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <h2 className="text-3xl font-bold text-amber-100 mb-8 text-center">Our Team</h2>
        <div className="flex justify-center mb-16">
          <div className="bg-gradient-to-br from-amber-800/70 to-amber-900/70 backdrop-blur-md rounded-xl p-8 shadow-xl border border-amber-500/30 max-w-md text-center">
            <div className="mx-auto rounded-full w-32 h-32 bg-amber-700/50 mb-4 flex items-center justify-center">
              <ChefHat className="h-16 w-16 text-amber-300" />
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
  );
};

export default About;
