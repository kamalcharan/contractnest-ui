// src/components/catalog/shared/CatalogViewToggle.tsx
import React from 'react';
import { Grid3X3, List, LayoutGrid, TableProperties } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface CatalogViewToggleProps {
  viewMode: 'grid' | 'list';
  onChange: (mode: 'grid' | 'list') => void;
  className?: string;
}

const CatalogViewToggle: React.FC<CatalogViewToggleProps> = ({
  viewMode,
  onChange,
  className = ''
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  
  // Get theme colors - EXACT same pattern as LoginPage
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  const viewOptions = [
    {
      value: 'grid' as const,
      icon: LayoutGrid,
      label: 'Grid view',
      description: 'Show items as cards'
    },
    {
      value: 'list' as const,
      icon: TableProperties,
      label: 'List view',
      description: 'Show items in a table'
    }
  ];
  
  return (
    <div className={`inline-flex items-center ${className}`}>
      {/* Toggle Container */}
      <div 
        className="relative inline-flex items-center p-1 rounded-lg border"
        style={{
          backgroundColor: `${colors.utility.primaryText}10`,
          borderColor: `${colors.utility.primaryText}20`
        }}
      >
        {/* Sliding Background */}
        <div
          className="absolute inset-y-1 transition-all duration-200 ease-out rounded-md shadow-sm border"
          style={{
            width: 'calc(50% - 4px)',
            transform: `translateX(${viewMode === 'grid' ? '0' : '100%'})`,
            backgroundColor: colors.utility.secondaryBackground,
            borderColor: `${colors.utility.primaryText}20`
          }}
        />
        
        {/* View Options */}
        {viewOptions.map((option) => {
          const Icon = option.icon;
          const isActive = viewMode === option.value;
          
          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className="relative z-10 flex items-center justify-center w-10 h-8 rounded-md transition-all duration-200"
              style={{
                color: isActive
                  ? colors.utility.primaryText
                  : colors.utility.secondaryText
              }}
              aria-label={option.label}
              title={option.description}
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
      </div>
      
      {/* View Mode Label (Optional - hidden on mobile) */}
      <span 
        className="ml-3 text-sm font-medium hidden sm:inline-block"
        style={{ color: colors.utility.primaryText }}
      >
        {viewMode === 'grid' ? 'Grid' : 'List'} View
      </span>
    </div>
  );
};

export default CatalogViewToggle;