// src/components/catalog/resources/ResourceSelector.tsx
// 🎨 Updated ResourceSelector with integrated ResourceCard and ResourceSearch components

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { Search, X, Plus, Check, User, Wrench, Package, Building, Handshake } from 'lucide-react';
import ResourceCard from './ResourceCard';
import ResourceSearch from './ResourceSearch';
import { useResources } from '../../../hooks/queries/useResourceQueries';
import type { ResourceItem } from '../../../hooks/queries/useResourceQueries';

// Service catalog resource requirement type
interface ServiceResourceRequirement {
  id: string;
  resourceId: string;
  quantity: number;
  isOptional: boolean;
  skillRequirements?: string[];
}

interface ResourceSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  resourceTypeId: string;
  resourceTypeName: string;
  selectedResources: ServiceResourceRequirement[];
  onResourcesSelected: (resources: ServiceResourceRequirement[]) => void;
  maxSelections?: number;
  allowMultiple?: boolean;
}

const ResourceSelector: React.FC<ResourceSelectorProps> = ({
  isOpen,
  onClose,
  resourceTypeId,
  resourceTypeName,
  selectedResources,
  onResourcesSelected,
  maxSelections = 10,
  allowMultiple = true
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // Get resources for this type
  const { data: resources = [], isLoading } = useResources(resourceTypeId);

  // Local state
  const [selectedResourceIds, setSelectedResourceIds] = useState<Set<string>>(new Set());
  const [requirementTypes, setRequirementTypes] = useState<Record<string, boolean>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [skillRequirements, setSkillRequirements] = useState<Record<string, string[]>>({});
  const [showSearch, setShowSearch] = useState(false);
  
  // Search filters
  const [searchFilters, setSearchFilters] = useState({
    query: '',
    resourceTypes: [resourceTypeId],
    status: 'all' as const,
    availability: 'all' as const,
    tags: [],
    hasContact: 'all' as const,
    createdDateRange: { start: null, end: null },
    isDeletable: 'all' as const
  });

  // Initialize selected resources
  useEffect(() => {
    if (isOpen) {
      const initialSelected = new Set(selectedResources.map(req => req.resourceId));
      const initialTypes = selectedResources.reduce((acc, req) => {
        acc[req.resourceId] = req.isOptional;
        return acc;
      }, {} as Record<string, boolean>);
      const initialQuantities = selectedResources.reduce((acc, req) => {
        acc[req.resourceId] = req.quantity;
        return acc;
      }, {} as Record<string, number>);
      const initialSkills = selectedResources.reduce((acc, req) => {
        if (req.skillRequirements) {
          acc[req.resourceId] = req.skillRequirements;
        }
        return acc;
      }, {} as Record<string, string[]>);
      
      setSelectedResourceIds(initialSelected);
      setRequirementTypes(initialTypes);
      setQuantities(initialQuantities);
      setSkillRequirements(initialSkills);
      
      // Reset search when opening
      setSearchFilters(prev => ({
        ...prev,
        query: '',
        tags: [],
        status: 'all'
      }));
      setShowSearch(false);
    }
  }, [isOpen, selectedResources]);

  // Filter resources based on search
  const filteredResources = resources.filter(resource => {
    // Apply search query
    if (searchFilters.query) {
      const query = searchFilters.query.toLowerCase();
      const matchesName = resource.name.toLowerCase().includes(query) ||
                         resource.display_name.toLowerCase().includes(query);
      const matchesDescription = resource.description?.toLowerCase().includes(query);
      const matchesTags = resource.tags?.some(tag => tag.toLowerCase().includes(query));
      
      if (!matchesName && !matchesDescription && !matchesTags) {
        return false;
      }
    }

    // Apply status filter
    if (searchFilters.status === 'active' && !resource.isActive) return false;
    if (searchFilters.status === 'inactive' && resource.isActive) return false;

    // Apply contact filter
    if (searchFilters.hasContact === 'with-contact' && !resource.contact) return false;
    if (searchFilters.hasContact === 'without-contact' && resource.contact) return false;

    return true;
  });

  // Handle resource selection
  const handleResourceSelect = (resource: ResourceItem) => {
    const newSelected = new Set(selectedResourceIds);
    
    if (newSelected.has(resource.id)) {
      // Deselect
      newSelected.delete(resource.id);
      const newTypes = { ...requirementTypes };
      const newQuantities = { ...quantities };
      const newSkills = { ...skillRequirements };
      delete newTypes[resource.id];
      delete newQuantities[resource.id];
      delete newSkills[resource.id];
      setRequirementTypes(newTypes);
      setQuantities(newQuantities);
      setSkillRequirements(newSkills);
    } else {
      // Select
      if (!allowMultiple) {
        newSelected.clear();
        setRequirementTypes({});
        setQuantities({});
        setSkillRequirements({});
      }
      
      if (newSelected.size < maxSelections) {
        newSelected.add(resource.id);
        setRequirementTypes(prev => ({
          ...prev,
          [resource.id]: false // Default to required (false means not optional)
        }));
        setQuantities(prev => ({
          ...prev,
          [resource.id]: 1 // Default quantity
        }));
      }
    }
    
    setSelectedResourceIds(newSelected);
  };

  const handleResourceDeselect = (resource: ResourceItem) => {
    handleResourceSelect(resource); // Same logic for toggle
  };

  // Handle requirement type change
  const handleRequirementTypeChange = (resourceId: string, isOptional: boolean) => {
    setRequirementTypes(prev => ({
      ...prev,
      [resourceId]: isOptional
    }));
  };

  // Handle quantity change
  const handleQuantityChange = (resourceId: string, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [resourceId]: Math.max(1, quantity)
    }));
  };

  // Handle save
  const handleSave = () => {
    const newRequirements: ServiceResourceRequirement[] = Array.from(selectedResourceIds).map(resourceId => {
      return {
        id: `req-${Date.now()}-${resourceId}`,
        resourceId: resourceId,
        quantity: quantities[resourceId] || 1,
        isOptional: requirementTypes[resourceId] || false,
        skillRequirements: skillRequirements[resourceId] || []
      };
    });
    
    onResourcesSelected(newRequirements);
    onClose();
  };

  // Get icon for resource type
  const getResourceTypeIcon = () => {
    switch (resourceTypeId) {
      case 'team-staff': return <User className="w-5 h-5" />;
      case 'equipment': return <Wrench className="w-5 h-5" />;
      case 'consumables': return <Package className="w-5 h-5" />;
      case 'assets': return <Building className="w-5 h-5" />;
      case 'partners': return <Handshake className="w-5 h-5" />;
      default: return <Plus className="w-5 h-5" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-6xl max-h-[90vh] mx-4 rounded-xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: colors.utility.primaryBackground }}
      >
        {/* Header */}
        <div 
          className="p-6 border-b"
          style={{ borderColor: colors.utility.secondaryText + '20' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ 
                  backgroundColor: `${colors.brand.primary}20`,
                  color: colors.brand.primary 
                }}
              >
                {getResourceTypeIcon()}
              </div>
              <div>
                <h2 
                  className="text-xl font-semibold"
                  style={{ color: colors.utility.primaryText }}
                >
                  Select {resourceTypeName}
                </h2>
                <p 
                  className="text-sm"
                  style={{ color: colors.utility.secondaryText }}
                >
                  Choose resources required for this service
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:opacity-80 transition-all"
              style={{ backgroundColor: colors.utility.secondaryText + '20' }}
            >
              <X className="w-5 h-5" style={{ color: colors.utility.primaryText }} />
            </button>
          </div>

          {/* Search Toggle */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:scale-105 duration-200"
              style={{
                backgroundColor: showSearch 
                  ? colors.brand.primary + '20' 
                  : colors.utility.secondaryText + '10',
                color: showSearch 
                  ? colors.brand.primary 
                  : colors.utility.secondaryText
              }}
            >
              <Search className="w-4 h-4" />
              {showSearch ? 'Hide Search' : 'Show Search'}
            </button>

            {/* Selection Summary */}
            {selectedResourceIds.size > 0 && (
              <div 
                className="px-3 py-2 rounded-lg"
                style={{ backgroundColor: `${colors.semantic.success}10` }}
              >
                <div className="flex items-center gap-2">
                  <Check 
                    className="w-4 h-4"
                    style={{ color: colors.semantic.success }}
                  />
                  <span 
                    className="text-sm font-medium"
                    style={{ color: colors.semantic.success }}
                  >
                    {selectedResourceIds.size} {resourceTypeName.toLowerCase()} selected
                    {!allowMultiple && ' (single selection mode)'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Search Panel */}
          {showSearch && (
            <div className="mt-4">
              <ResourceSearch
                filters={searchFilters}
                onFiltersChange={setSearchFilters}
                sort={{ field: 'name', direction: 'asc' }}
                onSortChange={() => {}}
                availableResourceTypes={[{ id: resourceTypeId, name: resourceTypeName, is_active: true }]}
                resultsCount={filteredResources.length}
                variant="compact"
                showFilters={true}
                showSort={false}
                showSavedSearches={false}
                placeholder={`Search ${resourceTypeName.toLowerCase()}...`}
              />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div 
                className="text-center"
                style={{ color: colors.utility.secondaryText }}
              >
                <div 
                  className="w-8 h-8 border-2 border-dashed rounded-full animate-spin mx-auto mb-2"
                  style={{ borderColor: colors.brand.primary }}
                />
                Loading {resourceTypeName.toLowerCase()}...
              </div>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div 
                className="text-center"
                style={{ color: colors.utility.secondaryText }}
              >
                {searchFilters.query || searchFilters.status !== 'all' ? 
                  `No ${resourceTypeName.toLowerCase()} found matching your criteria` :
                  `No ${resourceTypeName.toLowerCase()} available`
                }
              </div>
            </div>
          ) : (
            <div className="h-96 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredResources.map((resource) => {
                  const isSelected = selectedResourceIds.has(resource.id);
                  const isOptional = requirementTypes[resource.id] || false;
                  const quantity = quantities[resource.id] || 1;
                  
                  return (
                    <div key={resource.id} className="space-y-3">
                      {/* Resource Card */}
                      <ResourceCard
                        resource={resource}
                        variant="selection"
                        isSelectable={true}
                        isSelected={isSelected}
                        onSelect={handleResourceSelect}
                        onDeselect={handleResourceDeselect}
                        showActions={false}
                        showContact={true}
                        showTags={true}
                        showStatus={false}
                      />
                      
                      {/* Resource Configuration */}
                      {isSelected && (
                        <div 
                          className="p-3 rounded-lg border space-y-3"
                          style={{ 
                            backgroundColor: colors.utility.secondaryBackground,
                            borderColor: colors.utility.secondaryText + '20' 
                          }}
                        >
                          {/* Requirement Type */}
                          <div>
                            <label 
                              className="block text-xs font-medium mb-2"
                              style={{ color: colors.utility.primaryText }}
                            >
                              Requirement Type:
                            </label>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleRequirementTypeChange(resource.id, false)}
                                className="px-3 py-1 rounded-full text-xs font-medium transition-all hover:scale-105 duration-200"
                                style={{
                                  backgroundColor: !isOptional 
                                    ? colors.semantic.error + '20' 
                                    : colors.utility.secondaryText + '20',
                                  color: !isOptional 
                                    ? colors.semantic.error 
                                    : colors.utility.secondaryText
                                }}
                              >
                                Required
                              </button>
                              <button
                                onClick={() => handleRequirementTypeChange(resource.id, true)}
                                className="px-3 py-1 rounded-full text-xs font-medium transition-all hover:scale-105 duration-200"
                                style={{
                                  backgroundColor: isOptional 
                                    ? colors.semantic.warning + '20' 
                                    : colors.utility.secondaryText + '20',
                                  color: isOptional 
                                    ? colors.semantic.warning 
                                    : colors.utility.secondaryText
                                }}
                              >
                                Optional
                              </button>
                            </div>
                          </div>
                          
                          {/* Quantity */}
                          <div>
                            <label 
                              className="block text-xs font-medium mb-2"
                              style={{ color: colors.utility.primaryText }}
                            >
                              Quantity:
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={quantity}
                              onChange={(e) => handleQuantityChange(resource.id, parseInt(e.target.value) || 1)}
                              className="w-20 px-3 py-1 rounded border text-sm transition-all focus:outline-none focus:ring-2"
                              style={{
                                backgroundColor: colors.utility.primaryBackground,
                                borderColor: colors.utility.secondaryText + '40',
                                color: colors.utility.primaryText,
                                '--tw-ring-color': colors.brand.primary
                              } as React.CSSProperties}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div 
          className="p-6 border-t"
          style={{ borderColor: colors.utility.secondaryText + '20' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div 
                className="text-sm"
                style={{ color: colors.utility.secondaryText }}
              >
                {selectedResourceIds.size} of {maxSelections} maximum selections
              </div>
              {selectedResourceIds.size > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {Array.from(selectedResourceIds).slice(0, 3).map(resourceId => {
                    const resource = resources.find(r => r.id === resourceId);
                    return (
                      <span
                        key={resourceId}
                        className="px-2 py-1 rounded-full text-xs"
                        style={{
                          backgroundColor: `${colors.semantic.success}20`,
                          color: colors.semantic.success
                        }}
                      >
                        {resource?.display_name || resource?.name}
                      </span>
                    );
                  })}
                  {selectedResourceIds.size > 3 && (
                    <span
                      className="px-2 py-1 rounded-full text-xs"
                      style={{
                        backgroundColor: colors.utility.secondaryText + '20',
                        color: colors.utility.secondaryText
                      }}
                    >
                      +{selectedResourceIds.size - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
                style={{
                  backgroundColor: 'transparent',
                  color: colors.utility.secondaryText,
                  border: `1px solid ${colors.utility.secondaryText}40`
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={selectedResourceIds.size === 0}
                className="px-6 py-2 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
                style={{
                  background: selectedResourceIds.size > 0 
                    ? `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
                    : colors.utility.secondaryText
                }}
              >
                Add {selectedResourceIds.size} {resourceTypeName}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceSelector;