// src/components/catalog/shared/LoadingStates.tsx
import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  Loader2, 
  Package, 
  Clock,
  Search,
  Grid3X3,
  List
} from 'lucide-react';

interface LoadingStatesProps {
  variant?: 'grid' | 'list' | 'form' | 'page' | 'search' | 'stats' | 'minimal';
  count?: number;
  message?: string;
  showIcon?: boolean;
}

const LoadingStates: React.FC<LoadingStatesProps> = ({
  variant = 'grid',
  count = 6,
  message,
  showIcon = true
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // Minimal loading (spinner only)
  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 
          className="h-6 w-6 animate-spin"
          style={{ color: colors.brand.primary }}
        />
        {message && (
          <span 
            className="ml-3 text-sm transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            {message}
          </span>
        )}
      </div>
    );
  }

  // Page loading (full page with centered content)
  if (variant === 'page') {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.utility.primaryBackground }}
      >
        <div className="text-center">
          {showIcon && (
            <Clock 
              className="h-8 w-8 animate-spin mx-auto mb-4"
              style={{ color: colors.brand.primary }}
            />
          )}
          <p 
            className="text-lg font-medium transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            {message || 'Loading...'}
          </p>
          <p 
            className="text-sm mt-2 transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Please wait while we fetch the data
          </p>
        </div>
      </div>
    );
  }

  // Search loading
  if (variant === 'search') {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <Search 
            className="h-8 w-8 animate-pulse mx-auto mb-4"
            style={{ color: colors.brand.primary }}
          />
          <p 
            className="text-lg font-medium transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            {message || 'Searching...'}
          </p>
          <p 
            className="text-sm mt-2 transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            Finding matching services
          </p>
        </div>
      </div>
    );
  }

  // Stats loading
  if (variant === 'stats') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i}
            className="rounded-lg border p-4 transition-colors"
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: colors.utility.primaryText + '20'
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div 
                  className="h-8 w-16 rounded mb-2"
                  style={{ backgroundColor: colors.utility.secondaryText + '20' }}
                />
                <div 
                  className="h-4 w-20 rounded"
                  style={{ backgroundColor: colors.utility.secondaryText + '20' }}
                />
              </div>
              <div 
                className="w-8 h-8 rounded"
                style={{ backgroundColor: colors.utility.secondaryText + '20' }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Form loading
  if (variant === 'form') {
    return (
      <div 
        className="space-y-6 animate-pulse"
        style={{ backgroundColor: colors.utility.primaryBackground }}
      >
        {/* Form header */}
        <div className="text-center">
          <div 
            className="h-8 w-64 rounded mx-auto mb-2"
            style={{ backgroundColor: colors.utility.secondaryText + '20' }}
          />
          <div 
            className="h-4 w-48 rounded mx-auto"
            style={{ backgroundColor: colors.utility.secondaryText + '20' }}
          />
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <div 
                  className="h-4 w-24 rounded mb-2"
                  style={{ backgroundColor: colors.utility.secondaryText + '20' }}
                />
                <div 
                  className="h-10 w-full rounded border"
                  style={{ 
                    backgroundColor: colors.utility.primaryBackground,
                    borderColor: colors.utility.primaryText + '20'
                  }}
                />
              </div>
            ))}
          </div>
          <div className="space-y-6">
            <div 
              className="h-48 w-full rounded border"
              style={{ 
                backgroundColor: colors.utility.primaryBackground,
                borderColor: colors.utility.primaryText + '20'
              }}
            />
            <div 
              className="h-32 w-full rounded border"
              style={{ 
                backgroundColor: colors.utility.primaryBackground,
                borderColor: colors.utility.primaryText + '20'
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Grid loading (default)
  if (variant === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
        {[...Array(count)].map((_, i) => (
          <div 
            key={i} 
            className="rounded-lg border transition-colors"
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: colors.utility.primaryText + '20'
            }}
          >
            {/* Image placeholder */}
            <div 
              className="w-full h-48 rounded-t-lg"
              style={{ backgroundColor: colors.utility.secondaryText + '20' }}
            />
            
            {/* Content */}
            <div className="p-4">
              {/* Title */}
              <div 
                className="h-6 rounded mb-2"
                style={{ backgroundColor: colors.utility.secondaryText + '20' }}
              />
              
              {/* SKU */}
              <div 
                className="h-3 w-24 rounded mb-3"
                style={{ backgroundColor: colors.utility.secondaryText + '20' }}
              />
              
              {/* Description */}
              <div className="space-y-2 mb-4">
                <div 
                  className="h-4 rounded"
                  style={{ backgroundColor: colors.utility.secondaryText + '20' }}
                />
                <div 
                  className="h-4 w-3/4 rounded"
                  style={{ backgroundColor: colors.utility.secondaryText + '20' }}
                />
              </div>
              
              {/* Footer */}
              <div className="flex items-center justify-between">
                <div 
                  className="h-6 w-20 rounded"
                  style={{ backgroundColor: colors.utility.secondaryText + '20' }}
                />
                <div className="flex gap-2">
                  <div 
                    className="h-8 w-8 rounded"
                    style={{ backgroundColor: colors.utility.secondaryText + '20' }}
                  />
                  <div 
                    className="h-8 w-8 rounded"
                    style={{ backgroundColor: colors.utility.secondaryText + '20' }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // List loading
  if (variant === 'list') {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(count)].map((_, i) => (
          <div 
            key={i} 
            className="rounded-lg border p-4 transition-colors"
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: colors.utility.primaryText + '20'
            }}
          >
            <div className="flex items-center gap-4">
              {/* Checkbox */}
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: colors.utility.secondaryText + '20' }}
              />
              
              {/* Image */}
              <div 
                className="w-16 h-16 rounded-md"
                style={{ backgroundColor: colors.utility.secondaryText + '20' }}
              />
              
              {/* Content */}
              <div className="flex-1">
                <div 
                  className="h-5 w-48 rounded mb-2"
                  style={{ backgroundColor: colors.utility.secondaryText + '20' }}
                />
                <div 
                  className="h-3 w-24 rounded mb-2"
                  style={{ backgroundColor: colors.utility.secondaryText + '20' }}
                />
                <div 
                  className="h-4 w-96 rounded"
                  style={{ backgroundColor: colors.utility.secondaryText + '20' }}
                />
              </div>
              
              {/* Price */}
              <div className="text-right">
                <div 
                  className="h-6 w-20 rounded mb-1"
                  style={{ backgroundColor: colors.utility.secondaryText + '20' }}
                />
                <div 
                  className="h-3 w-16 rounded"
                  style={{ backgroundColor: colors.utility.secondaryText + '20' }}
                />
              </div>
              
              {/* Actions */}
              <div className="flex gap-2">
                <div 
                  className="h-8 w-8 rounded"
                  style={{ backgroundColor: colors.utility.secondaryText + '20' }}
                />
                <div 
                  className="h-8 w-8 rounded"
                  style={{ backgroundColor: colors.utility.secondaryText + '20' }}
                />
                <div 
                  className="h-8 w-8 rounded"
                  style={{ backgroundColor: colors.utility.secondaryText + '20' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

// Specific loading components for common use cases
export const ServiceListSkeleton: React.FC<{ viewType?: 'grid' | 'list'; count?: number }> = ({ 
  viewType = 'grid', 
  count = 6 
}) => {
  return <LoadingStates variant={viewType} count={count} />;
};

export const ServiceFormSkeleton: React.FC = () => {
  return <LoadingStates variant="form" />;
};

export const ServicePageSkeleton: React.FC<{ message?: string }> = ({ message }) => {
  return <LoadingStates variant="page" message={message} />;
};

export const ServiceStatsSkeleton: React.FC = () => {
  return <LoadingStates variant="stats" />;
};

export const ServiceSearchSkeleton: React.FC<{ message?: string }> = ({ message }) => {
  return <LoadingStates variant="search" message={message} />;
};

export const MinimalLoader: React.FC<{ message?: string }> = ({ message }) => {
  return <LoadingStates variant="minimal" message={message} />;
};

// Export both the main component and the specific skeletons
export default LoadingStates;