import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChefHat, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Animation variants
  const navbarVariants = {
    hidden: { opacity: 0, y: -25 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3
      }
    },
    hover: {
      scale: 1.05,
      color: "#fbbf24", // amber-400
      transition: { duration: 0.2 }
    }
  };
  
  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0, overflow: "hidden" },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };
  
  const logoVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.5
      }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    }
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
    <motion.header
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/20 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-center px-4 py-3 relative">
          {/* Logo - Left Side */}
          <motion.div
            variants={logoVariants}
            whileHover="hover"
            className="absolute left-4"
          >
            <Link to="/" className="flex items-center space-x-2 z-10">
              <motion.div
                whileHover={{ rotate: 10 }}
                transition={{ duration: 0.2 }}
              >
                <ChefHat className="h-6 w-6 text-amber-400" />
              </motion.div>
              <span className="text-xl font-bold text-amber-100">CookAI</span>
            </Link>
          </motion.div>

          {/* Centered Desktop Navigation */}
          <motion.div 
            className="hidden md:flex items-center bg-amber-700/40 backdrop-blur-sm rounded-full px-6 py-2 border border-amber-500/30 shadow-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.div variants={navItemVariants} whileHover="hover">
              <NavLink
                to="/"
                className={({isActive}) => isActive ? "text-amber-400 font-semibold mx-4" : "text-white/90 hover:text-amber-200 font-medium mx-4"}
              >
                Home
              </NavLink>
            </motion.div>
            <motion.div variants={navItemVariants} whileHover="hover">
              <NavLink
                to="/search"
                className={({isActive}) => isActive ? "text-amber-400 font-semibold mx-4" : "text-white/90 hover:text-amber-200 font-medium mx-4"}
              >
                Find Recipes
              </NavLink>
            </motion.div>
            <motion.div variants={navItemVariants} whileHover="hover">
              <NavLink
                to="/popular"
                className={({isActive}) => isActive ? "text-amber-400 font-semibold mx-4" : "text-white/90 hover:text-amber-200 font-medium mx-4"}
              >
                Popular
              </NavLink>
            </motion.div>
            <motion.div variants={navItemVariants} whileHover="hover">
              <NavLink
                to="/about"
                className={({isActive}) => isActive ? "text-amber-400 font-semibold mx-4" : "text-white/90 hover:text-amber-200 font-medium mx-4"}
              >
                About
              </NavLink>
            </motion.div>
            <motion.div variants={navItemVariants} whileHover="hover">
              <NavLink
                to="/contact"
                className={({isActive}) => isActive ? "text-amber-400 font-semibold mx-4" : "text-white/90 hover:text-amber-200 font-medium mx-4"}
              >
                Contact
              </NavLink>
            </motion.div>
          </motion.div>
          
          {/* Right Side */}
          <div className="hidden">
            {/* Empty div not needed anymore */}
          </div>

          {/* Mobile menu button */}
          <motion.div 
            className="md:hidden absolute right-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <motion.button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              whileTap={{ scale: 0.95 }}
            >
              <span className="sr-only">Open main menu</span>
              <AnimatePresence mode="wait" initial={false}>
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="block h-6 w-6" aria-hidden="true" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="block h-6 w-6" aria-hidden="true" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
          <motion.div 
            className="space-y-1 bg-black/30 backdrop-blur-md px-4 pb-3 pt-2 shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ x: 5 }}
            >
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
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              whileHover={{ x: 5 }}
            >
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
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              whileHover={{ x: 5 }}
            >
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
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              whileHover={{ x: 5 }}
            >
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
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              whileHover={{ x: 5 }}
            >
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
            </motion.div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;