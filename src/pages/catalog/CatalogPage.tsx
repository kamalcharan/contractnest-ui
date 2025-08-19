// src/pages/catalog/CatalogPage.tsx
// ✅ PRODUCTION: Main unified catalog page with real GraphQL data

import React, { useState, useMemo, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  SortAsc, 
  SortDesc, 
  Download, 
  Upload,
  Sparkles,
  BarChart3,
  Settings,
  RefreshCw,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle
} from 'lucide-react';
import ServiceCard from '../../components/catalog/service/ServiceCard';
import ServiceForm from '../../components/catalog/service/ServiceForm';
import { useServiceCatalogItems } from '../../hooks/queries/useServiceCatalogQueries';
import { useActiveServiceCategories } from '../../hooks/queries/useMasterDataQueries';
import { formatServicePrice } from '../../services/graphql';
import toast from 'react-hot-toast';

interface CatalogPageProps {
  // Props for navigation integration
  className?: string;
}

type ViewMode = 'grid' | 'list';
type SortOption = 'name' | 'price' | 'created' | 'category';
type SortDirection = 'asc' | 'desc';

interface FilterState {
  search: string;
  categories: string[];
  pricingTypes: string[];
  hasResources: 'all' | 'with-resources' | 'without-resources';
  status: 'all' | 'active' | 'inactive';
}

const CatalogPage: React.FC<CatalogPageProps> = ({ className = '' }) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // UI State
  const [currentView, setCurrentView] = useState<'catalog' | 'create' | 'edit' | 'details'>('catalog');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('created');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [showInactive, setShowInactive] = useState(false);

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    categories: [],
    pricingTypes: [],
    hasResources: 'all',
    status: 'all'
  });

  // Real GraphQL data with filtering and sorting
  const serviceCatalogQuery = useServiceCatalogItems({
    search: filters.search,
    categoryId: filters.categories.length > 0 ? filters.categories : undefined,
    pricingModel: filters.pricingTypes.length > 0 ? filters.pricingTypes.map(t => t.toUpperCase()) : undefined,
    isActive: filters.status === 'all' ? undefined : filters.status === 'active',
    sortField: sortBy === 'name' ? 'serviceName' : sortBy === 'price' ? 'basePrice' : sortBy === 'created' ? 'createdAt' : sortBy,
    sortDirection: sortDirection.toUpperCase() as 'ASC' | 'DESC',
    limit: 50
  });

  const activeCategories = useActiveServiceCategories();

  // Process services with client-side filtering for complex logic
  const services = useMemo(() => {
    if (!serviceCatalogQuery.data?.data) return [];
    
    let filteredServices = [...serviceCatalogQuery.data.data];

    // Apply resource filter (client-side since API might not support this)
    if (filters.hasResources === 'with-resources') {
      filteredServices = filteredServices.filter(service => 
        service.requiredResources && service.requiredResources.length > 0
      );
    } else if (filters.hasResources === 'without-resources') {
      filteredServices = filteredServices.filter(service => 
        !service.requiredResources || service.requiredResources.length === 0
      );
    }

    return filteredServices;
  }, [serviceCatalogQuery.data?.data, filters.hasResources]);

  // Event handlers
  const handleCreateService = () => {
    setCurrentView('create');
    setSelectedServiceId(null);
  };

  const handleEditService = (serviceId: string) => {
    setCurrentView('edit');
    setSelectedServiceId(serviceId);
  };

  const handleViewService = (serviceId: string) => {
    setCurrentView('details');
    setSelectedServiceId(serviceId);
  };

  const handleBackToCatalog = () => {
    setCurrentView('catalog');
    setSelectedServiceId(null);
  };

  const handleServiceSaved = () => {
    setCurrentView('catalog');
    setSelectedServiceId(null);
  };

  const handleDeleteService = (serviceId: string) => {
    // Show confirmation dialog
    if (window.confirm('Are you sure you want to delete this service?')) {
      console.log('Delete service:', serviceId);
      // Implement delete logic
    }
  };

  const handleDuplicateService = (serviceId: string) => {
    console.log('Duplicate service:', serviceId);
    // Implement duplicate logic
  };

  const handleSortChange = (newSortBy: SortOption) => {
    if (sortBy === newSortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortDirection('asc');
    }
  };

  const updateFilters = (updates: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      categories: [],
      pricingTypes: [],
      hasResources: 'all',
      status: 'all'
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.categories.length > 0) count++;
    if (filters.pricingTypes.length > 0) count++;
    if (filters.hasResources !== 'all') count++;
    if (filters.status !== 'all') count++;
    return count;
  };

  // Show ServiceForm for create/edit/view modes
  if (currentView !== 'catalog') {
    return (
      <ServiceForm
        mode={currentView === 'create' ? 'create' : currentView === 'edit' ? 'edit' : 'view'}
        serviceId={selectedServiceId || undefined}
        onBack={handleBackToCatalog}
        onSave={handleServiceSaved}
      />
    );
  }

  return (
    <div 
      className={`min-h-screen transition-colors duration-200 ${className}`}
      style={{ backgroundColor: colors.utility.secondaryBackground }}
    >
      {/* Header */}
      <div 
        className="sticky top-0 z-30 border-b backdrop-blur-sm"
        style={{
          backgroundColor: colors.utility.primaryBackground + 'F5',
          borderColor: colors.utility.secondaryText + '20'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            {/* Title & Description */}
            <div>
              <div className="flex items-center gap-3">
                <h1 
                  className="text-3xl font-bold transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  Service Catalog
                </h1>
                <div 
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: `${colors.brand.primary}20`,
                    color: colors.brand.primary
                  }}
                >
                  {services.length} services
                </div>
              </div>
              <p 
                className="text-sm mt-1 transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                Resource-enhanced services with flexible composition
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowInactive(!showInactive)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm border hover:scale-105 duration-200"
                style={{
                  borderColor: colors.utility.secondaryText + '40',
                  color: colors.utility.secondaryText,
                  backgroundColor: showInactive ? colors.utility.secondaryText + '10' : 'transparent'
                }}
              >
                {showInactive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showInactive ? 'Hide Inactive' : 'Show All'}
              </button>

              <button
                className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm border hover:scale-105 duration-200"
                style={{
                  borderColor: colors.utility.secondaryText + '40',
                  color: colors.utility.secondaryText
                }}
              >
                <Download className="w-4 h-4" />
                Export
              </button>

              <button
                onClick={handleCreateService}
                className="flex items-center gap-2 px-6 py-2 rounded-lg transition-all text-white text-sm hover:scale-105 duration-200"
                style={{
                  background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
                }}
              >
                <Plus className="w-4 h-4" />
                Create Service
              </button>
            </div>
          </div>

          {/* Search & Filters Bar */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                style={{ color: colors.utility.secondaryText }}
              />
              <input
                type="text"
                placeholder="Search services by name, description, or tags..."
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: colors.utility.primaryBackground,
                  borderColor: colors.utility.secondaryText + '40',
                  color: colors.utility.primaryText,
                  '--tw-ring-color': colors.brand.primary
                } as React.CSSProperties}
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg transition-all border hover:scale-105 duration-200"
              style={{
                borderColor: showFilters ? colors.brand.primary : colors.utility.secondaryText + '40',
                color: showFilters ? colors.brand.primary : colors.utility.secondaryText,
                backgroundColor: showFilters ? colors.brand.primary + '10' : 'transparent'
              }}
            >
              <Filter className="w-4 h-4" />
              Filters
              {getActiveFilterCount() > 0 && (
                <span
                  className="px-2 py-1 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: colors.semantic.warning,
                    color: 'white'
                  }}
                >
                  {getActiveFilterCount()}
                </span>
              )}
            </button>

            {/* View Mode Toggle */}
            <div 
              className="flex rounded-lg border overflow-hidden"
              style={{ borderColor: colors.utility.secondaryText + '40' }}
            >
              <button
                onClick={() => setViewMode('grid')}
                className="p-3 transition-all"
                style={{
                  backgroundColor: viewMode === 'grid' ? colors.brand.primary : 'transparent',
                  color: viewMode === 'grid' ? 'white' : colors.utility.secondaryText
                }}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className="p-3 transition-all"
                style={{
                  backgroundColor: viewMode === 'list' ? colors.brand.primary : 'transparent',
                  color: viewMode === 'list' ? 'white' : colors.utility.secondaryText
                }}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={`${sortBy}-${sortDirection}`}
                onChange={(e) => {
                  const [newSortBy, newDirection] = e.target.value.split('-') as [SortOption, SortDirection];
                  setSortBy(newSortBy);
                  setSortDirection(newDirection);
                }}
                className="appearance-none px-4 py-3 pr-8 rounded-lg border transition-all focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: colors.utility.primaryBackground,
                  borderColor: colors.utility.secondaryText + '40',
                  color: colors.utility.primaryText,
                  '--tw-ring-color': colors.brand.primary
                } as React.CSSProperties}
              >
                <option value="created-desc">Newest First</option>
                <option value="created-asc">Oldest First</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="price-asc">Price Low-High</option>
                <option value="price-desc">Price High-Low</option>
                <option value="category-asc">Category A-Z</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                {sortDirection === 'asc' ? (
                  <SortAsc className="w-4 h-4" style={{ color: colors.utility.secondaryText }} />
                ) : (
                  <SortDesc className="w-4 h-4" style={{ color: colors.utility.secondaryText }} />
                )}
              </div>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div 
              className="mt-4 p-4 rounded-lg border"
              style={{
                backgroundColor: colors.utility.primaryBackground,
                borderColor: colors.utility.secondaryText + '20'
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Categories
                  </label>
                  <div className="space-y-2">
                    {activeCategories.isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" style={{ color: colors.utility.secondaryText }} />
                        <span className="text-sm" style={{ color: colors.utility.secondaryText }}>Loading...</span>
                      </div>
                    ) : activeCategories.error ? (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" style={{ color: colors.semantic.error }} />
                        <span className="text-sm" style={{ color: colors.semantic.error }}>Failed to load categories</span>
                      </div>
                    ) : (
                      activeCategories.data.map(category => (
                        <label key={category.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={filters.categories.includes(category.id)}
                            onChange={(e) => {
                              const newCategories = e.target.checked
                                ? [...filters.categories, category.id]
                                : filters.categories.filter(c => c !== category.id);
                              updateFilters({ categories: newCategories });
                            }}
                            className="rounded"
                          />
                          <span 
                            className="text-sm"
                            style={{ color: colors.utility.primaryText }}
                          >
                            {category.name}
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                {/* Pricing Type Filter */}
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Pricing Types
                  </label>
                  <div className="space-y-2">
                    {['FIXED', 'HOURLY', 'DAILY'].map(type => (
                      <label key={type} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.pricingTypes.includes(type)}
                          onChange={(e) => {
                            const newTypes = e.target.checked
                              ? [...filters.pricingTypes, type]
                              : filters.pricingTypes.filter(t => t !== type);
                            updateFilters({ pricingTypes: newTypes });
                          }}
                          className="rounded"
                        />
                        <span 
                          className="text-sm"
                          style={{ color: colors.utility.primaryText }}
                        >
                          {type.toLowerCase()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Resource Requirements Filter */}
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Resource Requirements
                  </label>
                  <select
                    value={filters.hasResources}
                    onChange={(e) => updateFilters({ hasResources: e.target.value as any })}
                    className="w-full px-3 py-2 rounded border"
                    style={{
                      backgroundColor: colors.utility.primaryBackground,
                      borderColor: colors.utility.secondaryText + '40',
                      color: colors.utility.primaryText
                    }}
                  >
                    <option value="all">All Services</option>
                    <option value="with-resources">With Resources</option>
                    <option value="without-resources">No Resources</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label 
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => updateFilters({ status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded border"
                    style={{
                      backgroundColor: colors.utility.primaryBackground,
                      borderColor: colors.utility.secondaryText + '40',
                      color: colors.utility.primaryText
                    }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              {getActiveFilterCount() > 0 && (
                <div className="mt-4 pt-4 border-t" style={{ borderColor: colors.utility.secondaryText + '20' }}>
                  <button
                    onClick={clearFilters}
                    className="text-sm transition-all hover:opacity-80"
                    style={{ color: colors.semantic.error }}
                  >
                    Clear All Filters ({getActiveFilterCount()})
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 
              className="text-lg font-semibold"
              style={{ color: colors.utility.primaryText }}
            >
              {services.length} Services Found
            </h2>
            {getActiveFilterCount() > 0 && (
              <p 
                className="text-sm mt-1"
                style={{ color: colors.utility.secondaryText }}
              >
                Filtered by {getActiveFilterCount()} criteria
              </p>
            )}
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Sparkles className="w-4 h-4" style={{ color: colors.semantic.success }} />
              <span style={{ color: colors.utility.secondaryText }}>
                {services.filter(s => s.requiredResources && s.requiredResources.length > 0).length} with resources
              </span>
            </div>
            <div className="flex items-center gap-1">
              <BarChart3 className="w-4 h-4" style={{ color: colors.semantic.info }} />
              <span style={{ color: colors.utility.secondaryText }}>
                Avg {services.length > 0 ? formatServicePrice(Math.round(services.reduce((sum, s) => sum + s.pricingConfig.basePrice, 0) / services.length), services[0]?.pricingConfig.currency || 'USD') : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {serviceCatalogQuery.isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin" style={{ color: colors.brand.primary }} />
              <p className="text-sm" style={{ color: colors.utility.secondaryText }}>Loading services...</p>
            </div>
          </div>
        ) : serviceCatalogQuery.error ? (
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
        ) : services.length === 0 ? (
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
              No Services Found
            </h3>
            <p 
              className="text-sm mb-6"
              style={{ color: colors.utility.secondaryText }}
            >
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-lg text-sm transition-all hover:scale-105 duration-200"
              style={{
                backgroundColor: colors.brand.primary + '20',
                color: colors.brand.primary
              }}
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onEdit={handleEditService}
                onView={handleViewService}
                onDelete={handleDeleteService}
                onDuplicate={handleDuplicateService}
                compact={viewMode === 'list'}
                className={viewMode === 'list' ? 'max-w-none' : ''}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;