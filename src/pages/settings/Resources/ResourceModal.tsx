// src/pages/settings/Resources/index.tsx
// Complete Resources page with theme support and list UI similar to LOV

import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Plus, Search, X, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { SimpleTableSkeleton } from '@/components/common/skeletons';
import { cn } from '@/lib/utils';
import { useResourcesManager } from '@/hooks/useResources';
import { analyticsService } from '@/services/analytics.service';
import { 
  ResourceType, 
  Resource, 
  ResourceFilters, 
  DEFAULT_RESOURCE_FILTERS
} from '@/types/resources';
import {
  getResourceCountByType,
  formatResourceStatus,
  getResourceDisplayName,
  getResourceDescription,
  getResourceColor,
  formatSequenceNumber,
  parseResourceFiltersFromUrl
} from '@/utils/helpers/resourceHelpers';
import ResourceModal from './ResourceModal';
import ResourcesEmptyStates from '@/components/Resources/EmptyStates';

const ResourcesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentTenant } = useAuth();
  const { isDarkMode, currentTheme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // Parse initial filters from URL
  const initialFilters = useMemo(() => {
    const urlFilters = parseResourceFiltersFromUrl(searchParams);
    return { ...DEFAULT_RESOURCE_FILTERS, ...urlFilters };
  }, [searchParams]);

  // Component state
  const [selectedResourceTypeId, setSelectedResourceTypeId] = useState<string | null>(
    initialFilters.resourceTypeId || null
  );
  const [searchQuery, setSearchQuery] = useState(initialFilters.search || '');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Build filters for API
  const filters: ResourceFilters = useMemo(() => ({
    ...DEFAULT_RESOURCE_FILTERS,
    resourceTypeId: selectedResourceTypeId || undefined,
    search: searchQuery.trim() || undefined,
  }), [selectedResourceTypeId, searchQuery]);

  // Use resources hook
  const {
    resourceTypes,
    resources,
    isLoading,
    isError,
    error,
    deleteResourceAsync,
    refetchResources,
  } = useResourcesManager(filters);

  // Track page view
  useEffect(() => {
    analyticsService.trackPageView('settings/configure/resources', 'Resources Management');
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const newParams = new URLSearchParams();
    if (selectedResourceTypeId) newParams.set('type', selectedResourceTypeId);
    if (searchQuery.trim()) newParams.set('search', searchQuery.trim());
    
    const newSearch = newParams.toString();
    if (newSearch !== searchParams.toString()) {
      setSearchParams(newParams, { replace: true });
    }
  }, [selectedResourceTypeId, searchQuery, setSearchParams, searchParams]);

  // Auto-select first resource type if none selected
  useEffect(() => {
    if (!selectedResourceTypeId && resourceTypes.length > 0 && !isLoading) {
      const firstType = resourceTypes[0];
      setSelectedResourceTypeId(firstType.id);
      
      analyticsService.trackPageView(
        `settings/configure/resources/${firstType.id}`, 
        `Resources - ${firstType.name}`
      );
    }
  }, [selectedResourceTypeId, resourceTypes, isLoading]);

  // Event handlers
  const handleResourceTypeSelect = (resourceTypeId: string) => {
    setSelectedResourceTypeId(resourceTypeId);
    setSearchQuery(''); // Clear search when changing type
    
    const resourceType = resourceTypes.find(rt => rt.id === resourceTypeId);
    if (resourceType) {
      analyticsService.trackPageView(
        `settings/configure/resources/${resourceTypeId}`, 
        `Resources - ${resourceType.name}`
      );
    }
  };

  const handleCreateNew = () => {
    if (!selectedResourceTypeId) {
      toast({
        variant: "destructive",
        title: "Select Resource Type",
        description: "Please select a resource type first."
      });
      return;
    }
    
    setIsCreateModalOpen(true);
    analyticsService.trackPageView(
      'settings/configure/resources/create', 
      'Resources - Create New'
    );
  };

  const handleEditResource = (resource: Resource) => {
    setEditingResource(resource);
    setIsEditModalOpen(true);
    
    analyticsService.trackPageView(
      `settings/configure/resources/edit/${resource.id}`, 
      `Resources - Edit ${resource.display_name}`
    );
  };

  const handleDeleteResource = async (resource: Resource) => {
    if (!resource.is_deletable) {
      toast({
        variant: "destructive",
        title: "Cannot Delete",
        description: "This resource cannot be deleted."
      });
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${getResourceDisplayName(resource)}"?`)) {
      setIsProcessing(true);
      try {
        await deleteResourceAsync(resource.id);
        toast({
          title: "Success",
          description: "Resource deleted successfully"
        });
        
        analyticsService.trackPageView(
          'settings/configure/resources/deleted', 
          'Resources - Deleted Successfully'
        );
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to delete resource"
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleModalSuccess = () => {
    // Close modals first
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setEditingResource(null);
    
    // Refetch data with a small delay to avoid flash
    setTimeout(() => {
      refetchResources();
    }, 50);
  };

  // Get selected resource type info
  const selectedResourceType = resourceTypes.find(rt => rt.id === selectedResourceTypeId);
  const selectedResourceTypeName = selectedResourceType?.name || 'Resources';

  // Filter resources for display
  const displayResources = resources || [];

  if (isError) {
    return (
      <div 
        className="p-6 transition-colors duration-200 min-h-screen"
        style={{
          background: isDarkMode 
            ? `linear-gradient(to bottom right, ${colors.utility.primaryBackground}, ${colors.utility.secondaryBackground})`
            : `linear-gradient(to bottom right, ${colors.utility.primaryBackground}, ${colors.utility.secondaryBackground})`
        }}
      >
        <div className="flex items-center mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/settings/configure')}
            className="mr-4 transition-colors"
            style={{
              borderColor: colors.utility.secondaryText + '40',
              backgroundColor: colors.utility.secondaryBackground,
              color: colors.utility.primaryText
            }}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: colors.utility.primaryText }}>
              Resources
            </h1>
            <p style={{ color: colors.utility.secondaryText }}>
              Manage your catalog resources
            </p>
          </div>
        </div>

        <ResourcesEmptyStates
          type="error"
          errorMessage={error?.message}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div 
      className="p-6 transition-colors duration-200 min-h-screen"
      style={{
        background: isDarkMode 
          ? `linear-gradient(to bottom right, ${colors.utility.primaryBackground}, ${colors.utility.secondaryBackground})`
          : `linear-gradient(to bottom right, ${colors.utility.primaryBackground}, ${colors.utility.secondaryBackground})`
      }}
    >
      {/* Header */}
      <div className="flex items-center mb-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/settings/configure')}
          className="mr-4 transition-colors"
          style={{
            borderColor: colors.utility.secondaryText + '40',
            backgroundColor: colors.utility.secondaryBackground,
            color: colors.utility.primaryText
          }}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: colors.utility.primaryText }}>
            Resources
          </h1>
          <p style={{ color: colors.utility.secondaryText }}>
            Manage your catalog resources and resource types
          </p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left Sidebar - Resource Types */}
        <div className="w-64 shrink-0">
          <div 
            className="rounded-lg shadow-sm border overflow-hidden transition-colors"
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: colors.utility.primaryText + '20'
            }}
          >
            {isLoading ? (
              <div className="p-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div 
                    key={index} 
                    className="h-12 rounded mb-2 animate-pulse" 
                    style={{ backgroundColor: colors.utility.primaryText + '20' }}
                  />
                ))}
              </div>
            ) : resourceTypes.length > 0 ? (
              resourceTypes.map((resourceType) => {
                const isSelected = selectedResourceTypeId === resourceType.id;
                const resourceCount = getResourceCountByType(resources, resourceType.id);
                
                return (
                  <button
                    key={resourceType.id}
                    onClick={() => handleResourceTypeSelect(resourceType.id)}
                    className={cn(
                      "w-full px-4 py-3 text-left border-b last:border-0 transition-colors flex items-center justify-between",
                      isSelected 
                        ? "font-medium" 
                        : "hover:opacity-80"
                    )}
                    style={{
                      borderColor: colors.utility.primaryText + '20',
                      backgroundColor: isSelected 
                        ? colors.brand.primary
                        : 'transparent',
                      color: isSelected 
                        ? '#FFFFFF'
                        : colors.utility.primaryText
                    }}
                  >
                    <div className="flex items-center min-w-0">
                      <span className="truncate">{resourceType.name}</span>
                    </div>
                    <span 
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: isSelected 
                          ? '#FFFFFF20' 
                          : colors.utility.primaryText + '10',
                        color: isSelected 
                          ? '#FFFFFF' 
                          : colors.utility.secondaryText
                      }}
                    >
                      {resourceCount}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center" style={{ color: colors.utility.secondaryText }}>
                No resource types found.
              </div>
            )}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1">
          {selectedResourceTypeId ? (
            <div>
              {/* Content Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold" style={{ color: colors.utility.primaryText }}>
                    {selectedResourceTypeName}
                  </h2>
                  <p className="text-sm" style={{ color: colors.utility.secondaryText }}>
                    {displayResources.length} {displayResources.length === 1 ? 'resource' : 'resources'}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search resources..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-9 w-64"
                      style={{
                        borderColor: colors.utility.secondaryText + '40',
                        backgroundColor: colors.utility.primaryBackground,
                        color: colors.utility.primaryText
                      }}
                    />
                    {searchQuery && (
                      <button
                        onClick={handleClearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      </button>
                    )}
                  </div>

                  {/* Add Button */}
                  <Button 
                    onClick={handleCreateNew}
                    disabled={isProcessing}
                    className="transition-colors hover:opacity-90"
                    style={{
                      background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`,
                      color: '#FFFFFF'
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Value
                  </Button>
                </div>
              </div>

              {/* Column Headers - Similar to LOV */}
              {!isLoading && displayResources.length > 0 && (
                <div 
                  className="rounded-lg shadow-sm border mb-4 transition-colors"
                  style={{
                    backgroundColor: colors.utility.secondaryBackground,
                    borderColor: colors.utility.primaryText + '20'
                  }}
                >
                  <div className="grid grid-cols-6 gap-4 px-4 py-3">
                    <div className="font-medium" style={{ color: colors.utility.primaryText }}>
                      Name
                    </div>
                    <div className="font-medium" style={{ color: colors.utility.primaryText }}>
                      Display Name
                    </div>
                    <div className="font-medium" style={{ color: colors.utility.primaryText }}>
                      Color
                    </div>
                    <div className="font-medium" style={{ color: colors.utility.primaryText }}>
                      Sequence
                    </div>
                    <div className="font-medium" style={{ color: colors.utility.primaryText }}>
                      Description
                    </div>
                    <div className="font-medium" style={{ color: colors.utility.primaryText }}>
                      Actions
                    </div>
                  </div>
                </div>
              )}

              {/* Resources List - LOV Style */}
              {isLoading ? (
                <SimpleTableSkeleton rows={5} />
              ) : displayResources.length > 0 ? (
                <div className="space-y-4">
                  {displayResources.map((resource) => {
                    const status = formatResourceStatus(resource);
                    const color = getResourceColor(resource);
                    const displayName = getResourceDisplayName(resource);
                    const description = getResourceDescription(resource, 80);
                    const sequenceNumber = formatSequenceNumber(resource.sequence_no);
                    
                    return (
                      <div
                        key={resource.id}
                        className="rounded-lg shadow-sm border transition-colors"
                        style={{
                          backgroundColor: colors.utility.secondaryBackground,
                          borderColor: colors.utility.primaryText + '20',
                          opacity: resource.is_active ? 1 : 0.7
                        }}
                      >
                        <div className="grid grid-cols-6 gap-4 px-4 py-3 items-center">
                          {/* Name */}
                          <div 
                            className="font-medium truncate"
                            style={{ color: colors.utility.primaryText }}
                          >
                            {resource.name}
                          </div>

                          {/* Display Name */}
                          <div 
                            className="truncate"
                            style={{ color: colors.utility.primaryText }}
                          >
                            {displayName}
                          </div>

                          {/* Color */}
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-6 h-6 rounded-full" 
                              style={{ backgroundColor: color }}
                            />
                          </div>

                          {/* Sequence */}
                          <div 
                            className="text-sm"
                            style={{ color: colors.utility.primaryText }}
                          >
                            {sequenceNumber}
                          </div>

                          {/* Description */}
                          <div 
                            className="truncate"
                            style={{ color: colors.utility.secondaryText }}
                          >
                            {description || '-'}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditResource(resource)}
                              disabled={isProcessing}
                              className="transition-colors hover:opacity-80"
                              style={{
                                borderColor: colors.brand.primary + '40',
                                backgroundColor: colors.utility.secondaryBackground,
                                color: colors.brand.primary
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            
                            {resource.is_deletable && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteResource(resource)}
                                disabled={isProcessing}
                                className="transition-colors hover:opacity-80"
                                style={{
                                  borderColor: colors.semantic.error + '40',
                                  backgroundColor: colors.utility.secondaryBackground,
                                  color: colors.semantic.error
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Empty State
                <ResourcesEmptyStates
                  type={searchQuery ? 'no_search_results' : 'no_resources'}
                  resourceTypeName={selectedResourceTypeName}
                  searchQuery={searchQuery}
                  onCreateNew={handleCreateNew}
                  onClearSearch={searchQuery ? handleClearSearch : undefined}
                />
              )}
            </div>
          ) : (
            // No resource type selected
            <ResourcesEmptyStates
              type="no_selection"
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <ResourceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
        resourceTypeId={selectedResourceTypeId || undefined}
        onSuccess={handleModalSuccess}
      />

      <ResourceModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        mode="edit"
        resource={editingResource || undefined}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default ResourcesPage;