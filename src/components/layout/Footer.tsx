import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Instagram, Twitter, Facebook, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-black/20 backdrop-blur-md text-white">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center">
              <ChefHat className="mr-2 h-8 w-8 text-amber-400" />
              <span className="text-xl font-bold">CookAI</span>
            </div>
            <p className="text-white/80">
              Discover delicious recipes tailored to your available ingredients with AI-powered suggestions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-amber-400 transition-colors hover:text-white">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-amber-400 transition-colors hover:text-white">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-amber-400 transition-colors hover:text-white">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-white/70">
              <li>
                <Link to="/" className="transition-colors hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/search" className="transition-colors hover:text-white">Find Recipes</Link>
              </li>
              <li>
                <Link to="/popular" className="transition-colors hover:text-white">Popular Recipes</Link>
              </li>
              <li>
                <Link to="/favorites" className="transition-colors hover:text-white">Favorites</Link>
              </li>
              <li>
                <Link to="/contact" className="transition-colors hover:text-white">Contact Us</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-semibold">Categories</h3>
            <ul className="space-y-2 text-white/70">
              <li>
                <a href="#" className="transition-colors hover:text-white">Vegetarian</a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">Quick Meals</a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">Desserts</a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">Healthy Options</a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">International Cuisine</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact</h3>
            <ul className="space-y-2 text-white/70">
              <li className="flex items-center">
                <Mail size={16} className="mr-2" />
                <a href="mailto:adhamachilovusa@gmail.com" className="transition-colors hover:text-white">
                adhamachilovusa@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-white/20 pt-8 text-center text-sm text-white/70">
          <p>© {new Date().getFullYear()} CookAI. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="#" className="transition-colors hover:text-white">Privacy Policy</a>
            <a href="#" className="transition-colors hover:text-white">Terms of Service</a>
            <a href="#" className="transition-colors hover:text-white">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;