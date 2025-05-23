import React from 'react';

interface PizzaLetterProps {
  className?: string;
}

const PizzaLetter: React.FC<PizzaLetterProps> = ({ className = '' }) => {
  return (
    <div 
      className={`relative flex items-center justify-center w-[120px] h-[120px] ${className}`}
      style={{ transform: 'translateY(-10px)' }}
    >
      <div 
        className="w-full h-full bg-amber-600 rounded-full flex items-center justify-center"
        style={{ 
          background: 'radial-gradient(circle, #f59e0b 60%, #d97706 100%)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '2px solid #fdba74'
        }}
      >
        {/* Pepperoni toppings */}
        <div className="absolute w-[20px] h-[20px] bg-red-600 rounded-full" style={{ top: '30%', left: '30%' }}></div>
        <div className="absolute w-[18px] h-[18px] bg-red-600 rounded-full" style={{ top: '60%', right: '35%' }}></div>
        <div className="absolute w-[16px] h-[16px] bg-red-600 rounded-full" style={{ bottom: '25%', left: '40%' }}></div>
      </div>
    </div>
  );
};

export default PizzaLetter;
