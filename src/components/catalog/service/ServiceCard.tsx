// src/components/catalog/service/ServiceCard.tsx
// 🎨 Beautiful service card component for catalog display

import React, { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  MoreVertical, 
  Edit, 
  Eye, 
  Trash2, 
  Copy, 
  Star, 
  Clock, 
  DollarSign, 
  Users, 
  Wrench, 
  Package, 
  Building, 
  Handshake,
  Tag,
  Activity,
  Calendar
} from 'lucide-react';
import { formatServicePrice } from '../../../services/graphql';
import { useServiceCategory } from '../../../hooks/queries/useMasterDataQueries';
import type { ServiceCatalogItem } from '../../../hooks/queries/useServiceCatalogQueries';

interface ServiceCardProps {
  service: ServiceCatalogItem;
  onEdit: (serviceId: string) => void;
  onView: (serviceId: string) => void;
  onDelete?: (serviceId: string) => void;
  onDuplicate?: (serviceId: string) => void;
  showActions?: boolean;
  compact?: boolean;
  className?: string;
}

// Resource requirement summary component
const ResourceSummary: React.FC<{ 
  requirements: ServiceCatalogItem['requiredResources'], 
  colors: any, 
  compact?: boolean 
}> = ({ requirements, colors, compact = false }) => {
  if (!requirements) return null;
  
  const resourceTypeCounts = requirements.reduce((acc, req) => {
    acc[req.resourceId] = (acc[req.resourceId] || 0) + req.quantity;
    return acc;
  }, {} as Record<string, number>);

  const getResourceIcon = (resourceId: string) => {
    // Default icons based on resource ID patterns or use generic icons
    if (resourceId.includes('staff') || resourceId.includes('team')) return <Users className="w-3 h-3" />;
    if (resourceId.includes('equipment') || resourceId.includes('tool')) return <Wrench className="w-3 h-3" />;
    if (resourceId.includes('consumable') || resourceId.includes('supply')) return <Package className="w-3 h-3" />;
    if (resourceId.includes('asset') || resourceId.includes('facility')) return <Building className="w-3 h-3" />;
    if (resourceId.includes('partner') || resourceId.includes('vendor')) return <Handshake className="w-3 h-3" />;
    return <Activity className="w-3 h-3" />;
  };

  const getResourceLabel = (resourceId: string, quantity: number) => {
    // Simplified label - in production, you'd fetch resource names by ID
    const shortId = resourceId.split('-').pop() || resourceId;
    return `${quantity} ${shortId}`;
  };

  if (requirements.length === 0) {
    return (
      <div 
        className="text-xs italic"
        style={{ color: colors.utility.secondaryText }}
      >
        No specific resources required
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1">
      {Object.entries(resourceTypeCounts).map(([resourceId, quantity]) => (
        <div
          key={resourceId}
          className="flex items-center gap-1 px-2 py-1 rounded-full transition-all duration-200 hover:scale-105"
          style={{
            backgroundColor: colors.utility.secondaryText + '15',
            color: colors.utility.secondaryText
          }}
        >
          {getResourceIcon(resourceId)}
          <span className="text-xs font-medium">
            {compact ? quantity : getResourceLabel(resourceId, quantity)}
          </span>
        </div>
      ))}
    </div>
  );
};

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onEdit,
  onView,
  onDelete,
  onDuplicate,
  showActions = true,
  compact = false,
  className = ''
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  const [isHovered, setIsHovered] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Get pricing type label
  const getPricingTypeLabel = (type: string) => {
    switch (type.toUpperCase()) {
      case 'FIXED': return 'Fixed';
      case 'HOURLY': return 'Per Hour';
      case 'DAILY': return 'Per Day';
      case 'MONTHLY': return 'Per Month';
      case 'PER_USE': return 'Per Use';
      default: return type;
    }
  };

  // Get category information
  const categoryQuery = useServiceCategory(service.categoryId);

  const handleActionClick = (action: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDropdown(false);
    
    switch (action) {
      case 'edit':
        onEdit(service.id);
        break;
      case 'view':
        onView(service.id);
        break;
      case 'delete':
        onDelete?.(service.id);
        break;
      case 'duplicate':
        onDuplicate?.(service.id);
        break;
      case 'favorite':
        setIsFavorite(!isFavorite);
        break;
    }
  };

  return (
    <div
      className={`group relative rounded-xl border transition-all duration-200 cursor-pointer ${
        isHovered ? 'shadow-lg scale-[1.02]' : 'shadow-sm'
      } ${className}`}
      style={{
        backgroundColor: colors.utility.primaryBackground,
        borderColor: isHovered ? colors.brand.primary + '40' : colors.utility.secondaryText + '20'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onView(service.id)}
    >
      {/* Card Header */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          {/* Service Icon & Title */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center text-xl flex-shrink-0 transition-all duration-200"
              style={{
                backgroundColor: (categoryQuery.data?.hexcolor || colors.brand.primary) + '20',
                color: categoryQuery.data?.hexcolor || colors.brand.primary,
                transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1)'
              }}
            >
              {categoryQuery.data?.icon || '🛎️'}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 
                  className="font-semibold text-base truncate transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  {service.serviceName}
                </h3>
                
                {/* Status Badge */}
                {service.isActive && (
                  <span
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: colors.semantic.success + '20',
                      color: colors.semantic.success
                    }}
                  >
                    Active
                  </span>
                )}
              </div>
              
              <p 
                className="text-sm line-clamp-2 transition-colors"
                style={{ color: colors.utility.secondaryText }}
              >
                {service.description || 'No description available'}
              </p>
            </div>
          </div>

          {/* Actions Dropdown */}
          {showActions && (
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
                      onClick={(e) => handleActionClick('view', e)}
                      className="w-full px-4 py-2 text-left text-sm hover:opacity-80 flex items-center gap-2"
                      style={{ color: colors.utility.primaryText }}
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    <button
                      onClick={(e) => handleActionClick('edit', e)}
                      className="w-full px-4 py-2 text-left text-sm hover:opacity-80 flex items-center gap-2"
                      style={{ color: colors.utility.primaryText }}
                    >
                      <Edit className="w-4 h-4" />
                      Edit Service
                    </button>
                    <button
                      onClick={(e) => handleActionClick('duplicate', e)}
                      className="w-full px-4 py-2 text-left text-sm hover:opacity-80 flex items-center gap-2"
                      style={{ color: colors.utility.primaryText }}
                    >
                      <Copy className="w-4 h-4" />
                      Duplicate
                    </button>
                    <button
                      onClick={(e) => handleActionClick('favorite', e)}
                      className="w-full px-4 py-2 text-left text-sm hover:opacity-80 flex items-center gap-2"
                      style={{ color: colors.utility.primaryText }}
                    >
                      <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                      {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </button>
                    {onDelete && (
                      <>
                        <div 
                          className="h-px my-1"
                          style={{ backgroundColor: colors.utility.secondaryText + '20' }}
                        />
                        <button
                          onClick={(e) => handleActionClick('delete', e)}
                          className="w-full px-4 py-2 text-left text-sm hover:opacity-80 flex items-center gap-2"
                          style={{ color: colors.semantic.error }}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Service
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pricing Information */}
        <div 
          className="flex items-center gap-4 mb-3 p-3 rounded-lg"
          style={{ backgroundColor: colors.utility.secondaryBackground }}
        >
          <div className="flex items-center gap-2">
            <DollarSign 
              className="w-4 h-4"
              style={{ color: colors.semantic.success }}
            />
            <span 
              className="font-bold text-lg"
              style={{ color: colors.semantic.success }}
            >
              {formatServicePrice(service.pricingConfig.basePrice, service.pricingConfig.currency)}
            </span>
          </div>
          
          <div 
            className="px-2 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: colors.utility.secondaryText + '15',
              color: colors.utility.secondaryText
            }}
          >
            {getPricingTypeLabel(service.pricingConfig.pricingModel)}
          </div>
          
          {service.durationMinutes && (
            <div className="flex items-center gap-1">
              <Clock 
                className="w-3 h-3"
                style={{ color: colors.utility.secondaryText }}
              />
              <span 
                className="text-xs"
                style={{ color: colors.utility.secondaryText }}
              >
                {service.durationMinutes}min
              </span>
            </div>
          )}
        </div>

        {/* Resource Requirements */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Activity 
              className="w-4 h-4"
              style={{ color: colors.utility.secondaryText }}
            />
            <span 
              className="text-xs font-medium"
              style={{ color: colors.utility.primaryText }}
            >
              Resource Requirements
            </span>
          </div>
          <ResourceSummary 
            requirements={service.requiredResources}
            colors={colors}
            compact={compact}
          />
        </div>

        {/* Tags */}
        {service.tags && service.tags.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {service.tags.slice(0, 3).map((tag, index) => (
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
              {service.tags.length > 3 && (
                <span
                  className="px-2 py-1 rounded-full text-xs"
                  style={{
                    backgroundColor: colors.utility.secondaryText + '15',
                    color: colors.utility.secondaryText
                  }}
                >
                  +{service.tags.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Category & Creation Date */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {categoryQuery.data && (
              <span
                className="px-2 py-1 rounded-full font-medium"
                style={{
                  backgroundColor: (categoryQuery.data.hexcolor || colors.brand.primary) + '20',
                  color: categoryQuery.data.hexcolor || colors.brand.primary
                }}
              >
                {categoryQuery.data.name}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <Calendar 
              className="w-3 h-3"
              style={{ color: colors.utility.secondaryText }}
            />
            <span style={{ color: colors.utility.secondaryText }}>
              {new Date(service.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      {isHovered && (
        <div 
          className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-200"
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

export default ServiceCard;