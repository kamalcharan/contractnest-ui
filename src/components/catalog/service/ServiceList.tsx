// src/components/catalog/service/ServiceList.tsx
// 🎨 Service list component with real GraphQL data integration

import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Loader2, AlertCircle, RefreshCw, Search } from 'lucide-react';
import ServiceCard from './ServiceCard';
import { useServiceCatalogItems } from '../../../hooks/queries/useServiceCatalogQueries';
import type { ServiceCatalogListParams } from '../../../hooks/queries/useServiceCatalogQueries';

interface ServiceListProps {
  // Filtering and Search
  filters?: ServiceCatalogListParams;
  
  // Display Options
  viewMode?: 'grid' | 'list';
  compact?: boolean;
  
  // Pagination
  page?: number;
  limit?: number;
  
  // Event Handlers
  onServiceEdit?: (serviceId: string) => void;
  onServiceView?: (serviceId: string) => void;
  onServiceDelete?: (serviceId: string) => void;
  onServiceDuplicate?: (serviceId: string) => void;
  
  // UI Options
  showActions?: boolean;
  className?: string;
}

const ServiceList: React.FC<ServiceListProps> = ({
  filters = {},
  viewMode = 'grid',
  compact = false,
  page = 1,
  limit = 20,
  onServiceEdit,
  onServiceView,
  onServiceDelete,
  onServiceDuplicate,
  showActions = true,
  className = ''
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // Fetch services with current filters
  const serviceCatalogQuery = useServiceCatalogItems({
    ...filters,
    page,
    limit,
    sortField: filters.sortField || 'createdAt',
    sortDirection: filters.sortDirection || 'DESC'
  });

  // Handle loading state
  if (serviceCatalogQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin" style={{ color: colors.brand.primary }} />
          <p className="text-sm" style={{ color: colors.utility.secondaryText }}>Loading services...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (serviceCatalogQuery.error) {
    return (
      <div className="text-center py-16">
        <div 
          className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: colors.semantic.error + '10' }}
        >
          <AlertCircle className="w-10 h-10" style={{ color: colors.semantic.error }} />
        </div>
        <h3 
          className="text-xl font-semibold mb-2"
          style={{ color: colors.utility.primaryText }}
        >
          Failed to Load Services
        </h3>
        <p 
          className="text-sm mb-6"
          style={{ color: colors.utility.secondaryText }}
        >
          {serviceCatalogQuery.error instanceof Error ? serviceCatalogQuery.error.message : 'An error occurred'}
        </p>
        <button
          onClick={() => serviceCatalogQuery.refetch()}
          className="flex items-center gap-2 px-4 py-2 mx-auto rounded-lg transition-all hover:scale-105 duration-200"
          style={{
            backgroundColor: colors.brand.primary,
            color: 'white'
          }}
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  const services = serviceCatalogQuery.data?.data || [];

  // Handle empty state
  if (services.length === 0) {
    const hasFilters = filters.search || 
                      (filters.categoryId && filters.categoryId.length > 0) ||
                      filters.isActive !== undefined ||
                      (filters.pricingModel && filters.pricingModel.length > 0);

    return (
      <div className="text-center py-16">
        <div 
          className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: colors.utility.secondaryText + '10' }}
        >
          <Search className="w-10 h-10" style={{ color: colors.utility.secondaryText }} />
        </div>
        <h3 
          className="text-xl font-semibold mb-2"
          style={{ color: colors.utility.primaryText }}
        >
          {hasFilters ? 'No Services Match Your Filters' : 'No Services Found'}
        </h3>
        <p 
          className="text-sm mb-6"
          style={{ color: colors.utility.secondaryText }}
        >
          {hasFilters 
            ? 'Try adjusting your search criteria or filters to find services.'
            : 'Get started by creating your first service.'
          }
        </p>
      </div>
    );
  }

  // Render services
  return (
    <div className={className}>
      {/* Services Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
      }>
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onEdit={onServiceEdit || (() => {})}
            onView={onServiceView || (() => {})}
            onDelete={onServiceDelete}
            onDuplicate={onServiceDuplicate}
            compact={viewMode === 'list' || compact}
            showActions={showActions}
            className={viewMode === 'list' ? 'max-w-none' : ''}
          />
        ))}
      </div>

      {/* Pagination Info */}
      {serviceCatalogQuery.data?.pagination && serviceCatalogQuery.data.pagination.total > limit && (
        <div className="mt-8 text-center">
          <div 
            className="text-sm"
            style={{ color: colors.utility.secondaryText }}
          >
            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, serviceCatalogQuery.data.pagination.total)} of {serviceCatalogQuery.data.pagination.total} services
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceList;