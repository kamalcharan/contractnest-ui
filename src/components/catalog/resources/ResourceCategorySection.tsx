// src/components/catalog/resources/ResourceCategorySection.tsx
// 🎨 Resource grouping component by category with expand/collapse and actions

import React, { useState, useMemo } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Filter, 
  Grid, 
  List, 
  MoreVertical,
  User,
  Wrench,
  Package,
  Building,
  Handshake,
  Search,
  Eye,
  EyeOff
} from 'lucide-react';
import ResourceCard from './ResourceCard';
import { useResources } from '../../../hooks/queries/useResourceQueries';
import type { ResourceItem, ResourceType } from '../../../hooks/queries/useResourceQueries';

interface ResourceCategorySectionProps {
  // Category Info
  resourceType: ResourceType;
  
  // Display Options
  viewMode?: 'grid' | 'list';
  variant?: 'default' | 'compact' | 'selection';
  maxItemsToShow?: number;
  showHeader?: boolean;
  showActions?: boolean;
  showStats?: boolean;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  
  // Selection (for resource selector modals)
  selectionMode?: boolean;
  selectedResources?: string[];
  onResourceSelect?: (resource: ResourceItem) => void;
  onResourceDeselect?: (resource: ResourceItem) => void;
  maxSelections?: number;
  
  // Filtering
  searchTerm?: string;
  statusFilter?: 'all' | 'active' | 'inactive';
  customFilter?: (resource: ResourceItem) => boolean;
  
  // Actions
  onAddNew?: (resourceTypeId: string) => void;
  onViewAll?: (resourceTypeId: string) => void;
  onResourceAction?: (action: string, resource: ResourceItem) => void;
  
  // Styling
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

const ResourceCategorySection: React.FC<ResourceCategorySectionProps> = ({
  resourceType,
  viewMode = 'grid',
  variant = 'default',
  maxItemsToShow = 6,
  showHeader = true,
  showActions = true,
  showStats = true,
  collapsible = true,
  defaultExpanded = true,
  selectionMode = false,
  selectedResources = [],
  onResourceSelect,
  onResourceDeselect,
  maxSelections = 10,
  searchTerm = '',
  statusFilter = 'all',
  customFilter,
  onAddNew,
  onViewAll,
  onResourceAction,
  className = '',
  headerClassName = '',
  contentClassName = ''
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // Local state
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [showAll, setShowAll] = useState(false);
  const [localViewMode, setLocalViewMode] = useState(viewMode);

  // Fetch resources for this type
  const { data: allResources = [], isLoading, error } = useResources(resourceType.id);

  // Filter and process resources
  const filteredResources = useMemo(() => {
    let filtered = allResources;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter === 'active') {
      filtered = filtered.filter(resource => resource.isActive);
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(resource => !resource.isActive);
    }

    // Apply custom filter
    if (customFilter) {
      filtered = filtered.filter(customFilter);
    }

    return filtered;
  }, [allResources, searchTerm, statusFilter, customFilter]);

  // Resources to display (with limit)
  const resourcesToShow = useMemo(() => {
    if (showAll || maxItemsToShow <= 0) {
      return filteredResources;
    }
    return filteredResources.slice(0, maxItemsToShow);
  }, [filteredResources, showAll, maxItemsToShow]);

  // Statistics
  const stats = useMemo(() => {
    const total = allResources.length;
    const active = allResources.filter(r => r.isActive).length;
    const selected = selectedResources.length;
    const filtered = filteredResources.length;

    return { total, active, selected, filtered };
  }, [allResources, selectedResources, filteredResources]);

  // Get resource type icon and color
  const getResourceTypeInfo = () => {
    const typeMap = {
      'team-staff': { 
        icon: <User className="w-5 h-5" />, 
        emoji: '👥',
        color: colors.semantic.info,
        bgColor: colors.semantic.info + '20'
      },
      'equipment': { 
        icon: <Wrench className="w-5 h-5" />, 
        emoji: '🔧',
        color: colors.semantic.warning,
        bgColor: colors.semantic.warning + '20'
      },
      'consumables': { 
        icon: <Package className="w-5 h-5" />, 
        emoji: '📦',
        color: colors.semantic.success,
        bgColor: colors.semantic.success + '20'
      },
      'assets': { 
        icon: <Building className="w-5 h-5" />, 
        emoji: '🏢',
        color: colors.brand.primary,
        bgColor: colors.brand.primary + '20'
      },
      'partners': { 
        icon: <Handshake className="w-5 h-5" />, 
        emoji: '🤝',
        color: colors.semantic.error,
        bgColor: colors.semantic.error + '20'
      }
    };
    return typeMap[resourceType.id as keyof typeof typeMap] || {
      icon: <Package className="w-5 h-5" />,
      emoji: '📋',
      color: colors.utility.secondaryText,
      bgColor: colors.utility.secondaryText + '20'
    };
  };

  const typeInfo = getResourceTypeInfo();

  // Handle resource selection
  const handleResourceSelect = (resource: ResourceItem) => {
    if (selectedResources.includes(resource.id)) {
      onResourceDeselect?.(resource);
    } else if (selectedResources.length < maxSelections) {
      onResourceSelect?.(resource);
    }
  };

  // Handle resource actions
  const handleResourceAction = (action: string, resource: ResourceItem) => {
    onResourceAction?.(action, resource);
  };

  // Toggle expansion
  const toggleExpanded = () => {
    if (collapsible) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className={`rounded-lg border transition-all duration-200 ${className}`}
      style={{
        backgroundColor: colors.utility.primaryBackground,
        borderColor: colors.utility.secondaryText + '20'
      }}
    >
      {/* Header */}
      {showHeader && (
        <div 
          className={`p-4 border-b transition-colors ${headerClassName}`}
          style={{ borderColor: colors.utility.secondaryText + '20' }}
        >
          <div className="flex items-center justify-between">
            {/* Left side - Type info and stats */}
            <div className="flex items-center gap-3">
              {/* Toggle button */}
              {collapsible && (
                <button
                  onClick={toggleExpanded}
                  className="p-1 rounded-lg hover:opacity-80 transition-all"
                  style={{ backgroundColor: colors.utility.secondaryText + '10' }}
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" style={{ color: colors.utility.primaryText }} />
                  ) : (
                    <ChevronRight className="w-4 h-4" style={{ color: colors.utility.primaryText }} />
                  )}
                </button>
              )}

              {/* Type icon and name */}
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ 
                  backgroundColor: typeInfo.bgColor,
                  color: typeInfo.color 
                }}
              >
                {typeInfo.icon}
              </div>
              
              <div>
                <h3 
                  className="font-semibold text-lg"
                  style={{ color: colors.utility.primaryText }}
                >
                  {resourceType.name}
                </h3>
                {resourceType.description && (
                  <p 
                    className="text-sm"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    {resourceType.description}
                  </p>
                )}
              </div>

              {/* Stats */}
              {showStats && (
                <div className="flex items-center gap-4 ml-4">
                  <div className="flex items-center gap-1">
                    <span 
                      className="text-sm font-medium"
                      style={{ color: colors.utility.primaryText }}
                    >
                      {stats.filtered}
                    </span>
                    <span 
                      className="text-xs"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      {searchTerm || statusFilter !== 'all' ? 'filtered' : 'total'}
                    </span>
                  </div>
                  
                  {selectionMode && (
                    <div className="flex items-center gap-1">
                      <span 
                        className="text-sm font-medium"
                        style={{ color: colors.semantic.success }}
                      >
                        {stats.selected}
                      </span>
                      <span 
                        className="text-xs"
                        style={{ color: colors.utility.secondaryText }}
                      >
                        selected
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <span 
                      className="text-sm font-medium"
                      style={{ color: colors.semantic.success }}
                    >
                      {stats.active}
                    </span>
                    <span 
                      className="text-xs"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      active
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Right side - Actions */}
            {showActions && isExpanded && (
              <div className="flex items-center gap-2">
                {/* View mode toggle */}
                <div 
                  className="flex rounded-lg border overflow-hidden"
                  style={{ borderColor: colors.utility.secondaryText + '40' }}
                >
                  <button
                    onClick={() => setLocalViewMode('grid')}
                    className="p-2 transition-all"
                    style={{
                      backgroundColor: localViewMode === 'grid' ? colors.brand.primary : 'transparent',
                      color: localViewMode === 'grid' ? 'white' : colors.utility.secondaryText
                    }}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setLocalViewMode('list')}
                    className="p-2 transition-all"
                    style={{
                      backgroundColor: localViewMode === 'list' ? colors.brand.primary : 'transparent',
                      color: localViewMode === 'list' ? 'white' : colors.utility.secondaryText
                    }}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Add new resource */}
                {onAddNew && (
                  <button
                    onClick={() => onAddNew(resourceType.id)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:scale-105 duration-200 text-sm"
                    style={{
                      backgroundColor: colors.brand.primary + '20',
                      color: colors.brand.primary
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    Add New
                  </button>
                )}

                {/* View all */}
                {onViewAll && filteredResources.length > maxItemsToShow && (
                  <button
                    onClick={() => onViewAll(resourceType.id)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:scale-105 duration-200 text-sm border"
                    style={{
                      borderColor: colors.utility.secondaryText + '40',
                      color: colors.utility.primaryText
                    }}
                  >
                    <Eye className="w-4 h-4" />
                    View All
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      {isExpanded && (
        <div className={`p-4 ${contentClassName}`}>
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div 
                className="text-center"
                style={{ color: colors.utility.secondaryText }}
              >
                <div 
                  className="w-8 h-8 border-2 border-dashed rounded-full animate-spin mx-auto mb-2"
                  style={{ borderColor: colors.brand.primary }}
                />
                Loading {resourceType.name.toLowerCase()}...
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex items-center justify-center py-12">
              <div 
                className="text-center"
                style={{ color: colors.semantic.error }}
              >
                Failed to load {resourceType.name.toLowerCase()}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredResources.length === 0 && (
            <div className="text-center py-12">
              <div 
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: typeInfo.bgColor }}
              >
                <span className="text-2xl">{typeInfo.emoji}</span>
              </div>
              <h4 
                className="text-lg font-medium mb-2"
                style={{ color: colors.utility.primaryText }}
              >
                No {resourceType.name.toLowerCase()} found
              </h4>
              <p 
                className="text-sm mb-4"
                style={{ color: colors.utility.secondaryText }}
              >
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your filters to see more resources'
                  : `No ${resourceType.name.toLowerCase()} have been added yet`
                }
              </p>
              {onAddNew && !searchTerm && statusFilter === 'all' && (
                <button
                  onClick={() => onAddNew(resourceType.id)}
                  className="px-4 py-2 rounded-lg text-sm transition-all hover:scale-105 duration-200"
                  style={{
                    backgroundColor: colors.brand.primary,
                    color: 'white'
                  }}
                >
                  Add First {resourceType.name.slice(0, -1)}
                </button>
              )}
            </div>
          )}

          {/* Resources Grid/List */}
          {!isLoading && !error && resourcesToShow.length > 0 && (
            <>
              <div className={
                localViewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-3"
              }>
                {resourcesToShow.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    variant={variant}
                    isSelectable={selectionMode}
                    isSelected={selectedResources.includes(resource.id)}
                    onSelect={() => handleResourceSelect(resource)}
                    onDeselect={() => handleResourceSelect(resource)}
                    onView={(res) => handleResourceAction('view', res)}
                    onEdit={(res) => handleResourceAction('edit', res)}
                    onDelete={(res) => handleResourceAction('delete', res)}
                    onDuplicate={(res) => handleResourceAction('duplicate', res)}
                    showActions={!selectionMode}
                    className={localViewMode === 'list' ? 'max-w-none' : ''}
                  />
                ))}
              </div>

              {/* Show More/Less Toggle */}
              {filteredResources.length > maxItemsToShow && (
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="flex items-center gap-2 mx-auto px-4 py-2 rounded-lg transition-all hover:scale-105 duration-200 text-sm border"
                    style={{
                      borderColor: colors.brand.primary,
                      color: colors.brand.primary,
                      backgroundColor: 'transparent'
                    }}
                  >
                    {showAll ? (
                      <>
                        <EyeOff className="w-4 h-4" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        Show All {filteredResources.length} {resourceType.name}
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ResourceCategorySection;