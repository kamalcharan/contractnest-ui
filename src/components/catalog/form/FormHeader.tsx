// src/components/catalog/form/FormHeader.tsx
import React from 'react';
import { ArrowLeft, Clock, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  CATALOG_TYPE_LABELS,
  CATALOG_TYPE_ICONS,
  CATALOG_TYPE_COLORS
} from '../../../utils/constants/catalog';
import type { CatalogItemType, CatalogItemDetailed } from '../../../types/catalogTypes';

interface FormHeaderProps {
  catalogType: CatalogItemType;
  mode: 'add' | 'edit';
  existingItem?: CatalogItemDetailed | null;
  hasUnsavedChanges: boolean;
  isLoading?: boolean;
  onBack: () => void;
  className?: string;
}

export const FormHeader: React.FC<FormHeaderProps> = ({
  catalogType,
  mode,
  existingItem,
  hasUnsavedChanges,
  isLoading = false,
  onBack,
  className = ''
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // Get catalog info
  const getCatalogInfo = () => {
    const typeKey = catalogType as keyof typeof CATALOG_TYPE_LABELS;
    return {
      singular: CATALOG_TYPE_LABELS[typeKey]?.slice(0, -1) || 'Item',
      plural: CATALOG_TYPE_LABELS[typeKey] || 'Items',
      icon: CATALOG_TYPE_ICONS[typeKey] || 'Package',
      color: CATALOG_TYPE_COLORS[typeKey] || 'gray'
    };
  };

  const catalogInfo = getCatalogInfo();
  
  // Get icon component (you'll need to map these to actual Lucide icons)
  const getIconComponent = () => {
    // For now, return a generic icon - you can expand this mapping
    switch (catalogType) {
      case 'service':
        return '🛎️';
      case 'equipment':
        return '⚙️';
      case 'spare_part':
        return '🔧';
      case 'asset':
        return '🏢';
      default:
        return '📦';
    }
  };

  const iconEmoji = getIconComponent();

  return (
    <div className={`mb-8 ${className}`}>
      {/* Back button */}
      <button 
        onClick={onBack}
        disabled={isLoading}
        className="flex items-center mb-4 transition-colors hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ color: colors.utility.secondaryText }}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to {catalogInfo.plural}
      </button>
      
      {/* Header content */}
      <div className="flex items-center justify-between">
        <div>
          {/* Title */}
          <h1 
            className="text-3xl font-bold flex items-center gap-3 transition-colors"
            style={{ color: colors.utility.primaryText }}
          >
            <span className="text-3xl">{iconEmoji}</span>
            {mode === 'add' ? 'Add New' : 'Edit'} {catalogInfo.singular}
          </h1>
          
          {/* Description */}
          <p 
            className="mt-1 transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            {mode === 'add' 
              ? `Fill in the details below to create your ${catalogInfo.singular.toLowerCase()}`
              : `Update the details for your ${catalogInfo.singular.toLowerCase()}`
            }
          </p>

          {/* Existing item info for edit mode */}
          {mode === 'edit' && existingItem && (
            <div 
              className="mt-2 text-sm transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              <span className="font-medium">Current:</span> {existingItem.name}
              {existingItem.version_number && (
                <span className="ml-2">• Version {existingItem.version_number}</span>
              )}
            </div>
          )}
        </div>
        
        {/* Status indicators */}
        <div className="flex items-center gap-3">
          {/* Version info for edit mode */}
          {mode === 'edit' && existingItem && (
            <div 
              className="flex items-center text-sm transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              <Clock className="w-4 h-4 mr-1" />
              Version {existingItem.version_number || 1}
            </div>
          )}
          
          {/* Unsaved changes indicator */}
          {hasUnsavedChanges && (
            <div 
              className="flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors"
              style={{
                backgroundColor: `${colors.semantic.warning}20`,
                color: colors.semantic.warning
              }}
            >
              <div 
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: colors.semantic.warning }}
              />
              Unsaved changes
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div 
              className="flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors"
              style={{
                backgroundColor: `${colors.brand.primary}20`,
                color: colors.brand.primary
              }}
            >
              <div className="animate-spin rounded-full h-4 w-4 border-b-2" 
                   style={{ borderColor: colors.brand.primary }} />
              Loading...
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div 
        className="mt-6 h-px transition-colors"
        style={{ backgroundColor: colors.utility.secondaryText + '20' }}
      />
    </div>
  );
};

export default FormHeader;