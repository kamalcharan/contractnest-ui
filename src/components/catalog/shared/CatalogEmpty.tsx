// src/components/catalog/shared/CatalogEmpty.tsx
import React from 'react';
import { Plus, Package, Wrench, Box, FileText, Settings } from 'lucide-react';
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <Icon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
          </div>
          
          {/* Title */}
          <h3 className="mt-6 text-lg font-medium text-gray-900 dark:text-white">
            {hasFilters ? `No ${label} Found` : `No ${label} Yet`}
          </h3>
          
          {/* Description */}
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            {getEmptyMessage()}
          </p>

          {/* Suggestions - only show if no filters */}
          {!hasFilters && getSuggestions().length > 0 && (
            <div className="mt-6">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Common examples:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {getSuggestions().map((suggestion, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
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
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Clear Filters
                </button>
                <span className="text-sm text-gray-500 dark:text-gray-400">or</span>
              </>
            ) : null}
            
            <button
              onClick={onAddNew}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2 flex-shrink-0" />
              <span className="whitespace-nowrap">Add First {label.slice(0, -1)}</span>
            </button>
            
            {/* Secondary actions - only show if no filters */}
            {!hasFilters && (
              <div className="flex items-center space-x-4 text-sm">
                <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  Import from CSV
                </button>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  View sample
                </button>
              </div>
            )}
          </div>

          {/* Help text - only show if no filters */}
          {!hasFilters && (
            <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 max-w-lg mx-auto">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FileText className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3 text-left">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Multi-currency support
                  </h4>
                  <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
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