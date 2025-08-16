// src/components/catalog/shared/CatalogContainer.tsx
// ✅ FIXED: Proper detached table layout + HTML parsing

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';
import {
  Plus, 
  Search, 
  Upload,
  Download,
  Grid3X3,
  List,
  Loader2,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  FileText,
  RefreshCw
} from 'lucide-react';
import { useCatalogList, useDeleteCatalogItem, useCatalogOperations } from '../../../hooks/queries/useCatalogQueries';
import { catalogTypeToApi } from '../../../utils/constants/catalog';
import ConfirmationDialog from '../../ui/ConfirmationDialog';
import type { 
  CatalogItemDetailed, 
  CatalogItemType,
  CatalogListParams
} from '../../../types/catalogTypes';

type ActiveTab = 'status';
type ViewType = 'grid' | 'list';

const MINIMUM_SEARCH_LENGTH = 3;
const ITEMS_PER_PAGE = 20;

interface CatalogContainerProps {
  catalogType: CatalogItemType;
}

const CatalogContainer: React.FC<CatalogContainerProps> = ({ catalogType }) => {
  const navigate = useNavigate();
  const { isDarkMode, currentTheme } = useTheme();
  
  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  // Stable route mapping function
  const getCatalogRoute = useCallback((type: CatalogItemType): string => {
    const routeMap: Record<CatalogItemType, string> = {
      'service': 'services',
      'equipment': 'equipments', 
      'asset': 'assets',
      'spare_part': 'spare-parts'
    };
    return routeMap[type] || 'services';
  }, []);
  
  // State management
  const [activeTab, setActiveTab] = useState<ActiveTab>('status');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewType, setViewType] = useState<ViewType>('list');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Delete confirmation dialog state
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    itemId: string;
    itemName: string;
  }>({
    isOpen: false,
    itemId: '',
    itemName: ''
  });
  
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Debounce search effect
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (searchTerm.length === 0 || searchTerm.length >= MINIMUM_SEARCH_LENGTH) {
        setDebouncedSearchTerm(searchTerm);
        setCurrentPage(1);
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

  // API filters with working status filtering
  const apiFilters: CatalogListParams & { statusFilter?: string } = useMemo(() => {
    const mappedCatalogType = catalogTypeToApi(catalogType);
    
    return {
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: debouncedSearchTerm.trim() || undefined,
      catalogType: mappedCatalogType,
      includeInactive: activeFilter !== 'active',
      sortBy: sortBy as any,
      sortOrder: sortOrder,
      statusFilter: activeFilter,
    };
  }, [currentPage, debouncedSearchTerm, catalogType, sortBy, sortOrder, activeFilter]);

  // TanStack Query hook
  const { 
    data: queryResult, 
    isLoading, 
    error, 
    isError,
    refetch 
  } = useCatalogList(apiFilters);

  // Extract data
  const items = queryResult?.data || [];
  const pagination = queryResult?.pagination || {
    page: 1,
    limit: ITEMS_PER_PAGE,
    total: 0,
    totalPages: 0
  };

  // Mutations
  const deleteMutation = useDeleteCatalogItem();
  const { refreshCatalogList } = useCatalogOperations();

  // Event handlers with proper routing
  const handleFilterChange = useCallback((newFilter: string) => {
    setActiveFilter(newFilter);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleAddNew = useCallback(() => {
    const targetUrl = `/catalog/${getCatalogRoute(catalogType)}/add`;
    navigate(targetUrl);
  }, [catalogType, getCatalogRoute, navigate]);

  // ✅ FIXED: View handler
  const handleView = useCallback((itemId: string) => {
    const targetUrl = `/catalog/${getCatalogRoute(catalogType)}/${itemId}`;
    console.log('🔍 Navigating to view:', targetUrl);
    navigate(targetUrl);
  }, [catalogType, getCatalogRoute, navigate]);

  // ✅ FIXED: Edit handler
  const handleEdit = useCallback((itemId: string) => {
    const targetUrl = `/catalog/${getCatalogRoute(catalogType)}/${itemId}/edit`;
    console.log('✏️ Navigating to edit:', targetUrl);
    navigate(targetUrl);
  }, [catalogType, getCatalogRoute, navigate]);

  const handleDeleteClick = useCallback((item: CatalogItemDetailed) => {
    setDeleteDialog({
      isOpen: true,
      itemId: item.id,
      itemName: item.name
    });
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    try {
      await deleteMutation.mutateAsync(deleteDialog.itemId);
      setDeleteDialog({ isOpen: false, itemId: '', itemName: '' });
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }, [deleteMutation, deleteDialog.itemId]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialog({ isOpen: false, itemId: '', itemName: '' });
  }, []);

  const handleRefresh = useCallback(() => {
    refreshCatalogList(apiFilters);
  }, [refreshCatalogList, apiFilters]);

  // ✅ FIXED: Helper functions
  const shouldShowSearchHint = useCallback(() => {
    return searchTerm.length > 0 && searchTerm.length < MINIMUM_SEARCH_LENGTH;
  }, [searchTerm]);

  const formatPrice = useCallback((item: CatalogItemDetailed) => {
    if (item.price_attributes) {
      return `${item.price_attributes.currency} ${item.price_attributes.base_amount?.toLocaleString()}`;
    }
    return 'N/A';
  }, []);

  // ✅ FIXED: Parse HTML content for clean display
  const parseHtmlContent = useCallback((htmlContent: string) => {
    if (!htmlContent) return 'No description';
    
    // Strip HTML tags and get plain text
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    
    // Return first 60 characters for table display
    return plainText.length > 60 ? plainText.substring(0, 60) + '...' : plainText;
  }, []);

  const getStatusBadge = useCallback((item: CatalogItemDetailed) => {
    const isActive = item.status === 'active' || item.is_active === true;
    return (
      <span 
        className="px-2 py-1 rounded-full text-xs font-medium border"
        style={
          isActive 
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
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  }, [colors]);

  // Tab configurations with dynamic counts based on filtered data
  const tabConfigs = useMemo(() => {
    const activeCount = items.filter(item => item.status === 'active' || item.is_active === true).length;
    const inactiveCount = items.filter(item => item.status === 'inactive' || item.is_active === false).length;
    
    return {
      status: {
        label: 'STATUS',
        filters: [
          { id: 'all', label: 'All', count: pagination.total },
          { id: 'active', label: 'Active', count: activeCount },
          { id: 'inactive', label: 'Inactive', count: inactiveCount },
        ]
      }
    };
  }, [items, pagination.total]);

  const currentFilters = tabConfigs[activeTab].filters;

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
          
          {/* Refresh Button */}
          <button 
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center px-3 py-2 rounded-md hover:opacity-80 transition-all text-sm border disabled:opacity-50"
            style={{
              borderColor: colors.brand.primary,
              color: colors.brand.primary,
              backgroundColor: 'transparent'
            }}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          
          {/* New Item Button */}
          <button 
            onClick={handleAddNew}
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

      {/* Tab Layout */}
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
                className="pb-3 font-medium text-sm transition-colors relative"
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

        {/* Sub Filters & Search */}
        <div className="p-4 space-y-3">
          {/* Sub-filter Pills */}
          <div className="flex flex-wrap gap-2">
            {currentFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => handleFilterChange(filter.id)}
                className="px-3 py-1.5 rounded-full text-sm transition-all"
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
                {filter.label} ({filter.count})
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
                    viewType === 'grid' ? 'shadow-sm' : ''
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
                    viewType === 'list' ? 'shadow-sm' : ''
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
                {pagination.total} results
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
              {isLoading 
                ? `Searching for "${debouncedSearchTerm}"...`
                : `Showing results for "${debouncedSearchTerm}" (${pagination.total} found)`
              }
            </div>
          )}
        </div>
      </div>

      {/* Error State */}
      {isError && (
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
                {error?.message || 'An unexpected error occurred'}
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
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 
            className="h-8 w-8 animate-spin"
            style={{ color: colors.brand.primary }}
          />
          <span 
            className="ml-3 text-lg"
            style={{ color: colors.utility.secondaryText }}
          >
            Loading {catalogType}...
          </span>
        </div>
      )}

      {/* CONTENT LAYOUT */}
      {!isLoading && !isError && (
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
                onClick={handleAddNew}
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
              {/* ✅ FIXED: PROPER DETACHED TABLE LAYOUT */}
              {viewType === 'list' ? (
                <div className="space-y-4">
                  {/* ✅ DETACHED TABLE HEADER */}
                  <div 
                    className="rounded-lg shadow-sm border-2 transition-colors"
                    style={{
                      backgroundColor: colors.utility.secondaryBackground,
                      borderColor: colors.brand.primary + '30'
                    }}
                  >
                    <div 
                      className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-semibold border-b-2"
                      style={{
                        backgroundColor: `${colors.brand.primary}10`,
                        borderColor: colors.brand.primary + '20',
                        color: colors.utility.primaryText
                      }}
                    >
                      <div className="col-span-4">Name</div>
                      <div className="col-span-2">Type</div>
                      <div className="col-span-2">Price</div>
                      <div className="col-span-1">Status</div>
                      <div className="col-span-1">Version</div>
                      <div className="col-span-2 text-center">Actions</div>
                    </div>
                  </div>

                  {/* ✅ DETACHED DATA ROWS */}
                  <div className="space-y-2">
                    {items.map((item, index) => (
                      <div 
                        key={item.id}
                        className="rounded-lg shadow-sm border transition-all hover:shadow-md hover:border-opacity-60"
                        style={{
                          backgroundColor: colors.utility.secondaryBackground,
                          borderColor: `${colors.utility.primaryText}20`
                        }}
                      >
                        <div 
                          className="grid grid-cols-12 gap-4 px-6 py-4 text-sm items-center"
                          style={{ color: colors.utility.primaryText }}
                        >
                          {/* Name Column */}
                          <div className="col-span-4 flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 border-2"
                              style={{
                                backgroundColor: `${colors.brand.primary}15`,
                                color: colors.brand.primary,
                                borderColor: `${colors.brand.primary}40`
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
                              <p 
                                className="text-sm truncate mt-1"
                                style={{ color: colors.utility.secondaryText }}
                              >
                                {/* ✅ FIXED: Parse HTML content properly */}
                                {parseHtmlContent(item.short_description || item.description_content || '')}
                              </p>
                            </div>
                          </div>

                          {/* Type Column */}
                          <div className="col-span-2">
                            <span 
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border"
                              style={{
                                backgroundColor: `${colors.utility.primaryText}10`,
                                color: colors.utility.primaryText,
                                borderColor: `${colors.utility.primaryText}30`
                              }}
                            >
                              {catalogType.charAt(0).toUpperCase() + catalogType.slice(1)}
                            </span>
                          </div>

                          {/* Price Column */}
                          <div className="col-span-2">
                            <span 
                              className="font-semibold text-base"
                              style={{ color: colors.utility.primaryText }}
                            >
                              {formatPrice(item)}
                            </span>
                          </div>

                          {/* Status Column */}
                          <div className="col-span-1">
                            {getStatusBadge(item)}
                          </div>

                          {/* Version Column */}
                          <div className="col-span-1">
                            <span 
                              className="text-sm font-medium"
                              style={{ color: colors.utility.secondaryText }}
                            >
                              v{item.version_number || 1}
                            </span>
                          </div>

                          {/* ✅ Actions Column - Fixed routing */}
                          <div className="col-span-2 flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleView(item.id)}
                              className="p-2 rounded-lg transition-all hover:shadow-sm"
                              style={{
                                backgroundColor: `${colors.utility.primaryText}15`,
                                color: colors.utility.primaryText
                              }}
                              title="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleEdit(item.id)}
                              className="p-2 rounded-lg transition-all hover:shadow-sm text-white"
                              style={{
                                background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
                              }}
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(item)}
                              disabled={deleteMutation.isPending}
                              className="p-2 rounded-lg transition-all hover:shadow-sm disabled:opacity-50"
                              style={{
                                backgroundColor: `${colors.semantic.error}20`,
                                color: colors.semantic.error
                              }}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                // Grid View (unchanged)
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {items.map((item) => (
                    <div 
                      key={item.id} 
                      className="rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 p-4"
                      style={{
                        backgroundColor: colors.utility.secondaryBackground,
                        borderColor: `${colors.utility.primaryText}20`
                      }}
                    >
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
                        {getStatusBadge(item)}
                      </div>
                      
                      <div className="mb-3">
                        <p 
                          className="text-sm line-clamp-2"
                          style={{ color: colors.utility.secondaryText }}
                        >
                          {parseHtmlContent(item.short_description || item.description_content || '')}
                        </p>
                      </div>
                      
                      <div className="mb-3">
                        <span 
                          className="text-lg font-bold"
                          style={{ color: colors.utility.primaryText }}
                        >
                          {formatPrice(item)}
                        </span>
                      </div>
                      
                      <div 
                        className="flex items-center justify-between pt-2 border-t"
                        style={{ borderColor: `${colors.utility.primaryText}20` }}
                      >
                        <div className="flex gap-1">
                          <button 
                            onClick={() => handleView(item.id)}
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
                            onClick={() => handleEdit(item.id)}
                            className="p-1.5 rounded-md transition-all text-white"
                            style={{
                              background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
                            }}
                            title="Edit"
                          >
                            <Edit className="h-3 w-3" />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(item)}
                            disabled={deleteMutation.isPending}
                            className="p-1.5 rounded-md transition-all disabled:opacity-50"
                            style={{
                              backgroundColor: `${colors.semantic.error}20`,
                              color: colors.semantic.error
                            }}
                            title="Delete"
                          >
                            <Trash2 className="h-3 w-3" />
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
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
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
                              className="px-3 py-1 rounded-md text-sm font-medium transition-all"
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

      {/* DELETE CONFIRMATION DIALOG */}
      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Catalog Item"
        description={
          <div>
            <p>Are you sure you want to delete "{deleteDialog.itemName}"?</p>
            <p className="mt-2 text-sm opacity-80">This action cannot be undone.</p>
          </div>
        }
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        icon={<Trash2 className="h-6 w-6" />}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default CatalogContainer;