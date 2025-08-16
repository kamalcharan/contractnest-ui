// src/pages/catalog/CatalogItemDetailPage.tsx
// ✅ COMPLETE DETAIL VIEW - Fixes 404 error for View button

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Copy, 
  ExternalLink, 
  DollarSign, 
  Calendar, 
  User, 
  Clock, 
  Tag, 
  FileText, 
  Settings, 
  AlertTriangle, 
  Loader2,
  Eye,
  MoreVertical,
  Download,
  Share2,
  Archive,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

// Import services and types
import catalogService from '../../services/catalogService';
import { useCatalogDetail, useDeleteCatalogItem } from '../../hooks/queries/useCatalogQueries';
import type { 
  CatalogItemDetailed, 
  CatalogItemType,
  CatalogPricing
} from '../../types/catalogTypes';

import {
  CATALOG_ITEM_TYPES,
  CATALOG_TYPE_LABELS,
  PRICING_TYPE_LABELS,
  BILLING_MODE_LABELS,
  CATALOG_ITEM_STATUS_LABELS,
  CURRENCY_SYMBOLS
} from '../../utils/constants/catalog';

// Import components
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';

const CatalogItemDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { type, itemId } = useParams<{ type: string; itemId: string }>();
  const { isDarkMode, currentTheme } = useTheme();
  
  // Get theme colors
  const colors = isDarkMode ? currentTheme.darkMode.colors : currentTheme.colors;
  
  // Map route type to catalog type
  const mapRouteToCatalogType = (routeType: string): CatalogItemType => {
    const mapping: Record<string, CatalogItemType> = {
      'services': 'service',
      'equipments': 'equipment',
      'assets': 'asset',
      'spare-parts': 'spare_part'
    };
    return mapping[routeType] || 'service';
  };
  
  const catalogType = mapRouteToCatalogType(type || 'services');
  
  // Helper functions
  function getCatalogRoute(catalogTypeParam: CatalogItemType): string {
    const routeMap = {
      [CATALOG_ITEM_TYPES.SERVICE]: '/catalog/services',
      [CATALOG_ITEM_TYPES.EQUIPMENT]: '/catalog/equipments', 
      [CATALOG_ITEM_TYPES.ASSET]: '/catalog/assets',
      [CATALOG_ITEM_TYPES.SPARE_PART]: '/catalog/spare-parts'
    };
    return routeMap[catalogTypeParam] || '/catalog/services';
  }

  function getCatalogInfo() {
    const typeKey = catalogType as keyof typeof CATALOG_TYPE_LABELS;
    return {
      singular: CATALOG_TYPE_LABELS[typeKey]?.slice(0, -1) || 'Item',
      plural: CATALOG_TYPE_LABELS[typeKey] || 'Items'
    };
  }

  const catalogInfo = getCatalogInfo();
  
  // State management
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);
  
  // ✅ Use TanStack Query hook for data fetching
  const { 
    data: item, 
    isLoading, 
    error, 
    isError,
    refetch 
  } = useCatalogDetail(itemId || '');
  
  const deleteMutation = useDeleteCatalogItem();
  
  // Validate parameters
  useEffect(() => {
    if (!type || !itemId) {
      toast.error('Invalid item details');
      navigate('/catalog/services', { replace: true });
      return;
    }
  }, [type, itemId, navigate]);
  
  // Navigation handlers
  const handleBack = () => {
    navigate(getCatalogRoute(catalogType));
  };
  
  const handleEdit = () => {
    navigate(`/catalog/${type}/${itemId}/edit`);
  };
  
  const handleDuplicate = () => {
    // TODO: Implement duplicate functionality
    toast.info('Duplicate functionality coming soon');
  };
  
  const handleDelete = async () => {
    if (!item) return;
    
    try {
      await deleteMutation.mutateAsync(item.id);
      toast.success('Item deleted successfully');
      navigate(getCatalogRoute(catalogType));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };
  
  // Helper functions for display
  const formatPrice = (pricing: CatalogPricing) => {
    const symbol = CURRENCY_SYMBOLS[pricing.currency as keyof typeof CURRENCY_SYMBOLS] || pricing.currency;
    return `${symbol} ${pricing.price.toLocaleString()}`;
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusBadge = (item: CatalogItemDetailed) => {
    const isActive = item.status === 'active' || item.is_active === true;
    return (
      <span 
        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border"
        style={
          isActive 
            ? {
                backgroundColor: `${colors.semantic.success}20`,
                color: colors.semantic.success,
                borderColor: `${colors.semantic.success}40`
              }
            : {
                backgroundColor: `${colors.utility.primaryText}20`,
                color: colors.utility.secondaryText,
                borderColor: `${colors.utility.primaryText}40`
              }
        }
      >
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };
  
  const getTypeIcon = (type: CatalogItemType) => {
    const iconMap = {
      'service': '🛎️',
      'equipment': '⚙️',
      'spare_part': '🔧',
      'asset': '🏢'
    };
    return iconMap[type] || '📋';
  };

  // Loading state
  if (isLoading) {
    return (
      <div 
        className="min-h-screen transition-colors duration-200"
        style={{ backgroundColor: colors.utility.primaryBackground }}
      >
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <Loader2 
                className="h-8 w-8 animate-spin mx-auto"
                style={{ color: colors.brand.primary }}
              />
              <p 
                className="text-lg font-medium transition-colors"
                style={{ color: colors.utility.primaryText }}
              >
                Loading item details...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !item) {
    return (
      <div 
        className="min-h-screen transition-colors duration-200"
        style={{ backgroundColor: colors.utility.primaryBackground }}
      >
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Back Button */}
          <button 
            onClick={handleBack}
            className="flex items-center mb-6 transition-colors hover:opacity-80 text-sm"
            style={{ color: colors.utility.secondaryText }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {catalogInfo.plural}
          </button>
          
          <div 
            className="rounded-lg border p-8 text-center"
            style={{
              backgroundColor: colors.utility.secondaryBackground,
              borderColor: `${colors.semantic.error}20`
            }}
          >
            <AlertTriangle 
              className="h-12 w-12 mx-auto mb-4"
              style={{ color: colors.semantic.error }}
            />
            <h2 
              className="text-xl font-semibold mb-2"
              style={{ color: colors.utility.primaryText }}
            >
              Item Not Found
            </h2>
            <p 
              className="mb-4"
              style={{ color: colors.utility.secondaryText }}
            >
              {error?.message || 'The requested item could not be found.'}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => refetch()}
                className="flex items-center px-4 py-2 border rounded-lg transition-colors hover:opacity-80"
                style={{
                  borderColor: colors.brand.primary,
                  color: colors.brand.primary,
                  backgroundColor: 'transparent'
                }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </button>
              <button
                onClick={handleBack}
                className="px-4 py-2 rounded-lg transition-colors hover:opacity-90 text-white"
                style={{
                  background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
                }}
              >
                Back to List
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen transition-colors duration-200"
      style={{ backgroundColor: colors.utility.primaryBackground }}
    >
      {/* Header */}
      <div 
        className="border-b transition-colors"
        style={{
          backgroundColor: colors.utility.secondaryBackground,
          borderColor: colors.utility.secondaryText + '20'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <button 
            onClick={handleBack}
            className="flex items-center mb-4 transition-colors hover:opacity-80 text-sm"
            style={{ color: colors.utility.secondaryText }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {catalogInfo.plural}
          </button>
          
          {/* Title and Actions */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{getTypeIcon(item.type)}</span>
                <div>
                  <h1 
                    className="text-3xl font-bold transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    {item.name}
                  </h1>
                  <div className="flex items-center gap-3 mt-2">
                    {getStatusBadge(item)}
                    <span 
                      className="text-sm transition-colors"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      Version {item.version_number || 1}
                    </span>
                    <span 
                      className="text-sm transition-colors"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      {CATALOG_TYPE_LABELS[item.type]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={handleEdit}
                className="flex items-center px-4 py-2 rounded-lg transition-colors hover:opacity-90 text-white"
                style={{
                  background: `linear-gradient(to right, ${colors.brand.primary}, ${colors.brand.secondary})`
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
              
              {/* More Actions Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowMoreActions(!showMoreActions)}
                  className="p-2 border rounded-lg transition-colors hover:opacity-80"
                  style={{
                    borderColor: colors.utility.secondaryText + '40',
                    color: colors.utility.primaryText,
                    backgroundColor: colors.utility.secondaryBackground
                  }}
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                
                {showMoreActions && (
                  <div 
                    className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg border z-10"
                    style={{
                      backgroundColor: colors.utility.secondaryBackground,
                      borderColor: colors.utility.secondaryText + '20'
                    }}
                  >
                    <div className="py-1">
                      <button
                        onClick={handleDuplicate}
                        className="w-full px-4 py-2 text-sm text-left hover:opacity-80 flex items-center transition-colors"
                        style={{ color: colors.utility.primaryText }}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </button>
                      <button
                        className="w-full px-4 py-2 text-sm text-left hover:opacity-80 flex items-center transition-colors"
                        style={{ color: colors.utility.primaryText }}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </button>
                      <button
                        className="w-full px-4 py-2 text-sm text-left hover:opacity-80 flex items-center transition-colors"
                        style={{ color: colors.utility.primaryText }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </button>
                      <hr 
                        className="my-1"
                        style={{ borderColor: colors.utility.secondaryText + '20' }}
                      />
                      <button
                        onClick={() => setShowDeleteDialog(true)}
                        className="w-full px-4 py-2 text-sm text-left hover:opacity-80 flex items-center transition-colors"
                        style={{ color: colors.semantic.error }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Description */}
            <div 
              className="rounded-xl shadow-sm border transition-colors"
              style={{
                backgroundColor: colors.utility.secondaryBackground,
                borderColor: colors.utility.secondaryText + '20'
              }}
            >
              <div className="p-6">
                <h2 
                  className="text-lg font-semibold mb-4 flex items-center gap-2 transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  <FileText className="w-5 h-5" />
                  Description
                </h2>
                {item.description_content || item.short_description ? (
                  <div 
                    className="prose max-w-none transition-colors"
                    style={{ color: colors.utility.primaryText }}
                    dangerouslySetInnerHTML={{ 
                      __html: item.description_content || item.short_description || '' 
                    }}
                  />
                ) : (
                  <p 
                    className="italic transition-colors"
                    style={{ color: colors.utility.secondaryText }}
                  >
                    No description provided
                  </p>
                )}
              </div>
            </div>

            {/* Service Terms */}
            {item.terms_content && (
              <div 
                className="rounded-xl shadow-sm border transition-colors"
                style={{
                  backgroundColor: colors.utility.secondaryBackground,
                  borderColor: colors.utility.secondaryText + '20'
                }}
              >
                <div className="p-6">
                  <h2 
                    className="text-lg font-semibold mb-4 flex items-center gap-2 transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    <Settings className="w-5 h-5" />
                    Terms & Conditions
                  </h2>
                  <div 
                    className="prose max-w-none transition-colors"
                    style={{ color: colors.utility.primaryText }}
                    dangerouslySetInnerHTML={{ __html: item.terms_content }}
                  />
                </div>
              </div>
            )}

            {/* Pricing Details */}
            {item.pricing_list && item.pricing_list.length > 0 && (
              <div 
                className="rounded-xl shadow-sm border transition-colors"
                style={{
                  backgroundColor: colors.utility.secondaryBackground,
                  borderColor: colors.utility.secondaryText + '20'
                }}
              >
                <div className="p-6">
                  <h2 
                    className="text-lg font-semibold mb-4 flex items-center gap-2 transition-colors"
                    style={{ color: colors.utility.primaryText }}
                  >
                    <DollarSign className="w-5 h-5" />
                    Pricing Details
                  </h2>
                  
                  <div className="space-y-4">
                    {item.pricing_list.map((pricing, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg border"
                        style={{
                          backgroundColor: pricing.is_base_currency 
                            ? `${colors.brand.primary}10` 
                            : colors.utility.primaryBackground,
                          borderColor: pricing.is_base_currency 
                            ? colors.brand.primary + '40' 
                            : colors.utility.secondaryText + '20'
                        }}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span 
                              className="font-semibold transition-colors"
                              style={{ color: colors.utility.primaryText }}
                            >
                              {formatPrice(pricing)}
                            </span>
                            {pricing.is_base_currency && (
                              <span 
                                className="px-2 py-0.5 text-xs rounded-full transition-colors"
                                style={{
                                  backgroundColor: colors.brand.primary,
                                  color: 'white'
                                }}
                              >
                                Base
                              </span>
                            )}
                          </div>
                          <p 
                            className="text-sm mt-1 transition-colors"
                            style={{ color: colors.utility.secondaryText }}
                          >
                            {PRICING_TYPE_LABELS[item.price_attributes?.type || 'fixed']}
                            {pricing.tax_included && ' (Tax Included)'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            
            {/* Item Information */}
            <div 
              className="rounded-xl shadow-sm border transition-colors"
              style={{
                backgroundColor: colors.utility.secondaryBackground,
                borderColor: colors.utility.secondaryText + '20'
              }}
            >
              <div className="p-6">
                <h3 
                  className="text-lg font-semibold mb-4 transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  Item Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label 
                      className="block text-sm font-medium mb-1 transition-colors"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      Type
                    </label>
                    <p 
                      className="transition-colors"
                      style={{ color: colors.utility.primaryText }}
                    >
                      {CATALOG_TYPE_LABELS[item.type]}
                    </p>
                  </div>
                  
                  <div>
                    <label 
                      className="block text-sm font-medium mb-1 transition-colors"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      Status
                    </label>
                    <div>
                      {getStatusBadge(item)}
                    </div>
                  </div>
                  
                  <div>
                    <label 
                      className="block text-sm font-medium mb-1 transition-colors"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      Version
                    </label>
                    <p 
                      className="transition-colors"
                      style={{ color: colors.utility.primaryText }}
                    >
                      {item.version_number || 1}
                    </p>
                  </div>
                  
                  {item.price_attributes && (
                    <div>
                      <label 
                        className="block text-sm font-medium mb-1 transition-colors"
                        style={{ color: colors.utility.secondaryText }}
                      >
                        Pricing Type
                      </label>
                      <p 
                        className="transition-colors"
                        style={{ color: colors.utility.primaryText }}
                      >
                        {PRICING_TYPE_LABELS[item.price_attributes.type]}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div 
              className="rounded-xl shadow-sm border transition-colors"
              style={{
                backgroundColor: colors.utility.secondaryBackground,
                borderColor: colors.utility.secondaryText + '20'
              }}
            >
              <div className="p-6">
                <h3 
                  className="text-lg font-semibold mb-4 flex items-center gap-2 transition-colors"
                  style={{ color: colors.utility.primaryText }}
                >
                  <Clock className="w-5 h-5" />
                  Timeline
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label 
                      className="block text-sm font-medium mb-1 transition-colors"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      Created
                    </label>
                    <p 
                      className="text-sm transition-colors"
                      style={{ color: colors.utility.primaryText }}
                    >
                      {formatDate(item.created_at)}
                    </p>
                  </div>
                  
                  <div>
                    <label 
                      className="block text-sm font-medium mb-1 transition-colors"
                      style={{ color: colors.utility.secondaryText }}
                    >
                      Last Updated
                    </label>
                    <p 
                      className="text-sm transition-colors"
                      style={{ color: colors.utility.primaryText }}
                    >
                      {formatDate(item.updated_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Catalog Item"
        description={
          <div>
            <p>Are you sure you want to delete "{item?.name}"?</p>
            <p className="mt-2 text-sm opacity-80">This action cannot be undone.</p>
          </div>
        }
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        icon={<Trash2 className="h-6 w-6" />}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default CatalogItemDetailPage;