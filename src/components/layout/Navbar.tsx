import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChefHat, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when changing pages
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/20 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between px-4 py-3 relative">
          {/* Logo - Left Side */}
          <Link to="/" className="flex items-center space-x-2 z-10">
            <ChefHat className="h-6 w-6 text-amber-400" />
            <span className="text-xl font-bold text-amber-100">CookAI</span>
          </Link>

          {/* Centered Desktop Navigation */}
          <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center bg-amber-700/40 backdrop-blur-sm rounded-full px-6 py-2 border border-amber-500/30 shadow-md">
            <NavLink
              to="/"
              className={({isActive}) => isActive ? "text-amber-400 font-semibold mx-4" : "text-white/90 hover:text-amber-200 font-medium mx-4"}
            >
              Home
            </NavLink>
            <NavLink
              to="/search"
              className={({isActive}) => isActive ? "text-amber-400 font-semibold mx-4" : "text-white/90 hover:text-amber-200 font-medium mx-4"}
            >
              Find Recipes
            </NavLink>
            <NavLink
              to="/popular"
              className={({isActive}) => isActive ? "text-amber-400 font-semibold mx-4" : "text-white/90 hover:text-amber-200 font-medium mx-4"}
            >
              Popular
            </NavLink>
            <NavLink
              to="/about"
              className={({isActive}) => isActive ? "text-amber-400 font-semibold mx-4" : "text-white/90 hover:text-amber-200 font-medium mx-4"}
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({isActive}) => isActive ? "text-amber-400 font-semibold mx-4" : "text-white/90 hover:text-amber-200 font-medium mx-4"}
            >
              Contact
            </NavLink>
          </div>
          
          {/* Right Side */}
          <div className="hidden md:block z-10">
            {/* Empty div to maintain layout */}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden ${
          isMenuOpen ? 'block animate-fadeIn' : 'hidden'
        }`}
      >
        <div className="space-y-1 bg-black/30 backdrop-blur-md px-4 pb-3 pt-2 shadow-lg">
          <Link
            to="/"
            className={`block rounded-md px-3 py-2 text-base font-medium ${
              location.pathname === '/'
                ? 'bg-white/10 text-amber-400'
                : 'text-white/80 hover:bg-white/5 hover:text-amber-200'
            }`}
          >
            Home
          </Link>
          <Link
            to="/search"
            className={`block rounded-md px-3 py-2 text-base font-medium ${
              location.pathname === '/search'
                ? 'bg-white/10 text-amber-400'
                : 'text-white/80 hover:bg-white/5 hover:text-amber-200'
            }`}
          >
            Find Recipes
          </Link>
          <Link
            to="/popular"
            className={`block rounded-md px-3 py-2 text-base font-medium ${
              location.pathname === '/popular'
                ? 'bg-white/10 text-amber-400'
                : 'text-white/80 hover:bg-white/5 hover:text-amber-200'
            }`}
          >
            Popular
          </Link>
          <Link
            to="/about"
            className={`block rounded-md px-3 py-2 text-base font-medium ${
              location.pathname === '/about'
                ? 'bg-white/10 text-amber-400'
                : 'text-white/80 hover:bg-white/5 hover:text-amber-200'
            }`}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={`block rounded-md px-3 py-2 text-base font-medium ${
              location.pathname === '/contact'
                ? 'bg-white/10 text-amber-400'
                : 'text-white/80 hover:bg-white/5 hover:text-amber-200'
            }`}
          >
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;