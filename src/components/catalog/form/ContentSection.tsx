// src/components/catalog/form/ContentSection.tsx
import React from 'react';
import { FileText } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { CATALOG_VALIDATION_LIMITS } from '../../../utils/constants/catalog';
import type { CatalogItemType } from '../../../types/catalogTypes';
import RichTextEditor from '../../ui/RichTextEditor';

interface ContentSectionProps {
  catalogType: CatalogItemType;
  
  // Form data
  description: string;
  serviceTerms: string;
  
  // Event handlers
  onDescriptionChange: (value: string) => void;
  onServiceTermsChange: (value: string) => void;
  
  // Validation
  errors: Record<string, string>;
  onClearError: (field: string) => void;
  
  // State
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  catalogType,
  description,
  serviceTerms,
  onDescriptionChange,
  onServiceTermsChange,
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
    const typeMap: Record<CatalogItemType, { singular: string; termsLabel: string }> = {
      'service': { singular: 'Service', termsLabel: 'Service Terms & Conditions' },
      'equipment': { singular: 'Equipment', termsLabel: 'Equipment Terms & Usage Guidelines' },
      'spare_part': { singular: 'Spare Part', termsLabel: 'Parts Terms & Warranty Information' },
      'asset': { singular: 'Asset', termsLabel: 'Asset Terms & Usage Policies' }
    };
    
    return typeMap[catalogType] || { singular: 'Item', termsLabel: 'Terms & Conditions' };
  };

  const catalogInfo = getCatalogTypeInfo();

  // Handle description change
  const handleDescriptionChange = (content: string) => {
    onDescriptionChange(content);
    onClearError('description');
  };

  // Handle service terms change
  const handleServiceTermsChange = (content: string) => {
    onServiceTermsChange(content);
    onClearError('service_terms');
  };

  return (
    <div className={`mb-8 ${className}`}>
      {/* FIXED: New layout structure */}
      <div 
        className="bg-white rounded-lg border"
        style={{
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: colors.utility.secondaryText + '20'
        }}
      >
        {/* Section Header */}
        <div className="p-6 border-b" style={{ borderColor: colors.utility.secondaryText + '20' }}>
          <div className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${colors.semantic.info}20` }}
            >
              <FileText 
                className="w-4 h-4"
                style={{ color: colors.semantic.info }}
              />
            </div>
            <h2 
              className="text-lg font-semibold transition-colors"
              style={{ color: colors.utility.primaryText }}
            >
              Content & Documentation
            </h2>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Description Editor */}
          <div>
            <RichTextEditor
              value={description}
              onChange={handleDescriptionChange}
              label={`${catalogInfo.singular} Description`}
              placeholder={`Enter detailed description for your ${catalogInfo.singular.toLowerCase()}...`}
              required
              error={errors.description}
              disabled={disabled || isLoading}
              minHeight={150}
              maxHeight={400}
              maxLength={CATALOG_VALIDATION_LIMITS.DESCRIPTION?.MAX_LENGTH}
              showCharCount
              allowFullscreen
              toolbarButtons={[
                'bold', 'italic', 'underline', 'divider',
                'bulletList', 'orderedList', 'quote', 'divider',
                'link', 'divider',
                'alignLeft', 'alignCenter', 'alignRight'
              ]}
              trackingContext="catalog_description"
              trackingMetadata={{
                catalog_type: catalogType,
                field: 'description'
              }}
              onFocus={() => onClearError('description')}
              // FIXED: Add explicit LTR direction and proper styling
              className="[direction:ltr]"
              style={{
                direction: 'ltr',
                textAlign: 'left'
              }}
            />
            
            <p 
              className="mt-2 text-xs transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              Provide a comprehensive description that will help users understand the {catalogInfo.singular.toLowerCase()}.
              This content will be visible to all users who can access this catalog item.
            </p>
          </div>

          {/* Service Terms Editor */}
          <div>
            <RichTextEditor
              value={serviceTerms}
              onChange={handleServiceTermsChange}
              label={catalogInfo.termsLabel}
              placeholder={`Enter ${catalogInfo.termsLabel.toLowerCase()}...`}
              error={errors.service_terms}
              disabled={disabled || isLoading}
              minHeight={120}
              maxHeight={350}
              maxLength={CATALOG_VALIDATION_LIMITS.SERVICE_TERMS?.MAX_LENGTH}
              showCharCount
              allowFullscreen
              toolbarButtons={[
                'bold', 'italic', 'divider',
                'bulletList', 'orderedList', 'divider',
                'link', 'divider',
                'alignLeft', 'alignCenter', 'alignRight'
              ]}
              trackingContext="catalog_terms"
              trackingMetadata={{
                catalog_type: catalogType,
                field: 'service_terms'
              }}
              onFocus={() => onClearError('service_terms')}
              // FIXED: Add explicit LTR direction and proper styling
              className="[direction:ltr]"
              style={{
                direction: 'ltr',
                textAlign: 'left'
              }}
            />
            
            <p 
              className="mt-2 text-xs transition-colors"
              style={{ color: colors.utility.secondaryText }}
            >
              Define the terms, conditions, and policies that apply to this {catalogInfo.singular.toLowerCase()}.
              These terms will be included in contracts and service agreements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentSection;