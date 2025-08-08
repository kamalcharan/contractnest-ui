// src/components/dashboard/QuickActions.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface QuickAction {
  title: string;
  icon: React.ElementType;
  href: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
  className?: string;
}

const QuickActions: React.FC<QuickActionsProps> = ({ actions, className = '' }) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  return (
    <div 
      className={`rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${className}`}
      style={{
        backgroundColor: colors.utility.secondaryBackground,
        borderColor: colors.utility.secondaryText + '20'
      }}
    >
      <div 
        className="p-4 border-b transition-colors"
        style={{ borderColor: colors.utility.secondaryText + '20' }}
      >
        <h3 
          className="font-medium transition-colors"
          style={{ color: colors.utility.primaryText }}
        >
          Quick Actions
        </h3>
      </div>
      
      <div className="p-4 grid gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          
          return (
            <Link
              key={index}
              to={action.href}
              className="flex items-center p-3 rounded-md border transition-all group hover:opacity-90"
              style={{
                backgroundColor: colors.brand.primary + '05',
                borderColor: colors.brand.primary + '10',
                color: colors.utility.primaryText
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.brand.primary + '10';
                e.currentTarget.style.borderColor = colors.brand.primary + '20';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.brand.primary + '05';
                e.currentTarget.style.borderColor = colors.brand.primary + '10';
              }}
            >
              <div 
                className="h-9 w-9 rounded-md flex items-center justify-center mr-3 transition-all group-hover:opacity-90"
                style={{ backgroundColor: colors.brand.primary + '10' }}
              >
                <Icon 
                  size={18} 
                  style={{ color: colors.brand.primary }}
                />
              </div>
              <span className="font-medium text-sm">{action.title}</span>
            </Link>
          );
        })}
        
        <Link
          to="/contracts/templates"
          className="flex items-center p-3 rounded-md border border-dashed transition-colors hover:opacity-80"
          style={{
            backgroundColor: colors.utility.secondaryText + '05',
            borderColor: colors.utility.secondaryText + '30',
            color: colors.utility.secondaryText
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.utility.secondaryText + '10';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.utility.secondaryText + '05';
          }}
        >
          <div 
            className="h-9 w-9 rounded-md flex items-center justify-center mr-3 transition-colors"
            style={{ backgroundColor: colors.utility.secondaryText + '10' }}
          >
            <PlusCircle 
              size={18} 
              style={{ color: colors.utility.secondaryText }}
            />
          </div>
          <span className="font-medium text-sm">Manage Templates</span>
        </Link>
      </div>
    </div>
  );
};

export default QuickActions;