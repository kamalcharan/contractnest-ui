// src/components/common/skeletons/TableSkeleton.tsx
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showCheckbox?: boolean;
  showActions?: boolean;
  className?: string;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  showCheckbox = false,
  showActions = false,
  className = ''
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  return (
    <div className={`w-full ${className}`}>
      {/* Table Header */}
      <div 
        className="border-b transition-colors"
        style={{ borderColor: `${colors.utility.secondaryText}40` }}
      >
        <div 
          className="flex items-center px-6 py-4 transition-colors"
          style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
        >
          {showCheckbox && (
            <div 
              className="w-4 h-4 mr-4 rounded animate-pulse transition-colors"
              style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
            />
          )}
          {Array.from({ length: columns }).map((_, index) => (
            <div
              key={`header-${index}`}
              className={`h-4 rounded animate-pulse transition-colors ${
                index === 0 ? 'w-40' : 'w-24'
              } ${index !== 0 ? 'ml-8' : ''}`}
              style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
            />
          ))}
          {showActions && (
            <div 
              className="ml-auto w-20 h-4 rounded animate-pulse transition-colors"
              style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
            />
          )}
        </div>
      </div>

      {/* Table Body */}
      <div 
        className="divide-y transition-colors"
        style={{ borderColor: `${colors.utility.secondaryText}40` }}
      >
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="flex items-center px-6 py-4 hover:opacity-80 transition-colors"
            style={{ backgroundColor: colors.utility.secondaryBackground }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${colors.utility.primaryBackground}30`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.utility.secondaryBackground;
            }}
          >
            {showCheckbox && (
              <div 
                className="w-4 h-4 mr-4 rounded animate-pulse transition-colors"
                style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
              />
            )}
            
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
                className={`${colIndex !== 0 ? 'ml-8' : ''}`}
              >
                {/* Primary cell (usually name/title) */}
                {colIndex === 0 ? (
                  <div className="space-y-2">
                    <div 
                      className="h-5 w-48 rounded animate-pulse transition-colors"
                      style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
                    />
                    <div 
                      className="h-3 w-32 rounded animate-pulse transition-colors"
                      style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
                    />
                  </div>
                ) : (
                  <div 
                    className={`h-4 rounded animate-pulse transition-colors ${
                      colIndex === 1 ? 'w-20' : colIndex === 2 ? 'w-28' : 'w-16'
                    }`}
                    style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
                  />
                )}
              </div>
            ))}

            {showActions && (
              <div className="ml-auto flex items-center space-x-2">
                <div 
                  className="w-8 h-8 rounded animate-pulse transition-colors"
                  style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
                />
                <div 
                  className="w-8 h-8 rounded animate-pulse transition-colors"
                  style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Optional Footer/Pagination Skeleton */}
      <div 
        className="flex items-center justify-between px-6 py-4 border-t transition-colors"
        style={{ borderColor: `${colors.utility.secondaryText}40` }}
      >
        <div 
          className="h-4 w-32 rounded animate-pulse transition-colors"
          style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
        />
        <div className="flex items-center space-x-2">
          <div 
            className="h-8 w-8 rounded animate-pulse transition-colors"
            style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
          />
          <div 
            className="h-4 w-20 rounded animate-pulse transition-colors"
            style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
          />
          <div 
            className="h-8 w-8 rounded animate-pulse transition-colors"
            style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
          />
        </div>
      </div>
    </div>
  );
};

// Variant for simple tables without header
export const SimpleTableSkeleton: React.FC<{
  rows?: number;
  showDivider?: boolean;
  className?: string;
}> = ({ rows = 3, showDivider = true, className = '' }) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  return (
    <div className={`w-full ${className}`}>
      <div className={showDivider ? 'divide-y transition-colors' : 'space-y-2'} 
           style={showDivider ? { borderColor: `${colors.utility.secondaryText}40` } : {}}>
        {Array.from({ length: rows }).map((_, index) => (
          <div key={`simple-row-${index}`} className="py-3">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div 
                  className="h-5 w-40 rounded animate-pulse transition-colors"
                  style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
                />
                <div 
                  className="h-3 w-24 rounded animate-pulse transition-colors"
                  style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
                />
              </div>
              <div 
                className="h-4 w-16 rounded animate-pulse transition-colors"
                style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;