// src/pages/catalog/CatalogItemFormPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, Clock, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { API_ENDPOINTS } from '../../services/serviceURLs';
import { 
  CATALOG_ITEM_TYPES, 
  PRICING_TYPES, 
  SUPPORTED_CURRENCIES,
  CURRENCY_SYMBOLS,
  CATALOG_TYPE_LABELS,
  PRICING_TYPE_TO_API,
  CATALOG_TYPE_TO_API
} from '../../utils/constants/catalog';
import { TabbedFormSkeleton } from '../../components/common/skeletons';
import type { 
  CatalogItemType, 
  CatalogItemDetailed
} from '../../types/catalogTypes';

interface PricingCurrency {
  currency: string;
  price: number;
  is_base_currency: boolean;
  tax_included: boolean;
}

interface CatalogItemFormPageProps {
  mode: 'add' | 'edit';
}

export const CatalogItemFormPage: React.FC<CatalogItemFormPageProps> = ({ mode }) => {
  const navigate = useNavigate();
  const { type, id } = useParams<{ type: string; id: string }>();
  
  const isEditMode = mode === 'edit';
  const pageTitle = isEditMode ? 'Edit' : 'Add New';
  
  const [activeTab, setActiveTab] = useState<'basic' | 'pricing' | 'tax' | 'history'>('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [catalogItem, setCatalogItem] = useState<CatalogItemDetailed | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    catalog_type: number;
    name: string;
    description: string;
    service_terms: string;
    price_type: string;
    currencies: PricingCurrency[];
    version_reason: string;
  }>({
    catalog_type: type ? CATALOG_TYPE_TO_API[type as CatalogItemType] : 1,
    name: '',
    description: '',
    service_terms: '',
    price_type: PRICING_TYPE_TO_API[PRICING_TYPES.FIXED],
    currencies: [
      {
        currency: 'INR',
        price: 0,
        is_base_currency: true,
        tax_included: false
      }
    ],
    version_reason: ''
  });

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validate catalog type from URL
  useEffect(() => {
    if (type && !Object.values(CATALOG_ITEM_TYPES).includes(type as CatalogItemType)) {
      navigate('/catalog');
    }
  }, [type, navigate]);

  // Load catalog item in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      loadCatalogItem();
    }
  }, [isEditMode, id]);

  const loadCatalogItem = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      // Get catalog item details
      const response = await api.get(API_ENDPOINTS.CATALOG.GET(id));
      const item = response.data.data || response.data;
      setCatalogItem(item);

      // Get pricing details
      const pricingResponse = await api.get(API_ENDPOINTS.CATALOG.PRICING.GET_MULTI(id));
      const pricingData = pricingResponse.data;
      
      // Populate form
      setFormData({
        catalog_type: item.catalog_type,
        name: item.name || '',
        description: item.description || '',
        service_terms: item.service_terms || '',
        price_type: pricingData.pricing_list?.[0]?.price_type || 'Fixed',
        currencies: (pricingData.pricing_list || []).map((p: any) => ({
          currency: p.currency,
          price: p.price,
          is_base_currency: p.is_base_currency || false,
          tax_included: p.tax_included || false
        })),
        version_reason: ''
      });
    } catch (error: any) {
      console.error('Error loading catalog item:', error);
      toast.error('Failed to load catalog item', {
        duration: 3000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#EF4444',
          color: '#FFF',
          fontSize: '14px',
        },
      });
      navigate(-1);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Basic validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    // Version reason for edits
    if (isEditMode) {
      const hasChanges = 
        formData.name !== catalogItem?.name ||
        formData.description !== catalogItem?.description ||
        formData.service_terms !== catalogItem?.service_terms;

      if (hasChanges && !formData.version_reason.trim()) {
        newErrors.version_reason = 'Please provide a reason for this update';
      }
    }

    // Pricing validation
    if (formData.currencies.length === 0) {
      newErrors.currencies = 'At least one currency is required';
    }

    const baseCurrencies = formData.currencies.filter(c => c.is_base_currency);
    if (baseCurrencies.length === 0) {
      newErrors.base_currency = 'One currency must be marked as base';
    } else if (baseCurrencies.length > 1) {
      newErrors.base_currency = 'Only one base currency is allowed';
    }

    formData.currencies.forEach((curr, index) => {
      if (curr.price < 0) {
        newErrors[`price_${index}`] = 'Price must be non-negative';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCurrency = () => {
    const usedCurrencies = formData.currencies.map(c => c.currency);
    const availableCurrencies = SUPPORTED_CURRENCIES.filter(c => !usedCurrencies.includes(c));
    
    if (availableCurrencies.length > 0) {
      setFormData({
        ...formData,
        currencies: [
          ...formData.currencies,
          {
            currency: availableCurrencies[0],
            price: 0,
            is_base_currency: false,
            tax_included: false
          }
        ]
      });
    }
  };

  const handleRemoveCurrency = (index: number) => {
    const currency = formData.currencies[index];
    if (currency.is_base_currency && formData.currencies.length > 1) {
      toast.error('Cannot remove base currency. Set another currency as base first.', {
        duration: 3000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#EF4444',
          color: '#FFF',
          fontSize: '14px',
        },
      });
      return;
    }

    setFormData({
      ...formData,
      currencies: formData.currencies.filter((_, i) => i !== index)
    });
  };

  const handleSetBaseCurrency = (index: number) => {
    setFormData({
      ...formData,
      currencies: formData.currencies.map((curr, i) => ({
        ...curr,
        is_base_currency: i === index
      }))
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting', {
        duration: 3000,
        style: {
          padding: '16px',
          borderRadius: '8px',
          background: '#EF4444',
          color: '#FFF',
          fontSize: '14px',
        },
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let catalogId = id;

      if (isEditMode) {
        // Update catalog item (creates new version)
        await api.put(API_ENDPOINTS.CATALOG.UPDATE(id!), {
          name: formData.name,
          description: formData.description,
          service_terms: formData.service_terms,
          version_reason: formData.version_reason
        });
      } else {
        // Create catalog item
        const catalogResponse = await api.post(API_ENDPOINTS.CATALOG.CREATE, {
          catalog_type: formData.catalog_type,
          name: formData.name,
          description: formData.description,
          service_terms: formData.service_terms
        });
        catalogId = catalogResponse.data.data?.catalog_id || catalogResponse.data.catalog_id;
      }

      // Create/Update multi-currency pricing
      await api.post(API_ENDPOINTS.CATALOG.PRICING.UPSERT(catalogId!), {
        price_type: formData.price_type,
        currencies: formData.currencies
      });

      toast.success(
        `Catalog item ${isEditMode ? 'updated' : 'created'} successfully`,
        {
          duration: 3000,
          style: {
            padding: '16px',
            borderRadius: '8px',
            background: '#10B981',
            color: '#FFF',
            fontSize: '14px',
          },
        }
      );
      
      navigate(`/catalog/${type || 'service'}`);
    } catch (error: any) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} catalog item:`, error);
      toast.error(
        error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} catalog item`,
        {
          duration: 4000,
          style: {
            padding: '16px',
            borderRadius: '8px',
            background: '#EF4444',
            color: '#FFF',
            fontSize: '14px',
          },
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <TabbedFormSkeleton tabs={isEditMode ? 4 : 3} showActions />
      </div>
    );
  }

  const tabs = [
    { id: 'basic', label: 'Basic Information' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'tax', label: 'Tax Configuration' },
    ...(isEditMode ? [{ id: 'history', label: 'Version History' }] : [])
  ];

  const itemLabel = type ? CATALOG_TYPE_LABELS[type as CatalogItemType] : 'Item';

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {pageTitle} {isEditMode ? catalogItem?.name : itemLabel}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {isEditMode ? 'Update' : 'Create a new'} catalog item with pricing information
            </p>
          </div>
          {isEditMode && catalogItem && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4 mr-1" />
              Version {catalogItem.version || 1}
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Basic Information Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`
                    w-full px-3 py-2 border rounded-md
                    ${errors.name
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                    }
                    dark:bg-gray-700 dark:border-gray-600 dark:text-white
                  `}
                  placeholder="Enter catalog item name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className={`
                    w-full px-3 py-2 border rounded-md
                    ${errors.description
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                    }
                    dark:bg-gray-700 dark:border-gray-600 dark:text-white
                  `}
                  placeholder="Enter detailed description"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Service Terms
                </label>
                <textarea
                  value={formData.service_terms}
                  onChange={(e) => setFormData({ ...formData, service_terms: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter service terms (optional)"
                />
              </div>

              {isEditMode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Version Reason *
                  </label>
                  <input
                    type="text"
                    value={formData.version_reason}
                    onChange={(e) => setFormData({ ...formData, version_reason: e.target.value })}
                    className={`
                      w-full px-3 py-2 border rounded-md
                      ${errors.version_reason
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                      }
                      dark:bg-gray-700 dark:border-gray-600 dark:text-white
                    `}
                    placeholder="Describe what changed in this update"
                  />
                  {errors.version_reason && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.version_reason}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Pricing Tab */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pricing Type
                </label>
                <select
                  value={formData.price_type}
                  onChange={(e) => setFormData({ ...formData, price_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="Fixed">Fixed Price</option>
                  <option value="Unit Price">Per Unit</option>
                  <option value="Hourly">Hourly Rate</option>
                  <option value="Daily">Daily Rate</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Currency Pricing
                  </label>
                  {formData.currencies.length < SUPPORTED_CURRENCIES.length && (
                    <button
                      type="button"
                      onClick={handleAddCurrency}
                      className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Currency
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {formData.currencies.map((currency, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <select
                        value={currency.currency}
                        onChange={(e) => {
                          const newCurrencies = [...formData.currencies];
                          newCurrencies[index].currency = e.target.value;
                          setFormData({ ...formData, currencies: newCurrencies });
                        }}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      >
                        {SUPPORTED_CURRENCIES.map(curr => (
                          <option key={curr} value={curr}>
                            {curr} ({CURRENCY_SYMBOLS[curr]})
                          </option>
                        ))}
                      </select>

                      <div className="flex-1">
                        <input
                          type="number"
                          value={currency.price}
                          onChange={(e) => {
                            const newCurrencies = [...formData.currencies];
                            newCurrencies[index].price = parseFloat(e.target.value) || 0;
                            setFormData({ ...formData, currencies: newCurrencies });
                          }}
                          className={`
                            w-full px-3 py-2 border rounded-md
                            ${errors[`price_${index}`]
                              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                              : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                            }
                            dark:bg-gray-600 dark:border-gray-500 dark:text-white
                          `}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSetBaseCurrency(index)}
                        className={`
                          px-3 py-2 text-sm rounded-md transition-colors
                          ${currency.is_base_currency
                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300'
                          }
                        `}
                      >
                        {currency.is_base_currency ? 'Base' : 'Set as Base'}
                      </button>

                      {formData.currencies.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCurrency(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {errors.currencies && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.currencies}</p>
                )}
                {errors.base_currency && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.base_currency}</p>
                )}
              </div>
            </div>
          )}

          {/* Tax Configuration Tab */}
          {activeTab === 'tax' && (
            <div className="space-y-6">
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p>Tax configuration will be available in a future update</p>
              </div>
            </div>
          )}

          {/* Version History Tab - Only in Edit Mode */}
          {isEditMode && activeTab === 'history' && (
            <div className="space-y-6">
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Version history will be displayed here</p>
                <p className="text-sm mt-2">Track all changes and restore previous versions</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditMode ? 'Update' : 'Create'} Item
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export wrapper components for cleaner imports
export const AddCatalogItemPage = () => <CatalogItemFormPage mode="add" />;
export const EditCatalogItemPage = () => <CatalogItemFormPage mode="edit" />;

export default CatalogItemFormPage;