// src/components/contacts/ContactFilters.tsx
import React, { useState } from 'react';
import { Search, Grid, List, Filter, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// Import the actual filter components
import StatusFilter from './filters/StatusFilter';
import ServiceFilter from './filters/ServiceFilter';
import BillingFilter from './filters/BillingFilter';

interface ContactFiltersProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  filters: any;
  onFilterChange: (filters: any) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  className?: string;
}

const ContactFilters: React.FC<ContactFiltersProps> = ({
  searchTerm,
  onSearch,
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
  className
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchTerm !== searchTerm) {
        onSearch(localSearchTerm);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearchTerm, searchTerm, onSearch]);

  // Count active filters
  const getFilterCount = (tab: string) => {
    switch (tab) {
      case 'status':
        return filters.statusFilters ? Object.keys(filters.statusFilters).length : 0;
      case 'service':
        return filters.serviceFilters ? Object.keys(filters.serviceFilters).length : 0;
      case 'billing':
        return filters.billingFilters ? Object.keys(filters.billingFilters).length : 0;
      default:
        return 0;
    }
  };

  const totalActiveFilters = getFilterCount('status') + getFilterCount('service') + getFilterCount('billing');

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search contacts..."
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          className="pl-9 h-9"
        />
      </div>

      {/* Filter Button */}
      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="h-9"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {totalActiveFilters > 0 && (
              <Badge 
                variant="secondary" 
                className="ml-2 h-5 px-1.5 text-xs bg-primary/10 text-primary"
              >
                {totalActiveFilters}
              </Badge>
            )}
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[600px] p-0" align="end">
          <Tabs defaultValue="status" className="w-full">
            <div className="border-b px-4 pt-4">
              <div className="flex items-center justify-between mb-3">
                <TabsList className="h-9">
                  <TabsTrigger value="status">
                    Status
                    {getFilterCount('status') > 0 && (
                      <Badge className="ml-2 h-4 px-1 text-xs">{getFilterCount('status')}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="service">
                    Service
                    {getFilterCount('service') > 0 && (
                      <Badge className="ml-2 h-4 px-1 text-xs">{getFilterCount('service')}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="billing">
                    Billing
                    {getFilterCount('billing') > 0 && (
                      <Badge className="ml-2 h-4 px-1 text-xs">{getFilterCount('billing')}</Badge>
                    )}
                  </TabsTrigger>
                </TabsList>

                {totalActiveFilters > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onFilterChange({});
                      setIsFilterOpen(false);
                    }}
                    className="h-7 text-xs"
                  >
                    Clear all
                  </Button>
                )}
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto p-4">
              <TabsContent value="status" className="mt-0">
                <StatusFilter
                  filters={filters.statusFilters || {}}
                  onChange={(statusFilters) => onFilterChange({ ...filters, statusFilters })}
                />
              </TabsContent>

              <TabsContent value="service" className="mt-0">
                <ServiceFilter
                  filters={filters.serviceFilters || {}}
                  onChange={(serviceFilters) => onFilterChange({ ...filters, serviceFilters })}
                />
              </TabsContent>

              <TabsContent value="billing" className="mt-0">
                <BillingFilter
                  filters={filters.billingFilters || {}}
                  onChange={(billingFilters) => onFilterChange({ ...filters, billingFilters })}
                />
              </TabsContent>
            </div>

            <div className="border-t px-4 py-3 bg-muted/30">
              <Button 
                className="w-full" 
                size="sm"
                onClick={() => setIsFilterOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </Tabs>
        </PopoverContent>
      </Popover>

      {/* View Mode Toggle */}
      <div className="flex items-center border rounded-md">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'ghost'}
          size="sm"
          className="rounded-r-none h-9 px-3"
          onClick={() => onViewModeChange('grid')}
        >
          <Grid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'ghost'}
          size="sm"
          className="rounded-l-none h-9 px-3"
          onClick={() => onViewModeChange('list')}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ContactFilters;