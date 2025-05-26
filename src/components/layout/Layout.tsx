import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Background from './Background';
import { motion } from 'framer-motion';

const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col relative overflow-x-hidden">
      <Background />
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Navbar />
      </motion.div>
      <motion.main 
        className="flex-1 pt-16 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Outlet />
      </motion.main>
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Footer />
      </motion.div>
      <div className="fixed inset-0 pointer-events-none z-[-2] opacity-50 overflow-hidden">
        <div className="absolute inset-0 bg-repeat" style={{ backgroundImage: 'url(/patterns/food-pattern.svg)' }}></div>
      </div>
    </div>
  );
};

export default Layout;