import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useToast } from '@/components/ui/use-toast';
import { 
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  Upload,
  Download,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Package,
  HelpCircle
} from 'lucide-react';

// Import components
import ServiceCard from '../../components/catalog/ServiceCard';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';

// Import hooks
import { 
  useServiceCatalogItems,
  useServiceCatalogOperations,
  type ServiceCatalogListParams 
} from '../../hooks/queries/useServiceCatalogQueries';

// Import utilities
import { captureException } from '@/utils/sentry';
import { analyticsService } from '@/services/analytics.service';

type ViewType = 'grid' | 'list';
type ServiceStatus = 'all' | 'active' | 'inactive' | 'draft';

// Constants
const ITEMS_PER_PAGE = 12;
const MINIMUM_SEARCH_LENGTH = 3;

const CatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode, currentTheme } = useTheme();
  const { toast } = useToast();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // UI State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [statusFilter, setStatusFilter] = useState<ServiceStatus>('all');
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showVideoHelp, setShowVideoHelp] = useState<boolean>(false);
  
  // Bulk operations
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

  // Debounce search term
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchTerm.length === 0 || searchTerm.length >= MINIMUM_SEARCH_LENGTH) {
        setDebouncedSearchTerm(searchTerm);
        setCurrentPage(1);
      } else {
        setDebouncedSearchTerm('');
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  // Build API filters
  const apiFilters: ServiceCatalogListParams = {
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: debouncedSearchTerm.trim() || undefined,
    categoryId: undefined, // Will be set when we have category filter
    isActive: statusFilter !== 'all' ? (statusFilter === 'active') : undefined,
    sortField: sortBy,
    sortDirection: sortOrder
  };

  // API Hooks
  const { 
    data: servicesData, 
    isLoading, 
    error, 
    refetch 
  } = useServiceCatalogItems(apiFilters);

  const { refreshServiceCatalogList } = useServiceCatalogOperations();

  // Track page views
  useEffect(() => {
    analyticsService.trackPageView('catalog', 'Service Catalog Page');
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectedServices(new Set());
  }, [statusFilter, serviceTypeFilter, debouncedSearchTerm]);

  // Handle search change
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  // Handle filter changes
  const handleStatusFilterChange = useCallback((status: ServiceStatus) => {
    setStatusFilter(status);
  }, []);

  // Handle bulk selection
  const handleSelectAll = useCallback(() => {
    if (selectedServices.size === servicesData?.data?.length) {
      setSelectedServices(new Set());
    } else {
      setSelectedServices(new Set(servicesData?.data?.map(s => s.id) || []));
    }
  }, [selectedServices.size, servicesData?.data]);

  const handleSelectService = useCallback((serviceId: string) => {
    const newSelection = new Set(selectedServices);
    if (newSelection.has(serviceId)) {
      newSelection.delete(serviceId);
    } else {
      newSelection.add(serviceId);
    }
    setSelectedServices(newSelection);
  }, [selectedServices]);

  // Get current services data
  const services = servicesData?.data || [];
  const pagination = servicesData?.pagination;

  // Loading skeleton component
  const ServiceSkeleton = () => (
    <div className="animate-pulse">
      {viewType === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="rounded-lg border p-4 transition-colors"
              style={{
                backgroundColor: colors.utility.secondaryBackground,
                borderColor: colors.utility.primaryText + '20'
              }}
            >
              <div 
                className="w-full h-48 rounded-md mb-4"
                style={{ backgroundColor: colors.utility.secondaryText + '20' }}
              />
              <div 
                className="h-6 rounded mb-2"
                style={{ backgroundColor: colors.utility.secondaryText + '20' }}
              />
              <div 
                className="h-4 rounded w-2/3 mb-2"
                style={{ backgroundColor: colors.utility.secondaryText + '20' }}
              />
              <div 
                className="h-4 rounded w-1/2"
                style={{ backgroundColor: colors.utility.secondaryText + '20' }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className="rounded-lg border p-4 transition-colors"
              style={{
                backgroundColor: colors.utility.secondaryBackground,
                borderColor: colors.utility.primaryText + '20'
              }}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-md"
                  style={{ backgroundColor: colors.utility.secondaryText + '20' }}
                />
                <div className="flex-1">
                  <div 
                    className="h-5 rounded mb-2"
                    style={{ backgroundColor: colors.utility.secondaryText + '20' }}
                  />
                  <div 
                    className="h-4 rounded w-2/3"
                    style={{ backgroundColor: colors.utility.secondaryText + '20' }}
                  />
                </div>
                <div 
                  className="w-20 h-4 rounded"
                  style={{ backgroundColor: colors.utility.secondaryText + '20' }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Helper function to check if search meets minimum criteria
  const shouldShowSearchHint = () => {
    return searchTerm.length > 0 && searchTerm.length < MINIMUM_SEARCH_LENGTH;
  };

  return (
    <div 
      className="p-4 md:p-6 min-h-screen transition-colors"
      style={{ backgroundColor: colors.utility.primaryBackground }}
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <h1 
            className="text-2xl font-bold flex items-center gap-2 transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            <Package className="h-7 w-7" />
            Service Catalog
            <button
              onClick={() => setShowVideoHelp(true)}
              className="p-1 rounded-full hover:opacity-80 transition-colors"
              title="Help & tutorials"
            >
              <HelpCircle 
                className="h-5 w-5"
                style={{ color: colors.utility.secondaryText }}
              />
            </button>
          </h1>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Import/Export */}
          <div className="flex gap-2">
            <button 
              className="flex items-center px-3 py-2 rounded-md hover:opacity-80 transition-colors text-sm border"
              style={{
                borderColor: colors.brand.primary,
                color: colors.brand.primary,
                backgroundColor: colors.brand.primary + '10'
              }}
            >
              <Upload className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Import</span>
            </button>
            <button 
              className="flex items-center px-3 py-2 rounded-md hover:opacity-80 transition-colors text-sm border"
              style={{
                borderColor: colors.brand.primary,
                color: colors.brand.primary,
                backgroundColor: colors.brand.primary + '10'
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
          
          {/* New Service Button */}
          <button 
            onClick={() => navigate('/catalog/create')}
            className="flex items-center px-4 py-2 rounded-md hover:opacity-90 transition-colors"
            style={{
              backgroundColor: colors.brand.primary,
              color: '#ffffff'
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Service
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div 
        className="rounded-lg shadow-sm border transition-colors"
        style={{
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: colors.utility.primaryText + '20'
        }}
      >
        {/* Filters Bar */}
        <div className="p-4 border-b" style={{ borderColor: colors.utility.primaryText + '20' }}>
          {/* Status Filter Pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { id: 'all', label: 'All Services', count: 0 },
              { id: 'active', label: 'Active', count: 0 },
              { id: 'draft', label: 'Drafts', count: 0 },
              { id: 'inactive', label: 'Inactive', count: 0 }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => handleStatusFilterChange(filter.id as ServiceStatus)}
                className="px-3 py-1.5 rounded-full text-sm transition-colors"
                style={{
                  backgroundColor: statusFilter === filter.id 
                    ? colors.brand.primary 
                    : colors.utility.secondaryText + '20',
                  color: statusFilter === filter.id 
                    ? '#ffffff' 
                    : colors.utility.secondaryText
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Search and Controls */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                style={{ color: colors.utility.secondaryText }}
              />
              <input
                type="text"
                placeholder={`Search services... (min ${MINIMUM_SEARCH_LENGTH} characters)`}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                style={{
                  backgroundColor: colors.utility.primaryBackground,
                  borderColor: colors.utility.primaryText + '40',
                  color: colors.utility.primaryText,
                  '--tw-ring-color': colors.brand.primary + '40'
                } as React.CSSProperties}
              />
              {isLoading && debouncedSearchTerm && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 
                    className="h-4 w-4 animate-spin"
                    style={{ color: colors.utility.secondaryText }}
                  />
                </div>
              )}
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Sort Dropdown */}
              <select
                value={`${sortBy}_${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('_');
                  setSortBy(field);
                  setSortOrder(order as 'asc' | 'desc');
                }}
                className="px-3 py-2 border rounded-lg text-sm transition-colors"
                style={{
                  backgroundColor: colors.utility.primaryBackground,
                  borderColor: colors.utility.primaryText + '40',
                  color: colors.utility.primaryText
                }}
              >
                <option value="created_at_desc">Newest First</option>
                <option value="created_at_asc">Oldest First</option>
                <option value="service_name_asc">Name A-Z</option>
                <option value="service_name_desc">Name Z-A</option>
              </select>

              {/* View Toggle */}
              <div 
                className="flex rounded-lg p-0.5"
                style={{ backgroundColor: colors.utility.secondaryText + '20' }}
              >
                <button 
                  onClick={() => setViewType('grid')}
                  className="p-1.5 rounded-md transition-colors"
                  style={{
                    backgroundColor: viewType === 'grid' 
                      ? colors.utility.primaryBackground 
                      : 'transparent',
                    color: viewType === 'grid' 
                      ? colors.utility.primaryText 
                      : colors.utility.secondaryText
                  }}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setViewType('list')}
                  className="p-1.5 rounded-md transition-colors"
                  style={{
                    backgroundColor: viewType === 'list' 
                      ? colors.utility.primaryBackground 
                      : 'transparent',
                    color: viewType === 'list' 
                      ? colors.utility.primaryText 
                      : colors.utility.secondaryText
                  }}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              
              <span 
                className="text-sm whitespace-nowrap transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                {pagination?.total || 0} services
              </span>
            </div>
          </div>

          {/* Search Status Messages */}
          {shouldShowSearchHint() && (
            <div 
              className="text-sm p-2 rounded mt-3 transition-colors"
              style={{
                color: colors.utility.secondaryText,
                backgroundColor: colors.utility.secondaryText + '10'
              }}
            >
              Type at least {MINIMUM_SEARCH_LENGTH} characters to search services
            </div>
          )}

          {debouncedSearchTerm && (
            <div 
              className="text-sm mt-3 transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              {isLoading 
                ? `Searching for "${debouncedSearchTerm}"...`
                : `Showing results for "${debouncedSearchTerm}" (${pagination?.total || 0} found)`
              }
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-4">
          {/* Error State */}
          {error && (
            <div 
              className="mb-6 p-4 rounded-lg border transition-colors"
              style={{
                backgroundColor: colors.semantic.error + '10',
                borderColor: colors.semantic.error + '40'
              }}
            >
              <div className="flex items-center gap-3">
                <AlertCircle 
                  className="h-5 w-5 flex-shrink-0"
                  style={{ color: colors.semantic.error }}
                />
                <div>
                  <h3 
                    className="font-medium"
                    style={{ color: colors.semantic.error }}
                  >
                    Error loading services
                  </h3>
                  <p 
                    className="text-sm mt-1"
                    style={{ color: colors.semantic.error }}
                  >
                    {error.message}
                  </p>
                  <button 
                    onClick={() => refetch()}
                    className="text-sm mt-2 underline hover:no-underline"
                    style={{ color: colors.semantic.error }}
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && <ServiceSkeleton />}

          {/* Services List */}
          {!isLoading && !error && (
            <div>
              {services.length === 0 ? (
                <div 
                  className="rounded-lg border p-12 text-center transition-colors"
                  style={{
                    backgroundColor: colors.utility.primaryBackground,
                    borderColor: colors.utility.primaryText + '20'
                  }}
                >
                  <Package 
                    className="h-16 w-16 mx-auto mb-4"
                    style={{ color: colors.utility.secondaryText }}
                  />
                  <h3 
                    className="text-lg font-medium mb-2 transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    No services found
                  </h3>
                  <p 
                    className="mb-6 transition-colors"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    {searchTerm || statusFilter !== 'all'
                      ? shouldShowSearchHint()
                        ? `Type at least ${MINIMUM_SEARCH_LENGTH} characters to search services.`
                        : "No services match your search criteria. Try adjusting your search or filters."
                      : "You haven't added any services yet. Create your first service to get started."
                    }
                  </p>
                  <button 
                    onClick={() => navigate('/catalog/create')}
                    className="flex items-center px-4 py-2 rounded-md hover:opacity-90 transition-colors mx-auto"
                    style={{
                      backgroundColor: colors.brand.primary,
                      color: '#ffffff'
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    New Service
                  </button>
                </div>
              ) : (
                <>
                  {/* Services Grid/List */}
                  <div className={`
                    ${viewType === 'grid' 
                      ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
                      : 'space-y-4'
                    }
                  `}>
                    {services.map((service) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        viewType={viewType}
                        isSelected={selectedServices.has(service.id)}
                        onSelect={() => handleSelectService(service.id)}
                        onView={() => navigate(`/catalog/view?id=${service.id}`)}
                        onEdit={() => navigate(`/catalog/edit?id=${service.id}`)}
                        onDuplicate={() => {
                          toast({
                            title: "Feature Coming Soon",
                            description: "Service duplication will be available soon"
                          });
                        }}
                        onDelete={() => {
                          toast({
                            title: "Feature Coming Soon", 
                            description: "Service deletion will be available soon"
                          });
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Video Help Modal */}
      {showVideoHelp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div 
            className="rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden transition-colors"
            style={{ backgroundColor: colors.utility.secondaryBackground }}
          >
            <div 
              className="p-6 border-b transition-colors"
              style={{ borderColor: colors.utility.primaryText + '20' }}
            >
              <div className="flex items-center justify-between">
                <h2 
                  className="text-xl font-semibold transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  Service Catalog Help
                </h2>
                <button
                  onClick={() => setShowVideoHelp(false)}
                  className="p-2 hover:opacity-80 rounded-md transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <p style={{ color: colors.utility.secondaryText }}>
                Help documentation coming soon...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatalogPage;