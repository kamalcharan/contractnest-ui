//src/components/misc/MiscPageLayout.tsx

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../lib/utils';
import MiscIllustration from './MiscIllustration';

interface MiscPageAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  icon?: React.ReactNode;
}

interface MiscPageLayoutProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  illustration: string;
  actions?: MiscPageAction[];
  children?: React.ReactNode;
}

const MiscPageLayout: React.FC<MiscPageLayoutProps> = ({
  icon,
  title,
  description,
  illustration,
  actions = [],
  children
}) => {
  const { isDarkMode } = useTheme();

  const getButtonClasses = (variant: string = 'primary') => {
    const baseClasses = 'inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    switch (variant) {
      case 'primary':
        return cn(baseClasses, 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary');
      case 'outline':
        return cn(baseClasses, 'border border-border bg-background hover:bg-accent hover:text-accent-foreground');
      case 'ghost':
        return cn(baseClasses, 'hover:bg-accent hover:text-accent-foreground');
      default:
        return baseClasses;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-2xl w-full">
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className={cn(
              'p-4 rounded-full',
              isDarkMode ? 'bg-primary/10 text-primary' : 'bg-primary/10 text-primary'
            )}>
              {icon}
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              {description}
            </p>
          </div>

          {/* Illustration */}
          <div className="py-8">
            <MiscIllustration name={illustration} className="mx-auto" />
          </div>

          {/* Actions */}
          {actions.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={getButtonClasses(action.variant)}
                >
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Additional Content */}
          {children}
        </div>
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className={cn(
          'absolute -top-40 -right-40 h-80 w-80 rounded-full opacity-20 blur-3xl',
          isDarkMode ? 'bg-primary' : 'bg-primary/30'
        )} />
        <div className={cn(
          'absolute -bottom-40 -left-40 h-80 w-80 rounded-full opacity-20 blur-3xl',
          isDarkMode ? 'bg-primary' : 'bg-primary/30'
        )} />
      </div>
    </div>
  );
};

export default MiscPageLayout;