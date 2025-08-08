// src/components/catalog/shared/CatalogEmpty.tsx
import React from 'react';
import { Plus, Package, Wrench, Box, FileText, Settings } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  CATALOG_ITEM_TYPES,
  CATALOG_TYPE_LABELS,
  CATALOG_TYPE_DESCRIPTIONS
} from '../../../utils/constants/catalog';
import type { CatalogItemType } from '../../../types/catalogTypes';

interface CatalogEmptyProps {
  catalogType: CatalogItemType;
  hasFilters: boolean;
  onClearFilters: () => void;
  onAddNew: () => void;
}

const CatalogEmpty: React.FC<CatalogEmptyProps> = ({ 
  catalogType, 
  hasFilters,
  onClearFilters,
  onAddNew 
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  
  // Get theme colors - EXACT same pattern as LoginPage
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // Icon mapping
  const iconMap = {
    [CATALOG_ITEM_TYPES.SERVICE]: Package,
    [CATALOG_ITEM_TYPES.EQUIPMENT]: Settings,
    [CATALOG_ITEM_TYPES.SPARE_PART]: Wrench,
    [CATALOG_ITEM_TYPES.ASSET]: Box
  };
  
  const Icon = iconMap[catalogType] || Package;
  const label = CATALOG_TYPE_LABELS[catalogType] || 'Items';

  const getEmptyMessage = () => {
    if (hasFilters) {
      return "No items match your current filters.";
    }
    
    switch (catalogType) {
      case CATALOG_ITEM_TYPES.SERVICE:
        return "Start by adding services your business offers.";
      case CATALOG_ITEM_TYPES.ASSET:
        return "Add assets that can be rented or leased.";
      case CATALOG_ITEM_TYPES.SPARE_PART:
        return "Add spare parts for inventory management.";
      case CATALOG_ITEM_TYPES.EQUIPMENT:
        return "Add equipment available for rent or use.";
      default:
        return "Start by adding your first catalog item.";
    }
  };

  const getSuggestions = () => {
    switch (catalogType) {
      case CATALOG_ITEM_TYPES.SERVICE:
        return [
          "Maintenance contracts",
          "Consulting services", 
          "Support packages",
          "Training programs"
        ];
      case CATALOG_ITEM_TYPES.ASSET:
        return [
          "Vehicles",
          "Real estate",
          "Machinery", 
          "IT equipment"
        ];
      case CATALOG_ITEM_TYPES.SPARE_PART:
        return [
          "Replacement parts",
          "Consumables",
          "Accessories",
          "Components"
        ];
      case CATALOG_ITEM_TYPES.EQUIPMENT:
        return [
          "Construction tools",
          "Medical devices",
          "Audio/Visual gear",
          "Industrial machinery"
        ];
      default:
        return [];
    }
  };

  return (
    <div 
      className="rounded-lg shadow-sm border transition-colors"
      style={{
        backgroundColor: colors.utility.secondaryBackground,
        borderColor: `${colors.utility.primaryText}20`
      }}
    >
      <div className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          {/* Icon */}
          <div 
            className="mx-auto h-24 w-24 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${colors.utility.primaryText}10` }}
          >
            <Icon 
              className="h-12 w-12"
              style={{ color: colors.utility.secondaryText }}
            />
          </div>
          
          {/* Title */}
          <h3 
            className="mt-6 text-lg font-medium"
            style={{ color: colors.utility.primaryText }}
          >
            {hasFilters ? `No ${label} Found` : `No ${label} Yet`}
          </h3>
          
          {/* Description */}
          <p 
            className="mt-2 text-sm max-w-md mx-auto"
            style={{ color: colors.utility.secondaryText }}
          >
            {getEmptyMessage()}
          </p>

          {/* Suggestions - only show if no filters */}
          {!hasFilters && getSuggestions().length > 0 && (
            <div className="mt-6">
              <p 
                className="text-xs mb-2"
                style={{ color: colors.utility.secondaryText }}
              >
                Common examples:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {getSuggestions().map((suggestion, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${colors.utility.primaryText}10`,
                      color: colors.utility.secondaryText
                    }}
                  >
                    {suggestion}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex flex-col items-center space-y-3">
            {hasFilters ? (
              <>
                <button
                  onClick={onClearFilters}
                  className="inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md hover:opacity-80 transition-all"
                  style={{
                    borderColor: `${colors.utility.primaryText}20`,
                    color: colors.utility.primaryText,
                    backgroundColor: 'transparent'
                  }}
                >
                  Clear Filters
                </button>
                <span 
                  className="text-sm"
                  style={{ color: colors.utility.secondaryText }}
                >
                  or
                </span>
              </>
            ) : null}
            
            <button
              onClick={onAddNew}
              className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md shadow-sm text-white hover:opacity-90 transition-all"
              style={{
                background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
              }}
            >
              <Plus className="h-5 w-5 mr-2 flex-shrink-0" />
              <span className="whitespace-nowrap">Add First {label.slice(0, -1)}</span>
            </button>
            
            {/* Secondary actions - only show if no filters */}
            {!hasFilters && (
              <div className="flex items-center space-x-4 text-sm">
                <button 
                  className="hover:opacity-80 transition-all"
                  style={{ color: colors.utility.secondaryText }}
                >
                  Import from CSV
                </button>
                <span style={{ color: `${colors.utility.primaryText}20` }}>•</span>
                <button 
                  className="hover:opacity-80 transition-all"
                  style={{ color: colors.utility.secondaryText }}
                >
                  View sample
                </button>
              </div>
            )}
          </div>

          {/* Help text - only show if no filters */}
          {!hasFilters && (
            <div 
              className="mt-12 rounded-lg p-4 max-w-lg mx-auto"
              style={{ backgroundColor: `${colors.utility.primaryText}05` }}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <FileText 
                    className="h-5 w-5"
                    style={{ color: colors.brand.primary }}
                  />
                </div>
                <div className="ml-3 text-left">
                  <h4 
                    className="text-sm font-medium"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Multi-currency support
                  </h4>
                  <p 
                    className="mt-1 text-sm"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    Set prices in multiple currencies for global business. Your first 3 contracts are free!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CatalogEmpty;