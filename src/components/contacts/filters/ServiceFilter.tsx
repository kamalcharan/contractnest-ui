// src/components/contacts/filters/ServiceFilter.tsx
import React from 'react';
import { AlertCircle, Clock, Calendar, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ServiceFilterProps {
  filters: Record<string, boolean>;
  onChange: (filters: Record<string, boolean>) => void;
}

const ServiceFilter: React.FC<ServiceFilterProps> = ({ filters, onChange }) => {
  const serviceOptions = [
    { 
      id: 'all', 
      label: 'All', 
      icon: Calendar,
      description: 'Show all service schedules',
      color: 'text-muted-foreground'
    },
    { 
      id: 'missed', 
      label: 'Missed', 
      icon: AlertCircle,
      description: 'Missed service appointments',
      color: 'text-red-600'
    },
    { 
      id: 'dueNextWeek', 
      label: 'Due Next Week', 
      icon: Clock,
      description: 'Services due in the next 7 days',
      color: 'text-orange-600'
    },
    { 
      id: 'dueNextMonth', 
      label: 'Due Next Month', 
      icon: CalendarDays,
      description: 'Services due in the next 30 days',
      color: 'text-blue-600'
    }
  ];

  const handleToggle = (optionId: string) => {
    if (optionId === 'all') {
      onChange({});
    } else {
      const newFilters = { ...filters };
      
      if (newFilters.all) {
        delete newFilters.all;
      }

      if (newFilters[optionId]) {
        delete newFilters[optionId];
      } else {
        newFilters[optionId] = true;
      }

      if (Object.keys(newFilters).length === 0) {
        onChange({ all: true });
      } else {
        onChange(newFilters);
      }
    }
  };

  const isSelected = (optionId: string) => {
    if (optionId === 'all' && Object.keys(filters).length === 0) {
      return true;
    }
    return filters[optionId] === true;
  };

  // Calculate summary stats (mock data)
  const stats = {
    missed: 3,
    dueNextWeek: 12,
    dueNextMonth: 28,
    total: 43
  };

  return (
    <div className="space-y-4">
      {/* Filter Options */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {serviceOptions.map((option) => {
          const Icon = option.icon;
          const selected = isSelected(option.id);
          const stat = option.id === 'all' ? stats.total : stats[option.id as keyof typeof stats];
          
          return (
            <button
              key={option.id}
              onClick={() => handleToggle(option.id)}
              className={cn(
                "flex flex-col items-center p-4 rounded-lg border-2 transition-all",
                selected 
                  ? "border-primary bg-primary/5 shadow-sm" 
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              )}
            >
              <Icon className={cn("h-6 w-6 mb-2", selected ? "text-primary" : option.color)} />
              <span className={cn("text-sm font-medium", selected && "text-primary")}>
                {option.label}
              </span>
              {stat !== undefined && (
                <span className={cn(
                  "text-2xl font-bold mt-1",
                  selected ? "text-primary" : "text-muted-foreground"
                )}>
                  {stat}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Additional Filter Options */}
      <div className="space-y-3 pt-3 border-t">
        <h4 className="text-sm font-medium">Service Types</h4>
        <div className="flex flex-wrap gap-2">
          {['Maintenance', 'Consultation', 'Training', 'Support'].map((type) => {
            const isTypeSelected = filters[`type_${type.toLowerCase()}`] === true;
            return (
              <Button
                key={type}
                variant={isTypeSelected ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  const newFilters = { ...filters };
                  const key = `type_${type.toLowerCase()}`;
                  if (newFilters[key]) {
                    delete newFilters[key];
                  } else {
                    newFilters[key] = true;
                  }
                  onChange(newFilters);
                }}
                className="h-8"
              >
                {type}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Priority Filter */}
      <div className="space-y-3 pt-3 border-t">
        <h4 className="text-sm font-medium">Priority Level</h4>
        <div className="flex gap-2">
          {[
            { id: 'high', label: 'High', color: 'text-red-600' },
            { id: 'medium', label: 'Medium', color: 'text-yellow-600' },
            { id: 'low', label: 'Low', color: 'text-green-600' }
          ].map((priority) => {
            const isPrioritySelected = filters[`priority_${priority.id}`] === true;
            return (
              <Button
                key={priority.id}
                variant={isPrioritySelected ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  const newFilters = { ...filters };
                  const key = `priority_${priority.id}`;
                  if (newFilters[key]) {
                    delete newFilters[key];
                  } else {
                    newFilters[key] = true;
                  }
                  onChange(newFilters);
                }}
                className={cn("h-8", !isPrioritySelected && priority.color)}
              >
                {priority.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Filter Description */}
      <div className="text-sm text-muted-foreground">
        {Object.keys(filters).length === 0 || filters.all ? (
          <p>Showing all service schedules without any filters.</p>
        ) : (
          <p>
            Showing services that are{' '}
            {Object.keys(filters)
              .filter(key => !key.startsWith('type_') && !key.startsWith('priority_'))
              .map((key, index, array) => (
                <span key={key}>
                  <span className="font-medium">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                  {index < array.length - 2 && ', '}
                  {index === array.length - 2 && ' or '}
                </span>
              ))}
            {Object.keys(filters).some(k => k.startsWith('type_')) && ' (filtered by type)'}
            {Object.keys(filters).some(k => k.startsWith('priority_')) && ' (filtered by priority)'}
          </p>
        )}
      </div>
    </div>
  );
};

export default ServiceFilter;