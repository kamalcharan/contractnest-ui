// src/components/catalog/CatalogHeader.tsx
import React, { useState } from 'react';
import { Search, Plus, Grid, List, Filter, X } from 'lucide-react';
import { CATALOG_TYPE_LABELS } from '../../utils/constants/catalog';
import type { CatalogItemType } from '../../types/catalogTypes';

interface CatalogHeaderProps {
  title: string;
  itemCount?: number;
  onSearch: (query: string) => void;
  searchValue: string;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  viewMode: 'grid' | 'list';
  onFilterToggle: () => void;
  showFilters: boolean;
  onAddNew: () => void;
}

export const CatalogHeader: React.FC<CatalogHeaderProps> = ({
  title,
  itemCount,
  onSearch,
  searchValue,
  onViewModeChange,
  viewMode,
  onFilterToggle,
  showFilters,
  onAddNew
}) => {
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchValue(value);
    // Debounced search is handled in the hook
    onSearch(value);
  };

  const handleClearSearch = () => {
    setLocalSearchValue('');
    onSearch('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4">
        {/* Top row */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
            {itemCount !== undefined && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} total
              </p>
            )}
          </div>
          
          {/* Fixed width button */}
          <button
            onClick={onAddNew}
            className="hidden lg:inline-flex items-center justify-center min-w-[140px] px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>Add New</span>
          </button>
        </div>

        {/* Search and controls row */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search bar */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={localSearchValue}
              onChange={handleSearchChange}
              placeholder="Search catalog items..."
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white"
            />
            {localSearchValue && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
              </button>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            {/* Filter toggle */}
            <button
              onClick={onFilterToggle}
              className={`
                inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium transition-colors
                ${showFilters
                  ? 'border-indigo-500 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400'
                  : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }
              `}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>

            {/* View mode toggle */}
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`
                  px-3 py-2 text-sm font-medium rounded-l-md border transition-colors
                  ${viewMode === 'grid'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
                  }
                `}
                aria-label="Grid view"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`
                  px-3 py-2 text-sm font-medium rounded-r-md border-t border-r border-b transition-colors
                  ${viewMode === 'list'
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
                  }
                `}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Mobile add button */}
            <button
              onClick={onAddNew}
              className="lg:hidden inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Active filters display */}
        {showFilters && (
          <div className="mt-3 flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Active filters:</span>
            {/* Add filter badges here when filters are implemented */}
            <span className="text-sm text-gray-400 dark:text-gray-500 italic">None</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogHeader;