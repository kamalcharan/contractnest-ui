// src/components/catalog/service/ServiceResourcesStep.tsx
// 🎨 Resource enhancement step for service creation with smart composition

import React, { useState, useMemo } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  Plus, 
  Sparkles, 
  ChevronDown, 
  ChevronRight, 
  Activity,
  User,
  Wrench,
  Package,
  Building,
  Handshake,
  Search,
  Filter,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  Info,
  Layers,
  Target
} from 'lucide-react';
import ResourceCategorySection from '../resources/ResourceCategorySection';
import ResourceSearch from '../resources/ResourceSearch';
import { useResourcesManager } from '../../../hooks/queries/useResourceQueries';
import type { ResourceType } from '../../../hooks/queries/useResourceQueries';

// Service catalog resource requirement type
interface ServiceResourceRequirement {
  id: string;
  resourceId: string;
  quantity: number;
  isOptional: boolean;
  skillRequirements?: string[];
}

interface ServiceResourcesStepProps {
  // Current service resource requirements
  resourceRequirements: ServiceResourceRequirement[];
  onResourceRequirementsChange: (requirements: ServiceResourceRequirement[]) => void;
  
  // Display options
  showHeader?: boolean;
  showSearch?: boolean;
  showSuggestions?: boolean;
  allowEmpty?: boolean;
  
  // Behavior
  isReadOnly?: boolean;
  maxResourcesPerType?: number;
  
  // Step context
  stepTitle?: string;
  stepDescription?: string;
  helpText?: string;
  
  // Events
  onComplete?: () => void;
  onSkip?: () => void;
  onResourceAdd?: (resourceTypeId: string, requirements: ServiceResourceRequirement[]) => void;
  onResourceRemove?: (resourceTypeId: string, requirementId: string) => void;
  
  // Styling
  className?: string;
}

const ServiceResourcesStep: React.FC<ServiceResourcesStepProps> = ({
  resourceRequirements,
  onResourceRequirementsChange,
  showHeader = true,
  showSearch = true,
  showSuggestions = true,
  allowEmpty = true,
  isReadOnly = false,
  maxResourcesPerType = 10,
  stepTitle = 'Resource Requirements',
  stepDescription = 'Define what resources are needed to deliver this service',
  helpText = 'Resources are optional but help make your service more specific and accurate for pricing.',
  onComplete,
  onSkip,
  onResourceAdd,
  onResourceRemove,
  className = ''
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // Resource management
  const { resourceTypes, isLoading } = useResourcesManager();

  // Local state
  const [searchFilters, setSearchFilters] = useState({
    query: '',
    resourceTypes: [],
    status: 'all' as const,
    availability: 'all' as const,
    tags: [],
    hasContact: 'all' as const,
    createdDateRange: { start: null, end: null },
    isDeletable: 'all' as const
  });

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    teamStaff: true,
    equipment: false,
    consumables: false,
    assets: false,
    partners: false
  });

  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [activeResourceType, setActiveResourceType] = useState<string | null>(null);

  // Computed values
  const totalResourceRequirements = resourceRequirements.length;

  const resourceRequirementsByType = useMemo(() => {
    // Group requirements by resource type
    const groupedRequirements = resourceRequirements.reduce((acc, requirement) => {
      // Find the resource type for this requirement
      const resourceType = resourceTypes.find(rt => 
        // For simplicity, we'll need to look up the actual resource to get its type
        // This is a simplified approach - in reality you'd need to fetch the resource details
        true // placeholder
      );
      
      if (resourceType) {
        if (!acc[resourceType.id]) {
          acc[resourceType.id] = {
            typeId: resourceType.id,
            resourceType,
            requirements: [],
            count: 0
          };
        }
        acc[resourceType.id].requirements.push(requirement);
        acc[resourceType.id].count++;
      }
      
      return acc;
    }, {} as Record<string, { typeId: string; resourceType: ResourceType; requirements: ServiceResourceRequirement[]; count: number }>);

    return Object.values(groupedRequirements);
  }, [resourceRequirements, resourceTypes]);

  const hasAnyRequirements = totalResourceRequirements > 0;

  // Validation
  const isValid = allowEmpty || hasAnyRequirements;
  const canComplete = isValid && !isLoading;

  // Event handlers
  const toggleCategory = (categoryKey: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }));
  };

  const handleResourceAdd = (resourceTypeId: string, requirements: ServiceResourceRequirement[]) => {
    const updatedRequirements = [...resourceRequirements, ...requirements];
    onResourceRequirementsChange(updatedRequirements);
    onResourceAdd?.(resourceTypeId, requirements);
  };

  const handleResourceRemove = (resourceTypeId: string, requirementId: string) => {
    const updatedRequirements = resourceRequirements.filter(req => req.id !== requirementId);
    onResourceRequirementsChange(updatedRequirements);
    onResourceRemove?.(resourceTypeId, requirementId);
  };

  const handleSearchAction = (action: string, resource: any) => {
    // Handle search-based resource actions
    console.log('Search action:', action, resource);
  };

  const clearAllRequirements = () => {
    onResourceRequirementsChange([]);
  };

  // Get completion suggestions
  const getCompletionSuggestions = () => {
    if (!showSuggestions) return [];
    
    const suggestions = [];
    
    // Group requirements by type for suggestions
    const requirementsByType = resourceRequirements.reduce((acc, req) => {
      // This is simplified - in reality you'd need to determine the type from the resource
      const type = 'general'; // placeholder
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Basic suggestions based on having any requirements
    if (resourceRequirements.length > 0 && resourceRequirements.length < 3) {
      suggestions.push({
        type: 'more',
        message: 'Consider adding more resources to make your service more comprehensive',
        action: () => setActiveResourceType('team-staff')
      });
    }
    
    return suggestions;
  };

  const suggestions = getCompletionSuggestions();

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* Header */}
      {showHeader && (
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ 
                backgroundColor: `${colors.brand.primary}20`,
                color: colors.brand.primary 
              }}
            >
              <Layers className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h2 
                className="text-2xl font-bold"
                style={{ color: colors.utility.primaryText }}
              >
                {stepTitle}
              </h2>
              <p 
                className="text-sm"
                style={{ color: colors.utility.secondaryText }}
              >
                {stepDescription}
              </p>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div 
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: hasAnyRequirements 
                ? colors.semantic.success + '10' 
                : colors.semantic.info + '10',
              borderColor: hasAnyRequirements 
                ? colors.semantic.success + '40' 
                : colors.semantic.info + '40'
            }}
          >
            <div className="flex items-center justify-center gap-3">
              {hasAnyRequirements ? (
                <Check className="w-5 h-5" style={{ color: colors.semantic.success }} />
              ) : (
                <Sparkles className="w-5 h-5" style={{ color: colors.semantic.info }} />
              )}
              <span 
                className="font-medium"
                style={{ 
                  color: hasAnyRequirements 
                    ? colors.semantic.success 
                    : colors.semantic.info 
                }}
              >
                {hasAnyRequirements 
                  ? `${totalResourceRequirements} resource${totalResourceRequirements !== 1 ? 's' : ''} configured`
                  : 'No specific resources required'
                }
              </span>
            </div>
            
            {helpText && (
              <p 
                className="text-sm mt-2"
                style={{ color: colors.utility.secondaryText }}
              >
                {helpText}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Search Panel */}
      {showSearch && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 
              className="text-lg font-semibold"
              style={{ color: colors.utility.primaryText }}
            >
              Find Resources
            </h3>
            <button
              onClick={() => setShowSearchPanel(!showSearchPanel)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:scale-105 duration-200 text-sm"
              style={{
                backgroundColor: showSearchPanel 
                  ? colors.brand.primary + '20' 
                  : colors.utility.secondaryText + '10',
                color: showSearchPanel 
                  ? colors.brand.primary 
                  : colors.utility.secondaryText
              }}
            >
              <Search className="w-4 h-4" />
              {showSearchPanel ? 'Hide Search' : 'Show Search'}
            </button>
          </div>
          
          {showSearchPanel && (
            <div 
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: colors.utility.primaryBackground,
                borderColor: colors.utility.secondaryText + '20'
              }}
            >
              <ResourceSearch
                filters={searchFilters}
                onFiltersChange={setSearchFilters}
                sort={{ field: 'name', direction: 'asc' }}
                onSortChange={() => {}}
                availableResourceTypes={resourceTypes}
                variant="compact"
                showFilters={false}
                showSort={false}
                placeholder="Search for resources to add to your service..."
              />
            </div>
          )}
        </div>
      )}

      {/* Resource Categories */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 
            className="text-lg font-semibold"
            style={{ color: colors.utility.primaryText }}
          >
            Resource Categories
          </h3>
          
          {hasAnyRequirements && (
            <button
              onClick={clearAllRequirements}
              disabled={isReadOnly}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:scale-105 duration-200 text-sm disabled:opacity-50"
              style={{
                backgroundColor: colors.semantic.error + '10',
                color: colors.semantic.error
              }}
            >
              <AlertCircle className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {/* Category Sections */}
        <div className="space-y-4">
          {resourceTypes.map((resourceType) => {
            const typeRequirements = resourceRequirements.filter(req => {
              // This is simplified - you'd need a way to determine which requirements belong to which type
              return true; // placeholder - show all requirements for now
            });
            const count = typeRequirements.length;
            const isExpanded = expandedCategories[resourceType.id];
            const hasRequirements = count > 0;
            
            return (
              <div
                key={resourceType.id}
                className="border rounded-lg transition-all duration-200"
                style={{
                  backgroundColor: colors.utility.primaryBackground,
                  borderColor: hasRequirements 
                    ? colors.semantic.success + '40' 
                    : colors.utility.secondaryText + '20'
                }}
              >
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(resourceType.id)}
                  className="w-full p-4 flex items-center justify-between hover:opacity-80 transition-all"
                  style={{ color: colors.utility.primaryText }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ 
                        backgroundColor: hasRequirements 
                          ? colors.semantic.success + '20' 
                          : colors.utility.secondaryText + '20',
                        color: hasRequirements 
                          ? colors.semantic.success 
                          : colors.utility.secondaryText
                      }}
                    >
                      {resourceType.id === 'team-staff' && <User className="w-5 h-5" />}
                      {resourceType.id === 'equipment' && <Wrench className="w-5 h-5" />}
                      {resourceType.id === 'consumables' && <Package className="w-5 h-5" />}
                      {resourceType.id === 'assets' && <Building className="w-5 h-5" />}
                      {resourceType.id === 'partners' && <Handshake className="w-5 h-5" />}
                    </div>
                    
                    <div className="text-left">
                      <h4 className="font-medium">{resourceType.name}</h4>
                      <p className="text-sm opacity-70">
                        {hasRequirements 
                          ? `${count} resource${count !== 1 ? 's' : ''} required`
                          : `No ${resourceType.name.toLowerCase()} required`
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {hasRequirements && (
                      <div 
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: colors.semantic.success + '20',
                          color: colors.semantic.success
                        }}
                      >
                        {count}
                      </div>
                    )}
                    
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>
                </button>
                
                {/* Category Content */}
                {isExpanded && (
                  <div 
                    className="border-t p-4"
                    style={{ borderColor: colors.utility.secondaryText + '20' }}
                  >
                    <ResourceCategorySection
                      resourceType={resourceType}
                      variant="selection"
                      selectionMode={!isReadOnly}
                      selectedResources={typeRequirements.map(r => r.resourceId)}
                      onResourceSelect={() => {}} // Handled by ResourceSelector modal
                      onResourceDeselect={() => {}} // Handled by ResourceSelector modal
                      maxSelections={maxResourcesPerType}
                      searchTerm={searchFilters.query}
                      statusFilter={searchFilters.status}
                      onAddNew={!isReadOnly ? () => setActiveResourceType(resourceType.id) : undefined}
                      showActions={!isReadOnly}
                      showHeader={false}
                      maxItemsToShow={3}
                      className="border-0"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div 
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: colors.semantic.info + '05',
            borderColor: colors.semantic.info + '40'
          }}
        >
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 mt-0.5" style={{ color: colors.semantic.info }} />
            <div className="flex-1">
              <h4 
                className="font-medium mb-2"
                style={{ color: colors.utility.primaryText }}
              >
                Suggestions
              </h4>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span 
                      className="text-sm"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      {suggestion.message}
                    </span>
                    <button
                      onClick={suggestion.action}
                      className="px-3 py-1 rounded text-xs transition-all hover:scale-105 duration-200"
                      style={{
                        backgroundColor: colors.semantic.info + '20',
                        color: colors.semantic.info
                      }}
                    >
                      Add {suggestion.type}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div 
        className="p-4 rounded-lg border"
        style={{
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: colors.utility.secondaryText + '20'
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h4 
              className="font-medium mb-1"
              style={{ color: colors.utility.primaryText }}
            >
              Resource Summary
            </h4>
            <p 
              className="text-sm"
              style={{ color: colors.utility.secondaryText }}
            >
              {hasAnyRequirements 
                ? `Your service requires ${totalResourceRequirements} specific resource${totalResourceRequirements !== 1 ? 's' : ''}`
                : 'Your service can be delivered without specific resource requirements'
              }
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {hasAnyRequirements ? (
              <Check className="w-5 h-5" style={{ color: colors.semantic.success }} />
            ) : (
              <Info className="w-5 h-5" style={{ color: colors.semantic.info }} />
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center gap-3">
          {allowEmpty && (
            <button
              onClick={onSkip}
              disabled={isReadOnly}
              className="px-4 py-2 rounded-lg transition-all hover:scale-105 duration-200 text-sm border disabled:opacity-50"
              style={{
                borderColor: colors.utility.secondaryText + '40',
                color: colors.utility.secondaryText,
                backgroundColor: 'transparent'
              }}
            >
              Skip Resources
            </button>
          )}
          
          <div 
            className="text-sm"
            style={{ color: colors.utility.secondaryText }}
          >
            {!allowEmpty && !hasAnyRequirements && 'Please add at least one resource to continue'}
            {isLoading && 'Loading resources...'}
          </div>
        </div>
        
        <button
          onClick={onComplete}
          disabled={!canComplete || isReadOnly}
          className="px-6 py-2 rounded-lg transition-all hover:scale-105 duration-200 text-sm text-white disabled:opacity-50"
          style={{
            backgroundColor: canComplete 
              ? colors.brand.primary 
              : colors.utility.secondaryText
          }}
        >
          {hasAnyRequirements ? 'Continue with Resources' : 'Continue without Resources'}
        </button>
      </div>
    </div>
  );
};

export default ServiceResourcesStep;