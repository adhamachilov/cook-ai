import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Background from './Background';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col relative overflow-x-hidden">
      <Background />
      <Navbar />
      <main className="flex-1 pt-16 relative z-10">{children}</main>
      <Footer />
      <div className="fixed inset-0 pointer-events-none z-[-2] opacity-50 overflow-hidden">
        <div className="absolute inset-0 bg-repeat" style={{ backgroundImage: 'url(/patterns/food-pattern.svg)' }}></div>
      </div>
    </div>
  );
};

export default Layout;