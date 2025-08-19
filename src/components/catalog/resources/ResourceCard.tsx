// src/components/catalog/resources/ResourceCard.tsx
// 🎨 Individual resource display card with selection, details, and actions

import React, { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  User, 
  Phone, 
  Mail, 
  Tag, 
  Clock, 
  AlertCircle, 
  Check, 
  Edit, 
  Eye, 
  MoreVertical,
  Star,
  Copy,
  Trash2
} from 'lucide-react';
import type { ResourceItem } from '../../../hooks/queries/useResourceQueries';

interface ResourceCardProps {
  resource: ResourceItem;
  
  // Selection state
  isSelected?: boolean;
  isSelectable?: boolean;
  onSelect?: (resource: ResourceItem) => void;
  onDeselect?: (resource: ResourceItem) => void;
  
  // Display modes
  variant?: 'default' | 'compact' | 'detailed' | 'selection';
  showActions?: boolean;
  showContact?: boolean;
  showTags?: boolean;
  showStatus?: boolean;
  
  // Event handlers
  onView?: (resource: ResourceItem) => void;
  onEdit?: (resource: ResourceItem) => void;
  onDelete?: (resource: ResourceItem) => void;
  onDuplicate?: (resource: ResourceItem) => void;
  onFavorite?: (resource: ResourceItem) => void;
  
  // Customization
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  isSelected = false,
  isSelectable = false,
  onSelect,
  onDeselect,
  variant = 'default',
  showActions = true,
  showContact = true,
  showTags = true,
  showStatus = true,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onFavorite,
  className = '',
  style,
  disabled = false
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  const [isHovered, setIsHovered] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Handle selection toggle
  const handleSelectionToggle = () => {
    if (!isSelectable || disabled) return;
    
    if (isSelected) {
      onDeselect?.(resource);
    } else {
      onSelect?.(resource);
    }
  };

  // Handle card click
  const handleCardClick = () => {
    if (isSelectable) {
      handleSelectionToggle();
    } else {
      onView?.(resource);
    }
  };

  // Handle action clicks
  const handleAction = (action: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(false);
    
    switch (action) {
      case 'view':
        onView?.(resource);
        break;
      case 'edit':
        onEdit?.(resource);
        break;
      case 'delete':
        onDelete?.(resource);
        break;
      case 'duplicate':
        onDuplicate?.(resource);
        break;
      case 'favorite':
        setIsFavorite(!isFavorite);
        onFavorite?.(resource);
        break;
    }
  };

  // Get resource type icon and label
  const getResourceTypeInfo = (typeId: string) => {
    const typeMap = {
      'team-staff': { icon: '👥', label: 'Team Member', color: colors.semantic.info },
      'equipment': { icon: '🔧', label: 'Equipment', color: colors.semantic.warning },
      'consumables': { icon: '📦', label: 'Consumables', color: colors.semantic.success },
      'assets': { icon: '🏢', label: 'Asset', color: colors.brand.primary },
      'partners': { icon: '🤝', label: 'Partner', color: colors.semantic.error }
    };
    return typeMap[typeId as keyof typeof typeMap] || { 
      icon: '📋', 
      label: 'Resource', 
      color: colors.utility.secondaryText 
    };
  };

  const resourceTypeInfo = getResourceTypeInfo(resource.resourceType?.id || 'other');

  // Compact variant
  if (variant === 'compact') {
    return (
      <div
        className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-sm ${className}`}
        style={{
          backgroundColor: isSelected 
            ? `${colors.brand.primary}10` 
            : colors.utility.primaryBackground,
          borderColor: isSelected 
            ? colors.brand.primary 
            : colors.utility.secondaryText + '20',
          opacity: disabled ? 0.6 : 1,
          ...style
        }}
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Avatar */}
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
          style={{
            backgroundColor: resource.hexcolor + '20' || `${colors.brand.primary}20`,
            color: resource.hexcolor || colors.brand.primary
          }}
        >
          {resource.display_name.charAt(0).toUpperCase()}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 
            className="font-medium text-sm truncate"
            style={{ color: colors.utility.primaryText }}
          >
            {resource.display_name}
          </h4>
          <p 
            className="text-xs truncate"
            style={{ color: colors.utility.secondaryText }}
          >
            {resource.name}
          </p>
        </div>
        
        {/* Selection indicator */}
        {isSelectable && (
          <div 
            className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
            style={{
              borderColor: isSelected ? colors.brand.primary : colors.utility.secondaryText + '40',
              backgroundColor: isSelected ? colors.brand.primary : 'transparent'
            }}
          >
            {isSelected && <Check className="w-3 h-3 text-white" />}
          </div>
        )}
      </div>
    );
  }

  // Selection variant (for ResourceSelector)
  if (variant === 'selection') {
    return (
      <div
        className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
          isSelected ? 'shadow-md' : ''
        } ${className}`}
        style={{
          borderColor: isSelected 
            ? colors.brand.primary 
            : colors.utility.secondaryText + '20',
          backgroundColor: isSelected 
            ? `${colors.brand.primary}05` 
            : colors.utility.secondaryBackground,
          opacity: disabled ? 0.6 : 1,
          ...style
        }}
        onClick={handleCardClick}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            {/* Resource Avatar */}
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{
                backgroundColor: resource.hexcolor + '20' || `${colors.brand.primary}20`,
                color: resource.hexcolor || colors.brand.primary
              }}
            >
              {resource.display_name.charAt(0).toUpperCase()}
            </div>
            
            {/* Resource Info */}
            <div className="flex-1 min-w-0">
              <h3 
                className="font-medium text-sm truncate"
                style={{ color: colors.utility.primaryText }}
              >
                {resource.display_name}
              </h3>
              {resource.description && (
                <p 
                  className="text-xs mt-1 line-clamp-2"
                  style={{ color: colors.utility.secondaryText }}
                >
                  {resource.description}
                </p>
              )}
              {showTags && resource.tags && resource.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {resource.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 rounded-full text-xs"
                      style={{
                        backgroundColor: colors.utility.secondaryText + '10',
                        color: colors.utility.secondaryText
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              {/* Contact Info for Team Staff */}
              {showContact && resource.contact && (
                <div 
                  className="text-xs mt-2"
                  style={{ color: colors.utility.secondaryText }}
                >
                  {resource.contact.first_name} {resource.contact.last_name}
                  {resource.contact.email && (
                    <span className="block">{resource.contact.email}</span>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Selection Indicator */}
          <div 
            className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0"
            style={{
              borderColor: isSelected ? colors.brand.primary : colors.utility.secondaryText + '40',
              backgroundColor: isSelected ? colors.brand.primary : 'transparent'
            }}
          >
            {isSelected && <Check className="w-3 h-3 text-white" />}
          </div>
        </div>
      </div>
    );
  }

  // Default and detailed variants
  return (
    <div
      className={`group relative rounded-lg border transition-all duration-200 cursor-pointer ${
        isHovered ? 'shadow-lg scale-[1.02]' : 'shadow-sm'
      } ${className}`}
      style={{
        backgroundColor: isSelected 
          ? `${colors.brand.primary}10` 
          : colors.utility.primaryBackground,
        borderColor: isSelected 
          ? colors.brand.primary 
          : isHovered 
          ? colors.brand.primary + '40' 
          : colors.utility.secondaryText + '20',
        opacity: disabled ? 0.6 : 1,
        ...style
      }}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          {/* Resource Info */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Resource Avatar */}
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold flex-shrink-0 transition-all duration-200"
              style={{
                backgroundColor: resource.hexcolor + '20' || `${colors.brand.primary}20`,
                color: resource.hexcolor || colors.brand.primary,
                transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1)'
              }}
            >
              {resource.display_name.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 
                  className="font-semibold text-base truncate"
                  style={{ color: colors.utility.primaryText }}
                >
                  {resource.display_name}
                </h3>
                
                {/* Resource Type Badge */}
                <span
                  className="px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                  style={{
                    backgroundColor: resourceTypeInfo.color + '20',
                    color: resourceTypeInfo.color
                  }}
                >
                  <span>{resourceTypeInfo.icon}</span>
                  <span>{resourceTypeInfo.label}</span>
                </span>
              </div>
              
              <p 
                className="text-sm text-gray-600 mb-1"
                style={{ color: colors.utility.secondaryText }}
              >
                {resource.name}
              </p>
              
              {variant === 'detailed' && resource.description && (
                <p 
                  className="text-sm leading-relaxed mb-2"
                  style={{ color: colors.utility.secondaryText }}
                >
                  {resource.description}
                </p>
              )}
            </div>
          </div>

          {/* Actions Dropdown */}
          {showActions && !isSelectable && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDropdown(!showDropdown);
                }}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
                style={{ backgroundColor: colors.utility.secondaryText + '10' }}
              >
                <MoreVertical className="w-4 h-4" style={{ color: colors.utility.secondaryText }} />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div 
                  className="absolute right-0 top-full mt-1 w-48 rounded-lg shadow-lg border z-10"
                  style={{
                    backgroundColor: colors.utility.primaryBackground,
                    borderColor: colors.utility.secondaryText + '20'
                  }}
                >
                  <div className="py-1">
                    <button
                      onClick={(e) => handleAction('view', e)}
                      className="w-full px-4 py-2 text-left text-sm hover:opacity-80 flex items-center gap-2"
                      style={{ color: colors.utility.primaryText }}
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    <button
                      onClick={(e) => handleAction('edit', e)}
                      className="w-full px-4 py-2 text-left text-sm hover:opacity-80 flex items-center gap-2"
                      style={{ color: colors.utility.primaryText }}
                    >
                      <Edit className="w-4 h-4" />
                      Edit Resource
                    </button>
                    <button
                      onClick={(e) => handleAction('duplicate', e)}
                      className="w-full px-4 py-2 text-left text-sm hover:opacity-80 flex items-center gap-2"
                      style={{ color: colors.utility.primaryText }}
                    >
                      <Copy className="w-4 h-4" />
                      Duplicate
                    </button>
                    <button
                      onClick={(e) => handleAction('favorite', e)}
                      className="w-full px-4 py-2 text-left text-sm hover:opacity-80 flex items-center gap-2"
                      style={{ color: colors.utility.primaryText }}
                    >
                      <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                      {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </button>
                    {resource.isDeletable && onDelete && (
                      <>
                        <div 
                          className="h-px my-1"
                          style={{ backgroundColor: colors.utility.secondaryText + '20' }}
                        />
                        <button
                          onClick={(e) => handleAction('delete', e)}
                          className="w-full px-4 py-2 text-left text-sm hover:opacity-80 flex items-center gap-2"
                          style={{ color: colors.semantic.error }}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Resource
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Selection Checkbox (for selectable mode) */}
          {isSelectable && (
            <div 
              className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200"
              style={{
                borderColor: isSelected ? colors.brand.primary : colors.utility.secondaryText + '40',
                backgroundColor: isSelected ? colors.brand.primary : 'transparent'
              }}
            >
              {isSelected && <Check className="w-3 h-3 text-white" />}
            </div>
          )}
        </div>

        {/* Tags */}
        {showTags && resource.tags && resource.tags.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {resource.tags.slice(0, variant === 'detailed' ? 10 : 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: colors.utility.secondaryText + '10',
                    color: colors.utility.secondaryText
                  }}
                >
                  <Tag className="w-2 h-2" />
                  {tag}
                </span>
              ))}
              {resource.tags.length > (variant === 'detailed' ? 10 : 3) && (
                <span
                  className="px-2 py-1 rounded-full text-xs"
                  style={{
                    backgroundColor: colors.utility.secondaryText + '15',
                    color: colors.utility.secondaryText
                  }}
                >
                  +{resource.tags.length - (variant === 'detailed' ? 10 : 3)} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Contact Information (for team staff) */}
        {showContact && resource.contact && (
          <div 
            className="p-3 rounded-lg mb-3"
            style={{ backgroundColor: colors.semantic.info + '08' }}
          >
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4" style={{ color: colors.semantic.info }} />
              <span 
                className="text-sm font-medium"
                style={{ color: colors.utility.primaryText }}
              >
                {resource.contact.first_name} {resource.contact.last_name}
              </span>
            </div>
            {resource.contact.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" style={{ color: colors.utility.secondaryText }} />
                <span 
                  className="text-sm"
                  style={{ color: colors.utility.secondaryText }}
                >
                  {resource.contact.email}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Status and Metadata */}
        {showStatus && (
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className="px-2 py-1 rounded-full font-medium"
                style={{
                  backgroundColor: resource.isActive 
                    ? colors.semantic.success + '20' 
                    : colors.semantic.error + '20',
                  color: resource.isActive 
                    ? colors.semantic.success 
                    : colors.semantic.error
                }}
              >
                {resource.isActive ? 'Active' : 'Inactive'}
              </span>
              
              {!resource.isDeletable && (
                <span
                  className="px-2 py-1 rounded-full font-medium"
                  style={{
                    backgroundColor: colors.semantic.warning + '20',
                    color: colors.semantic.warning
                  }}
                >
                  System
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" style={{ color: colors.utility.secondaryText }} />
              <span style={{ color: colors.utility.secondaryText }}>
                {new Date(resource.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Hover Effect Overlay */}
      {isHovered && (
        <div 
          className="absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-200"
          style={{
            background: `linear-gradient(135deg, ${colors.brand.primary}03, ${colors.brand.secondary}03)`,
            opacity: isHovered ? 1 : 0
          }}
        />
      )}

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-0"
          onClick={(e) => {
            e.stopPropagation();
            setShowDropdown(false);
          }}
        />
      )}
    </div>
  );
};

export default ResourceCard;