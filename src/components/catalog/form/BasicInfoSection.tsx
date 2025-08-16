// src/components/catalog/form/BasicInfoSection.tsx
import React from 'react';
import { Info, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { analyticsService } from '../../../services/analytics.service';
import { 
  CATALOG_VALIDATION_LIMITS 
} from '../../../utils/constants/catalog';
import type { CatalogItemType } from '../../../types/catalogTypes';
import ExamplesPanel from './shared/ExamplesPanel';

interface BasicInfoSectionProps {
  catalogType: CatalogItemType;
  mode: 'add' | 'edit';
  
  // Form data
  name: string;
  shortDescription: string;
  versionReason?: string;
  
  // Event handlers
  onNameChange: (value: string) => void;
  onShortDescriptionChange: (value: string) => void;
  onVersionReasonChange?: (value: string) => void;
  
  // Validation
  errors: Record<string, string>;
  onClearError: (field: string) => void;
  
  // State
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  catalogType,
  mode,
  name,
  shortDescription,
  versionReason = '',
  onNameChange,
  onShortDescriptionChange,
  onVersionReasonChange,
  errors,
  onClearError,
  isLoading = false,
  disabled = false,
  className = ''
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // Get catalog type info
  const getCatalogTypeInfo = () => {
    const typeMap: Record<CatalogItemType, { singular: string; plural: string }> = {
      'service': { singular: 'Service', plural: 'Services' },
      'equipment': { singular: 'Equipment', plural: 'Equipment' },
      'spare_part': { singular: 'Spare Part', plural: 'Spare Parts' },
      'asset': { singular: 'Asset', plural: 'Assets' }
    };
    
    return typeMap[catalogType] || { singular: 'Item', plural: 'Items' };
  };

  const catalogInfo = getCatalogTypeInfo();

  // Handle name change with validation
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onNameChange(value);
    onClearError('name');
    
    // Track name changes for analytics
    if (value.length > 0 && value.length % 10 === 0) {
      analyticsService.trackEvent('catalog_name_typing', {
        catalog_type: catalogType,
        name_length: value.length,
        mode
      });
    }
  };

  // Handle short description change
  const handleShortDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    onShortDescriptionChange(value);
    onClearError('short_description');
  };

  // Handle version reason change
  const handleVersionReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!onVersionReasonChange) return;
    
    const value = e.target.value;
    onVersionReasonChange(value);
    onClearError('version_reason');
  };

  // Handle example click
  const handleExampleClick = (example: string) => {
    onNameChange(example);
    onClearError('name');
    
    analyticsService.trackEvent('catalog_example_applied', {
      catalog_type: catalogType,
      example_text: example,
      mode
    });
  };

  return (
    <div className={`mb-10 ${className}`}>
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${colors.brand.primary}20` }}
        >
          <Info 
            className="w-4 h-4"
            style={{ color: colors.brand.primary }}
          />
        </div>
        <h2 
          className="text-xl font-semibold transition-colors"
          style={{ color: colors.utility.primaryText }}
        >
          Basic Information
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Name Field */}
          <div data-field="name">
            <label 
              className="block text-sm font-medium mb-2 transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              {catalogInfo.singular} Name 
              <span style={{ color: colors.semantic.error }}>*</span>
            </label>
            
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              disabled={disabled || isLoading}
              className="w-full px-4 py-3 border rounded-lg transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: errors.name 
                  ? colors.semantic.error
                  : colors.utility.secondaryText + '40',
                backgroundColor: colors.utility.primaryBackground,
                color: colors.utility.primaryText,
                '--tw-ring-color': colors.brand.primary
              } as React.CSSProperties}
              placeholder={`Enter ${catalogInfo.singular.toLowerCase()} name`}
              maxLength={CATALOG_VALIDATION_LIMITS.NAME.MAX_LENGTH}
              aria-describedby={errors.name ? "name-error" : "name-help"}
              aria-invalid={!!errors.name}
            />
            
            {/* Error message */}
            {errors.name && (
              <div 
                id="name-error" 
                className="flex items-center gap-2 mt-2 text-sm"
                style={{ color: colors.semantic.error }}
              >
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                {errors.name}
              </div>
            )}
            
            {/* Character count */}
            <div 
              id="name-help"
              className="mt-1 text-xs transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              {name.length}/{CATALOG_VALIDATION_LIMITS.NAME.MAX_LENGTH} characters
              {name.length < CATALOG_VALIDATION_LIMITS.NAME.MIN_LENGTH && (
                <span style={{ color: colors.semantic.warning }}>
                  {' '}(minimum {CATALOG_VALIDATION_LIMITS.NAME.MIN_LENGTH} required)
                </span>
              )}
            </div>
          </div>

          {/* Short Description Field */}
          <div data-field="short_description">
            <label 
              className="block text-sm font-medium mb-2 transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Short Description
            </label>
            
            <textarea
              value={shortDescription}
              onChange={handleShortDescriptionChange}
              disabled={disabled || isLoading}
              rows={3}
              className="w-full px-4 py-3 border rounded-lg transition-colors resize-none focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: errors.short_description 
                  ? colors.semantic.error
                  : colors.utility.secondaryText + '40',
                backgroundColor: colors.utility.primaryBackground,
                color: colors.utility.primaryText,
                '--tw-ring-color': colors.brand.primary
              } as React.CSSProperties}
              placeholder="Brief description for listings and previews"
              maxLength={CATALOG_VALIDATION_LIMITS.SHORT_DESCRIPTION.MAX_LENGTH}
              aria-describedby={errors.short_description ? "short-desc-error" : "short-desc-help"}
              aria-invalid={!!errors.short_description}
            />
            
            {/* Error message */}
            {errors.short_description && (
              <div 
                id="short-desc-error"
                className="flex items-center gap-2 mt-2 text-sm"
                style={{ color: colors.semantic.error }}
              >
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                {errors.short_description}
              </div>
            )}
            
            {/* Character count */}
            <div 
              id="short-desc-help"
              className="mt-1 text-xs transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              {shortDescription.length}/{CATALOG_VALIDATION_LIMITS.SHORT_DESCRIPTION.MAX_LENGTH} characters
            </div>
          </div>

          {/* Version Reason Field (Edit Mode Only) */}
          {mode === 'edit' && onVersionReasonChange && (
            <div data-field="version_reason">
              <label 
                className="block text-sm font-medium mb-2 transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                Version Reason 
                <span style={{ color: colors.semantic.error }}>*</span>
              </label>
              
              <textarea
                value={versionReason}
                onChange={handleVersionReasonChange}
                disabled={disabled || isLoading}
                rows={2}
                className="w-full px-4 py-3 border rounded-lg transition-colors resize-none focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: errors.version_reason 
                    ? colors.semantic.error
                    : colors.utility.secondaryText + '40',
                  backgroundColor: colors.utility.primaryBackground,
                  color: colors.utility.primaryText,
                  '--tw-ring-color': colors.brand.primary
                } as React.CSSProperties}
                placeholder="Describe what changed in this update"
                maxLength={CATALOG_VALIDATION_LIMITS.VERSION_REASON.MAX_LENGTH}
                aria-describedby={errors.version_reason ? "version-reason-error" : "version-reason-help"}
                aria-invalid={!!errors.version_reason}
              />
              
              {/* Error message */}
              {errors.version_reason && (
                <div 
                  id="version-reason-error"
                  className="flex items-center gap-2 mt-2 text-sm"
                  style={{ color: colors.semantic.error }}
                >
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  {errors.version_reason}
                </div>
              )}
              
              {/* Character count and minimum length indicator */}
              <div 
                id="version-reason-help"
                className="mt-1 text-xs transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                {versionReason.length}/{CATALOG_VALIDATION_LIMITS.VERSION_REASON.MAX_LENGTH} characters
                {versionReason.length < CATALOG_VALIDATION_LIMITS.VERSION_REASON.MIN_LENGTH && (
                  <span style={{ color: colors.semantic.warning }}>
                    {' '}(minimum {CATALOG_VALIDATION_LIMITS.VERSION_REASON.MIN_LENGTH} required)
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Examples Panel */}
        <div className="lg:col-span-1">
          <ExamplesPanel
            catalogType={catalogType}
            onExampleClick={handleExampleClick}
            currentValue={name}
            trackingContext={`catalog_${mode}_form`}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;