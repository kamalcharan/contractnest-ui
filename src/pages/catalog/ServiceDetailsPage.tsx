// src/pages/catalog/ServiceDetailsPage.tsx
// 🎨 Dedicated service details view page with comprehensive information display

import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  ArrowLeft, 
  Edit, 
  Copy, 
  Share, 
  Star, 
  MoreVertical,
  Clock, 
  DollarSign, 
  Calendar, 
  Activity,
  User, 
  Wrench, 
  Package, 
  Building, 
  Handshake,
  Tag,
  Eye,
  EyeOff,
  Download,
  Trash2
} from 'lucide-react';
import { useServiceCatalogItem } from '../../hooks/queries/useServiceCatalogQueries';
import { useResource } from '../../hooks/queries/useResourceQueries';
import { useServiceCategory } from '../../hooks/queries/useMasterDataQueries';
import { formatServicePrice } from '../../services/graphql';
import type { ServiceCatalogItem } from '../../hooks/queries/useServiceCatalogQueries';

interface ServiceDetailsPageProps {
  serviceId: string;
  onBack: () => void;
  onEdit: (serviceId: string) => void;
  onDuplicate?: (serviceId: string) => void;
  onDelete?: (serviceId: string) => void;
}

// Resource requirement detail card
const ResourceRequirementDetailCard: React.FC<{
  requirement: ServiceCatalogItem['requiredResources'][0];
  colors: any;
}> = ({ requirement, colors }) => {
  const { data: resource, isLoading } = useResource(requirement.resourceId);

  if (isLoading) {
    return (
      <div 
        className="p-4 rounded-lg border animate-pulse"
        style={{
          backgroundColor: colors.utility.primaryBackground,
          borderColor: colors.utility.secondaryText + '20'
        }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-lg"
            style={{ backgroundColor: colors.utility.secondaryText + '20' }}
          />
          <div className="flex-1 space-y-2">
            <div 
              className="h-4 rounded"
              style={{ backgroundColor: colors.utility.secondaryText + '20' }}
            />
            <div 
              className="h-3 rounded w-2/3"
              style={{ backgroundColor: colors.utility.secondaryText + '10' }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div 
        className="p-4 rounded-lg border"
        style={{
          backgroundColor: colors.semantic.error + '05',
          borderColor: colors.semantic.error + '40'
        }}
      >
        <p 
          className="text-sm"
          style={{ color: colors.semantic.error }}
        >
          Resource not found: {requirement.resourceId}
        </p>
      </div>
    );
  }

  const getRequirementTypeConfig = (isOptional?: boolean) => {
    if (isOptional) {
      return {
        color: colors.semantic.warning,
        backgroundColor: colors.semantic.warning + '15',
        label: 'Optional',
        icon: '🟡'
      };
    } else {
      return {
        color: colors.semantic.error,
        backgroundColor: colors.semantic.error + '15',
        label: 'Required',
        icon: '🔴'
      };
    }
  };

  const requirementConfig = getRequirementTypeConfig(requirement.isOptional);

  return (
    <div 
      className="p-4 rounded-lg border transition-all hover:shadow-sm"
      style={{
        backgroundColor: colors.utility.primaryBackground,
        borderColor: colors.utility.secondaryText + '20'
      }}
    >
      <div className="flex items-start gap-4">
        {/* Resource Avatar */}
        <div 
          className="w-16 h-16 rounded-lg flex items-center justify-center text-lg font-bold flex-shrink-0"
          style={{
            backgroundColor: resource.hexcolor + '20' || `${colors.brand.primary}20`,
            color: resource.hexcolor || colors.brand.primary
          }}
        >
          {resource.display_name.charAt(0).toUpperCase()}
        </div>
        
        {/* Resource Information */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h4 
              className="font-semibold text-lg"
              style={{ color: colors.utility.primaryText }}
            >
              {resource.display_name}
            </h4>
            
            {/* Requirement Type Badge */}
            <div
              className="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
              style={{
                backgroundColor: requirementConfig.backgroundColor,
                color: requirementConfig.color
              }}
            >
              <span>{requirementConfig.icon}</span>
              <span>{requirementConfig.label}</span>
            </div>
          </div>
          
          <p 
            className="text-sm mb-3"
            style={{ color: colors.utility.secondaryText }}
          >
            {resource.name}
          </p>
          
          {resource.description && (
            <p 
              className="text-sm leading-relaxed mb-3"
              style={{ color: colors.utility.secondaryText }}
            >
              {resource.description}
            </p>
          )}
          
          {/* Skill Requirements */}
          {requirement.skillRequirements && requirement.skillRequirements.length > 0 && (
            <div 
              className="p-3 rounded-md mb-3"
              style={{ backgroundColor: colors.utility.secondaryText + '08' }}
            >
              <p 
                className="text-sm font-medium mb-1"
                style={{ color: colors.utility.primaryText }}
              >
                Required Skills:
              </p>
              <div className="flex flex-wrap gap-1">
                {requirement.skillRequirements.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-1 rounded text-xs"
                    style={{
                      backgroundColor: colors.semantic.info + '20',
                      color: colors.semantic.info
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Tags */}
          {resource.tags && resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {resource.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                  style={{
                    backgroundColor: colors.utility.secondaryText + '10',
                    color: colors.utility.secondaryText
                  }}
                >
                  <Tag className="w-2 h-2" />
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Contact Information (for team staff) */}
          {resource.contact && (
            <div 
              className="p-3 rounded-md"
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
                <p 
                  className="text-sm"
                  style={{ color: colors.utility.secondaryText }}
                >
                  {resource.contact.email}
                </p>
              )}
            </div>
          )}
          
          {/* Quantity */}
          <div className="flex items-center gap-2 mt-3">
            <Package className="w-4 h-4" style={{ color: colors.semantic.info }} />
            <span 
              className="text-sm font-medium"
              style={{ color: colors.semantic.info }}
            >
              Quantity: {requirement.quantity}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ServiceDetailsPage: React.FC<ServiceDetailsPageProps> = ({
  serviceId,
  onBack,
  onEdit,
  onDuplicate,
  onDelete
}) => {
  const { isDarkMode, currentTheme } = useTheme();
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  const { data: service, isLoading, isError } = useServiceCatalogItem(serviceId);
  const categoryQuery = useServiceCategory(service?.categoryId || '');
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Get pricing type label
  const getPricingTypeLabel = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'FIXED': return 'Fixed Price';
      case 'HOURLY': return 'Per Hour';
      case 'DAILY': return 'Per Day';
      case 'MONTHLY': return 'Per Month';
      case 'PER_USE': return 'Per Use';
      default: return type;
    }
  };

  // Group resources by type (simplified grouping based on resourceId patterns)
  const groupedResources = service?.requiredResources?.reduce((acc, req) => {
    let resourceType = 'other';
    if (req.resourceId.includes('staff') || req.resourceId.includes('team')) resourceType = 'team-staff';
    else if (req.resourceId.includes('equipment') || req.resourceId.includes('tool')) resourceType = 'equipment';
    else if (req.resourceId.includes('consumable') || req.resourceId.includes('supply')) resourceType = 'consumables';
    else if (req.resourceId.includes('asset') || req.resourceId.includes('facility')) resourceType = 'assets';
    else if (req.resourceId.includes('partner') || req.resourceId.includes('vendor')) resourceType = 'partners';
    
    if (!acc[resourceType]) {
      acc[resourceType] = [];
    }
    acc[resourceType].push(req);
    return acc;
  }, {} as Record<string, ServiceCatalogItem['requiredResources']>) || {};

  const getResourceTypeInfo = (typeId: string) => {
    const typeInfo = {
      'team-staff': { name: 'Team Staff', icon: <User className="w-5 h-5" />, emoji: '👥' },
      'equipment': { name: 'Equipment', icon: <Wrench className="w-5 h-5" />, emoji: '🔧' },
      'consumables': { name: 'Consumables', icon: <Package className="w-5 h-5" />, emoji: '📦' },
      'assets': { name: 'Assets', icon: <Building className="w-5 h-5" />, emoji: '🏢' },
      'partners': { name: 'Partners', icon: <Handshake className="w-5 h-5" />, emoji: '🤝' }
    };
    return typeInfo[typeId as keyof typeof typeInfo] || { name: typeId, icon: <Activity className="w-5 h-5" />, emoji: '📋' };
  };

  if (isLoading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.utility.secondaryBackground }}
      >
        <div className="text-center">
          <div 
            className="w-16 h-16 border-4 border-dashed rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: colors.brand.primary }}
          />
          <p style={{ color: colors.utility.primaryText }}>Loading service details...</p>
        </div>
      </div>
    );
  }

  if (isError || !service) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: colors.utility.secondaryBackground }}
      >
        <div className="text-center">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: colors.semantic.error + '20' }}
          >
            <Eye className="w-8 h-8" style={{ color: colors.semantic.error }} />
          </div>
          <h2 
            className="text-xl font-semibold mb-2"
            style={{ color: colors.utility.primaryText }}
          >
            Service Not Found
          </h2>
          <p 
            className="text-sm mb-6"
            style={{ color: colors.utility.secondaryText }}
          >
            The service you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-lg text-sm transition-all hover:scale-105 duration-200"
            style={{
              backgroundColor: colors.brand.primary,
              color: 'white'
            }}
          >
            Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  // Category info is already fetched via categoryQuery hook

  return (
    <div 
      className="min-h-screen transition-colors duration-200"
      style={{ backgroundColor: colors.utility.secondaryBackground }}
    >
      {/* Header */}
      <div 
        className="sticky top-0 z-40 border-b backdrop-blur-sm"
        style={{
          backgroundColor: colors.utility.primaryBackground + 'F5',
          borderColor: colors.utility.secondaryText + '20'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={onBack}
                className="flex items-center gap-2 text-sm transition-all hover:opacity-80 hover:translate-x-[-2px] duration-200"
                style={{ color: colors.utility.secondaryText }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Catalog
              </button>
              
              <div className="h-6 w-px" style={{ backgroundColor: colors.utility.secondaryText + '30' }} />
              
              <div>
                <h1 
                  className="text-2xl font-bold transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  Service Details
                </h1>
                <p 
                  className="text-sm"
                  style={{ color: colors.utility.secondaryText }}
                >
                  Comprehensive service information and requirements
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Favorite Button */}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 rounded-lg transition-all hover:scale-105 duration-200"
                style={{
                  backgroundColor: isFavorite ? colors.semantic.warning + '20' : colors.utility.secondaryText + '10',
                  color: isFavorite ? colors.semantic.warning : colors.utility.secondaryText
                }}
              >
                <Star className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>

              {/* Action Buttons */}
              <button
                onClick={() => onEdit(serviceId)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm border hover:scale-105 duration-200"
                style={{
                  borderColor: colors.brand.primary,
                  color: colors.brand.primary,
                  backgroundColor: 'transparent'
                }}
              >
                <Edit className="w-4 h-4" />
                Edit Service
              </button>

              {/* More Actions Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="p-2 rounded-lg transition-all hover:scale-105 duration-200"
                  style={{ backgroundColor: colors.utility.secondaryText + '10' }}
                >
                  <MoreVertical className="w-5 h-5" style={{ color: colors.utility.secondaryText }} />
                </button>

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
                        onClick={() => {
                          onDuplicate?.(serviceId);
                          setShowDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:opacity-80 flex items-center gap-2"
                        style={{ color: colors.utility.primaryText }}
                      >
                        <Copy className="w-4 h-4" />
                        Duplicate Service
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left text-sm hover:opacity-80 flex items-center gap-2"
                        style={{ color: colors.utility.primaryText }}
                      >
                        <Share className="w-4 h-4" />
                        Share Service
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left text-sm hover:opacity-80 flex items-center gap-2"
                        style={{ color: colors.utility.primaryText }}
                      >
                        <Download className="w-4 h-4" />
                        Export Details
                      </button>
                      {onDelete && (
                        <>
                          <div 
                            className="h-px my-1"
                            style={{ backgroundColor: colors.utility.secondaryText + '20' }}
                          />
                          <button
                            onClick={() => {
                              onDelete(serviceId);
                              setShowDropdown(false);
                            }}
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
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Service Overview */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Service Header Card */}
            <div 
              className="rounded-xl shadow-sm border p-6"
              style={{
                backgroundColor: colors.utility.primaryBackground,
                borderColor: colors.utility.secondaryText + '20'
              }}
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-20 h-20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{
                    backgroundColor: (categoryQuery.data?.hexcolor || colors.brand.primary) + '20',
                    color: categoryQuery.data?.hexcolor || colors.brand.primary
                  }}
                >
                  {categoryQuery.data?.icon || '🛎️'}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h2 
                      className="text-2xl font-bold"
                      style={{ color: colors.utility.primaryText }}
                    >
                      {service.serviceName}
                    </h2>
                    
                    <div className="flex items-center gap-2">
                      {service.isActive && (
                        <span
                          className="px-3 py-1 rounded-full text-sm font-medium"
                          style={{
                            backgroundColor: colors.semantic.success + '20',
                            color: colors.semantic.success
                          }}
                        >
                          Active
                        </span>
                      )}
                      
                      {categoryQuery.data && (
                        <span
                          className="px-3 py-1 rounded-full text-sm font-medium"
                          style={{
                            backgroundColor: (categoryQuery.data.hexcolor || colors.brand.primary) + '20',
                            color: categoryQuery.data.hexcolor || colors.brand.primary
                          }}
                        >
                          {categoryQuery.data.name}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p 
                    className="text-base leading-relaxed mb-4"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    {service.description}
                  </p>
                  
                  {/* Tags */}
                  {service.tags && service.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {service.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm"
                          style={{
                            backgroundColor: colors.utility.secondaryText + '10',
                            color: colors.utility.secondaryText
                          }}
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Resource Requirements */}
            <div 
              className="rounded-xl shadow-sm border"
              style={{
                backgroundColor: colors.utility.primaryBackground,
                borderColor: colors.utility.secondaryText + '20'
              }}
            >
              <div className="p-6 border-b" style={{ borderColor: colors.utility.secondaryText + '20' }}>
                <div className="flex items-center justify-between">
                  <h3 
                    className="text-xl font-semibold"
                    style={{ color: colors.utility.primaryText }}
                  >
                    Resource Requirements
                  </h3>
                  <div 
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: `${colors.semantic.info}20`,
                      color: colors.semantic.info
                    }}
                  >
                    {service.requiredResources?.length || 0} resources
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {!service.requiredResources || service.requiredResources.length === 0 ? (
                  <div className="text-center py-12">
                    <div 
                      className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colors.utility.secondaryText + '10' }}
                    >
                      <Activity className="w-8 h-8" style={{ color: colors.utility.secondaryText }} />
                    </div>
                    <h4 
                      className="text-lg font-medium mb-2"
                      style={{ color: colors.utility.primaryText }}
                    >
                      No Specific Resources Required
                    </h4>
                    <p 
                      className="text-sm"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      This service can be delivered without specific resource requirements.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(groupedResources).map(([typeId, requirements]) => {
                      const typeInfo = getResourceTypeInfo(typeId);
                      return (
                        <div key={typeId}>
                          <div className="flex items-center gap-3 mb-4">
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center"
                              style={{ 
                                backgroundColor: `${colors.brand.primary}20`,
                                color: colors.brand.primary 
                              }}
                            >
                              {typeInfo.icon}
                            </div>
                            <h4 
                              className="text-lg font-medium"
                              style={{ color: colors.utility.primaryText }}
                            >
                              {typeInfo.name}
                            </h4>
                            <span 
                              className="px-2 py-1 rounded-full text-xs"
                              style={{
                                backgroundColor: colors.utility.secondaryText + '15',
                                color: colors.utility.secondaryText
                              }}
                            >
                              {requirements.length} required
                            </span>
                          </div>
                          
                          <div className="space-y-4">
                            {requirements.map((requirement) => (
                              <ResourceRequirementDetailCard
                                key={requirement.id}
                                requirement={requirement}
                                colors={colors}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Service Info */}
          <div className="space-y-6">
            
            {/* Pricing Card */}
            <div 
              className="rounded-xl shadow-sm border p-6"
              style={{
                backgroundColor: colors.utility.primaryBackground,
                borderColor: colors.utility.secondaryText + '20'
              }}
            >
              <h3 
                className="text-lg font-semibold mb-4"
                style={{ color: colors.utility.primaryText }}
              >
                Pricing Information
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span 
                    className="text-sm"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    Base Price
                  </span>
                  <span 
                    className="text-2xl font-bold"
                    style={{ color: colors.semantic.success }}
                  >
                    {formatServicePrice(service.pricingConfig.basePrice, service.pricingConfig.currency)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span 
                    className="text-sm"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    Pricing Type
                  </span>
                  <span 
                    className="text-sm font-medium"
                    style={{ color: colors.utility.primaryText }}
                  >
                    {getPricingTypeLabel(service.pricingConfig.pricingModel)}
                  </span>
                </div>
                
                {service.durationMinutes && (
                  <div className="flex items-center justify-between">
                    <span 
                      className="text-sm"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      Duration
                    </span>
                    <span 
                      className="text-sm font-medium flex items-center gap-1"
                      style={{ color: colors.utility.primaryText }}
                    >
                      <Clock className="w-3 h-3" />
                      {service.durationMinutes} minutes
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Service Metadata */}
            <div 
              className="rounded-xl shadow-sm border p-6"
              style={{
                backgroundColor: colors.utility.primaryBackground,
                borderColor: colors.utility.secondaryText + '20'
              }}
            >
              <h3 
                className="text-lg font-semibold mb-4"
                style={{ color: colors.utility.primaryText }}
              >
                Service Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span 
                    className="text-sm"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    Status
                  </span>
                  <span 
                    className="text-sm font-medium"
                    style={{ 
                      color: service.isActive ? colors.semantic.success : colors.semantic.error 
                    }}
                  >
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span 
                    className="text-sm"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    Visibility
                  </span>
                  <span 
                    className="text-sm font-medium flex items-center gap-1"
                    style={{ color: colors.utility.primaryText }}
                  >
                    {service.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {service.isActive ? 'Public' : 'Private'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span 
                    className="text-sm"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    Created
                  </span>
                  <span 
                    className="text-sm font-medium flex items-center gap-1"
                    style={{ color: colors.utility.primaryText }}
                  >
                    <Calendar className="w-3 h-3" />
                    {new Date(service.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span 
                    className="text-sm"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    Service ID
                  </span>
                  <span 
                    className="text-xs font-mono"
                    style={{ color: colors.utility.primaryText }}
                  >
                    {service.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div 
              className="rounded-xl shadow-sm border p-6"
              style={{
                backgroundColor: colors.utility.primaryBackground,
                borderColor: colors.utility.secondaryText + '20'
              }}
            >
              <h3 
                className="text-lg font-semibold mb-4"
                style={{ color: colors.utility.primaryText }}
              >
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => onEdit(serviceId)}
                  className="w-full px-4 py-3 rounded-lg text-sm font-medium transition-all hover:scale-105 duration-200 flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: colors.brand.primary,
                    color: 'white'
                  }}
                >
                  <Edit className="w-4 h-4" />
                  Edit Service
                </button>
                
                <button
                  onClick={() => onDuplicate?.(serviceId)}
                  className="w-full px-4 py-3 rounded-lg text-sm font-medium transition-all hover:scale-105 duration-200 flex items-center justify-center gap-2 border"
                  style={{
                    backgroundColor: 'transparent',
                    color: colors.utility.primaryText,
                    borderColor: colors.utility.secondaryText + '40'
                  }}
                >
                  <Copy className="w-4 h-4" />
                  Duplicate Service
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-0"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default ServiceDetailsPage;