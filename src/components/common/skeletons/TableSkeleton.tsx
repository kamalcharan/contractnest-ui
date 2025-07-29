// src/components/common/skeletons/TableSkeleton.tsx
import React from 'react';

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
  return (
    <div className={`w-full ${className}`}>
      {/* Table Header */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center px-6 py-4 bg-gray-50 dark:bg-gray-800">
          {showCheckbox && (
            <div className="w-4 h-4 mr-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
          )}
          {Array.from({ length: columns }).map((_, index) => (
            <div
              key={`header-${index}`}
              className={`h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse ${
                index === 0 ? 'w-40' : 'w-24'
              } ${index !== 0 ? 'ml-8' : ''}`}
            />
          ))}
          {showActions && (
            <div className="ml-auto w-20 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
          )}
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="flex items-center px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          >
            {showCheckbox && (
              <div className="w-4 h-4 mr-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            )}
            
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
                className={`${colIndex !== 0 ? 'ml-8' : ''}`}
              >
                {/* Primary cell (usually name/title) */}
                {colIndex === 0 ? (
                  <div className="space-y-2">
                    <div className="h-5 w-48 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
                    <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  </div>
                ) : (
                  <div 
                    className={`h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${
                      colIndex === 1 ? 'w-20' : colIndex === 2 ? 'w-28' : 'w-16'
                    }`} 
                  />
                )}
              </div>
            ))}

            {showActions && (
              <div className="ml-auto flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Optional Footer/Pagination Skeleton */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
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
  return (
    <div className={`w-full ${className}`}>
      <div className={showDivider ? 'divide-y divide-gray-200 dark:divide-gray-700' : 'space-y-2'}>
        {Array.from({ length: rows }).map((_, index) => (
          <div key={`simple-row-${index}`} className="py-3">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-5 w-40 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton;