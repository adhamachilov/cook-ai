import React, { useState, useEffect } from 'react';
import { Mail, Send, ChevronDown, ChevronUp, MessageSquare, Copy, Search, Bookmark, Award } from 'lucide-react';

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
  const [responseRate, setResponseRate] = useState(0);
  const [copied, setCopied] = useState(false);
  
  // Animate stats on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessageCount(12543);
      setResponseRate(98);
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
    <div className="min-h-screen pb-20 pt-24 relative">
      {/* Background Elements */}
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl -z-10 opacity-40"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-500/30 rounded-full blur-3xl -z-10 opacity-40"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="relative inline-block">
            <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-amber-400/20 blur-xl"></div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-amber-500/20 blur-xl"></div>
            <h1 className="mb-4 text-5xl font-bold md:text-6xl text-amber-100 relative z-10">Get in <span className="text-amber-400">Touch</span></h1>
          </div>
          <p className="mx-auto max-w-2xl text-lg text-white/80 mt-6">
            Have cooking questions or need recipe inspiration? We're here to make your culinary journey delicious.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-6 max-w-6xl mx-auto">
          {/* Main Contact Card */}
          <div className="col-span-12 md:col-span-8 bg-gradient-to-br from-amber-800/70 to-amber-900/70 backdrop-blur-md border border-amber-500/30 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl -ml-32 -mb-32"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
              
              {submitSuccess ? (
                <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-6 border border-white/20">
                  <p className="font-medium text-xl">Message sent successfully!</p>
                  <p className="mt-2 text-amber-100">
                    Thank you for contacting us. We'll get back to you as soon as possible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
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

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center rounded-xl bg-amber-400 px-6 py-3 text-base font-medium text-amber-900 shadow-sm hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300 transition-all duration-300 disabled:opacity-70"
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
                  </button>
                </form>
              )}
            </div>
          </div>
          
          {/* Stats Card */}
          <div className="col-span-12 md:col-span-4 grid grid-cols-1 gap-6">
            {/* Stats Redesigned */}
            <div className="bg-gradient-to-br from-amber-800/70 to-amber-900/70 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-amber-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/20 rounded-full blur-xl -mr-16 -mt-16"></div>
              
              <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-white animate-pulse">*To Be Updated*</h3>
                  <p className="text-white font-medium">recipes created</p>
                </div>
                
                <div className="w-full grid grid-cols-2 gap-4">
                  <div className="bg-amber-700/50 rounded-xl p-4 text-center border border-amber-500/30">
                    <h3 className="text-2xl font-bold text-white">{messageCount.toLocaleString()}</h3>
                    <p className="text-white text-sm">happy users</p>
                  </div>
                  
                  <div className="bg-amber-700/50 rounded-xl p-4 text-center border border-amber-500/30">
                    <h3 className="text-2xl font-bold text-white">{responseRate}%</h3>
                    <p className="text-white text-sm">response rate</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Card - Compact */}
            <div className="bg-gradient-to-br from-amber-700/70 to-amber-800/70 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-amber-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
              
              <div className="relative z-10">
                <h2 className="text-lg font-bold text-amber-200 mb-4">Contact Us</h2>
                
                <div className="p-3 bg-amber-600/30 backdrop-blur-sm rounded-xl border border-amber-500/30">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-amber-500/40 flex items-center justify-center mr-3">
                      <Mail className="h-5 w-5 text-amber-300" />
                    </div>
                    <div>
                      <p className="text-amber-200 font-medium">adhamachilovusa@gmail.com</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText('adhamachilovusa@gmail.com');
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }} 
                    className="mt-2 ml-auto flex items-center justify-center px-3 py-1.5 bg-amber-500 text-amber-950 rounded-lg text-sm font-medium hover:bg-amber-400 transition-colors"
                  >
                    <Copy className="h-3.5 w-3.5 mr-1" />
                    {copied ? 'Copied!' : 'Copy Email'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* FAQ Card */}
          <div className="col-span-12 md:col-span-7 bg-gradient-to-br from-amber-800/70 to-amber-900/70 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-amber-500/30">
            <h2 className="text-xl font-bold text-amber-200 mb-6 flex items-center">
              <MessageSquare className="mr-2 text-amber-400" size={20} />
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-4">
              <div className="border border-amber-600/30 rounded-xl overflow-hidden">
                <button 
                  className="flex items-center justify-between w-full p-4 text-left bg-amber-700/40 hover:bg-amber-700/60 transition-colors"
                  onClick={() => setActiveFaq(activeFaq === 'faq1' ? '' : 'faq1')}
                >
                  <span className="font-medium text-amber-200">How does the recipe suggestion work?</span>
                  {activeFaq === 'faq1' ? <ChevronUp className="h-5 w-5 text-amber-400" /> : <ChevronDown className="h-5 w-5 text-amber-400" />}
                </button>
                {activeFaq === 'faq1' && (
                  <div className="p-4 bg-amber-800/30 overflow-hidden transition-all duration-300 ease-in-out" 
                       style={{ maxHeight: '500px', opacity: 1, animation: 'fadeIn 0.3s ease-in-out' }}>
                    <p className="text-amber-200 animate-fadeIn">
                      Our AI analyzes the ingredients you input and suggests recipes that can be made with those ingredients, taking into account any dietary preferences or cuisine types you specify.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="border border-amber-600/30 rounded-xl overflow-hidden">
                <button 
                  className="flex items-center justify-between w-full p-4 text-left bg-amber-700/40 hover:bg-amber-700/60 transition-colors"
                  onClick={() => setActiveFaq(activeFaq === 'faq2' ? '' : 'faq2')}
                >
                  <span className="font-medium text-amber-200">Are the recipes customizable?</span>
                  {activeFaq === 'faq2' ? <ChevronUp className="h-5 w-5 text-amber-400" /> : <ChevronDown className="h-5 w-5 text-amber-400" />}
                </button>
                {activeFaq === 'faq2' && (
                  <div className="p-4 bg-amber-800/30 overflow-hidden transition-all duration-300 ease-in-out"
                       style={{ maxHeight: '500px', opacity: 1, animation: 'fadeIn 0.3s ease-in-out' }}>
                    <p className="text-amber-200 animate-fadeIn">
                      Yes! You can filter recipes by dietary preferences like vegetarian, vegan, gluten-free, or dairy-free. You can also specify cuisine types.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="border border-amber-600/30 rounded-xl overflow-hidden">
                <button 
                  className="flex items-center justify-between w-full p-4 text-left bg-amber-700/40 hover:bg-amber-700/60 transition-colors"
                  onClick={() => setActiveFaq(activeFaq === 'faq3' ? '' : 'faq3')}
                >
                  <span className="font-medium text-amber-200">How can I save my favorite recipes?</span>
                  {activeFaq === 'faq3' ? <ChevronUp className="h-5 w-5 text-amber-400" /> : <ChevronDown className="h-5 w-5 text-amber-400" />}
                </button>
                {activeFaq === 'faq3' && (
                  <div className="p-4 bg-amber-800/30 overflow-hidden transition-all duration-300 ease-in-out"
                       style={{ maxHeight: '500px', opacity: 1, animation: 'fadeIn 0.3s ease-in-out' }}>
                    <p className="text-amber-200 animate-fadeIn">
                      Simply click the heart icon on any recipe card to add it to your favorites. You can access all your saved recipes in the "Favorites" section.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Explore Section - with gradient colors */}
          <div className="col-span-12 md:col-span-5 bg-gradient-to-br from-amber-700/70 to-amber-800/70 backdrop-blur-md border border-amber-500/30 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-md"></div>
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white/10 rounded-full blur-md"></div>
            
            <div className="relative z-10">
              <h2 className="text-xl font-bold mb-6">Explore</h2>
              <p className="mb-6 text-amber-100">Discover cooking possibilities with COOK AI</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="flex items-center">
                    <Search className="mr-3 h-5 w-5 text-amber-200" />
                    <span className="text-white font-medium">Find Recipes by Ingredients</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="flex items-center">
                    <Bookmark className="mr-3 h-5 w-5 text-amber-200" />
                    <span className="text-white font-medium">Save Your Favorites</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="flex items-center">
                    <Award className="mr-3 h-5 w-5 text-amber-200" />
                    <span className="text-white font-medium">Premium Recipe Quality</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;