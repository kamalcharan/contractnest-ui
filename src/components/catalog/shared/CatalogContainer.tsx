// src/components/catalog/shared/CatalogContainer.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../contexts/ThemeContext';
import { useCatalogItems } from '../../../hooks/useCatalogItems';
import CatalogHeader from './CatalogHeader';
import CatalogFilters from './CatalogFilters';
import CatalogSearch from './CatalogSearch';
import CatalogViewToggle from './CatalogViewToggle';
import CatalogPagination from './CatalogPagination';
import CatalogEmpty from './CatalogEmpty';
import CatalogGridView from '../views/CatalogGridView';
import CatalogListView from '../views/CatalogListView';
import { 
  CATALOG_TYPE_LABELS,
  CATALOG_TYPE_DESCRIPTIONS,
  CATALOG_TYPE_COLORS
} from '../../../utils/constants/catalog';
import type { 
  CatalogItemDetailed, 
  CatalogItemType
} from '../../../types/catalogTypes';

interface CatalogContainerProps {
  catalogType: CatalogItemType;
}

const CatalogContainer: React.FC<CatalogContainerProps> = ({ catalogType }) => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  
  // Use the catalog items hook
  const {
    items,
    isLoading,
    error,
    pagination,
    refreshItems,
    deleteItem,
    setSearchQuery,
    setPage,
    currentFilters
  } = useCatalogItems();
  
  // UI State
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<any>({ status: 'active' });
  
  // Get catalog info
  const catalogInfo = {
    title: CATALOG_TYPE_LABELS[catalogType] || 'Catalog',
    description: CATALOG_TYPE_DESCRIPTIONS[catalogType] || '',
    color: CATALOG_TYPE_COLORS[catalogType] || 'gray'
  };
  
  // Filter items by catalog type
  const filteredItems = items.filter(item => item.type === catalogType);
  
  // Handle actions
  const handleAddNew = () => {
    navigate(`/catalog/${catalogType}/add`);
  };
  
  const handleEdit = (item: CatalogItemDetailed) => {
    navigate(`/catalog/${catalogType}/edit/${item.id}`);
  };
  
  const handleDelete = async (item: CatalogItemDetailed) => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"? This action can be undone.`)) {
      try {
        await deleteItem(item.id);
      } catch (error) {
        // Error is already handled in the hook
      }
    }
  };
  
  const handleToggleStatus = async (item: CatalogItemDetailed) => {
    // TODO: Implement toggle status
    console.log('Toggle status:', item);
    await refreshItems();
  };
  
  const handleClearFilters = () => {
    setFilters({ status: 'active', type: catalogType });
    setSearchQuery('');
  };
  
  const handleImport = () => {
    // TODO: Implement import functionality
    console.log('Import clicked');
  };
  
  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export clicked');
  };
  
  // Check if we have filters applied
  const hasFilters = !!currentFilters.search || (filters.status && filters.status !== 'active');
  
  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
    }`}>
      {/* Background Pattern */}
      <div className={`absolute inset-0 opacity-5 ${
        isDarkMode ? 'opacity-10' : 'opacity-5'
      }`} style={{
        backgroundImage: `
          linear-gradient(${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px),
          linear-gradient(90deg, ${isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px'
      }}></div>
      
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <CatalogHeader 
            catalogType={catalogType}
            catalogInfo={catalogInfo}
            onAddNew={handleAddNew}
            onImport={handleImport}
            onExport={handleExport}
          />
          
          {/* Controls Bar */}
          <div className="mt-8 space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <CatalogSearch 
                  value={currentFilters.search || ''}
                  onChange={setSearchQuery}
                  placeholder={`Search ${catalogInfo.title.toLowerCase()}...`}
                />
              </div>
              
              {/* Filters and View Toggle */}
              <div className="flex gap-4">
                <CatalogFilters 
                  filters={filters}
                  onChange={setFilters}
                  catalogType={catalogType}
                />
                <CatalogViewToggle 
                  viewMode={viewMode}
                  onChange={setViewMode}
                />
              </div>
            </div>
            
            {/* Results Count */}
            {!isLoading && !error && (
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {filteredItems.length === 0 ? (
                  hasFilters ? 'No items match your filters' : `No ${catalogInfo.title.toLowerCase()} added yet`
                ) : (
                  <>
                    Showing {filteredItems.length} of {pagination.total} {catalogInfo.title.toLowerCase()}
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* Content Area */}
          <div className="mt-6">
            {isLoading ? (
              // Loading state
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : error ? (
              // Error state
              <div className="text-center py-12">
                <p className={`text-lg ${isDarkMode ? 'text-red-400' : 'text-red-600'} mb-4`}>
                  {error}
                </p>
                <button
                  onClick={refreshItems}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : filteredItems.length === 0 ? (
              // Empty state
              <CatalogEmpty 
                catalogType={catalogType}
                hasFilters={hasFilters}
                onClearFilters={handleClearFilters}
                onAddNew={handleAddNew}
              />
            ) : (
              // Content
              <>
                {viewMode === 'grid' ? (
                  <CatalogGridView 
                    items={filteredItems}
                    catalogType={catalogType}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                  />
                ) : (
                  <CatalogListView 
                    items={filteredItems}
                    catalogType={catalogType}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                  />
                )}
                
                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8">
                    <CatalogPagination 
                      currentPage={pagination.page}
                      totalPages={pagination.totalPages}
                      onPageChange={setPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogContainer;