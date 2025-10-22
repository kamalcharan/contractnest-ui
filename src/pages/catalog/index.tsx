// Frontend-src/pages/catalog/index.tsx
// Service Catalog List Page - PRODUCTION READY
// ✅ FIXED: Boolean status filters (Active/Inactive only), proper API filtering

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List,
  RefreshCw,
  Package,
  Users,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import toast from 'react-hot-toast';
import ServiceCard from '@/components/catalog/ServiceCard';
import ConfirmationDialog from '@/components/ui/ConfirmationDialog';

// ✅ Use React Query hooks
import {
  useServiceCatalogItems,
  useServiceStatusOperations,
  useRefreshServiceCatalog,
  useServiceStatistics  // ✅ ADD THIS
} from '@/hooks/queries/useServiceCatalogQueries';

// Import types
import type { Service } from '@/types/catalog/service';

const CatalogIndex: React.FC = () => {
  const navigate = useNavigate();
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list'); // ✅ Default to list
  
  // ✅ FIXED: Only 'active' | 'inactive' - removed 'all'
  const [activeFilter, setActiveFilter] = useState<'active' | 'inactive'>('active');
  const [serviceTypeFilter, setServiceTypeFilter] = useState<'all' | 'independent' | 'resource_based'>('all');
  const [showServiceTypeMenu, setShowServiceTypeMenu] = useState(false);

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    serviceId: '',
    serviceName: '',
    currentStatus: false,
    action: '' as 'activate' | 'deactivate' | '',
  });

  // ============================================================================
// REACT QUERY HOOKS
// ============================================================================

// ✅ Fetch statistics for both Active/Inactive counts
const { 
  data: statistics, 
  isLoading: isLoadingStats 
} = useServiceStatistics();

// ✅ Fetch services for the selected tab
const {
  data: servicesResponse,
  isLoading,
  error,
  refetch
} = useServiceCatalogItems(
  { 
    is_active: activeFilter === 'active' ? true : false 
  }, 
  {
    refetchOnWindowFocus: false
  }
);

  // Extract services from response
  const services = useMemo(() => {
    return servicesResponse?.items || [];
  }, [servicesResponse]);

  // Status operations hook
  const { toggleStatus, isTogglingStatus } = useServiceStatusOperations();

  // Refresh hook
  const { refreshLists } = useRefreshServiceCatalog();

  // ============================================================================
  // FILTERING LOGIC (Frontend-side for search & service type)
  // ============================================================================

  const filteredServices = useMemo(() => {
    let filtered = [...services];

    // Service type filter
    if (serviceTypeFilter === 'independent') {
      filtered = filtered.filter(s => 
        s.service_type === 'independent' || !s.has_resources
      );
    } else if (serviceTypeFilter === 'resource_based') {
      filtered = filtered.filter(s => 
        s.service_type === 'resource_based' || s.has_resources
      );
    }

    // Search filter (minimum 3 characters)
    if (searchQuery.trim().length >= 3) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        s.service_name?.toLowerCase().includes(query) ||
        s.description?.toLowerCase().includes(query) ||
        s.sku?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [services, serviceTypeFilter, searchQuery]);

  // ============================================================================
  // COMPUTED COUNTS
  // ============================================================================

  const serviceCounts = useMemo(() => {
  // Service type counts (from current filtered data)
  const independent = filteredServices.filter(s => 
    s.service_type === 'independent' || !s.has_resources
  ).length;
  
  const resourceBased = filteredServices.filter(s => 
    s.service_type === 'resource_based' || s.has_resources
  ).length;

  return {
    active: statistics?.active_services || 0,      // ✅ Always from statistics
    inactive: statistics?.inactive_services || 0,  // ✅ Always from statistics
    total: statistics?.total_services || 0,
    independent,
    resourceBased,
  };
}, [statistics, filteredServices]);
  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleToggleStatus = (service: Service) => {
    setConfirmDialog({
      isOpen: true,
      serviceId: service.id,
      serviceName: service.service_name,
      currentStatus: service.status,
      action: service.status ? 'deactivate' : 'activate',
    });
  };

  const confirmToggleStatus = async () => {
    const { serviceId, action } = confirmDialog;
    
    try {
      const newStatus = action === 'activate' ? true : false;
      
      await toggleStatus({ serviceId, status: newStatus });
      
      // Close dialog
      setConfirmDialog({
        isOpen: false,
        serviceId: '',
        serviceName: '',
        currentStatus: false,
        action: '',
      });
      
      // Refresh list
      refreshLists();
      
    } catch (error: any) {
      console.error('Error toggling service status:', error);
      toast.error(error.message || `Failed to ${action} service`);
    }
  };

  const handleView = (serviceId: string) => {
    navigate(`/catalog/view/${serviceId}`);
  };

  const handleEdit = (serviceId: string) => {
    navigate(`/catalog/catalogService-form?id=${serviceId}`);
  };

  const handleCreate = () => {
    navigate('/catalog/catalogService-form');
  };

  const handleRefresh = () => {
    refetch();
    toast.success('Services refreshed');
  };

  // ✅ Handle tab change
  const handleFilterChange = (newFilter: 'active' | 'inactive') => {
    setActiveFilter(newFilter);
    // React Query will automatically refetch with new filter
  };

  // ============================================================================
  // RENDER: ERROR STATE
  // ============================================================================

  if (error) {
    return (
      <div 
        className="min-h-screen p-6"
        style={{ backgroundColor: colors.utility.primaryBackground }}
      >
        <div 
          className="max-w-2xl mx-auto mt-20 p-8 rounded-lg border text-center"
          style={{
            backgroundColor: colors.utility.secondaryBackground,
            borderColor: colors.semantic.error + '40'
          }}
        >
          <Package 
            className="h-16 w-16 mx-auto mb-4"
            style={{ color: colors.semantic.error }}
          />
          <h3 
            className="text-lg font-semibold mb-2"
            style={{ color: colors.semantic.error }}
          >
            Failed to Load Services
          </h3>
          <p 
            className="text-sm mb-6"
            style={{ color: colors.utility.secondaryText }}
          >
            {error.message || 'An error occurred while loading the service catalog.'}
          </p>
          <button
            onClick={handleRefresh}
            className="px-6 py-2 rounded-lg font-medium transition-all hover:opacity-90"
            style={{
              background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`,
              color: '#ffffff'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER: MAIN UI
  // ============================================================================

  return (
    <div 
      className="min-h-screen p-6"
      style={{ backgroundColor: colors.utility.primaryBackground }}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 
            className="text-2xl font-bold"
            style={{ color: colors.utility.primaryText }}
          >
            Service Catalog
          </h1>
          <p 
            className="text-sm mt-1"
            style={{ color: colors.utility.secondaryText }}
          >
            Manage your service offerings
          </p>
        </div>
        
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:opacity-90"
          style={{
            background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`,
            color: '#ffffff'
          }}
        >
          <Plus className="h-5 w-5" />
          Add Service
        </button>
      </div>

      {/* ========================================================================
          COMPACT FILTER BAR - Active/Inactive Only
          ======================================================================== */}
      <div 
        className="mb-6 p-4 rounded-lg border"
        style={{
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: colors.utility.secondaryText + '20'
        }}
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          {/* Search Bar - Left */}
          <div className="flex-1 w-full lg:w-auto min-w-[200px]">
            <div className="relative">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                style={{ color: colors.utility.secondaryText }}
              />
              <input
                type="text"
                placeholder="Search services... (min 3 characters)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border outline-none transition-all text-sm"
                style={{
                  backgroundColor: colors.utility.primaryBackground,
                  borderColor: colors.utility.secondaryText + '40',
                  color: colors.utility.primaryText
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = colors.brand.primary;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = colors.utility.secondaryText + '40';
                }}
              />
            </div>
          </div>

          {/* ✅ Status Filter Tabs - Active/Inactive Only */}
          <div className="flex items-center gap-2">
            <span 
              className="text-sm font-medium mr-2 hidden sm:inline"
              style={{ color: colors.utility.secondaryText }}
            >
              Status
            </span>
            
            <button
              onClick={() => handleFilterChange('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === 'active' ? 'ring-2' : ''
              }`}
              style={{
                backgroundColor: activeFilter === 'active' 
                  ? colors.semantic.success + '20' 
                  : colors.utility.primaryBackground,
                color: activeFilter === 'active' 
                  ? colors.semantic.success 
                  : colors.utility.primaryText,
                ringColor: colors.semantic.success
              }}
            >
              Active ({serviceCounts.active})
            </button>
            
            <button
              onClick={() => handleFilterChange('inactive')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === 'inactive' ? 'ring-2' : ''
              }`}
              style={{
                backgroundColor: activeFilter === 'inactive' 
                  ? colors.utility.secondaryText + '20' 
                  : colors.utility.primaryBackground,
                color: activeFilter === 'inactive' 
                  ? colors.utility.secondaryText 
                  : colors.utility.primaryText,
                ringColor: colors.utility.secondaryText
              }}
            >
              Inactive ({serviceCounts.inactive})
            </button>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Service Type Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowServiceTypeMenu(!showServiceTypeMenu)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  serviceTypeFilter !== 'all' ? 'ring-2' : ''
                }`}
                style={{
                  backgroundColor: serviceTypeFilter !== 'all'
                    ? colors.brand.primary + '20'
                    : colors.utility.primaryBackground,
                  color: serviceTypeFilter !== 'all'
                    ? colors.brand.primary
                    : colors.utility.primaryText,
                  borderColor: colors.utility.secondaryText + '40',
                  border: '1px solid',
                  ringColor: colors.brand.primary
                }}
              >
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {serviceTypeFilter === 'all' ? 'All Types' :
                   serviceTypeFilter === 'independent' ? 'Individual' :
                   'Resource-based'}
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {/* Dropdown Menu */}
              {showServiceTypeMenu && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-10"
                    onClick={() => setShowServiceTypeMenu(false)}
                  />
                  
                  {/* Menu */}
                  <div 
                    className="absolute right-0 top-full mt-2 w-64 rounded-lg border shadow-lg z-20"
                    style={{
                      backgroundColor: colors.utility.secondaryBackground,
                      borderColor: colors.utility.secondaryText + '20'
                    }}
                  >
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setServiceTypeFilter('all');
                          setShowServiceTypeMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${
                          serviceTypeFilter === 'all' ? 'font-medium' : ''
                        }`}
                        style={{
                          backgroundColor: serviceTypeFilter === 'all'
                            ? colors.brand.primary + '10'
                            : 'transparent',
                          color: serviceTypeFilter === 'all'
                            ? colors.brand.primary
                            : colors.utility.primaryText
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <span>All Types</span>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => {
                          setServiceTypeFilter('independent');
                          setShowServiceTypeMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all mt-1 ${
                          serviceTypeFilter === 'independent' ? 'font-medium' : ''
                        }`}
                        style={{
                          backgroundColor: serviceTypeFilter === 'independent'
                            ? colors.brand.primary + '10'
                            : 'transparent',
                          color: serviceTypeFilter === 'independent'
                            ? colors.brand.primary
                            : colors.utility.primaryText
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            <span>Individual Services</span>
                          </div>
                          <span 
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: colors.utility.secondaryText + '20',
                              color: colors.utility.secondaryText
                            }}
                          >
                            {serviceCounts.independent}
                          </span>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => {
                          setServiceTypeFilter('resource_based');
                          setShowServiceTypeMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all mt-1 ${
                          serviceTypeFilter === 'resource_based' ? 'font-medium' : ''
                        }`}
                        style={{
                          backgroundColor: serviceTypeFilter === 'resource_based'
                            ? colors.brand.primary + '10'
                            : 'transparent',
                          color: serviceTypeFilter === 'resource_based'
                            ? colors.brand.primary
                            : colors.utility.primaryText
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>Resource-based Services</span>
                          </div>
                          <span 
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: colors.utility.secondaryText + '20',
                              color: colors.utility.secondaryText
                            }}
                          >
                            {serviceCounts.resourceBased}
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 rounded-lg transition-all hover:opacity-80 disabled:opacity-50"
              style={{
                backgroundColor: colors.utility.primaryBackground,
                color: colors.utility.primaryText,
                border: `1px solid ${colors.utility.secondaryText}40`
              }}
              title="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            {/* View Mode Toggle */}
            <div 
              className="flex gap-1 p-1 rounded-lg"
              style={{
                backgroundColor: colors.utility.primaryBackground,
                border: `1px solid ${colors.utility.secondaryText}40`
              }}
            >
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-all ${viewMode === 'grid' ? 'ring-1' : ''}`}
                style={{
                  backgroundColor: viewMode === 'grid' 
                    ? colors.brand.primary 
                    : 'transparent',
                  color: viewMode === 'grid' 
                    ? '#ffffff' 
                    : colors.utility.primaryText,
                  ringColor: colors.brand.primary
                }}
                title="Grid view"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-all ${viewMode === 'list' ? 'ring-1' : ''}`}
                style={{
                  backgroundColor: viewMode === 'list' 
                    ? colors.brand.primary 
                    : 'transparent',
                  color: viewMode === 'list' 
                    ? '#ffffff' 
                    : colors.utility.primaryText,
                  ringColor: colors.brand.primary
                }}
                title="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================
          SERVICES GRID/LIST
          ======================================================================== */}
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 
            className="h-12 w-12 animate-spin mb-4"
            style={{ color: colors.brand.primary }}
          />
          <p 
            className="text-sm"
            style={{ color: colors.utility.secondaryText }}
          >
            Loading services...
          </p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div 
          className="text-center py-20 rounded-lg border"
          style={{
            backgroundColor: colors.utility.secondaryBackground,
            borderColor: colors.utility.secondaryText + '20'
          }}
        >
          <Package 
            className="h-16 w-16 mx-auto mb-4"
            style={{ color: colors.utility.secondaryText }}
          />
          <p 
            className="text-lg font-medium mb-2"
            style={{ color: colors.utility.primaryText }}
          >
            No services found
          </p>
          <p 
            className="text-sm mb-6"
            style={{ color: colors.utility.secondaryText }}
          >
            {searchQuery.length >= 3 || serviceTypeFilter !== 'all'
              ? 'Try adjusting your filters or search query'
              : `No ${activeFilter} services available`}
          </p>
          {services.length === 0 && activeFilter === 'active' && (
            <button
              onClick={handleCreate}
              className="px-6 py-2 rounded-lg font-medium transition-all hover:opacity-90"
              style={{
                background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`,
                color: '#ffffff'
              }}
            >
              Add Your First Service
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Results Count */}
          <div className="mb-4 flex items-center justify-between">
            <p 
              className="text-sm"
              style={{ color: colors.utility.secondaryText }}
            >
              Showing <span style={{ color: colors.utility.primaryText, fontWeight: 500 }}>
                {filteredServices.length}
              </span> {filteredServices.length === 1 ? 'service' : 'services'}
              {(searchQuery.length >= 3 || serviceTypeFilter !== 'all') && (
                <span> (filtered from {services.length} {activeFilter})</span>
              )}
            </p>
          </div>
          
          {/* Services Grid/List */}
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                viewType={viewMode}
                isSelected={false}
                onSelect={() => {}}
                onView={() => handleView(service.id)}
                onEdit={() => handleEdit(service.id)}
                onToggleStatus={() => handleToggleStatus(service)}
                onDuplicate={() => {
                  toast.success('Duplicate feature coming soon');
                }}
                onDelete={() => handleToggleStatus(service)}
              />
            ))}
          </div>
        </>
      )}

      {/* ========================================================================
          CONFIRMATION DIALOG
          ======================================================================== */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({
          isOpen: false,
          serviceId: '',
          serviceName: '',
          currentStatus: false,
          action: '',
        })}
        onConfirm={confirmToggleStatus}
        title={`${confirmDialog.action === 'activate' ? 'Activate' : 'Deactivate'} Service`}
        description={
          <div>
            <p style={{ color: colors.utility.secondaryText }}>
              Are you sure you want to {confirmDialog.action} <strong>{confirmDialog.serviceName}</strong>?
            </p>
            {confirmDialog.action === 'deactivate' && (
              <p className="mt-2 text-sm" style={{ color: colors.utility.secondaryText }}>
                This service will be hidden from active listings but can be reactivated anytime.
              </p>
            )}
            {confirmDialog.action === 'activate' && (
              <p className="mt-2 text-sm" style={{ color: colors.utility.secondaryText }}>
                This service will be visible in active listings again.
              </p>
            )}
          </div>
        }
        confirmText={confirmDialog.action === 'activate' ? 'Activate Service' : 'Deactivate Service'}
        cancelText="Cancel"
        type={confirmDialog.action === 'activate' ? 'success' : 'warning'}
        isLoading={isTogglingStatus}
      />
    </div>
  );
};

export default CatalogIndex;