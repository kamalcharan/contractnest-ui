// src/components/common/skeletons/CardSkeleton.tsx
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface CardSkeletonProps {
  variant?: 'default' | 'product' | 'stats' | 'pricing' | 'compact';
  showImage?: boolean;
  showActions?: boolean;
  className?: string;
}

// Default card skeleton
export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  variant = 'default',
  showImage = false,
  showActions = false,
  className = ''
}) => {
  switch (variant) {
    case 'product':
      return <ProductCardSkeleton showImage={showImage} showActions={showActions} className={className} />;
    case 'stats':
      return <StatsCardSkeleton className={className} />;
    case 'pricing':
      return <PricingCardSkeleton className={className} />;
    case 'compact':
      return <CompactCardSkeleton className={className} />;
    default:
      return <DefaultCardSkeleton showImage={showImage} showActions={showActions} className={className} />;
  }
};

// Default card variant
const DefaultCardSkeleton: React.FC<{
  showImage?: boolean;
  showActions?: boolean;
  className?: string;
}> = ({ showImage, showActions, className }) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  return (
    <div 
      className={`rounded-lg shadow-sm p-6 transition-colors ${className}`}
      style={{ backgroundColor: colors.utility.secondaryBackground }}
    >
      {showImage && (
        <div 
          className="w-full h-48 rounded-md animate-pulse mb-4 transition-colors"
          style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
        />
      )}
      
      <div className="space-y-3">
        <div 
          className="h-6 w-3/4 rounded animate-pulse transition-colors"
          style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
        />
        <div className="space-y-2">
          <div 
            className="h-4 w-full rounded animate-pulse transition-colors"
            style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
          />
          <div 
            className="h-4 w-5/6 rounded animate-pulse transition-colors"
            style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
          />
        </div>
      </div>
      
      {showActions && (
        <div 
          className="flex items-center justify-between mt-6 pt-4 border-t transition-colors"
          style={{ borderColor: `${colors.utility.secondaryText}40` }}
        >
          <div 
            className="h-4 w-20 rounded animate-pulse transition-colors"
            style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
          />
          <div className="flex space-x-2">
            <div 
              className="h-8 w-8 rounded animate-pulse transition-colors"
              style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
            />
            <div 
              className="h-8 w-8 rounded animate-pulse transition-colors"
              style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Product/Catalog card variant
const ProductCardSkeleton: React.FC<{
  showImage?: boolean;
  showActions?: boolean;
  className?: string;
}> = ({ showImage = true, showActions = true, className }) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  return (
    <div 
      className={`rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all ${className}`}
      style={{ backgroundColor: colors.utility.secondaryBackground }}
    >
      {showImage && (
        <div 
          className="w-full h-40 animate-pulse transition-colors"
          style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
        />
      )}
      
      <div className="p-4 space-y-3">
        {/* Badge */}
        <div className="flex items-center justify-between">
          <div 
            className="h-6 w-16 rounded-full animate-pulse transition-colors"
            style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
          />
          <div 
            className="h-6 w-6 rounded animate-pulse transition-colors"
            style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
          />
        </div>
        
        {/* Title */}
        <div 
          className="h-6 w-4/5 rounded animate-pulse transition-colors"
          style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
        />
        
        {/* Description */}
        <div className="space-y-2">
          <div 
            className="h-3 w-full rounded animate-pulse transition-colors"
            style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
          />
          <div 
            className="h-3 w-3/4 rounded animate-pulse transition-colors"
            style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
          />
        </div>
        
        {/* Price */}
        <div className="pt-2">
          <div 
            className="h-5 w-24 rounded animate-pulse transition-colors"
            style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
          />
          <div 
            className="h-3 w-16 rounded animate-pulse mt-1 transition-colors"
            style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
          />
        </div>
      </div>
      
      {showActions && (
        <div 
          className="px-4 py-3 border-t transition-colors"
          style={{
            backgroundColor: `${colors.utility.primaryBackground}50`,
            borderColor: `${colors.utility.secondaryText}40`
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <div 
                className="h-4 w-4 rounded animate-pulse transition-colors"
                style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
              />
              <div 
                className="h-4 w-12 rounded animate-pulse transition-colors"
                style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
              />
            </div>
            <div className="flex space-x-2">
              <div 
                className="h-8 w-16 rounded animate-pulse transition-colors"
                style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
              />
              <div 
                className="h-8 w-16 rounded animate-pulse transition-colors"
                style={{ backgroundColor: `${colors.brand.primary}40` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Stats card variant
const StatsCardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  return (
    <div 
      className={`rounded-lg shadow-sm p-6 transition-colors ${className}`}
      style={{ backgroundColor: colors.utility.secondaryBackground }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div 
            className="h-4 w-24 rounded animate-pulse transition-colors"
            style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
          />
          <div 
            className="h-8 w-32 rounded animate-pulse transition-colors"
            style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
          />
          <div className="flex items-center space-x-2 mt-2">
            <div 
              className="h-3 w-3 rounded animate-pulse transition-colors"
              style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
            />
            <div 
              className="h-3 w-16 rounded animate-pulse transition-colors"
              style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
            />
          </div>
        </div>
        <div 
          className="h-12 w-12 rounded-lg animate-pulse transition-colors"
          style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
        />
      </div>
    </div>
  );
};

// Pricing card variant
const PricingCardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  return (
    <div 
      className={`rounded-lg shadow-sm p-6 transition-colors ${className}`}
      style={{ backgroundColor: colors.utility.secondaryBackground }}
    >
      {/* Header */}
      <div 
        className="text-center space-y-2 pb-6 border-b transition-colors"
        style={{ borderColor: `${colors.utility.secondaryText}40` }}
      >
        <div 
          className="h-6 w-32 rounded animate-pulse mx-auto transition-colors"
          style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
        />
        <div 
          className="h-10 w-24 rounded animate-pulse mx-auto transition-colors"
          style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
        />
        <div 
          className="h-4 w-20 rounded animate-pulse mx-auto transition-colors"
          style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
        />
      </div>
      
      {/* Features */}
      <div className="py-6 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center space-x-3">
            <div 
              className="h-4 w-4 rounded animate-pulse transition-colors"
              style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
            />
            <div 
              className="h-4 w-40 rounded animate-pulse transition-colors"
              style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
            />
          </div>
        ))}
      </div>
      
      {/* Action */}
      <div 
        className="h-10 w-full rounded-md animate-pulse transition-colors"
        style={{ backgroundColor: `${colors.brand.primary}40` }}
      />
    </div>
  );
};

// Compact card variant
const CompactCardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  return (
    <div 
      className={`rounded-lg shadow-sm p-4 transition-colors ${className}`}
      style={{ backgroundColor: colors.utility.secondaryBackground }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div 
            className="h-10 w-10 rounded-full animate-pulse transition-colors"
            style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
          />
          <div className="space-y-2">
            <div 
              className="h-4 w-32 rounded animate-pulse transition-colors"
              style={{ backgroundColor: `${colors.utility.secondaryText}60` }}
            />
            <div 
              className="h-3 w-20 rounded animate-pulse transition-colors"
              style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
            />
          </div>
        </div>
        <div 
          className="h-8 w-8 rounded animate-pulse transition-colors"
          style={{ backgroundColor: `${colors.utility.primaryBackground}50` }}
        />
      </div>
    </div>
  );
};

// Grid skeleton wrapper
export const CardGridSkeleton: React.FC<{
  count?: number;
  columns?: 2 | 3 | 4;
  variant?: CardSkeletonProps['variant'];
  showImage?: boolean;
  showActions?: boolean;
  className?: string;
}> = ({ 
  count = 6, 
  columns = 3, 
  variant = 'default',
  showImage = false,
  showActions = false,
  className = '' 
}) => {
  const gridColumns = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid ${gridColumns[columns]} gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton
          key={index}
          variant={variant}
          showImage={showImage}
          showActions={showActions}
        />
      ))}
    </div>
  );
};

export default CardSkeleton;