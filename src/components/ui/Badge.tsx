import React from 'react';
import { cn } from '../../lib/utils';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className,
}) => {
  const variantClasses = {
    default: 'bg-amber-700/50 text-amber-200',
    primary: 'bg-amber-600/60 text-amber-100',
    secondary: 'bg-amber-700/80 text-amber-200',
    success: 'bg-amber-800/60 text-amber-100',
    warning: 'bg-amber-500/60 text-amber-950',
    error: 'bg-red-900/70 text-amber-100',
    outline: 'bg-transparent border border-amber-500/50 text-amber-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;