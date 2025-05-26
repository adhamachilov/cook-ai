import React from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Instagram, Twitter, Facebook, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    hover: { scale: 1.2, color: "#ffffff" }
  };

  return (
    <footer className="mt-auto bg-black/20 backdrop-blur-md text-white">
      <motion.div 
        className="container mx-auto px-4 py-12 md:px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={containerVariants}
      >
        <motion.div className="grid grid-cols-1 gap-8 md:grid-cols-4" variants={containerVariants}>
          <motion.div className="space-y-4" variants={itemVariants}>
            <motion.div 
              className="flex items-center"
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                whileHover={{ rotate: 10 }}
                transition={{ duration: 0.2 }}
              >
                <ChefHat className="mr-2 h-8 w-8 text-amber-400" />
              </motion.div>
              <span className="text-xl font-bold">CookAI</span>
            </motion.div>
            <motion.p 
              className="text-white/80"
              variants={itemVariants}
            >
              Discover delicious recipes tailored to your available ingredients with AI-powered suggestions.
            </motion.p>
            <motion.div className="flex space-x-4" variants={itemVariants}>
              <motion.a 
                href="#" 
                className="text-amber-400 transition-colors hover:text-white"
                variants={iconVariants}
                whileHover="hover"
              >
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </motion.a>
              <motion.a 
                href="#" 
                className="text-amber-400 transition-colors hover:text-white"
                variants={iconVariants}
                whileHover="hover"
              >
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </motion.a>
              <motion.a 
                href="#" 
                className="text-amber-400 transition-colors hover:text-white"
                variants={iconVariants}
                whileHover="hover"
              >
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </motion.a>
            </motion.div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <motion.h3 
              className="mb-4 text-lg font-semibold"
              variants={itemVariants}
            >
              Quick Links
            </motion.h3>
            <motion.ul className="space-y-2 text-white/70">
              <motion.li variants={itemVariants}>
                <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <Link to="/" className="transition-colors hover:text-white">Home</Link>
                </motion.div>
              </motion.li>
              <motion.li variants={itemVariants}>
                <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <Link to="/search" className="transition-colors hover:text-white">Find Recipes</Link>
                </motion.div>
              </motion.li>
              <motion.li variants={itemVariants}>
                <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <Link to="/popular" className="transition-colors hover:text-white">Popular Recipes</Link>
                </motion.div>
              </motion.li>
              <motion.li variants={itemVariants}>
                <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <Link to="/about" className="transition-colors hover:text-white">About Us</Link>
                </motion.div>
              </motion.li>
              <motion.li variants={itemVariants}>
                <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <Link to="/contact" className="transition-colors hover:text-white">Contact Us</Link>
                </motion.div>
              </motion.li>
            </motion.ul>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <motion.h3 
              className="mb-4 text-lg font-semibold"
              variants={itemVariants}
            >
              Categories
            </motion.h3>
            <motion.ul className="space-y-2 text-white/70">
              <motion.li variants={itemVariants}>
                <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <a href="#" className="transition-colors hover:text-white">Vegetarian</a>
                </motion.div>
              </motion.li>
              <motion.li variants={itemVariants}>
                <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <a href="#" className="transition-colors hover:text-white">Quick Meals</a>
                </motion.div>
              </motion.li>
              <motion.li variants={itemVariants}>
                <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <a href="#" className="transition-colors hover:text-white">Desserts</a>
                </motion.div>
              </motion.li>
              <motion.li variants={itemVariants}>
                <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <a href="#" className="transition-colors hover:text-white">Healthy Options</a>
                </motion.div>
              </motion.li>
              <motion.li variants={itemVariants}>
                <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <a href="#" className="transition-colors hover:text-white">International Cuisine</a>
                </motion.div>
              </motion.li>
            </motion.ul>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <motion.h3 
              className="mb-4 text-lg font-semibold"
              variants={itemVariants}
            >
              Contact
            </motion.h3>
            <motion.ul className="space-y-2 text-white/70">
              <motion.li 
                className="flex items-center"
                variants={itemVariants}
                whileHover={{ x: 5 }}
              >
                <motion.div
                  whileHover={{ rotate: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Mail size={16} className="mr-2" />
                </motion.div>
                <a href="mailto:adhamachilovusa@gmail.com" className="transition-colors hover:text-white">
                adhamachilovusa@gmail.com
                </a>
              </motion.li>
            </motion.ul>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mt-12 border-t border-white/20 pt-8 text-center text-sm text-white/70"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <motion.p variants={itemVariants}>© {new Date().getFullYear()} CookAI. All rights reserved.</motion.p>
          <motion.div 
            className="mt-2 space-x-4"
            variants={itemVariants}
          >
            <motion.a 
              href="#" 
              className="transition-colors hover:text-white"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              Privacy Policy
            </motion.a>
            <motion.a 
              href="#" 
              className="transition-colors hover:text-white"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              Terms of Service
            </motion.a>
            <motion.a 
              href="#" 
              className="transition-colors hover:text-white"
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
            >
              Cookie Policy
            </motion.a>
          </motion.div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;