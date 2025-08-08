// src/components/catalog/shared/CatalogContainer.tsx
// ALTERNATIVE APPROACH: Copy the EXACT working ContactsPage pattern

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';
import {
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Building2,
  User,
  Mail,
  Phone,
  Eye,
  FileText,
  DollarSign,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Upload,
  Download,
  Grid3X3,
  List,
  Loader2,
  AlertCircle,
  Star,
  Edit,
  Trash2,
  CheckSquare,
  X,
  MessageSquare,
  Globe,
  Hash,
  Tag,
  UserCheck,
  UserX,
  Copy
} from 'lucide-react';
import { useCatalogList } from '../../../hooks/useCatalogItems';
import type { 
  CatalogItemDetailed, 
  CatalogItemType,
  CatalogListParams
} from '../../../types/catalogTypes';

type ActiveTab = 'status' | 'billing' | 'services';
type ViewType = 'grid' | 'list';

const MINIMUM_SEARCH_LENGTH = 3;

interface CatalogContainerProps {
  catalogType: CatalogItemType;
}

const CatalogContainer: React.FC<CatalogContainerProps> = ({ catalogType }) => {
  const navigate = useNavigate();
  const { isDarkMode, currentTheme } = useTheme();
  
  // Get theme colors - EXACT same pattern as LoginPage
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  // Add this function to map catalog types to routes
  const getCatalogRoute = (type: CatalogItemType): string => {
    const routeMap: Record<CatalogItemType, string> = {
      'service': 'services',
      'equipment': 'equipments', 
      'asset': 'assets',
      'spare_part': 'spare-parts'
    };
    return routeMap[type] || type;
  };
  
  // EXACT same state as ContactsPage
  const [activeTab, setActiveTab] = useState<ActiveTab>('status');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewType, setViewType] = useState<ViewType>('grid');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const itemsPerPage = 20;
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Helper to convert frontend type to API number
  function getCatalogTypeNumber(type: CatalogItemType): number {
    const typeMap: Record<CatalogItemType, number> = {
      'service': 1,
      'asset': 2,
      'spare_part': 3,
      'equipment': 4
    };
    return typeMap[type];
  }

  // EXACT debounce pattern from ContactsPage
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (searchTerm.length === 0 || searchTerm.length >= MINIMUM_SEARCH_LENGTH) {
        setDebouncedSearchTerm(searchTerm);
      } else {
        setDebouncedSearchTerm('');
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  // EXACT filter building pattern from ContactsPage
  const apiFilters: CatalogListParams = {
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearchTerm.trim() || undefined,
    catalogType: getCatalogTypeNumber(catalogType),
    includeInactive: false,
    sort_by: sortBy,
    sort_order: sortOrder,
  };

  // EXACT hook usage pattern from ContactsPage
  const { 
    data: items, 
    loading, 
    error, 
    pagination, 
    refetch,
    updateFilters 
  } = useCatalogList(apiFilters);

  // EXACT filter update pattern from ContactsPage
  useEffect(() => {
    const newFilters: CatalogListParams = {
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearchTerm.trim() || undefined,
      catalogType: getCatalogTypeNumber(catalogType),
      includeInactive: false,
      sort_by: sortBy,
      sort_order: sortOrder,
    };
    
    updateFilters(newFilters);
  }, [activeFilter, debouncedSearchTerm, currentPage, sortBy, sortOrder, updateFilters]);

  // EXACT page reset pattern from ContactsPage
  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) {
      setCurrentPage(1);
    }
  }, [debouncedSearchTerm]);

  // EXACT handlers from ContactsPage
  const handleFilterChange = (newFilter: string) => {
    setActiveFilter(newFilter);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // Helper function to check if search meets minimum criteria
  const shouldShowSearchHint = () => {
    return searchTerm.length > 0 && searchTerm.length < MINIMUM_SEARCH_LENGTH;
  };

  // Tab configurations adapted for catalog
  const tabConfigs = {
    status: {
      label: 'STATUS',
      filters: [
        { id: 'all', label: 'All', count: pagination?.total || 0 },
        { id: 'active', label: 'Active', count: 0 },
        { id: 'inactive', label: 'Inactive', count: 0 },
        { id: 'draft', label: 'Draft', count: 0 }
      ]
    }
  };

  const currentFilters = tabConfigs[activeTab].filters;

  // Loading skeleton component - Themed version
  const CatalogSkeleton = () => (
    <div className="animate-pulse">
      {viewType === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="p-4 rounded-lg border transition-colors"
              style={{
                backgroundColor: colors.utility.secondaryBackground,
                borderColor: `${colors.utility.primaryText}20`
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-8 h-8 rounded-lg"
                  style={{ backgroundColor: `${colors.utility.primaryText}20` }}
                ></div>
                <div className="flex-1">
                  <div 
                    className="h-4 rounded mb-2"
                    style={{ backgroundColor: `${colors.utility.primaryText}20` }}
                  ></div>
                  <div 
                    className="h-3 rounded w-2/3"
                    style={{ backgroundColor: `${colors.utility.primaryText}20` }}
                  ></div>
                </div>
              </div>
              <div className="space-y-2">
                <div 
                  className="h-3 rounded"
                  style={{ backgroundColor: `${colors.utility.primaryText}20` }}
                ></div>
                <div 
                  className="h-3 rounded w-3/4"
                  style={{ backgroundColor: `${colors.utility.primaryText}20` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className="p-3 rounded-lg border transition-colors"
              style={{
                backgroundColor: colors.utility.secondaryBackground,
                borderColor: `${colors.utility.primaryText}20`
              }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-lg"
                  style={{ backgroundColor: `${colors.utility.primaryText}20` }}
                ></div>
                <div className="flex-1">
                  <div 
                    className="h-4 rounded mb-2"
                    style={{ backgroundColor: `${colors.utility.primaryText}20` }}
                  ></div>
                  <div 
                    className="h-3 rounded w-1/2"
                    style={{ backgroundColor: `${colors.utility.primaryText}20` }}
                  ></div>
                </div>
                <div 
                  className="w-20 h-3 rounded"
                  style={{ backgroundColor: `${colors.utility.primaryText}20` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div 
      className="p-4 md:p-6 min-h-screen transition-colors"
      style={{ backgroundColor: colors.utility.primaryBackground }}
    >
      {/* Header - Themed */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <h1 
            className="text-2xl font-bold flex items-center gap-2 transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            {catalogType.charAt(0).toUpperCase() + catalogType.slice(1)} Catalog
          </h1>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Import/Export */}
          <div className="flex gap-2">
            <button 
              className="flex items-center px-3 py-2 rounded-md hover:opacity-80 transition-all text-sm border"
              style={{
                borderColor: colors.brand.primary,
                color: colors.brand.primary,
                backgroundColor: 'transparent'
              }}
            >
              <Upload className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Import</span>
            </button>
            <button 
              className="flex items-center px-3 py-2 rounded-md hover:opacity-80 transition-all text-sm border"
              style={{
                borderColor: colors.brand.primary,
                color: colors.brand.primary,
                backgroundColor: 'transparent'
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
          
          {/* New Item Button - Themed */}
          <button 
            onClick={() => {
              console.log('🔍 Button clicked!');
              console.log('🔍 catalogType:', catalogType);
              console.log('🔍 Target URL:', `/catalog/${getCatalogRoute(catalogType)}/add`);
              navigate(`/catalog/${getCatalogRoute(catalogType)}/add`);
            }}
            className="flex items-center px-4 py-2 rounded-md hover:opacity-90 transition-all text-white"
            style={{
              background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New {catalogType.charAt(0).toUpperCase() + catalogType.slice(1)}
          </button>
        </div>
      </div>

      {/* Tab Layout - Themed */}
      <div 
        className="rounded-lg shadow-sm border mb-6 transition-colors"
        style={{
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: `${colors.utility.primaryText}20`
        }}
      >
        {/* Main Tabs */}
        <div className="px-4 pt-4">
          <div 
            className="flex gap-6 border-b"
            style={{ borderColor: `${colors.utility.primaryText}20` }}
          >
            {Object.entries(tabConfigs).map(([key, config]) => (
              <button
                key={key}
                onClick={() => {
                  setActiveTab(key as ActiveTab);
                  setActiveFilter('all');
                  setCurrentPage(1);
                }}
                className={`pb-3 font-medium text-sm transition-colors relative ${
                  activeTab === key 
                    ? '' 
                    : ''
                }`}
                style={{
                  color: activeTab === key 
                    ? colors.utility.primaryText 
                    : colors.utility.secondaryText
                }}
              >
                {config.label}
                {activeTab === key && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ backgroundColor: colors.brand.primary }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Sub Filters & Search - Themed */}
        <div className="p-4 space-y-3">
          {/* Sub-filter Pills */}
          <div className="flex flex-wrap gap-2">
            {currentFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => handleFilterChange(filter.id)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all`}
                style={
                  activeFilter === filter.id 
                    ? {
                        background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`,
                        color: 'white'
                      }
                    : {
                        backgroundColor: `${colors.utility.primaryText}10`,
                        color: colors.utility.secondaryText
                      }
                }
              >
                {filter.label} {filter.count > 0 && `(${filter.count})`}
              </button>
            ))}
          </div>

          {/* Search Row */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                style={{ color: colors.utility.secondaryText }}
              />
              <input
                type="text"
                placeholder={`Search ${catalogType}... (min ${MINIMUM_SEARCH_LENGTH} characters)`}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors"
                style={{
                  backgroundColor: colors.utility.primaryBackground,
                  borderColor: `${colors.utility.primaryText}40`,
                  color: colors.utility.primaryText,
                  '--tw-ring-color': colors.brand.primary
                } as React.CSSProperties}
              />
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* View Toggle */}
              <div 
                className="flex rounded-lg p-0.5"
                style={{ backgroundColor: `${colors.utility.primaryText}10` }}
              >
                <button 
                  onClick={() => setViewType('grid')}
                  className={`p-1.5 rounded-md transition-all ${
                    viewType === 'grid' 
                      ? 'shadow-sm' 
                      : ''
                  }`}
                  style={
                    viewType === 'grid'
                      ? {
                          backgroundColor: colors.utility.primaryBackground,
                          color: colors.utility.primaryText
                        }
                      : {
                          color: colors.utility.secondaryText
                        }
                  }
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setViewType('list')}
                  className={`p-1.5 rounded-md transition-all ${
                    viewType === 'list' 
                      ? 'shadow-sm' 
                      : ''
                  }`}
                  style={
                    viewType === 'list'
                      ? {
                          backgroundColor: colors.utility.primaryBackground,
                          color: colors.utility.primaryText
                        }
                      : {
                          color: colors.utility.secondaryText
                        }
                  }
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              
              <span 
                className="text-sm whitespace-nowrap"
                style={{ color: colors.utility.secondaryText }}
              >
                {pagination?.total || 0} results
              </span>
            </div>
          </div>

          {/* Search Status Messages */}
          {shouldShowSearchHint() && (
            <div 
              className="text-sm p-2 rounded"
              style={{
                color: colors.utility.secondaryText,
                backgroundColor: `${colors.utility.primaryText}10`
              }}
            >
              💡 Type at least {MINIMUM_SEARCH_LENGTH} characters to search {catalogType}
            </div>
          )}

          {debouncedSearchTerm && (
            <div 
              className="text-sm"
              style={{ color: colors.utility.secondaryText }}
            >
              {loading 
                ? `Searching for "${debouncedSearchTerm}"...`
                : `Showing results for "${debouncedSearchTerm}" (${pagination?.total || 0} found)`
              }
            </div>
          )}
        </div>
      </div>

      {/* Error State - Themed */}
      {error && (
        <div 
          className="mb-6 p-4 rounded-lg border"
          style={{
            backgroundColor: `${colors.semantic.error}10`,
            borderColor: `${colors.semantic.error}20`
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
                Error loading {catalogType}
              </h3>
              <p 
                className="text-sm mt-1"
                style={{ color: `${colors.semantic.error}80` }}
              >
                {error}
              </p>
              <button 
                onClick={refetch}
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
      {loading && <CatalogSkeleton />}

      {/* Catalog List */}
      {!loading && !error && (
        <div>
          {items.length === 0 ? (
            <div 
              className="rounded-lg shadow-sm border p-12 text-center transition-colors"
              style={{
                backgroundColor: colors.utility.secondaryBackground,
                borderColor: `${colors.utility.primaryText}20`
              }}
            >
              <FileText 
                className="h-16 w-16 mx-auto mb-4"
                style={{ color: colors.utility.secondaryText }}
              />
              <h3 
                className="text-lg font-medium mb-2"
                style={{ color: colors.utility.primaryText }}
              >
                No {catalogType} found
              </h3>
              <p 
                className="mb-6"
                style={{ color: colors.utility.secondaryText }}
              >
                {searchTerm || shouldShowSearchHint()
                  ? shouldShowSearchHint()
                    ? `Type at least ${MINIMUM_SEARCH_LENGTH} characters to search ${catalogType}.`
                    : `No ${catalogType} match your search criteria. Try adjusting your search.`
                  : `You haven't added any ${catalogType} yet. Create your first ${catalogType} to get started.`
                }
              </p>
              <button 
                onClick={() => navigate(`/catalog/${getCatalogRoute(catalogType)}/add`)}
                className="flex items-center px-4 py-2 rounded-md hover:opacity-90 transition-all mx-auto text-white"
                style={{
                  background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                New {catalogType.charAt(0).toUpperCase() + catalogType.slice(1)}
              </button>
            </div>
          ) : (
            <>
              <div className={`
                ${viewType === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' 
                  : 'space-y-2'
                }
              `}>
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    className="rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 p-4"
                    style={{
                      backgroundColor: colors.utility.secondaryBackground,
                      borderColor: `${colors.utility.primaryText}20`
                    }}
                  >
                    {/* Item Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-semibold text-sm flex-shrink-0 border"
                          style={{
                            backgroundColor: `${colors.brand.primary}20`,
                            color: colors.brand.primary,
                            borderColor: `${colors.brand.primary}30`
                          }}
                        >
                          {item.name?.charAt(0)?.toUpperCase() || 'C'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 
                            className="font-semibold text-base truncate"
                            style={{ color: colors.utility.primaryText }}
                          >
                            {item.name}
                          </h3>
                        </div>
                      </div>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium border flex-shrink-0`}
                        style={
                          item.status === 'active' 
                            ? {
                                backgroundColor: `${colors.semantic.success}20`,
                                color: colors.semantic.success,
                                borderColor: `${colors.semantic.success}40`
                              }
                            : {
                                backgroundColor: `${colors.utility.primaryText}20`,
                                color: colors.utility.secondaryText,
                                borderColor: `${colors.utility.primaryText}40`
                              }
                        }
                      >
                        {item.status}
                      </span>
                    </div>
                    
                    {/* Description */}
                    <div className="mb-3">
                      <p 
                        className="text-sm line-clamp-2"
                        style={{ color: colors.utility.secondaryText }}
                      >
                        {item.short_description || 'No description available'}
                      </p>
                    </div>
                    
                    {/* Price */}
                    {item.price_attributes && (
                      <div className="mb-3">
                        <span 
                          className="text-lg font-bold"
                          style={{ color: colors.utility.primaryText }}
                        >
                          {item.price_attributes.currency} {item.price_attributes.base_amount?.toLocaleString()}
                        </span>
                        <span 
                          className="text-sm ml-1"
                          style={{ color: colors.utility.secondaryText }}
                        >
                          /{item.price_attributes.type}
                        </span>
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div 
                      className="flex items-center justify-between pt-2 border-t"
                      style={{ borderColor: `${colors.utility.primaryText}20` }}
                    >
                      <div className="flex gap-1">
                        <button 
                          onClick={() => navigate(`/catalog/${getCatalogRoute(catalogType)}/${item.id}`)}
                          className="p-1.5 rounded-md transition-all"
                          style={{
                            backgroundColor: `${colors.utility.primaryText}10`,
                            color: colors.utility.primaryText
                          }}
                          title="View details"
                        >
                          <Eye className="h-3 w-3" />
                        </button>
                        <button 
                          onClick={() => navigate(`/catalog/${getCatalogRoute(catalogType)}/${item.id}/edit`)}
                          className="p-1.5 rounded-md transition-all text-white"
                          style={{
                            background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
                          }}
                          title="Edit"
                        >
                          <Edit className="h-3 w-3" />
                        </button>
                      </div>
                      <div 
                        className="text-xs"
                        style={{ color: colors.utility.secondaryText }}
                      >
                        v{item.version_number || 1}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Enhanced Pagination - Themed */}
              {pagination && pagination.totalPages > 1 && (
                <div 
                  className="mt-6 rounded-lg shadow-sm border p-4 transition-colors"
                  style={{
                    backgroundColor: colors.utility.secondaryBackground,
                    borderColor: `${colors.utility.primaryText}20`
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div 
                      className="text-sm"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} {catalogType}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={pagination.page === 1}
                        className="p-2 rounded-md border hover:opacity-80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          borderColor: `${colors.utility.primaryText}20`,
                          color: colors.utility.primaryText,
                          backgroundColor: 'transparent'
                        }}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                          const page = i + 1;
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-1 rounded-md text-sm font-medium transition-all`}
                              style={
                                pagination.page === page 
                                  ? {
                                      background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`,
                                      color: 'white'
                                    }
                                  : {
                                      backgroundColor: 'transparent',
                                      color: colors.utility.primaryText
                                    }
                              }
                            >
                              {page}
                            </button>
                          );
                        })}
                      </div>
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                        disabled={pagination.page === pagination.totalPages}
                        className="p-2 rounded-md border hover:opacity-80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          borderColor: `${colors.utility.primaryText}20`,
                          color: colors.utility.primaryText,
                          backgroundColor: 'transparent'
                        }}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CatalogContainer;