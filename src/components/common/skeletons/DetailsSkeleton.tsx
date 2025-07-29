// src/components/common/skeletons/DetailsSkeleton.tsx
import React from 'react';

interface DetailsSkeletonProps {
  variant?: 'default' | 'split' | 'tabs' | 'minimal';
  showHeader?: boolean;
  showSidebar?: boolean;
  className?: string;
}

// Main details skeleton component
export const DetailsSkeleton: React.FC<DetailsSkeletonProps> = ({
  variant = 'default',
  showHeader = true,
  showSidebar = false,
  className = ''
}) => {
  switch (variant) {
    case 'split':
      return <SplitDetailsSkeleton showHeader={showHeader} className={className} />;
    case 'tabs':
      return <TabbedDetailsSkeleton showHeader={showHeader} className={className} />;
    case 'minimal':
      return <MinimalDetailsSkeleton className={className} />;
    default:
      return <DefaultDetailsSkeleton showHeader={showHeader} showSidebar={showSidebar} className={className} />;
  }
};

// Default details view
const DefaultDetailsSkeleton: React.FC<{
  showHeader?: boolean;
  showSidebar?: boolean;
  className?: string;
}> = ({ showHeader, showSidebar, className }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm ${className}`}>
      {showHeader && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 w-64 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
              <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="flex space-x-2">
              <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        </div>
      )}

      <div className={`${showSidebar ? 'flex' : ''}`}>
        {/* Main content */}
        <div className="flex-1 p-6 space-y-6">
          {/* Info sections */}
          {[1, 2, 3].map((section) => (
            <DetailsSection key={section} />
          ))}
        </div>

        {/* Sidebar */}
        {showSidebar && (
          <div className="w-80 border-l border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900/50">
            <SidebarSkeleton />
          </div>
        )}
      </div>
    </div>
  );
};

// Split view variant (two columns)
const SplitDetailsSkeleton: React.FC<{
  showHeader?: boolean;
  className?: string;
}> = ({ showHeader, className }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm ${className}`}>
      {showHeader && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="h-7 w-48 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 divide-x divide-gray-200 dark:divide-gray-700">
        {/* Left column */}
        <div className="p-6 space-y-6">
          <DetailsSection title />
          <DetailsSection />
        </div>

        {/* Right column */}
        <div className="p-6 space-y-6">
          <DetailsSection title />
          <DetailsSection />
        </div>
      </div>
    </div>
  );
};

// Tabbed view variant
const TabbedDetailsSkeleton: React.FC<{
  showHeader?: boolean;
  className?: string;
}> = ({ showHeader, className }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm ${className}`}>
      {showHeader && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="h-8 w-64 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
            <div className="flex space-x-2">
              <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-10 w-20 bg-blue-200 dark:bg-blue-900 rounded animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-8 px-6">
          {[1, 2, 3, 4].map((tab) => (
            <div 
              key={tab} 
              className={`py-4 ${tab === 1 ? 'border-b-2 border-gray-300' : ''}`}
            >
              <div className="h-5 w-20 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="p-6 space-y-6">
        <DetailsSection />
        <DetailsSection />
      </div>
    </div>
  );
};

// Minimal details variant
const MinimalDetailsSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-10 w-80 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
          <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      </div>

      {/* Content cards */}
      {[1, 2, 3].map((card) => (
        <div key={card} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <DetailsSection />
        </div>
      ))}
    </div>
  );
};

// Reusable details section
const DetailsSection: React.FC<{ title?: boolean }> = ({ title = false }) => {
  return (
    <div className="space-y-4">
      {title && (
        <div className="h-5 w-32 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((field) => (
          <div key={field} className="space-y-2">
            <div className="h-3 w-20 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};

// Sidebar skeleton
const SidebarSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Activity */}
      <div className="space-y-3">
        <div className="h-5 w-24 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex items-start space-x-3">
            <div className="h-2 w-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-pulse mt-1" />
            <div className="flex-1 space-y-1">
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Related items */}
      <div className="space-y-3">
        <div className="h-5 w-32 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
        {[1, 2].map((item) => (
          <div key={item} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
            <div className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-2" />
            <div className="h-3 w-20 bg-gray-200 dark:bg-gray-500 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
};

// Key-value list skeleton
export const KeyValueListSkeleton: React.FC<{
  rows?: number;
  className?: string;
}> = ({ rows = 4, className = '' }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center justify-between py-2">
          <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
};

// Description list skeleton
export const DescriptionListSkeleton: React.FC<{
  items?: number;
  columns?: 1 | 2;
  className?: string;
}> = ({ items = 4, columns = 1, className = '' }) => {
  const gridClass = columns === 2 ? 'sm:grid-cols-2' : '';
  
  return (
    <dl className={`grid grid-cols-1 ${gridClass} gap-x-6 gap-y-4 ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="space-y-1">
          <dt className="h-3 w-24 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
          <dd className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      ))}
    </dl>
  );
};

export default DetailsSkeleton;