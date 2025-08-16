// src/components/Resources/ResourceTypesList.tsx
// Left sidebar component for resource type selection

import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { TableSkeleton } from '@/components/common/skeletons';
import { useResourceTypes, useResourcesByType } from '@/hooks/queries/useResources';
import { 
  ResourceType, 
  getResourceTypeBehavior,
  RESOURCE_TYPE_ICONS 
} from '@/types/resources';

interface ResourceTypesListProps {
  selectedTypeId: string | null;
  onSelectType: (typeId: string) => void;
  className?: string;
}

/**
 * Left sidebar component showing available resource types
 * Similar to LOV categories list
 */
const ResourceTypesList: React.FC<ResourceTypesListProps> = ({
  selectedTypeId,
  onSelectType,
  className,
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;

  // Load resource types
  const { 
    data: resourceTypes = [], 
    isLoading, 
    error 
  } = useResourceTypes();

  // Get icon component for resource type
  const getIconComponent = (typeName: string) => {
    // This would need to be implemented based on your icon system
    // For now, return a simple text indicator
    const iconName = RESOURCE_TYPE_ICONS[typeName] || RESOURCE_TYPE_ICONS.default;
    return iconName.charAt(0).toUpperCase(); // Simple fallback
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className={cn("w-64 shrink-0", className)}>
        <div 
          className="rounded-lg shadow-sm border overflow-hidden transition-colors"
          style={{
            backgroundColor: colors.utility.secondaryBackground,
            borderColor: colors.utility.primaryText + '20'
          }}
        >
          <TableSkeleton rows={5} />
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className={cn("w-64 shrink-0", className)}>
        <div 
          className="rounded-lg shadow-sm border p-4 transition-colors"
          style={{
            backgroundColor: colors.utility.secondaryBackground,
            borderColor: colors.semantic.error + '40'
          }}
        >
          <div className="flex items-center gap-2 text-center">
            <AlertCircle 
              className="h-5 w-5 transition-colors"
              style={{ color: colors.semantic.error }}
            />
            <span 
              className="text-sm transition-colors"
              style={{ color: colors.semantic.error }}
            >
              Failed to load types
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Handle empty state
  if (resourceTypes.length === 0) {
    return (
      <div className={cn("w-64 shrink-0", className)}>
        <div 
          className="rounded-lg shadow-sm border p-4 text-center transition-colors"
          style={{
            backgroundColor: colors.utility.secondaryBackground,
            borderColor: colors.utility.primaryText + '20'
          }}
        >
          <span 
            className="text-sm transition-colors"
            style={{ color: colors.utility.secondaryText }}
          >
            No resource types configured
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-64 shrink-0", className)}>
      <div 
        className="rounded-lg shadow-sm border overflow-hidden transition-colors"
        style={{
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: colors.utility.primaryText + '20'
        }}
      >
        {resourceTypes.map((resourceType, index) => {
          const isSelected = selectedTypeId === resourceType.id;
          const isFirst = index === 0;
          const behavior = getResourceTypeBehavior(resourceType);
          
          return (
            <ResourceTypeButton
              key={resourceType.id}
              resourceType={resourceType}
              isSelected={isSelected}
              isFirst={isFirst && !isSelected}
              behavior={behavior}
              onClick={() => onSelectType(resourceType.id)}
              colors={colors}
            />
          );
        })}
      </div>
    </div>
  );
};

/**
 * Individual resource type button component
 */
interface ResourceTypeButtonProps {
  resourceType: ResourceType;
  isSelected: boolean;
  isFirst: boolean;
  behavior: ReturnType<typeof getResourceTypeBehavior>;
  onClick: () => void;
  colors: any;
}

const ResourceTypeButton: React.FC<ResourceTypeButtonProps> = ({
  resourceType,
  isSelected,
  isFirst,
  behavior,
  onClick,
  colors,
}) => {
  // Get count of resources for this type
  const { data: resources = [] } = useResourcesByType(
    resourceType.id,
    { includeInactive: false }
  );
  const resourceCount = resources.length;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full px-4 py-3 text-left border-b last:border-0 transition-all duration-200",
        "hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-inset",
        isSelected 
          ? "font-medium shadow-sm" 
          : "hover:bg-opacity-50"
      )}
      style={{
        borderColor: colors.utility.primaryText + '20',
        backgroundColor: isSelected 
          ? colors.brand.primary
          : isFirst
          ? colors.utility.primaryBackground + '50'
          : 'transparent',
        color: isSelected 
          ? '#FFFFFF'
          : colors.utility.primaryText,
        focusRingColor: colors.brand.primary + '40',
      }}
      title={resourceType.description || `Manage ${resourceType.name} resources`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Resource Type Icon */}
          <div 
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
              isSelected ? "bg-white bg-opacity-20" : ""
            )}
            style={{
              backgroundColor: isSelected 
                ? 'rgba(255, 255, 255, 0.2)'
                : colors.brand.primary + '20',
              color: isSelected 
                ? '#FFFFFF'
                : colors.brand.primary
            }}
          >
            {resourceType.name.charAt(0).toUpperCase()}
          </div>
          
          {/* Resource Type Info */}
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {resourceType.name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
            {behavior.isContactBased && (
              <span 
                className="text-xs opacity-75"
                style={{ 
                  color: isSelected 
                    ? '#FFFFFF'
                    : colors.utility.secondaryText 
                }}
              >
                Contact-based
              </span>
            )}
          </div>
        </div>

        {/* Resource Count Badge */}
        {resourceCount > 0 && (
          <div 
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              isSelected 
                ? "bg-white bg-opacity-20" 
                : ""
            )}
            style={{
              backgroundColor: isSelected 
                ? 'rgba(255, 255, 255, 0.2)'
                : colors.utility.primaryBackground,
              color: isSelected 
                ? '#FFFFFF'
                : colors.utility.secondaryText
            }}
          >
            {resourceCount}
          </div>
        )}
      </div>

      {/* Behavior Indicator */}
      {behavior.isContactBased && (
        <div className="mt-1 flex items-center gap-1">
          <div 
            className="w-1 h-1 rounded-full"
            style={{ 
              backgroundColor: isSelected 
                ? '#FFFFFF'
                : colors.semantic.info 
            }}
          />
          <span 
            className="text-xs opacity-75"
            style={{ 
              color: isSelected 
                ? '#FFFFFF'
                : colors.utility.secondaryText 
            }}
          >
            Auto-synced from contacts
          </span>
        </div>
      )}
    </button>
  );
};

export default ResourceTypesList;