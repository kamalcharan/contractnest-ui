// src/components/common/skeletons/CardSkeleton.tsx
import React from 'react';

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
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 ${className}`}>
      {showImage && (
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse mb-4" />
      )}
      
      <div className="space-y-3">
        <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
      
      {showActions && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="flex space-x-2">
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
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
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow ${className}`}>
      {showImage && (
        <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}
      
      <div className="p-4 space-y-3">
        {/* Badge */}
        <div className="flex items-center justify-between">
          <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
          <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        
        {/* Title */}
        <div className="h-6 w-4/5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
        
        {/* Description */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        
        {/* Price */}
        <div className="pt-2">
          <div className="h-5 w-24 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
          <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1" />
        </div>
      </div>
      
      {showActions && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <div className="h-4 w-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
              <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="flex space-x-2">
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-8 w-16 bg-blue-200 dark:bg-blue-900 rounded animate-pulse" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Stats card variant
const StatsCardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
          <div className="h-8 w-32 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
          <div className="flex items-center space-x-2 mt-2">
            <div className="h-3 w-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
        <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
      </div>
    </div>
  );
};

// Pricing card variant
const PricingCardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 ${className}`}>
      {/* Header */}
      <div className="text-center space-y-2 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="h-6 w-32 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mx-auto" />
        <div className="h-10 w-24 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mx-auto" />
        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto" />
      </div>
      
      {/* Features */}
      <div className="py-6 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center space-x-3">
            <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        ))}
      </div>
      
      {/* Action */}
      <div className="h-10 w-full bg-blue-200 dark:bg-blue-900 rounded-md animate-pulse" />
    </div>
  );
};

// Compact card variant
const CompactCardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
            <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
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