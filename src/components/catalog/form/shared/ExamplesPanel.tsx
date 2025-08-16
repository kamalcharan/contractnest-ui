// src/components/catalog/form/shared/ExamplesPanel.tsx
// FIXED VERSION - Added horizontal layout support

import React from 'react';
import { HelpCircle, CheckCircle, Lightbulb } from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { analyticsService } from '../../../../services/analytics.service';
import type { CatalogItemType } from '../../../../types/catalogTypes';

interface ExamplesPanelProps {
  catalogType: CatalogItemType;
  onExampleClick: (example: string) => void;
  currentValue?: string;
  title?: string;
  subtitle?: string;
  className?: string;
  trackingContext?: string;
  layout?: 'vertical' | 'horizontal'; // NEW: Layout option
  compact?: boolean; // NEW: Compact mode
  maxColumns?: number; // NEW: Max columns for horizontal layout
}

export const ExamplesPanel: React.FC<ExamplesPanelProps> = ({
  catalogType,
  onExampleClick,
  currentValue = '',
  title,
  subtitle,
  className = '',
  trackingContext = 'catalog_form',
  layout = 'vertical',
  compact = false,
  maxColumns = 4
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // Get examples for catalog type
  const getExamplesForType = (type: CatalogItemType): string[] => {
    const exampleMap: Record<CatalogItemType, string[]> = {
      'service': [
        'IT Support Services',
        'Consulting & Advisory',
        'Maintenance Contracts',
        'Training Programs',
        'Cloud Solutions',
        'Security Services',
        'Data Analytics',
        'Project Management'
      ],
      'equipment': [
        'Construction Tools',
        'Medical Devices',
        'Audio/Visual Equipment',
        'Industrial Machinery',
        'Laboratory Equipment',
        'Safety Equipment',
        'Testing Instruments',
        'Heavy Machinery'
      ],
      'spare_part': [
        'Engine Components',
        'Replacement Parts',
        'Electronic Components',
        'Wear Parts',
        'Consumables',
        'Filters & Gaskets',
        'Bearings & Seals',
        'Electrical Parts'
      ],
      'asset': [
        'Vehicles & Fleet',
        'Real Estate Properties',
        'Manufacturing Equipment',
        'IT Infrastructure',
        'Office Equipment',
        'Warehouse Facilities',
        'Production Lines',
        'Communication Systems'
      ]
    };
    
    return exampleMap[type] || [];
  };

  const examples = getExamplesForType(catalogType);

  // Get display title
  const getTitle = () => {
    if (title) return title;
    
    const typeMap: Record<CatalogItemType, string> = {
      'service': 'Service',
      'equipment': 'Equipment',
      'spare_part': 'Spare Part',
      'asset': 'Asset'
    };
    
    return `Common ${typeMap[catalogType]} Examples`;
  };

  // Get display subtitle
  const getSubtitle = () => {
    if (subtitle) return subtitle;
    return 'Click on any example to use it as a starting point';
  };

  // Handle example click
  const handleExampleClick = (example: string) => {
    if (!currentValue.trim()) {
      onExampleClick(example);
      
      // Track example usage
      analyticsService.trackEvent('catalog_example_used', {
        catalog_type: catalogType,
        example_text: example,
        context: trackingContext
      });
    }
  };

  // Check if example is usable (only if current value is empty)
  const isExampleUsable = (example: string) => {
    return !currentValue.trim();
  };

  // Get layout classes
  const getLayoutClasses = () => {
    if (layout === 'horizontal') {
      return {
        container: 'space-y-3',
        examplesList: `grid grid-cols-2 md:grid-cols-${Math.min(maxColumns, 3)} lg:grid-cols-${maxColumns} gap-2`,
        exampleItem: 'flex items-center gap-2 p-2 rounded-md transition-all duration-200',
        exampleText: 'text-xs font-medium'
      };
    }
    
    // Vertical layout (default)
    return {
      container: 'space-y-4',
      examplesList: 'space-y-2',
      exampleItem: 'flex items-center gap-2 p-2 rounded-md transition-all duration-200',
      exampleText: 'text-sm'
    };
  };

  const layoutClasses = getLayoutClasses();

  return (
    <div className={`${className}`}>
      <div 
        className={compact ? 'p-3' : 'p-4'}
        style={{
          backgroundColor: `${colors.brand.primary}08`,
          borderColor: `${colors.brand.primary}30`,
          borderRadius: compact ? '8px' : '12px',
          border: '1px solid'
        }}
      >
        {/* Header */}
        <div className={`flex items-center gap-2 ${compact ? 'mb-2' : 'mb-3'}`}>
          <HelpCircle 
            className={`${compact ? 'h-3 w-3' : 'h-4 w-4'} flex-shrink-0`}
            style={{ color: colors.brand.primary }}
          />
          <h4 
            className={`${compact ? 'text-xs' : 'text-sm'} font-medium transition-colors`}
            style={{ color: colors.brand.primary }}
          >
            {getTitle()}
          </h4>
        </div>

        {/* Subtitle */}
        {!compact && (
          <p 
            className="text-xs mb-4 transition-colors"
            style={{ color: colors.brand.primary }}
          >
            {getSubtitle()}
          </p>
        )}

        {/* Examples list */}
        <div className={layoutClasses.container}>
          <div className={layoutClasses.examplesList}>
            {examples.map((example, index) => {
              const isUsable = isExampleUsable(example);
              const isCurrentValue = currentValue.trim().toLowerCase() === example.toLowerCase();
              
              return (
                <div
                  key={index}
                  className={`
                    ${layoutClasses.exampleItem}
                    ${isUsable ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed'}
                    group
                  `}
                  style={{ 
                    backgroundColor: isCurrentValue 
                      ? `${colors.semantic.success}20`
                      : `${colors.brand.primary}15`,
                    opacity: isUsable ? 1 : 0.5
                  }}
                  onClick={() => isUsable && handleExampleClick(example)}
                  role={isUsable ? 'button' : undefined}
                  tabIndex={isUsable ? 0 : -1}
                  onKeyDown={(e) => {
                    if (isUsable && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      handleExampleClick(example);
                    }
                  }}
                >
                  {/* Icon */}
                  {isCurrentValue ? (
                    <CheckCircle 
                      className={`${compact ? 'h-2 w-2' : 'h-3 w-3'} flex-shrink-0`}
                      style={{ color: colors.semantic.success }}
                    />
                  ) : (
                    <div 
                      className={`${compact ? 'h-2 w-2' : 'h-3 w-3'} rounded-full flex-shrink-0 transition-colors`}
                      style={{ 
                        backgroundColor: isUsable 
                          ? colors.brand.primary 
                          : colors.utility.secondaryText 
                      }}
                    />
                  )}

                  {/* Example text */}
                  <span 
                    className={`
                      ${layoutClasses.exampleText} transition-colors
                      ${isUsable ? 'group-hover:opacity-80' : ''}
                      ${layout === 'horizontal' ? 'truncate' : ''}
                    `}
                    style={{ 
                      color: isCurrentValue 
                        ? colors.semantic.success 
                        : colors.brand.primary 
                    }}
                    title={layout === 'horizontal' ? example : undefined}
                  >
                    {example}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Help tip - Only show in vertical layout or when not compact */}
        {(layout === 'vertical' || !compact) && (
          <div 
            className={`${compact ? 'mt-2 pt-2' : 'mt-4 pt-3'} border-t transition-colors`}
            style={{ borderColor: `${colors.brand.primary}20` }}
          >
            <div className="flex items-start gap-2">
              <Lightbulb 
                className={`${compact ? 'h-2 w-2 mt-0.5' : 'h-3 w-3 flex-shrink-0 mt-0.5'}`}
                style={{ color: colors.brand.primary }}
              />
              <p 
                className={`${compact ? 'text-xs' : 'text-xs'} transition-colors`}
                style={{ color: colors.brand.primary }}
              >
                {currentValue.trim() 
                  ? 'Clear the field to use examples'
                  : layout === 'horizontal' 
                    ? 'Click to use' 
                    : 'Examples are clickable when the field is empty'
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamplesPanel;