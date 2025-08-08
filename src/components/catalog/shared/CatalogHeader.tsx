// src/components/catalog/shared/CatalogHeader.tsx
// UPDATED: Simplified header that works with the container structure

import React from 'react';
import { Plus, Upload, Download, Package } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  CATALOG_TYPE_LABELS,
  CATALOG_TYPE_DESCRIPTIONS,
  CATALOG_TYPE_ICONS 
} from '../../../utils/constants/catalog';
import type { CatalogItemType } from '../../../types/catalogTypes';

interface CatalogHeaderProps {
  catalogType: CatalogItemType;
  catalogInfo: {
    title: string;
    description: string;
    color: string;
  };
  onAddNew: () => void;
  onImport: () => void;
  onExport: () => void;
}

const CatalogHeader: React.FC<CatalogHeaderProps> = ({
  catalogType,
  catalogInfo,
  onAddNew,
  onImport,
  onExport
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  
  // Get theme colors - EXACT same pattern as LoginPage
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  // Get icon for catalog type
  const getIcon = () => {
    switch (catalogType) {
      case 'service':
        return Package;
      case 'equipment':
        return Package; // You can customize these icons
      case 'spare_part':
        return Package;
      case 'asset':
        return Package;
      default:
        return Package;
    }
  };
  
  const Icon = getIcon();
  
  // Get color scheme based on catalogInfo.color
  const getColorScheme = (colorName: string) => {
    switch (colorName) {
      case 'purple':
        return {
          bg: `${colors.brand.secondary}20`,
          icon: colors.brand.secondary
        };
      case 'orange':
        return {
          bg: `${colors.brand.tertiary}20`,
          icon: colors.brand.tertiary
        };
      case 'green':
        return {
          bg: `${colors.semantic.success}20`,
          icon: colors.semantic.success
        };
      default:
        return {
          bg: `${colors.brand.primary}20`,
          icon: colors.brand.primary
        };
    }
  };
  
  const colorScheme = getColorScheme(catalogInfo.color);
  
  return (
    <div 
      className="rounded-lg shadow-sm border p-6 transition-colors"
      style={{
        backgroundColor: colors.utility.secondaryBackground,
        borderColor: `${colors.utility.primaryText}20`
      }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        {/* Left side - Title and description */}
        <div className="flex items-start space-x-4">
          {/* Icon */}
          <div 
            className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: colorScheme.bg }}
          >
            <Icon 
              className="w-6 h-6"
              style={{ color: colorScheme.icon }}
            />
          </div>
          
          {/* Title and description */}
          <div>
            <h1 
              className="text-2xl font-bold"
              style={{ color: colors.utility.primaryText }}
            >
              {catalogInfo.title}
            </h1>
            <p 
              className="text-sm mt-1"
              style={{ color: colors.utility.secondaryText }}
            >
              {catalogInfo.description}
            </p>
          </div>
        </div>
        
        {/* Right side - Actions */}
        <div className="mt-6 lg:mt-0 flex flex-col sm:flex-row gap-3">
          {/* Secondary actions */}
          <div className="flex gap-2">
            <button
              onClick={onImport}
              className="px-4 py-2 text-sm font-medium rounded-lg border transition-all hover:opacity-80"
              style={{
                borderColor: `${colors.utility.primaryText}40`,
                color: colors.utility.primaryText,
                backgroundColor: 'transparent'
              }}
            >
              <Upload className="w-4 h-4 mr-2 inline" />
              Import
            </button>
            
            <button
              onClick={onExport}
              className="px-4 py-2 text-sm font-medium rounded-lg border transition-all hover:opacity-80"
              style={{
                borderColor: `${colors.utility.primaryText}40`,
                color: colors.utility.primaryText,
                backgroundColor: 'transparent'
              }}
            >
              <Download className="w-4 h-4 mr-2 inline" />
              Export
            </button>
          </div>
          
          {/* Primary action */}
          <button
            onClick={onAddNew}
            className="px-6 py-2 text-sm font-medium rounded-lg hover:opacity-90 transition-all flex items-center justify-center text-white"
            style={{
              background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add {catalogInfo.title.slice(0, -1)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CatalogHeader;