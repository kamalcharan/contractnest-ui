// src/components/catalog/resources/ResourceSearch.tsx
// 🎨 Advanced resource search and filtering component with autocomplete and saved searches

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  Search, 
  Filter, 
  X, 
  Clock, 
  Star, 
  Bookmark,
  ChevronDown,
  RotateCcw,
  SortAsc,
  SortDesc,
  Sliders,
  Tag,
  User,
  Wrench,
  Package,
  Building,
  Handshake,
  Eye,
  EyeOff
} from 'lucide-react';
import type { ResourceItem, ResourceType } from '../../../hooks/queries/useResourceQueries';

export interface ResourceSearchFilters {
  // Text search
  query: string;
  
  // Resource type filter
  resourceTypes: string[];
  
  // Status filters
  status: 'all' | 'active' | 'inactive';
  availability: 'all' | 'available' | 'busy' | 'unavailable';
  
  // Tag filters
  tags: string[];
  
  // Contact filters (for team staff)
  hasContact: 'all' | 'with-contact' | 'without-contact';
  
  // Metadata filters
  createdDateRange: {
    start: Date | null;
    end: Date | null;
  };
  isDeletable: 'all' | 'deletable' | 'system';
}

export interface ResourceSearchSort {
  field: 'name' | 'display_name' | 'created_at' | 'resource_type' | 'sequence_no';
  direction: 'asc' | 'desc';
}

interface SavedSearch {
  id: string;
  name: string;
  filters: ResourceSearchFilters;
  isFavorite: boolean;
  createdAt: Date;
}

interface ResourceSearchProps {
  // Search state
  filters: ResourceSearchFilters;
  onFiltersChange: (filters: ResourceSearchFilters) => void;
  sort: ResourceSearchSort;
  onSortChange: (sort: ResourceSearchSort) => void;
  
  // Data for autocomplete and suggestions
  availableResourceTypes?: ResourceType[];
  availableTags?: string[];
  recentSearches?: string[];
  
  // Results info
  resultsCount?: number;
  totalCount?: number;
  isLoading?: boolean;
  
  // UI options
  showFilters?: boolean;
  showSavedSearches?: boolean;
  showSort?: boolean;
  showQuickFilters?: boolean;
  placeholder?: string;
  variant?: 'default' | 'compact' | 'minimal';
  
  // Callbacks
  onSearch?: (query: string) => void;
  onClearAll?: () => void;
  onSaveSearch?: (name: string, filters: ResourceSearchFilters) => void;
  onLoadSearch?: (search: SavedSearch) => void;
  
  // Styling
  className?: string;
}

const ResourceSearch: React.FC<ResourceSearchProps> = ({
  filters,
  onFiltersChange,
  sort,
  onSortChange,
  availableResourceTypes = [],
  availableTags = [],
  recentSearches = [],
  resultsCount = 0,
  totalCount,
  isLoading = false,
  showFilters = true,
  showSavedSearches = true,
  showSort = true,
  showQuickFilters = true,
  placeholder = "Search resources by name, description, or tags...",
  variant = 'default',
  onSearch,
  onClearAll,
  onSaveSearch,
  onLoadSearch,
  className = ''
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // Local state
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(filters.query);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState('');

  // Debounced search
  const [debouncedQuery, setDebouncedQuery] = useState(filters.query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(inputValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue]);

  useEffect(() => {
    if (debouncedQuery !== filters.query) {
      onFiltersChange({ ...filters, query: debouncedQuery });
      onSearch?.(debouncedQuery);
    }
  }, [debouncedQuery, filters, onFiltersChange, onSearch]);

  // Update input when filters change externally
  useEffect(() => {
    setInputValue(filters.query);
  }, [filters.query]);

  // Search suggestions
  const searchSuggestions = useMemo(() => {
    if (!inputValue) return recentSearches.slice(0, 5);
    
    const suggestions = [];
    
    // Add tag suggestions
    const matchingTags = availableTags.filter(tag =>
      tag.toLowerCase().includes(inputValue.toLowerCase()) && !filters.tags.includes(tag)
    ).slice(0, 3);
    
    suggestions.push(...matchingTags.map(tag => ({ type: 'tag', value: tag, icon: <Tag className="w-4 h-4" /> })));
    
    // Add resource type suggestions
    const matchingTypes = availableResourceTypes.filter(type =>
      type.name.toLowerCase().includes(inputValue.toLowerCase()) && !filters.resourceTypes.includes(type.id)
    ).slice(0, 2);
    
    suggestions.push(...matchingTypes.map(type => ({ 
      type: 'resourceType', 
      value: type.name, 
      id: type.id,
      icon: getResourceTypeIcon(type.id)
    })));
    
    return suggestions;
  }, [inputValue, availableTags, availableResourceTypes, filters.tags, filters.resourceTypes, recentSearches]);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.query) count++;
    if (filters.resourceTypes.length > 0) count++;
    if (filters.status !== 'all') count++;
    if (filters.availability !== 'all') count++;
    if (filters.tags.length > 0) count++;
    if (filters.hasContact !== 'all') count++;
    if (filters.createdDateRange.start || filters.createdDateRange.end) count++;
    if (filters.isDeletable !== 'all') count++;
    return count;
  }, [filters]);

  // Helper functions
  const getResourceTypeIcon = (typeId: string) => {
    const iconMap = {
      'team-staff': <User className="w-4 h-4" />,
      'equipment': <Wrench className="w-4 h-4" />,
      'consumables': <Package className="w-4 h-4" />,
      'assets': <Building className="w-4 h-4" />,
      'partners': <Handshake className="w-4 h-4" />
    };
    return iconMap[typeId as keyof typeof iconMap] || <Package className="w-4 h-4" />;
  };

  const updateFilters = useCallback((updates: Partial<ResourceSearchFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  }, [filters, onFiltersChange]);

  const toggleArrayFilter = useCallback((array: string[], value: string) => {
    return array.includes(value)
      ? array.filter(item => item !== value)
      : [...array, value];
  }, []);

  // Event handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: any) => {
    if (suggestion.type === 'tag') {
      updateFilters({ tags: [...filters.tags, suggestion.value] });
    } else if (suggestion.type === 'resourceType') {
      updateFilters({ resourceTypes: [...filters.resourceTypes, suggestion.id] });
    } else {
      setInputValue(suggestion);
      updateFilters({ query: suggestion });
    }
    setShowSuggestions(false);
  };

  const handleClearAll = () => {
    const clearedFilters: ResourceSearchFilters = {
      query: '',
      resourceTypes: [],
      status: 'all',
      availability: 'all',
      tags: [],
      hasContact: 'all',
      createdDateRange: { start: null, end: null },
      isDeletable: 'all'
    };
    setInputValue('');
    onFiltersChange(clearedFilters);
    onClearAll?.();
  };

  const handleSaveSearch = () => {
    if (saveSearchName.trim()) {
      const newSearch: SavedSearch = {
        id: Date.now().toString(),
        name: saveSearchName.trim(),
        filters: { ...filters },
        isFavorite: false,
        createdAt: new Date()
      };
      setSavedSearches(prev => [newSearch, ...prev]);
      onSaveSearch?.(saveSearchName.trim(), filters);
      setShowSaveDialog(false);
      setSaveSearchName('');
    }
  };

  const handleSortChange = (field: ResourceSearchSort['field']) => {
    if (sort.field === field) {
      onSortChange({
        field,
        direction: sort.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      onSortChange({ field, direction: 'asc' });
    }
  };

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
            style={{ color: colors.utility.secondaryText }} />
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all"
            style={{
              backgroundColor: colors.utility.primaryBackground,
              borderColor: colors.utility.secondaryText + '40',
              color: colors.utility.primaryText,
              '--tw-ring-color': colors.brand.primary
            } as React.CSSProperties}
          />
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={handleClearAll}
            className="p-2 rounded-lg transition-all hover:scale-105 duration-200"
            style={{
              backgroundColor: colors.semantic.error + '20',
              color: colors.semantic.error
            }}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={`relative ${className}`}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
          style={{ color: colors.utility.secondaryText }} />
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all"
          style={{
            backgroundColor: colors.utility.primaryBackground,
            borderColor: colors.utility.secondaryText + '40',
            color: colors.utility.primaryText,
            '--tw-ring-color': colors.brand.primary
          } as React.CSSProperties}
        />
      </div>
    );
  }

  // Default variant
  return (
    <div className={`space-y-4 ${className}`}>
      
      {/* Main Search Bar */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
            style={{ color: colors.utility.secondaryText }} />
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            placeholder={placeholder}
            className="w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all"
            style={{
              backgroundColor: colors.utility.primaryBackground,
              borderColor: colors.utility.secondaryText + '40',
              color: colors.utility.primaryText,
              '--tw-ring-color': colors.brand.primary
            } as React.CSSProperties}
          />
          
          {/* Clear search */}
          {inputValue && (
            <button
              onClick={() => {
                setInputValue('');
                updateFilters({ query: '' });
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded hover:opacity-80"
              style={{ color: colors.utility.secondaryText }}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Suggestions */}
        {showSuggestions && searchSuggestions.length > 0 && (
          <div 
            className="absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-lg z-10 max-h-60 overflow-y-auto"
            style={{
              backgroundColor: colors.utility.primaryBackground,
              borderColor: colors.utility.secondaryText + '20'
            }}
          >
            {searchSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 text-left hover:opacity-80 transition-all flex items-center gap-3"
                style={{ color: colors.utility.primaryText }}
              >
                {suggestion.icon}
                <span className="flex-1">{suggestion.value}</span>
                <span className="text-xs" style={{ color: colors.utility.secondaryText }}>
                  {suggestion.type}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          
          {/* Filter Toggle */}
          {showFilters && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all border hover:scale-105 duration-200"
              style={{
                borderColor: isExpanded ? colors.brand.primary : colors.utility.secondaryText + '40',
                color: isExpanded ? colors.brand.primary : colors.utility.secondaryText,
                backgroundColor: isExpanded ? colors.brand.primary + '10' : 'transparent'
              }}
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span
                  className="px-2 py-1 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: colors.semantic.warning,
                    color: 'white'
                  }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>
          )}

          {/* Results Count */}
          <div className="text-sm" style={{ color: colors.utility.secondaryText }}>
            {isLoading ? (
              'Searching...'
            ) : (
              <>
                {resultsCount} result{resultsCount !== 1 ? 's' : ''}
                {totalCount && totalCount !== resultsCount && ` of ${totalCount}`}
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          
          {/* Sort Dropdown */}
          {showSort && (
            <div className="relative">
              <select
                value={`${sort.field}-${sort.direction}`}
                onChange={(e) => {
                  const [field, direction] = e.target.value.split('-') as [ResourceSearchSort['field'], 'asc' | 'desc'];
                  onSortChange({ field, direction });
                }}
                className="appearance-none px-4 py-2 pr-8 rounded-lg border transition-all focus:outline-none focus:ring-2 text-sm"
                style={{
                  backgroundColor: colors.utility.primaryBackground,
                  borderColor: colors.utility.secondaryText + '40',
                  color: colors.utility.primaryText,
                  '--tw-ring-color': colors.brand.primary
                } as React.CSSProperties}
              >
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="display_name-asc">Display Name A-Z</option>
                <option value="display_name-desc">Display Name Z-A</option>
                <option value="created_at-desc">Newest First</option>
                <option value="created_at-asc">Oldest First</option>
                <option value="resource_type-asc">Type A-Z</option>
                <option value="sequence_no-asc">Sequence</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                {sort.direction === 'asc' ? (
                  <SortAsc className="w-4 h-4" style={{ color: colors.utility.secondaryText }} />
                ) : (
                  <SortDesc className="w-4 h-4" style={{ color: colors.utility.secondaryText }} />
                )}
              </div>
            </div>
          )}

          {/* Save Search */}
          {showSavedSearches && activeFilterCount > 0 && (
            <button
              onClick={() => setShowSaveDialog(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:scale-105 duration-200 text-sm"
              style={{
                backgroundColor: colors.brand.primary + '20',
                color: colors.brand.primary
              }}
            >
              <Bookmark className="w-4 h-4" />
              Save Search
            </button>
          )}

          {/* Clear All */}
          {activeFilterCount > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all hover:scale-105 duration-200 text-sm"
              style={{
                backgroundColor: colors.semantic.error + '10',
                color: colors.semantic.error
              }}
            >
              <RotateCcw className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Quick Filters */}
      {showQuickFilters && (
        <div className="flex flex-wrap gap-2">
          {/* Resource Type Quick Filters */}
          {availableResourceTypes.slice(0, 3).map(type => (
            <button
              key={type.id}
              onClick={() => updateFilters({ 
                resourceTypes: toggleArrayFilter(filters.resourceTypes, type.id) 
              })}
              className="flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-all hover:scale-105 duration-200"
              style={{
                backgroundColor: filters.resourceTypes.includes(type.id) 
                  ? colors.brand.primary + '20' 
                  : colors.utility.secondaryText + '10',
                color: filters.resourceTypes.includes(type.id) 
                  ? colors.brand.primary 
                  : colors.utility.secondaryText
              }}
            >
              {getResourceTypeIcon(type.id)}
              {type.name}
            </button>
          ))}

          {/* Status Quick Filters */}
          <button
            onClick={() => updateFilters({ 
              status: filters.status === 'active' ? 'all' : 'active'
            })}
            className="flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-all hover:scale-105 duration-200"
            style={{
              backgroundColor: filters.status === 'active' 
                ? colors.semantic.success + '20' 
                : colors.utility.secondaryText + '10',
              color: filters.status === 'active' 
                ? colors.semantic.success 
                : colors.utility.secondaryText
            }}
          >
            <Eye className="w-3 h-3" />
            Active Only
          </button>
        </div>
      )}

      {/* Advanced Filters Panel */}
      {isExpanded && showFilters && (
        <div 
          className="p-6 rounded-lg border"
          style={{
            backgroundColor: colors.utility.primaryBackground,
            borderColor: colors.utility.secondaryText + '20'
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Resource Types */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: colors.utility.primaryText }}>
                Resource Types
              </label>
              <div className="space-y-2">
                {availableResourceTypes.map(type => (
                  <label key={type.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.resourceTypes.includes(type.id)}
                      onChange={(e) => {
                        const newTypes = e.target.checked
                          ? [...filters.resourceTypes, type.id]
                          : filters.resourceTypes.filter(t => t !== type.id);
                        updateFilters({ resourceTypes: newTypes });
                      }}
                      className="rounded"
                    />
                    <div className="flex items-center gap-2">
                      {getResourceTypeIcon(type.id)}
                      <span className="text-sm" style={{ color: colors.utility.primaryText }}>
                        {type.name}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Status Filters */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: colors.utility.primaryText }}>
                Status & Availability
              </label>
              <div className="space-y-3">
                <select
                  value={filters.status}
                  onChange={(e) => updateFilters({ status: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
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

                <select
                  value={filters.hasContact}
                  onChange={(e) => updateFilters({ hasContact: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  style={{
                    backgroundColor: colors.utility.primaryBackground,
                    borderColor: colors.utility.secondaryText + '40',
                    color: colors.utility.primaryText
                  }}
                >
                  <option value="all">All Resources</option>
                  <option value="with-contact">With Contact Info</option>
                  <option value="without-contact">No Contact Info</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-3" style={{ color: colors.utility.primaryText }}>
                Tags
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {availableTags.slice(0, 10).map(tag => (
                  <label key={tag} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.tags.includes(tag)}
                      onChange={(e) => {
                        const newTags = e.target.checked
                          ? [...filters.tags, tag]
                          : filters.tags.filter(t => t !== tag);
                        updateFilters({ tags: newTags });
                      }}
                      className="rounded"
                    />
                    <span className="text-sm" style={{ color: colors.utility.primaryText }}>
                      {tag}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Search Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div 
            className="bg-white rounded-lg p-6 w-96 max-w-full mx-4"
            style={{ backgroundColor: colors.utility.primaryBackground }}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: colors.utility.primaryText }}>
              Save Search
            </h3>
            <input
              type="text"
              value={saveSearchName}
              onChange={(e) => setSaveSearchName(e.target.value)}
              placeholder="Enter search name..."
              className="w-full px-3 py-2 border rounded-lg mb-4"
              style={{
                backgroundColor: colors.utility.primaryBackground,
                borderColor: colors.utility.secondaryText + '40',
                color: colors.utility.primaryText
              }}
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowSaveDialog(false)}
                className="flex-1 px-4 py-2 border rounded-lg"
                style={{
                  borderColor: colors.utility.secondaryText + '40',
                  color: colors.utility.secondaryText
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSearch}
                disabled={!saveSearchName.trim()}
                className="flex-1 px-4 py-2 rounded-lg text-white disabled:opacity-50"
                style={{ backgroundColor: colors.brand.primary }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceSearch;