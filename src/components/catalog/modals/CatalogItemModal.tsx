// src/components/catalog/modals/CatalogItemModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Package, Settings, Box, Wrench, AlertCircle, Info } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { useTaxRates } from '../../../hooks/useTaxRates';
import { useTaxDisplay } from '../../../hooks/useTaxDisplay';
import { 
  CATALOG_ITEM_TYPES,
  CATALOG_ITEM_TYPE_LABELS,
  CATALOG_ITEM_TYPE_COLORS,
  CATALOG_ITEM_STATUS,
  CATALOG_ITEM_STATUS_LABELS,
  PRICING_TYPES,
  PRICING_TYPE_LABELS,
  BILLING_MODES,
  BILLING_MODE_LABELS,
  RECOMMENDED_PRICING_BY_TYPE,
  CATALOG_VALIDATION_LIMITS,
  CATALOG_ERROR_MESSAGES
} from '../../../utils/constants/catalog';
import type { 
  CatalogItemDetailed, 
  CatalogItemType,
  CreateCatalogItemRequest,
  UpdateCatalogItemRequest 
} from '../../../types/catalogTypes';

interface CatalogItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  catalogType: CatalogItemType;
  item?: CatalogItemDetailed | null;
  onSave: (data: CreateCatalogItemRequest | UpdateCatalogItemRequest) => void;
}

interface FormData extends CreateCatalogItemRequest {
  version_reason?: string;
}

const CatalogItemModal: React.FC<CatalogItemModalProps> = ({
  isOpen,
  onClose,
  catalogType,
  item,
  onSave
}) => {
  const { isDarkMode } = useTheme();
  
  // Tax hooks - wrapped in try-catch to prevent errors
  let taxRatesState = { data: [] };
  let taxDisplayState = { data: null };
  
  try {
    const taxRates = useTaxRates();
    taxRatesState = taxRates.state || { data: [] };
  } catch (error) {
    console.warn('Tax rates hook not available:', error);
  }
  
  try {
    const taxDisplay = useTaxDisplay();
    taxDisplayState = taxDisplay.state || { data: null };
  } catch (error) {
    console.warn('Tax display hook not available:', error);
  }
  
  const isEditMode = !!item;
  const modalTitle = isEditMode 
    ? `Edit ${CATALOG_ITEM_TYPE_LABELS[catalogType].slice(0, -1)}`
    : `Add New ${CATALOG_ITEM_TYPE_LABELS[catalogType].slice(0, -1)}`;
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    type: catalogType,
    short_description: '',
    description_content: '',
    description_format: 'markdown',
    price_attributes: {
      type: PRICING_TYPES.FIXED,
      base_amount: 0,
      currency: 'INR',
      billing_mode: BILLING_MODES.MANUAL
    },
    tax_config: {
      use_tenant_default: true,
      specific_tax_rates: []
    },
    status: CATALOG_ITEM_STATUS.ACTIVE,
    is_live: true,
    version_reason: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Initialize form data when item changes
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        type: item.type,
        short_description: item.short_description || '',
        description_content: item.description_content || '',
        description_format: item.description_format,
        price_attributes: item.price_attributes,
        tax_config: item.tax_config,
        status: item.status,
        is_live: item.is_live,
        version_reason: ''
      });
    } else {
      // Reset to defaults for new item
      setFormData({
        name: '',
        type: catalogType,
        short_description: '',
        description_content: '',
        description_format: 'markdown',
        price_attributes: {
          type: RECOMMENDED_PRICING_BY_TYPE[catalogType]?.[0] || PRICING_TYPES.FIXED,
          base_amount: 0,
          currency: 'INR',
          billing_mode: BILLING_MODES.MANUAL
        },
        tax_config: {
          use_tenant_default: true,
          specific_tax_rates: []
        },
        status: CATALOG_ITEM_STATUS.ACTIVE,
        is_live: true,
        version_reason: ''
      });
    }
    setErrors({});
  }, [item, catalogType]);
  
  // Get icon based on catalog type
  const getIcon = () => {
    switch (catalogType) {
      case CATALOG_ITEM_TYPES.SERVICE:
        return Package;
      case CATALOG_ITEM_TYPES.EQUIPMENT:
        return Settings;
      case CATALOG_ITEM_TYPES.ASSET:
        return Box;
      case CATALOG_ITEM_TYPES.SPARE_PART:
        return Wrench;
      default:
        return Package;
    }
  };
  
  const Icon = getIcon();
  const catalogColor = CATALOG_ITEM_TYPE_COLORS[catalogType];
  
  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Basic validation
    if (!formData.name.trim()) {
      newErrors.name = CATALOG_ERROR_MESSAGES.REQUIRED_FIELD;
    } else if (formData.name.length < CATALOG_VALIDATION_LIMITS.NAME.MIN_LENGTH) {
      newErrors.name = CATALOG_ERROR_MESSAGES.NAME_TOO_SHORT;
    } else if (formData.name.length > CATALOG_VALIDATION_LIMITS.NAME.MAX_LENGTH) {
      newErrors.name = CATALOG_ERROR_MESSAGES.NAME_TOO_LONG;
    }
    
    if (formData.short_description && formData.short_description.length > CATALOG_VALIDATION_LIMITS.SHORT_DESCRIPTION.MAX_LENGTH) {
      newErrors.short_description = 'Short description is too long';
    }
    
    // Pricing validation
    if (formData.price_attributes.base_amount < CATALOG_VALIDATION_LIMITS.PRICE.MIN_VALUE) {
      newErrors.base_amount = CATALOG_ERROR_MESSAGES.PRICE_TOO_LOW;
    } else if (formData.price_attributes.base_amount > CATALOG_VALIDATION_LIMITS.PRICE.MAX_VALUE) {
      newErrors.base_amount = CATALOG_ERROR_MESSAGES.PRICE_TOO_HIGH;
    }
    
    // Version reason required for edits
    if (isEditMode && !formData.version_reason?.trim()) {
      newErrors.version_reason = CATALOG_ERROR_MESSAGES.VERSION_REASON_REQUIRED;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle save
  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    
    const dataToSave = { ...formData };
    
    // Remove fields that shouldn't be sent
    if (!isEditMode) {
      delete dataToSave.version_reason;
    }
    
    onSave(dataToSave);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-xl shadow-2xl ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${
                catalogColor === 'purple' ? 'from-purple-600 to-purple-700' :
                catalogColor === 'orange' ? 'from-orange-600 to-orange-700' :
                catalogColor === 'green' ? 'from-green-600 to-green-700' :
                'from-gray-600 to-gray-700'
              } rounded-lg flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h2 className={`text-xl font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {modalTitle}
              </h2>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-400' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Basic Information Section */}
            <div>
              <h3 className={`text-sm font-medium mb-4 flex items-center ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <Info className="w-4 h-4 mr-2" />
                Basic Information
              </h3>
              
              {/* Name */}
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                    errors.name
                      ? 'border-red-500 focus:ring-red-500'
                      : isDarkMode
                        ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500'
                        : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                  placeholder={`Enter ${CATALOG_ITEM_TYPE_LABELS[catalogType].toLowerCase().slice(0, -1)} name`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>
              
              {/* Short Description */}
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Short Description
                </label>
                <textarea
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  rows={2}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                    errors.short_description
                      ? 'border-red-500 focus:ring-red-500'
                      : isDarkMode
                        ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500'
                        : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                  placeholder="Brief description for listings"
                />
                {errors.short_description && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.short_description}
                  </p>
                )}
              </div>
              
              {/* Status */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                    isDarkMode
                      ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500'
                      : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                >
                  {Object.values(CATALOG_ITEM_STATUS).map((status) => (
                    <option key={status} value={status}>
                      {CATALOG_ITEM_STATUS_LABELS[status]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Pricing Section */}
            <div className={`border-t pt-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-sm font-medium mb-4 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Pricing Information
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Pricing Type */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Pricing Type
                  </label>
                  <select
                    value={formData.price_attributes.type}
                    onChange={(e) => setFormData({
                      ...formData,
                      price_attributes: {
                        ...formData.price_attributes,
                        type: e.target.value as any
                      }
                    })}
                    className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                      isDarkMode
                        ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500'
                        : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                  >
                    {RECOMMENDED_PRICING_BY_TYPE[catalogType]?.map((type) => (
                      <option key={type} value={type}>
                        {PRICING_TYPE_LABELS[type]}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Base Amount */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.price_attributes.base_amount}
                    onChange={(e) => setFormData({
                      ...formData,
                      price_attributes: {
                        ...formData.price_attributes,
                        base_amount: parseFloat(e.target.value) || 0
                      }
                    })}
                    className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                      errors.base_amount
                        ? 'border-red-500 focus:ring-red-500'
                        : isDarkMode
                          ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500'
                          : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                  {errors.base_amount && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.base_amount}
                    </p>
                  )}
                </div>
                
                {/* Billing Mode */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Billing Mode
                  </label>
                  <select
                    value={formData.price_attributes.billing_mode}
                    onChange={(e) => setFormData({
                      ...formData,
                      price_attributes: {
                        ...formData.price_attributes,
                        billing_mode: e.target.value as any
                      }
                    })}
                    className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                      isDarkMode
                        ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500'
                        : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                  >
                    {Object.values(BILLING_MODES).map((mode) => (
                      <option key={mode} value={mode}>
                        {BILLING_MODE_LABELS[mode]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Tax Configuration */}
              <div className="mt-4">
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Tax Configuration
                </label>
                <div className={`p-4 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700/50 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.tax_config.use_tenant_default}
                      onChange={(e) => setFormData({
                        ...formData,
                        tax_config: {
                          ...formData.tax_config,
                          use_tenant_default: e.target.checked
                        }
                      })}
                      className={`rounded border transition-colors ${
                        isDarkMode 
                          ? 'border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500' 
                          : 'border-gray-300 text-blue-600 focus:ring-blue-500'
                      }`}
                    />
                    <span className={`ml-2 text-sm ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Use tenant default tax settings
                    </span>
                  </label>
                  
                  {taxDisplayState.data && (
                    <p className={`mt-2 text-xs ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Current mode: {taxDisplayState.data.display_mode === 'including_tax' 
                        ? 'Prices include tax' 
                        : 'Prices exclude tax'}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Version Reason (Edit Mode Only) */}
            {isEditMode && (
              <div className={`border-t pt-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>
                  Reason for Update <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.version_reason}
                  onChange={(e) => setFormData({ ...formData, version_reason: e.target.value })}
                  rows={2}
                  className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                    errors.version_reason
                      ? 'border-red-500 focus:ring-red-500'
                      : isDarkMode
                        ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-500'
                        : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-opacity-20`}
                  placeholder="Describe what changed in this version"
                />
                {errors.version_reason && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.version_reason}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className={`px-6 py-4 border-t ${
          isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className={`px-6 py-2 bg-gradient-to-r ${
                catalogColor === 'purple' ? 'from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800' :
                catalogColor === 'orange' ? 'from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800' :
                catalogColor === 'green' ? 'from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' :
                'from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'
              } text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl`}
            >
              {isEditMode ? 'Update' : 'Create'} {CATALOG_ITEM_TYPE_LABELS[catalogType].slice(0, -1)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogItemModal;