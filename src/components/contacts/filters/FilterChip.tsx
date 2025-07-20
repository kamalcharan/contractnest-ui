// src/components/contacts/filters/FilterChip.tsx
import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FilterChipProps {
  label: string;
  value?: string | number;
  onRemove: () => void;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  icon?: React.ReactNode;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const FilterChip: React.FC<FilterChipProps> = ({
  label,
  value,
  onRemove,
  variant = 'secondary',
  icon,
  color,
  size = 'sm',
  className
}) => {
  const sizeClasses = {
    sm: 'h-6 text-xs px-2',
    md: 'h-7 text-sm px-2.5',
    lg: 'h-8 text-sm px-3'
  };

  return (
    <Badge
      variant={variant}
      className={cn(
        "inline-flex items-center gap-1.5 pr-1",
        sizeClasses[size],
        color && `bg-${color}/10 text-${color} border-${color}/20`,
        className
      )}
      style={color ? {
        backgroundColor: `${color}15`,
        color: color,
        borderColor: `${color}30`
      } : undefined}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="font-medium">{label}</span>
      {value && (
        <>
          <span className="text-muted-foreground">:</span>
          <span>{value}</span>
        </>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className={cn(
          "h-4 w-4 p-0 ml-1 hover:bg-transparent",
          size === 'sm' && "h-3.5 w-3.5",
          size === 'lg' && "h-4.5 w-4.5"
        )}
      >
        <X className="h-full w-full" />
      </Button>
    </Badge>
  );
};

// Compound component for displaying multiple filter chips
interface FilterChipGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const FilterChipGroup: React.FC<FilterChipGroupProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {children}
    </div>
  );
};

// Helper component for displaying active filters summary
interface ActiveFiltersProps {
  filters: Record<string, any>;
  filterConfig: Array<{
    key: string;
    label: string;
    icon?: React.ReactNode;
    color?: string;
    formatter?: (value: any) => string;
  }>;
  onRemoveFilter: (key: string) => void;
  onClearAll: () => void;
  className?: string;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  filterConfig,
  onRemoveFilter,
  onClearAll,
  className
}) => {
  const activeFilters = filterConfig.filter(config => filters[config.key]);

  if (activeFilters.length === 0) return null;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="text-sm text-muted-foreground">Active filters:</span>
      <FilterChipGroup>
        {activeFilters.map(config => (
          <FilterChip
            key={config.key}
            label={config.label}
            value={config.formatter ? config.formatter(filters[config.key]) : filters[config.key]}
            icon={config.icon}
            color={config.color}
            onRemove={() => onRemoveFilter(config.key)}
          />
        ))}
      </FilterChipGroup>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="h-6 text-xs text-muted-foreground hover:text-foreground"
      >
        Clear all
      </Button>
    </div>
  );
};

export default FilterChip;