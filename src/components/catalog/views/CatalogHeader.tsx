// src/components/catalog/CatalogHeader.tsx
import React, { useState } from 'react';
import { Search, Plus, Grid, List, Filter, X } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
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
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
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
    <div 
      className="shadow-sm border-b transition-colors"
      style={{
        backgroundColor: colors.utility.secondaryBackground,
        borderColor: `${colors.utility.secondaryText}40`
      }}
    >
      <div className="container mx-auto px-4 py-4">
        {/* Top row */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 
              className="text-2xl font-bold transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              {title}
            </h1>
            {itemCount !== undefined && (
              <p 
                className="text-sm mt-1 transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                {itemCount} {itemCount === 1 ? 'item' : 'items'} total
              </p>
            )}
          </div>
          
          {/* Fixed width button */}
          <button
            onClick={onAddNew}
            className="hidden lg:inline-flex items-center justify-center min-w-[140px] px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white hover:opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`,
              '--tw-ring-color': colors.brand.primary
            } as React.CSSProperties}
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
              <Search 
                className="h-5 w-5 transition-colors"
                style={{ color: colors.utility.secondaryText }}
              />
            </div>
            <input
              type="text"
              value={localSearchValue}
              onChange={handleSearchChange}
              placeholder="Search catalog items..."
              className="block w-full pl-10 pr-10 py-2 border rounded-md leading-5 focus:outline-none focus:ring-2 transition-colors"
              style={{
                borderColor: `${colors.utility.secondaryText}40`,
                backgroundColor: colors.utility.secondaryBackground,
                color: colors.utility.primaryText,
                '--tw-ring-color': colors.brand.primary
              } as React.CSSProperties}
            />
            {localSearchValue && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:opacity-80 transition-colors"
              >
                <X 
                  className="h-5 w-5 transition-colors"
                  style={{ color: colors.utility.secondaryText }}
                />
              </button>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            {/* Filter toggle */}
            <button
              onClick={onFilterToggle}
              className="inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium transition-colors"
              style={{
                borderColor: showFilters ? `${colors.brand.primary}` : `${colors.utility.secondaryText}40`,
                color: showFilters ? colors.brand.primary : colors.utility.primaryText,
                backgroundColor: showFilters ? `${colors.brand.primary}10` : colors.utility.secondaryBackground
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>

            {/* View mode toggle */}
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                onClick={() => onViewModeChange('grid')}
                className="px-3 py-2 text-sm font-medium rounded-l-md border transition-colors"
                style={{
                  backgroundColor: viewMode === 'grid' ? colors.brand.primary : colors.utility.secondaryBackground,
                  color: viewMode === 'grid' ? '#ffffff' : colors.utility.primaryText,
                  borderColor: viewMode === 'grid' ? colors.brand.primary : `${colors.utility.secondaryText}40`
                }}
                aria-label="Grid view"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className="px-3 py-2 text-sm font-medium rounded-r-md border-t border-r border-b transition-colors"
                style={{
                  backgroundColor: viewMode === 'list' ? colors.brand.primary : colors.utility.secondaryBackground,
                  color: viewMode === 'list' ? '#ffffff' : colors.utility.primaryText,
                  borderColor: viewMode === 'list' ? colors.brand.primary : `${colors.utility.secondaryText}40`
                }}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Mobile add button */}
            <button
              onClick={onAddNew}
              className="lg:hidden inline-flex items-center px-3 py-2 text-sm font-medium rounded-md text-white hover:opacity-90 transition-colors"
              style={{
                background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
              }}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Active filters display */}
        {showFilters && (
          <div className="mt-3 flex items-center space-x-2">
            <span 
              className="text-sm transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              Active filters:
            </span>
            {/* Add filter badges here when filters are implemented */}
            <span 
              className="text-sm italic transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              None
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogHeader;