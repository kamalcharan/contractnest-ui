// src/components/contacts/filters/FilterEmptyState.tsx
import React from 'react';
import { 
  Search, 
  Filter, 
  AlertCircle, 
  RefreshCw,
  Users,
  FileSearch,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import FilterChip, { FilterChipGroup } from './FilterChip';
import { cn } from '@/lib/utils';

interface FilterEmptyStateProps {
  type?: 'no-results' | 'no-matches' | 'error';
  title?: string;
  description?: string;
  onClearFilters?: () => void;
  onRefresh?: () => void;
  activeFilters?: Array<{
    label: string;
    value?: string;
    onRemove: () => void;
  }>;
  suggestions?: string[];
  className?: string;
}

const FilterEmptyState: React.FC<FilterEmptyStateProps> = ({
  type = 'no-results',
  title,
  description,
  onClearFilters,
  onRefresh,
  activeFilters = [],
  suggestions = [],
  className
}) => {
  // Get appropriate icon based on type
  const getIcon = () => {
    switch (type) {
      case 'no-matches':
        return <FileSearch className="h-16 w-16 text-muted-foreground/50" />;
      case 'error':
        return <XCircle className="h-16 w-16 text-destructive/50" />;
      default:
        return <Search className="h-16 w-16 text-muted-foreground/50" />;
    }
  };

  // Get default title based on type
  const getTitle = () => {
    if (title) return title;
    switch (type) {
      case 'no-matches':
        return 'No matches found';
      case 'error':
        return 'Something went wrong';
      default:
        return 'No results found';
    }
  };

  // Get default description based on type
  const getDescription = () => {
    if (description) return description;
    switch (type) {
      case 'no-matches':
        return 'Try adjusting your filters or search terms to find what you\'re looking for.';
      case 'error':
        return 'We encountered an error while loading your results. Please try again.';
      default:
        return 'No contacts match your current filter criteria.';
    }
  };

  return (
    <Card className={cn(
      "flex flex-col items-center justify-center p-8 text-center",
      "min-h-[400px] bg-muted/5 border-dashed",
      className
    )}>
      {/* Icon */}
      <div className="mb-6 p-4 rounded-full bg-muted/30">
        {getIcon()}
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold mb-2">
        {getTitle()}
      </h3>

      {/* Description */}
      <p className="text-muted-foreground mb-6 max-w-md">
        {getDescription()}
      </p>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-3">Current filters:</p>
          <FilterChipGroup>
            {activeFilters.map((filter, index) => (
              <FilterChip
                key={index}
                label={filter.label}
                value={filter.value}
                onRemove={filter.onRemove}
                size="md"
              />
            ))}
          </FilterChipGroup>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {onClearFilters && (
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Clear All Filters
          </Button>
        )}
        
        {onRefresh && (
          <Button
            variant="outline"
            onClick={onRefresh}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        )}
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mt-8 text-left max-w-md">
          <p className="text-sm font-medium mb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-primary" />
            Try these suggestions:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Additional Help */}
      {type === 'no-matches' && (
        <div className="mt-8 p-4 bg-primary/5 rounded-lg max-w-md">
          <p className="text-sm text-primary font-medium mb-1">
            Need help finding contacts?
          </p>
          <p className="text-sm text-muted-foreground">
            You can import contacts from a CSV file or create new ones manually.
          </p>
        </div>
      )}
    </Card>
  );
};

// Inline empty state variant for use within lists
interface InlineEmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const InlineEmptyState: React.FC<InlineEmptyStateProps> = ({
  message = 'No items to display',
  icon = <Users className="h-5 w-5" />,
  action,
  className
}) => {
  return (
    <div className={cn(
      "flex items-center justify-center py-8 px-4",
      "text-muted-foreground",
      className
    )}>
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm">{message}</span>
        {action && (
          <>
            <span className="text-muted-foreground/50">•</span>
            <Button
              variant="link"
              size="sm"
              onClick={action.onClick}
              className="h-auto p-0 text-sm"
            >
              {action.label}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default FilterEmptyState;