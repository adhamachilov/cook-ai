import React, { useState, useEffect } from 'react';
import { Mail, Send, ChevronDown, ChevronUp, MessageSquare, Copy, Search, Bookmark, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '../components/ui/PageTransition';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [activeFaq, setActiveFaq] = useState('');
  const [messageCount, setMessageCount] = useState(0);
  const [copied, setCopied] = useState(false);
  
  // Animate stats on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessageCount(100);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: '',
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  return (
    <PageTransition>
      <div className="min-h-screen pb-20 pt-24 relative">
        {/* Background Elements */}
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl -z-10 opacity-40"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-500/30 rounded-full blur-3xl -z-10 opacity-40"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {/* Header */}
          <motion.div 
            className="mb-16 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative inline-block">
              <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-amber-400/20 blur-xl"></div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-amber-500/20 blur-xl"></div>
              <motion.h1 
                className="mb-4 text-5xl font-bold md:text-6xl text-amber-100 relative z-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
              >
                Get in <motion.span 
                        className="text-amber-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                      >
                        Touch
                      </motion.span>
              </motion.h1>
            </div>
            <motion.p 
              className="mx-auto max-w-2xl text-lg text-white/80 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.7 }}
            >
              Have cooking questions or need recipe inspiration? We're here to make your culinary journey delicious.
            </motion.p>
          </motion.div>

          {/* Bento Grid Layout */}
          <motion.div 
            className="grid grid-cols-12 gap-6 max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Main Contact Card */}
            <motion.div 
              className="col-span-12 md:col-span-8 bg-gradient-to-br from-amber-800/70 to-amber-900/70 backdrop-blur-md border border-amber-500/30 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl -ml-32 -mb-32"></div>
              
              <div className="relative z-10">
                <motion.h2 
                  className="text-3xl font-bold mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  Get in Touch
                </motion.h2>
                
                {submitSuccess ? (
                  <motion.div 
                    className="rounded-2xl bg-white/10 backdrop-blur-sm p-6 border border-white/20"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="font-medium text-xl">Message sent successfully!</p>
                    <p className="mt-2 text-amber-100">
                      Thank you for contacting us. We'll get back to you as soon as possible.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form 
                    onSubmit={handleSubmit} 
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-amber-100 mb-2">Your Name</label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formState.name}
                          onChange={handleChange}
                          required
                          placeholder="John Doe"
                          className="w-full bg-white/10 border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-amber-200/70 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-amber-100 mb-2">Email Address</label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formState.email}
                          onChange={handleChange}
                          required
                          placeholder="john@example.com"
                          className="w-full bg-white/10 border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-amber-200/70 focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-amber-100 mb-2">Subject</label>
                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formState.subject}
                        onChange={handleChange}
                        required
                        placeholder="How can we help you?"
                        className="w-full bg-white/10 border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-amber-200/70 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-amber-100 mb-2"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formState.message}
                        onChange={handleChange}
                        required
                        placeholder="Your message here..."
                        className="w-full bg-white/10 border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-amber-200/70 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      ></textarea>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center rounded-xl bg-amber-400 px-6 py-3 text-base font-medium text-amber-900 shadow-sm hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all duration-300 disabled:opacity-70"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="mr-2 animate-spin inline-block w-4 h-4 border-2 border-amber-900 border-t-transparent rounded-full"></span>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={18} className="mr-2" />
                          Send Message
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </div>
            </motion.div>
            
            {/* Stats Card */}
            <motion.div 
              className="col-span-12 md:col-span-4 grid grid-cols-1 gap-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {/* Stats Redesigned */}
              <motion.div 
                className="bg-gradient-to-br from-amber-800/70 to-amber-900/70 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-amber-500/30 relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/20 rounded-full blur-xl -mr-16 -mt-16"></div>
                
                <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
                  <motion.div 
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    <h3 className="text-xl font-bold text-white animate-pulse">*To Be Updated*</h3>
                    <p className="text-white font-medium">recipes created</p>
                  </motion.div>
                  
                  <motion.div 
                    className="w-full grid grid-cols-2 gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <motion.div 
                      className="bg-amber-700/50 rounded-xl p-4 text-center border border-amber-500/30"
                      whileHover={{ scale: 1.05 }}
                    >
                      <motion.h3 
                        className="text-2xl font-bold text-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9, duration: 0.5 }}
                      >
                        {messageCount.toLocaleString()}
                      </motion.h3>
                      <p className="text-white text-sm">happy users</p>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-amber-700/50 rounded-xl p-4 text-center border border-amber-500/30"
                      whileHover={{ scale: 1.05 }}
                    >
                      <motion.h3 
                        className="text-2xl font-bold text-white"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.0, duration: 0.5 }}
                      >
                        8
                      </motion.h3>
                      <p className="text-white text-sm">cuisine types</p>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Contact Card - Compact */}
              <motion.div 
                className="bg-gradient-to-br from-amber-700/70 to-amber-800/70 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-amber-500/30 relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                
                <div className="relative z-10">
                  <motion.h2 
                    className="text-lg font-bold text-amber-200 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    Contact Us
                  </motion.h2>
                  
                  <motion.div 
                    className="p-3 bg-amber-600/30 backdrop-blur-sm rounded-xl border border-amber-500/30"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-amber-500/40 flex items-center justify-center mr-3">
                        <Mail className="h-5 w-5 text-amber-300" />
                      </div>
                      <div>
                        <p className="text-amber-200 font-medium">adhamachilovusa@gmail.com</p>
                      </div>
                    </div>
                    
                    <motion.button 
                      onClick={() => {
                        navigator.clipboard.writeText('adhamachilovusa@gmail.com');
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }} 
                      className="mt-2 ml-auto flex items-center justify-center px-3 py-1.5 bg-amber-500 text-amber-950 rounded-lg text-sm font-medium hover:bg-amber-400 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      {copied ? 'Copied!' : 'Copy Email'}
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
            
            {/* FAQ Card */}
            <motion.div 
              className="col-span-12 md:col-span-7 bg-gradient-to-br from-amber-800/70 to-amber-900/70 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-amber-500/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <motion.h2 
                className="text-xl font-bold text-amber-200 mb-6 flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <MessageSquare className="mr-2 text-amber-400" size={20} />
                Frequently Asked Questions
              </motion.h2>
              
              <div className="space-y-4">
                <motion.div 
                  className="border border-amber-600/30 rounded-xl overflow-hidden"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.5 }}
                >
                  <motion.button 
                    className="flex items-center justify-between w-full p-4 text-left bg-amber-700/40 hover:bg-amber-700/60 transition-colors"
                    onClick={() => setActiveFaq(activeFaq === 'faq1' ? '' : 'faq1')}
                    whileHover={{ backgroundColor: 'rgba(217, 119, 6, 0.5)' }}
                  >
                    <span className="font-medium text-amber-200">How does the recipe suggestion work?</span>
                    {activeFaq === 'faq1' ? <ChevronUp className="h-5 w-5 text-amber-400" /> : <ChevronDown className="h-5 w-5 text-amber-400" />}
                  </motion.button>
                  {activeFaq === 'faq1' && (
                    <motion.div 
                      className="p-4 bg-amber-800/30"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-amber-200">
                        Our AI analyzes the ingredients you input and suggests recipes that can be made with those ingredients, taking into account any dietary preferences or cuisine types you specify.
                      </p>
                    </motion.div>
                  )}
                </motion.div>
                
                <motion.div 
                  className="border border-amber-600/30 rounded-xl overflow-hidden"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                >
                  <motion.button 
                    className="flex items-center justify-between w-full p-4 text-left bg-amber-700/40 hover:bg-amber-700/60 transition-colors"
                    onClick={() => setActiveFaq(activeFaq === 'faq2' ? '' : 'faq2')}
                    whileHover={{ backgroundColor: 'rgba(217, 119, 6, 0.5)' }}
                  >
                    <span className="font-medium text-amber-200">Are the recipes customizable?</span>
                    {activeFaq === 'faq2' ? <ChevronUp className="h-5 w-5 text-amber-400" /> : <ChevronDown className="h-5 w-5 text-amber-400" />}
                  </motion.button>
                  {activeFaq === 'faq2' && (
                    <motion.div 
                      className="p-4 bg-amber-800/30"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-amber-200">
                        Yes! You can filter recipes by dietary preferences like vegetarian, vegan, gluten-free, or dairy-free. You can also specify cuisine types.
                      </p>
                    </motion.div>
                  )}
                </motion.div>
                
                <motion.div 
                  className="border border-amber-600/30 rounded-xl overflow-hidden"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  <motion.button 
                    className="flex items-center justify-between w-full p-4 text-left bg-amber-700/40 hover:bg-amber-700/60 transition-colors"
                    onClick={() => setActiveFaq(activeFaq === 'faq3' ? '' : 'faq3')}
                    whileHover={{ backgroundColor: 'rgba(217, 119, 6, 0.5)' }}
                  >
                    <span className="font-medium text-amber-200">Is it free to use CookAI?</span>
                    {activeFaq === 'faq3' ? <ChevronUp className="h-5 w-5 text-amber-400" /> : <ChevronDown className="h-5 w-5 text-amber-400" />}
                  </motion.button>
                  {activeFaq === 'faq3' && (
                    <motion.div 
                      className="p-4 bg-amber-800/30"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-amber-200">
                        Yes, CookAI is completely free to use! All features including recipe search, and liking recipes are available to all users without any subscription or payment required.
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>
            
            {/* Explore Section - with gradient colors */}
            <motion.div 
              className="col-span-12 md:col-span-5 bg-gradient-to-br from-amber-700/70 to-amber-800/70 backdrop-blur-md border border-amber-500/30 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-md"></div>
              <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white/10 rounded-full blur-md"></div>
              
              <div className="relative z-10">
                <motion.h2 
                  className="text-xl font-bold mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0, duration: 0.5 }}
                >
                  Explore
                </motion.h2>
                <motion.p 
                  className="mb-6 text-amber-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                >
                  Discover cooking possibilities with COOK AI
                </motion.p>
                
                <div className="space-y-4">
                  <motion.div 
                    className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    whileHover={{ scale: 1.03, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                  >
                    <div className="flex items-center">
                      <Search className="mr-3 h-5 w-5 text-amber-200" />
                      <span className="text-white font-medium">Find Recipes by Ingredients</span>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3, duration: 0.5 }}
                    whileHover={{ scale: 1.03, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                  >
                    <div className="flex items-center">
                      <Bookmark className="mr-3 h-5 w-5 text-amber-200" />
                      <span className="text-white font-medium">Save Your Favorites</span>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4, duration: 0.5 }}
                    whileHover={{ scale: 1.03, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                  >
                    <div className="flex items-center">
                      <Award className="mr-3 h-5 w-5 text-amber-200" />
                      <span className="text-white font-medium">Premium Recipe Quality</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Contact;
