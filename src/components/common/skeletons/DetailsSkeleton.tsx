// src/components/common/skeletons/DetailsSkeleton.tsx
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  return (
    <div 
      className={`rounded-lg shadow-sm transition-colors ${className}`}
      style={{ backgroundColor: colors.utility.secondaryBackground }}
    >
      {showHeader && (
        <div 
          className="px-6 py-4 border-b transition-colors"
          style={{ borderColor: `${colors.utility.secondaryText}40` }}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div 
                className="h-8 w-64 rounded animate-pulse transition-colors"
                style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
              />
              <div 
                className="h-4 w-40 rounded animate-pulse transition-colors"
                style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
              />
            </div>
            <div className="flex space-x-2">
              <div 
                className="h-10 w-20 rounded animate-pulse transition-colors"
                style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
              />
              <div 
                className="h-10 w-20 rounded animate-pulse transition-colors"
                style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
              />
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
          <div 
            className="w-80 border-l p-6 transition-colors"
            style={{
              borderColor: `${colors.utility.secondaryText}40`,
              backgroundColor: `${colors.utility.primaryBackground}50`
            }}
          >
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
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  return (
    <div 
      className={`rounded-lg shadow-sm transition-colors ${className}`}
      style={{ backgroundColor: colors.utility.secondaryBackground }}
    >
      {showHeader && (
        <div 
          className="px-6 py-4 border-b transition-colors"
          style={{ borderColor: `${colors.utility.secondaryText}40` }}
        >
          <div 
            className="h-7 w-48 rounded animate-pulse transition-colors"
            style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
          />
        </div>
      )}

      <div 
        className="grid grid-cols-1 lg:grid-cols-2 divide-x transition-colors"
        style={{ borderColor: `${colors.utility.secondaryText}40` }}
      >
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
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  return (
    <div 
      className={`rounded-lg shadow-sm transition-colors ${className}`}
      style={{ backgroundColor: colors.utility.secondaryBackground }}
    >
      {showHeader && (
        <div 
          className="px-6 py-4 border-b transition-colors"
          style={{ borderColor: `${colors.utility.secondaryText}40` }}
        >
          <div className="flex items-center justify-between">
            <div 
              className="h-8 w-64 rounded animate-pulse transition-colors"
              style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
            />
            <div className="flex space-x-2">
              <div 
                className="h-10 w-20 rounded animate-pulse transition-colors"
                style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
              />
              <div 
                className="h-10 w-20 rounded animate-pulse transition-colors"
                style={{ backgroundColor: `${colors.brand.primary}40` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div 
        className="border-b transition-colors"
        style={{ borderColor: `${colors.utility.secondaryText}40` }}
      >
        <div className="flex space-x-8 px-6">
          {[1, 2, 3, 4].map((tab) => (
            <div 
              key={tab} 
              className={`py-4 ${tab === 1 ? 'border-b-2' : ''} transition-colors`}
              style={{ borderColor: tab === 1 ? `${colors.utility.secondaryText}60` : 'transparent' }}
            >
              <div 
                className="h-5 w-20 rounded animate-pulse transition-colors"
                style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
              />
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
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div 
            className="h-10 w-80 rounded animate-pulse transition-colors"
            style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
          />
          <div 
            className="h-4 w-48 rounded animate-pulse transition-colors"
            style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
          />
        </div>
        <div 
          className="h-10 w-10 rounded animate-pulse transition-colors"
          style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
        />
      </div>

      {/* Content cards */}
      {[1, 2, 3].map((card) => (
        <div 
          key={card} 
          className="rounded-lg shadow-sm p-6 transition-colors"
          style={{ backgroundColor: colors.utility.secondaryBackground }}
        >
          <DetailsSection />
        </div>
      ))}
    </div>
  );
};

// Reusable details section
const DetailsSection: React.FC<{ title?: boolean }> = ({ title = false }) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  return (
    <div className="space-y-4">
      {title && (
        <div 
          className="h-5 w-32 rounded animate-pulse transition-colors"
          style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
        />
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((field) => (
          <div key={field} className="space-y-2">
            <div 
              className="h-3 w-20 rounded animate-pulse transition-colors"
              style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
            />
            <div 
              className="h-4 w-32 rounded animate-pulse transition-colors"
              style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// Sidebar skeleton
const SidebarSkeleton: React.FC = () => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  return (
    <div className="space-y-6">
      {/* Activity */}
      <div className="space-y-3">
        <div 
          className="h-5 w-24 rounded animate-pulse transition-colors"
          style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
        />
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex items-start space-x-3">
            <div 
              className="h-2 w-2 rounded-full animate-pulse mt-1 transition-colors"
              style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
            />
            <div className="flex-1 space-y-1">
              <div 
                className="h-4 w-full rounded animate-pulse transition-colors"
                style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
              />
              <div 
                className="h-3 w-24 rounded animate-pulse transition-colors"
                style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Related items */}
      <div className="space-y-3">
        <div 
          className="h-5 w-32 rounded animate-pulse transition-colors"
          style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
        />
        {[1, 2].map((item) => (
          <div 
            key={item} 
            className="p-3 rounded-md transition-colors"
            style={{ backgroundColor: `${colors.utility.primaryBackground}30` }}
          >
            <div 
              className="h-4 w-full rounded animate-pulse mb-2 transition-colors"
              style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
            />
            <div 
              className="h-3 w-20 rounded animate-pulse transition-colors"
              style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
            />
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
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center justify-between py-2">
          <div 
            className="h-4 w-24 rounded animate-pulse transition-colors"
            style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
          />
          <div 
            className="h-4 w-32 rounded animate-pulse transition-colors"
            style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
          />
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
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  const gridClass = columns === 2 ? 'sm:grid-cols-2' : '';
  
  return (
    <dl className={`grid grid-cols-1 ${gridClass} gap-x-6 gap-y-4 ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="space-y-1">
          <dt 
            className="h-3 w-24 rounded animate-pulse transition-colors"
            style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
          />
          <dd 
            className="h-5 w-40 rounded animate-pulse transition-colors"
            style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
          />
        </div>
      ))}
    </dl>
  );
};

export default DetailsSkeleton;