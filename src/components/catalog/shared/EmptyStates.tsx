// src/components/catalog/shared/EmptyStates.tsx
import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  Package,
  Search,
  Filter,
  Plus,
  AlertTriangle,
  FileX,
  Database,
  Zap,
  Users,
  DollarSign,
  Settings,
  RefreshCw,
  ArrowRight,
  BookOpen,
  Lightbulb
} from 'lucide-react';

interface EmptyStatesProps {
  variant?: 'no-services' | 'no-search-results' | 'no-filter-results' | 'error' | 'no-data' | 'no-resources' | 'no-pricing' | 'first-time';
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  showIllustration?: boolean;
  className?: string;
}

const EmptyStates: React.FC<EmptyStatesProps> = ({
  variant = 'no-services',
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  showIllustration = true,
  className = ''
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // Get configuration for each variant
  const getVariantConfig = () => {
    switch (variant) {
      case 'no-services':
        return {
          icon: Package,
          title: title || 'No services yet',
          description: description || "You haven't added any services to your catalog yet. Create your first service to get started.",
          actionLabel: actionLabel || 'Create Service',
          iconColor: colors.brand.primary,
          bgColor: colors.brand.primary + '10'
        };

      case 'no-search-results':
        return {
          icon: Search,
          title: title || 'No search results',
          description: description || 'No services match your search criteria. Try adjusting your search terms or filters.',
          actionLabel: actionLabel || 'Clear Search',
          secondaryActionLabel: secondaryActionLabel || 'Create Service',
          iconColor: colors.utility.secondaryText,
          bgColor: colors.utility.secondaryText + '10'
        };

      case 'no-filter-results':
        return {
          icon: Filter,
          title: title || 'No matching services',
          description: description || 'No services match your current filters. Try adjusting your filter criteria.',
          actionLabel: actionLabel || 'Clear Filters',
          secondaryActionLabel: secondaryActionLabel || 'View All Services',
          iconColor: colors.semantic.warning,
          bgColor: colors.semantic.warning + '10'
        };

      case 'error':
        return {
          icon: AlertTriangle,
          title: title || 'Something went wrong',
          description: description || 'We encountered an error while loading your services. Please try again.',
          actionLabel: actionLabel || 'Try Again',
          secondaryActionLabel: secondaryActionLabel || 'Go Back',
          iconColor: colors.semantic.error,
          bgColor: colors.semantic.error + '10'
        };

      case 'no-data':
        return {
          icon: Database,
          title: title || 'No data available',
          description: description || 'There is no data to display at the moment.',
          actionLabel: actionLabel || 'Refresh',
          iconColor: colors.utility.secondaryText,
          bgColor: colors.utility.secondaryText + '10'
        };

      case 'no-resources':
        return {
          icon: Users,
          title: title || 'No resources configured',
          description: description || 'You need to set up resources before creating resource-based services.',
          actionLabel: actionLabel || 'Manage Resources',
          secondaryActionLabel: secondaryActionLabel || 'Learn More',
          iconColor: colors.brand.secondary,
          bgColor: colors.brand.secondary + '10'
        };

      case 'no-pricing':
        return {
          icon: DollarSign,
          title: title || 'No pricing set',
          description: description || 'This service needs pricing information before it can be used.',
          actionLabel: actionLabel || 'Add Pricing',
          iconColor: colors.semantic.warning,
          bgColor: colors.semantic.warning + '10'
        };

      case 'first-time':
        return {
          icon: Zap,
          title: title || 'Welcome to Service Catalog',
          description: description || "Let's get you started by creating your first service. You can add pricing, resources, and detailed descriptions.",
          actionLabel: actionLabel || 'Create First Service',
          secondaryActionLabel: secondaryActionLabel || 'Watch Tutorial',
          iconColor: colors.brand.primary,
          bgColor: colors.brand.primary + '10'
        };

      default:
        return {
          icon: Package,
          title: title || 'Empty',
          description: description || 'Nothing to show here.',
          actionLabel: actionLabel || 'Take Action',
          iconColor: colors.utility.secondaryText,
          bgColor: colors.utility.secondaryText + '10'
        };
    }
  };

  const config = getVariantConfig();
  const IconComponent = config.icon;

  return (
    <div 
      className={`rounded-lg border p-12 text-center transition-colors ${className}`}
      style={{
        backgroundColor: colors.utility.secondaryBackground,
        borderColor: colors.utility.primaryText + '20'
      }}
    >
      {/* Illustration/Icon */}
      {showIllustration && (
        <div 
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: config.bgColor }}
        >
          <IconComponent 
            className="h-10 w-10"
            style={{ color: config.iconColor }}
          />
        </div>
      )}

      {/* Content */}
      <div className="max-w-md mx-auto">
        <h3 
          className="text-xl font-semibold mb-3 transition-colors"
          style={{ color: colors.utility.primaryText }}
        >
          {config.title}
        </h3>
        
        <p 
          className="text-base leading-relaxed mb-8 transition-colors"
          style={{ color: colors.utility.secondaryText }}
        >
          {config.description}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {config.actionLabel && onAction && (
            <button 
              onClick={onAction}
              className="flex items-center justify-center px-6 py-3 rounded-md hover:opacity-90 transition-colors font-medium"
              style={{
                backgroundColor: colors.brand.primary,
                color: '#ffffff'
              }}
            >
              {variant === 'first-time' && <Plus className="mr-2 h-4 w-4" />}
              {variant === 'error' && <RefreshCw className="mr-2 h-4 w-4" />}
              {variant === 'no-services' && <Plus className="mr-2 h-4 w-4" />}
              {config.actionLabel}
            </button>
          )}

          {config.secondaryActionLabel && onSecondaryAction && (
            <button 
              onClick={onSecondaryAction}
              className="flex items-center justify-center px-6 py-3 rounded-md border hover:opacity-80 transition-colors font-medium"
              style={{
                borderColor: colors.utility.primaryText + '40',
                color: colors.utility.primaryText,
                backgroundColor: 'transparent'
              }}
            >
              {variant === 'first-time' && <BookOpen className="mr-2 h-4 w-4" />}
              {variant === 'no-resources' && <ArrowRight className="mr-2 h-4 w-4" />}
              {config.secondaryActionLabel}
            </button>
          )}
        </div>
      </div>

      {/* Additional Tips for First-time Users */}
      {variant === 'first-time' && (
        <div 
          className="mt-8 p-4 rounded-lg text-left max-w-lg mx-auto"
          style={{
            backgroundColor: colors.utility.primaryBackground,
            border: `1px solid ${colors.utility.primaryText}20`
          }}
        >
          <div className="flex items-start gap-3">
            <Lightbulb 
              className="h-5 w-5 mt-0.5 flex-shrink-0"
              style={{ color: colors.semantic.warning }}
            />
            <div>
              <h4 
                className="font-medium mb-2 transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                Quick Tips
              </h4>
              <ul 
                className="text-sm space-y-1 transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                <li>• Start with an independent service for simple pricing</li>
                <li>• Use resource-based services for complex team requirements</li>
                <li>• Add detailed descriptions to help your team understand each service</li>
                <li>• Set up pricing with tax information for accurate calculations</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Search Help for No Results */}
      {(variant === 'no-search-results' || variant === 'no-filter-results') && (
        <div 
          className="mt-6 p-4 rounded-lg text-left max-w-lg mx-auto"
          style={{
            backgroundColor: colors.utility.primaryBackground,
            border: `1px solid ${colors.utility.primaryText}20`
          }}
        >
          <h4 
            className="font-medium mb-2 transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            Search Tips
          </h4>
          <ul 
            className="text-sm space-y-1 transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            <li>• Try different or fewer keywords</li>
            <li>• Check your spelling</li>
            <li>• Use broader search terms</li>
            <li>• Clear some filters to see more results</li>
          </ul>
        </div>
      )}
    </div>
  );
};

// Specific empty state components for common use cases
export const NoServicesState: React.FC<{ 
  onCreateService?: () => void;
  isFirstTime?: boolean;
}> = ({ onCreateService, isFirstTime = false }) => {
  return (
    <EmptyStates
      variant={isFirstTime ? 'first-time' : 'no-services'}
      onAction={onCreateService}
      onSecondaryAction={isFirstTime ? () => {
        // Open help/tutorial
        console.log('Open tutorial');
      } : undefined}
    />
  );
};

export const NoSearchResultsState: React.FC<{
  searchTerm?: string;
  onClearSearch?: () => void;
  onCreateService?: () => void;
}> = ({ searchTerm, onClearSearch, onCreateService }) => {
  return (
    <EmptyStates
      variant="no-search-results"
      description={searchTerm 
        ? `No services found for "${searchTerm}". Try adjusting your search terms or create a new service.`
        : 'No services match your search criteria. Try adjusting your search terms or filters.'
      }
      onAction={onClearSearch}
      onSecondaryAction={onCreateService}
    />
  );
};

export const NoFilterResultsState: React.FC<{
  onClearFilters?: () => void;
  onViewAll?: () => void;
}> = ({ onClearFilters, onViewAll }) => {
  return (
    <EmptyStates
      variant="no-filter-results"
      onAction={onClearFilters}
      onSecondaryAction={onViewAll}
    />
  );
};

export const ErrorState: React.FC<{
  error?: string;
  onRetry?: () => void;
  onGoBack?: () => void;
}> = ({ error, onRetry, onGoBack }) => {
  return (
    <EmptyStates
      variant="error"
      description={error || 'We encountered an error while loading your services. Please try again.'}
      onAction={onRetry}
      onSecondaryAction={onGoBack}
    />
  );
};

export const NoResourcesState: React.FC<{
  onManageResources?: () => void;
  onLearnMore?: () => void;
}> = ({ onManageResources, onLearnMore }) => {
  return (
    <EmptyStates
      variant="no-resources"
      onAction={onManageResources}
      onSecondaryAction={onLearnMore}
    />
  );
};

export const NoPricingState: React.FC<{
  onAddPricing?: () => void;
}> = ({ onAddPricing }) => {
  return (
    <EmptyStates
      variant="no-pricing"
      onAction={onAddPricing}
    />
  );
};

// Export both the main component and the specific states
export default EmptyStates;