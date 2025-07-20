// src/components/contacts/filters/StatusFilter.tsx
import React from 'react';
import { Check, Circle, Archive, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StatusFilterProps {
  filters: Record<string, boolean>;
  onChange: (filters: Record<string, boolean>) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ filters, onChange }) => {
  const statusOptions = [
    { 
      id: 'all', 
      label: 'All', 
      icon: Circle,
      description: 'Show all contacts',
      color: 'text-muted-foreground'
    },
    { 
      id: 'active', 
      label: 'Active', 
      icon: Check,
      description: 'Currently active contacts',
      color: 'text-green-600'
    },
    { 
      id: 'inactive', 
      label: 'Inactive', 
      icon: XCircle,
      description: 'Inactive or disabled contacts',
      color: 'text-red-600'
    },
    { 
      id: 'archived', 
      label: 'Archived', 
      icon: Archive,
      description: 'Archived contacts',
      color: 'text-yellow-600'
    }
  ];

  const handleToggle = (statusId: string) => {
    if (statusId === 'all') {
      // Clear all filters when "All" is selected
      onChange({});
    } else {
      const newFilters = { ...filters };
      
      // Remove 'all' if it exists when selecting other options
      if (newFilters.all) {
        delete newFilters.all;
      }

      if (newFilters[statusId]) {
        delete newFilters[statusId];
      } else {
        newFilters[statusId] = true;
      }

      // If no filters are selected, default to 'all'
      if (Object.keys(newFilters).length === 0) {
        onChange({ all: true });
      } else {
        onChange(newFilters);
      }
    }
  };

  const isSelected = (statusId: string) => {
    if (statusId === 'all' && Object.keys(filters).length === 0) {
      return true;
    }
    return filters[statusId] === true;
  };

  return (
    <div className="space-y-3">
      {/* Filter Options */}
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((status) => {
          const Icon = status.icon;
          const selected = isSelected(status.id);
          
          return (
            <Button
              key={status.id}
              variant={selected ? "default" : "outline"}
              size="sm"
              onClick={() => handleToggle(status.id)}
              className={cn(
                "h-9 px-3",
                !selected && "hover:bg-muted",
                selected && status.id !== 'all' && "bg-primary hover:bg-primary/90"
              )}
            >
              <Icon className={cn("h-4 w-4 mr-2", !selected && status.color)} />
              {status.label}
            </Button>
          );
        })}
      </div>

      {/* Additional Filter Options */}
      <div className="flex items-center gap-4 pt-2 border-t">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.includeUsers === true}
            onChange={(e) => {
              const newFilters = { ...filters };
              if (e.target.checked) {
                newFilters.includeUsers = true;
              } else {
                delete newFilters.includeUsers;
              }
              onChange(newFilters);
            }}
            className="rounded border-gray-300"
          />
          <span className="text-muted-foreground">Include user accounts</span>
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.verifiedOnly === true}
            onChange={(e) => {
              const newFilters = { ...filters };
              if (e.target.checked) {
                newFilters.verifiedOnly = true;
              } else {
                delete newFilters.verifiedOnly;
              }
              onChange(newFilters);
            }}
            className="rounded border-gray-300"
          />
          <span className="text-muted-foreground">Verified contacts only</span>
        </label>
      </div>

      {/* Filter Description */}
      <div className="text-sm text-muted-foreground">
        {Object.keys(filters).length === 0 || filters.all ? (
          <p>Showing all contacts without any status filters applied.</p>
        ) : (
          <p>
            Showing contacts that are{' '}
            {Object.keys(filters)
              .filter(key => key !== 'includeUsers' && key !== 'verifiedOnly')
              .map((key, index, array) => (
                <span key={key}>
                  <span className="font-medium">{key}</span>
                  {index < array.length - 2 && ', '}
                  {index === array.length - 2 && ' or '}
                </span>
              ))}
            {filters.includeUsers && ' (including user accounts)'}
            {filters.verifiedOnly && ' (verified only)'}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatusFilter;